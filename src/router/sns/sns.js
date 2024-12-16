const router = require("express").Router()

const {regColor,searchPoint} = require("../../constant/regx")
const {checkRegInput,checkIdx,checkZoom,checkHeading,checkSharing,checkThickness,checkBackground,checkLine,checkCenter} = require("../../middleware/checkInput")
const {checkData,checkSetData} = require("../../middleware/checkData")

const {postLikeTrackingImg,deleteLikeTrackingImg} = require("./service")

// SNS 페이지 기본 트래킹 이미지들 가져오기 ( 24시간 좋아요 순 )
router.get("/list/default",

)
// SNS 페이지 전체 좋아요 순 트래킹 이미지들 가져오기
router.get("/list/like",

)
// SNS 페이지 최신 순 트래킹 이미지들 가져오기
router.get("/list/recent",

)
// SNS 페이지 특정 트래킹 이미지 가져오기
router.get("/tracking-image/:idx",

)
// 트래킹 이미지 좋아요
router.post("/like",
    postLikeTrackingImg
)
// 트래킹 이미지 좋아요 삭제
router.delete("/like",
    deleteLikeTrackingImg
)

module.exports = router 