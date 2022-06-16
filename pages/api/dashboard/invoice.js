const sql = require("mssql");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

export default async (req, res) => {
	const rawCookie = req.headers.cookie || "";
	const cookies = cookie.parse(rawCookie);
	const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
	let pool = new sql.ConnectionPool(process.env.SERVER2);
	const qry = `select SUM(F_InvoiceAmt-F_PaidAmt) as pending from V_JWI_ACCT where PIC='${token.fsid}' AND F_InvoiceAmt-F_PaidAmt!='0' AND F_TBName='T_INVOHD';`;
	try {
		await pool.connect();
		let result = await pool.request().query(qry);
		res.json(result.recordset);
	} catch (err) {
		res.json(err);
	}
	return pool.close();
};

export const config = {
	api: {
		externalResolver: true,
	},
};
