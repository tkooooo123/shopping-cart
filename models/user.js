'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Cart)
    // associations can be defined here
  };
  return User;
};