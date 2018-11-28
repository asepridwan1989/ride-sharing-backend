'use strict';
const bcrypt = require('bcrypt')
const saltRounds = 10
const plainPassword = 'johndoe1234'
const salt = bcrypt.genSaltSync(saltRounds)
const hash = bcrypt.hashSync(plainPassword, salt)
const password = hash

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Users', [{
        firstName: 'John',
        lastName: 'Doe',
        email: 'jdoe@gmail.com',
        password: password,
        role: 'firstadmin',
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
