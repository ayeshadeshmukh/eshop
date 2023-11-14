const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "eshop",
  port: 3307,
});

const deletefromcart = (req, res) => {
  const productid = req.query.productID;
  var sql = `Delete from addcart where productID = "${productid}"`;
  console.log(productid);

  try {
    con.connect((err) => {
      if (err) {
        throw err;
      } else {
        con.query(sql, function (err, result) {
          if (err) {
            throw err;
          } else {
            res.status(201).json({
              message: "1 item deleted from the cart",
            });
          }
        });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
};

module.exports = deletefromcart;
