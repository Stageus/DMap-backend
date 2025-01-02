const router = require("express").Router();

const trycatchWrapper = require("../../module/trycatchWrapper");

const {
  checkAccountGoogleSql,
  checkAccountKakaoSql,
  checkAccountNaverSql,
  checkNickNameSql,
  postAccountGoogleSql,
  postAccountKakaoSql,
  postAccountNaverSql,
  postRefreshTokenSql,
} = require("./service");

router.get(
  "/naver/login",
  trycatchWrapper(async (req, res, next) => {
    naverLoginPageLogic();
    res.status(200).send();
  })
);

router.get(
  "/naver/redirect/login",
  trycatchWrapper(async (req, res, next) => {
    const { code, state } = req.query;

    try {
      const userId = await naverLoginRedirectLogic(code, state);

      const accessToken = jwt.sign(
        {
          id: userId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "2h",
        }
      );

      const refreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "3d",
      });

      res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      console.error("Error during Naver OAuth process:", error.message);
      res.status(500).json({ error: "OAuth process failed" });
    }
  })
);

module.exports = router;
