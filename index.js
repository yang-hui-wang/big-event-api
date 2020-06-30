//1.导入模块
const express = require('express');
const spp = require('mysql');

//2.创建服务器
let app = express();
//3.开启服务器
app.listen(8888,()=>{
console.log('success');
}); 

app.get('/data',(req,res) => {

})