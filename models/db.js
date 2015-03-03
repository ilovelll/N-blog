var settings = require('../settings')
var Db = require('mongodb').Db
//var Connection = require('mongodb').Connection
var Server = require('mongodb').Server

module.exports = new Db(
  settings.DB,
  new Server(
    settings.HOST,
    settings.PORT,
    {auto_reconnect:true, native_parser:true}
    ),
  {safe:false}
  )
