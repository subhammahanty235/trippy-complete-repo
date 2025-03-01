'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // First, check if there are any duplicate connectionId values that would violate the unique constraint
      const [results] = await queryInterface.sequelize.query(`
        SELECT "connectionId", COUNT(*) 
        FROM "Connections" 
        GROUP BY "connectionId" 
        HAVING COUNT(*) > 1
      `);

      if (results.length > 0) {
        console.warn('Warning: Duplicate connectionId values found. Fix these before adding the unique constraint.');
        console.warn('Duplicate connectionIds:', results.map(r => r.connectionId).join(', '));
        throw new Error('Cannot add unique constraint: duplicate values exist');
      }

      // Add the unique constraint to the connectionId column
      await queryInterface.addConstraint('Connections', {
        fields: ['connectionId'],
        type: 'unique',
        name: 'Connections_connectionId_key'
      });

      console.log('Successfully added unique constraint to connectionId column in Connections table');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove the unique constraint
      await queryInterface.removeConstraint('Connections', 'Connections_connectionId_key');
      console.log('Successfully removed unique constraint from connectionId column in Connections table');
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }
};