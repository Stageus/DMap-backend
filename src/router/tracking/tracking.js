const router = require("express").Router()


const {createTrackingImg,getMyTrackingImg,getUserTrackingImg,deleteTrackingImg,getTrackingLine,putTrackingImage} = require("./service")
const {regColor,searchPoint} = require("../../constant/regx")
const {checkRegInput,checkIdx,checkZoom,checkHeading,checkSharing,checkThickness,checkBackground,checkLine,checkCenter} = require("../../middleware/checkInput")
const {checkData,checkSetData} = require("../../middleware/checkData")


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
)


// 나의 트래킹 이미지 가져오기
router.get("/",
    getMyTrackingImg
)

// 다른 사용자의 전체 트래킹 이미지 가져오기
router.get("/account/:idx",

    checkData("account.user","idx"),

    getUserTrackingImg
)

// 나의 트래킹 이미지 삭제
router.delete("/:idx",
    deleteTrackingImg
)

// 트래킹 라인 가져오기
router.get("/:idx",
    checkData("tracking.list","idx"),
    getTrackingLine
)

// 트래킹 이미지 수정
router.put("/:idx",
    checkData("tracking.list","idx"),
    putTrackingImage
)

// 트래킹 이미지 공유 상태 변경
router.put("/",
    checkSetData("idxList"),
)

module.exports = router 

