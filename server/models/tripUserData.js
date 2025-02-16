module.exports = (sequelize, DataTypes) => {
    const TripUserData = sequelize.define('TripUserData', {
        id: {
            allowNull: false,
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        //to handle plc user cases
        isPlcUser:{
            type:DataTypes.BOOLEAN
        },
        tripId: {
            type: DataTypes.INTEGER,
        },
        //when ever someone will add a person to a trip, the invited person will recieve an email and notificatio, to accept the trip
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1
            // 1-> Pending , 2-> Accepted, 3-> Rejected
        },
        joinedVia: {
            type: DataTypes.INTEGER
            // 1-> invite , 2 -> searched and requested
        },
        permission: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            // 1-> Viewer, 2-> Manager , 3-> Admin
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
    return TripUserData
}