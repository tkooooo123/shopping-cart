'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    userId: DataTypes.INTEGER
  }, {});
  Cart.associate = function (models) {
    Cart.belongsTo(models.User)
    Cart.belongsToMany(models.Product, {
      through: {
        model: models.CartItem,
        unique: false
      },
      foreignKey: 'cartId',
      as: 'cartProducts'
    })
    Cart.hasMany(models.CartItem, {
      onDelete: 'cascade',
      hooks: true
    })
    // associations can be defined here
  };
  return Cart;
};