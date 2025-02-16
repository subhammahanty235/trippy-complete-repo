'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
    up: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('TripExpenses', 'splitPattern', {
        type: Sequelize.STRING,
        allowNull: true, // or false, depending on your requirement
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('TripExpenses', 'splitPattern', {
        type: Sequelize.INTEGER,
        allowNull: true, // or false, depending on your requirement
      });
    }
  
};
