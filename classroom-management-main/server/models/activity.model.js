module.exports = (sequelize, Sequelize) => {
  const Activity = sequelize.define(
    "activity",
    { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      sample: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: "activity",
    }
  );
  
  return Activity;
};
