'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    avatar: DataTypes.STRING,
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Cart)
    User.hasMany(models.Order)
    // associations can be defined here
  };
  return User;
};