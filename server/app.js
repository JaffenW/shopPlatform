var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs')
var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');
var address = require('./routes/address')
var orders = require('./routes/orders')

var app = express();

// 设置程序视图的位置
app.set('views', path.join(__dirname, 'views'));
// 设置html引擎，默认ejs加载的是.ejs后缀的文件，在此设置修改后缀为html
app.engine('.html',ejs.__express);
// 设置视图引擎
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// 设置静态文件托管目录
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
  if(req.cookies.userId){
    next();
  }else{
      console.log("url:"+req.originalUrl);
      if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.originalUrl=='/users/register' || req.originalUrl.indexOf('/goods/list')>-1){
          next();
      }else{
          res.json({
            status:'10001',
            msg:'当前未登录',
            result:''
          });
      }
  }
});

app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);
app.use('/address', address);
app.use('/orders', orders)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
