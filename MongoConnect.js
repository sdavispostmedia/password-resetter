'use strict';

var MongoConnect = module.exports = {};

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const MongoConfig = {
  user: process.env.MONGO_USER,
  password: process.env.MONGO_PWD,
  replicationSetName: process.env.MONGO_RS,
  port: process.env.MONGO_PORT || 27017,
  host: process.env.MONGO_HOST || "localhost",
  db: process.env.MONGO_DB || "dmh",
};

const connectionString = `mongodb://${MongoConfig.host}:${MongoConfig.port}/${MongoConfig.db}`;
const mongooseOptions = {
    user: MongoConfig.user,
    pass: MongoConfig.password,
    replset: {
    rs_name: MongoConfig.replicationSetName,
        socketOptions: {
    connectTimeoutMS: (process.env.MONGO_CON_TIMEOUT) ? parseInt(process.env.MONGO_CON_TIMEOUT) * 1000 : 120000,
            socketTimeoutMS: (process.env.MONGO_CON_TIMEOUT) ? parseInt(process.env.MONGO_CON_TIMEOUT) * 1000 : 120000,
        },
    },
    server: {
    socketOptions: {
    connectTimeoutMS: (process.env.MONGO_CON_TIMEOUT) ? parseInt(process.env.MONGO_CON_TIMEOUT) * 1000 : 120000,
            socketTimeoutMS: (process.env.MONGO_CON_TIMEOUT) ? parseInt(process.env.MONGO_CON_TIMEOUT) * 1000 : 120000,
        },
    },
};

MongoConnect.mongooseConnect = function mongooseConnect() {
    return new Promise((resolve, reject) => {
      mongoose.connect(connectionString, mongooseOptions).then(() => {
        resolve();
      },
        (err) => {
          reject(err);
        });
    });
}
