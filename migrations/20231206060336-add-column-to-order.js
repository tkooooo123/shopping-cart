'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Orders', 'message', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.addColumn('Orders', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
      }),

    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Orders', 'message'),
      queryInterface.removeColumn('Orders', 'email'),
    ])
  }
};
