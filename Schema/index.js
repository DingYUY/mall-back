/*
 * @Author: 丁雨阳 dzyyyt@163.com
 * @Date: 2023-01-18 09:58:24
 * @LastEditors: 丁雨阳 dzyyyt@163.com
 * @LastEditTime: 2023-03-09 13:46:32
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
const db = require("../db/index.js");
const moment = require('moment')


function getDate() {
  return moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
}

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
  reviewStatus: Number, // 审核状态 0 未审核， 1 已审核  2 拒绝
  studentId: String,
  studentName: String,
  count: Number, // 商品数量
  shop_phone: String, 
  createdAt: {
    type: Date,
    default: getDate()
  }
});

const userAddSchema = new db.Schema({
  name: String,
  img_head: String,
  password: String,
  isManager: {
    type: Boolean,
    default: false
  },
  isBan: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: getDate()
  },
  studentId: String,
  studentName: String,
  idCard: String,
  phone: String,
  status: Number // 0 未审核， 1 已审核  2 拒绝
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
  buy_count: Number, // 购买数量
  shop_phone: String, // 商家电话
  isComment: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: getDate()
  }
});

const rootUserSchema = new db.Schema({
  name: String, //用户名
  password: String, //密码
  isManager: {
    type: Boolean,
    default: true
  },
  img_head: {
    type: String,
    default: "https://img0.baidu.com/it/u=1217304799,3113310756&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1673456400&t=9cc8f1082d24652f45ef5488435ca3e6"
  },
  createdAt: {
    type: Date,
    default: getDate()
  }
});

const allMapSchema = new db.Schema({
  name: String, //姓名
  phone: String, //电话
  address: String, //地址
  is_default: Boolean, //是否是默认地址
  token: String, //token
  createdAt: {
    type: Date,
    default: getDate()
  }
});

const allChatSchema = new db.Schema({
  content: String, // 发送内容
  shop_id: String, // 商家id
  user_id: String, // 买家id
  current_id: String, // 发送消息的人的id
  token: String,
  createdTime: {
    type: Date,
    default: getDate()
  }
})

const commentsSchema = new db.Schema({
  observerId: String, // 评论人id
  shop_id: String, // 商家id
  comment: String, // 评论内容
  reviewScore: String, // 评分
  shop_name: String, // 商家名称
  order_id: String, // 订单id
  observerName: String, //评论人名称
  createdTime: {
    type: Date,
    default: getDate()
  }
})

//导出多个模型
module.exports = {
  goodsAddSchema: db.model("goods", goodsAddSchema),
  userAddSchema: db.model("user", userAddSchema),
  orderSchema: db.model("order", orderSchema),
  rootUserSchema: db.model("rootUser", rootUserSchema),
  allMapSchema: db.model("allMap", allMapSchema),
  allChatSchema: db.model("chat", allChatSchema),
  commentsSchema: db.model("comment", commentsSchema)
};
