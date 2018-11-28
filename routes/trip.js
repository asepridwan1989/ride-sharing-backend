const express = require('express')
const router = express.Router()
const { createTrip, showTrip, editTrip, deleteTrip, searchTrip } = require('../controllers/trip.controller')
const { auth } = require('../middlewares/auth')

router
  .post('/', auth, createTrip)
  .get('/', showTrip)
  .put('/', auth, editTrip)
  .delete('/', auth, deleteTrip)
  .get('/search', searchTrip)
module.exports = router
