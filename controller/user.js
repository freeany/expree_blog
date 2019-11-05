const { exec,escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const loginCheck = (username,password) => {
    
    // 模拟登录场景
    // if(username === 'zhangsan' && password === '123') {

    //     return true
    // } 
    // else {
    //     return false
    // }
    
    // 防止sql 攻击
    username = escape(username)

    password = genPassword(password)
    password = escape(password)
    const sql = ` select username,realname from users where username=${username} and password =${password} `

    // console.log(sql) //测试sql注入
    return exec(sql).then(
        data => {
            return data[0] || {}
        }
    )
}

module.exports = {
    loginCheck
}