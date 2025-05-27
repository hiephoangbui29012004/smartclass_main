module.exports = (sequelize, Sequelize) => {
  const Video = sequelize.define(
    "video",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      camera_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'camera',
          key: 'id'
        }
      },
      videoURL: {
        type: Sequelize.TEXT('long'),
      },
      resultURL: {
        type: Sequelize.TEXT('long'),
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: "video",
    }
  );

  return Video;
};

