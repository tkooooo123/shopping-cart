'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('CartItems', 'cartId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'Cart',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('CartItems', 'cartId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      reference: {
        model: 'Category',
        key: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  }
};
