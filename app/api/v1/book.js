const Router = require('koa-router')

const router = new Router()

router.get('/book', (ctx, next)=>{
    ctx.body = 'book'
})

module.exports =  router