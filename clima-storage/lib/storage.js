/*
 * Sensor responsible for reading the temperature sensor
 */
const Influx = require('influx');
const config = require('./config');
const log = require('./log');

const storage = {};

storage.connect = function connect(cb) {
  storage.influx = new Influx.InfluxDB({
    host: config.database.host,
    database: config.database.name,
    username: config.database.user,
    password: config.database.password,
    schema: [
      {
        measurement: 'sensor6data',
        fields: {
          temperature: Influx.FieldType.FLOAT,
          humidity: Influx.FieldType.FLOAT,
	  evs: Influx.FieldType.FLOAT,
        },
        tags: ['host'],
      },
    ],
  });

  storage.influx.getDatabaseNames().then((names) => {
    if (!names.includes(config.database.name)) {
      return storage.influx.createDatabase(config.database.name);
    }
    return null;
  }).then(cb);
};

storage.save = function save(message, cb) {
  log.info(`Storing message: ${message.timeStamp} ${message.data}`);
  const saveData = []
  for (const ch in message.data) {
	    const ch_data = message.data[ch]
	    console.log(`${ch}: ${message.data[ch][0]} ${message.data[ch][1]} ${message.data[ch][2]}`);
            let evs_local = 0;
	    if(message.data[ch][2] === "ON") {
	    evs_local = 1
	    }
	  saveData.push({
      		measurement: 'sensor6data',
      fields: {
        temperature: ch_data[0],
	humidity: ch_data[1],
	evs: evs_local
      },
      tags: {
        host: ch 
      },
      //timestamp: message.timeStamp,
    })
  }
  storage.influx.writePoints(saveData).then(() => {
	  cb()});
};

storage.disconnect = function disconnect(cb) {
  cb();
};

module.exports = storage;
