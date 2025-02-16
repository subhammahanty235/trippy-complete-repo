module.exports = (sequelize, DataTypes) => {
    const paymentMethodUser = sequelize.define('PaymentMethodUser', {
        id:{
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        userId:{
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        paymentMethodKey:{
            type:DataTypes.INTEGER,
            allowNull: false,
        },
        //to store the payment details like UPI id or qr code
        paymentDetails:{
            type:DataTypes.STRING
        },
        //it will be only turned to true after user will satisfy some given scenarios
        isVerified:{
            type:DataTypes.BOOLEAN,
            defaultValue : false,
        },
        isDeleted:{
            type:DataTypes.BOOLEAN,
            defaultValue : false,
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

    return paymentMethodUser
}