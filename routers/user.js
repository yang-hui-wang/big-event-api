/*
  用户信息相关接口
*/
const express = require('express')
const path = require('path')
const utils = require('utility')
const db = require(path.join(__dirname, '../common/common.js'))

// 路由配置
const router = express.Router()

// 获取用户信息
router.get('/userinfo', async (req, res) => {
    //根据token获取用户的id 
    //req.user表示从token中获取的信息,该信息是登录成功后放入的
    //req.user属性名称是固定的 
    // console.log(req.user.id)
    //根据用户的id查询用户的详细信息
    let sql = 'select id, username, nickname, email, user_pic from user where id = ?'
    let ret = await db.operateDate(sql, req.user.id)
    if (ret && ret.length > 0) {
        res.json({
            status: 0,
            message: "获取用户基本信息成功！",
            data: ret[0]
        })
    } else {
        res.json({
            status: 1,
            message: "获取用户基本信息失败！"
        })
    }
})

// 更新用户信息
router.post('/userinfo', async (req, res) => {
    //获取请求参数
    let parm = req.body
    console.log(parm);//{ nickname: 'abcd', email: '125@163.com' }
    //更新用户的信息
    let sql = 'update user set ? where id = ?'
    // 如果是增删改操作，那么返回对象；如果是查询，那么返回数组
    let value = {
        nickname: parm.nickname,
        email: parm.email
    }
    let ret = await db.operateDate(sql, [value, parm.id])
    console.log(ret);
    console.log(parm.id);
    console.log(req.user.id);
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "修改用户信息成功！",
        })
    } else {
        res.json({
            status: 1,
            message: "修改用户信息失败！"
        })
    }
})

//更换密码接口
router.post('/updatepwd', async (req, res) => {
    //获取请求参数
    let param = req.body
    //对密码进行加密处理
    param.oldPwd = utils.md5(param.oldPwd)
    param.newPwd = utils.md5(param.newPwd)
    //获取用户的id
    let id = req.user.id
    //操作数据库
    let sql = 'update user set password = ? where id = ? and password = ? '
    let ret = await db.operateDate(sql, [param.newPwd, id, param.oldPwd])
    //返回响应状态
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "更新密码成功！",
        })
    } else {
        res.json({
            status: 1,
            message: "更新密码失败！"
        })
    }
})

//更新头像
router.post('/update/avatar', async (req, res) => {
    //获取请求参数
    let parm = req.body
    //获取用户的id
    // let id = req.user.id
    let id = 3
    //操作数据库
    let sql = 'update user set user_pic = ? where id = ? '
    let ret = await db.operateDate(sql, [parm.avatar, id])
    // console.log(parm.avatar);
    //返回响应状态    
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "更新头像成功！",
        })
    } else {
        res.json({
            status: 1,
            message: "更新头像失败！"
        })
    }
})

//导出router对象 (router本来就是对象)
module.exports = router

