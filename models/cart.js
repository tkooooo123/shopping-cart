'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    id: DataTypes.INTEGER
  }, {});
  Cart.associate = function(models) {
    Cart.belongsToMany(models.Product, {
      through: {
        model: models.CartItem,
        unique: false
      },
      foreignKey: 'cartId',
      as: 'cartProducts'
    })
    // associations can be defined here
  };
  return Cart;
};