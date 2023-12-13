'use strict';
const bcrypt = require('bcryptjs')

module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        role: 'admin',
        avatar: 'https://i.imgur.com/Kv5ixy8.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user1',
        email: 'user1@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        role: 'user',
        avatar: 'https://i.imgur.com/Kv5ixy8.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'user2',
        email: 'user2@example.com',
        password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10)),
        role: 'user',
        avatar: 'https://i.imgur.com/Kv5ixy8.jpeg',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {})
    
 
  },

  down: async(queryInterface, Sequelize) => {
     await queryInterface.bulkDelete('Users', null, {})

  }
};
