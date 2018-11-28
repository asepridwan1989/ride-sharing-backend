'use strict';
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const bcrypt = require('bcrypt')

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      validate: {
        isUnique(value, next) {
          let objUserName = {
            username: value
          }
          if(this.id !== null) {
            objUserName = {
              username: value,
              id: {
                [Op.ne]: this.id
              }
            }
          }
          sequelize.models.User.findOne({
            where: objUserName
          })
          .then(inputUserName => {
            if(inputUserName) {
              next('username is already exist')
            }else{
              next()
            }
          })
          .catch(err => {
            next(err)
          })
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: 'Email format is incorrect'
        },
        isUnique(value, next) {
          let objEmail = {
            email: value
          }
          if(this.id !== null) {
            objEmail = {
              email: value,
              id: {
                [Op.ne]: this.id
              }
            }
          }
          sequelize.models.User.findOne({
            where: objEmail
          })
          .then(inputEmail => {
            if(inputEmail) {
              next('Email is already exist')
            }else{
              next()
            }
          })
          .catch(err => {
            next(err)
          })
        }
      }
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Passenger)
    User.belongsToMany(models.Trip,{through: models.Passenger})
  };
  User.beforeSave((user, options) => {
    const saltRounds = 10
    const plainPassword = user.password
    const salt = bcrypt.genSaltSync(saltRounds)
    const hash = bcrypt.hashSync(plainPassword, salt)
    user.password = hash
  })
  return User;
};
