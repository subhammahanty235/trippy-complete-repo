module.exports = (sequelize, DataTypes) => {
    const Trip = sequelize.define('Trip', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        tripName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tripDescription: {
            type: DataTypes.STRING,
        },
        creatorId: {
            type: DataTypes.INTEGER,
        },
        tripUniqueCode: {
            type: DataTypes.STRING,
        },
        tripBeginDate: {
            type: DataTypes.DATE,
        },
        tripEndDate: {
            type: DataTypes.DATE,
        },
        budget: {
            type: DataTypes.INTEGER
        },
        isDraft:{
            type: DataTypes.BOOLEAN,
            defaultValue:false,
        },
        defaultCurrency: {
            type: DataTypes.STRING,
        },
        isDeleted:{
            type:DataTypes.BOOLEAN,
            default:false,
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
    return Trip;
}