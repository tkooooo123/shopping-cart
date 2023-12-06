'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    userId: DataTypes.INTEGER,
    sn: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    payment_status: DataTypes.STRING,
    shipping_status: DataTypes.STRING,
    email: DataTypes.STRING,
    message: DataTypes.STRING
  }, {});
  Order.associate = function(models) {
    Order.belongsTo(models.User)
    Order.belongsToMany(models.Product,{
      through: {
        model:models.OrderItem,
        unique: false
      },
      foreignKey: 'orderId',
      as: 'orderProducts'

    })
    
  };
  return Order;
};