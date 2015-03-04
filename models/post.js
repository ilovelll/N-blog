var mongodb = require('mongodb')
var markdown = require('markdown').markdown
var MongoClient = mongodb.MongoClient
var uri = 'mongodb://test1:test1@ds047008.mongolab.com:47008/microblog'

function Post(post) {
  this.user = post.user
  this.post = post.post
  if (post.time) {
    this.time = post.time
  } else {
    this.time = new Date()
  }
}

Post.prototype.save = function (callback) {
  var post = {
    user: this.user,
    post: this.post,
    time: this.time
  }
  MongoClient.connect(uri, {db: {native_parser: true}}, function (err, db) {
    if (err) {
      return callback(err)
    }
    var collection = db.collection('posts')
    collection.insert(post, {w:1}, function (err, post) {
      db.close()
      callback(err, post)
    })
  })
}

Post.get = function (user, callback) {
  MongoClient.connect(uri, {db: {native_parser: true}}, function (err, db) {
    if (err) {
      return callback(err)
    }
    var collection = db.collection('posts')
    var query = {}
    if (user) {
      query.user = user
    }
    collection.find(query).sort({time:-1}).toArray(function (err, docs) {
      if (err) {
        callback(err, null)
      }
      var posts = []
      docs.forEach(function (doc, index) {
        doc.post = markdown.toHTML(doc.post)
      })
      db.close()
      callback(err, docs)
    })
  })
}
Post.search = function (q, callback) {
  MongoClient.connect(uri, {db: {native_parser: true}}, function (err, db) {
    if (err) {
      return callback(err)
    }
    var collection = db.collection('posts')
    var query = {}
    if (q) {
      query.post = q
    }
    collection.find(query).sort({time:-1}).toArray(function (err, items) {
      if (err) console.warn(err.message);
      var posts = []
      items.forEach(function (item, index) {
        var post = new Post({user: item.user, post: item.post, time: item.time})
        posts.push(post)
      })
      db.close()
      callback(err, posts)
    })
  })
}
module.exports = Post;
