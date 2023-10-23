const watchwoman = require("./middleware/watchwoman");
const generateToken = require("./config/generateToken");
const jwt = require("jsonwebtoken");

// const bodyParser = require("body-parser");

const multer = require("multer");

const express = require("express");
var cors = require("cors");
const app = express();
const PORT = 802; // give any port no u want
const mysql = require("mysql2");
const cookieParser = require("cookie-parser");

const router = express.Router();

app.use(express.json());

app.use(cors());

app.use("/uploads", express.static("uploads"));
// app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "eshop",
  port: 3307,
});

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// app.get(endpoint, callback_function);   //
// Serve static files from the "uploads" folder

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Destination folder for uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// Serve static files
app.use(express.static("uploads"));

app.get("/message/isworking", (req, res) => {
  res.status(201).json({
    message: "Hello, the server is workingh !!!",
  });
});

app.post("/user/signup", (req, res) => {
  console.log("/user/signup endpoint hitted");
  // const myname = req.body.name
  // console.log(myname)
  const { name, phone, email, password, cpassword } = req.body;
  console.log(name, phone, email, password, cpassword);

  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");

    var sql1 = `SELECT * FROM eshop.signup where email = "${email}" or phone ="${phone}";`;
    con.query(sql1, function (err, result) {
      if (err) throw err;
      if (result.length == 0) {
        var sql2 = `INSERT into signup (name,phone, email, password) VALUES ("${name}", "${phone}","${email}","${password}");`;

        con.query(sql2, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");

          res.status(201).json({
            message: "1 record inserted",
          });
        });
      } else {
        res.status(201).json({
          message: "User already exist",
        });
      }
      //con.query ends here
    });
    //con.connect ends here
  });

  //post request ends here
});

app.post("/user/signin", (req, res) => {
  console.log("/user/signin endpoint hitted");
  // const myname = req.body.name
  // console.log(myname)
  const { email, password } = req.body;
  console.log(email, password);

  var sql = `SELECT *FROM eshop.signup WHERE email = "${email}" `;
  con.connect((error) => {
    if (error) {
      throw error;
    }

    con.query(sql, (err, result) => {
      if (err) {
        throw error;
      }

      if (result.length == 0) {
        res.status(201).json({
          error: "User does not exists",
        });
      }

      console.log(result); //here we get the row of that email from the database [result gives us an array from database it has password on index no 1 we have to match it to the password which we have got from frontend i.e from req.body ]
      //post and get request always send  url , header, data
      //in header we send a key/token so that the backend will see if that person is authorized or not

      if (result[0].password == password) {
        res.status(201).json({
          name: result[0].name,
          phone: result[0].phone,
          email: result[0].email,
          token: generateToken(result[0].email),
        });
      }
    });
  }); //
});

app.post("/admin/addproduct", upload.single("image"), (req, res) => {
  const { productname, description, price, category, productID } = req.body;
  console.log(productname, description, price, category, productID);
  const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : "";
  console.log("uploaded image path is ", imagePath);
  con.connect((error) => {
    if (error) {
      throw error;
    } else {
      sql3 = `insert into eshop.addproduct (productname, description,price,category,productID,imagePath) values( '${productname}' , '${description}', '${price}','${category}', '${productID}', '${imagePath}')`;

      con.query(sql3, function (err, result) {
        if (err) throw err;
        console.log("1 product added in database");

        res.status(201).json({
          message: "1 product add",
        });
      });
    }
  });
});

app.get("/user/products", watchwoman, (req, res) => {
  var sql4 = `SELECT * FROM eshop.addproduct`;
  con.query(sql4, function (err, result) {
    if (err) throw err;

    res.status(201).json(result);
  });
});

app.post("/user/addcart", (req, res) => {
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
              console.log(result);

              let quant = parseInt(result[0].quantity) + 1;
              sql = `UPDATE eshop.addcart SET quantity = '${quant}' WHERE productID = '${productid}'`;

              con.query(sql,  function(err,result){
                if (err) throw err;
                else{
                 res.status(201).json({
                  message : "Quantity updated"
                 })

                }
              })
            }

             
             

          });


        }
      });
    }
  });
});

app.get("/user/getcartdetails", (req, res) => {
  const sql = `SELECT * from eshop.addcart`;

  con.connect((error) => {
    if (error) {
      throw error;
    } else {
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);

        const myresult = [];
        let count = 0;

        for (let i = 0; i < result.length; i++) {
          const pid = result[i].productID;
          const quantity = result[i].quantity;
          const productSql = `SELECT * from eshop.addproduct  where productID = '${pid}' `;

          con.query(productSql, function (err, productResult) {
            if (err) {
              console.error(err);
              res.status(500).send("An error occurred.");
              return;
            }

            const details = {
              detail: productResult[0],
              quantity: quantity,
            };

            console.log(details);

            myresult.push(details);

            count++; // Increment the count for each query completed

            if (count === result.length) {
              // All queries are done
              res.status(201).json(myresult);
            }
          });
        }
      });
    }
  });
});

//app.get("end point" , handler)  --bare minimum api syntax

//app.post("end point" , middleware, handler)    --using middleware

app.listen(PORT, () => {
  console.log("The server is running on port", PORT);
});
