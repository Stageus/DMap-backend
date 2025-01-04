const express = require("express");
const app = express();

require("dotenv").config();

app.use(express.json());

// =============== 라우터 =============

const accountRouter = require("./src/router/account/router");
app.use("/account", accountRouter);

// const trackingRouter = require("./src/router/tracking/router");
// app.use("/tracking", trackingRouter);

// const snsRouter = require("./src/router/sns/router");
// app.use("/sns", snsRouter);

// const searchRouter = require("./src/router/search/search")
// app.use("/search", searchRouter)

// ============== 공통 에러 핸들러 ===========

const notFoundMiddleware = require("./src/middleware/notFound");
app.use(notFoundMiddleware);

const errorHandlerMiddleware = require("./src/middleware/errorHandler");
app.use(errorHandlerMiddleware);

// app.use((err, req, res, next) => {
//   console.log("들어갑니다.");
//   console.error(err.stack);

//   res.status(err.status || 500).send({
//     message: err.message,
//   });
// });

// app.use((req, res, next) => {
//   res.status(404).send({
//     message: "연결 실패",
//   });
// });

// ===========================================

app.listen(8000, () => {
  console.log("8000번 포트에서 웹 서버 실행");
});
