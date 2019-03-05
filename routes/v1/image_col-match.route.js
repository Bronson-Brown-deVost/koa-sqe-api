
/* eslint-disable no-unused-vars */

/*
 * This is a template for a custom route of image_col-match, version v1.
 *
 * The exported functions in this file will be turned into API endpoints in
 * /routes/index.ts with the path v1/image_col-match-(function name).
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
const imageColMatch = require('@controllers/image_col_match.controller.js')
const sharedVars = require('@config/shared-vars.config.json')

/**
 * Gets a image_col-match.
 * @param   {Number}    id  The is the id of the image_col-match you are searching for.
 * @returns {Object}    The results of the get in the 'response' object. 
 */
exports.get = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id
    let response = body.scroll_id ? await imageColMatch.getMatchListings(body.scroll_id) : []
    return {response: {listing: response}, broadcast: broadcast}
}

/**
 * Finds a image_col-match.
 * @param   {Object}    query  The paramaters of the query parsed into an object using expressjs req.query.
 * @returns {Object}    The results of the get query in the 'response' object. 
 */
exports.find = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id
    let response = []
    if (body.col_id && body.image_catalog_id) response = await imageColMatch.findMatchListing(body.col_id, body.image_catalog_id)
    else if (body.image_catalog_id) response = await imageColMatch.findIAACanonRef(body.image_catalog_id)
    return {response: {listing: response[0]}, broadcast: broadcast}
}

/**
 * Creates a image_col-match.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the post in the 'response' object, and the broadcast flag. 
 */
exports.create = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    if (body.user_id && body.user_id !== sharedVars.public_id && body.col_id && body.image_catalog_id) {
        const res = await imageColMatch.createEditionListing(body.image_catalog_id, body.manuscript, body.edition_name, body.edition_volume, body.edition_location_1, body.edition_location_2,  body.edition_side, body.scroll_id)
        response = {rec: await imageColMatch.createMatchListing(body.user_id, body.col_id, res.edition_catalog_id), vrs: await imageColMatch.createMatchListing(body.user_id, body.col_id, res.edition_catalog_id_rev)}
    }
    return {response: response, broadcast: broadcast}
}

/**
 * Replaces a image_col-match.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the put in the 'response' object, and the broadcast flag. 
 */
exports.replace = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Updates one part of a image_col-match.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the patch in the 'response' object, and the broadcast flag. 
 */
exports.update = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    console.log("User id: " + body.user_id + " " + body.edition_catalog_id + " " + body.col_id)
    if (body.user_id && body.user_id !== sharedVars.public_id) {
        response = await imageColMatch.confirmMatch(body.user_id, body.edition_catalog_id, body.col_id)
    }
    return {response: response, broadcast: broadcast}
}

/**
 * Deletes a image_col-match.
 * @param   {Number}    id  The is the id of the image_col-match you want to delete.
 * @returns {Object}    The results of the delete in the 'response' object, and the broadcast flag. 
 */
exports.delete = async (body) =>  {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let res = ''
    if (body.col_id && body.edition_catalog_id) res = await imageColMatch.deleteMatchListing(body.col_id, body.edition_catalog_id)
    let response = 'Success'
    if (res === 1) response = 'Failure'
    return {response: response, broadcast: broadcast}
}
