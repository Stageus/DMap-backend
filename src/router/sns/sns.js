const router = require("express").Router()

const {regColor,searchPoint} = require("../../constant/regx")
const {checkRegInput,checkIdx,checkZoom,checkHeading,checkSharing,checkThickness,checkBackground,checkLine,checkCenter} = require("../../middleware/checkInput")
const {checkData,checkSetData,checkLike,checkNotLike} = require("../../middleware/checkData")

const {postLikeTrackingImg,deleteLikeTrackingImg,getWhatTrackingImage,getRecentTrackingImg,getLikeCountTrackingImg} = require("./service")


// SNS 페이지 기본 트래킹 이미지들 가져오기 ( 24시간 좋아요 순 )
router.get("/list/default",

)
// SNS 페이지 전체 좋아요 순 트래킹 이미지들 가져오기
router.get("/list/like",
    checkIdx("page"),
    getLikeCountTrackingImg
)
// SNS 페이지 최신 순 트래킹 이미지들 가져오기
router.get("/list/recent",
    checkIdx("page"),
    getRecentTrackingImg
)

// SNS 페이지 특정 트래킹 이미지 가져오기
router.get("/tracking-image/:idx",
    checkIdx("idx"),
    getWhatTrackingImage
)
// 트래킹 이미지 좋아요
router.post("/like",
    checkIdx("user_idx"),
    checkIdx("idx"),
    // checkData("account.user","idx"),
    checkLike(),
    postLikeTrackingImg
)
// 트래킹 이미지 좋아요 삭제
router.delete("/like",
    checkIdx("user_idx"),
    checkIdx("idx"),
    // checkData("account.user","idx"),
    checkNotLike(),
    deleteLikeTrackingImg
)

module.exports = router 