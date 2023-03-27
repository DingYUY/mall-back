const db = require("../db/index.js");
let allSchema = require("../Schema/index.js");

//添加用户
let jwt = require("jsonwebtoken");

async function addUser(req, res) {
  let { name, img_head, password, isManager, studentId, studentName, idCard, status, phone } = req.body;
  let user = await allSchema.userAddSchema.find({ name });
  if (user.length > 0) {
    res.send({ code: 0, msg: "用户已存在" });
    return;
  } else {
    //加密
    let privateKey = "PRIVATEKET";
    let token = jwt.sign(password, "privateKey"); //加密
    let newUser = await allSchema.userAddSchema.create({
      name,
      img_head:
        "https://img0.baidu.com/it/u=1217304799,3113310756&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1673456400&t=9cc8f1082d24652f45ef5488435ca3e6",
      password: token,
      isManager,
      studentId,
      studentName,
      idCard,
      status,
      phone
    });
    res.send({ code: 1, msg: "注册成功,请等待管理员审核" });
  }
}

// 查询当前用户
async function getCurrentUser(req, res) {
  let { _id } = req.body
  let result = await allSchema.userAddSchema.find({_id})
  if (result && result[0]) {
    result[0].password = jwt.decode(result[0].password, 'privateKey')
  }
  console.log(result[0])
  res.send({ code: 1, msg: "查询成功", data: result })
}

// 修改用户信息
async function updateCurrentUser(req, res) {
  let { name, password } = req.body
  let token = jwt.sign(password, 'privateKey')
  let result = await allSchema.userAddSchema.updateOne({name}, {
    $set: {
      name,
      password: token
    }
  })
  res.send({ code: 1, msg: "修改成功", data: result })
}

// 管理员审核用户
async function checkUser(req, res) {
  let { status, id } = req.body
  let result = await allSchema.userAddSchema.updateOne({ _id: id }, {$set: {
    status
  }})
  res.send({ code: 1, msg: '操作成功', result})
}

// 审核商品
async function checkGoods(req, res) {
  let { reviewStatus, id } = req.body
  let result = await allSchema.goodsAddSchema.updateOne({_id: id}, {
    $set: {
      reviewStatus
    }
  })
  res.send({ code: 1, msg: "操作成功", data: result })
}

//获取头像
async function getUserHead(req, res) {
  let { _id } = req.body;
  let user = await allSchema.userAddSchema.find({ _id });
  if (user.length > 0) {
      res.send({ code: 1, msg: "登录成功", data: user[0] });
    
  } else {
    res.send({ code: 0, msg: "用户不存在" });
  }
}

//登录
async function login(req, res) {
  let { name, password } = req.body;
  let user = await allSchema.userAddSchema.find({ name });
  console.log(user);
  if (user.length > 0) {
    //用户存在
    const decoded = jwt.decode(user[0].password, "PRIVATEKET");
    if (password == decoded) {
      res.send({ code: 1, msg: "登录成功", data: user[0] });
    } else {
      res.send({ code: -1, msg: "密码错误" });
    }
  } else {
    res.send({ code: 0, msg: "用户不存在" });
  }
}

// 查询所有用户
async function getAllUser(req, res) {
  let { pageNum, pageSize } = req.body
  let userList = await allSchema.userAddSchema.find()
    // .skip(pageNum ? (Number.parseInt(pageNum) - 1) * 10 : 0)  // 跳过多少条
    // .limit(Number.parseInt(pageSize))
    .sort({createdAt: -1})
  if (userList) {
    res.send({ code: 1, msg: "查询成功", data: userList })
  } else {
    res.send({ code: -1, msg: "当前无普通用户" })
  }
}

//添加商品
async function addGoods(req, res) {
  console.log(req.body)
  let { name, price, introduce, img, good_id, user_id, username, address, reviewStatus } = req.body;
  //通过user_id查找头像
  let user = await allSchema.userAddSchema.find({ _id: user_id });
  let goods = await allSchema.goodsAddSchema.create({
    name,
    price,
    introduce,
    img,
    good_id: String(new Date().getTime()) + Math.floor(Math.random() * 1000),
    user_id,
    username,
    user_img: user[0].img_head,
    address,
    show: true,
    reviewStatus,
    // count,
    studentName: user[0].studentName,
    studentId: user[0].studentId,
    shop_phone: user[0].phone
  });

  res.send({ code: 1, msg: "添加成功", data: goods });
}

//查看自己发布的商品
async function getMyGoods(req, res) {
  let { user_id } = req.body;
  let result = await allSchema.goodsAddSchema.find({
    user_id: user_id,
    show:true
  }).sort({
    createdAt: -1
  });
  if (result.length > 0) {
    res.send({ code: 1, msg: "获取成功", data: result });
  } else {
    res.send({ code: 0, msg: "获取失败" });
  }
}

// 查询所有商品
async function getAllGoods(req, res) {
  let result = await allSchema.goodsAddSchema.find().sort({createdAt: -1})
  res.send({ code: 1, msg: "获取成功", data: result })
}

//编辑商品
async function editGoods(req, res) {
  let { name, price, introduce, img, user_id, username, address, reviewStatus, id } = req.body;
  let goods = await allSchema.goodsAddSchema.updateOne(
    { _id: id },
    { $set: { name, price, introduce, img, user_id, username, address, reviewStatus } }
  ); // 用id查找
  // console.log(goods);
  res.send({ code: 1, msg: "编辑成功", data: goods })
}

//删除商品
async function delGoods(req, res) {
  let { id } = req.body;
  let goods = await allSchema.goodsAddSchema.deleteOne({ _id: id }); // 用id查找
  res.send({ code: 1, msg: '下架成功', data: goods })
}

//通过商品id获取商品
async function getGoodsById(req, res) {
  let { goods_id } = req.body;
  let result = await allSchema.goodsAddSchema.find({
    good_id: goods_id,
  });

  console.log(result)
  let userArr=[]
  for(let i=0;i<result.length;i++){
      let user=await allSchema.userAddSchema.find({_id:result[i].user_id})
      userArr.push(...user)
      result[i].user_img=userArr[i].img_head
  }

  if (result.length > 0) {
    res.send({ code: 1, msg: "获取成功", data: result });
  } else {
    res.send({ code: 0, msg: "获取失败" });
  }
}

//添加订单
async function addOrder(req, res) {
  console.log(req.body);
  let {
    custorm_name, //客户名字
    amount, //订单 总金额
    status, //订单状态
    shop_name, //店铺名字
    shop_id, //店铺id
    goods_name, //商品名字
    goods_title, //商品介绍
    goods_id, //商品id
    custorm_address, //客户地址
    img,
    user_id,
    buy_count
  } = req.body;

  let shop = await allSchema.userAddSchema.find({_id:shop_id})
  console.log('shop', shop)

  let order = await allSchema.orderSchema.create({
    order_id:
      String(new Date().getFullYear()) +
      new Date().getTime() +
      Math.floor(Math.random() * 1000),
    custorm_name, //客户名字
    amount, //订单 总金额
    status, //订单状态
    shop_name, //店铺名字
    shop_id, //店铺id
    goods_name, //商品名字
    goods_title,
    goods_id,
    custorm_address,
    img,
    user_id,
    buy_count,
    shop_phone: shop[0].phone
  });

  //删除商品 修改商品状态
  // let goods = await allSchema.goodsAddSchema.updateOne(
  //   { good_id: goods_id },
  //   { $set: { show: false } }
  // ); // 用id查找
  
  // let goods = await allSchema.goodsAddSchema.find({goods_id})
  // console.log(goods)
  // let orderGoods = await allSchema.orderSchema.find({goods_id})
  // console.log(orderGoods)
  // let goodsCount = []
  // orderGoods.forEach(item => {
  //   goodsCount.push(item.buy_count)
  // })
  // let allCount = goodsCount.reduce((pre, cur) => {
  //   return pre + cur
  // }, 0)
  // if (allCount === goods.count) {
  //   await allSchema.goodsAddSchema.deleteOne({goods_id})
  // }

  res.send({ code: 1, msg: "添加成功" , records: order});
}

//删除订单
async function delOrder(req, res) {
  let { _id } = req.body;
  let result = await allSchema.orderSchema.deleteOne({ _id: _id });
  res.send({ code: 1, msg: "删除成功" });
}

//修改订单状态
async function editOrder(req, res) {
  let { _id, status } = req.body;
  let result = await allSchema.orderSchema.updateOne(
    { _id: _id },
    { $set: { status: status } }
  );
  res.send({ code: 1, msg: "修改成功" });
}

//获取订单
async function getOrder(req, res) {
  let { shop_id } = req.body;
  // console.log(shop_id);
  let result = await allSchema.orderSchema.find({
    $or: [{ shop_id: shop_id }, { user_id: shop_id }],
  }).sort({
    createdAt: -1
  });

  // console.log(result);

  if (result.length > 0) {
    res.send({ code: 1, msg: "获取成功", data: result });
  } else {
    res.send({ code: 0, msg: "获取失败", data: result || [] });
  }
}

// 评价
async function review(req, res) {
  let { observerId, shop_id, comment, reviewScore, shop_name, order_id, observerName } = req.body
  let result = await allSchema.commentsSchema.create({
    observerId,
    shop_id,
    comment,
    reviewScore,
    shop_name,
    order_id,
    observerName
  })
  await allSchema.orderSchema.updateOne({order_id}, { $set: {
    isComment: true
  }})
  res.send({ code: 1, msg: "评论成功", result })
}

// 获取单个订单评价
async function getOrderComment(req, res) {
  let { order_id } = req.body
  let result = await allSchema.commentsSchema.find({order_id})
  res.send({ code: 1, msg: "获取成功", data: result })
}

// 获取商家所有评价
async function getComments(req, res) {
  let { shop_id } = req.body
  let result = await allSchema.commentsSchema.find({shop_id})
  res.send({ code: 1, msg: "获取成功", data: result })
}

//获取商品 分页查询
async function getGoodsSkip(req, res) {
  // let { page, limit } = req.body;
  // let result = await allSchema.goodsAddSchema
  //   .find({show:true})
  //   .skip((page - 1) * limit)
  //   .limit(limit * 1);
  // res.send({ code: 1, msg: "获取成功", data: result });

  let {page,limit}=req.body;
  //只获取show为true的商品
  let result=await allSchema.goodsAddSchema.find({show:true}).skip((page-1)*limit).limit(limit*1).sort({createdAt: -1})

  //拿到里面user_id获取最新的用户信息
  let userArr=[]
  for(let i=0;i<result.length;i++){
      let user=await allSchema.userAddSchema.find({_id:result[i].user_id})
      userArr.push(...user)
      result[i].user_img=userArr[i].img_head

  }

  // console.log(userArr)


  res.send({code:1,msg:'获取成功',data:result})

}

//购物车返回商品
async function getShopCart(req, res) {
  //前端返回一个对象数组 [{id:1,count:1},{id:2,count:2}]
  let { goods } = req.body;
  let result = [];
  //获取商品 通过id
  for (let i = 0; i < goods.length; i++) {
      let good = await allSchema.goodsAddSchema.find({ good_id: goods[i].id });
      let goodRes={
       ...good[0]. _doc,
        count:goods[i].count
      }
      console.log(goodRes)
      result.push(goodRes);
  }

  //返回商品
  res.send({ code: 1, msg: "获取成功", data: result });


}
//创建管理员
async function addAdmin(req, res) {
  let { name, password } = req.body;
  let token = jwt.sign(password, "privateKey"); //加密
  let admin = await allSchema.rootUserSchema.create({ name, password: token });
  res.send({ code: 1, msg: "注册成功" });
}

//删除管理员
async function delAdmin(req, res) {
  let { id } = req.body;
  let result = await allSchema.rootUserSchema.deleteOne({ _id: id });
}

// 封禁用户
async function banUser(req, res) {
  let { name, id, isBan } = req.body
  let result = await allSchema.userAddSchema.updateOne({ _id: id }, {
    $set: {isBan}
  })
  let deleteUserGoods = await allSchema.goodsAddSchema.deleteMany({ user_id:id })
  res.send({ code: 1, msg: '封禁成功', data:result, delete: deleteUserGoods })
}

//添加地址
async function addAddress(req, res) {
  let { name, phone, address, is_default, token } = req.body;
  console.log(req.body);
  let addresss = await allSchema.allMapSchema.create({
    name,
    phone,
    address,
    is_default,
    token,
  });
  res.send({ code: 1, msg: "添加成功", data: addresss });
}

//删除地址
async function delAddress(req, res) {
  let { id } = req.body;
  let result = await allSchema.allMapSchema.deleteOne({ _id: id });
  res.send({ code: 1, msg: "删除成功" });
}

//查看自己的地址
async function getAddress(req, res) {
  let { token } = req.body;
  let result = await allSchema.allMapSchema.find({
    token,
  });
  if (result.length > 0) {
    res.send({ code: 1, msg: "获取成功", data: result });
  } else {
    res.send({ code: 0, msg: "获取失败" });
  }
}

//修改地址
async function editAddress(req, res) {
  let { _id, name, phone, address, is_default } = req.body;
  let result = await allSchema.allMapSchema.updateOne(
    { _id: _id },
    {
      $set: {
        name: name,
        phone: phone,
        address: address,
        is_default: is_default,
      },
    }
  );
}

//获取自己的默认地址
async function getDefaultAddress(req, res) {
  let { token } = req.body;
  let result = await allSchema.allMapSchema.find({
    token,
    is_default: true,
  });
  if (result.length > 0) {
    res.send({ code: 1, msg: "获取成功", data: result });
  } else {
    res.send({ code: 0, msg: "获取失败,还没设置默认地址" });
  }
}

//设置默认地址
async function setDefaultAddress(req, res) {
  let { _id } = req.body;
  let result = await allSchema.allMapSchema.update(
    { _id: _id },
    { $set: { is_default: true } }
  );
  //其他的地址设置为false
  let result1 = await allSchema.allMapSchema.update(
    { _id: { $ne: _id } },
    { $set: { is_default: false } }
  );
  res.send({ code: 1, msg: "设置成功" });
}


//修改头像
async function setUserHead(req,res){
    let {_id,head_img}=req.body
    // console.log(_id,head_img)
let result=await allSchema.userAddSchema.updateOne({_id:_id},{$set:{
    img_head:head_img}})
    // console.log(result)
res.send({code:1,msg:'设置成功'})

}

// 根据id查询头像
async function getHead(req, res) {
  let { id } = req.body
  // console.log(id)
  let result = await allSchema.userAddSchema.findById({_id:id})
  res.send({ code: 1, msg: '查询成功', data: result })
}

// 添加聊天内容
async function addChatContent(req, res) {
  let { content, current_id, shop_id, user_id, token } = req.body
  console.log(req.body)
  let result = await allSchema.allChatSchema.create({
    content,
    current_id,
    user_id,
    shop_id,
    token
  })
  res.send({ code: 1, msg: '添加成功', data: result })
  console.log(result)
}

// 查询聊天内容
async function getChatContent(req, res) {
  let { shop_id, user_id } = req.body
  let result = await allSchema.allChatSchema.find({shop_id, user_id}).sort({createdTime: 1})
  res.send({ code: 1, msg: '查询成功', data: result })
}

module.exports = {
  addUser, //添加用户 注册
  login, //登录
  addGoods, //添加商品
  editGoods, //编辑商品
  delGoods, //删除商品
  addOrder, //添加订单
  delOrder, //删除订单
  editOrder, //修改订单状态
  getOrder, //获取订单
  getGoodsSkip, //获取商品 分页查询
  addAdmin, //创建管理员
  delAdmin, //删除管理员
  getMyGoods, //查看自己发布的商品
  getGoodsById, //通过商品id获取商品
  getShopCart, //购物车返回商品
  addAddress, //添加地址
  delAddress, //删除地址
  getAddress, //查看自己的地址
  editAddress, //修改地址
  getDefaultAddress, //获取自己的默认地址
  setDefaultAddress, //设置默认地址
  setUserHead,
  getUserHead,
  getHead,
  addChatContent,
  getChatContent,
  getAllUser,
  banUser,
  checkUser,
  review,
  getComments,
  getOrderComment,
  getAllGoods,
  checkGoods,
  getCurrentUser,
  updateCurrentUser
};
