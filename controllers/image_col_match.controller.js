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
FROM scroll_to_col
JOIN col_data USING(col_id)
JOIN col_sequence USING(col_id)
JOIN col_data_owner USING(col_data_id)
JOIN scroll_version USING(scroll_version_id)
JOIN edition_catalog_to_col USING(col_id)
JOIN recent_edition_catalog_to_col_confirmation USING(edition_catalog_to_col_id)
JOIN edition_catalog USING(edition_catalog_id)
JOIN image_to_edition_catalog USING(edition_catalog_id)
JOIN image_catalog USING(image_catalog_id)
JOIN user AS creator ON edition_catalog_to_col.user_id = creator.user_id
LEFT JOIN user AS confirmed_by ON recent_edition_catalog_to_col_confirmation.user_id = confirmed_by.user_id
LEFT JOIN SQE_image USING(image_catalog_id)
WHERE scroll_to_col.scroll_id = ? AND scroll_version.user_id = 1 AND (recent_edition_catalog_to_col_confirmation.confirmed = 1 || (recent_edition_catalog_to_col_confirmation.confirmed = 0 AND recent_edition_catalog_to_col_confirmation.user_id IS NULL))
ORDER BY col_sequence.position, edition_catalog.edition_location_2, image_catalog.catalog_number_2, image_catalog.catalog_side
    `, [scroll_id])
    return result.length > 0 ? result : []
}

exports.findMatchListing = async (col_id, image_catalog_id) => {
    return await db.query(`
SELECT user.user_name,
    edition_catalog.manuscript, edition_catalog.edition_name, edition_catalog.edition_volume,   edition_catalog.edition_location_1, edition_catalog.edition_location_2, IF(edition_catalog.edition_side = 0, "(recto)", "(verso)") AS edition_side, edition_catalog.edition_catalog_id,
    recent_edition_catalog_to_col_confirmation.confirmed,
    confirmed_by.user_name AS confirmed_by_name
FROM edition_catalog_to_col
JOIN user USING(user_id)
JOIN recent_edition_catalog_to_col_confirmation USING(edition_catalog_to_col_id)
LEFT JOIN user AS confirmed_by ON recent_edition_catalog_to_col_confirmation.user_id = confirmed_by.user_id
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

exports.colToImageMatch = async (col_id, user_id) => {
    return await db.query(`
SELECT image_catalog.image_catalog_id, image_catalog.institution, image_catalog.catalog_number_1, image_catalog.catalog_number_2, image_catalog.catalog_side, recent_edition_catalog_to_col_confirmation.confirmed, user.user_name AS confirmed_by
FROM image_catalog
JOIN image_to_edition_catalog USING(image_catalog_id)
JOIN edition_catalog_to_col USING(edition_catalog_id)
JOIN recent_edition_catalog_to_col_confirmation USING(edition_catalog_to_col_id)
LEFT JOIN user ON user.user_id = recent_edition_catalog_to_col_confirmation.user_id
JOIN col_data USING(col_id)
JOIN col_data_owner USING(col_data_id)
JOIN scroll_version USING(scroll_version_id)
WHERE edition_catalog_to_col.col_id = ? AND (scroll_version.user_id = 1 OR scroll_version.user_id = ?)
ORDER BY image_catalog.institution, image_catalog.catalog_number_1, image_catalog.catalog_number_2, image_catalog.catalog_side
`, [col_id, user_id])
}

exports.imageToColMatch = async (image_catalog_id, user_id) => {
    return await db.query(`
SELECT scroll_data.name AS scroll_name, scroll_data.scroll_id, col_data.col_id, col_data.name AS col_name, recent_edition_catalog_to_col_confirmation.confirmed, user.user_name AS confirmed_by
FROM image_catalog
JOIN image_to_edition_catalog USING(image_catalog_id)
JOIN edition_catalog_to_col USING(edition_catalog_id)
JOIN recent_edition_catalog_to_col_confirmation USING(edition_catalog_to_col_id)
LEFT JOIN user ON user.user_id = recent_edition_catalog_to_col_confirmation.user_id
JOIN col_data USING(col_id)
JOIN col_data_owner USING(col_data_id)
JOIN col_sequence USING(col_id)
JOIN col_sequence_owner USING(col_sequence_id)
JOIN scroll_to_col USING(col_id)
JOIN scroll_to_col_owner USING(scroll_to_col_id)
JOIN scroll_data USING(scroll_id)
JOIN scroll_data_owner USING(scroll_data_id)
JOIN scroll_version ON
    scroll_version.scroll_version_id = col_data_owner.scroll_version_id
    AND scroll_version.scroll_version_id = scroll_to_col_owner.scroll_version_id
    AND scroll_version.scroll_version_id = scroll_data_owner.scroll_version_id
    AND scroll_version.scroll_version_id = col_sequence_owner.scroll_version_id
WHERE image_catalog.image_catalog_id = ? AND (scroll_version.user_id = 1 OR scroll_version.user_id = ?)
ORDER BY scroll_data.name, col_sequence.position
    `, [image_catalog_id, user_id])
}

exports.confirmMatch = async (confirm_id, edition_catalog_id, col_id) => {
    let response
    try {
        response = await db.query(`
INSERT INTO edition_catalog_to_col_confirmation (edition_catalog_to_col_id, confirmed, user_id, time)
SELECT edition_catalog_to_col.edition_catalog_to_col_id, 1, ?, CURRENT_TIMESTAMP()
FROM edition_catalog_to_col
WHERE edition_catalog_to_col.edition_catalog_id = ?
    AND edition_catalog_to_col.col_id = ?
    `, [confirm_id, edition_catalog_id, col_id])
    } catch(err) {
        response = err
    } finally {
        return response
    }
}

exports.createEditionListing = async (image_catalog_id, manuscript, edition_name, edition_volume, edition_location_1, edition_location_2,  edition_side, scroll_id, user_id) => {
    let response
    try {
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
        await db.query(`
    INSERT IGNORE INTO edition_catalog_author (edition_catalog_id, user_id)
    VALUES (?, ?)
        `, [edition_catalog_id, user_id])

        const res2 = await db.query(`
    INSERT INTO edition_catalog (manuscript, edition_name, edition_volume, edition_location_1, edition_location_2,  edition_side, scroll_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE edition_catalog_id = LAST_INSERT_ID(edition_catalog_id)
        `, [manuscript, edition_name, edition_volume, edition_location_1, edition_location_2,  (edition_side + 1) % 2, scroll_id])
        const edition_catalog_id_rev = res2.insertId
        await db.query(`
    INSERT IGNORE INTO edition_catalog_author (edition_catalog_id, user_id)
    VALUES (?, ?)
        `, [edition_catalog_id_rev, user_id])
        const res3 = await db.query(`
    SELECT ic2.image_catalog_id
    FROM image_catalog AS ic1
    JOIN image_catalog AS ic2
        ON ic2.institution = ic1.institution
        AND ic2.catalog_number_1 = ic1.catalog_number_1
        AND ic2.catalog_number_2 = ic1.catalog_number_2
        AND ic2.catalog_side = MOD(ic1.catalog_side + 1, 2)
    WHERE ic1.image_catalog_id = ?
        `, [image_catalog_id])
        if (res3.length === 1) {
            const image_catalog_id_rev = res3[0].image_catalog_id
            await db.query(`
    INSERT IGNORE INTO image_to_edition_catalog (image_catalog_id, edition_catalog_id)
    VALUES (?, ?)
        `, [image_catalog_id_rev, edition_catalog_id_rev])
        }
        response =  {edition_catalog_id: edition_catalog_id, edition_catalog_id_rev: edition_catalog_id_rev}
    } catch(err) {
        response = err
    } finally {
        return response
    }
}

exports.createMatchListing = async (user_id, col_id, edition_catalog_id) => {
    let response
    try {
        const res = await db.query(`
    INSERT INTO edition_catalog_to_col (user_id, col_id, edition_catalog_id)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE edition_catalog_to_col_id = LAST_INSERT_ID(edition_catalog_to_col_id)
        `, [user_id, col_id, edition_catalog_id])
        const edition_catalog_to_col_id = res.insertId
        response = await db.query(`
    INSERT INTO edition_catalog_to_col_confirmation (edition_catalog_to_col_id, time)
    VALUES (?, CURRENT_TIMESTAMP())
        `,[edition_catalog_to_col_id])
    } catch(err) {
        response = err
    } finally {
        return response
    }
}

exports.deleteMatchListing = async (col_id, edition_catalog_id, user_id) => {
    let res = 0
    try {
        await db.query(`
INSERT INTO edition_catalog_to_col_confirmation (edition_catalog_to_col_id, confirmed, user_id, time)
SELECT edition_catalog_to_col.edition_catalog_to_col_id, 0, ?, CURRENT_TIMESTAMP()
FROM edition_catalog_to_col
WHERE edition_catalog_to_col.edition_catalog_id = ?
    AND edition_catalog_to_col.col_id = ?
    `, [user_id, edition_catalog_id, col_id])
    } catch(err) {
        res = 1
        console.error(err)
    }
    return res
}