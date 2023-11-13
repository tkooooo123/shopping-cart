'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    is_enabled:DataTypes.BOOLEAN,
    content: DataTypes.STRING,
    imagesUrl: DataTypes.JSON
  }, {});
  Product.associate = function(models) {
    Product.belongsTo(models.Category)
    Product.belongsToMany(models.Cart, {
      through: {
        model: models.CartItem,
        unique: false
      },
      foreignKey: 'productId',
      as: 'cartProducts'
    })
    Product.belongsToMany(models.Order, {
      through: {
        model: models.OrderItem,
        unique: false
      },
      foreignKey: 'productId',
      as: 'orderProducts'
    })

  };
  return Product;
};