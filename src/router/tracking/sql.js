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

module.exports = {createTrackingImgSQL,getMyTrackingImgSQL}