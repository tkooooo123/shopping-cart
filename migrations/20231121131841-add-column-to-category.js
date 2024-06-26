'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.addColumn('Categories', 'image', {
      type: Sequelize.STRING,
      allowNull: false
    })
   
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.removeColumn('Categories', 'image')
  }
};
