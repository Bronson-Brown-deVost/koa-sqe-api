
/* eslint-disable no-unused-vars */

/*
 * This is a template for a custom route of scrollVersion, version v1.
 *
 * The exported functions in this file will be turned into API endpoints in
 * /routes/index.ts with the path v1/scrollVersion-(function name).
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
 const scrollVersionController = require('@controllers/scroll-version.controller.js')

/*
 * Exported functions.
 */

/**
 * Gets a scrollVersion.
 * @param   {Number}    id  The is the id of the scrollVersion you are searching for.
 * @returns {Object}    The results of the get in the 'response' object. 
 */
exports.get = async (body) =>  {
    let response = {}
    if (body.ownedBy) {
        if (body.ownedBy.toLowerCase() === 'user') {
            response = {userScrolls: await scrollVersionController.getUserListings(body.user_id)}
        } else if (body.ownedBy.toLowerCase() === 'public') {
            response = {publicScrolls: await scrollVersionController.getListings()}
        } else if (body.ownedBy.toLowerCase() === 'basic') response = {publicScrolls: await scrollVersionController.getAll()}
    } else {
        response = {userScrolls: await scrollVersionController.getUserListings(body.user_id), publicScrolls: await scrollVersionController.getListings()}
    }
    
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id
    return {response: response, broadcast: broadcast}
}

/**
 * Finds a scrollVersion.
 * @param   {Object}    query  The paramaters of the query parsed into an object using expressjs req.query.
 * @returns {Object}    The results of the get query in the 'response' object. 
 */
exports.find = async (body) =>  {
    
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id
    let response = ''
    return {response: await scrollVersionController.getFullModel(body.scroll_version_id), broadcast: broadcast}
}

/**
 * Creates a scrollVersion.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the post in the 'response' object, and the broadcast flag. 
 */
exports.create = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Replaces a scrollVersion.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the put in the 'response' object, and the broadcast flag. 
 */
exports.replace = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Updates one part of a scrollVersion.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the patch in the 'response' object, and the broadcast flag. 
 */
exports.update = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Deletes a scrollVersion.
 * @param   {Number}    id  The is the id of the scrollVersion you want to delete.
 * @returns {Object}    The results of the delete in the 'response' object, and the broadcast flag. 
 */
exports.delete = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}
