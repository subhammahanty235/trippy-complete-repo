'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const readModels = (dir) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      // Recursively read subdirectories
      readModels(fullPath);
    } else if (
      file.indexOf('.') !== 0 && // Ignore hidden files
      file !== basename && // Exclude this index file
      file.slice(-3) === '.js' && // Include only .js files
      file.indexOf('.test.js') === -1 // Exclude test files
    ) {
      const model = require(fullPath)(sequelize, Sequelize.DataTypes);
      console.log("------------------------------")
      console.log(model.name)
      db[model.name] = model;
    }
  });
};

// Start reading models from the current directory
readModels(__dirname);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});



db.sequelize = sequelize;
db.Sequelize = Sequelize;

// db.Connections.belongsTo(db.User, { foreignKey: 'userId', as: 'initiator' }); // User who initiates the connection
db.Connections.belongsTo(db.User, { foreignKey: 'connectionUserId', as: 'connectedUser' }); // User who is being connected to
// db.User.hasMany(db.Connections, { foreignKey: 'userId', sourceKey: 'id', as: 'connections' });
db.User.hasMany(db.Connections, { foreignKey: 'connectionUserId', sourceKey: 'id', as: 'connectedUsers' });

db.Connections.belongsTo(db.PreLoggedUser, { foreignKey: 'connectionUserId', as: 'preLoggedConnectedUser'}); // User who is being connected to
// db.User.hasMany(db.Connections, { foreignKey: 'userId', sourceKey: 'id', as: 'connections' });
db.PreLoggedUser.hasMany(db.Connections, { foreignKey: 'connectionUserId', sourceKey: 'id', as: 'preLoggedConnectedUser' });
db.TripUserData.belongsTo(db.User, {foreignKey:"userId", as: "people"})
db.TripUserData.belongsTo(db.PreLoggedUser, {foreignKey:"userId", as: "plcUser"})
db.User.hasMany(db.TripUserData, {foreignKey:"userId", sourceKey:'id', as:'people'})
db.Trip.hasMany(db.TripUserData, {foreignKey: 'tripId', as: 'tripUsers' });
db.TripUserData.belongsTo(db.Trip, {foreignKey: 'tripId', as: 'trip'});

// ExpenseSplit belongs to User
db.ExpenseSplit.belongsTo(db.User, { foreignKey: "paidBy", targetKey: "id", as: "lender" });

// User has many ExpenseSplit
db.User.hasMany(db.ExpenseSplit, { foreignKey: "paidBy", sourceKey: "id", as: "lender" });

// ExpenseSplit belongs to Expense
db.ExpenseSplit.belongsTo(db.TripExpense, { foreignKey: "expenseId", targetKey: "id", as: "expense" });

// Expense has many ExpenseSplit
db.TripExpense.hasMany(db.ExpenseSplit, { foreignKey: "expenseId", sourceKey: "id", as: "expense" });

// ExpenseSplit belongs to Expense
db.PaymentMethodUser.belongsTo(db.PaymentMethods, { foreignKey: "paymentMethodKey", targetKey: "id", as: "paymentMethodDetails" });

// Expense has many ExpenseSplit
db.PaymentMethods.hasMany(db.PaymentMethodUser, { foreignKey: "paymentMethodKey", sourceKey: "id", as: "paymentMethodDetails" });




module.exports = db;
