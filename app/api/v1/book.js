const Router = require('koa-router')
const { ParameterException } = require('../../../core/httpException')
const { PositiveIntegerValidator } = require('../../validators/validator')

const router = new Router()

router.post('/v1/:id/book', (ctx, next)=>{
    const v = new PositiveIntegerValidator().validate(ctx)
    const id = v.get('path.id')
    console.log(id, typeof id)
    ctx.body = 'success'
    // if(true) {
    //     const error = new ParameterException()
    //     throw error
    // }
})

module.exports =  router