const express = require("express")


const app = express()

const mergetest = "머지 테스트 입니다."
const conflicttest = "컨플릭트 테스트 입니다."

app.use(express.json())


app.listen(8000, () => {
    console.log("8000번 포트에서 웹 서버 실행")
})
