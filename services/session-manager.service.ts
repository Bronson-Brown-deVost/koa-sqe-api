const session = require('@controllers/session.controller')
import * as sharedVars from '@config/shared-vars.config.json'
import * as boom from 'boom'
const publicPath =/v.*\/.*-(get|find)$/

/*
 * This middleware checks each request for a proper session_id
 * in the post payload.  It does allow public access to users
 * without a session_id, but only to paths ending in -get or
 * -find (i.e., read-only endpoints).  Public users get a user_id
 * of 2.  We set this here every time, and there should be no way
 * for a malicious user to force a different user_id, since we write
 * into the post payload here, and that would overwrite any value
 * sent by the user.
 *
 * This hits the server on every HTTP request and takes about 3ms 
 * on average for each request.  If this becomes a problem, perhaps
 * we experiment with an in-memory store.  Note that a websocket
 * connection is authenticated only once at connection.
 */
exports.sessionManager = async (ctx: any, next: any) => {
    let error: boom<null>, user_id: number
    if (publicPath.test(ctx.request.path)) {
        if (ctx.request.body.session_id) {
            ({error, user_id} = await checkSession(ctx.request.body.session_id))
            ctx.request.body.user_id = user_id
        } else ctx.request.body.user_id = sharedVars.public_id // Set the request to public user_id if no session
    } else {
        if (ctx.request.body.session_id)  {
            ({error, user_id} = await checkSession(ctx.request.body.session_id))
            ctx.request.body.user_id = user_id
        } else error = boom.badRequest(`A valid session id is required for this request, please log in.`)
    }
    
    await next(error)
}

interface sessionData {
    error: boom<null>
    user_id: number
}

/**
 * Checks if a session_id is valid.
 *
 * @param   {string}    session_id  The session_id to be authenticated.
 * @return {Object} The object returned contains a boom error (if 
 * any errors were encountered), and a user_id for the authenticated session.
 */
const checkSession = async (session_id: string): Promise<sessionData> => {
    let error: boom<null>, user_id: number
    try {
        const user = await session.validateSession(session_id)
        if (user.length > 0 && user[0].user_id) user_id = user[0].user_id
        else error = boom.unauthorized(`No session found for id: ${session_id}.`)
    } catch(err) {
        error = boom.internal(`Server error.`)
    }
    return {error: error, user_id: user_id}
}