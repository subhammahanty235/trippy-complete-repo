'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'bio', {
      type: Sequelize.DataTypes.STRING, 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'bio');
  }
};
