const db = require('@db/sqe-mariadb')

exports.getLines = async (col_id) => {   
      const lines = await db.query(`
SELECT line_data.name, sign_char.sign_id
FROM line_to_sign_owner 
JOIN line_to_sign USING(line_to_sign_id)
JOIN col_to_line USING(line_id)
JOIN sign_char USING(sign_id)
JOIN sign_char_attribute USING(sign_char_id)
JOIN sign_char_attribute_owner USING(sign_char_attribute_id)
JOIN line_data USING(line_id)
JOIN line_data_owner USING(line_data_id)
JOIN scroll_version ON scroll_version.scroll_version_id = line_to_sign_owner.scroll_version_id
JOIN scroll_version_group USING(scroll_version_group_id)
WHERE scroll_version.user_id = 1 AND col_to_line.col_id = ?
    AND sign_char_attribute.attribute_value_id = 10
    `, [col_id])
    return lines.reduce((r, v) => {r[v.sign_id] = v.name; return r}, {})
}

exports.colSignStream = async (col_id) => {
    const signs = await db.query(`
SELECT sign_id, next_sign_id
FROM position_in_stream
JOIN position_in_stream_owner USING(position_in_stream_id)
JOIN line_to_sign USING(sign_id)
JOIN line_to_sign_owner USING(line_to_sign_id)
JOIN col_to_line USING(line_id)
JOIN col_to_line_owner USING(col_to_line_id)
JOIN scroll_version ON scroll_version.scroll_version_id = position_in_stream_owner.scroll_version_id
WHERE col_id = ? AND scroll_version.user_id = 1
    `, [col_id])
    return signs.reduce((r, v) => {r[v.sign_id] = [...r[v.sign_id] ? r[v.sign_id] : [], v.next_sign_id]; return r}, {})
}

exports.colSignChars = async (col_id) => {
    const signs = await db.query(`
SELECT line_to_sign.sign_id, sign_char.sign_char_id, 
    CONCAT("[", GROUP_CONCAT(DISTINCT '"', sign_char.sign, '"'), "]") AS sign, 
    CONCAT("[", GROUP_CONCAT(DISTINCT sign_char_attribute.attribute_value_id), "]") AS attribute_value_id, 
    sign_char_attribute.sequence
FROM line_to_sign
JOIN line_to_sign_owner USING(line_to_sign_id)
JOIN col_to_line USING(line_id)
JOIN col_to_line_owner USING(col_to_line_id)
JOIN scroll_version ON scroll_version.scroll_version_id = line_to_sign_owner.scroll_version_id
JOIN sign_char USING(sign_id)
JOIN sign_char_attribute USING(sign_char_id)
WHERE col_id = ? AND scroll_version.user_id = 1
GROUP BY sign_char.sign_char_id
    `, [col_id])
    return signs.reduce((r, v) => {
        if (!r[v.sign_id]) r[v.sign_id] = {}
        r[v.sign_id][v.sign_char_id] = {
            signs: v.sign !== "['']" ? JSON.parse(v.sign) : undefined,
            attributes: JSON.parse(v.attribute_value_id),
            sequence: v.sequence
        }
        return r
    }, {})
}

exports.colSign = async (col_id) => {
    const signs = await db.query(`
SELECT line_to_sign.sign_id
FROM line_to_sign
JOIN line_to_sign_owner USING(line_to_sign_id)
JOIN col_to_line USING(line_id)
JOIN col_to_line_owner USING(col_to_line_id)
JOIN scroll_version ON scroll_version.scroll_version_id = line_to_sign_owner.scroll_version_id
JOIN sign_char USING(sign_id)
JOIN sign_char_attribute USING(sign_char_id)
WHERE col_id = ? AND scroll_version.user_id = 1 AND sign_char_attribute.attribute_value_id = 12
GROUP BY sign_char.sign_char_id
    `, [col_id])
    return signs[0].sign_id
}
