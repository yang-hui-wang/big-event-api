function operateDate(sql, param) {
  return new Promise((resolve, reject) => {
    // 1、导入mysql第三方包
    const mysql = require('mysql')

    // 2、准备连接数据库相关参数
    const cn = mysql.createConnection({
      //电脑所在的IP地址
      host: 'localhost',
      //数据库端口
      port: 3306,
      //数据库名称
      database: 'bigevent',
      //数据库账号
      user: 'root',
      //数据库密码
      password: '123456',
    })

    // 3、执行连接操作s
    cn.connect()

    //4. 操作数据库
    cn.query(sql, param, (err, result) => {
      if (err) {
        reject(err)
        // return
      } else {
        resolve(result)
        // return
      }
    });

    // 5、关闭数据库连接
    cn.end()
  })
}

module.exports = {
  operateDate
}