var express = require('express');
var router = express.Router();
var crypto = require('crypto')
var User = require('../models/user')
var Post = require('../models/post')
var querystring = require('querystring')
/* GET home page. */
router.get('/v0.2', function (req, res) {
  res.render('v0.2/index')
})
router.get('/', function(req, res) {
  Post.get(null, function (err, posts) {
    if (!posts) {
      posts = []
    }
    res.render('index', {
      title: 'weibo主页',
      posts: posts
    });
  })
});
router.get('/about', function (req, res) {
  res.render('about', {
    title: '关于本站'
  })
})
router.get('/list', function(req, res) {
  res.render('list', {
    title: 'List',
    items: [1991, 'byvoid', 'express', 'Node.js']
  });
});
router.post('/post', function (req, res) {
  authentication(req, res)
  var currentUser = req.session.user
  var post = new Post({user:currentUser.name, post:req.body.post})
  // console.log(post);
  post.save(function (err) {
    if (err) {
      req.session.error = '发表失败'
      return res.redirect('/')
    }
    req.session.error = '发表成功'
    console.log(req.session);
    res.redirect('/u/'+currentUser.name)
  })
})
router.route('/login')
.get(function(req, res) {
  noAuthentication(req, res);
  res.render('login', { title: '用户登录' });
})
.post(function(req, res) {
  noAuthentication(req, res);
  var md5 = crypto.createHash('md5')
  var password = md5.update(req.body.password).digest('base64')
   User.get(req.body.username, function(err, user){
     if (!user) {
       req.session.error='用户不存在'
       return res.redirect('/login')
     }
     if (user.password != password) {
       req.session.error='密码错误'
       return res.redirect('/login')
     }
     req.session.user = user
     req.session.error = '登录成功'
     console.log(req.session);
     res.redirect('/')
   })
})
router.get('/logout', function(req, res) {
  authentication(req, res);
  req.session.user = null;
  req.session.error='退出成功'
  res.redirect('/');
});

router.route('/reg')
.get(function (req, res) {
  res.render('reg',{ title: '用户注册'})
})
.post(function (req, res) {
  if (req.body.password_repeat != req.body.password) {
    console.log(req.body)
    req.session.error='两次输入的密码不一致';
    return res.redirect('/reg');
  }

  var md5 = crypto.createHash('md5')
  var password = md5.update(req.body.password).digest('base64')
  var newUser = new User({
    name: req.body.username,
    password: password
  })
  User.get(newUser.name, function (err, user) {
    if (user) {
      req.session.error = '用户已存在'
      return res.redirect('/reg')
  } else {
    newUser.save(function (err) {
      if (err) {
        req.session.error = err
        return res.redirect('/reg')
      }
      req.session.user = newUser;
      req.session.error = '注册成功'
      res.redirect('/')
    })
  }
  })
})
router.get('/search', function(req, res) {
  var q = req.query.q
  q = new RegExp(q, 'i')
  Post.get(q, function (err, posts) {
    if (!posts) {
      posts = []
    }
    res.render('search', {
      title: 'weibo搜索',
      posts: posts
    });
  })
});
function authentication(req, res) {
  if(!req.session.user) {
    req.session.error='请先登录';
    return res.redirect('/login');
  }
}
function noAuthentication(req, res) {
  if(req.session.user) {
    req.session.error='已登录';
    return res.redirect('/');
  }
}
module.exports = router;
