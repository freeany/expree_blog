var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fs = require('fs')
const session = require('express-session')  // 处理session的插件
const redisStore = require('connect-redis')(session) // 将session放入redis中的插件 需要调用这个require后的函数



// 引入路由
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const {blogRouter} = require('./routes/blog')
const { userRouter } = require('./routes/user')

// 使用express初始化一个app。每次客户端访问，都会形成一个实例。
var app = express();

// view engine setup    // 视图引擎，这里被我注释了
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const env = process.env.NODE_ENV      // 不同的环境下，对日志的操作也不相同
// app.use(XX)    注册XXX方法
if(env === 'dev') {
  app.use(logger('dev')); // 实现日志记录
} else {
  
  const logFileName = path.join(__dirname,'logs','access.log')
  const writeStream = fs.createWriteStream(logFileName,{
    flags: 'a'
  })
  app.use(logger('combined',{
    stream: writeStream
  }))
}



// 这里面放的都是公用的中间件
app.use(express.json());  // 处理post data   如果是post请求，可以在路由中使用req.body拿到post请求中的数据
// 使用不同的库进行解析 false -- queryString库  true -- qs库
app.use(express.urlencoded({ extended: false })); // post data 兼容其他格式。还是放到req.body中
app.use(cookieParser()); // 只要经过这个插件的处理，就可以很轻松的在路由使用req.cookie拿到处理过的cookie。{a:b}
// 注册静态文件，如果访问静态资源，会将静态资源返回。。这里被我注释了
// app.use(express.static(path.join(__dirname, 'public')));


const { RedisClient } = require('./db/redis')
const sessionStore = new redisStore({
  client: RedisClient
})

// 用户请求时，会自动将cookie放到请求体中。
// 开启session, 执行session函数会返回一个中间件
// 会自动产生一个session对象存放到req的属性中，    将所用的数据存放在req中。

// 用户第二次请求，携带cookie到服务器中 找到标记
app.use(session({
  resave: false, //添加 resave 选项
  saveUninitialized: true, //添加 saveUninitialized 选项
  // 如果没有这两行，则启动项目时，express会提示，不赞成不声明这两个属性

  secret: "QWas$_1912#",  // 密匙   生成sessionid
  cookie: {               //  设置cookie
    // path: '/',         // 默认配置
    // httpOnly: true      //  默认配置
    maxAge: 24 * 60 * 60 * 1000
  },
  store: sessionStore         //将session存储到redis中。
}))


// 注册路由
app.use('/', indexRouter);    // 对于首页的处理可以重定向
app.use('/users', usersRouter); // 在user路由中的路径前面默认加上/users
app.use('/api/blog',blogRouter)
app.use('/api/user',userRouter)
// 将上层的路由与细节的路由分离。       细节的业务与上层父路径的分离。提高了可维护性。
/*
  在路由中，使用router.get('/',function(req,res,next) {}) 
    三个信息 --- get请求， /请求路径   处理函数
    而在以前是：  if(method='GET' && path="/") {}  
                程序的耦合性过高。设计的不合理。if语句太多。没有模块拆分
 */


// catch 404 and forward to error handler
app.use(function(req, res, next) {    // 检测404的情况
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};  // 这里需要改动

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
