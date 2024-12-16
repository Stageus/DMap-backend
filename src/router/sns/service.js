const client = require("../../database/postgreSQL")
const customError = require("../../middleware/customError")

const {postLikeTrackingImgSQL} = require("./sql")


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


// 트래킹 이미지 좋아요
const postLikeTrackingImg = async (req,res,next) => {
    const {idx,user_idx} = req.body

    try{
        await client.query('BEGIN');
        await client.query(`INSERT INTO tracking.like (user_idx, tracking_idx) VALUES ($1, $2)`, [user_idx, idx]);
        await client.query(`UPDATE tracking.list SET likecount = likecount + 1 WHERE idx = $1`, [idx]);
        await client.query('COMMIT');
        res.status(200).send({})
    }catch(e){
        next(e)
    }
}

// 트래킹 이미지 좋아요 삭제

/// 미완성
const deleteLikeTrackingImg = async (req,res,next) => {
    const {idx,user_idx} = req.body

    try{
        await client.query('BEGIN');
        await client.query(`DELETE FROM tracking.like WHERE user_idx = $1 AND tracking_idx = $2`, [user_idx, idx]);
        await client.query(`UPDATE tracking.list SET likecount = likecount - 1 WHERE idx = $1`, [idx]);
        await client.query('COMMIT');
        res.status(200).send({})
    }catch(e){
        next(e)
    }
}

module.exports = {postLikeTrackingImg,deleteLikeTrackingImg}