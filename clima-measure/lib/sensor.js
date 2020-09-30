/*
 * Sensor responsible for reading the temperature sensor
 */
//const tempSensor = require('ds18b20-raspi');
const tempSensor = require("node-dht-sensor");

const log = require('./log');
const config = require('./config');
const constants = require('./constants');

const sensor = {};

sensor.read = function read(cb) {
  if (config.envName === constants.ENVIRONMENTS.PRODUCTION) {
    // Read the temperature from the sensor
    tempSensor.read(11, 4, function(err, temperature, humidity) {
  	if (!err) {
    	   console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);
	   cb(null,temperature,humidity);
        } else {
        log.error(`An error occurred while trying to read the temperature sensor. ${err}`);
        cb(err);
        }

    });
    /*
    tempSensor.readSimpleC((err, temp) => {
      if (!err) {
        cb(null, temp);
      } else {
        log.error(`An error occurred while trying to read the temperature sensor. ${err}`);
        cb(err);
      }
    });
    */
  } else {
    // Generate a fake temperature for testing
    const temperature = Math.floor(Math.random() * 20);
    cb(null, temperature);
  }
};

module.exports = sensor;
