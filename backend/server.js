const express = require("express");
var cors = require("cors");
const app = express();
const PORT = 802; // give any port no u want
const mysql = require("mysql2");
app.use(express.json());

app.use(cors());

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
});

app.post("/admin/addproduct" , (req,res)=>{
  
})

app.listen(PORT, () => {
  console.log("The server is running on port", PORT);
});
