const db = require('@db/sqe-mariadb')

exports.getUserListings = async (userID) => {
    const listings =  await db.query(`
SELECT scroll_data.name, 
	scroll_version_group.scroll_version_group_id, 
	JSON_OBJECT("name", admin.user_name, "user_id", admin.user_id) AS owner,
	CONCAT('[', GROUP_CONCAT(DISTINCT '{"name":"', user.user_name, '","user_id":', user.user_id, ',"scroll_version_id":', sv2.scroll_version_id, ',"may_write":', sv2.may_write, ',"may_lock":', sv2.may_lock, '}'  SEPARATOR ','),']') AS shared,
	COUNT(DISTINCT sv2.scroll_version_id) AS number_of_versions, 
	CONCAT('[', GROUP_CONCAT(DISTINCT sv2.scroll_version_id SEPARATOR ','),']') AS scroll_version_ids,
	CONCAT('[', GROUP_CONCAT('"', image_urls.proxy, image_urls.url, SQE_image.filename, '"' SEPARATOR ','),']') AS thumbnails, 
	COUNT(DISTINCT SQE_image.sqe_image_id) as imaged_fragments,
	sv1.scroll_version_id
FROM scroll_data
JOIN scroll_data_owner USING(scroll_data_id)
JOIN scroll_version AS sv1 USING(scroll_version_id)
JOIN scroll_version_group ON sv1.scroll_version_group_id = scroll_version_group.scroll_version_group_id
JOIN scroll_version AS sv2 ON sv2.scroll_version_group_id = scroll_version_group.scroll_version_group_id
LEFT JOIN edition_catalog ON edition_catalog.scroll_id = scroll_data.scroll_id
	AND edition_catalog.edition_side = 0
LEFT JOIN image_to_edition_catalog USING(edition_catalog_id)
LEFT JOIN SQE_image ON SQE_image.image_catalog_id = image_to_edition_catalog.image_catalog_id
	AND SQE_image.type = 0
LEFT JOIN image_urls USING(image_urls_id)
JOIN user ON user.user_id = sv2.user_id
JOIN scroll_version_group_admin ON scroll_version_group.scroll_version_group_id = scroll_version_group_admin.scroll_version_group_id
JOIN user AS admin ON scroll_version_group_admin.user_id = admin.user_id
WHERE sv1.user_id = ?
GROUP BY sv1.scroll_version_group_id
    `, [userID])
    return listings.map(x => {
        if (x.thumbnails === null) x.thumbnails = "[]"
        x.thumbnails = JSON.parse(x.thumbnails)
        x.owner = JSON.parse(x.owner)
        x.shared = JSON.parse(x.shared)
        x.scroll_version_ids = JSON.parse(x.scroll_version_ids)
        return x
    })
}

exports.getListings = async () => {
    const listings = await db.query(`
SELECT scroll_data.name, 
	scroll_data_owner.scroll_version_id, 
	scroll_version.user_id,
	COUNT(DISTINCT scroll_version.scroll_version_id) AS number_of_versions, 
	CONCAT('[', GROUP_CONCAT(DISTINCT scroll_version.scroll_version_id SEPARATOR ','),']') AS scroll_version_ids,
	CONCAT('[', GROUP_CONCAT('"', image_urls.proxy, image_urls.url, SQE_image.filename, '"' SEPARATOR ','),']') AS thumbnails, 
	COUNT(DISTINCT SQE_image.sqe_image_id) as imaged_fragments
FROM scroll_data
JOIN scroll_data_owner USING(scroll_data_id)
JOIN scroll_version USING(scroll_version_id)
LEFT JOIN edition_catalog ON edition_catalog.scroll_id = scroll_data.scroll_id
	AND edition_catalog.edition_side = 0
LEFT JOIN image_to_edition_catalog USING(edition_catalog_id)
LEFT JOIN SQE_image ON SQE_image.image_catalog_id = image_to_edition_catalog.image_catalog_id
	AND SQE_image.type = 0
LEFT JOIN image_urls USING(image_urls_id)
WHERE scroll_version.user_id = 1
GROUP BY scroll_data.scroll_id
    `)
    return listings.map(x => {
        if (x.thumbnails === null) x.thumbnails = "[]"
        x.thumbnails = JSON.parse(x.thumbnails)
        x.scroll_version_ids = JSON.parse(x.scroll_version_ids)
        return x
    })
}

exports.getAll = async () => {
    const names = await exports.getNames()
    const thumbnails = await exports.getThumbnails()
    const numImages = await exports.getNumberOfImages()
    // await names
    // await thumbnails
    // await numImages
    return  names.map((x, i) => Object.assign({}, x, thumbnails[i], numImages[i]))
}

exports.getNames =  () => {
    return  db.query(`
SELECT scroll_data.name, scroll_version.scroll_version_id
FROM scroll_data
JOIN scroll_data_owner USING(scroll_data_id)
JOIN scroll_version USING(scroll_version_id)
WHERE scroll_version.user_id = 1
    `)
}

exports.getThumbnails =  () => {
    return  db.query(`
SELECT scroll_version.scroll_version_id, CONCAT(image_urls.proxy, image_urls.url, image.filename) AS image
FROM scroll_version_group
JOIN scroll_version USING(scroll_version_group_id)
LEFT JOIN edition_catalog ON edition_catalog.scroll_id = scroll_version_group.scroll_id
	AND edition_catalog.edition_side = 0
LEFT JOIN image_to_edition_catalog USING(edition_catalog_id)
LEFT JOIN (SELECT SQE_image.image_urls_id, SQE_image.image_catalog_id, SQE_image.filename FROM SQE_image WHERE SQE_image.type = 0 ORDER BY RAND()) AS image ON image.image_catalog_id = image_to_edition_catalog.image_catalog_id
LEFT JOIN image_urls USING(image_urls_id)
WHERE scroll_version.user_id = 1 
GROUP BY scroll_version_group.scroll_id
    `)
}

exports.getNumberOfImages =  () => {
    return  db.query(`
SELECT scroll_version.scroll_version_id,
	COUNT(DISTINCT SQE_image.image_catalog_id) as imaged_fragments
FROM scroll_version_group
JOIN scroll_version USING(scroll_version_group_id)
LEFT JOIN edition_catalog ON edition_catalog.scroll_id = scroll_version_group.scroll_id
	AND edition_catalog.edition_side = 0
LEFT JOIN image_to_edition_catalog USING(edition_catalog_id)
LEFT JOIN SQE_image ON SQE_image.image_catalog_id = image_to_edition_catalog.image_catalog_id
WHERE scroll_version.user_id = 1 
GROUP BY scroll_version_group.scroll_id
    `)
}

exports.getFullModel = async (scroll_version_id) => {
    const stream = exports.getSignStream(scroll_version_id)
    const cols = exports.getCols(scroll_version_id)
    const lines = exports.getLines(scroll_version_id)
    let images = exports.getImages(scroll_version_id)
    let artefacts = await exports.getArtefacts(scroll_version_id)
    await images
    for (artefact in artefacts) {
        artefacts[artefact].images = images[artefacts[artefact].image_catalog_id]
    }
    return {cols: await cols, lines: await lines, sign_stream: await stream, artefacts: artefacts}
}

exports.getSignStream = async (scroll_version_id) => {   
      const signStream = await db.query(`
SELECT position_in_stream.sign_id, position_in_stream.next_sign_id, GROUP_CONCAT(sign_char_attribute.attribute_value_id) AS attribute_value_id, sign_char.sign,
    "{matrix: [[1,0,2314],[0,1,76735]]}" AS matrix,
    "POLYGON((3522.21 2571,3525.904 2587,3526 2606,3516 2615.692,3516 2630.422,3505.46 2642.95,3507.898 2680.072,3512.378 2688.444,3509.844 2705,3507.614 2724.014,3521.6 2738,3548.308 2738,3559 2727,3568.002 2732.328,3570 2736,3565.752 2743,3563.712 2748,3554.8 2748,3550 2752.8,3550 2763.2,3554 2767,3546 2776.306,3546 2779,3543 2780.002,3530.716 2784,3517.692 2784,3506 2772.308,3506 2766.352,3489.862 2763.624,3477.856 2753.524,3476 2750,3482 2735.512,3481.858 2723,3476.494 2701,3473 2692,3478.028 2671,3480.408 2627,3485.974 2607.36,3484.974 2588,3486.308 2588,3498 2576.308,3498 2562,3511.776 2562,3522.21 2571),(3464 2642,3452.8 2642,3448 2637.2,3448 2634,3464 2634,3464 2642))" AS roi
FROM position_in_stream_owner
JOIN position_in_stream  USING(position_in_stream_id)
JOIN sign_char USING(sign_id)
JOIN sign_char_attribute USING(sign_char_id)
WHERE position_in_stream_owner.scroll_version_id = ?
GROUP BY position_in_stream.sign_id
    `, [scroll_version_id])
    return signStream.reduce((ss, x) => {
            ss[x.sign_id] = {next_sign_id: x.next_sign_id, sign: x.sign, attributes: x.attribute_value_id.split(','), roi: x.roi, matrix: x.matrix}
            return ss
        }, {})
}

exports.getCols = async (scroll_version_id) => {   
      const cols = await db.query(`
SELECT col_data.name, col_data.col_id, sign_char_attribute.attribute_value_id, sign_char.sign_id
FROM sign_char_attribute_owner
JOIN sign_char_attribute USING(sign_char_attribute_id)
JOIN sign_char USING(sign_char_id)
JOIN line_to_sign USING(sign_id)
JOIN line_to_sign_owner USING(line_to_sign_id)
JOIN col_to_line USING(line_id)
JOIN col_to_line_owner USING(col_to_line_id)
JOIN col_sequence USING(col_id)
JOIN col_sequence_owner USING(col_sequence_id)
JOIN col_data USING(col_id)
JOIN col_data_owner USING(col_data_id)
WHERE sign_char_attribute_owner.scroll_version_id = ?
    AND line_to_sign_owner.scroll_version_id = ?
    AND col_to_line_owner.scroll_version_id = ?
    AND col_sequence_owner.scroll_version_id = ?
    AND col_data_owner.scroll_version_id = ?
    AND (sign_char_attribute.attribute_value_id = 12 OR sign_char_attribute.attribute_value_id = 13)
ORDER BY col_sequence.position, sign_char_attribute.attribute_value_id ASC
    `, [scroll_version_id, scroll_version_id, scroll_version_id, scroll_version_id, scroll_version_id])
    return cols.reduce((cols, x) => {
            cols[x.col_id] ? cols[x.col_id].end_sign_id = x.sign_id : cols[x.col_id] = {name: x.name, start_sign_id: x.sign_id}
            return cols
        }, {})
}

exports.getLines = async (scroll_version_id) => {   
      const lines = await db.query(`
SELECT line_data.name, line_data.line_id, sign_char_attribute.attribute_value_id, sign_char.sign_id
FROM line_to_sign_owner 
JOIN line_to_sign USING(line_to_sign_id)
JOIN sign_char USING(sign_id)
JOIN sign_char_attribute USING(sign_char_id)
JOIN sign_char_attribute_owner USING(sign_char_attribute_id)
JOIN line_data USING(line_id)
JOIN line_data_owner USING(line_data_id)
WHERE sign_char_attribute_owner.scroll_version_id = ?
    AND line_to_sign_owner.scroll_version_id = ?
    AND line_data_owner.scroll_version_id = ?
    AND (sign_char_attribute.attribute_value_id = 10 OR sign_char_attribute.attribute_value_id = 11)
ORDER BY line_data.name, sign_char_attribute.attribute_value_id ASC
    `, [scroll_version_id, scroll_version_id, scroll_version_id])
    return lines.reduce((lines, x) => {
            lines[x.line_id] ? lines[x.line_id].end_sign_id = x.sign_id : lines[x.line_id] = {name: x.name, start_sign_id: x.sign_id}
            return lines
        }, {})
}

exports.getArtefacts = async (scroll_version_id) => {   
      const artefacts = await db.query(`
SELECT artefact_position.artefact_id, artefact_data.name, ST_ASTEXT(artefact_shape.region_in_sqe_image) AS region_in_sqe_image, artefact_position.transform_matrix, SQE_image.image_catalog_id
FROM artefact_position
JOIN artefact_position_owner USING(artefact_position_id)
JOIN artefact_data USING(artefact_id)
JOIN artefact_data_owner USING(artefact_data_id)
JOIN artefact_shape USING(artefact_id)
JOIN artefact_shape_owner USING(artefact_shape_id)
JOIN SQE_image ON SQE_image.sqe_image_id = artefact_shape.id_of_sqe_image
JOIN image_catalog USING(image_catalog_id)
WHERE artefact_position_owner.scroll_version_id = ?
    AND artefact_data_owner.scroll_version_id = ?
    AND artefact_shape_owner.scroll_version_id = ?
    AND image_catalog.catalog_side = 0
    `, [scroll_version_id, scroll_version_id, scroll_version_id])
    return artefacts.reduce((artefacts, x) => {
            artefacts[x.artefact_id] = {name: x.name, region_in_sqe_image: x.region_in_sqe_image, transform_matrix: JSON.parse(x.transform_matrix).matrix, image_catalog_id: x.image_catalog_id, images: {}}
            return artefacts
        }, {})
}

// This is a hack, do NOT use in production!!!
exports.getImages = async (scroll_version_id) => {   
      const images = await db.query(`
SELECT GROUP_CONCAT(DISTINCT CASE WHEN image_catalog.catalog_side = 0 THEN image_catalog.image_catalog_id END)AS image_catalog_id,
   CONCAT('{"recto":{', CONCAT(GROUP_CONCAT(DISTINCT CASE WHEN image_catalog.catalog_side = 0 THEN CONCAT( '"', CASE 
        WHEN SQE_image.type = 0 THEN 'color'
        WHEN SQE_image.type = 1 THEN 'infrared'
        WHEN SQE_image.type = 2 THEN 'raking-left'
        WHEN SQE_image.type = 3 THEN 'raking-right'
     END, '":"', image_urls.proxy, image_urls.url, SQE_image.filename, '"') END), '},'),
   '"verso":{', CONCAT(GROUP_CONCAT(DISTINCT CASE WHEN image_catalog.catalog_side = 1 THEN CONCAT( '"', CASE 
        WHEN SQE_image.type = 0 THEN 'color'
        WHEN SQE_image.type = 1 THEN 'infrared'
        WHEN SQE_image.type = 2 THEN 'raking-left'
        WHEN SQE_image.type = 3 THEN 'raking-right'
     END, '":"', image_urls.proxy, image_urls.url, SQE_image.filename, '"') END), '}}')) AS images
FROM edition_catalog
JOIN scroll_version_group USING(scroll_id)
JOIN scroll_version USING(scroll_version_group_id)
JOIN image_to_edition_catalog USING(edition_catalog_id)
JOIN image_catalog USING(image_catalog_id)
JOIN SQE_image USING(image_catalog_id)
JOIN image_urls USING(image_urls_id)
LEFT JOIN artefact_shape ON artefact_shape.id_of_sqe_image = SQE_image.sqe_image_id
LEFT JOIN artefact_shape_owner USING(artefact_shape_id)
LEFT JOIN artefact_data USING(artefact_id)
LEFT JOIN artefact_data_owner USING(artefact_data_id)
WHERE scroll_version.scroll_version_id = ?
    AND (scroll_version.user_id = 1 OR scroll_version.user_id = 1)
GROUP BY image_catalog.catalog_number_1, image_catalog.catalog_number_2
    `, [scroll_version_id])
    return images.reduce((images, x) => {
            images[x.image_catalog_id] = JSON.parse(x.images)
            return images
        }, {})
}