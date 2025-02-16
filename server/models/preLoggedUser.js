module.exports = (sequelize, DataTypes) => {
    const PreLoggedUser = sequelize.define('PreLoggedUser', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        emailId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdBy: {
            type: DataTypes.INTEGER,
        },
        isAccountCreated:{
            type:DataTypes.BOOLEAN,
            defaultValue:false,
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue:new Date()
        },
    })

    return PreLoggedUser
}