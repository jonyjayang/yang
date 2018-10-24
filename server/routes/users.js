var express = require('express');
var router = express.Router();
var User=require("./../models/user");
require("./../util/util");
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

});
//选中所有
router.post("/editCheckAll",function(req,res,next){
  var userId=req.cookies.userId,   checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId},function(err,user){
    if(err){
      res.json({
        status:"1",
        err:err.message,
        result:""

      })
    }else{
      if(user){
        user.cartList.forEach((item) => {
          item.checked=checkAll;
        });
        user.save(function(err1,doc){
          if(err1){
            res.json({
              status:"1",
              err:err.message,
              result:""
      
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'suc'
            });
          }

        })
      }
    }

  })  
});
//用户地址管理
router.get("/addressList",function (req,res,next) {
    var userId = req.cookies.userId;
    User.findOne({userId:userId},function (err,doc) {
      if (err) {
        res.json({
          status: "1",
          err: err.message,
          result: ""

        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: doc.addressList
        });
      }


      })

  });
  //删除地址管理
  router.post("/delAddress",function(req,res,next){
    var userId=req.cookies.userId, addressId=req.body.addressId;
    User.update({userId:userId},{
      $pull:{
      'addressList':{
        'addressId':addressId
      }
    }},function(err,doc){
      if (err) {
        res.json({
          status: "1",
          err: err.message,
          result: ""

        })
      } else {
        res.json({
          status: '0',
          msg: '',
          result: "suc"
        });
      }
    })
  });
  //设置默认地址
router.post("/setDefault",function(req,res,next){
  var userId=req.cookies.userId, addressId=req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:'addressId is null',
      result:''
    }); 
  }else{
    User.findOne({userId:userId},function(err,doc){
      if(err){
        res.json({
          status:"1",
          err:err.message,
          result:""

        })
      }else{
        var addressList=doc.addressList;
        addressList.forEach((item)=>{
            if(item.addressId==addressId){
              item.isDefault = true;
              // console.log(item.isDefault);
            }else{
              item.isDefault = false;
            }
        });
        // console.log(addressList);
        // console.log(doc);
        doc.save(function(err1,doc1){
          if(err1){
            res.json({
              status:"1",
              err:err.message,
              result:''
            })
          }else{
            res.json({
              status:"0",
              err:"",
              result:"suc"
            });
          }
        })
      }
  })
  }
});
//用户支付页面
  //设置默认地址
  router.post("/setDefault",function(req,res,next){
    var userId=req.cookies.userId, addressId=req.body.addressId;
    if(!addressId){
      res.json({
        status:'1003',
        msg:'addressId is null',
        result:''
      }); 
    }else{
      User.findOne({userId:userId},function(err,doc){
        if(err){
          res.json({
            status:"1",
            err:err.message,
            result:""
  
          })
        }else{
          var addressList=doc.addressList;
          addressList.forEach((item)=>{
              if(item.addressId==addressId){
                item.isDefault = true;
                // console.log(item.isDefault);
              }else{
                item.isDefault = false;
              }
          });
          // console.log(addressList);
          // console.log(doc);
          doc.save(function(err1,doc1){
            if(err1){
              res.json({
                status:"1",
                err:err.message,
                result:''
              })
            }else{
              res.json({
                status:"0",
                err:"",
                result:"suc"
              });
            }
          })
        }
    })
    }
  });
  //用户支付页面
  router.post("/payMent",function(req,res,next){
    var userId=req.cookies.userId, addressId=req.body.addressId,orderTotal = req.body.orderTotal;
    User.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status:"1",
          err:err.message,
          result:""
        })
      }else{
        var address="",goodsList=[];
        doc.addressList.forEach((item)=>{
          if(item.addressId==addressId){
            address=item;
          }
        });
        doc.cartList.forEach((item)=>{
          if(item.checked=="1"){
            goodsList.push(item);
          }
        });
      //生成订单号
      var platform=622;//设置特殊数字标识符
      var r1 = Math.floor(Math.random() * 10);//生成随机数1
      var r2 = Math.floor(Math.random() * 10); //生成随机数2
      var sysDate=new Date().Format('yyyyMMddhhmmss');//系统时间
      var createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')//创建订单时间
      var orderId=platform+r1+sysDate+r2;//生成订单
  
      //将所有订单信息存储与数组中
      var order={
        orderId:orderId,
        orderTotal:orderTotal,
        addressinfo:address,
        goodsList:goodsList,
        orderStatus: '1',
        createDate: createDate
      };
       doc.orderList.push(order);
  
      doc.save(function (err1,doc1) {
          if(err1){
            res.json({
              status:"1",
              err:err.message,
              result:""
            });
          }else{
             res.json({
               status: "0",
               msg: '',
               result: {
                 orderId: order.orderId,
                 orderTotal: order.orderTotal
               }
             });
  
          }
        })
  
  
  
      }
      })
  
  
  });
//支付成功页面
router.get("/OrderSuc",function(req,res,next){
  var userId=req.cookies.userId,orderId=req.param("orderId");
  User.findOne({userId:userId},function(err,userinfo){
    if(err){
      res.json({
        status:"1",
        err:err.message,
        result:""
      })
    }else{
      var orderList=userinfo.orderList;
      if(orderList.length>0){
        var orderTotal=0;
        orderList.forEach((item)=>{
          if(item.orderId == orderId){
            orderTotal = item.orderTotal;
          }
        });
        if(orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:"10021",
            err:"无此订单",
            result:""
          })
        }
      }else{
        res.json({
          status:"10022",
          err:"未创建订单",
          result:""
        })
      }

    
    }
  })
})
module.exports = router;
