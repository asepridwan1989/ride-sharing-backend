const express = require('express')
const router = express.Router()
const { requestRide, approvePassenger, checkTripStatus } = require('../controllers/ride.controller')
const { auth } = require('../middlewares/auth')

router
  .post('/request/:id', auth, requestRide)
  .post('/approve/:id', auth, approvePassenger)
  .get('/check-status/:id', checkTripStatus)

module.exports = router
