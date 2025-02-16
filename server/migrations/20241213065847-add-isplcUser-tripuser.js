'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('TripUserData', 'isPlcUser', {
      type: Sequelize.DataTypes.BOOLEAN, 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('TripUserData', 'isPlcUser', {
      type: Sequelize.DataTypes.BOOLEAN, 
    });
  }
};
