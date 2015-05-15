mongoose = require 'mongoose'
Schema = mongoose.Schema

db = mongoose.createConnection 'mongodb://localhost/bedo'
host = require './host'
service = require './service'
module.exports =
  Host: db.model 'host', new Schema host
  Service: db.model 'service', new Schema service