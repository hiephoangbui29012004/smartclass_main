const db = require("./models");

(async () => {
  try {
    
        console.log("camera model:", db.camera); // true?
        console.log("classroom model:", db.classroom.name);
    const cameras = await db.camera.findAll({
      include: [{ model: db.classroom, as: "room", attributes: ["id", "name"] }]
    });

    console.log("Result sample:", JSON.stringify(cameras[0], null, 2));
  } catch (err) {
    console.error("Sequelize Error:", err);
  }
})();
