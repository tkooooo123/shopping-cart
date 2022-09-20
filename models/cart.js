'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    userId: DataTypes.INTEGER
  }, {});
  Cart.associate = function(models) {
    Cart.belongsTo(models.User)
    
    // associations can be defined here
  };
  return Cart;
};