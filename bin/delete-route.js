const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))
const chalk = require('chalk')
const replace = require('replace-in-file')

if (!args.n) {
  console.error(chalk.red(`
You need to provide a name for the route with the -n switch.`))
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

const unregisterRoute = async (name) => {
    const moduleLoad = typescript ? `import * as ${version}_${name} from '@routes/${version}/${name}.route'` : ''
    const insertString = typescript ? `"${version}/${name}": ${version}_${name}` : `"${version}/${name}": require('@routes/${version}/${name}.route')`
    const routesDir = 'routes/'
    const routesFile = 'index.ts'
    const alreadyExists = typescript 
        ? await findInFile(routesDir + routesFile, moduleLoad) || await findInFile(routesDir + routesFile, insertString) 
        : await findInFile(routesDir + routesFile, insertString)
    if(alreadyExists) {
        const options = {
            files: routesDir + routesFile,
            from: `\t${insertString},\n`,
            to: '',
        }
        
        try {
            const changes = await replace(options)
            console.log(chalk.green(`✔ Successfully removed route ${name}, version ${version} from`, changes.join(', ')))
        }
            catch (error) {
            console.error(chalk.red(error))
            console.error(chalk.red(`✗ Failed to remove the route ${name}, version ${version}.`))
            process.exit(1)
        }

        if (typescript) {
            const options = {
                files: routesDir + routesFile,
                from: `${moduleLoad}\n`,
                to: '',
            }
            
            try {
                const changes = await replace(options)
                console.log(chalk.green(`✔ Successfully removed ${insertString} frmo`, changes.join(', ')))
            }
                catch (error) {
                console.error(chalk.red(error))
                console.error(chalk.red(`✗ Failed to fully delete the route ${name}.`))
                process.exit(1)
            }
        }
        process.exit(0)
    } else {
        console.log(chalk.yellow(`- The route ${name}, version ${version} is not referenced in ${routesDir + routesFile}`))
        console.log(chalk.yellow(`✔ Your route ${name}, version ${version} should be deleted, but you should check for errors.`))
        process.exit(0)
    } 
}

const deleteRoute = async (name) => {  
    console.log(chalk.blue(`Deleting route ${name}, version ${version}.`))
    const dir = `routes`
    const path = `${dir}/${version}/${name}.route.${typescript ? 'ts' : 'js'}`
    try {
        if (fs.existsSync(path)) {
            console.log(chalk.blue(`Deleting ${path}.`))
            let deleted = await fs.unlink(path, (err) => {return err})
            if (!deleted) console.log(chalk.green(`✔ Successfully deleted ${path}.`))
            else {
                console.error(chalk.red(deleted))
                console.error(chalk.red(`✗ Encountered an error deleting ${path}`))
            }
        } else {
            console.log(chalk.yellow(`- You don't seem to have a ${name}, version ${version} route set up.`))
            console.log(chalk.yellow(`- Please check the name and your routes folder.`))
        }
    } catch (err) {throw err}
    unregisterRoute(name)
}

// Now we delete the route and exit.
deleteRoute(args.n)