
/* eslint-disable no-unused-vars */

/*
 * This is a template for a custom route of col, version v1.
 *
 * The exported functions in this file will be turned into API endpoints in
 * /routes/index.ts with the path v1/col-(function name).
 * You may name the functions any way you want, but the functions 'get'
 * and 'find' are reserved for public access.  DO NOT PERFORM DATABASE
 * MUTATION IN THE 'get' OR 'find' ENDPOINTS.  If this becomes difficult
 * to remember, perhaps we can add some other type of security.  Boilerplate
 * CRUD functions are provided by this template (Read = 'get' and 'find').
 *
 * Private functions (i.e., without 'exports.') will remain private.
 */

/*
 * Put your logic in a controller, since it can be reused by other routes. 
 */
 //const combinationController = require('@controllers/combination.controller.js')

/*
 * Exported functions.
 */
const scrollListingController = require('@controllers/scroll_listing.controller.js')
const imageColMatchController = require('@controllers/image_col_match.controller.js')

/**
 * Gets a col.
 * @param   {Number}    id  The is the id of the col you are searching for.
 * @returns {Object}    The results of the get in the 'response' object. 
 */
exports.get = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id
    let response = body.scroll_id ? await scrollListingController.getScrollCols(body.scroll_id) : []
    return {response: {response: response}, broadcast: broadcast}
}

/**
 * Finds a col.
 * @param   {Object}    query  The paramaters of the query parsed into an object using expressjs req.query.
 * @returns {Object}    The results of the get query in the 'response' object. 
 */
exports.find = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id
    let response = ''
    if (body.info && body.info === 'images' && body.col_id) response = await imageColMatchController.colToImageMatch(body.col_id, body.user_id)
    return {response: {response: response}, broadcast: broadcast}
}

/**
 * Creates a col.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the post in the 'response' object, and the broadcast flag. 
 */
exports.create = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Replaces a col.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the put in the 'response' object, and the broadcast flag. 
 */
exports.replace = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Updates one part of a col.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the patch in the 'response' object, and the broadcast flag. 
 */
exports.update = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Deletes a col.
 * @param   {Number}    id  The is the id of the col you want to delete.
 * @returns {Object}    The results of the delete in the 'response' object, and the broadcast flag. 
 */
exports.delete = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}
