const watchwoman = require("./middleware/watchwoman");
const generateToken = require("./config/generateToken");
const jwt = require("jsonwebtoken");
const getcartdetails = require("./handlers/getcartdetails");
const updatequantity = require("./handlers/updatequantity");
const signup = require("./handlers/signup");
const signin = require("./handlers/signin");
const addproduct = require("./handlers/addproduct");
const products = require("./handlers/products");
const addcart = require("./handlers/addcart");
const deletefromcart = require("./handlers/deletefromcart");

const multer = require("multer");

const express = require("express");
var cors = require("cors");
const app = express();
const PORT = 802;
const mysql = require("mysql2");
const cookieParser = require("cookie-parser");

const router = express.Router();

app.use(express.json());

app.use(cors());

app.use("/uploads", express.static("uploads"));

app.use(cookieParser());

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "eshop",
  port: 3307,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.static("uploads"));

app.get("/message/isworking", (req, res) => {
  res.status(201).json({
    message: "Hello, the server is workingh !!!",
  });
});

app.post("/user/signup", signup);

app.post("/user/signin", signin);

app.post("/admin/addproduct", upload.single("image"), addproduct);

app.get("/user/products", watchwoman, products);

app.post("/user/addcart", addcart);

app.get("/user/getcartdetails", getcartdetails);

app.delete("/user/deletefromcart", deletefromcart);

app.put("/user/updatequantity", updatequantity);

app.listen(PORT, () => {
  console.log("The server is running on port", PORT);
});
