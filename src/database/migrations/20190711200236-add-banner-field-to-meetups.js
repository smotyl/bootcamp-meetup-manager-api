module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'meetups', // table name
      'banner_id', // field name
      {
        type: Sequelize.INTEGER,
        references: { model: 'files', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      }
    );
  },

  down: queryInterface => {
    return queryInterface.removeColumn('meetups', 'banner_id');
  },
};
