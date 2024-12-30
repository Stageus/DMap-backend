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
    tracking.list.idx,
    tracking.list.user_idx,
    tracking.list.searchpoint,
    ST_AsText(tracking.list.line) AS line,
    ST_AsText(tracking.list.center) AS center,
    tracking.list.zoom,
    tracking.list.heading,
    tracking.list.sharing,
    tracking.list.likecount,
    tracking.list.color,
    tracking.list.thickness,
    tracking.list.background,
    tracking.list.createtime,
    tracking.list.updatetime,
    account.user.nickname,
    account.user.image,
    (CASE
        WHEN tracking.like.user_idx IS NOT NULL THEN true
        ELSE false
    END) AS liked_by_user
FROM 
    tracking.list
INNER JOIN
    account.user
ON
    tracking.list.user_idx = account.user.idx
LEFT JOIN
    tracking.like
ON
    tracking.list.idx = tracking.like.tracking_idx
    AND tracking.like.user_idx = $2
WHERE 
    tracking.list.user_idx = $1
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
