const router = require("express").Router()

// 트래킹 이미지 생성
router.post("/",

)

// 나의 트래킹 이미지 가져오기
router.get("/",

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