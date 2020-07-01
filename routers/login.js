/* 
    统一管理路由
*/
const express = require('express')
const path = require('path')
const utility = require('utility')
const db = require(path.join(__dirname, '../common/common.js'))

//产生一个router对象
const router = express.Router()

//把路由挂载到router对象上
router.post('/login', (req, res) => {
    res.send('login')
})

//注册用户接口
router.post('/reguser', async (req, res) => {
    //获取前端换地过来的参数
    let param = req.body//{ username: 'tom', password: 'Jerry' }
    //对客户端传递过来的数据进行加密后再进行数据库的操作
    param.password = utility.md5(req.body.password)
    //调用数据库的相关方法进行数据的添加操作
    let sql = 'insert into user set ?'
    let ret = await db.operateDate(sql, param)
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
    console.log('hello')
    let sql = 'select * from user'
    let ret = await db.operateDate(sql, null)
    res.json({
        status: 0,
        data: ret
    })
})

//导出router对象 (router本来就是对象)
module.exports = router