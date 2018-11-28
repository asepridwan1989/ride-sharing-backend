const jwt = require('jsonwebtoken')
const Model = require('../models')
const getId = require('../helpers/getId')

const requestRide = async(req, res) => {
  try{
    const token = req.headers.token
    const TripId = req.params.id,
    let UserId = +getId(token)
    let requestData = {
      UserId,
      TripId,
      status:'requesting'
    }
    let passengerData = await Model.Passenger.findAndCountAll({
      where:{
        TripId,
      },
      include: [
        {
          model: Model.Trip,
          where: {
            id: TripId
          }
        }
      ]
    })
    if(passengerData.count >= passengerData.Trip.maxPassenger){
      res.status(200).json({
        message:'this trip is full booked',
        data:passengerData
      })
    }else{
      newPassenger = await Model.Passenger.create(requestData)
      res.status(201).json({
        message: 'success to request to join trip',
        data: newPassenger
      })
    }
  }catch(err){
    res.status(500).json({
      message:'failed to request ride',
      data:err
    })
  }
}

const approvePassenger = async(req, res) => {
  try{
    const id = req.params.id,
    let UserId = +getId(token)
    let tripData = await Modle.Passenger.findOne({
      where:{
        id
      },
      include:[
        {
          model: Model.Trip
        }
      ]
    })
    if(tripData.Trip.UserId != UserId){
      res.status(403).json({
        message:'it is not your trip'
      })
    }else{
      let passangerData = {
        status: 'booked'
      }
      approvedPassenger = await Model.Passenger.update(
        passangerData,
        {
          where: {
            id
          }
        }
      )
      res.status(201).json({
        message:'success to approve passanger'
      })
    }
  }catch(err){
    res.status(500).json({
      message:'failed to request ride',
      data:err
    })
  }
}

const checkTripStatus = async(req, res) => {
  try{
    const TripId = req.params.id,
    let passengerData = await Model.Passenger.findAndCountAll({
      where:{
        TripId,
      },
      include: [
        {
          model: Model.Trip,
          where: {
            id: TripId
          }
        }
      ]
    })
    if(passengerData.count >= passengerData.Trip.maxPassenger){
      res.status(200).json({
        message:'this trip is full booked',
        data:passengerData
      })
    }else{
      let availableSeat = passengerData.Trip.maxPassenger - passengerData.count
      res.status(200).json({
        message: `available seat id ${availableSeat}`
      })
    }
  }catch(err){
    res.status(500).json({
      message:'failed to request ride',
      data:err
    })
  }
}

module.exports = {
  approvePassenger,
  requestRide,
  checkTripStatus
}
