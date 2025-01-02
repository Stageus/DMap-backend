const checkAccountSql = "SELECT * FROM account.list WHERE naver_user_id=$1";

const checkNickNameSql = "SELECT * FROM account.list WHERE nickname=$1";

const postAccountSql =
  "INSERT INTO account.list (google_user_id, kakao_user_id, naver_user_id, refresh_token, nickname, image) VALUES (NULL, NULL, $1, $2, $3, NULL);";

module.exports = { checkAccountSql, checkNickNameSql, postAccountSql };
