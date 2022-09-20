'use strict';
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    cartId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});
  CartItem.associate = function(models) {
   
    // associations can be defined here
  };
  return CartItem;
};