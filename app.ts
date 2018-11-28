require('module-alias/register')
import "reflect-metadata"
import {createConnection, Connection} from "typeorm"
import * as vars from '@config/shared-vars.config.json'
import * as Koa from "koa"
import * as socketIo from 'socket.io'
const app = new Koa()
const server = app.listen(vars.port || 3030)
import * as json from 'koa-json'
import * as cors from '@koa/cors'
import * as compress from 'koa-compress'
import * as bodyparser from 'koa-bodyparser'
import * as logger from 'koa-logger'
import { createRoute } from '@routes/index.ts'

// Load typeORM  
createConnection().then(async (connection: Connection) => {
    
    // Add Socket.io
    const io = socketIo(server)

    // middlewares
    app.use(cors())
    app.use(compress())
    app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
    }))
    app.use(json({pretty: false}))
    app.use(logger())

    // logger, this gives us timing data.
    // remove in production?
    app.use(async (ctx: Koa.Context, next: Function) => {
    const start: number = new Date().getDate()
    await next()
    const ms: number = new Date().getDate() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
    })

    // Load in the routes an make them accessible
    app.use(createRoute(io).routes())
    //app.use(require('@routes')(io).routes())

    // Maybe we need a better error handler.
    app.on('error', (err: any, ctx: Koa.Context) => {
    console.error('server error', err, ctx)
    })
}).catch((error: Error) => console.log("TypeORM connection error: ", error))

module.exports = app
