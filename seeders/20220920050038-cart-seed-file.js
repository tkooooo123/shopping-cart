'use strict';
const db = require('../models')
const { User } =db 
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await User.findAll({ where: { role: 'user' }})
    await queryInterface.bulkInsert('Carts',
      Array.from({ length: 3 }).map((v, i) => ({
        userId: users[i % 2].id,
        createdAt: new Date,
        updatedAt: new Date

      })),
      {}
    )

   
  },

  down: async(queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Carts', null, {})
   
  }
};
