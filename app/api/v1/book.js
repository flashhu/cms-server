const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { HotBook } = require('../../models/hot-book')

const router = new Router({
    prefix: '/v1/book'
})

router.get('/hot', new Auth().m, async (ctx) => {
    const books = await HotBook.getAll()
    ctx.body = books
})

module.exports =  router 