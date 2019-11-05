/* 
    将mysql做成工具    

    这个工具主要是被controller使用
*/
const mysql = require('mysql')

const { MYSQL_CONF } = require('../conf/db')

// 连接不关闭，   页面初始化的会执行一次，所以是单例的形式
const connection = mysql.createConnection(MYSQL_CONF)

// 统一执行sql的函数
function exec(sql) {
    let promise = new Promise((resolve,reject) => {
        connection.query(sql,(err,result) => {
            if(err) {
                reject(err)
                return 
            }
            if(result) {
                resolve(result)
            }
        })

    })

    return promise
}

module.exports = {
    exec,
    escape: mysql.escape
}


