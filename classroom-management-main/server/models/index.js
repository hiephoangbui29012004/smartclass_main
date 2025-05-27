const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.account = require("./account.model.js")(sequelize, Sequelize);
db.camera = require("./camera.model.js")(sequelize, Sequelize);
db.classroom = require("./classroom.model.js")(sequelize, Sequelize);
db.video = require("./video.model.js")(sequelize, Sequelize);
db.activity = require("./activity.model.js")(sequelize, Sequelize);
db.activitySequence = require("./activity-sequence.model.js")(sequelize, Sequelize);
db.boundingBox = require("./bounding-box.model.js")(sequelize, Sequelize);
//db.videoActivities = require("./video-activities.model.js")(sequelize, Sequelize);

// THIẾT LẬP ASSOCIATIONS
require("./associate.js")(db);
// console.log("Associations Test:", Object.keys(db.camera.associations));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
