var mongodb = require('./db')
var markdown = require('markdown').markdown

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
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err)
    }
    //读取posts集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close()
        return callback(err)
      }
      collection.ensureIndex('user', {unique: true})
      collection.insert(post, {safe:true}, function (err, post) {
        mongodb.close()
        callback(err, post)
      })
    })
  })
}

Post.get = function (user, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err)
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close()
        return callback(err)
      }
      var query = {}
      if (user) {
        query.user = user
      }
      collection.find(query).sort({time:-1}).toArray(function (err, docs) {
        mongodb.close()
        if (err) {
          callback(err, null)
        }
        var posts = []
        docs.forEach(function (doc, index) {
          doc.post = markdown.toHTML(doc.post)
        })
        callback(err, docs)
      })
    })
  })
}
Post.search = function (q, callback) {
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err)
    }
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close()
        return callback(err)
      }
      var query = {}
      if (q) {
        query.post = q
      }
      collection.find(query).sort({time:-1}).toArray(function (err, items) {
        mongodb.close()
        if (err) {
          callback(err, null)
        }
        var posts = []
        items.forEach(function (item, index) {
          var post = new Post({user:item.user, post:item.post, time:item.time})
          posts.push(post)
        })
        callback(err, posts)
      })
    })
  })
}
module.exports = Post;
