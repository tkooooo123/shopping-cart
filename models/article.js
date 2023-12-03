'use strict';
module.exports = (sequelize, DataTypes) => {
  const article = sequelize.define('article', {
    author: DataTypes.STRING,
    description: DataTypes.STRING,
    content: DataTypes.STRING,
    image: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN,
    tag: DataTypes.JSON
  }, {});
  article.associate = function(models) {
    // associations can be defined here
  };
  return article;
};