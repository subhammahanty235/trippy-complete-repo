module.exports = {
  up: async (queryInterface, Sequelize) => {
      try {
          // Remove any existing constraints
          await queryInterface.sequelize.query(`
              ALTER TABLE "TripUserData" 
              DROP CONSTRAINT IF EXISTS "TripUserData_userId_fkey";
          `).catch(err => console.log('Removing existing constraints:', err));

          // Add foreign key for userId
          await queryInterface.addConstraint('TripUserData', {
              fields: ['userId'],
              type: 'foreign key',
              name: 'TripUserData_userId_fkey',
              references: {
                  table: 'Users',
                  field: 'id'
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE'
          });

          // Add an index to improve query performance
          await queryInterface.addIndex('TripUserData', ['userId', 'isPlcUser']);

      } catch (error) {
          console.error('Migration failed:', error);
          throw error;
      }
  },

  down: async (queryInterface, Sequelize) => {
      // Remove the constraints and index in reverse order
      await queryInterface.removeIndex('TripUserData_userId_fkey', ['userId', 'isPlcUser']);
      await queryInterface.removeConstraint('TripUserData', "TripUserData_userId_fkey")
          .catch(err => console.log('Error removing constraint:', err));
  }
};