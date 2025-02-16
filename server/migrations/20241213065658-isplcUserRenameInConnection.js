'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Connections', 'isConnectionTemp', 'isPlcUser');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Connections', 'isPlcUser', 'isConnectionTemp');
  }
};