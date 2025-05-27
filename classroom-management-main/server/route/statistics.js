
require("dotenv").config();
const { Op } = require("sequelize");
const express = require("express");
const router = new express.Router();
const fs = require('fs');
const path = require('path');

const db = require("../models");
const Video = db.video;
const Camera = db.camera;
const Activity = db.activity;
const ActivitySequence = db.activitySequence;


router.post("/", async (req, res) => {
  
  var {limit, page, classroomId, dateFrom, dateTo } = req.body;
  
  try {
    
    //var filteredActions = actions
    parsedPage = page ?? 1;
    parsedLimit = limit ?? 20;
    var actions = []
    const offset = (page-1)*limit
    const cameras = await Camera.findAll({
      where: { classroom_id: classroomId },
    });
    const imageIdArray = [];
    const cameraIdArray = [];

    if (cameras) {   
      for (const element of cameras) {
        cameraIdArray.push(element.id)
      }
    }

    const videos = await Video.findAll({
      where: {
        camera_id: { [Op.in]: cameraIdArray },
      },
    });
    const videoIds = videos.map((v) => v.id);

    if (videoIds.length === 0) {
      return res.json({
        success: true,
        data: [],
        count: 0,
        numPage: 0,
        limit: parsedLimit,
        page: parsedPage,
      });
    }



    const result = await db.sequelize.query(
      `SELECT asq.*, a.id as "activity.id", a.name as "activity.name"
       FROM activity_sequence as asq
       LEFT JOIN activity a ON asq.activity_id = a.id
       WHERE asq.video_id IN (:videoIds) 
       AND asq.start_time >= :dateFrom 
       AND asq.end_time <= :dateTo 
       AND asq.activity_id IS NOT NULL`,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: {
          videoIds: videoIds,
          dateFrom: dateFrom,
          dateTo: dateTo,
        },
        nest: true,
      }
    );
    // const result = sequences.map((seq) => ({
    //   id_track: seq.id,
    //   activity_name: seq.activity ? seq.activity.name : "Unknown",
    //   sequence_start_time: seq.start_time,
    //   sequence_end_time: seq.end_time,
    // }));
    const count = result.length;
    const numPage = Math.ceil(count / parsedLimit);
    res.json({
      success: true,
      data: result,
      count,
      numPage,
      limit: parsedLimit,
      page: parsedPage,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.post("/", async (req, res) => {
  
//   var {limit, page,roomId, dateFrom, dateTo,actions } = req.body;
  
//   try {
    
//     var filteredActions = actions
//     page = page ?? 1;
//     limit = limit ?? 20;
//     var actions = []
//     const offset = (page-1)*limit
//     const cameras = await Camera.findAll({
//       where: { roomID: roomId },
//     });
//     const imageIdArray = [];
//     const imageIdDict = {};
//     const cameraIdArray = [];

//     if (cameras) {   
//       for (const element of cameras) {
//         cameraIdArray.push(element.id)
//       }
//     }

//     const imageQuery = {
//       where: {
//           [Op.and]: [
//           { cameraID : {[Op.or]: cameraIdArray} },
//           { timeStamp: { [Op.between]: [dateFrom, dateTo] } },
//         ], 
//       },
//       // limit: limit,
//       // offset: offset,
//     }

//     var {count, rows} = await Image.findAndCountAll(imageQuery);
//     const images = rows;
//     var numPage = 0;

//     images.forEach((el) => {
//       imageIdArray.push(el.id);
//       imageIdDict[el.id]=true;
//     });

//     if (imageIdArray.length>0){
//       var actions = await Action.findAll();
//       var actionsDict = {};
//       actions.map((action,i)=>{
//         actionsDict[action.id] = action
//       })

//       var {rows } = await RecognitionResult.findAndCountAll({
//         where: {
//           [Op.and]: [
//             { timeStamp: { [Op.between]: [dateFrom, dateTo] } },
//             { actionID: { [Op.or]: filteredActions } },
//           ],
//         },
//       });
//       var actions = []
//       var actionsFull = []
//       for (let el of rows) 
//       {
//         var obj = {...el.dataValues}
//         const actionId = obj.actionID
//         const imageID = obj.imageID
//         if (imageIdDict[imageID] !=null){
//           const action = actionsDict[actionId]
//           obj.action = { name: action.name }
//           obj.image = { id: obj.imageID }
//           actionsFull.push(obj)
//         }
//       }
//       count = actionsFull.length
      
//       numPage = Math.ceil(count/limit)
//       for (var i=offset;i<offset+limit;i++){
//         if (actionsFull[i] != null)
//           actions.push(actionsFull[i]);
//       }
//     }

//     res.json({
//       data: { actions:actions,
//       count: count,
//       numPage: numPage,
//       limit: limit,
//       }
//     });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.post("/charts_backup", async (req, res) => {
  
//   var {roomId, dateFrom, dateTo, interval,actions } = req.body;
  
//   try {
//     var filteredActions = actions
//     var filteredActionsDict = {}
//     filteredActions.map((actionId)=>{
//       filteredActionsDict[actionId] = true
//     })
//     interval = interval ?? 10;
//     var actions = []
//     const cameras = await Camera.findAll({
//       where: { roomID: roomId },
//     });
//     const imageIdDict = {};
//     const cameraIdArray = [];

//     if (cameras) {   
//       for (const element of cameras) {
//         cameraIdArray.push(element.id)
//       }
//     }
//     const imageQuery = {
//       where: {
//           [Op.and]: [
//           { cameraID : {[Op.or]: cameraIdArray} },
//           { timeStamp: { [Op.between]: [dateFrom, dateTo] } },
//         ], 
//       },
//     }

//     var {count, rows} = await Image.findAndCountAll(imageQuery);
//     rows.forEach((el) => {
//       imageIdDict[el.id] = {};
//     });
    
    
//     var actions = await Action.findAll();
//     var _actions = []
//     actions.map((action,i)=>{
//       if (filteredActionsDict[action.id] != null){
//         var obj = {...action.dataValues}
//         delete obj.sample
//         _actions.push(obj)
//       }
//     })
//     actions = _actions;

//     var actionsDict = {};
    
//     actions.map((action,i)=>{
//       actionsDict[action.id] = {...action}
//       actionsDict[action.id].value = 0
//     })

//     var lineDataDict = {}
//     var actionsCount = []
//     var timestamps = []
//     var actionsIdList = []
//     var counts = []
//     if (imageIdDict != {} ){
      
//       var {rows } = await RecognitionResult.findAndCountAll({
//         where: {
//           [Op.and]: [
//             { timeStamp: { [Op.between]: [dateFrom, dateTo]  }, },
//             { actionID: { [Op.or]: filteredActions } },
//           ],
//         },
//       });
//       var dates = []
//       for (let el of rows) 
//       {
//         var obj = {...el.dataValues}
//         const actionId = obj.actionID
//         const imageID = obj.imageID
//         if (imageIdDict[imageID] != null){
          
//           actionsDict[actionId].value = actionsDict[actionId].value + obj.resultCount;
    
//           var date = new Date(el.timeStamp)
//           var dateStr = date.toLocaleDateString();
    
          
//           date.setSeconds(0);
//           date.setMilliseconds(0);
//           if (interval >= 60){
//             date.setMinutes(0);
//           }
    
//           if (interval>=24*60){
//             date.setHours(0);
//           }
    
//           const count = obj.resultCount
//           // actions[action] = 0
//           dates.push(date)
//           actionsIdList.push(actionId)
//           // datesStr.push(dateStr)
//           counts.push(count)
//           timestamps.push(date.getTime())

//         }
//       }
//       timestamps.sort();
//       var startTime = timestamps[0];
//       var numBins = (timestamps[timestamps.length-1] - startTime)/ (interval*60*1000)
//       numBins = Math.ceil(numBins) +1;


//       actions.map((action,i)=>{
        
//         var obj = {
//           name:action.name,
//           data:[]
//         }
//         for(var i=0;i<numBins;i++){
//           obj.data.push(0)
//         }
//         lineDataDict[action.id] = obj
//       })

        
//       var labels = []
//       for(var i=0;i<numBins;i++){
//         var date = new Date(startTime+interval*60*1000*i);
//         var datetimeStr = date.toLocaleDateString("vi-VN",
//         {
//             hourCycle: "h23",
//             hour: "2-digit",
//             minute: "2-digit",
//             // year: "2-digit",
//             day: "2-digit",
//             month: "2-digit",
//         }).split(", ").join(' ');
    
//         var dateStr = date.toLocaleDateString();
//         if (interval>= 24*60){
//           labels.push(dateStr)
//         }else{
//           labels.push(datetimeStr)
//         }
//       }


//       dates.map((date,i)=>{
//         var timestamp = date.getTime()
//         var diff = timestamp - startTime
//         var idx = diff /(interval*60*1000)
//         const action = actionsIdList[i];
//         var actionId = actionsDict[action].id
//         lineDataDict[actionId].data[idx] += counts[i];
//       })

//       for (let key in actionsDict ){
//         actionsCount.push(actionsDict[key])
//       }
//     }

//     var lineData = {labels:labels,data:[],numBins:numBins}
//     for (let key in lineDataDict ){
//       lineData.data.push(lineDataDict[key])
//     }
    
//     res.json({
//       data:{
//         lineData: lineData,
//         actionsCount: actionsCount,
//       },
//       success: true
//     });

//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ error: "Internal Server Error", message:error });
//   }
// });

router.post("/charts", async (req, res) => {
  try {
    const { classroomId, dateFrom, dateTo, interval = 10, activities } = req.body;

    if (!classroomId || !dateFrom || !dateTo || !activities || activities.length === 0) {
      return res.status(400).json({ error: "Thiếu tham số classroomId, dateFrom, dateTo hoặc activities[]" });
    }

    // 1. Lấy tất cả camera thuộc classroom
    const cameras = await Camera.findAll({ where: { classroom_id: classroomId } });
    const cameraIds = cameras.map(cam => cam.id);
    if (cameraIds.length === 0) {
      return res.json({ success: true, data: [], actionsCount: [], labels: [] });
    }

    // 2. Lấy tất cả video từ các camera
    const videos = await Video.findAll({
      where: {
        camera_id: { [Op.in]: cameraIds },
      },
    });
    const videoIds = videos.map(v => v.id);
    if (videoIds.length === 0) {
      return res.json({ success: true, data: [], actionsCount: [], labels: [] });
    }

    // 3. Lấy các activity_sequence thỏa điều kiện
    const sequences = await ActivitySequence.findAll({
      where: {
        video_id: { [Op.in]: videoIds },
        activity_id: { [Op.in]: activities },
        start_time: { [Op.gte]: dateFrom },
        end_time: { [Op.lte]: dateTo },
      },
    });

    if (sequences.length === 0) {
      return res.json({ success: true, data: [], actionsCount: [], labels: [] });
    }

    // 4. Gom theo thời gian và activity
    const timestamps = [];
    const sequenceData = [];
    const activityCountMap = {}; // tổng đếm mỗi loại activity
    const activitySet = new Set();

    sequences.forEach((seq) => {
      const activityId = seq.activity_id;
      const startTime = new Date(seq.start_time);

      activitySet.add(activityId);
      activityCountMap[activityId] = (activityCountMap[activityId] || 0) + 1;

      // Chuẩn hóa theo interval
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
      if (interval >= 60) startTime.setMinutes(0);
      if (interval >= 24 * 60) startTime.setHours(0);

      timestamps.push(startTime.getTime());
      sequenceData.push({ activityId, time: startTime.getTime() });
    });

    timestamps.sort();
    const startTime = timestamps[0];
    const endTime = timestamps[timestamps.length - 1];
    const numBins = Math.ceil((endTime - startTime) / (interval * 60 * 1000)) + 1;

    // 5. Tạo dữ liệu biểu đồ rỗng
    const lineDataDict = {};
    activitySet.forEach((activityId) => {
      lineDataDict[activityId] = {
        name: `Activity ${activityId}`,
        data: Array(numBins).fill(0),
      };
    });

    // 6. Lấp dữ liệu đếm theo thời gian
    sequenceData.forEach((item) => {
      const idx = Math.floor((item.time - startTime) / (interval * 60 * 1000));
      lineDataDict[item.activityId].data[idx] += 1;
    });

    // 7. Tạo nhãn (labels)
    const labels = [];
    for (let i = 0; i < numBins; i++) {
      const date = new Date(startTime + interval * 60 * 1000 * i);
      const label = interval >= 24 * 60
        ? date.toLocaleDateString()
        : date.toLocaleDateString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23",
            day: "2-digit",
            month: "2-digit",
          }).replace(", ", " ");
      labels.push(label);
    }

    // 8. Lấy tên hành động
    const activitiesInfo = await Activity.findAll();
    const activityMap = Object.fromEntries(activitiesInfo.map(a => [a.id, a.name]));

    for (const id in lineDataDict) {
      lineDataDict[id].name = activityMap[id] || `Activity ${id}`;
    }

    const lineData = {
      labels,
      data: Object.values(lineDataDict),
      numBins,
    };

    const actionsCount = Object.entries(activityCountMap).map(([id, count]) => ({
      id: parseInt(id),
      name: activityMap[id] || `Activity ${id}`,
      value: count,
    }));

    // 9. Trả kết quả
    res.json({
      success: true,
      data: {
        lineData,
        actionsCount,
      },
    });

  } catch (error) {
    console.error("Error in /charts route:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});




router.post("/tmp", async (req, res) => {
  const { limit = 20, page = 1, classroomId, dateFrom, dateTo } = req.body;

  try {
    const parsedLimit = parseInt(limit);
    const parsedPage = parseInt(page);
    const offset = (parsedPage - 1) * parsedLimit;

    // 1. Lấy danh sách camera thuộc room
    const cameras = await Camera.findAll({ where: { classroom_id: classroomId } });
    const cameraIds = cameras.map(cam => cam.id);

    if (cameraIds.length === 0) {
      return res.json({ actions: [], count: 0, numPage: 0 });
    }

    // 2. Lấy video thuộc camera trong khoảng thời gian (phân trang)
    const videoQuery = {
      where: {
        camera_id: { [Op.in]: cameraIds },
        start_time: { [Op.between]: [dateFrom, dateTo] },
      },
      limit: parsedLimit,
      offset,
    };

    const { count, rows: videos } = await Video.findAndCountAll(videoQuery);
    const numPage = Math.ceil(count / parsedLimit);
    const videoIds = videos.map(v => v.id);

    if (videoIds.length === 0) {
      return res.json({ actions: [], count: 0, numPage: 0 });
    }

    // 3. Lấy tất cả activity
    const activities = await Activity.findAll();
    const activityMap = Object.fromEntries(activities.map(act => [act.id, act.name]));

    // 4. Lấy tất cả activity_sequence thuộc các video này
    const sequences = await ActivitySequence.findAll({
      where: {
        video_id: { [Op.in]: videoIds },
      },
    });

    // 5. Định dạng kết quả
    const actions = sequences.map(seq => ({
      id_track: seq.id,
      activity: { name: activityMap[seq.activity_id] || "Unknown" },
      video: { id: seq.video_id },
      sequence_start_time: seq.start_time,
      sequence_end_time: seq.end_time,
    }));

    res.json({
      actions,
      count,
      numPage,
    });

  } catch (error) {
    console.error("Error in /tmp:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route post /api/statistics/drawActionChart
//@desp draw Action Chart
//@public access
router.post("/drawActionChart", async (req, res) => {
  const { classroomId, dateFrom, dateTo } = req.body;

  if (!classroomId || !dateFrom || !dateTo) {
    return res
      .status(400)
      .json({ success: false, message: "Missing classroomId, dateFrom or dateTo" });
  }

  try {
    // 1. Tìm tất cả camera thuộc lớp học
    const cameras = await Camera.findAll({ where: { classroom_id: classroomId } });
    const cameraIds = cameras.map((cam) => cam.id);

    if (cameraIds.length === 0) {
      return res.json({ success: true, message: "No cameras found", data: [] });
    }

    // 2. Tìm tất cả video từ các camera này
    const videos = await Video.findAll({
      where: { camera_id: { [Op.in]: cameraIds } },
    });
    const videoIds = videos.map((v) => v.id);

    if (videoIds.length === 0) {
      return res.json({ success: true, message: "No videos found", data: [] });
    }

    // 3. Lấy tất cả activity_sequence nằm trong khoảng thời gian
    const sequences = await ActivitySequence.findAll({
      where: {
        video_id: { [Op.in]: videoIds },
        start_time: { [Op.gte]: dateFrom },
        end_time: { [Op.lte]: dateTo },
      },
    });

    // 4. Đếm số lượng mỗi activity_id
    const activityCountMap = {};
    sequences.forEach((seq) => {
      const activityId = seq.activity_id;
      activityCountMap[activityId] = (activityCountMap[activityId] || 0) + 1;
    });

    // 5. Lấy tất cả activity và ghép số lượng vào
    const allActivities = await Activity.findAll();
    const completeResult = allActivities.map((activity) => {
      const plain = activity.get({ plain: true });
      return {
        ...plain,
        numberOfAction: activityCountMap[activity.id] || 0,
      };
    });

    res.json({
      success: true,
      message: "Success",
      data: completeResult,
    });

  } catch (error) {
    console.error("Error in /drawActionChart:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const nodeExcel = require("excel-export");
//@route post /api/statistics/export
//@desp exprot exel
//@public access
router.post("/export", async (req, res) => {
  const { classroomId, dateFrom, dateTo } = req.body;
  if (!classroomId || !dateFrom || !dateTo) {
    return res
      .status(400)
      .json({ success: false, message: "Missing any field!" });
  }
  try {
    const cameras = await Camera.findAll({
      where: { classroom_id: classroomId },
    });
    const imageIdArray = [];
    if (cameras) {
      for (const element of cameras) {
        const images = await Image.findAll({
          where: { cameraID: element.id },
        });
        images.forEach((el) => {
          imageIdArray.push(el.id);
        });
      }
    }
    const result = await RecognitionResult.findAll({
      where: {
        [Op.and]: [
          { imageID: { [Op.or]: imageIdArray } },
          { timeStamp: { [Op.between]: [dateFrom, dateTo] } },
        ],
      },
    });
    const completeResult = [];
    for (let el of result) {
      let newEl = JSON.parse(JSON.stringify(el));
      const image = await Image.findOne({
        where: { id: el.imageID },
      });
      const action = await Action.findOne({
        where: { id: el.actionID },
      });
      newEl.image = image;
      newEl.action = action;
      completeResult.push(newEl);
    }
    //all good

    let conf = {};
    conf.name = "mysheet";
    conf.cols = [
      { caption: "Action Name", type: "string" },
      { caption: "Description", type: "string" },
      { caption: "Image ID", type: "number" },
      { caption: "Result Count", type: "number" },
      { caption: "Timestamp", type: "date" },
    ];
    conf.rows = completeResult.map((item) => {
      return [
        item.action?.name,
        item.description.toString(),
        item.imageID,
        item.resultCount,
        new Date(item.timeStamp),
      ];
    });

    const excel = nodeExcel.execute(conf);
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Report.xlsx"
    );
    res.end(excel, "binary");
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get('/video-frames/:videoId', async (req, res) => {
  try {
    const video = await db.video.findByPk(req.params.videoId);
    if (!video) return res.status(404).json({ error: "Not found" });

    const folder = video.videoURL; // Đường dẫn tuyệt đối tới folder ảnh
    fs.readdir(folder, (err, files) => {
      if (err) return res.status(500).json({ error: "Cannot read folder" });
      // Lọc file ảnh, sắp xếp theo tên
      const images = files.filter(f => f.endsWith('.jpg') || f.endsWith('.png')).sort();
      // Tạo đường dẫn public cho frontend
      // Lấy phần sau 'storage\' trong đường dẫn tuyệt đối
      const storageIndex = folder.lastIndexOf('storage');
      const publicPath = folder.substring(storageIndex).replace(/\\/g, '/');
      res.json({
        frames: images.map(img => `/storage/${publicPath.split('/').slice(1).join('/')}/${img}`)
      });
    });
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Lấy danh sách video theo classroomId và khoảng thời gian
router.post("/videos", async (req, res) => {
  const { classroomId, dateFrom, dateTo } = req.body;
  console.log(req.body);
  try {
    // 1. Lấy tất cả camera thuộc classroom
    const cameras = await Camera.findAll({ where: { classroom_id: classroomId } });
    const cameraIds = cameras.map(cam => cam.id);
    if (cameraIds.length === 0) return res.json({ videos: [] });
    console.log("cameraIds", cameraIds);
    console.log("dateFrom", dateFrom);
    console.log("dateTo", dateTo);
    console.log("Video fields", Object.keys(Video.rawAttributes));
    // 2. Lấy tất cả video từ các camera trong khoảng thời gian
    const videos = await Video.findAll({
      where: {
        camera_id: { [Op.in]: cameraIds },
        start_time: { [Op.gte]: dateFrom },
        end_time: { [Op.lte]: dateTo },
      },
      //order: [['start_time', 'ASC']]
    });
    console.log("videos", videos);
    res.json({ videos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
