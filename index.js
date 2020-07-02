//1.导入模块
const express = require('express');
const cors = require('cors')
const path = require('path')
const jwt = require('express-jwt')
const loginUrl = require(path.join(__dirname, "./routers/login.js"))
const userUrl = require(path.join(__dirname, "./routers/user.js"))
const cateUrl = require(path.join(__dirname, "./routers/cate.js"))

//2.创建服务器
let app = express();

//处理客户端post请求参数
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// for parsing application/json
app.use(express.json())

//设置跨域
app.use(cors())

//设置token
// jwt中间件的作用：从token中解析用户信息添加到req.user属性中
/* app.use(jwt({
    //加密的唯一标识(加密的干扰字符串)
    secret: 'bigevent'
}).unless({
    //unless的作用 : 排除一些路径不需要进行token解析
    path: ['/api/login', '/api/reguser', '/api/test','/my/userinfo',]
})); */
/* 
    path路径支持正则,/^\/api/该正则表示以 /api开始,上下等效
*/
app.use(jwt({ secret: 'bigevent' }).unless({ path: /^\/api/ }))

//设置路径
app.use('/api', loginUrl)
app.use('/my', userUrl)
app.use('/my/article', cateUrl)

//统一处理所有不存在的路由
app.all('*', (req, res) => {
    res.status(404).json({
        status: 404,
        message: "请求资源不存在"
    })
})

//添加一个统一处理异常信息的中间件
app.use((err, req, res, next) => {
    if (err.status === 401) {
        //token验证失败
        res.json({
            status: 401,
            message: err.message
        })
    } else {
        //服务端错误
        res.json({
            status: 500,
            message: "服务器错误" + err.message
        })
    }
})

//3.开启服务器
app.listen(9999, () => {
    console.log('running...');
})

