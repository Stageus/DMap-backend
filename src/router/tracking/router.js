const router = require("express").Router()

const {createTrackingImg,getMyTrackingImg,getUserTrackingImg,deleteTrackingImg,getTrackingLine,putTrackingImage,putToSharingTrackingImg,putToNotSharingTrackingImg} = require("./service")
const {regColor,searchPoint} = require("../../constant/regx")
const {checkRegInput,checkIdx,checkZoom,checkHeading,checkSharing,checkThickness,checkBackground,checkLine,checkCenter,checkIdxList} = require("../../middleware/checkInput")
const {checkData,checkTrackingIdxData,checkSetData} = require("../../middleware/checkData")


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
    checkIdx("page"),
    getMyTrackingImg
)

// 다른 사용자의 전체 트래킹 이미지 가져오기
// 이거 페이지네이션 안함???
router.get("/account/:user_idx",
    checkIdx("page"),
    checkData("account.user","user_idx"),
    getUserTrackingImg
)

// 나의 트래킹 이미지 삭제
router.delete("/",
    checkIdxList("idxList"),
    checkSetData("idxList"),
    deleteTrackingImg
)

// 트래킹 라인 가져오기
router.get("/:tracking_idx",
    checkTrackingIdxData(),
    getTrackingLine
)

// 트래킹 이미지 공유 상태로 변경
router.put("/tosharing",
    checkSetData("idxList"),
    putToSharingTrackingImg
)

// 트래킹 이미지 비공유 상태로 변경
router.put("/toNotSharing",
    checkSetData("idxList"),
    putToNotSharingTrackingImg
)

// 트래킹 이미지 수정
router.put("/:tracking_idx",
    checkTrackingIdxData(),
    putTrackingImage
)


module.exports = router 
