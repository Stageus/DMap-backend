const router = require("express").Router()

const {regColor,searchPoint} = require("../../constant/regx")
const {checkRegInput,checkIdx,checkZoom,checkHeading,checkSharing,checkThickness,checkBackground,checkLine,checkCenter,checkCategory} = require("../../middleware/checkInput")
const {checkData,checkTrackingIdxData,checkSetData,checkLike,checkNotLike} = require("../../middleware/checkData")

const {postLikeTrackingImg,deleteLikeTrackingImg,getWhatTrackingImage,getRecentTrackingImg,getLikeCountTrackingImg,getDefaultSNSPage} = require("./service")

// SNS 페이지 기본 트래킹 이미지들 가져오기 ( 24시간 좋아요 순 )
router.get("/",
    checkCategory(),
    checkIdx("page"),
    getDefaultSNSPage
)

// SNS 페이지 특정 트래킹 이미지 가져오기
router.get("/tracking-image/:tracking_idx",
    checkIdx("user_idx"),
    checkTrackingIdxData(),
    getWhatTrackingImage
)

// 트래킹 이미지 좋아요
router.post("/like",
    checkIdx("user_idx"),
    checkIdx("tracking_idx"),
    checkTrackingIdxData(),
    checkLike(),
    postLikeTrackingImg
)
// 트래킹 이미지 좋아요 삭제
router.delete("/like",
    checkIdx("user_idx"),
    checkIdx("tracking_idx"),
    checkTrackingIdxData(),
    checkNotLike(),
    deleteLikeTrackingImg
)


module.exports = router 