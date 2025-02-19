module.exports = (sequelize, DataTypes) => {
    const ExpenseSplit = sequelize.define('ExpenseSplit' , {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        tripId:{
            type: DataTypes.INTEGER,
        },
        paidBy:{
            type: DataTypes.INTEGER,
        },
        amount:{
            type: DataTypes.INTEGER,
        },
        //id of the user who is tagged in the expanse
        //modifying it to store connectionId , so streamline the complete process and make it more scalable
        // userId:{
        //     type: DataTypes.INTEGER,
        // },
        connectionId:{
            type: DataTypes.INTEGER,
        },
        paymentStatus:{
            type: DataTypes.BOOLEAN,
            defaultValue:false,
        },
        expenseId:{
            type: DataTypes.INTEGER,
        },
        //will also store the date of payment (or entry added date)
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue:new Date(),
        },
    })

    return ExpenseSplit;

}