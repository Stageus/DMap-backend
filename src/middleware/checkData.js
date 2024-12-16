const customError = require("../middleware/customError")
const client = require("../database/postgreSQL")


const checkData = (what,input) => {
    return async (req,res,next) => {
        const value = req.body[input] || req.params[input] || req.query[input] || req.decoded[input]
        const sql = `SELECT * FROM ${what} WHERE ${input} = $1`
        
        try {
            const result = await client.query(sql, [value])
            if(!result.rows[0]) throw customError(404, `${input}가(이) 존재하지 않습니다.`)
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

module.exports = {checkData,checkSetData}

