var mongodb = require('./db')

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
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function (err, collection) {
      if (err) {
        console.log('users.collection error');
        mongodb.close()
        return callback(err)
      }
      //为name添加索引
      collection.ensureIndex('name', {unique: true});
      collection.insert(user, {safe: true}, function (err, user) {
        mongodb.close()
        callback(err, user)
      })
    })
  })
}
User.get = function (username, callback) {
    mongodb.open(function (err, db) {
      if (err) {
        console.log('user get error');
        return callback(err);
      }
      db.collection('users', function (err, collection) {
        if (err) {
          mongodb.close()
          return callback(err)
        }
        collection.findOne({name: username}, function (err, item) {
          mongodb.close()
          if (item) {
            var user = new User(item)
            callback(err, user)
          } else {
            callback(err, null)
          }
        })
      })
    })
}
module.exports = User
