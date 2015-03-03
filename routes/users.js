var express = require('express');
var router = express.Router();
var User = require('../models/user')
var Post = require('../models/post')
/* GET users listing. */
router.get('/:user', function(req, res) {
  User.get(req.params.user, function (err, user) {
    if (!user) {
      req.session.error = '用户不存在'
      return res.redirect('/')
    }
    Post.get(user.name, function (err, posts) {
      if (err) {
        req.session.error = '读取博客失败'
        return res.redirect('/')
      }
      // console.log(posts);
      res.render('user', {
        title: user.name,
        posts: posts,
      })
    })
  })
});

module.exports = router;
