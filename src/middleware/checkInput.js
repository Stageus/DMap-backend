const customError = require("../middleware/customError")

// reg = 정규표현식, check = 들어올 key 값
// 정규표현식으로 검증할 미들웨어
const checkRegInput = (reg,check) => {
    return (req,res,next) => {
        const value = req.body[check] || req.params[check] || req.query[check]

        try {

            if(!reg.test(value) || !value) {
                throw customError(400, `${check} 양식 오류`)
            }
            next()
        } catch (e) {
            next(e)
        }
        
    }
}

// idx가 숫자 인지 아닌지 판별하는 미들웨어
const checkIdx = (input) => {
    return (req,res,next) => {
        const value = req.body[input] || req.params[input] || req.query[input]
        try {
            if(isNaN(value) || !value) throw customError (400, `${input} 양식 오류`)
            next()
        } catch (e) {
            next(e)
        }
    }
}

const checkZoom = (input) => {
    return (req,res,next) => {
        const value = req.body[input] || req.params[input] || req.query[input]
        try {
            if(!value || isNaN(value) || value < 0 || value > 22) throw customError (400, `${input} 양식 오류`)
            next()
        } catch (e) {
            next(e)
        }
    }
}

const checkHeading = (input) => {
    return (req,res,next) => {
        const value = req.body[input] || req.params[input] || req.query[input]
        try {
            if(!value || isNaN(value) || value < 0 || value > 360) throw customError (400, `${input} 양식 오류`)
            next()
        } catch (e) {
            next(e)
        }
    }       
}

const checkSharing = (input) => {
    return (req,res,next) => {
        const value = req.body[input] ?? req.params[input] ?? req.query[input]
        console.log(req.body.sharing)
        try {
            console.log(value)
            if(value === undefined || value === null || isNaN(value) || (value != 0 && value != 1)) throw customError (400, `${input} 양식 오류`)

            next()
        } catch (e) {
            next(e)
        }
    }
}

const checkThickness = (input) => {
    return (req,res,next) => {
        const value = req.body[input] || req.params[input] || req.query[input]
        try {
            if(!value || isNaN(value) || value < 1 || value > 50) throw customError (400, `${input} 양식 오류`)
            next()
        } catch (e) {
            next(e)
        }
    }
}


////// 이거 좀 이상함 아마도 입력 값이 0값인 것에서 뭔가 문제가 생기는 듯
const checkBackground = (input) => {
    return (req,res,next) => {

        console.log(`req.body 는 : ${req.body.background}`)
        const value =  req.params[input] ?? req.query[input] ?? req.body[input]
        console.log(`value 는 : ${value}`)

        try {
            if(value !== 0 && value !== 1 && value !== 2) throw customError (400, `${input} 양식 오류`)
            next()
        } catch (e) {
            next(e)
        }
    }
}

// line 값 검증
const checkLine = (input) => {
    return (req,res,next) => {
        const value = req.body[input] || req.params[input] || req.query[input]

        function checkLineFunc(line) {
            for (let x of line) {
                for (let point of x) {
                    if (point.lat < -90 || point.lat > 90 || point.lng < -180 || point.lng > 180) return false
                }
            }
            return true; 
        }


        try {
            if(!checkLineFunc(value)) throw customError (400, `${input} 양식 오류`)
            next()
        } catch (e) {
            next(e)
        }
    }
}

// center 값 검증
const checkCenter = (input) => {
    return (req,res,next) => {
        const value = req.body[input] || req.params[input] || req.query[input]

        function checkCenterFunc(point) {
            if (point.lat < -90 || point.lat > 90 || point.lng < -180 || point.lng > 180) return false
            return true; 
        }


        try {
            if(!checkCenterFunc(value)) throw customError (400, `${input} 양식 오류`)
            next()
        } catch (e) {
            next(e)
        }
    }
}




module.exports = {checkRegInput,checkIdx,checkZoom,checkHeading,checkSharing,checkThickness,checkBackground,checkLine,checkCenter}

