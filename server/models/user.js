// models/user.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
          },
          name: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          bio:{
            type: DataTypes.STRING,
          },
          emailId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
          },
          profilePic: {
            type: DataTypes.STRING,
          },
          primaryLogIn: {
            type: DataTypes.STRING,
          },
          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },
    });

    return User;
};
