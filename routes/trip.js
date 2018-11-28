const express = require('express')
const router = express.Router()
const { createTrip, showTrip, editTrip, deleteTrip, searchTrip } = require('../controllers/trip.controller')
const { auth } = require('../middlewares/auth')

router
  .post('/', auth, createTrip)
  .get('/', showTrip)
  .put('/:id', auth, editTrip)
  .delete('/:id', auth, deleteTrip)
  .get('/search', searchTrip)
module.exports = router
