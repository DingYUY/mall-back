const express = require("express");
const app = express();
const db = require("./db/index.js");
let allSchema = require("./Schema/index.js");
//解决跨域
const cors = require("cors");
let jwt = require("jsonwebtoken");
const allFun = require("./fun");
const bodyParser = require("body-parser"); //把前端传过来的数据转换成对象
const baseUrl = "baseUrl";
const multipart = require("connect-multiparty");
const fs = require("fs"); //解析post请求的参数  可以获取到参数  也可以获取到文件
const { default: mongoose } = require("mongoose");
const multipartyMiddleware = multipart(); //解析post请求的参数  可以获取到参数  也可以获取到文件

const ws = require('nodejs-websocket') // websocket
const hostName = '127.0.0.1'
let users = {}
let path=require('path')


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //拿到客户端发送的消息
// app.use("/public", express.static(path.join(__dirname, './public/img')));
app.use("/public", express.static("./public/img"));

mongoose.set("strictQuery", false);

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

// 创建管理员
app.post("/addManager", (req, res) => {
  allFun.addAdmin(req, res)
})

// 获取所有用户
app.post("/getAllUser", (req, res) => {
  allFun.getAllUser(req, res)
})

// 封禁用户
app.post("/ban", (req, res) => {
  allFun.banUser(req, res)
})

//上传图片
app.post("/api/upload", multipartyMiddleware, (req, res) => {
  //获取图片
  console.log(req.files.file);
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
      './public/img/' + year + month + day + size + hour + ".jpg",
      data,
      (err) => {
        if (err) {
          console.log(err);
          return;
        }

        // console.log(path.join(__dirname, './public/img/'))
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

app.post("/getUserHead", (req, res) => {
  allFun.getUserHead(req, res);
});

app.post('/getHead', (req, res) => {
  allFun.getHead(req, res)
})

app.post('/addChat', (req, res) => {
  allFun.addChatContent(req, res)
})

app.post('/getChat', (req, res) => {
  allFun.getChatContent(req, res)
})

app.post('/checkUser', (req, res) => {
  allFun.checkUser(req, res)
})

app.post('/review', (req, res) => {
  allFun.review(req, res)
})

app.post('/getComments', (req, res) => {
  allFun.getComments(req, res)
})

app.post('/getOrderComment', (req, res) => {
  allFun.getOrderComment(req, res)
})

app.post('/getAllGoods', (req, res) => {
  allFun.getAllGoods(req, res)
})

app.post('/checkGoods', (req, res) => {
  allFun.checkGoods(req, res)
})

app.post('/getCurrentUser', (req, res) => {
  allFun.getCurrentUser(req, res)
})

app.post('/updateCurrentUser', (req, res) => {
  allFun.updateCurrentUser(req, res)
})

let chatList = []

// 实时通信
function boardcast(obj) {
  chatList = []
  chatList.push(obj)
  server.connections.forEach(connection => {
    // console.log(connection)
    console.log('chatList', chatList)
    connection.sendText(JSON.stringify(chatList))
  })
}

const server = ws.createServer((connection) => {
  console.log('new Connection...')
  // 处理客户端发来的消息
  connection.on('text', (data) => {
    console.log('接收到的客户端信息:' + data)
    // connection.sendText('服务器返回数据:' + data)
    boardcast(JSON.parse(data))
  })
  // 监听关闭
  connection.on('close', (code, reason) => {
    console.log('Connection closed')
    chatList = []
  })
  // 监听异常
  connection.on('error', () => {
    console.log('服务异常关闭')
    chatList = []
  })
}).listen(3000)

app.listen(3175, () => {
  console.log("服务器启动成功:http://127.0.0.1:3175");
});
