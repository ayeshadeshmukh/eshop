const mysql = require("mysql2/promise"); // Note the use of the promise version
const asyncHandler = require("express-async-handler");

const getcartdetails = asyncHandler(async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "eshop",
      port: 3307,
    });

    const sql = `SELECT * FROM eshop.addcart`;
    const [result] = await connection.execute(sql);

    const myresult = [];
    for (let i = 0; i < result.length; i++) {
      const pid = result[i].productID;
      const quantity = result[i].quantity;
      const productSql = `SELECT * FROM eshop.addproduct WHERE productID = '${pid}'`;

      const [productResult] = await connection.execute(productSql);

      const details = {
        detail: productResult[0],
        quantity: quantity,
      };

      myresult.push(details);
    }

    res.status(200).json(myresult);

    await connection.end(); // Close the database connection
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

module.exports = getcartdetails;
