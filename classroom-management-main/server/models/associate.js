module.exports = (db) => {
  // Camera - Classroom association
  db.classroom.hasMany(db.camera, { 
      foreignKey: "classroom_id",
      as: "cameras"
  });
  
  db.camera.belongsTo(db.classroom, { 
      foreignKey: "classroom_id",
      as: "room"
  });

  // Camera - Video association
  db.camera.hasMany(db.video, { 
      foreignKey: "camera_id"
  });
  
  db.video.belongsTo(db.camera, { 
      foreignKey: "camera_id"
  });

  // Video - ActivitySequence association
  db.video.hasMany(db.activitySequence, { 
      foreignKey: "video_id"
  });
  
  db.activitySequence.belongsTo(db.video, { 
      foreignKey: "video_id"
  });

  // Activity - ActivitySequence association
  db.activity.hasMany(db.activitySequence, { 
      foreignKey: "activity_id"
  });
  
  db.activitySequence.belongsTo(db.activity, { 
      foreignKey: "activity_id"
  });

  // ActivitySequence - BoundingBox association
  db.activitySequence.hasMany(db.boundingBox, { 
      foreignKey: "sequence_id"
  });
  
  db.boundingBox.belongsTo(db.activitySequence, { 
      foreignKey: "sequence_id"
  });

  // Debug logging
  console.log("Associations set up:", {
      cameraRoom: db.camera.associations.room,
      classroomCameras: db.classroom.associations.cameras
  });
};
