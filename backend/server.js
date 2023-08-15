const watchwoman = require("./middleware/watchwoman");
const generateToken = require("./config/generateToken");
const jwt = require("jsonwebtoken");

const express = require("express");
var cors = require("cors");
const app = express();
const PORT = 802; // give any port no u want
const mysql = require("mysql2");
const cookieParser = require("cookie-parser");

const router = express.Router();

app.use(express.json());

app.use(cors());

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

app.get("/message/bhai", (req, res) => {
  res.status(201).json({
    message: "Hello",
  });
});

app.post("/user/signup", (req, res) => {
  console.log("i am inside signup code");
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
  console.log("i am inside signin code");
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

app.post("/admin/addproduct", (req, res) => {
  const { productname, description, price, category } = req.body;
  console.log(productname, description, price, category);

  con.connect((error) => {
    if (error) {
      throw error;
    } else {
      sql3 = `insert into eshop.addproduct (productname, description,price,category) values( '${productname}' , '${description}', '${price}','${category}')`;

      con.query(sql3, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");

        res.status(201).json({
          message: "1 product add",
        });
      });
    }
  });
});

app.get(
  "/user/products",
  (req, res, next) => {
    if (!req.headers.token) {
      // if ke andar ghusa iska matlab hai ki token available nahi hai
      //to yahi pe me res me erro bhej duga
      res.status(400).json({
        message: "please login to access products",
      });  
    } else {
      const token = req.headers.token;
      console.log("token is ",token)

      const decoded = jwt.verify(token, "this is the salt to my jwt");

      console.log(decoded);

      //see whenever a user is logged in, localstorage me hamesha userinfo rahega hi rahega...
      // to iska matlab hai ki jabhi bhi vo product vala GET req karga uske headers me token rahega hi rahega..to middleware me humlog yahi check karlege ki agar token present hai iska matlanb user logged in hai and apun next() call kardege.

      next();
    }
  },
  (req, res) => {
    var sql4 = `SELECT * FROM eshop.addproduct`;
    con.query(sql4, function (err, result) {
      if (err) throw err;

      res.status(201).json(result);
    });
  }
);

app.listen(PORT, () => {
  console.log("The server is running on port", PORT);
});
