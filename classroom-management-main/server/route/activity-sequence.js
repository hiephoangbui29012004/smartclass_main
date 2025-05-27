require("dotenv").config();

const express = require("express");
const router = new express.Router();
const db = require("../models");

const ActivitySequence = db.activitySequence;

//@route get /api/activity-sequence/
//@desp get all activity sequences
//@private access
router.get("/", async (req, res) => {
  try {
    const activitySequences = await ActivitySequence.findAll();
    res.json({
      success: true,
      message: "Success",
      data: activitySequences,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route post /api/activity-sequence/
//@desp create new activity sequence
//@private access
router.post("/", async (req, res) => {
  const { video_id, activity_id, start_frame, end_frame, length, accRole } = req.body;

  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed" });

  if (!video_id || !activity_id || !start_frame || !end_frame) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields!" });
  }

  try {
    await ActivitySequence.create({
      video_id,
      activity_id,
      start_time,
      end_time,
      length: length || null, // Optional field
    });
    res.json({
      success: true,
      message: "Activity sequence created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route get /api/activity-sequence/:id
//@desp get activity sequence by id
//@private access
router.get("/:id", async (req, res) => {
  try {
    const activitySequence = await ActivitySequence.findOne({
      where: { id: req.params.id },
    });
    if (!activitySequence) {
      return res.status(404).json({ success: false, message: "Activity sequence not found" });
    }
    res.json({
      success: true,
      message: "Success",
      data: activitySequence,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route put /api/activity-sequence/:id
//@desp update activity sequence by id
//@private access
router.put("/:id", async (req, res) => {
  const { video_id, activity_id, start_frame, end_frame, length, accRole } = req.body;

  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const updated = await ActivitySequence.update(
      {
        video_id,
        activity_id,
        start_time,
        end_time,
        length,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updated[0] === 0) {
      return res.status(404).json({ success: false, message: "Activity sequence not found" });
    }
    res.json({
      success: true,
      message: "Activity sequence updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route delete /api/activity-sequence/:id
//@desp delete activity sequence by id
//@private access
router.delete("/:id", async (req, res) => {
  const { accRole } = req.body;

  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const deleted = await ActivitySequence.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Activity sequence not found" });
    }
    res.json({
      success: true,
      message: "Activity sequence deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route get /api/activity-sequence/video/:videoId
//@desp get all activity sequences by video id
//@private access
router.get("/video/:videoId", async (req, res) => {
  try {
    const activitySequences = await ActivitySequence.findAll({
      where: { video_id: req.params.videoId },
    });
    res.json({
      success: true,
      message: "Success",
      data: activitySequences,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;