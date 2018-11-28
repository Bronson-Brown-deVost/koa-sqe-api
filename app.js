require('module-alias/register')
const vars = require('@config/shared-vars.config')
const Koa = require('koa')
const app = new Koa()
const server = app.listen(vars.port || 3030)
const json = require('koa-json')
const onerror = require('koa-onerror')
const cors = require('@koa/cors')
const compress = require('koa-compress')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const io = require('socket.io')(server)
const router = require('@routes')(io)

// error handler
onerror(app)

// middlewares
app.use(cors())
app.use(compress())
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json({pretty: false}))
app.use(logger())

// logger, this gives us timing data.
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
