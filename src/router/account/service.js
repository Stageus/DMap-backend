const crypto = require("crypto");
const axios = require("axios");
const client = require("./../../database/postgreSQL");
const {
  checkNickNameSql,

  postAccountGoogleSql,
  postAccountKakaoSql,
  postAccountNaverSql,

  getAccountSql,
  getUserIdxGoogleSql,
  getUserIdxKakaoSql,
  getUserIdxNaverSql,

  getRefreshTokenSql,
  putRefreshTokenSql,

  putNicknameSql,
  putImageSql,

  deleteAccountSql,
} = require("./sql");
const customError = require("./../../util/customError");

// 네이버 OAuth2---------------------------------------------------------------------------------
const getNaverLoginPage = () => {
  const state = crypto.randomBytes(16).toString("hex"); // CSRF 방지용 상태값
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${
    process.env.NAVER_CLIENT_ID
  }&redirect_uri=${encodeURIComponent(
    process.env.NAVER_REDIRECT_URL
  )}&state=${state}`;
  return naverAuthUrl;
};

const naverLoginRedirectLogic = async (code, state) => {
  const tokenResponse = await axios.post(
    "https://nid.naver.com/oauth2.0/token",
    null,
    {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        code: code,
        state: state,
      },
    }
  );

  const naverAccessToken = tokenResponse.data.access_token;

  const userResponse = await axios.get("https://openapi.naver.com/v1/nid/me", {
    headers: {
      Authorization: `Bearer ${naverAccessToken}`,
    },
  });

  return userResponse.data.response.id;
};

// 계정확인-------------------------------------------------------------------------
const getUserIdxLogic = async (platform, id) => {
  let result = null;

  if (platform == "GOOGLE") {
    result = await client.query(getUserIdxGoogleSql, [id]);
  } else if (platform == "KAKAO") {
    result = await client.query(getUserIdxKakaoSql, [id]);
  } else if (platform == "NAVER") {
    result = await client.query(getUserIdxNaverSql, [id]);
  }

  if (result.rows.length > 0) {
    return result.rows[0].idx; // idx를 반환
  } else {
    return null;
  }
};

// token관련---------------------------------------------------------------------
const jwt = require("jsonwebtoken");

const setAccessToken = (userIdx) => {
  const accessToken = jwt.sign(
    {
      idx: userIdx,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "2h",
    }
  );
  return accessToken;
};

const setRefreshToken = (userIdx) => {
  const refreshToken = jwt.sign({}, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "3d",
  });
  return refreshToken;
};

const isValidRefreshToken = async (refreshToken) => {
  const result = await client.query(getRefreshTokenSql, [refreshToken]);

  if (result.rows.length == 0)
    throw customError(403, "잘못된 리프레쉬 토큰입니다.");

  const expiresAt = new Date(result.rows[0].expires_at); // expires_at 필드 가져오기
  const now = new Date(); // 현재 시간 가져오기

  if (now >= expiresAt)
    throw customError(401, "리프레쉬 토큰이 만료되었습니다.");

  return true; // 유효한 경우 true 반환
};

const postRefreshTokenLogic = async (refreshToken, userIdx) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 3);
  const result = await client.query(putRefreshTokenSql, [
    refreshToken,
    expiresAt,
    userIdx,
  ]);
};

// 닉네임--------------------------------------------------------------------------
const { adjectives, nouns } = require("./../../constant/nickname");

const getRandomWord = (list) => {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};

const getNickNameLogic = async () => {
  // 만약에 경우의 수가 없는 상황도 생각을 해놓긴 해야한다.
  let checkVal = false;
  let nickName = null;

  while (!checkVal) {
    const randomNoun = getRandomWord(nouns);
    const randomAdjective = getRandomWord(adjectives);
    const randomNickname = randomAdjective + randomNoun;
    const result = await client.query(checkNickNameSql, [randomNickname]);
    if (result.rows.length == 0) {
      checkVal = true;
      nickName = randomNickname;
    }
  }

  return nickName;
};

// 계정생성---------------------------------------------------------------------------
const postAccountLogic = async (platform, id, nickName) => {
  if (platform == "GOOGLE") {
    const result = await client.query(postAccountGoogleSql, [id, nickName]);
  } else if (platform == "KAKAO") {
    const result = await client.query(postAccountKakaoSql, [id, nickName]);
  } else if (platform == "NAVER") {
    const result = await client.query(postAccountNaverSql, [id, nickName]);
  }
};

// 계정 정보 가져오기------------------------------------------------------------------
const getAccountInf = async (userIdx) => {
  const result = await client.query(getAccountSql, [userIdx]);
  const nickName = result.rows[0].nickname;
  const image = result.rows[0].image;

  return { userIdx, nickName, image };
};

// 회원 정보 변경------------------------------------------------------------------------
const putNicknameLogic = async (nickName, userIdx) => {
  const result = await client.query(putNicknameSql, [nickName, userIdx]);
};

const putImageLogic = async (imageUrl, userIdx) => {
  const result = await client.query(putImageSql, [imageUrl, userIdx]);
};

// 회원 탈퇴-----------------------------------------------------------------------------
const deleteAccountLogic = async (userIdx) => {
  const result = await client.query(deleteAccountSql, [userIdx]);
};

module.exports = {
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
};
