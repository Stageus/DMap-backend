const postLikeTrackingImgSQL =
`
BEGIN
INSERT INTO
    tracking.like (user_idx,tracking_idx)
VALUES
    ($1,$2)
UPDATE
    tracking.list 
SET
    likecount = likecount + 1 
WHERE
    idx = $3
COMMIT;
`

const getWhatTrackingImageSQL =
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
    idx = $1
`


const getRecentTrackingImgSQL =
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
    sharing = true
ORDER BY 
    idx DESC
LIMIT
    20
OFFSET
    $1 - 1
`



module.exports = {getWhatTrackingImageSQL,getRecentTrackingImgSQL}