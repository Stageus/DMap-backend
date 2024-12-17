const router = require("express").Router()

const {regColor,searchPoint} = require("../../constant/regx")
const {checkRegInput,checkIdx,checkZoom,checkHeading,checkSharing,checkThickness,checkBackground,checkLine,checkCenter} = require("../../middleware/checkInput")
const {checkData,checkSetData,checkLike,checkNotLike} = require("../../middleware/checkData")

const {postLikeTrackingImg,deleteLikeTrackingImg,getWhatTrackingImage,getRecentTrackingImg} = require("./service")

// SNS 페이지 기본 트래킹 이미지들 가져오기 ( 24시간 좋아요 순 )
router.get("/list/default",

)
// SNS 페이지 전체 좋아요 순 트래킹 이미지들 가져오기
router.get("/list/like",

)
// SNS 페이지 최신 순 트래킹 이미지들 가져오기
router.get("/list/recent",
    getRecentTrackingImg
)
// SNS 페이지 특정 트래킹 이미지 가져오기
router.get("/tracking-image/:idx",
    getWhatTrackingImage
)
// 트래킹 이미지 좋아요
router.post("/like",
    // checkLike,
    postLikeTrackingImg
)
// 트래킹 이미지 좋아요 삭제
router.delete("/like",
    // checkNotLike,
    deleteLikeTrackingImg
)

router.get("/test", (req, res) => {
    res.send("Tracking 라우터 정상 작동");
});

module.exports = router 