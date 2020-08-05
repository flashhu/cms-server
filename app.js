const Koa = require('koa')
const parser = require('koa-bodyparser')
const InitManager = require('./core/init')
const catchError = require('./middlewares/exception')

const app = new Koa()
const port = 8080

app.use(parser())
app.use(catchError)
InitManager.initCore(app)

app.listen(port, () => { console.log(`Running on localhost:${port}`)})