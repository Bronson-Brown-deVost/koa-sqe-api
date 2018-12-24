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