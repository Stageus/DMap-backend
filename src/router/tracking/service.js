const client = require("../../database/postgreSQL")
const customError = require("../../middleware/customError")

const {createTrackingImgSQL,getMyTrackingImgSQL,getUserTrackingImgSQL,deleteTrackingImgSQL,getTrackingLineSQL,putTrackingImageSQL} = require("./sql")


// ================================== 공통 함수 ============================

// 구글 맵에서 사용되는 데이터 PostgreGIS 형태로 변환

function convertMultiLine(line) {
    const multiLine = line.map((section) => 
        `(${section.map((point) => `${point.lng} ${point.lat}`).join(", ")})`
    ).join(", ");

    return `MULTILINESTRING(${multiLine})`
}

// center 값을 GEOGRAPHY POINT 형태로 변환
function convertCenterPoint(point){
    return `POINT(${point.lng} ${point.lat})` 
}

// DB에서 꺼내 온 값 구글 맵에 활용할 형태로 변환

function convertFromMultiLine(multiLine) {
    // 먼저 MULTILINESTRING , 괄호 벗기고, 뒤의 괄호 기준으로 나누기
    const splitLine = multiLine
        .replace("MULTILINESTRING", "")
        .slice(1, -1)
        .split("),") 

    //나눈 것들 배열로 분배
    const seperatedSegments = splitLine.map(segment => {
        if(segment.startsWith("(")){
            segment = segment.slice(1)
        }
        if(segment.endsWith(")")){
            segment = segment.slice(0,-1)
        }

        // 각 배열들 , 기준 (점들)으로 나누고 lng,lat 에 띄어쓰기 기준으로 나눠서 맵핑
        const points = segment.split(",").map(point => {
            const [lng, lat] = point.split(" ").map(Number);
            return { lat, lng };
        });

        return points;
    });

    return seperatedSegments;
}

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
        console.log(result.rows[0].line)
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
    const {idx} = req.params

    try{
        const result = await client.query(getUserTrackingImgSQL, [idx])
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
    const {idx} = req.params

    try{
        await client.query(deleteTrackingImgSQL,[user_idx,idx])
        res.status(200).send({})
    }catch(e){
        next(e)
    }
}


// 트래킹 라인 가져오기
const getTrackingLine = async (req,res,next) => {
    const {user_idx} = req.body
    const {idx} = req.params

    try{
        const result = await client.query(getTrackingLineSQL, [user_idx,idx])
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
    const {idx} = req.params
    const {user_idx,center,zoom,heading,sharing,color,thickness,background} = req.body
    const point = convertCenterPoint(center)

    try{
        await client.query(putTrackingImageSQL, [point,zoom,heading,sharing,color,thickness,background,user_idx,idx])
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

