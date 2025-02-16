module.exports = (sequelize, DataTypes) => {
    const PaymentMethods = sequelize.define('PaymentMethods', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: DataTypes.INTEGER,
            autoIncrement: true,
        },
        paymentMethodName:{
            type:DataTypes.STRING
        },
        paymentMethodDescription:{
            type:DataTypes.STRING
        },
        paymentMethodIcon:{
            type:DataTypes.STRING
        },
        //to specify the field name for the payment Method, like for UPI paymentMethod it will be UPI ID/Mobile Number
        paymentKey:{
            type:DataTypes.STRING
        },
        verificationString:{
            type:DataTypes.STRING,
            defaultValue:""
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

    return PaymentMethods
}