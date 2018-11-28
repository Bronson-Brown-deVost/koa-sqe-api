const db = require('@db/sqe-mariadb')

exports.getName = async (scrollVersionID, userID) => {
    return await db.query(`
        SELECT name 
        FROM scroll_data 
        JOIN scroll_data_owner USING(scroll_data_id)
        JOIN scroll_version USING(scroll_version_id) 
        WHERE scroll_version.scroll_version_id = ?
            AND (scroll_version.user_id = ? OR scroll_version.user_id = 1)
    `, [scrollVersionID, userID])
}

exports.getNames = async (userID) => {
    return await db.query(`
        SELECT scroll_data_id, name 
        FROM scroll_data 
        JOIN scroll_data_owner USING(scroll_data_id)
        JOIN scroll_version USING(scroll_version_id) 
        WHERE scroll_version.user_id = ? OR scroll_version.user_id = 1
    `, [userID])
}