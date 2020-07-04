/* 
    文章路由模块
*/
const express = require('express')
const path = require('path')
const multer = require('multer')
const upload = multer({ dest: path.join(__dirname, '../uploads') })
const db = require(path.join(__dirname, '../common/common.js'))

// 路由配置
const router = express.Router()

//获取文章的列表数据
router.get('/list', async (req, res) => {
    //获取请求参数
    let param = req.query
    param.pagenum = parseInt(param.pagenum)
    param.pagesize = parseInt(param.pagesize)
    //-------------------------
    // //分类条件
    // let cateId_condition = ''
    // if (param.cate_id) {
    //     //客户端传递了分类id
    //     cateId_condition = 'cate_id = ' + param.cate_id
    // }
    // //文章状态
    // let article_condition = ''
    // if (param.state) {
    //     article_condition = 'state = ' + param.states
    // }

    // let condition = 'where 1 = 1'
    // if (cateId_condition) {
    //     condition += 'and' + ateId_condition
    // }
    // if (article_condition) {
    //     condition += 'and' + article_condition
    // }
    //-----------------------------
    // 动态拼接查询条件
    let condition = ''
    for (let key in param) {
        if (key === 'cate_id' && param[key]) {
            condition += key + '=' + param[key] + ' and '
        } else if (key === 'state' && param[key]) {
            condition += key + '="' + param[key] + '" and '
        }
    }
    // 去掉最后一个and 
    // condition = condition.substring(0, condition.lastIndexOf('and'))
    // let sql = 'select * from article limit ? , ? '
    let sql = 'select a.id, a.title, a.pub_date, a.state, c.name as cate_name from article as a join cate as c on a.cate_id = c.id where a.is_delete = 0 limit ?, ?'
    // 查询列表总数
    let totalSql = 'select count(*) as total from article where is_delete = 0'
    if (condition) {
        condition += ' a.is_delete = 0 '
        // sql = 'select * from article where ' + condition + ' limit ?, ?'
        sql = 'select a.id, a.title, a.pub_date, a.state, c.name as cate_name from article as a join cate as c on a.cate_id = c.id where ' + condition + ' limit ?, ?'
        // 携带条件时查询总数
        totalSql = 'select count(*) as total from article as a where ' + condition
    }
    // 查询列表数据
    let ret = await db.operateDate(sql, [param.pagesize * (param.pagenum - 1), param.pagesize])
    // 查询列表总数
    let cret = await db.operateDate(totalSql)
    if (ret && ret.length > 0) {
        res.json({
            status: 0,
            message: "查询文章列表数据成功！",
            data: ret,
            total: cret[0].total
        })
    } else {
        res.json({
            status: 1,
            message: "查询文章列表数据失败！"
        })
    }
})

//发布新文章
router.post('/add', upload.single('cover_img'), async (req, res) => {
    //获取请求参数
    let param = req.body
    //获取id
    let id = param.id
    //获取上传文件的路径
    let filePath = '/uploads/' + req.file.filename
    console.log(filePath);

    //更新用户的信息
    let sql = 'insert into article set ? '
    let ret = await db.operateDate(sql, {
        title: param.title,
        cate_id: param.cate_id,
        content: param.content,
        cover_img: filePath,
        state: param.state,
        is_delete: 0,
        author_id: id,
        pub_date: new Date()
    })
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "发布文章成功！",
        })
    } else {
        res.json({
            status: 1,
            message: "发布文章失败！"
        })
    }
})


//根据Id删除文章数据
router.get('/delete/:id', async (req, res) => {
    //获取要删除的文章id
    let id = req.params.id
    //数据库操作
    // let sql = 'delete from article where  id =  ? '
    //假删除
    let sql = 'update article set is_delete = 1 where id = ?'
    let ret = await db.operateDate(sql, id)
    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "删除成功！",
        })
    } else {
        res.json({
            status: 1,
            message: "删除失败！"
        })
    }
})

//根据Id获取文章详情
router.get('/:id', async (req, res) => {
    //获取要查询的文章id
    let id = req.params.id
    //数据库操作
    let sql = 'select * from article where is_delete = 0  and id = ?'
    let ret = await db.operateDate(sql, id)
    if (ret && ret.length > 0) {
        res.json({
            status: 0,
            message: "获取文章成功！",
            data: ret[0]
        })
    } else {
        res.json({
            status: 1,
            message: "获取文章失败！"
        })
    }
})

//根据Id更新文章信息
router.post('/edit', upload.single('cover_img'), async (req, res) => {
    //获取请求参数
    let param = req.body
    //获取上传文件的路径
    let filePath = '/uploads/' + req.file.filename
    //更新用户的信息
    let sql = 'update article set ? where id = ? '
    let ret = await db.operateDate(sql, [{
        title: param.title,
        cate_id: param.cate_id,
        content: param.content,
        cover_img: filePath,
        state: param.state
    }, param.Id])
    console.log(ret);

    if (ret && ret.affectedRows > 0) {
        res.json({
            status: 0,
            message: "修改文章成功！",
        })
    } else {
        res.json({
            status: 1,
            message: "修改文章失败！"
        })
    }
})




//导出router对象
module.exports = router