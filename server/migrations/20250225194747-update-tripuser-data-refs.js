// migrations/YYYYMMDDHHMMSS-modify-tripuserdata-constraints.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('TripUserData', 'TripUserData_userId_fkey');
    
    await queryInterface.changeColumn('TripUserData', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('TripUserData', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    });
  }
};