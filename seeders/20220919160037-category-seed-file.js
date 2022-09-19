'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = ['食品', '玩具', '傢俱', '日常用品']
    await queryInterface.bulkInsert('Categories',
      Array.from({ length: 4 }).map((v, i) => ({
        name: categories[i],
        createdAt: new Date,
        updatedAt: new Date
      })),
      {}
    )
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {})
    
  }
};
