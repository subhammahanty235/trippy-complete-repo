module.exports = (sequelize, DataTypes) => {
    const TripExpense = sequelize.define('TripExpense', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        title:{
            type: DataTypes.STRING
        },
        description:{
            type: DataTypes.STRING
        },
        userId:{
            type: DataTypes.INTEGER,
        },
        tripId:{
            type: DataTypes.INTEGER,
        },
        totalExpanse:{
            type:DataTypes.STRING
        },
        paymentMethod:{
            type:DataTypes.STRING
        },
        splitPattern:{
            type:DataTypes.STRING
        },
        // splittedPeople:{
        //     type: DataTypes.ARRAY(DataTypes.INTEGER)
        // },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    })
    return TripExpense;
}