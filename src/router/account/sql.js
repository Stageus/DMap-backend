// 체크 sql문 ---------------------------------
const checkNickNameSql = "SELECT * FROM account.list WHERE nickname=$1;";

// 회원가입 sql문 --------------------------------
const postAccountGoogleSql =
  "INSERT INTO account.list (google_user_id, nickname) VALUES ($1, $2);";
const postAccountKakaoSql =
  "INSERT INTO account.list (kakao_user_id, nickname) VALUES ($1, $2);";
const postAccountNaverSql =
  "INSERT INTO account.list (naver_user_id, nickname) VALUES ($1, $2);";

// 리프레쉬토큰 관련 sql문 -------------------------------------------
const getRefreshTokenSql =
  "SELECT expires_at FROM account.list WHERE refresh_token = $1;";
const putRefreshTokenSql =
  "UPDATE account.list SET refresh_token=$1, expires_at=$2 WHERE idx=$3;";

// 회원 정보 가져오기 sql문 ------------------------------------------
const getAccountSql =
  "SELECT idx, nickname, image FROM account.list WHERE idx=$1;";
const getUserIdxGoogleSql =
  "SELECT idx FROM account.list WHERE google_user_id=$1;";
const getUserIdxKakaoSql =
  "SELECT idx FROM account.list WHERE kakao_user_id=$1;";
const getUserIdxNaverSql =
  "SELECT idx FROM account.list WHERE naver_user_id=$1;";

// 회원 정보 변경 sql문 -------------------------------------------
const putNicknameSql = "UPDATE account.list SET nickname=$1 WHERE idx=$2;";
const putImageSql = "UPDATE account.list SET image=$1 WHERE idx=$2;";

// 회원 탈퇴 sql문 -------------------------------------------------
const deleteAccountSql = "DELETE FROM account.list WHERE idx=$1;";

module.exports = {
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
};
