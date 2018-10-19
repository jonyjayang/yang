var express = require('express');
var router = express.Router();
var User=require("./../models/user");
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post("/login",function(req,res,next){
  var param={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
User.findOne(param,function(err,doc){
  if(err){
    console.log(error);
    res.json({
      status:"1",
      msg:err.message
    });
  }else{
    // console.log(doc);
    if(doc){
      res.cookie("userId",doc.userId,{
        path:'/',
        maxAge:1000*60*60
      });
      // req.session.user=doc;
      res.json({
        status:'0',
        msg:'aa',
        result:{
          userName:doc.userName,
          doc:doc
        }
      });
    }
  }

})
});
//登陆校验
router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
      res.json({
        status:'0',
        msg:'',
        result:req.cookies.userName || ''
      });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});
module.exports = router;
