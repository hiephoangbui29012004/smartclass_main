module.exports = (sequelize, Sequelize) => {
  const Account = sequelize.define(
    "accounts",
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'username'
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'password'
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'fullname'
      },
      role: {
        type: Sequelize.STRING,
        field: 'role'
      },
      email: {
        type: Sequelize.STRING,
        field: 'email'
      },
    },
    {
      timestamps: false,
      tableName: "account",
      underscored: true
    }
  );

  return Account;
}; 