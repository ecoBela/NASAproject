const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27, 2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

let latestFlightNumber = 100;

launches.set(launches.flightNumber, launch);

function addNewLaunch(launch) {
  latestFlightNumber++;

  return launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      mission: launch.mission,
      rocket: launch.rocket,
      launchDate: new Date(launch.launchDate),
      target: launch.target,
      customers: ["ZTM", "NASA"],
      upcoming: true,
      success: true,
      flightNumber: latestFlightNumber,
    })
  );
}

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function abortWithLaunchId(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

function getAllLaunches() {
  return Array.from(launches.values());
}

module.exports = {
  addNewLaunch,
  existsLaunchWithId,
  abortWithLaunchId,
  getAllLaunches,
};
