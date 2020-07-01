/* 
    统一管理路由
*/
const express = require('express')
const path = require('path')
const db = require(path.join(__dirname,'../common/common.js'))

//产生一个router对象
const router = express.Router()

//把路由挂载到router对象上
router.post('/login', (req, res) => {
    res.send('login')
})

//注册用户接口
router.post('/reguser', async (req, res) => {
    //获取前端换地过来的参数
    let param = req.body
    //调用数据库的相关方法进行数据的添加操作
    let sql = 'insert into user set ?'
    let ret = await db.operateDate(sql, param)
    //非空判断和
    if(ret && ret.affectedRows > 0){

    }
    console.log(ret)
    res.send('reguser')
})

router.get('/test', async (req, res) => {
    let sql = 'select * from user'
    let ret = await db.operateDate(sql, null)
    res.json({
      status: 0,
      data: ret
    })
    res.send('abcd')
  })

//导出router对象 (router本来就是对象)
module.exports = router