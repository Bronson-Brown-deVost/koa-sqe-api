const db = require('@db/sqe-mariadb')
const nat = require('natural-orderby')

exports.getScrollListings = async () => {
    const results = await db.query("SELECT scroll_id, name FROM scroll_data")
    return nat.orderBy(results, [v => v.name], ['asc'])
}

exports.getScrollCols = async (scroll_id) => {
    return await db.query(`
SELECT col_data.col_id, col_data.name
FROM col_data
JOIN col_data_owner USING(col_data_id)
JOIN scroll_to_col USING(col_id)
JOIN scroll_version USING(scroll_version_id)
WHERE scroll_id = ? AND scroll_version.user_id = 1
`, [scroll_id])
}