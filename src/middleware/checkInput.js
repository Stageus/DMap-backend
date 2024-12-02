const customError = require("../middleware/customError")

// reg = 정규표현식, check = 들어올 key 값
const checkInput = (reg,check) => {
    return (req,res,next) => {
        const value = req.body[check] || req.params[check] || req.query[check]

        try {
            if(!req.test(value) || !value) {
                throw customError(400, `${check} 양식 오류`)
            }
            next()
        } catch (e) {
            next(e)
        }
        
    }
}

module.exports = checkInput