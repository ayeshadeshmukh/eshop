const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "eshop",
  port: 3307,
  connectionLimit: 20,
});

const products = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    try {
      const results = await connection.execute(
        "SELECT * FROM eshop.addproduct"
      );
      res.status(200).json(results[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

module.exports = products;

// this code is due to following reason I understand that you're facing issues with the code. The problem is that you are mixing asynchronous code (await) with synchronous code (connection.query). In the code you provided, you are trying to use await with connection.query, which is a callback-based method and not promise-based.
