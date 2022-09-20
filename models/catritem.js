'use strict';
module.exports = (sequelize, DataTypes) => {
  const CatrItem = sequelize.define('CatrItem', {
    cartId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});
  CatrItem.associate = function(models) {
    // associations can be defined here
  };
  return CatrItem;
};