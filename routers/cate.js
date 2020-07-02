/* 
    文章分类接口
*/
const express = require('express')
const path = require('path')
const db = require(path.join(__dirname, '../common/common.js'))

// 路由配置
const router = express.Router()

// 获取文章分类列表
router.get('/cates', async (req, res) => {
    //操作数据库
    let sql = 'select * from cate'
    let ret = await db.operateDate(sql)
    if (ret && ret.length > 0) {
        res.json({
            status: 0,
            message: "获取分类成功！",
            data: ret
        })
    } else {
        res.json({
            status: 1,
            message: "获取分类失败！"
        })
    }
})

// 新增文章分类
router.post('/addcates', async (req, res) => {
    //获取请求参数
    let parm = req.body
    //更新用户的信息
    let sql = 'insert into cate set ? '
    let ret = await db.operateDate(sql, parm)
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "添加分类成功！",
        })
    } else {
        res.json({
            status: 1,
            message: "添加分类失败！"
        })
    }
})

// 根据Id删除文章分类
router.get('/deletecate/:id', async (req, res) => {
    //获取要删除的分类id
    let id = req.params.id
    //数据库操作
    // let sql = 'delete from cate where id =  ? '
    //假删除
    let sql = 'update category set is_delete = 1 where id = ?'
    let ret = await db.operateDate(sql, id)
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "删除分类成功！",
        })
    } else {
        res.json({
            status: 1,
            message: "删除分类失败！"
        })
    }
})

// 根据Id获取文章分类数据
router.get('/cates/:id', async (req, res) => {
    //获取分类的id
    let id = req.params.id
     //数据库操作
     let sql = 'select * from cate where id =  ? '
     let ret = await db.operateDate(sql, id)
     if (ret && ret.length > 0) {
         res.json({
             status: 0,
             message: "获取文章分类数据成功!",
             data:ret[0]
         })
     } else {
         res.json({
             status: 1,
             message: "获取文章分类数据失败!"
         })
     }
})
// 根据Id更新文章分类数据
router.post('/updatecate', async (req, res) => {
    //获取请求参数
    let parm = req.body
    //更新用户的信息
    let sql = 'update cate set ? where id = ?'
    // 如果是增删改操作，那么返回对象；如果是查询，那么返回数组
    let value = {
        name: parm.name,
        alias: parm.alias,
    }
    let ret = await db.operateDate(sql, [value, parm.id])
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "更新分类成功！",
        })
    } else {
        res.json({
            status: 1,
            message: "更新分类失败！"
        })
    }
})

//导出router对象
module.exports = router
