const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "eshop",
  port: 3307,
  connectionLimit: 20,
});

const addproduct = async (req, res) => {
  try {
    const { productname, description, price, category, productID } = req.body;
    console.log(productname, description, price, category, productID);
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : "";
    console.log("Uploaded image path is", imagePath);

    const connection = await pool.getConnection();

    try {
      const sql = `INSERT INTO eshop.addproduct (productname, description, price, category, productID, imagePath) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [
        productname,
        description,
        price,
        category,
        productID,
        imagePath,
      ];

      connection.execute(sql, values, (err, result) => {
        if (err) {
          throw err;
        }
        console.log("1 product added in the database");

        res.status(201).json({
          message: "1 product added",
        });
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

module.exports = addproduct;
