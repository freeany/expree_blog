/* 
    将redis做成工具
    
*/
const redis = require('redis')
const {REDIS_CONF}  = require('../conf/db')

// 创建redis客户端
 
const RedisClient =  redis.createClient(REDIS_CONF.port,REDIS_CONF.host)
RedisClient.on('error', err => {
    console.error(err)
})

module.exports = {
    RedisClient
}

