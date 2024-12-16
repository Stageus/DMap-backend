const createTrackingImgSQL = 
`
INSERT INTO 
    tracking.list (user_idx, line, searchpoint,center, zoom, heading, sharing, color, thickness, background) 
VALUES 
    ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
`

const getMyTrackingImgSQL = 
`
SELECT 
    idx,
    user_idx,
    searchpoint,
    ST_AsText(line) AS line,
    ST_AsText(center) AS center,
    zoom,
    heading,
    sharing,
    likecount,
    color,
    thickness,
    background,
    createtime,
    updatetime
FROM 
    tracking.list
WHERE 
    user_idx = $1
ORDER BY 
    idx DESC
`

const getUserTrackingImgSQL =
`
SELECT 
    idx,
    user_idx,
    searchpoint,
    ST_AsText(line) AS line,
    ST_AsText(center) AS center,
    zoom,
    heading,
    sharing,
    likecount,
    color,
    thickness,
    background,
    createtime,
    updatetime
FROM 
    tracking.list
WHERE 
    user_idx = $1
AND
    sharing = true
ORDER BY 
    idx DESC
`

const deleteTrackingImgSQL = 
`
DELETE FROM 
    tracking.list 
WHERE 
    user_idx = $1 
AND 
    idx = $2
`

const getTrackingLineSQL =
`
SELECT 
    idx,
    user_idx,
    searchpoint,
    ST_AsText(line) AS line,
    ST_AsText(center) AS center,
    zoom,
    heading,
    sharing,
    likecount,
    color,
    thickness,
    background,
    createtime,
    updatetime
FROM 
    tracking.list
WHERE 
    user_idx = $1
AND
    idx = $2
`

const putTrackingImageSQL = 
`
UPDATE
    tracking.list
SET
    center = $1,
    zoom = $2,
    heading = $3,
    sharing = $4,
    color = $5,
    thickness = $6,
    background = $7
WHERE
    user_idx = $8
AND
    idx = $9

`

module.exports = {createTrackingImgSQL,getMyTrackingImgSQL,getUserTrackingImgSQL,deleteTrackingImgSQL,getTrackingLineSQL,putTrackingImageSQL}
