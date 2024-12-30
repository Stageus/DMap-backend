const customError = require("../util/customError")
const client = require("../database/postgreSQL")


const checkData = (what,input) => {
    return async (req,res,next) => {
        const value = req.body[input] || req.params[input] || req.query[input] || req.decoded[input]
        const sql = `SELECT * FROM ${what} WHERE idx = $1`

        
        try {
            const result = await client.query(sql, [value])
            console.log(result.rows[0])
            if(!result.rows[0]) throw customError(404, `${input}가(이) 존재하지 않습니다.`)
            next()
        } catch(e) {
            next(e)
        }
    }
}

// trackingIdx중 sharing이 true인 데이터가 존재 하는지 여부
const checkTrackingIdxData = () => {
    return async (req,res,next) => {
        const value = req.body.tracking_idx || req.params.tracking_idx || req.query.tracking_idx
        const sql = `SELECT * FROM tracking.list WHERE idx = $1 AND sharing = true`
        
        try {
            const result = await client.query(sql, [value])
            if(!result.rows[0]) throw customError(404, `tracking_idx 가(이) 존재하지 않습니다.`)
            next()
        } catch(e) {
            next(e)
        }
    }
}

const checkSetData = (array) => {
    return async (req,res,next) => {
        const value = req.body[array]
        const sql =
        `
        SELECT
            idx
        FROM 
            tracking.list
        WHERE
            idx = ANY($1);
        `

        try{
            const result = await client.query(sql,[value])
            if(value.length != result.rows.length) throw customError(404, `${array}가(이) 존재하지 않습니다.`)
            next()
        } catch(e){
            next(e)
        }
    }
}

const checkLike = () => {
    return async (req,res,next) => {
        const {tracking_idx,user_idx} = req.body
        const sql = `SELECT * FROM tracking.like WHERE user_idx = $1 AND tracking_idx = $2`
        
        try {
            const result = await client.query(sql, [user_idx,tracking_idx])
            console.log(result.rows)
            if(result.rows[0]) throw customError(403, `중복된 좋아요 요청 입니다.`)
            next()
        } catch(e) {
            next(e)
        }
    }
}

const checkNotLike = () => {
    return async (req,res,next) => {
        const {tracking_idx,user_idx} = req.body
        const sql = `SELECT * FROM tracking.like WHERE user_idx = $1 AND tracking_idx = $2`
    
        try {
            const result = await client.query(sql, [user_idx,tracking_idx])
            console.log(result.rows[0])
            if(!result.rows[0]) throw customError(403, `중복된 좋아요 삭제 요청 입니다.`)
            else next()
        } catch(e) {
            next(e)
        }
    }
}


module.exports = {checkData,checkTrackingIdxData,checkSetData,checkLike,checkNotLike}

