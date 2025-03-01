module.exports = (sequelize, DataTypes) => {
    const Connection = sequelize.define('Connections', {
        connectionId: {
            allowNull: false,
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
        },
        isPlcUser: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        connectionUserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        isBlocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    }, {
        // hooks: {
        //     beforeCreate: async (connection, options) => {
        //         if (connection.isPlcUser) {
        //             const plcUser = await sequelize.models.PreLoggedUser.findByPk(connection.connectionUserId);
        //             if (!plcUser) throw new Error('Referenced PLC user not found');
        //         } else {
        //             const user = await sequelize.models.User.findByPk(connection.connectionUserId);
        //             if (!user) throw new Error('Referenced user not found');
        //         }
        //     },
        //     beforeUpdate: async (connection, options) => {
        //         if (connection.changed('connectionUserId') || connection.changed('isPlcUser')) {
        //             if (connection.isPlcUser) {
        //                 const plcUser = await sequelize.models.PreLoggedUser.findByPk(connection.connectionUserId);
        //                 if (!plcUser) throw new Error('Referenced PLC user not found');
        //             } else {
        //                 const user = await sequelize.models.User.findByPk(connection.connectionUserId);
        //                 if (!user) throw new Error('Referenced user not found');
        //             }
        //         }
        //     }
        // }
    });

    return Connection;
};