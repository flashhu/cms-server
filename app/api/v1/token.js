const Router = require('koa-router')
const { TokenValidator, NotEmptyValidator } = require('../../validators/validator')
const { LoginType } = require('../../lib/enum')
const { User } = require('../../models/user')
const { ParameterException } = require('../../../core/httpException')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middlewares/auth')
const { WXManager } = require('../../services/wx')

const router = new Router({
    prefix: '/v1/token'
})

async function emailLogin(account, secret) {
    const user = await User.verifyEmailPassword(account, secret)
    return token = generateToken(user.id, Auth.USER)
}

/**
 * 用户登录
 * @param {string} account 登录账号，对应注册邮箱, 用户登录凭证code
 * @param {string} secret 可选项（验证方式不同）
 * @param {number} type 验证类型
 */
router.post('/', async (ctx) => {
    const v = await new TokenValidator().validate(ctx)
    let token = null
    // type
    switch (v.get('body.type')) {
        case LoginType.USER_EMAIL:
            token = await emailLogin(v.get('body.account'), v.get('body.secret'))
            break;
        case LoginType.USER_MINI_PROGRAM:
            token = await WXManager.codeToToken(v.get('body.account'))
            break;
        default:
            throw new ParameterException('没有相应的处理函数')
    }
    ctx.body = {
        token
    }
})

/**
 * 小程序token验证
 * @param {string} token 
 */
router.post('/verify', async (ctx) => {
    const v = await new NotEmptyValidator().validate(ctx)
    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        is_valid: result
    }
})

module.exports = router