const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const { Forbbiden } = require('../core/httpException')

class Auth {
    constructor() {

    }

    // m为属性
    get m() {
        // token 检测
        // token 可放在 body, header
        // HTTP 身份验证机制 HttpBasicAuth
        return async (ctx, next) => {
            // 取到原生的request对象
            const userToken = basicAuth(ctx.req)
            let errMsg = 'token不合法'
            // 有令牌
            if(!userToken || !userToken.name) {
                throw new Forbbiden(errMsg)
            }
            // 验证合法性
            try {
                var decode = jwt.verify(userToken.name, global.config.security.secretKey)
            } catch (error) {
                if (error.name == 'TokenExpiredError') {
                    errMsg = 'token已过期'
                }
                throw new Forbbiden(errMsg)
            }

            // uid, scope
            ctx.auth = {
                uid: decode.uid, 
                scope: decode.scope
            }

            await next()
        }
    }
}

module.exports = {
    Auth
}