const { Sequelize } = require('sequelize');

const db_name = process.env.DB_NAME;
const db_host = process.env.DB_HOST;
const db_admin = process.env.DB_ADMIN;
const db_password = process.env.DB_PASSWORD;
const db_port = process.env.DB_PORT;

const sequelize = new Sequelize(db_name, db_admin, db_password, {
    host: db_host,
    port: db_port,
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});


async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = { sequelize, connectDB };
