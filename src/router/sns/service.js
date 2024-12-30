const client = require("../../database/postgreSQL")
const customError = require("../../util/customError")
const {convertMultiLine,convertCenterPoint,convertFromMultiLine} = require("../../util/util")

const {getWhatTrackingImageSQL,getRecentTrackingImgSQL,getLikeCountTrackingImgSQL} = require("./sql")


// =========================== 서비스 ============================

const getDefaultSNSPage = async (req,res,next) => {
    const {page} = req.query

    try{
        const result = await client.query()

        res.status(200).send({ message : result.rows })
    } catch(e){
        next(e)
    }
}

// 전체 좋아요 순 트래킹 이미지 가져오기
const getLikeCountTrackingImg = async (req,res,next) => {
    const {page} = req.query
    const {user_idx} = req.body

    try{
        const result = await client.query(getLikeCountTrackingImgSQL, [page,user_idx])
        result.rows.forEach(obj => {
            obj.line = convertFromMultiLine(obj.line)
        });
        res.status(200).send({ message : result.rows })
    }catch(e){
        next(e)
    }
}


// 최신순 트래킹 이미지 가져오기
const getRecentTrackingImg = async (req,res,next) => {
    const {page} = req.query
    const {user_idx} = req.body

    try{
        const result = await client.query(getRecentTrackingImgSQL, [page,user_idx])
        result.rows.forEach(obj => {
            obj.line = convertFromMultiLine(obj.line)
        });
        res.status(200).send({ message : result.rows })
    }catch(e){
        next(e)
    }
}

// 특정 트래킹 이미지 가져오기
const getWhatTrackingImage = async (req, res, next) => {
    try {
        const { tracking_idx } = req.params;
        const {user_idx} = req.body

        const result = await client.query(getWhatTrackingImageSQL, [tracking_idx,user_idx]);
        res.status(200).send({ message: result.rows });
    } catch (e) {
        console.error("라우터에서 오류 발생:", e.message);
        next(e);
    }
};




// 트래킹 이미지 좋아요
const postLikeTrackingImg = async (req,res,next) => {
    const {tracking_idx,user_idx} = req.body
    
    try{
        await client.query('BEGIN');
        await client.query(`INSERT INTO tracking.like (user_idx, tracking_idx) VALUES ($1, $2)`, [user_idx, tracking_idx]);
        await client.query(`UPDATE tracking.list SET likecount = likecount + 1 WHERE idx = $1`, [tracking_idx]);
        await client.query('COMMIT');
        res.status(200).send({})
    }catch(e){
        next(e)
    }
}

// 트래킹 이미지 좋아요 삭제

/// 미완성
const deleteLikeTrackingImg = async (req,res,next) => {
    const {tracking_idx,user_idx} = req.body

    try{
        await client.query('BEGIN');
        await client.query(`DELETE FROM tracking.like WHERE user_idx = $1 AND tracking_idx = $2`, [user_idx, tracking_idx]);
        await client.query(`UPDATE tracking.list SET likecount = likecount - 1 WHERE idx = $1`, [tracking_idx]);
        await client.query('COMMIT');
        res.status(200).send({})
    }catch(e){
        next(e)
    }
}

module.exports = {postLikeTrackingImg,deleteLikeTrackingImg,getWhatTrackingImage,getRecentTrackingImg,getLikeCountTrackingImg}
