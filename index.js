//1.导入模块
const express = require('express');
const cors = require('cors')
const path = require('path')
const loginUrl = require(path.join(__dirname,"./routers/login.js"))

//2.创建服务器
let app = express();

//处理客户端post请求参数
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// for parsing application/json
app.use(express.json())

//设置跨域
app.use(cors())

//设置路径
app.use('/api',loginUrl)

//3.开启服务器
app.listen(9999, () => {
    console.log('running...');
});
