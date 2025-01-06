const trycatchWrapper = require("./../module/trycatchWrapper");
const client = require("./../database/postgreSQL");
const customError = require("./../util/customError");

const checkDuplicate = (sql, message, valueList) => {
  return trycatchWrapper(async (req, res, next) => {
    const resultList = valueList.map(
      (elem) =>
        req.body[elem] ||
        req.query[elem] ||
        req.params[elem] ||
        req.decoded[elem]
    );

    const result = await client.query(sql, resultList);

    if (result.rows.length > 0) throw customError(message, 409);

    next();
  });
};

module.exports = checkDuplicate;
