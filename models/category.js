'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {});
  Category.associate = function(models) {
    Category.hasMany(models.Product, { onDelete: 'cascade', hooks:true })
  };
  return Category;
};