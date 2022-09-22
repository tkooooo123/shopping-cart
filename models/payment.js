'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    orderId: DataTypes.INTEGER,
    payment_method: DataTypes.STRING,
    params: DataTypes.STRING,
    paid_at: DataTypes.DATE
  }, {});
  Payment.associate = function(models) {
    // associations can be defined here
  };
  return Payment;
};