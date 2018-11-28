const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Model = require('../models')
const getId = require('../helpers/getId')

const getUserData = async(req, res) => {
  try{
    let allUser = await Model.User.findAll()
    res.status(200).json({
      message: 'success to get user data',
      data: allUser
    })
  }catch(err){
    res.status(500).json({
      message: 'failed to get all user data'
    })
  }
}

const createUser = async(req, res) => {
  try{
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let role = req.body.role
    if(!firstName){
      res.status(400).json({
        message: 'first name is required'
      })
    }
    if(!lastName){
      res.status(400).json({
        message: 'last name is required'
      })
    }
    if(!username){
      res.status(400).json({
        message: 'username is required'
      })
    }
    if(!email){
      res.status(400).json({
        message: 'email is required'
      })
    }
    if(!password){
      res.status(400).json({
        message: 'password is required'
      })
    }
    if(!role){
      res.status(400).json({
        message: 'role is required'
      })
    }
    let userData = {
      firstName,
      lastName,
      username,
      email,
      password,
      role
    }
    let newUser = await Model.User.create(userData)
    res.status(201).json({
      message: 'new user was successfully registered',
      data: newUser
    })
  }catch(err){
    res.status(500).json({
      message: err.errors[0].message
    })
  }
}

const signin = async(req, res) => {
  try{
    const username = req.body.username
    const password = req.body.password
    if(!username || !password){
      res.status(400).json({
        message: 'username and password are required'
      })
    }
    user = await Model.User.findOne({
      where:{
        username
      }
    })
    if(!user){
      res.status(401).json({
        message: 'username is not registered'
      })
    }else{
      let verify = bcrypt.compareSync(password, user.password)
      if(!verify){
        res.status(401).json({
          message: 'password is not match'
        })
      }else{
        let token = jwt.sign({
          id: user.id,
          role: user.role
        }, process.env.TOKENKEY)
        res.status(200).json({
          message: 'successfully logged in',
          token:token
        })
      }
    }
  }catch(err){
    res.status(500).json({
      message: err
    })
  }
}

const signup = (req, res) => {
  req.body.role = 'customer'
  createUser(req,res)
}

const deleteUser = async(req, res) => {
  try{
    let id = req.params.id
    const token = req.headers.token
    let ownId = getId(token)
    if(id == ownId){
      res.status(403).json({
        message: 'you can not delete your own id'
      })
    }
    let user = await Model.User.findOne({
      where:{
        id
      }
    })
    if(user.role == 'firstadmin'){
      res.status(403).json({
        message: 'you can not delete firstadmin'
      })
    }
    let deletedUser = await Model.User.destroy({
      where:{
        id
      }
    })
    if(deletedUser === 1){
      res.status(201).json({
        message: 'success to delete user'
      })
    }else{
      res.status(400).json({
        message: 'user is not found'
      })
    }
  }catch(err){
    res.status(500).json({
      message: err
    })
  }
}

const editUser = async(req, res) => {
  try{
    let id = req.params.id
    let userData = {
      id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    }
    let updatedUser = await Model.User.update(userData,
      {
        where: {
          id
        }
      }
    )
    res.status(201).json({
      message: 'success to edit user'
    })
  }catch(err){
    console.log(err)
    res.status(500).json({
      message: err
    })
  }
}

module.exports = {
  getUserData,
  createUser,
  signin,
  signup,
  deleteUser,
  editUser
}
