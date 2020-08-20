const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { HotBook } = require('../../models/hot-book')
const { Book } = require('../../models/book')
const { Favor } = require('../../models/favor')
const { Comment } = require('../../models/comment')
const { PositiveIntegerValidator, SearchValidator, AddCommentValidator } = require('../../validators/validator')
const { success } = require('../../lib/helper')

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

router.get('/search', new Auth().m, async (ctx) => {
    const v = await new SearchValidator().validate(ctx)
    const result = await Book.searchFromYuShu(v.get('query.q'), v.get('query.start'), v.get('query.count'))
    ctx.body = result
})

// 获取喜欢的书籍的数量
router.get('/favor/count', new Auth().m, async (ctx) => {
    const count = await Book.getMyFavorBookCount(ctx.auth.uid)
    ctx.body = {
        count
    }
})

// 获取书籍点赞情况
router.get('/:book_id/favor', new Auth().m, async (ctx) => {
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'book_id'
    })
    ctx.body = await Favor.getBookFavor(ctx.auth.uid, v.get('path.book_id'))
})

// 添加短评
router.post('/add/comment', new Auth().m, async (ctx) => {
    const v = await new AddCommentValidator().validate(ctx, {
        id: 'book_id'
    })
    await Comment.addComment(v.get('body.book_id'), v.get('body.content'))
    success()
})

// 获取某本书对应的短评
router.get('/:book_id/comment', new Auth().m, async ctx =>{
    const v = await new PositiveIntegerValidator().validate(ctx, {
        id: 'book_id'
    })
    ctx.body = await Comment.getComment(v.get('path.book_id'))
})

module.exports =  router 