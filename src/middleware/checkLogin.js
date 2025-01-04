const customError = require("./../util/customError");
const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) throw customError("로그인 필요", 401);

    req.decoded = jwt.verify(authorization, process.env.ACCESS_TOKEN_SECRET);

    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      e.status = 401;
      e.message = "만료된 access token 입니다.";
    } else if (e.name === "JsonWebTokenError") {
      e.status = 403;
      e.message = "잘못된 access token 입니다.";
    }
    next(e);
  }
};

module.exports = checkLogin;
