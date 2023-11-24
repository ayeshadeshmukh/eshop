const mysql = require("mysql2/promise");
const sendEmail = require("../nodeMailer/NodeMailer");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "eshop",
  port: 3307,
  connectionLimit: 20,
});

const signup = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    console.log(name, phone, email, password);

    const connection = await pool.getConnection();

    try {
      console.log("/user/signup endpoint hit");

      const [rows] = await connection.query(
        "SELECT * FROM eshop.signup WHERE email = ? OR phone = ?",
        [email, phone]
      );

      if (rows.length === 0) {
        const [result] = await connection.query(
          "INSERT INTO signup (name, phone, email, password) VALUES (?, ?, ?, ?)",
          [name, phone, email, password]
        );

        console.log("1 record inserted");

        sendEmail(email, "welcome", "Thankyou for registering with us");
        res.status(201).json({
          message: "1 record inserted",
        });
      } else {
        res.status(201).json({
          message: "User already exists",
        });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

module.exports = signup;
