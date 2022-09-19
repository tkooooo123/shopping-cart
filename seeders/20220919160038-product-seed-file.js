'use strict';
const db = require('../models')
const { Category } = db
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const categories = await Category.findAll()
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 50 }).map((v, i) => ({
        categoryId: categories[i % 4].id,
        name: faker.name.firstName(),
        image: `https://loremflickr.com/640/480/food/?lock=${Math.random() * 1000}`,
        description: faker.lorem.sentences(1),
        quantity: Math.floor(Math.random() * 100),
        price: 5 * (Math.floor(Math.random() * 100)) + 100,
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
