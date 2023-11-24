const mysql = require("mysql2/promise");
const asyncHandler = require("express-async-handler");

const updatequantity = asyncHandler(async (req, res) => {
  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "eshop",
      port: 3307,
    });

    const productid = req.query.productID;
    const quantity = req.query.quantity;
    console.log(productid, quantity);
    const sql = `UPDATE addcart SET quantity = ? WHERE productID = ?`;

    const [result] = await connection.execute(sql, [quantity, productid]);

    if (result.affectedRows > 0) {
      res.status(200).json({
        message: "Quantity updated",
      });
    } else {
      res.status(404).json({
        message: "No matching item found to update",
      });
    }

    await connection.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

module.exports = updatequantity;
