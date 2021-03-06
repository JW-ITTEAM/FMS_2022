// * FRONT
// NAVBAR NOTIFICATION LIST - DISPLAY WHEN ICON CLICKED

const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const sql = require("mssql");

export default async (req, res) => {
  const rawCookie = req.headers.cookie || "";
  const cookies = cookie.parse(rawCookie);
  // VERIFY IF TOKEN IS VALID
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    let pool = new sql.ConnectionPool(process.env.SERVER21);
    // CONNECT TO DB
    try {
      await pool.connect();
      let result = await pool.request().query(
        `SELECT TOP 99 M.*, 
                    (SELECT F_FNAME FROM T_MEMBER MEM WHERE MEM.F_ID=M.F_UID) AS CREATOR 
                    FROM T_MESSAGE_RECIPIENT R JOIN T_MESSAGE M on M.F_ID=R.F_MESSAGEID 
                    WHERE R.F_READ=0 AND R.F_UID='${token.uid}' ORDER BY M.F_ID DESC;`
      );
      res.json(result.recordset);
    } catch (err) {
      res.json(err);
    }
    return pool.close();
  } catch (err) {
    res.status(500).send("NO TOKEN");
  }
};

export const config = {
  api: {
    externalResolver: true,
  },
};
