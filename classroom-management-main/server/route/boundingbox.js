require("dotenv").config();

const express = require("express");
const router = new express.Router();
const db = require("../models");

const BoundingBox = db.boundingBox;

//@route GET /api/bounding-box/
//@desp Get all bounding boxes
//@private access
router.get("/", async (req, res) => {
  try {
    const boundingBoxes = await BoundingBox.findAll();
    res.json({
      success: true,
      message: "Success",
      data: boundingBoxes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route POST /api/bounding-box/
//@desp Create a new bounding box
//@private access
router.post("/", async (req, res) => {
  const { sequence_id, frame_number, box_top, box_left, box_width, box_height, score, accRole } = req.body;

  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed" });

  if (!sequence_id || !frame_number || !box_top || !box_left || !box_width || !box_height || !score) {
    return res.status(400).json({ success: false, message: "Missing required fields!" });
  }

  try {
    const boundingBox = await BoundingBox.create({
      sequence_id,
      frame_number,
      box_top,
      box_left,
      box_right,
      box_bottom,
      score,
      timestamp,
    });
    res.json({
      success: true,
      message: "Bounding box created",
      data: boundingBox,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route GET /api/bounding-box/:id
//@desp Get bounding box by ID
//@private access
router.get("/:id", async (req, res) => {
  try {
    const boundingBox = await BoundingBox.findOne({
      where: { id: req.params.id },
    });
    if (!boundingBox) {
      return res.status(404).json({ success: false, message: "Bounding box not found" });
    }
    res.json({
      success: true,
      message: "Success",
      data: boundingBox,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route PUT /api/bounding-box/:id
//@desp Update bounding box by ID
//@private access
router.put("/:id", async (req, res) => {
  const { sequence_id, frame_number, box_top, box_left, box_width, box_height, score, accRole } = req.body;

  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const updated = await BoundingBox.update(
      {
        sequence_id,
        frame_number,
        box_top,
        box_left,
        box_right,
        box_bottom,
        score,
        timestamp,
      },
      {
        where: { id: req.params.id },
      }
    );
    if (updated[0] === 0) {
      return res.status(404).json({ success: false, message: "Bounding box not found" });
    }
    res.json({
      success: true,
      message: "Bounding box updated",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route DELETE /api/bounding-box/:id
//@desp Delete bounding box by ID
//@private access
router.delete("/:id", async (req, res) => {
  const { accRole } = req.body;

  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed" });

  try {
    const deleted = await BoundingBox.destroy({
      where: { id: req.params.id },
    });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Bounding box not found" });
    }
    res.json({
      success: true,
      message: "Bounding box deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route GET /api/bounding-box/sequence/:sequenceId
//@desp Get all bounding boxes by sequence ID
//@private access
router.get("/sequence/:sequenceId", async (req, res) => {
  try {
    const boundingBoxes = await BoundingBox.findAll({
      where: { sequence_id: req.params.sequenceId },
    });
    res.json({
      success: true,
      message: "Success",
      data: boundingBoxes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;