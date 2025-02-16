module.exports = (sequelize, DataTypes) => {
    const Connection = sequelize.define('Connections', {
        connectionId: { //ID of the connection
            allowNull: false,
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: { //ID of the user who adds the connection
            type: DataTypes.INTEGER,

        },
        isPlcUser: {
            type: DataTypes.BOOLEAN,
        },
        connectionUserId: { // ID of the user who is being connected to
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isBlocked:{
            type:DataTypes.BOOLEAN,
            default:false,
        },
        isDeleted:{
            type:DataTypes.BOOLEAN,
            default:false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },


    })

    return Connection
}