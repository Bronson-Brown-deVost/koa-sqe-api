const mariadb = require('mariadb')
const mysql = require('mysql')
const settings = require('@config/mariadb.config.json')
this.pool = mysql.createPool({
    host: settings.host, 
    user: settings.user, 
    port: settings.port, 
    password: settings.password, 
    database: settings.database, 
    connectionLimit: settings.connectionLimit
})


const pquery = ( sql, args ) => {
    return new Promise( ( resolve, reject ) => {
        this.pool.query( sql, args, ( err, rows ) => {
            if ( err )
                return reject( err );
            resolve( rows );
        } );
    } );
}

const endConn = exports.endConn = async (conn) => {
    try {
        await conn.end()
    } catch (err) {
        conn.destroy()
        throw err
    }
}

const getConn = exports.getConn = async () => {
    let conn
    try {
        conn = await this.pool.getConnection()
    } catch (err) {
        throw err
    }

    return conn
}

exports.query = async (query, args) => {
    //const conn = await getConn()
    //const results = await this.pool.query(query, args)
    const results = await pquery(query, args)
    return results
    //endConn(conn)
    
}

// This takes an array of objects: [{query: '', args:[]}].
exports.singleTransaction = async (queries) => {
    const conn = getConn()
    const results = []
    try {
        await conn.beginTransaction()
    } catch (err) {
        throw err
    }

    for (query in queries) {
        let result
        try {
            result = await conn.query(query.query, query.args)
        } catch(err) {
            throw err
        }
        results.push(result)
    }
    
    try {
        await conn.commit()
    } catch (err) {
        throw err
    }

    endConn(conn)
    return results
}

exports.closePool = async () => {
    return await this.pool.end()
}

