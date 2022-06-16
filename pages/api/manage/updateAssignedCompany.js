const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
  const cookies = cookie.parse(req.headers.cookie);
  const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
  if (!token.admin) {
    res.status(401).send({ error: true, msg: "Unauthorized" });
    return;
  }
  const { uid, company, puid } = req.query;
  if (!uid || !company || !puid) {
    res.status(404).send({
      error: true,
      msg: "User not found! Please try again.",
    });
    return;
  }
  var qry = `UPDATE T_MEMBER_COMPANY SET USER_ID='${uid}', UPDATED=GETDATE() WHERE COMPANY_ID='${company}' AND USER_ID='${puid}';`;
  let pool = new sql.ConnectionPool(process.env.SERVER21);
  try {
    await pool.connect();
    await pool.request().query(qry);
    res
      .status(200)
      .send({ error: false, msg: `Assigned user updated successfully!` });
  } catch (err) {
    res.status(403).send({
      error: true,
      msg: err.originalError?.info?.message || "403 ERROR!",
    });
  }
  return pool.close();
};
