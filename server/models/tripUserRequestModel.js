//to store the data related to requests or user who sends a request to join a trip

module.exports = (sequelize, DataTypes) => {
    const TripUserRequest = sequelize.define('PreLoggedUser', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        requestedUserId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tripId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isAccepted:{
            type:DataTypes.BOOLEAN,
            defaultValue : false,
        },
        isRejected:{
            type:DataTypes.BOOLEAN,
            defaultValue : false,
        },
        actionTakenBy:{
            type: DataTypes.INTEGER,
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
    return TripUserRequest
}   