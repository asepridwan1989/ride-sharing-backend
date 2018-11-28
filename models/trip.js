'use strict';
module.exports = (sequelize, DataTypes) => {
  var Trip = sequelize.define('Trip', {
    UserId: DataTypes.INTEGER,
    vehicle: DataTypes.STRING,
    maxPassenger: DataTypes.INTEGER,
    origin: DataTypes.STRING,
    destination: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    departureDate: DataTypes.DATE,
    departureTime: DataTypes.STRING,
    status: DataTypes.STRING
  }, {});
  Trip.associate = function(models) {
    // associations can be defined here
    Trip.hasMany(models.Passenger)
    Trip.belongsToMany(models.User,{through: models.Passenger})
  };
  return Trip;
};
