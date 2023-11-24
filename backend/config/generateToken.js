const jwt = require("jsonwebtoken");
const secret = "this is the salt to my jwt";

const generateToken = (id) => {
  return jwt.sign({ id }, secret);
};

module.exports = generateToken;
