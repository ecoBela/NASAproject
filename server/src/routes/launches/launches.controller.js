const { getAllLaunches, addNewLaunch } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  const launch = req.body;
  const { mission, rocket, target } = launch;
  let { launchDate } = launch;

  if (!mission || !launchDate || !rocket || !target) {
    return res.status(400).json({
      error: "missing required launch property",
    });
  }
  launchDate = new Date(launchDate);
  if (isNaN(launchDate)) {
    return res.status(400).json({
      error: "Invalid launch date",
    });
  }
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch };
