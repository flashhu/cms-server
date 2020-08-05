const Router = require('koa-router')
const { ParameterException } = require('../../../core/http-exception')

const router = new Router()

router.post('/v1/:id/book', (ctx, next)=>{
    const path = ctx.params
    const query = ctx.request.query
    const headers = ctx.request.header
    const body = ctx.request.body

    if(true) {
        const error = new ParameterException()
        throw error
    }
})

module.exports =  router