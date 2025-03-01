module.exports = {
  up: async (queryInterface, Sequelize) => {
      try {
          // Remove any existing constraints
          await queryInterface.sequelize.query(`
              ALTER TABLE "Connections" 
              DROP CONSTRAINT IF EXISTS "Connections_connectionUserId_fkey",
              DROP CONSTRAINT IF EXISTS "Connections_userId_fkey";
          `).catch(err => console.log('Removing existing constraints:', err));

          // Add foreign key for userId
          await queryInterface.addConstraint('Connections', {
              fields: ['userId'],
              type: 'foreign key',
              name: 'Connections_userId_fkey',
              references: {
                  table: 'Users',
                  field: 'id'
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE'
          });

          // Add an index to improve query performance
          await queryInterface.addIndex('Connections', ['connectionUserId', 'isPlcUser']);

      } catch (error) {
          console.error('Migration failed:', error);
          throw error;
      }
  },

  down: async (queryInterface, Sequelize) => {
      // Remove the constraints and index in reverse order
      await queryInterface.removeIndex('Connections', ['connectionUserId', 'isPlcUser']);
      await queryInterface.removeConstraint('Connections', 'Connections_userId_fkey')
          .catch(err => console.log('Error removing constraint:', err));
  }
};