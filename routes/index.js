var express = require('express');
var router = express.Router();
const {UserModel}  = require('../db/models');
const md5 = require('blueimp-md5');
const filter = {password:0,__v:0};//从返回的数据库中过滤掉这两个属性。
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//注册一个路由：用于用户注册
//注册的路由
router.post('/register',function (req, res) {
  //1、获取请求参数
  const {username,password,type} = req.body;
  //2、处理
  UserModel.findOne({username},function (error, user) {
    if(user){
      res.send({code:1,msg:'此用户已存在！'})
    }else {
      new UserModel({username,type,password:md5(password)}).save(function (error, user) {
          res.cookie('userid',user._id,{maxAge:1000*60*60*5})
        const data = {username,type,_id:user._id};
        res.send({code:0,data})
      })
    }
  })
   console.log('/register '+ '参数：' , req.body)
});
//登陆的路由
router.post('/login',function (req, res) {
  const {username,password} = req.body;
  UserModel.findOne({username,password:md5(password)},filter,function (error, user) {
    if(user){
      res.cookie('userid',user._id,{maxAge:1000*60*60*5});
      res.send({code:0,user})
    }else {
      res.send({code:1,msg:'用户名或密码不正确！'})
    }
  })
    console.log('/login '+ '参数：' , req.body)
});
//更新用户信息的路由
router.post('/update',function (req, res) {
  const userid = req.cookies.userid
  if(!userid){
    return res.send({code:1,msg:'请先登陆！'})
  }
  const user = req.body;
  UserModel.findOneAndUpdate({_id:userid},user,function (error, oldUser) {
    if(!oldUser){
      res.clearCookie('userid');
      res.send({code:1,msg:'请先登陆！'})
    }else {
      const {_id,username,type} = oldUser
      const data = Object.assign(user,{_id,username,type})
      res.send({code:0,data})
    }
  })
  console.log('/update '+ '参数：' , req.body)

})
//根据cookie获取user
router.get('/user',function (req, res) {
  const userid = req.cookies.userid
  console.log(userid)
  if(!userid){
    return res.send({code:1,msg:'请先登陆！'})
  }
  UserModel.findOne({_id:userid},filter,function (error, user) {
    res.send({code:0,data:user})
  })
})

//或取用户列表
router.get('/userList',function (req, res) {
  const {type} = req.query
  UserModel.find({type},filter,function (error, users) {
    res.send({code:0,data:users})
  })
})
module.exports = router;
