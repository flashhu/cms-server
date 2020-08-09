const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')

const router = new Router({
    prefix: '/v1/classic'
})

router.get('/latest', new Auth().m, async (ctx, next) => {
    ctx.body = ctx.auth
})

module.exports = router