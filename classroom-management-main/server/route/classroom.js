require("dotenv").config();

const express = require("express");
const router = new express.Router();
const db = require("../models");
const nodeExcel = require("excel-export");
const Classroom = db.classroom;

//@route get /api/room/
//@desp get all room
//@private access
router.get("/", async (req, res) => {
  try {
    const classroom = await Classroom.findAll();
    res.json({
      success: true,
      message: "Success",
      data: classroom,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route get /api/room/export
//@desp get all room
//@private access
router.get("/export", async (req, res) => {
  try {
    const classroom = await Classroom.findAll();
    if (classroom.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No classrooms found to export.",
      });
    }
    let conf = {};
    conf.name = "mysheet";

    conf.cols = [
      { caption: "name", type: "string" },
      { caption: "address", type: "string" },
      { caption: "capacity", type: "number" },
    ];
    conf.rows = classroom.map((item) => {
      return [item.name, item.address, item.capacity];
    });
    const excel = nodeExcel.execute(conf);
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Classrooms.xlsx"
    );
    res.end(excel, "binary");
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route post /api/room/
//@desp create new room
//@private access
router.post("/", async (req, res) => {
  const { name, address, capacity, accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  if (!name || !address || typeof capacity !== "number" || capacity < 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid input data!" });
  }
  try {
    const classroom = await Classroom.findOne({
      where: { name, address },
    });
    if (classroom) {
      return res
        .status(400)
        .json({ success: false, message: "Classroom already exists" });
    }
    //all good
    await Classroom.create({
      name,
      address,
      capacity,
    });
    res.json({
      success: true,
      message: "Classroom created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route get /api/room/:roomId
//@desp get action by id
//@private access
router.get("/:classroomId", async (req, res) => {
  try {
    const classroom = await Classroom.findOne({
      where: { id: req.params.classroomId },
    });
    res.json({
      success: true,
      message: "Success",
      data: classroom,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route put /api/room/:roomId
//@desp update room by id
//@private access
router.put("/:classroomId", async (req, res) => {
  const { name, address, capacity, accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    await Classroom.update(
      { name, address, capacity: capacity || 0 },
      {
        where: { id: req.params.classroomId },
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
//@route delete /api/room/:roomId
//@desp delete room by id
//@private access
router.delete("/:classroomId", async (req, res) => {
  const { accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    await Classroom.destroy({
      where: {
        id: req.params.classroomId,
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
//@route post /api/room/import
//@desp import excel
//@private access
router.post("/import", upload.single("file"), async (req, res) => {
  const { accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    if (!req.file.mimetype.includes("excel")) {
      return res.status(400).send("Please upload a valid Excel file!");
    }
    console.log(__dirname);
    let path = __basedir + "/resources/" + req.file.filename;

    readXlsxFile(path).then(async (rows) => {
      // skip header
      rows.shift();

      let classrooms = [];

      rows.forEach((row) => {
        if (!row[0] || !row[1] || typeof row[2] !== "number" || row[2] < 0) {
          return; // Bỏ qua dòng không hợp lệ
        }    
        let classroom = {
          name: row[0],
          address: row[1],
          capacity: row[2],
        };

        classrooms.push(classroom);
      });

      Classroom.bulkCreate(classrooms)
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
