'use strict';
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    author: DataTypes.STRING,
    description: DataTypes.STRING,
    content: DataTypes.STRING,
    image: DataTypes.STRING,
    isPublic: DataTypes.BOOLEAN,
    tag: DataTypes.STRING,
    title:DataTypes.STRING
  }, {});
  Article.associate = function(models) {
    // associations can be defined here
  };
  return Article;
};