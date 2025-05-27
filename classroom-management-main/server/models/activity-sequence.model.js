module.exports = (sequelize, Sequelize) => {
  const ActivitySequence = sequelize.define(
    "activity_sequence",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      video_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'video',
          key: 'id'
        }
      },
      activity_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'activity',
          key: 'id'
        }
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.DATE,
      },
      length: {
        type: Sequelize.INTEGER,
      }
    },
    {
      timestamps: false,
      tableName: "activity_sequence",
    }
  );

  return ActivitySequence;
};
