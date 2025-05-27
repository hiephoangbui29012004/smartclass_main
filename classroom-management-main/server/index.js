const path = require("path");
const express = require("express");
require("dotenv").config();

global.__basedir = __dirname;

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const db = require("./models");

// Initialize database connection and models
const initializeDatabase = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✅ Đã kết nối tới MySQL thành công!');
    
    // Sync all models
    await db.sequelize.sync();
    console.log('✅ Models synchronized successfully');
    
    return true;
  } catch (err) {
    console.error('❌ Lỗi kết nối tới MySQL:', err);
    return false;
  }
};

const rtsp = require("rtsp-ffmpeg");

const authRoute = require("./route/auth");
const accountRoute = require("./route/account");
const activityRoute = require("./route/activity");
const classroomRoute = require("./route/classroom");
const cameraRoute = require("./route/camera");
const videoRoute = require("./route/video");
const resultRoute = require("./route/activity-sequence");
const boundingBoxRoute = require("./route/boundingbox");
const statisticsRoute = require("./route/statistics");

var cors = require("cors");
const verifyToken = require("./middleware/verifyToken");

app.use(cors());
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(express.json({ limit: "200mb" }));

// react build
app.use(express.static(path.resolve(__dirname, "../client/build")));

// Initialize database and start server
initializeDatabase().then(success => {
  if (!success) {
    console.error('Failed to initialize database. Server will not start.');
    process.exit(1);
  }

  //test api
  app.get("/api/info", (req, res) => {
    res.json({ message: "Hello from server!" });
  });

  //routing
  app.use("/api/auth", authRoute);
  app.use("/api/account", verifyToken, accountRoute);
  app.use("/api/activity", verifyToken, activityRoute);
  app.use("/api/classroom", verifyToken, classroomRoute);
  app.use("/api/camera", verifyToken, cameraRoute);
  app.use("/api/video", verifyToken, videoRoute);
  app.use("/api/result", verifyToken, resultRoute);
  app.use("/api/boundingbox", verifyToken, boundingBoxRoute);
  app.use("/api/statistics", verifyToken, statisticsRoute);
  app.use(
    "/storage",
    express.static(
      path.resolve(
        __dirname,
        "../../storage"
      )
    )
  );
  
  app.get("/api/stream/:cameraId", verifyToken, async (req, res) => {
    try {
      const camera = await db.camera.findOne({
        where: { id: req.params.cameraId },
      });
  
      if (!camera) {
        return res.status(404).json({ error: "Camera not found" });
      }
  
      console.log("📺 RTSP streamLink:", camera.streamLink);
  
      const stream = new rtsp.FFMpeg({
        input: camera.streamLink,
        arguments: ['-rtsp_transport', 'tcp', '-buffer_size', '102400'],
      });
  
      stream.on("start", function () {
        console.log("camera " + camera.id + " started");
      });
  
      stream.on("stop", function () {
        console.log("camera " + camera.id + " stopped");
      });
  
      stream.on("error", (err) => {
        console.error("FFmpeg error: ", err);
      });
  
      const ns = io.of("/cam" + camera.id);
      ns.on("connection", function (wsocket) {
        console.log("connected to /cam" + camera.id);
  
        const pipeStream = function (data) {
          console.log("📡 Sending data to client...");
          wsocket.emit("data", data.toString("base64"));
        };
  
        stream.on("data", pipeStream);
  
        wsocket.on("disconnect", function () {
          console.log("disconnected from /cam" + camera.id);
          stream.removeListener("data", pipeStream);
        });
      });
  
      res.json({
        success: true,
        message: "Socket On",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  

  io.on("connection", function (socket) {
    socket.emit("start", "connected");
  });

  // routing to react app 
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });

  server.listen(process.env.PORT, () =>
    console.log(`Server start on port ${process.env.PORT}`)
  );
  server.timeout = 5 * 60 * 1000;
});