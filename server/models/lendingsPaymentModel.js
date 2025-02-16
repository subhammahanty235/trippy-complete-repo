module.exports = (sequelize, DataTypes) => {
    const LendingsPayment = sequelize.define('LendingsPayment' , {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        expenseSplitId:{
            type: DataTypes.INTEGER,
        },
        paymentDate:{
            type:DataTypes.DATE
        },
        paymentMethod:{
            type:DataTypes.STRING,
        },
        //in case of cash payments we will send a notification to the lender to confirm the payment status
        confirmationStatus:{
            type:DataTypes.BOOLEAN,
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

    return LendingsPayment;

}