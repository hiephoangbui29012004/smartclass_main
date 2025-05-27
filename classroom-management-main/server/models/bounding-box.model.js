module.exports = (sequelize, Sequelize) => {
  const BoundingBox = sequelize.define(
    "bounding_box",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      sequence_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'activity_sequence',
          key: 'id'
        }
      },
      frame_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      box_top: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      box_left: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      box_right: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      box_bottom: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      score: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      
    },
    {
      timestamps: false,
      tableName: "bounding_box",
    }
  );

  return BoundingBox;
} 