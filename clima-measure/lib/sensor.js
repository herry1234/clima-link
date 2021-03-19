/*
 * Sensor responsible for reading the serial data via sensor
 */

const log = require('./log');
const config = require('./config');
const constants = require('./constants');

const sensor = {};
const tmpData = { "P0": [0,0,"OFF"], "P1": [0,0,"OFF"], "P2": [0,0,"OFF"], "P3":[0,0,"OFF"], "P4":[0,0,"OFF"],"P5":[0,0,"OFF"]}
function ReadSerialData(data){
  
  console.log(data);
  const myArry = data.trim().split('-')
  if(myArry.length < 3) {
	  //console.log("Invalid data")
	  return
  }
  const ch_id = myArry[0];
  if(! (ch_id in tmpData)) {
	  //console.log("Invalid data")
	  return
  }

  console.log(myArry[0]);
  const temp = myArry[1];
  const mos = myArry[2];
  const ev = myArry[3];

  tmpData[ch_id][0] = temp; 
  tmpData[ch_id][1] = mos; 
  tmpData[ch_id][2] = ev; 
}


const SerialPort = require('serialport');
SerialPort.list().then(ports => {
  ports.forEach(function(port) {
    console.log(port.path);
    console.log(port.pnpId);
    console.log(port.manufacturer);
    console.log(JSON.stringify(port,undefined,4));
  });
});
const port = new SerialPort('/dev/ttyS0',  {
	      baudRate: 115200
	    },() => {
console.log('Port Opened');
});
const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
	delimiter: '\n'
});

port.pipe(parser);

parser.on('data', ReadSerialData);
console.log("ready!")

sensor.read = function read(cb) {
  if (config.envName === constants.ENVIRONMENTS.PRODUCTION) {
    // Read the temperature from the sensor
	if(true) {   
	  cb(null,tmpData);
        } else {
        log.error(`An error occurred while trying to read the temperature sensor. ${err}`);
        cb(err);
        }

  } else {
    cb(null, tmpData);
  }
};

module.exports = sensor;
