const db = require("../db/index.js");
let allSchema = require("../Schema/index.js");

//添加用户
let jwt = require("jsonwebtoken");

async function addUser(req, res) {
  let { name, img_head, password } = req.body;
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
    });
    res.send({ code: 1, msg: "注册成功" });
  }
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

//添加商品
async function addGoods(req, res) {
  let { name, price, introduce, img, good_id, user_id, username, address } =
    req.body;
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
  });

  res.send({ code: 1, msg: "添加成功" });
}

//查看自己发布的商品
async function getMyGoods(req, res) {
  let { user_id } = req.body;
  let result = await allSchema.goodsAddSchema.find({
    user_id: user_id,
  });
  if (result.length > 0) {
    res.send({ code: 1, msg: "获取成功", data: result });
  } else {
    res.send({ code: 0, msg: "获取失败" });
  }
}

//编辑商品
async function editGoods(req, res) {
  let { name, price, id } = req.body;
  let goods = await allSchema.goodsAddSchema.update(
    { _id: id },
    { $set: { name, price } }
  ); // 用id查找
  console.log(goods);
}

//删除商品
async function delGoods(req, res) {
  let { id } = req.body;
  let goods = await allSchema.goodsAddSchema.deleteOne({ __id: id }); // 用id查找
}

//通过商品id获取商品
async function getGoodsById(req, res) {
  let { goods_id } = req.body;
  let result = await allSchema.goodsAddSchema.find({
    good_id: goods_id,
  });

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
  } = req.body;

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
  });

  //删除商品 修改商品状态
  let goods = await allSchema.goodsAddSchema.update(
    { good_id: goods_id },
    { $set: { show: false } }
  ); // 用id查找

  res.send({ code: 1, msg: "添加成功" });
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
  let result = await allSchema.orderSchema.update(
    { _id: _id },
    { $set: { status: status } }
  );
  res.send({ code: 1, msg: "修改成功" });
}

//获取订单
async function getOrder(req, res) {
  let { shop_id } = req.body;
  console.log(shop_id);
  let result = await allSchema.orderSchema.find({
    $or: [{ shop_id: shop_id }, { user_id: shop_id }],
  });

  console.log(result);

  if (result.length > 0) {
    res.send({ code: 1, msg: "获取成功", data: result });
  } else {
    res.send({ code: 0, msg: "获取失败", data: result || [] });
  }
}

//获取商品 分页查询
async function getGoodsSkip(req, res) {
  let { page, limit } = req.body;
  let result = await allSchema.goodsAddSchema
    .find()
    .skip((page - 1) * limit)
    .limit(limit * 1);
  res.send({ code: 1, msg: "获取成功", data: result });
}

//购物车返回商品
async function getShopCart(req, res) {
  //前端返回一个对象数组 [{id:1,count:1},{id:2,count:2}]
  let { goods } = req.body;
  let result = [];
  let resq = res;
  goods.forEach((item, index) => {
    allSchema.goodsAddSchema.find({ good_id: item.id }).then((res) => {
      //将res中的对象提取出来
      let {
        name,
        price,
        introduce,
        img,
        good_id,
        user_id,
        username,
        user_img,
        address,
        show,
      } = res[0];
      result.push({
        name,
        price,
        introduce,
        img,
        good_id,
        user_id,
        username,
        user_img,
        address,
        count: item.count,
        show,
      });
      if (index === goods.length - 1) {
        resq.send({ code: 1, msg: "获取成功", data: result });
      }
    });
  });
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
  let result = await allSchema.allMapSchema.update(
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
    console.log(_id,head_img)
let result=await allSchema.userAddSchema.updateOne({_id:_id},{$set:{
    img_head:head_img}})
    console.log(result)
res.send({code:1,msg:'设置成功'})

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
  getUserHead
};
