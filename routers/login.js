/* 
    统一管理路由
*/
const express = require('express')
const path = require('path')
const utils = require('utility')
const jwt = require('jsonwebtoken')
const db = require(path.join(__dirname, '../common/common.js'))

//产生一个router对象
const router = express.Router()

//把路由挂载到router对象上
//用户登录接口
router.post('/login', async (req, res) => {
    //获取前端换地过来的参数
    let param = req.body
    //对客户端传递过来的数据进行加密后再进行数据库的操作
    param.password = utils.md5(req.body.password)
    //根据用户密码查询数据库
    let sql = 'select id from user where username = ? and password = ?'
    //operateDate的第二个参数是'?'占位符 如果是查询,那么这里是数组,如果是增删改查,那么这里是对象
    let ret = await db.operateDate(sql, [param.username, param.password])
    //非空判断和是否传参判断
    if (ret && ret.length > 0) {
        //如果登录验证通过,就生成token信息
        //1. 参数1表示添加到token中的信息
        //2. 参数2表示加密的唯一标识(加密的干扰字符串)
        //3. 加密配置选项(可以设置token的有效期)
        //4. jwt规定在token字符串之前添加一个Bearer 特殊标识
        //"BearereyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IjEyMzQiLCJpZCI6MTUsImlhdCI6MTU5MzYxMDA5NywiZXhwIjoxNTkzNjEzNjk3fQ.jgzFGrzli5e2GtFGGCVKVTahDgHtssYs4zCvr1T4_FM"
        let token = jwt.sign({
            username: param.username,
            id: ret[0].id
        }, 'bigevent', {
            //token有效期
            expiresIn: '10h'
        })
        res.json({
            status: 0,
            message: '登录成功',
            token: 'Bearer ' + token
        })
    } else {
        res.json({
            status: 1,
            message: '登录失败'
        })
    }
})

//注册用户接口
router.post('/reguser', async (req, res) => {
    //获取前端换地过来的参数
    let param = req.body//{ username: 'tom', password: 'Jerry' }
    //对客户端传递过来的数据进行加密后再进行数据库的操作
    param.password = utils.md5(req.body.password)
    //调用数据库的相关方法进行数据的添加操作
    let sql = 'insert into user set ?'
    let ret = await db.operateDate(sql, param)
    console.log(ret);
    //非空判断和操作影响了几行数据判断
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "注册成功"
        })
    } else {
        res.json({
            status: 1,
            message: "注册失败"
        })
    }
})

router.get('/test', async (req, res) => {
    let sql = 'select * from user'
    let ret = await db.operateDate(sql, null)
    res.json({
        status: 0,
        data: ret
    })
})

router.get('/userinfo', (req, res) => {
    res.send('userinfo')
})

//导出router对象 (router本来就是对象)
module.exports = router