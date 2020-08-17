const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { HotBook } = require('../../models/hot-book')
const { Book } = require('../../models/book')
const { PositiveIntegerValidator } = require('../../validators/validator')

const router = new Router({
    prefix: '/v1/book'
})

router.get('/hot', new Auth().m, async (ctx) => {
    const books = await HotBook.getAll()
    ctx.body = books
})

router.get('/:id/detail', new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx)
    const book = new Book(v.get('path.id'))
    ctx.body = await book.detail()
})

module.exports =  router 