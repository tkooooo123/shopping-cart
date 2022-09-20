'use strict';
const db = require('../models')
const { Cart, Product } = db

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const carts = await Cart.findAll()
    const products = await Product.findAll()
    await queryInterface.bulkInsert('CartItems',
      Array.from({ length: 10 }).map((v, i) => ({
        cartId: carts[i % (carts.length)].id,
        productId: products[Math.floor(Math.random() * 50)].id,
        quantity: Math.floor(Math.random() * 10 + 1),
        createdAt: new Date,
        updatedAt: new Date
      })),
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Cartitems', null, {})
  }
};
