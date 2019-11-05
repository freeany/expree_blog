/* 
    配置数据库参数

    使用了  const env = process.env.NODE_ENV
    这里的代码比    创建服务还快

*/

// 获取当前的环境变量（环境参数），  根据启动时不同的环境参数，来进行不同的配置
// 也就是说根据不同的环境，做一些配置上的处理
// 比如开发环境与上线环境的hostname。
const env = process.env.NODE_ENV
let MYSQL_CONF = {}
let REDIS_CONF = {}
if(env==='dev') {
    console.log('开发环境')
    // 开发环境使用这样的配置
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'blog'
    }

    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }

    // console.log(REDIS_CONF)
}

if(env === 'production') {
    // 线上(生产)环境使用这样的配置，以后再改
    console.log('生产环境')
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'blog'
    }
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}