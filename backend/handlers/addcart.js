const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "eshop",
  port: 3307,
});

const addcart = (req, res) => {
  const { productid } = req.body;

  console.log("add to cart");

  con.connect((error) => {
    if (error) {
      throw error;
    } else {
      var sql = `Select * from addcart where productID = ${productid}`;

      con.query(sql, function (err, result) {
        if (err) throw err;

        if (result.length == 0) {
          sql = `insert into eshop.addcart (productID,quantity) values( '${productid}', '${1}')`;

          con.query(sql, function (err, result) {
            if (err) throw err;
            else {
              res.status(201).json({
                message: "One product added in cart",
              });
            }
          });
        } else {
          sql = `SELECT * from eshop.addcart where productID = '${productid}'`;

          con.query(sql, function (err, result) {
            if (err) throw err;
            else {
              let quant = parseInt(result[0].quantity) + 1;
              sql = `UPDATE eshop.addcart SET quantity = '${quant}' WHERE productID = '${productid}'`;

              con.query(sql, function (err, result) {
                if (err) throw err;
                else {
                  res.status(201).json({
                    message: "Quantity updated",
                  });
                }
              });
            }
          });
        }
      });
    }
  });
};

module.exports = addcart;
