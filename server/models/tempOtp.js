
module.exports = (sequelize, DataTypes) => {
    const TempOTP = sequelize.define('TempOTP', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        emailId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otpCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiry: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        verificationStatus: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    return TempOTP;
};