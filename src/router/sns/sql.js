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
    tracking.list.sharing = true
    AND tracking.list.idx = $1
`


const getRecentTrackingImgSQL =
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
    tracking.list.sharing = true
ORDER BY 
    idx DESC
LIMIT
    20
OFFSET
    ($1 - 1) * 20
`

const getLikeCountTrackingImgSQL =
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
    tracking.list.sharing = true
ORDER BY 
    tracking.list.likecount DESC
LIMIT
    20
OFFSET
    ($1 - 1) * 20;

`



module.exports = {getWhatTrackingImageSQL,getRecentTrackingImgSQL,getLikeCountTrackingImgSQL}
