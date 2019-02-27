const db = require('@db/sqe-mariadb')
const nat = require('natural-orderby')

exports.getMatchListings = async (scroll_id) => {
    const result = await db.query(`
SELECT DISTINCT CONCAT(image_catalog.institution, " ", image_catalog.catalog_number_1, ".", image_catalog.catalog_number_2, IF(image_catalog.catalog_side = 0, " (recto)", " (verso)")) AS imageInfo, 
IF(SQE_image.sqe_image_id IS NOT NULL, 1, 0) AS hasImage,
    image_catalog.image_catalog_id, 
    edition_catalog.edition_name, edition_catalog.edition_volume, edition_catalog.edition_location_1, edition_catalog.edition_location_2, IF(edition_catalog.edition_side = 0, "(recto)", "(verso)") AS edition_side, 
    edition_catalog.edition_catalog_id, 
    col_data.name AS colInfo, 
    col_data.col_id,
    scroll_to_col.scroll_id,
    creator.user_name AS user_name,
    confirmed_by.user_name AS confirmed_by_name,
    CONCAT(image_catalog.image_catalog_id, "-", edition_catalog.edition_catalog_id, "-", col_data.col_id) AS uuid
FROM image_catalog
JOIN image_to_edition_catalog USING(image_catalog_id)
JOIN edition_catalog USING(edition_catalog_id)
JOIN edition_catalog_to_col USING(edition_catalog_id)
JOIN col_data USING(col_id)
JOIN scroll_to_col USING(col_id)
JOIN user AS creator ON edition_catalog_to_col.user_id = creator.user_id
LEFT JOIN user AS confirmed_by ON edition_catalog_to_col.confirmation_id = confirmed_by.user_id
LEFT JOIN SQE_image USING(image_catalog_id)
WHERE scroll_to_col.scroll_id = ?
    `, [scroll_id])
    return result.length > 0 ? nat.orderBy(result, [v => v.edition_location_1, v => v.edition_location_2, v => v.imageInfo], ['asc', 'asc', 'asc']) : []
}

exports.findMatchListing = async (col_id, image_catalog_id) => {
    return await db.query(`
SELECT user.user_name, 
    edition_catalog.manuscript, edition_catalog.edition_name, edition_catalog.edition_volume,   edition_catalog.edition_location_1, edition_catalog.edition_location_2, IF(edition_catalog.edition_side = 0, "(recto)", "(verso)") AS edition_side, edition_catalog.edition_catalog_id,
    confirmed_by.user_name AS confirmed_by_name
FROM edition_catalog_to_col
JOIN user USING(user_id)
LEFT JOIN user AS confirmed_by ON edition_catalog_to_col.confirmation_id = confirmed_by.user_id
JOIN image_to_edition_catalog USING(edition_catalog_id)
JOIN edition_catalog USING(edition_catalog_id)
WHERE edition_catalog_to_col.col_id = ? AND image_to_edition_catalog.image_catalog_id = ?
    `, [col_id, image_catalog_id])
}

exports.findIAACanonRef = async (image_catalog_id) => {
    return await db.query(`
SELECT manuscript, edition_name, edition_volume, edition_location_1, edition_location_2, edition_side
FROM edition_catalog
JOIN image_to_edition_catalog USING(edition_catalog_id)
WHERE image_catalog_id = ?
    `, [image_catalog_id])
}

exports.confirmMatch = async (confirm_id, edition_catalog_id, col_id) => {
    return await db.query(`
UPDATE edition_catalog_to_col 
SET confirmation_id = ?
WHERE edition_catalog_id = ? AND col_id = ?
    `, [confirm_id, edition_catalog_id, col_id])
}

exports.createEditionListing = async (image_catalog_id, manuscript, edition_name, edition_volume, edition_location_1, edition_location_2,  edition_side, scroll_id) => {
    const res = await db.query(`
INSERT INTO edition_catalog (manuscript, edition_name, edition_volume, edition_location_1, edition_location_2,  edition_side, scroll_id)
VALUES (?, ?, ?, ?, ?, ?, ?)
ON DUPLICATE KEY UPDATE edition_catalog_id = LAST_INSERT_ID(edition_catalog_id)
    `, [manuscript, edition_name, edition_volume, edition_location_1, edition_location_2,  edition_side, scroll_id])
    const edition_catalog_id = res.insertId
    await db.query(`
INSERT IGNORE INTO image_to_edition_catalog (image_catalog_id, edition_catalog_id)
VALUES (?, ?)
    `, [image_catalog_id, edition_catalog_id])
    return edition_catalog_id
}

exports.createMatchListing = async (user_id, col_id, edition_catalog_id) => {
    return await db.query(`
INSERT INTO edition_catalog_to_col (user_id, col_id, edition_catalog_id)
VALUES (?, ?, ?)
    `, [user_id, col_id, edition_catalog_id])
}

exports.deleteMatchListing = async (col_id, edition_catalog_id) => {
    let res = 0
    try {
        await db.query(`
DELETE FROM edition_catalog_to_col
WHERE col_id = ? AND edition_catalog_id = ?
    `, [col_id, edition_catalog_id])
    } catch(err) {
        res = 1
        console.error(err)
    } 
    return res
}