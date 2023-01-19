/*
 * @Author: 丁雨阳 dzyyyt@163.com
 * @Date: 2023-01-18 09:58:02
 * @LastEditors: 丁雨阳 dzyyyt@163.com
 * @LastEditTime: 2023-01-18 22:51:29
 * @Description: 
 * 
 * Copyright (c) 2023 by 丁雨阳 dzyyyt@163.com, All Rights Reserved. 
 */
const mongoose = require("mongoose");

main()
  .catch((err) => console.log(err, "error"))
  .then((res) => {
    console.log("数据库连接成功");
  });

async function main() {
  await mongoose.connect("mongodb://shop2:shop123@127.0.0.1:27017/shop");
}

//导出mongoose
module.exports = mongoose;
