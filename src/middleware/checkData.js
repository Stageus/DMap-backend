const customError = require("../middleware/customError")
const client = require("../database/postgreSQL")

const checkData = (sql,input) => {
    return async (req,res,next) => {
        const value = req.body[input] || req.params[input] || req.query[input]
        
        try {
            const result = await client.query(sql, [value])
            if(!result.rows[0]) throw customError(404, `${input}가(이) 존재하지 않습니다.`)
            next()
        } catch(e) {
            next(e)
        }
    }
}

module.exports = checkData