'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Users', 'avatar', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'https://i.imgur.com/Kv5ixy8.jpeg'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Users', 'avatar')
  }
};
