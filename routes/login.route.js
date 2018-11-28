const loginController = require('@controllers/login.controller')
const boom = require('boom')

/**
 * Login validator.  This should be loaded before the session-manager service in app.js
 */
exports.validate = async (ctx, next) => {
    let error
    try {
        const session = await loginController.validateLogin(ctx.request.body.username, ctx.request.body.password)
        if (session) ctx.body = {session_id: session}
        else error = boom.badRequest(`Username or password invalid.`)
    } catch(err) {
        error = err
    }
    next(error)
}