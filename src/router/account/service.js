const crypto = require("crypto");
const axios = require("axios");
const client = require("./../../database/postgreSQL");
const { checkAccountSql, checkNickNameSql, postAccountSql } = require("./sql");

// 네이버 OAuth2.0--------------------------------------------------------------------
const naverLoginPageLogic = () => {
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

// -------------------------------------------------------------------------
const checkAccountLogic = async (userIdx) => {
  const result = await client.query(checkAccountSql, [userIdx]);
  if (result.rows.length != 0) return true;
  else return false;
};

// token발급---------------------------------------------------------------------
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
  const refreshToken = jwt.sign(
    {
      idx: userIdx,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "3d",
    }
  );
  return refreshToken;
};

// 닉네임--------------------------------------------------------------------------
const { adjectives, nouns } = require("./../../constant/nickname");

const getRandomWord = (list) => {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
};

const randomNickNameLogic = async () => {
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

module.exports = {
  naverLoginPageLogic,
  naverLoginRedirectLogic,
  checkAccountLogic,
  setAccessToken,
  setRefreshToken,
  randomNickNameLogic,
};
