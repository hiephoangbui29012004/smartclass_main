const path = require("path");
const express = require("express");
require("dotenv").config();

global.__basedir = __dirname;

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3030", // Đảm bảo đúng origin của React app
    methods: ["GET", "POST", "PUT", "DELETE"], // Liệt kê đủ các method
    credentials: true // Quan trọng để cho phép gửi cookie/auth headers
  },
  pingInterval: 45000, // Tăng lên 45 giây (mặc định 25 giây)
  pingTimeout: 30000
});

const db = require("./models");
const { spawn } = require('child_process');

// Đối tượng để lưu trữ các luồng FFmpeg và namespace Socket.IO đang hoạt động
// ĐÃ THÊM thuộc tính 'jpegBuffer' vào mỗi đối tượng stream
const activeStreams = {}; // key: cameraId, value: { ffmpegProcess: ChildProcess, namespace: SocketIONamespace, jpegBuffer: Buffer }

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

const rtsp = require("rtsp-ffmpeg"); // Có vẻ như bạn không dùng rtsp-ffmpeg trực tiếp, chỉ dùng ffmpeg qua child_process

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

// Hàm để khởi động FFmpeg và thiết lập Socket.IO cho một camera cụ thể
async function startCameraStream(cameraId) {
  if (activeStreams[cameraId]) {
    console.log(`ℹ️ Stream for cam ${cameraId} is already active.`);
    return; // Đã có stream, không cần khởi động lại
  }

  try {
    const camera = await db.camera.findOne({
      where: { id: cameraId },
    });

    if (!camera) {
      console.error(`❌ Camera with ID ${cameraId} not found.`);
      return;
    }

    console.log(`📺 Starting RTSP stream for cam ${cameraId} from: ${camera.streamLink}`);

    const ffmpegPath = '/opt/homebrew/bin/ffmpeg';
    const videoInputPath = camera.streamLink;

    const ffmpegArgs = [
      '-loglevel', 'warning',
      '-stream_loop', '-1',
      '-i', videoInputPath,
      '-hide_banner',
      '-an',                  // Không âm thanh
      '-f', 'image2pipe',
      '-pix_fmt', 'yuvj422p',
      '-vcodec', 'mjpeg',
      '-q:v', '5',            // Chất lượng JPEG: Thử 5. (số nhỏ hơn = chất lượng tốt hơn = dung lượng lớn hơn)
                              // Nếu vẫn mờ, thử 3. Nếu lag, thử 7-10.
      '-vf', 'scale=960:-1',  // Độ phân giải: 960px chiều rộng (HD-ready).
                              // Nếu muốn nét hơn và chấp nhận tải nặng hơn, thử 'scale=1280:-1'.
                              // Nếu vẫn giật/lag, thử giảm xuống 'scale=800:-1' hoặc '640:-1'.
      '-r', '15',              // Tốc độ khung hình: 15 FPS.
                              // Nếu video quá giật, thử 20 hoặc 25. Nếu quá lag, thử giảm xuống 10.
      '-'
    ];

    console.log(`[DEBUG-FFMPEG-SPAWN] Spawning: ${ffmpegPath} ${ffmpegArgs.join(' ')}`);

    const ffmpegProcess = spawn(ffmpegPath, ffmpegArgs, { detached: false });

    const ns = io.of("/cam" + cameraId);
    // KHỞI TẠO activeStreams[cameraId] VỚI jpegBuffer RỖNG
    activeStreams[cameraId] = { ffmpegProcess, namespace: ns, jpegBuffer: Buffer.alloc(0) };

    // Khai báo biến kiểm soát tốc độ gửi khung hình
    let lastFrameTime = 0;
    const targetFps = 15; // Phải khớp với '-r' trong ffmpegArgs
    const frameInterval = 1000 / targetFps;

    // --- BẮT ĐẦU PHẦN THAY ĐỔI QUAN TRỌNG NHẤT ---
    ffmpegProcess.stdout.on('data', (chunk) => {
        // Lấy buffer hiện tại của stream này từ activeStreams
        let currentJpegBuffer = activeStreams[cameraId].jpegBuffer;
        
        // Ghép chunk mới vào buffer hiện có
        currentJpegBuffer = Buffer.concat([currentJpegBuffer, chunk]);

        let offset = 0;
        while (offset < currentJpegBuffer.length) {
            // Tìm điểm bắt đầu của một file JPEG (SOI: 0xFF D8)
            const soi = currentJpegBuffer.indexOf(Buffer.from([0xFF, 0xD8]), offset);
            if (soi === -1) {
                // Không tìm thấy SOI từ vị trí hiện tại trở đi, giữ lại phần còn lại của buffer
                currentJpegBuffer = currentJpegBuffer.slice(offset);
                break;
            }

            // Tìm điểm kết thúc của một file JPEG (EOI: 0xFF D9)
            // Bắt đầu tìm EOI sau SOI để tránh nhầm lẫn
            const eoi = currentJpegBuffer.indexOf(Buffer.from([0xFF, 0xD9]), soi + 2);
            if (eoi === -1) {
                // Không tìm thấy EOI, nghĩa là frame chưa hoàn chỉnh.
                // Giữ lại phần buffer từ SOI trở đi để chờ thêm dữ liệu.
                currentJpegBuffer = currentJpegBuffer.slice(soi);
                break;
            }

            // Đã tìm thấy một frame JPEG hoàn chỉnh
            const completeFrame = currentJpegBuffer.slice(soi, eoi + 2);

            const currentTime = Date.now();

            // Chỉ gửi dữ liệu nếu đã đủ 'frameInterval' và có client kết nối
            if (currentTime - lastFrameTime >= frameInterval && ns.sockets.size > 0) {
                ns.emit("data", completeFrame.toString("base64")); // Gửi CHỈ frame hoàn chỉnh
                lastFrameTime = currentTime; // Cập nhật thời gian gửi cuối cùng
            }

            // Cập nhật offset để tìm frame tiếp theo (bắt đầu sau EOI của frame vừa tìm thấy)
            offset = eoi + 2;
        }
        // Cập nhật lại buffer chính cho stream này trong activeStreams
        activeStreams[cameraId].jpegBuffer = currentJpegBuffer;
    });
    // --- KẾT THÚC PHẦN THAY ĐỔI QUAN TRỌNG NHẤT ---


    ffmpegProcess.stderr.on('data', (data) => {
        console.error(`[DEBUG-FFMPEG-STDERR] for cam ${cameraId}: ${data.toString()}`);
    });

    ffmpegProcess.on('close', (code) => {
        console.log(`[DEBUG-FFMPEG] FFmpeg process for cam ${cameraId} exited with code ${code}`);
        // Xóa khỏi activeStreams khi process FFmpeg dừng
        if (activeStreams[cameraId]) {
            delete activeStreams[cameraId];
        }
        // Thử lại khởi động nếu không phải do người dùng dừng (code 0) và có lỗi
        if (code !== 0) {
            console.warn(`Attempting to restart stream for cam ${cameraId} after unexpected exit.`);
            // Có thể thêm logic retry có giới hạn ở đây
            // setTimeout(() => startCameraStream(cameraId), 5000); // Thử lại sau 5 giây
        }
    });

    ffmpegProcess.on('error', (err) => {
        console.error(`[DEBUG-FFMPEG] Failed to spawn FFmpeg process for cam ${cameraId}: ${err.message}`);
        console.error(err);
        if (activeStreams[cameraId]) {
            delete activeStreams[cameraId];
        }
    });

    // Xử lý kết nối Socket.IO cho namespace này
    ns.on("connection", function (wsocket) {
        // Đã sửa lại ns.server.engine.clientsCount thành ns.sockets.size để lấy số lượng client trong namespace này.
        // ns.server.engine.clientsCount là tổng số client kết nối đến server Socket.IO, không phải chỉ namespace này.
        console.log(`🤝 Client connected to /cam${cameraId}. Total clients in namespace: ${ns.sockets.size}`);

        wsocket.on("disconnect", function () {
            console.log(`👋 Client disconnected from /cam${cameraId}. Remaining clients in namespace: ${ns.sockets.size}`);
            // Dừng FFmpeg process nếu không còn client nào trong namespace này
            // Đã sửa lại ns.server.engine.clientsCount thành ns.sockets.size
            if (activeStreams[cameraId] && ns.sockets.size === 0) {
                console.log(`🛑 Stopping FFmpeg for cam ${cameraId} as no clients are connected to its namespace.`);
                activeStreams[cameraId].ffmpegProcess.kill('SIGINT'); // Gửi tín hiệu dừng cho FFmpeg
            }
        });
    });

  } catch (error) {
    console.error(`🔥 Error starting stream for cam ${cameraId}:`, error);
  }
}

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
    const cameraId = req.params.cameraId;
    // Gọi hàm khởi động luồng, hàm này sẽ kiểm tra xem luồng đã chạy chưa
    await startCameraStream(cameraId);

    // Chỉ cần báo thành công là client có thể kết nối Socket.IO
    res.json({
        success: true,
        message: "Stream initialization requested. Connect via Socket.IO to /cam" + cameraId,
    });
  });


  // Socket.IO global connection (cho mục đích khác nếu có)
  // Trong trường hợp này, có thể không cần thiết nếu tất cả các luồng đều dùng namespace riêng
  io.on("connection", function (socket) {
    // console.log("A client connected to the root Socket.IO namespace.");
    socket.emit("start", "connected"); // Đây có thể là một tin nhắn khởi tạo chung
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
