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
