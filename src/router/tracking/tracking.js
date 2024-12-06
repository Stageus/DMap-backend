const router = require("express").Router()


const {createTrackingImg,getMyTrackingImg} = require("./service")
const {regColor,searchPoint} = require("../../constant/regx")
const {checkRegInput,checkIdx,checkZoom,checkHeading,checkSharing,checkThickness,checkBackground,checkLine,checkCenter} = require("../../middleware/checkInput")

// 트래킹 이미지 생성
router.post("/",
    checkIdx("user_idx"),
    checkRegInput(searchPoint, "searchpoint"),
    checkLine("line"),
    checkCenter("center"),
    checkZoom("zoom"),
    checkHeading("heading"),
    checkSharing("sharing"),
    checkRegInput(regColor, "color"),
    checkThickness("thickness"),
    checkBackground("background"),
    createTrackingImg


// 나의 트래킹 이미지 가져오기
router.get("/",
    getMyTrackingImg

)

// 다른 사용자의 전체 트래킹 이미지 가져오기
router.get("/account/:idx",

)

// 나의 트래킹 이미지 삭제
router.delete("/:idx",

)

// 트래킹 라인 가져오기
router.get("/:idx",

)

// 트래킹 이미지 수정
router.put("/:idx",

)

// 트래킹 이미지 공유 상태 변경
router.put("/:idx",
    

)

module.exports = router 

