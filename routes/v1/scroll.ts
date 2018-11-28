
/* tslint-disable no-unused-vars */

/*
 * This is a template for a custom route of scroll, version v1.
 *
 * The exported functions in this file will be turned into API endpoints in
 * /routes/index.js with the path v1/typeorm-(function name).
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
import { getManager } from 'typeorm'
import { scroll_data } from '@db/entities/scroll_data'

/*
 * Exported functions.
 */

/**
 * Gets a scroll.
 * @param   {Number}    id  The is the id of the scroll you are searching for.
 * @returns {Object}    The results of the get in the 'response' object, and the broadcast flag. 
 */
exports.get = async (body: any) => {
    try {
        const postRepository = getManager().getRepository(scroll_data)
        postRepository.find()
        const response = await postRepository.find()
        return {response: response}
    } catch(err) {
        console.error(err)
    }
}

/**
 * Finds a scroll.
 * @param   {Object}    query  The paramaters of the query parsed into an object using expressjs req.query.
 * @returns {Object}    The results of the get query in the 'response' object, and the broadcast flag. 
 */
exports.find = async (body: any) => {
    return {response: body}
}

/**
 * Creates a scroll.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the post in the 'response' object, and the broadcast flag. 
 */
exports.create = async (body: any) => {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Replaces a scroll.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the put in the 'response' object, and the broadcast flag. 
 */
exports.replace = async (body: any) => {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Updates one part of a scroll.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the patch in the 'response' object, and the broadcast flag. 
 */
exports.update = async (body: any) => {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Deletes a scroll.
 * @param   {Number}    id  The is the id of the scroll you want to delete.
 * @returns {Object}    The results of the delete in the 'response' object, and the broadcast flag. 
 */
exports.delete = async (body: any) => {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}
