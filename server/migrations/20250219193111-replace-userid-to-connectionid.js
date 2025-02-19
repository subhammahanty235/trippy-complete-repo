'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ExpenseSplits', 'userId', 'connectionId');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('ExpenseSplits', 'connectionId', 'userId');
  }
};