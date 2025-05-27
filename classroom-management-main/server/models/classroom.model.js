module.exports = (sequelize, Sequelize) => {
  const Classroom = sequelize.define(
    "classroom",
    { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'name'
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'address'
      },
      capacity: {
        type: Sequelize.INTEGER,
        field: 'capacity'
      }
    },
    {
      timestamps: false,
      tableName: "classroom",
      underscored: true
    }
  );

  return Classroom;
};
