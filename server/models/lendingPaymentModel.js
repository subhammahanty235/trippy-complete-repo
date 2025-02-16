module.exports = (sequelize, DataTypes) => {
    const LendingPayment = sequelize.define('LendingPayment', {
        id:{
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        expenseSplitId:{
            type: DataTypes.INTEGER,
        },
        paymentDate:{
            type:DataTypes.DATE,
        },
        paymentMethod:{
            type:DataTypes.INTEGER,
        },
        paymentConfirmation:{
            type:DataTypes.INTEGER,
            defaultValue:0, //0--> Pending, 1---> Confirmed , 2--->rejected
        },
        paymentConfirmationDate:{
            type:DataTypes.DATE,
        },
        //ref number will be generated after confirmation
        paymentReferenceNumber:{
            type:DataTypes.STRING
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue:new Date(),
        },
    })

    return LendingPayment;
}