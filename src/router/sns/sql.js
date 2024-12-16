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

module.exports = {postLikeTrackingImgSQL}