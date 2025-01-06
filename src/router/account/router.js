const router = require("express").Router();
const checkLogin = require("./../../middleware/checkLogin");
const trycatchWrapper = require("../../module/trycatchWrapper");
const { checkIdx, checkNickname } = require("./../../middleware/checkInput");
const checkDuplicate = require("./../../middleware/checkDuplicate");

const { checkNicknameSql } = require("./sql");

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

// 네이버 로그인
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

// 계정 정보 가져오기
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
  "/info/:idx",
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

// 회원탈퇴
router.delete(
  "/user",
  checkLogin,
  trycatchWrapper(async (req, res, next) => {
    const { idx } = req.decoded;

    await deleteAccountLogic(idx);
    res.status(200).send();
  })
);

// 닉네임
router.get(
  "/nickname",
  trycatchWrapper(async (req, res, next) => {
    let list = [];
    for (let i = 0; i < 10; i++) {
      const nickname = await getNickNameLogic();
      list.push(nickname);
    }
    res.status(200).send({
      nickname: list,
    });
  })
);

router.put(
  "/nickname",
  checkLogin,
  checkNickname("nickname"),
  checkDuplicate(checkNicknameSql, "중복된 닉네임입니다.", ["nickname"]),
  trycatchWrapper(async (req, res, next) => {
    const { idx } = req.decoded;
    const { nickname } = req.body;

    const result = await putNicknameLogic(nickname, idx);

    res.status(200).send({
      message: "닉네임 변경 성공",
    });
  })
);
module.exports = router;
