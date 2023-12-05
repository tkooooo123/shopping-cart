'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('Products','is_enabled', {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }),
      //queryInterface.addColumn('Products','imagesUrl', {
        //type: Sequelize.JSON,
        //defaultValue: [] 
        
      //}),
      queryInterface.addColumn('Products','content', {
        type: Sequelize.STRING,
        allowNull: false
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Products', 'is_enabled'),
     // queryInterface.removeColumn('Products', 'imagesUrl'),
      queryInterface.removeColumn('Products', 'content'),
    ])
  }
};
