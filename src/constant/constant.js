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

module.exports = {convertMultiLine,convertCenterPoint,convertFromMultiLine}