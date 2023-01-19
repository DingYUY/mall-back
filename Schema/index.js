const db = require("../db/index.js");

const goodsAddSchema = new db.Schema({
  name: String, //商品名字
  price: Number, //商品价格
  introduce: String, //商品简介
  img: Array, //商品的图片
  good_id: String, //商品的id
  user_id: String, //用户的id
  username: String, //用户名字
  user_img: String, //用户头像
  address: String, //用户地址
  show: Boolean, //是否显示
});

const userAddSchema = new db.Schema({
  name: String,
  img_head: String,
  password: String,
});

const orderSchema = new db.Schema({
  order_id: String, //订单号
  custorm_name: String, //客户名字
  user_id: String, //用户id
  amount: Number, //订单 总金额
  status: Number, //订单状态
  shop_name: String, //店铺名字
  shop_id: String, //店铺id
  goods_name: String, //商品名字
  goods_title: String, //商品简介
  goods_id: String, //商品id
  custorm_address: String, //客户地址
  img: Array, //商品图片
});

const rootUserSchema = new db.Schema({
  name: String, //用户名
  password: String, //密码
});

const allMapSchema = new db.Schema({
  name: String, //姓名
  phone: String, //电话
  address: String, //地址
  is_default: Boolean, //是否是默认地址
  token: String, //token
});

//导出多个模型
module.exports = {
  goodsAddSchema: db.model("goods", goodsAddSchema),
  userAddSchema: db.model("user", userAddSchema),
  orderSchema: db.model("order", orderSchema),
  rootUserSchema: db.model("rootUser", rootUserSchema),
  allMapSchema: db.model("allMap", allMapSchema),
};
