const request = require("supertest");
const app = require("../../app");

describe("test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("test POST /launches", () => {
  const completeLaunchData = {
    mission: "test mission",
    rocket: "test rocket",
    target: "test planet",
    launchDate: "January 28, 2030",
  };

  const launchDataWithoutDate = {
    mission: "test mission",
    rocket: "test rocket",
    target: "test planet",
  };

  test("it should respond with 201 created", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestLaunchDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseLaunchDate = new Date(response.body.launchDate).valueOf();
    expect(responseLaunchDate).toBe(requestLaunchDate);
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });
  test("it should catch missing required properties", () => {});
  test("it should catch invalid dates", () => {});
});
