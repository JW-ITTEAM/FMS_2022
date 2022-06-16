const sql = require("mssql");

export default async (req, res) => {
	let pool = new sql.ConnectionPool(process.env.SERVER21);
	const qry = `INSERT INTO T_BOARD_COMMENT VALUES (${req.body});`;
	try {
		await pool.connect();
		let result = await pool.request().query(qry);
		res.json(result.recordsets[0]);
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
