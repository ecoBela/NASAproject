const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.model");

describe("Launches API", () => {
  // These tests will create and delete data. Normally we would want to use a test database but
  // as this is just a personal project, we can use the main database
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("test GET /v1/launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("test POST /v1/launches", () => {
    const completeLaunchData = {
      mission: "test mission",
      rocket: "test rocket",
      target: "Kepler-1652 b",
      launchDate: "January 28, 2030",
    };

    const launchDataWithoutDate = {
      mission: "test mission",
      rocket: "test rocket",
      target: "Kepler-1652 b",
    };

    const launchDataWithInvalidDate = {
      mission: "test mission",
      rocket: "test rocket",
      target: "Kepler-1652 b",
      launchDate: "Mango",
    };

    test("it should respond with 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestLaunchDate = new Date(
        completeLaunchData.launchDate
      ).valueOf();
      const responseLaunchDate = new Date(response.body.launchDate).valueOf();
      expect(responseLaunchDate).toBe(requestLaunchDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
    });
    test("it should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "missing required launch property",
      });
    });
    test("it should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({ error: "Invalid launch date" });
    });
  });
});
