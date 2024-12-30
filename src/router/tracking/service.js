const client = require("../../database/postgreSQL")
const customError = require("../../util/customError")
const {createTrackingImgSQL,getMyTrackingImgSQL,getUserTrackingImgSQL,deleteTrackingImgSQL,getTrackingLineSQL,putTrackingImageSQL} = require("./sql")
const {convertMultiLine,convertCenterPoint,convertFromMultiLine} = require("../../util/util")


// ===================================== 서비스 ===================================

// 트래킹 이미지 생성
const createTrackingImg = async (req,res,next) => {
    const {user_idx,line,searchpoint,center,zoom,heading,sharing,color,thickness,background} = req.body

    const multiLine = convertMultiLine(line)
    const point = convertCenterPoint(center)

    try{
        await client.query(createTrackingImgSQL, [user_idx,multiLine,searchpoint,point,zoom,heading,sharing,color,thickness,background])
        res.status(200).send({})
    } catch(e){
        next(e)
    }
}


// 나의 트래킹 이미지 가져오기
const getMyTrackingImg = async (req,res,next) => {
    const {user_idx} = req.body

    try{
        const result = await client.query(getMyTrackingImgSQL, [user_idx])
        result.rows.forEach(obj => {
            obj.line = convertFromMultiLine(obj.line)
        });
        res.status(200).send({ message : result.rows })
    } catch(e){
        next(e)
    }
}

// 다른 사용자 전체 트래킹 이미지 가져오기
const getUserTrackingImg = async (req,res,next) => {
    const {user_idx} = req.params
    const {my_idx} = req.body
    console.log(user_idx,my_idx)
    try{
        const result = await client.query(getUserTrackingImgSQL, [user_idx,my_idx])

        result.rows.forEach(obj => {
            obj.line = convertFromMultiLine(obj.line)
        });
        res.status(200).send({ message : result.rows })
    }catch(e){
        next(e)
    }
}

// 나의 트래킹 이미지 삭제
const deleteTrackingImg = async (req,res,next) => {
    const {user_idx} = req.body
    const {tracking_idx} = req.params

    try{
        await client.query(deleteTrackingImgSQL,[user_idx,tracking_idx])
        res.status(200).send({})
    }catch(e){
        next(e)
    }
}


// 트래킹 라인 가져오기
const getTrackingLine = async (req,res,next) => {
    const {user_idx} = req.body
    const {tracking_idx} = req.params

    try{
        const result = await client.query(getTrackingLineSQL, [user_idx,tracking_idx])
        result.rows.forEach(obj => {
            obj.line = convertFromMultiLine(obj.line)
        });
        res.status(200).send({ message : result.rows })
    }catch(e){
        next(e)
    }
}


// 트래킹 이미지 수정
const putTrackingImage = async (req,res,next) => {
    const {tracking_idx} = req.params
    const {user_idx,center,zoom,heading,sharing,color,thickness,background} = req.body
    const point = convertCenterPoint(center)

    try{
        await client.query(putTrackingImageSQL, [point,zoom,heading,sharing,color,thickness,background,user_idx,tracking_idx])
        res.status(200).send({})
    }catch(e){
        next(e)
    }
}

// 트래킹 이미지 공유 상태 변경
const putSharingTrackingImg = async (req,res,next) => {
    const {idxSet} = req.body
}

module.exports = {createTrackingImg,getMyTrackingImg,getUserTrackingImg,deleteTrackingImg,getTrackingLine,putTrackingImage}
