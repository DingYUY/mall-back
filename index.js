const express = require("express");
const app = express();
const db = require("./db/index.js");
let allSchema = require("./Schema/index.js");
//解决跨域
const cors = require("cors");
let jwt = require("jsonwebtoken");
const allFun = require("./fun");
const bodyParser = require("body-parser"); //他的作用是把前端传过来的数据转换成对象
const baseUrl = "baseUrl";
const multipart = require("connect-multiparty");
const fs = require("fs"); //解析post请求的参数  可以获取到参数  也可以获取到文件
const { default: mongoose } = require("mongoose");
const multipartyMiddleware = multipart(); //解析post请求的参数  可以获取到参数  也可以获取到文件

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //拿到客户端发送的消息
app.use("/public", express.static("./public/img"));

mongoose.set("strictQuery", false)

//注册
app.post("/addUser", (req, res) => {
  allFun.addUser(req, res);
});

//登录
app.post("/login", (req, res) => {
  allFun.login(req, res);
});

//添加商品
app.post("/addGoods", (req, res) => {
  allFun.addGoods(req, res);
});

//查看自己发布的商品
app.post("/getMyGoods", (req, res) => {
  allFun.getMyGoods(req, res);
});

//编辑商品
app.post("/editGoods", (req, res) => {
  allFun.editGoods(req, res);
});

//删除商品
app.post("/delGoods", (req, res) => {
  allFun.delGoods(req, res);
});

//添加订单
app.post("/addOrder", (req, res) => {
  allFun.addOrder(req, res);
});

//修改订单状态
app.post("/editOrder", (req, res) => {
  allFun.editOrder(req, res);
});

//获取订单
app.post("/getOrder", (req, res) => {
  allFun.getOrder(req, res);
});

//删除订单
app.post("/delOrder", (req, res) => {
  allFun.delOrder(req, res);
});

//分页获取订单
app.post("/getOrderPage", (req, res) => {
  allFun.getGoodsSkip(req, res);
});
//获取购物车的商品
app.post("/getShopCart", (req, res) => {
  allFun.getShopCart(req, res);
});

//通过商品id获取商品
app.post("/getGoodsById", (req, res) => {
  allFun.getGoodsById(req, res);
});

//添加地址
app.post("/addAddress", (req, res) => {
  allFun.addAddress(req, res);
});

//删除地址
app.post("/delAddress", (req, res) => {
  allFun.delAddress(req, res);
});

//查看自己的地址
app.post("/getAddress", (req, res) => {
  allFun.getAddress(req, res);
});

//修改地址
app.post("/editAddress", (req, res) => {
  allFun.editAddress(req, res);
});

//获取默认地址
app.post("/getDefaultAddress", (req, res) => {
  allFun.getDefaultAddress(req, res);
});

//设置默认地址
app.post("/setDefaultAddress", (req, res) => {
  allFun.setDefaultAddress(req, res);
});

//上传图片
app.post("/api/upload", multipartyMiddleware, (req, res) => {
  //获取图片
  console.log(req.files.file.size);
  let fs = require("fs");
  let year = new Date().getFullYear();
  let month = new Date().getMonth() + 1;
  //获取图片的size
  let size = req.files.file.size || req.files.file.size;
  console.log(size);
  let day = new Date().getDate();
  let hour = new Date().getHours();
  fs.readFile(req.files.file.path, (err, data) => {
    fs.writeFile(
      "./public/img/" + year + month + day + size + hour + ".jpg",
      data,
      (err) => {
        if (err) {
          console.log(err);
          return;
        }
      }
    );
    //返回图片的地址
    res.send({
      code: 0,
      msg: "上传成功",
      url: "public/" + year + month + day + size + hour + ".jpg",
    });
  });
});


//设置头像
app.post("/setUserHead", (req, res) => {
    allFun.setUserHead(req, res);
  });


  app.post('/getUserHead',(req,res)=>{
    allFun.getUserHead(req,res)
  })
app.listen(3175, () => {
  console.log("服务器启动成功:http://127.0.0.1:3175");
});
