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

//显示用户购物车
router.get("/cartList",function(req,res,next){
let userId=req.cookies.userId;
User.findOne({userId:userId},function(err,doc){
  if(err){
    res.json({
      status:"1",
      err:err.message,
      result:""

    })

  }else{
    if(doc){
      res.json({
        status:"0",
        err:"",
        result:doc.cartList
      })
    }

  }
})
});
//删除购物车商品
router.post("/cartDel",function(req,res,next){
  var userId=req.cookies.userId, productId=req.body.productId;//获取id
  User.update({userId:userId},{$pull:{
    //pull删除该用户的购物车内的商品
    'cartList':{
      "productId":productId
    }
  }},function(err,doc){
    if(err){
      res.json({
        status:"1",
        err:err.message,
        result:""
      });  
    }
    else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  }
)
});
//添加商品数量
router.post("/editCart",function(req,res,next){
  var userId=req.cookies.userId, productId=req.body.productId ,productNum=req.body.productNum,checked=req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },function(err,doc){
    if(err){
      res.json({
        status:"1",
        err:err.message,
        result:""
      });  
    }
    else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  })

})

module.exports = router;
