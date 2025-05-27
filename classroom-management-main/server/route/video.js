require("dotenv").config();

const express = require("express");
const router = new express.Router();
const db = require("../models");

const Video = db.video;

//@route get /api/video/
//@desp get all video
//@private access
router.get("/", async (req, res) => {
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    const video = await Video.findAll();
    res.json({
      success: true,
      message: "Success",
      data: video,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route post /api/video/
//@desp create new video
//@private access
router.post("/", async (req, res) => {
  const { start_time, end_time, videoURL, resultURL, camera_id, accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  if (!start_time || !end_time || !videoURL || !camera_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing any field!" });
  }
  try {
    const video = await Video.findOne({
      where: { videoURL },
    });
    if (video) {
      return res
        .status(400)
        .json({ success: false, message: "Video already exists" });
    }
    //all good
    await Video.create({
      start_time,
      end_time,
      videoURL,
      resultURL,
      camera_id,
    });
    res.json({
      success: true,
      message: "Video created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route get /api/video/:videoId
//@desp get video by id
//@private access
router.get("/:videoId", async (req, res) => {
  // const { accRole } = req.body;
  // if (accRole === 0)
  //   return res.status(405).json({ error: "Method Not Allowed " });
  try {
    const video = await Video.findOne({
      where: { id: req.params.videoId },
    });
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }
    res.json({
      success: true,
      message: "Success",
      data: video,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route get /api/video/:videoId
//@desp get video by id
//@private access
router.get("/file/:videoId", async (req, res) => {
  // const { accRole } = req.body;
  // if (accRole === 0)
  //   return res.status(405).json({ error: "Method Not Allowed " });
  try {
    const video = await Video.findOne({
      where: { id: req.params.videoId },
    });
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    if (!fs.existsSync(video.videoURL)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }
    res.sendFile(video.videoURL);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route put /api/video/:videoId
//@desp update video by id
//@private access
router.put("/:videoId", async (req, res) => {
  const { start_time, end_time, videoURL, resultURL, camera_id, accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    await Video.update(
      {
        start_time,
        end_time,
        videoURL,
        resultURL,
        camera_id,
      },
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
//@route delete /api/video/:videoId
//@desp delete video by id
//@private access
router.delete("/:videoId", async (req, res) => {
  const { accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    const deleted = await Video.destroy({
      where: { id: req.params.videoId },
    });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }
    res.json({
      success: true,
      message: "Video deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route get /api/video/camera/:cameraId
//@desp get all video by camera id
//@private access
router.get("/camera/:cameraId", async (req, res) => {
  try {
    const videos = await Video.findAll({
      where: {
        camera_id: req.params.cameraId,
      },
    });
    res.json({
      success: true,
      message: "Success",
      data: videos,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const upload = require("../middleware/upload");

const readXlsxFile = require("read-excel-file/node");
//@route post /api/video/import
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
    const path = __basedir + "/resources/" + req.file.filename;

    readXlsxFile(path).then(async (rows) => {
      // skip header
      rows.shift();

      let videos = [];

      rows.forEach((row) => {
        let video = {
          start_time: row[0],
          end_time: row[1],
          videoURL: row[2],
          resultURL: row[3],
          camera_id: row[4],
        };

        videos.push(video);
      });

      Video.bulkCreate(videos)
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
