const express = require('express')
const router = express.Router()
const {createUser, signin, signup, deleteUser, getUserData, editUser} = require('../controllers/user.controller')
const {auth, isAdmin} = require('../middlewares/auth')
/* GET users listing. */
router
  .get('/', isAdmin, getUserData)
  .post('/', isAdmin, createUser)
  .post('/signin', signin)
  .post('/signup', signup)
  .delete('/:id', isAdmin, deleteUser)
  .put('/:id', isAdmin, editUser)

module.exports = router;
