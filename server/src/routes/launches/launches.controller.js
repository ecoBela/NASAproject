const {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortWithLaunchId,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
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
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id);
  const existsLaunch = await existsLaunchWithId(launchId);
  if (!existsLaunch) {
    return res.status(404).json({
      error: "launch not found",
    });
  }
  const aborted = await abortWithLaunchId(launchId);

  if (!aborted) {
    return res.status(400).json({
      error: "launch not aborted",
    });
  }
  return res.status(200).json({ ok: true });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
