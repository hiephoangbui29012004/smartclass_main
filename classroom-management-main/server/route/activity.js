require("dotenv").config();

const express = require("express");
const router = new express.Router();
const db = require("../models");
const nodeExcel = require("excel-export");
const Activity = db.activity;
const Video = db.video;
const VideoActivity = db.videoActivities;
//@route get /api/action/
//@desp get all account
//@private access
router.get("/", async (req, res) => {
  try {
    const activity = await Activity.findAll();
    res.json({
      success: true,
      message: "Success",
      data: activity,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route GET /api/action/:activityId/videos
//@desp Get all videos for a specific activity
//@private access
router.get("/:activityId/videos", async (req, res) => {
  try {
    const videos = await Video.findAll({
      include: [
        {
          model: VideoActivity,
          where: { activity_id: req.params.activityId },
        },
      ],
    });

    res.json({
      success: true,
      message: "Success",
      data: videos,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route get /api/action/export
//@desp export action to excel
//@private access
router.get("/export", async (req, res) => {
  try {
    const activity = await Activity.findAll();

    let conf = {};
    conf.name = "mysheet";

    conf.cols = [
      { caption: "name", type: "string" },
      { description: "description", type: "string" },
      { sample: "sample", type: "string" },
    ];
    conf.rows = activity.map((item) => {
      return [item.name, item.description || "", item.sample || ""];
    });
    const excel = nodeExcel.execute(conf);
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Activities.xlsx"
    );
    res.end(excel, "binary");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route post /api/action/
//@desp create new action
//@private access
router.post("/", async (req, res) => {
  const { name, description, sample, accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Missing any field!" });
  }
  try {
    const activity = await Activity.findOne({
      where: { name },
    });
    if (activity) {
      return res
        .status(400)
        .json({ success: false, message: "Activity already exists" });
    }
    //all good
    await Activity.create({
      name,
      description: description,
      sample: sample,
    });
    res.json({
      success: true,
      message: "Activity created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route get /api/action/:actionId
//@desp get action by id
//@private access
router.get("/:activityId", async (req, res) => {
  try {
    const activity = await Activity.findOne({
      where: { id: req.params.activityId },
    });
    res.json({
      success: true,
      message: "Success",
      data: activity,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route put /api/action/:accountId
//@desp update action by id
//@private access
router.put("/:activityId", async (req, res) => {
  const { name, description, sample, accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    await Activity.update(
      { name, description: description, sample: sample },
      {
        where: { id: req.params.activityId },
      }
    );
    res.json({
      success: true,
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route delete /api/action/:accountId
//@desp delete action by id
//@private access
router.delete("/:activityId", async (req, res) => {
  const { accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    await Activity.destroy({
      where: {
        id: req.params.activityId,
      },
    });
    res.json({
      success: true,
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const upload = require("../middleware/upload");

const readXlsxFile = require("read-excel-file/node");
//@route post /api/action/import
//@desp import excel
//@private access
router.post("/import", upload.single("file"), async (req, res) => {
  const { accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }
    console.log(__dirname);
    let path = __basedir + "/resources/" + req.file.filename;

    readXlsxFile(path).then(async (rows) => {
      // skip header
      rows.shift();

      let activities = [];

      rows.forEach((row) => {
        if (!row[0] || row[0].trim().length === 0) {
          return; // Bỏ qua dòng không hợp lệ
        }
        let activity = {
          name: row[0],
          description: row[1],
          sample: row[2],
        };

        activities.push(activity);
      });

      Activity.bulkCreate(activities)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database! ",
            error: error.message,
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
});
module.exports = router;
