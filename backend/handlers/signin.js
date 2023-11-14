const mysql = require("mysql2/promise");
const sendEmail = require("../nodeMailer/NodeMailer");
const generateToken = require("../config/generateToken")
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "eshop",
  port: 3307,
  connectionLimit: 20, // Adjust the connection limit as needed
});

const signin = async (req, res) => {
  try {
    console.log("/user/signin endpoint hit");
    const { email, password } = req.body;
    console.log(email, password);

    const connection = await pool.getConnection();

    try {
      var sql = `SELECT * FROM eshop.signup WHERE email = ?`;
      const [rows] = await connection.query(sql, [email]);

      if (rows.length === 0) {
        res.status(201).json({
          error: "User does not exist",
        });
      } else {
        const user = rows[0];
        if (user.password === password) {
          res.status(201).json({
            name: user.name,
            phone: user.phone,
            email: user.email,
            token: generateToken(user.email), // You need to implement generateToken function
          });
        } else {
          res.status(201).json({
            error: "Invalid password",
          });
        }
      }
    } finally {
      connection.release(); // Release the connection back to the pool
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

module.exports = signin;
