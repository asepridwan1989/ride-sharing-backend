'use strict';
module.exports = (sequelize, DataTypes) => {
  var Passenger = sequelize.define('Passenger', {
    TripId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {});
  Passenger.associate = function(models) {
    // associations can be defined here
    Passenger.belongsTo(models.User),
    Passenger.belongsTo(models.Trip)
  };
  return Passenger;
};
