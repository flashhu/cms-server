const basicAuth = require('basic-auth')
const jwt = require('jsonwebtoken')
const { Forbbiden } = require('../core/httpException')

class Auth {
    constructor(level) {
        this.level = level || 1
        // 用于权限分级 设置scope
        Auth.USER = 8
        Auth.ADMIN = 16
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

            if (this.level > decode.scope) {
                errMsg = '权限不足'
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

    static verifyToken(token) {
        try {
            jwt.verify(token, global.config.security.secretKey)
            return true
        } catch(error) {
            return false
        }
    }
}

module.exports = {
    Auth
}