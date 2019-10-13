@[toc](nodejs入门使用介绍（附3个实用基础demo）)

# 一、什么是node.js

Node.js是一个基于Chrome JavaScript运行时建立的平台， 用于方便地搭建响应速度快、易于扩展的网络应用。Node.js 使用事件驱动， 非阻塞I/O 模型而得以轻量和高效，非常适合在分布式设备上运行数据密集型的实时应用。

另一种方式可以描述为：可以使用javaScript作为后端语言编写后端程序。

 

# 二、node.js特点

1. 它是一个Javascript运行环境
2. 依赖于Chrome V8引擎进行代码解释
3. 事件驱动
4. 非阻塞I/O
5. 轻量、可伸缩，适于实时数据交互应用
6. 单进程，单线程

 
# 三、node.js 异步、事件驱动模型
其中我们最需要了解的是node.js的运行原理，我们可以这样理解，想象一下我们在快餐店点餐吃饭的场景：

顾客点餐 = 发起请求，服务员喊号 = 服务器端响应。

我们点完餐后拿到了一个号码，拿到号码，我们往往会在位置上等待，而在我们后面的请求会继续得到处理，同样是拿了一个号码然后到一旁等待，接待员能一直进行处理。等到饭菜做号了，会喊号码，我们拿到了自己的饭菜，进行后续的处理(吃饭)这个喊号码的动作在NodeJS中叫做回调(Callback)，能在事件(烧菜，I/O)处理完成后继续执行后面的逻辑(吃饭)。

这体现了NodeJS的显著特点，异步机制、事件驱动。

整个过程没有阻塞新用户的连接(点餐)，也不需要维护已经点餐的用户与厨师的连接。

基于这样的机制，理论上陆续有用户请求连接，NodeJS都可以进行响应，因此NodeJS能支持比Java、PHP程序更高的并发量。

虽然维护事件队列也需要成本，再由于NodeJS是单线程，事件队列越长，得到响应的时间就越长，并发量上去还是会力不从心。

 
# 四、node.js安装和配置
参考：
[http://www.runoob.com/nodejs/nodejs-install-setup.html](http://www.runoob.com/nodejs/nodejs-install-setup.html)


# 五、实例一（HelloWorld）
实例一当然是hello world，代码如下：
<font color="red">实例从GitHub下载后，先执行 `npm i` 来安装依赖模块，再执行 `node app.js` 运行程序。<font>
```go
var http = require('http');
http.createServer(function (request, response) {
    // 发送 HTTP 头部
    // HTTP 状态值: 200 : OK
    // 内容类型: text/plain
    response.writeHead(200, {'Content-Type': 'text/plain'});

    // 发送响应数据 "Hello World"
    response.end('Hello World\n');
}).listen(3000);

// 终端打印如下信息
console.log('app is listening at http://localhost:3000/ \n 请手动打开网址');
```
游览器输入 http://localhost:3000/ 就能看到效果了

# 六、实例二（简单爬虫）
我们做个简单爬虫来爬取政府新闻 [http://www.gov.cn/xinwen/yaowen.htm](http://www.gov.cn/xinwen/yaowen.htm)

其中依赖到 express、cheerio、superagent等模块，需要先安装（具体模块作用可以自行百度）

```go
npm install express --save
npm install cheerio --save
npm install superagent --save
```
详细nodejs代码：
```js
var express = require('express'); //引入express框架 
var cheerio = require('cheerio'); //引入cheerio，可以理解成Node.js版的jquery，使用方式跟jquery一样 
var superagent = require('superagent'); //引入superagent做http代理

var app = express();

app.get('/', function (req, res, next) {
  superagent.get('http://www.gov.cn/xinwen/yaowen.htm')
    .end(function (err, sres) {
      if (err) {
        return next(err);
      }
      var $ = cheerio.load(sres.text);
      var items = [];
      $('.list h4 a').each(function (idx, element) {
        var $element = $(element);
        items.push({
          title: $element.text()
        });
      });

      res.send(items);
    });
});


app.listen(3000, function () {
  console.log('app is listening at http://localhost:3000/ \n 请手动打开网址');
});

```
游览器输入 http://localhost:3000/ 就能看到效果了

# 七、实例三（简单前后台交互）
现在做一个“前后台简单交互”的实例，需求如下：
 
1、前台是一个登录页面，有帐号和密码输入框
2、前台填写帐号和密码并提交
3、后台获取信息后反馈给前台
4、前台获取后台反馈信息后提示给用户

前台我们用main.html，代码如下
```html
<html>
<head>
    <title>前后台简单交互</title>
    <script src="http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>
</head>
<body>
    <h3>前后台简单交互</h3>
    <form method="post">
        账号 :
        <input type="text" id="name" />
        <br/><br/>
        密码 :
        <input type="password" id="pwd" />
        <br/><br/>
        <input type="button" value="提交" id="submit">
    </form>
</body>

<script>
    //获取后台反馈数据并提示信息
    var afterLogin=function(data,status){
        if (status=='success'){
            alert(data) ;
        }else {
            alert('登录失败')
        }
    }

    //前提点击提交
    $("#submit").click(function(){
        var name    =   $("#name").val() ;
        var pwd     =   $("#pwd").val() ;
        if(name=="" || pwd==""){
            alert("帐号和密码不能为空")
        }else{
            $.post('http://localhost:3000/login',{
                    name:name ,
                    pwd:pwd
                },afterLogin
            );
        }
    });
</script>
</html>
```

后台我们写app.js，代码如下
```js
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
```
执行结果如下：
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191013204437137.gif)

# 八、GitHub源码
[-->GitHub地址](https://github.com/lujingtao/Introduction-to-nodejs-with-three-basic-demos)

