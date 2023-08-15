const jwt = require("jsonwebtoken"); 

const watchwoman = (req, res, next )=>{
  console.log("Validation successful!")
  next();  
}  


module.export = watchwoman; 