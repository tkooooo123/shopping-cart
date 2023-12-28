'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Orders', 'osn', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Orders', 'osn')
  }
};
