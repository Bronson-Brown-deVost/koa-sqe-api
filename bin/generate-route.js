const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))
const chalk = require('chalk')
const replace = require('replace-in-file')
// const findInFiles= require('find-in-files')

if (!args.n) {
  console.error(chalk.red(`
✗ You need to provide a name for the route with the -n switch.`))
  process.exit(1) 
}

const version = args.v || 'v1'
const typescript = args.t ? true : false

const findInFile = async (file, string) => {
    return new Promise((resolve, reject) => {
        fs.readFile(file, (err, data) => {
            if (err) reject(err)
            resolve(data.toString('utf8').indexOf(string) > -1)
        })
    })
}

// The empty template used for all routes.
const template = async (name) => {
    return `
/* ${typescript ? 't' : 'e'}slint-disable no-unused-vars */

/*
 * This is a template for a custom route of ${name}, version ${version}.
 *
 * The exported functions in this file will be turned into API endpoints in
 * /routes/index.ts with the path ${version}/${name}-(function name).
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
 ${typescript ? `//import { getManager } from 'typeorm'` : `//const combinationController = require('@controllers/combination.controller.js')`}

/*
 * Exported functions.
 */

/**
 * Gets a ${name}.
 * @param   {Number}    id  The is the id of the ${name} you are searching for.
 * @returns {Object}    The results of the get in the 'response' object. 
 */
${typescript ? 'export async function get(body: any)' : 'exports.get = async (body) => '} {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Finds a ${name}.
 * @param   {Object}    query  The paramaters of the query parsed into an object using expressjs req.query.
 * @returns {Object}    The results of the get query in the 'response' object. 
 */
${typescript ? 'export async function find(body: any)' : 'exports.find = async (body) => '} {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Creates a ${name}.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the post in the 'response' object, and the broadcast flag. 
 */
${typescript ? 'export async function create(body: any)' : 'exports.create = async (body) => '} {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Replaces a ${name}.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the put in the 'response' object, and the broadcast flag. 
 */
${typescript ? 'export async function replace(body: any)' : 'exports.replace = async (body) => '} {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Updates one part of a ${name}.
 * @param   {Object}    body  The JSON POST payload parsed into an object using body-parser.
 * @returns {Object}    The results of the patch in the 'response' object, and the broadcast flag. 
 */
${typescript ? 'export async function update(body: any)' : 'exports.update = async (body) => '} {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}

/**
 * Deletes a ${name}.
 * @param   {Number}    id  The is the id of the ${name} you want to delete.
 * @returns {Object}    The results of the delete in the 'response' object, and the broadcast flag. 
 */
${typescript ? 'export async function delete(body: any)' : 'exports.delete = async (body) => '} {
    const broadcast = '' // You can broadcast to none '', to the user via session_id 'session_id', or to the scroll_version_group_id 'scroll_version_group_id'.
    let response = ''
    return {response: response, broadcast: broadcast}
}
`
}

const registerRoute = async (name) => {
    const moduleLoad = typescript ? `import * as ${version}_${name} from '@routes/${version}/${name}.route'` : ''
    const insertString = typescript ? `"${version}/${name}": ${version}_${name}` : `"${version}/${name}": require('@routes/${version}/${name}.route')`
    const routesDir = 'routes/'
    const routesFile = 'index.ts'
    const alreadyExists = typescript 
        ? await findInFile(routesDir + routesFile, moduleLoad) || await findInFile(routesDir + routesFile, insertString) 
        : await findInFile(routesDir + routesFile, insertString)
    if(!alreadyExists) {
        const options = {
            files: routesDir + routesFile,
            from: /const routes: routes = {\n/,
            to: `const routes: routes = {\n\t${insertString},\n`,
        }
        
        try {
            const changes = await replace(options)
            console.log(chalk.green(`✔ Successfully added ${insertString} to`, changes.join(', ')))
        }
            catch (error) {
            console.error(chalk.red(error))
            console.error(chalk.red(`✗ Failed to create the route ${name}.`))
            process.exit(1)
        }

        if (typescript) {
            const options = {
                files: routesDir + routesFile,
                from: /import \* as boom from 'boom'\n/,
                to: `import * as boom from 'boom'\n${moduleLoad}\n`,
            }
            
            try {
                const changes = await replace(options)
                console.log(chalk.green(`✔ Successfully added ${insertString} to`, changes.join(', ')))
            }
                catch (error) {
                console.error(chalk.red(error))
                console.error(chalk.red(`✗ Failed to create the route ${name}.`))
                process.exit(1)
            }
        }
        return true
    } else {
        console.log(chalk.yellow(`- The path @routes/${version}/${name}.route.js is already referenced in ${routesDir + routesFile}`))
        console.log(chalk.yellow(`✔ Your route ${name} should work, but you should check for errors.`))
    }
    
}

const generateRoute = async (name) => {  
    console.log(chalk.blue(`Creating route ${name}, version ${version}${typescript ? ' in typescript' : ''}.`))
    const dir = `routes/${version}`
    const path = `${dir}/${name}.route.${typescript ? 'ts' : 'js'}`
    try {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        } else {
            try {
                if (fs.existsSync(path)) {
                    console.log(chalk.red(`✗ It seems that the route ${name} might already exist.`))
                    console.log(chalk.red(`✗ If you want to replace ${name}, please delete it first.`)) 
                    process.exit(1)
                }
            } catch (err) {throw err}
        }
    } catch (err) {throw err}
    
    fs.writeFile(path, await template(name), async (err) => {
        if (err) {
            console.error(chalk.red(err))
            process.exit(1)
        }
        console.log(chalk.green(`✔ Successfully created ${path}`))
        return await registerRoute(name)
    })  
}

// Now we generate the route and exit.
generateRoute(args.n.replace('-', '_'))