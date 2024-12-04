const client = require("../../database/postgreSQL")
const customError = require("../../middleware/customError")

// ================================== 공통 함수 ============================

// 구글 맵에서 사용되는 데이터 PostgreGIS 형태로 변환

function convertMultiLine(line) {
    const multiLine = line.map((section) => 
        `(${section.map((point) => `${point.lng} ${point.lat}`).join(", ")})`
    ).join(", ");

    return `MULTILINESTRING(${multiLine})`
}

// DB에서 꺼내 온 값 구글 맵에 활용할 형태로 변환

function convertFromMultiLine(multiLine) {
    // 'MULTILINE' 제거하고 양쪽 괄호 삭제
    let cleanedString = multiLine.replace("MULTILINESTRING", "").trim();
    cleanedString = cleanedString.slice(1, -1); // 양쪽 괄호 제거

    // 각 라인을 나누기
    const lines = cleanedString.split("), (").map(line => line.replace("(", "").replace(")", ""));

    // 각 라인을 좌표 배열로 변환
    const parsedLines = lines.map((line) => {
        return line.split(", ").map((point) => {
            const [lng, lat] = point.split(" ").map(Number); // 경도와 위도를 숫자로 변환
            return { lat, lng }; // 객체로 반환
        });
    });

    return parsedLines;
}

// ===================================== 서비스 ===================================

// 트래킹 이미지 생성
const createTrackingImg = async (req,res,next) => {
    const {line,searchPoint,center,zoom,sharing,color,thickness,background} = req.body



    const multiLine = convertMultiLine(line)
}