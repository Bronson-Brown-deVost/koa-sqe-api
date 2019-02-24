const db = require('@db/sqe-mariadb')
const nat = require('natural-orderby')

exports.getImageListings = async (image_catalog_id) => {
    const result = await db.query(`
SELECT CONCAT(image_urls.proxy, image_urls.url, SQE_image.filename) AS url, SQE_image.type
FROM image_catalog
JOIN SQE_image USING(image_catalog_id)
JOIN image_urls USING(image_urls_id)
WHERE image_catalog.image_catalog_id = ? AND (SQE_image.type = 0 OR SQE_image.type = 1)
    `, [image_catalog_id])
    return result.length > 0 && result.length<= 2 ? result : []
}

exports.getImageRefs = async () => {
    return await db.query(`
SELECT image_catalog_id, CONCAT(institution, ": ", catalog_number_1, IF(catalog_number_2 is not NULL, CONCAT(".", catalog_number_2), ""), " ", IF(catalog_side = 0, "(recto)", "(verso)")) AS imageName
FROM image_catalog
ORDER BY institution, LENGTH(catalog_number_1), catalog_number_1, LENGTH(catalog_number_2), catalog_number_2, catalog_side
    `)
}

exports.getImageInstitutions = async () => {
    return await db.query(`
SELECT DISTINCT institution
FROM image_catalog
    `)
}

exports.getImagePlateRefs = async (institution) => {
    const results =  await db.query(`
SELECT DISTINCT catalog_number_1
FROM image_catalog
WHERE institution = ?
    `, [institution])
    return nat.orderBy(results, [v => v.catalog_number_1], ['asc'])
}

exports.getImagePlateFragRefs = async (catalog_number_1, institution) => {
    return await db.query(`
SELECT DISTINCT image_catalog_id, CONCAT(catalog_number_2, " ", IF(catalog_side = 0, "(recto)", "(verso)")) AS name,
IF(SQE_image.sqe_image_id IS NULL, 0, 1) AS hasImage
FROM image_catalog
LEFT JOIN SQE_image USING(image_catalog_id)
WHERE catalog_number_1 = ? AND institution = ?
ORDER BY LENGTH(catalog_number_2), catalog_number_2, catalog_side
    `, [catalog_number_1, institution])
}