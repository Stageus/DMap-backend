const router = require("express").Router();
const checkLogin = require("./../../middleware/checkLogin");
const trycatchWrapper = require("../../module/trycatchWrapper");
const { checkIdx } = require("./../../middleware/checkInput");

const {
  getNaverLoginPage,
  naverLoginRedirectLogic,

  getUserIdxLogic,

  getAccountInf,

  setAccessToken,
  setRefreshToken,
  isValidRefreshToken,
  postRefreshTokenLogic,

  getNickNameLogic,

  postAccountLogic,

  putNicknameLogic,
  putImageLogic,

  deleteAccountLogic,
} = require("./service");

router.get(
  "/login/naver",
  trycatchWrapper((req, res, next) => {
    res.redirect(getNaverLoginPage());
  })
);

router.get(
  "/login/redirect/naver",
  trycatchWrapper(async (req, res, next) => {
    const { code, state } = req.query;
    let accessToken;
    let refreshToken;
    let userIdx = null;

    const naverId = await naverLoginRedirectLogic(code, state);
    userIdx = await getUserIdxLogic("NAVER", naverId);

    if (userIdx) {
      console.log("a " + userIdx);
      accessToken = setAccessToken(userIdx);
      refreshToken = setRefreshToken(userIdx);
    } else {
      const nickName = await getNickNameLogic(); //회원가입 과정
      await postAccountLogic("NAVER", naverId, nickName);
      userIdx = await getUserIdxLogic("NAVER", naverId);
      console.log("b " + userIdx);

      accessToken = setAccessToken(userIdx);
      refreshToken = setRefreshToken(userIdx);
    }

    await postRefreshTokenLogic(refreshToken, userIdx);
    res
      .status(200)
      .send({ access_token: accessToken, refresh_token: refreshToken });
  })
);

router.get(
  "/me",
  checkLogin,
  trycatchWrapper(async (req, res, next) => {
    const { idx } = req.decoded;
    const { userIdx, nickName, imgUrl } = await getAccountInf(idx);
    res.status(200).send({
      idx: userIdx,
      nickname: nickName,
      image_url: imgUrl,
    });
  })
);

router.get(
  "/:idx",
  checkIdx("idx"),
  trycatchWrapper(async (req, res, next) => {
    const { idx } = req.params;
    const { nickName, imgUrl } = await getAccountInf(idx);
    res.status(200).send({
      nickname: nickName,
      image_url: imgUrl,
    });
  })
);

module.exports = router;
