const jwt = require('jsonwebtoken')
const Model = require('../models')
const getId = require('../helpers/getId')

const createTrip = async(req, res) => {
  try{
    const token = req.headers.token
    let UserId = +getId(token)

    let vehicle = req.body.vehicle
    let maxPassenger = req.body.maxPassenger
    let origin = req.body.origin
    let destination = req.body.destination
    let cost = req.body.cost
    let departureTime = req.body.departureTime
    let departureDate = req.body.departureDate

    if(!vehicle){
      res.status(400).json({
        message: 'vehicle name is required'
      })
    }
    if(!maxPassenger){
      res.status(400).json({
        message: 'max passenger is required'
      })
    }
    if(!origin){
      res.status(400).json({
        message: 'origin is required'
      })
    }
    if(!destination){
      res.status(400).json({
        message: 'destination is required'
      })
    }
    if(!cost){
      res.status(400).json({
        message: 'cost is required'
      })
    }
    if(!departureTime){
      res.status(400).json({
        message: 'departure time is required'
      })
    }
    if(!departureDate){
      res.status(400).json({
        message: 'departure date is required'
      })
    }

    let tripData = {
      UserId,
      vehicle,
      maxPassenger,
      origin,
      destination,
      cost,
      departureTime,
      departureDate,
      status: 'available'
    }
    let newTrip = await Model.Trip.create(tripData)
    req.status(201).json({
      message: 'success to create new trip',
      data: newTrip
    })
  }catch(err){
    res.status(500).json({
      message:'failed to create trip',
      data:err
    })
  }
}

const showTrip = async(req, res) => {
  try{
    let limit = 20
    let offset = 0
    let page = req.params.page
    let dataTrip = await Model.Trip.findAndCountAll()
    let pages = Math.ceil(dataTrip.count / limit)
    if(page > pages){
      page = pages
    }
    offset = limit * (page-1)
    let tripData = await Model.Trip.findAll({
      limit,
      offset,
      include: [
        {
          model: Model.User,
          where: {
            UserId
          }
        }
      ]
    })
    if(!tripData[0]){
      res.status(200).json({
        message: 'no available trip'
      })
    }else{
      res.status(200).json({
        message: 'success to get available trips',
        data: tripData,
        pages
      })
    }
  }catch(err){
    res.status(500).json({
      message:'failed to get trip data',
      data:err
    })
  }
}

const editTrip = async(req, res) => {
  try{
    const token = req.headers.token
    let UserId = +getId(token)
    let id = req.params.id
    let tripData = await Model.Trip.findOne({
      where:{
        id
      }
    })
    if(tripData.UserId != UserId){
      res.status(403).json({
        message:'failed to edit trip data, you can not edit another user trip'
      })
    }else{
      let vehicle = req.body.vehicle
      let maxPassenger = req.body.maxPassenger
      let origin = req.body.origin
      let destination = req.body.destination
      let cost = req.body.cost
      let departureTime = req.body.departureTime
      let departureDate = req.body.departureDate

      let tripData = {
        vehicle,
        maxPassenger,
        origin,
        destination,
        cost,
        departureTime,
        departureDate
      }

      let updatedTrip = await Model.Dishes.update(tripData,
        {
          where: {
            id
          }
        }
      )
      res.status(201).json({
        message: 'success to edit trip data',
        data: updatedTrip
      })
    }
  }catch(err){
    res.status(500).json({
      message:'failed to get trip data',
      data:err
    })
  }
}

const deleteTrip = async(req, res) => {
  try{
    const token = req.headers.token
    let UserId = +getId(token)
    let id = req.params.id
    let tripData = await Model.Trip.findOne({
      where:{
        id
      }
    })
    if(tripData.UserId != UserId){
      res.status(403).json({
        message:'failed to delete trip data, you can not edit another user trip'
      })
    }else{
      let rowDeleted = await Model.Trip.destroy({
        where:{
          id
        }
      })
      if(rowDeleted === 1){
        res.status(201).json({
          message: 'sucess to delete trip'
        })
      }else {
        res.status(400).json({
          message: 'trip id is not found'
        })
      }
    }
  }catch(err){
    res.status(500).json({
      message:'failed to get trip data',
      data:err
    })
  }
}

const searchTrip = async(req, res) => {
  try{
    let queryOrigin = req.query.origin
    let queryDestination = req.query.destination
    let tripQuery = await Model.Trip.findAll({
      where:{
        origin:{
          $like: `%${queryOrigin}%`
        },
        destination:{
          $like: `%${queryDestination}%`
        }
      },
      include: [
        {
          model: Model.User,
          where: {
            UserId
          }
        }
      ]
    })
    if(!tripQuery[0]){
      res.status(200).json({
        message: 'no available trip for this route',
        data: tripQuery
      })
    }else{
      res.status(200).json({
        message: 'success to get dishes',
        data: tripQuery
      })
    }
  }catch(err){
    res.status(500).json({
      message: err,
    })
  }
}

module.exports = {
  createTrip,
  showTrip,
  editTrip,
  deleteTrip,
  searchTrip
}
