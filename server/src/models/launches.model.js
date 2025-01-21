const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const launch = {
  flightNumber: 100, // flight_number
  mission: "Kepler Exploration X", // name
  rocket: "Explorer IS1", // rocket.name
  launchDate: new Date("December 27, 2030"), //date_local
  target: "Kepler-442 b", // not applicable
  customers: ["ZTM", "NASA"], // payload.customers for each payload
  upcoming: true, //upcoming
  success: true, //success
};

const DEFAULT_FLIGHT_NUMBER = 100;

saveLaunch(launch);

async function loadLaunchesData() {
  const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";
  const response = await axios.post(
    "https://api.spacexdata.com/v4/launches/query",
    {
      query: {},
      options: {
        populate: [
          { path: "rocket", select: { name: 1 } },
          { path: "payloads", select: { customers: 1 } },
        ],
      },
    }
  );
  console.log("Downloading launch data...");
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customers,
    };
    console.log(`${launch.flightNumber} ${launch.mission}`);
  }
}

async function getLastestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne().sort("-flightNumber");
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER + 1;
  }

  return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = (await getLastestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function existsLaunchWithId(launchId) {
  return await launchesDatabase.findOne({ flightNumber: launchId });
}

async function abortWithLaunchId(launchId) {
  const aborted = await launchesDatabase.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );
  return aborted.modifiedCount === 1;
}

async function getAllLaunches() {
  return await launchesDatabase.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({ keplerName: launch.target });

  if (!planet) {
    throw new Error("No matching planet was found");
  }
  await launchesDatabase.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

module.exports = {
  loadLaunchesData,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortWithLaunchId,
  getAllLaunches,
};
