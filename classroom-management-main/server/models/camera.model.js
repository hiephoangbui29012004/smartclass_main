module.exports = (sequelize, Sequelize) => {
  const Camera = sequelize.define(
    "camera",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      classroom_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'classroom_id',
  
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'name'
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'ipAddress'
      },
      spec: {
        type: Sequelize.STRING,
        field: 'spec'
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'status'
      },
      streamLink: {
        type: Sequelize.STRING,
        allowNull: true,
        field: 'streamLink'
      },
      description: {
        type: Sequelize.STRING,
        field: 'description'
      }
    },
    {
      timestamps: false,
      tableName: "camera",
      underscored: true
    }
  );

  return Camera;
};