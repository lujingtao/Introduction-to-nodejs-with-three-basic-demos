var express             = require('express');
var bodyParse           = require('body-parser')
var app                 = express();
app.use(bodyParse.urlencoded({extended:false})) ;

// 处理根目录的get请求
app.get('/',function(req,res){
    res.sendfile('main.html') ;
    console.log('服务器等待请求中...');
}) ;

// 处理/login请求
app.post('/login',function(req,res){
    //获取登录名称和密码
    name=req.body.name ;
    pwd=req.body.pwd;
    //向前台反馈信息
    res.status(200).send(
        "后台反馈信息：登录帐号："+name+" | 登录密码："+pwd
      ) ;
});

// 监听3000端口
var server=app.listen(3000,function(){
    console.log('app is listening at http://localhost:3000/ \n 请手动打开网址');
}) ;