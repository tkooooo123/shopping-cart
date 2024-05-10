'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Products','isEnabled', {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }),
      queryInterface.addColumn('Products','imagesUrl', {
        type: Sequelize.STRING,
      }),
      queryInterface.addColumn('Products','content', {
        type: Sequelize.STRING,
        allowNull: false
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Products', 'isEnabled'),
     queryInterface.removeColumn('Products', 'imagesUrl'),
      queryInterface.removeColumn('Products', 'content'),
    ])
  }
};
