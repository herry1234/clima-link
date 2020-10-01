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
        measurement: 'temperature',
        fields: {
          temperature: Influx.FieldType.FLOAT,
          humidity: Influx.FieldType.FLOAT,
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
  log.info(`Storing message: ${message.temperature} ${message.timeStamp} ${message.humidity}`);
  storage.influx.writePoints([
    {
      measurement: 'temperature',
      fields: {
        temperature: message.temperature,
	humidity: message.humidity,
      },
      //timestamp: message.timeStamp,
    },
  ]).then(cb);
};

storage.disconnect = function disconnect(cb) {
  cb();
};

module.exports = storage;
