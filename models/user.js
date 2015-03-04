var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient
var uri = 'mongodb://test1:test1@ds047008.mongolab.com:47008/microblog'

function User(user) {
  this.name = user.name;
  this.password = user.password;
}
User.prototype.save = function save(callback) {
  //存入MongoDb文档
  var user = {
    name: this.name,
    password: this.password
  }
  MongoClient.connect(uri, {db: {native_parser: true}}, function (err, db) {
    if (err) {
      return callback(err);
    }
    var collection = db.collection('users')
    //collection.ensureIndex('name', {unique: true})
    collection.insert(user, {w:1}, function (err, user) {
      db.close()
      callback(err, user)
    })
  })
}
User.get = function (username, callback) {
  //获取用户
  MongoClient.connect(uri, {db: {native_parser: true}}, function (err, db) {
    if (err) {
      console.log('user get error');
      return callback(err);
    }
    var collection = db.collection('users')
    collection.findOne({name: username}, function (err, item) {
      db.close()
      if (item) {
        var user = new User(item)
        callback(err, user)
      } else {
        callback(err, null)
      }
    })
  })
}
module.exports = User
