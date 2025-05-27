require("dotenv").config();

const express = require("express");
const router = new express.Router();
const db = require("../models");
const nodeExcel = require("excel-export");
const Camera = db.camera;
const Classroom = db.classroom;
console.log("Camera model:", Camera === db.camera); // true?
console.log("Classroom model:", db.classroom.name);
console.log(db.camera.associations); // có room?
console.log("👀 Associations:", Object.keys(Camera.associations));

router.get("/", async (req, res) => {
  try {
    // Debug logging
    // console.log("Models check:", {
    //   camera: !!db.camera,
    //   classroom: !!db.classroom,
    //   cameraAssociations: db.camera?.associations,
    //   classroomAssociations: db.classroom?.associations
    // });

    // First try to get cameras without include
    const cameras = await db.camera.findAll();
    console.log("Cameras found:", cameras.length);

    // Then try with include using a different syntax
    const result = await db.sequelize.query(
      `SELECT c.*, r.id as "room.id", r.name as "room.name" 
       FROM camera c 
       LEFT JOIN classroom r ON c.classroom_id = r.id`,
      {
        type: db.sequelize.QueryTypes.SELECT,
        nest: true
      }
    );

    if (!result) {
      return res.status(404).json({ error: "No cameras found" });
    }

    // console.log("Query result:", result);
    res.json(result);
  } catch (err) {
    console.error("🔥 Error in GET /:", err);
    res.status(500).json({ 
      error: err.message,
      details: err.stack
    });
  }
});

//@route get /api/camera/export
//@desp get all camera
//@private access
router.get("/export", async (req, res) => {
  try {
    const camera = await Camera.findAll();
    
    let newCamera = [];
    for (const item of camera) {
      const classroom = await Classroom.findOne({
        where: {
          id: item.classroom_id,
        },
      });
      const newItem = JSON.parse(JSON.stringify(item));
      newItem.classroom = classroom;
      newCamera.push(newItem);
    }
    let conf = {};
    conf.name = "mysheet";

    conf.cols = [
      { caption: "name", type: "string" },
      { caption: "ipAddress", type: "string" },
      { caption: "spec", type: "string" },
      { caption: "status", type: "number" },
      { caption: "streamLink", type: "string" },
      { caption: "description", type: "string" },
      { caption: "ClassroomID", type: "number" },
    ];
    conf.rows = newCamera.map((item) => {
      return [
        item.name,
        item.ipAddress,
        item.spec,
        item.status,
        item.streamLink,
        item.description,
        item.classroom_id,
      ];
    });
    const excel = nodeExcel.execute(conf);
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Cameras.xlsx"
    );
    res.end(excel, "binary");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route post /api/camera/
//@desp create new camera
//@private access
router.post("/", async (req, res) => {
  const {
    name,
    ipAddress,
    spec,
    status,
    streamLink,
    description,
    classroom_id,
    accRole,
  } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  if (!name || !ipAddress || !classroom_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing any field!" });
  }
  try {
    const camera = await Camera.findOne({
      where: { ipAddress },
    });
    if (camera) {
      return res
        .status(400)
        .json({ success: false, message: "Camera already exists" });
    }
    //all good
    await Camera.create({
      name,
      ipAddress,
      spec: spec || "",
      status: status || 0,
      streamLink: streamLink || "",
      description: description || "",
      classroom_id: classroom_id,
    });
    res.json({
      success: true,
      message: "Camera created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route get /api/camera/:cameraId
//@desp get camera by id
//@private access
router.get("/:cameraId", async (req, res) => {
  try {
    const camera = await Camera.findOne({
      where: { id: req.params.cameraId },
    });
    res.json({
      success: true,
      message: "Success",
      data: camera,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route put /api/camera/:cameraId
//@desp update camera by id
//@private access
router.put("/:cameraId", async (req, res) => {
  const {
    name,
    ipAddress,
    spec,
    status,
    streamLink,
    description,
    classroom_id,
    accRole,
  } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    await Camera.update(
      {
        name,
        ipAddress,
        spec: spec || "",
        status: status || 0,
        streamLink: streamLink || "",
        description: description || "",
        classroom_id,
      },
      {
        where: { id: req.params.cameraId },
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
//@route delete /api/camera/:cameraId
//@desp delete camera by id
//@private access
router.delete("/:cameraId", async (req, res) => {
  const { accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    await Camera.destroy({
      where: {
        id: req.params.cameraId,
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

//@route get /api/camera/room/:roomId
//@desp get all camera by room id
//@private access
router.get("/classroom/:classroomID", async (req, res) => {
  try {
    const camera = await Camera.findAll({
      where: {
        classroom_id: req.params.classroomID,
      },
    });
    res.json({
      success: true,
      message: "Success",
      data: camera,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
const upload = require("../middleware/upload");

const readXlsxFile = require("read-excel-file/node");
//@route post /api/camera/import
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

      let cameras = [];

      rows.forEach((row) => {
        let camera = {
          name: row[0],
          ipAddress: row[1],
          spec: row[2],
          status: row[3],
          streamLink: row[4],
          description: row[5],
          classroom_id: row[6],
        };

        cameras.push(camera);
      });

      Camera.bulkCreate(cameras)
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

// const test = async () => {
//   try {
//     console.log("camera model:", Camera);
//     console.log("classroom model:", Classroom.name);
//     const classrooms = await Classroom.findAll({});
//     console.log("Classroom:", classrooms);
//     const cameras = await Camera.findAll({
//       include: [{ model: Classroom, as: "room", attributes: ["id", "name"] }]
//     });
//     console.log("Result sample:", JSON.stringify(cameras[0], null, 2));
//   } catch (err) {
//     console.error("Sequelize Error:", err);
//   }
// };

// Run test after all routes are defined
module.exports = router;
// test();
