const db = require('@db/sqe-mariadb')
const nat = require('natural-orderby')

exports.getMatchListings = async (scroll_id) => {
    const result = await db.query(`
SELECT DISTINCT CONCAT(image_catalog.institution, " ", image_catalog.catalog_number_1, ".", image_catalog.catalog_number_2, IF(image_catalog.catalog_side = 0, " (recto)", " (verso)")) AS imageInfo, 
IF(SQE_image.sqe_image_id IS NOT NULL, '✔️', '✗') AS hasImage,
    image_catalog.image_catalog_id, 
    edition_catalog.edition_name, edition_catalog.edition_volume, edition_catalog.edition_location_1, edition_catalog.edition_location_2, IF(edition_catalog.edition_side = 0, "(recto)", "(verso)") AS edition_side, 
    edition_catalog.edition_catalog_id, 
    col_data.name AS colInfo, 
    col_data.col_id,
    scroll_to_col.scroll_id,
    user.user_name AS user_name,
    confirmed_by.user_name AS confirmed_by_name
FROM image_catalog
JOIN image_to_edition_catalog USING(image_catalog_id)
JOIN edition_catalog USING(edition_catalog_id)
JOIN edition_catalog_to_col USING(edition_catalog_id)
JOIN col_data USING(col_id)
JOIN scroll_to_col USING(col_id)
JOIN user ON edition_catalog_to_col.user_id = user.user_id
LEFT JOIN user AS confirmed_by ON edition_catalog_to_col.confirmation_id = user.user_id
LEFT JOIN SQE_image USING(image_catalog_id)
WHERE scroll_to_col.scroll_id = ?
    `, [scroll_id])
    return result.length > 0 ? nat.orderBy(result, [v => v.name, v => v.imageInfo], ['asc', 'asc']) : []
}

exports.findMatchListing = async (col_id, image_catalog_id) => {
    return await db.query(`
SELECT user.user_name, 
    edition_catalog.manuscript, edition_catalog.edition_name, edition_catalog.edition_volume,   edition_catalog.edition_location_1, edition_catalog.edition_location_2, IF(edition_catalog.edition_side = 0, "(recto)", "(verso)") AS edition_side, edition_catalog.edition_catalog_id,
    confirmed_by.user_name AS confirmed_by_name
FROM edition_catalog_to_col
JOIN user USING(user_id)
LEFT JOIN user AS confirmed_by ON edition_catalog_to_col.confirmation_id = user.user_id
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