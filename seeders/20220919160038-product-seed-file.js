'use strict';
const db = require('../models')
const { Category } = db
const faker = require('faker')
const categoryName = [ 'pet-food', 'pet-toy', 'pet-furniture', 'pet-supplies' ]
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await Category.findAll()
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 50 }).map((v, i) => ({
        categoryId: categories[i % 4].id,
        name: faker.name.firstName(),
        image: `https://loremflickr.com/640/480/${categoryName[i % 4]}/?lock=${Math.floor(Math.random() * 100)}`,
        description: faker.lorem.sentences(1),
        quantity: Math.floor(Math.random() * 100 + 50),
        price: 5 * (Math.floor(Math.random() * 100)) + 100,
        is_enabled: true,
        imagesUrl: JSON.stringify([]),
        content: '',
        createdAt: new Date,
        updatedAt: new Date
      })),
      {}
    )

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})

  }
};
