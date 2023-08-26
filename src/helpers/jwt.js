const jwt = require("jsonwebtoken");
const { secretKeyJWT } = require("../env/index.js");

function createToken(enterpriseId, keyId, type) {
  const token = jwt.sign(
    {
      enterpriseId,
      keyId,
      type,
    },
    secretKeyJWT,
    { expiresIn: "1h" }
  );
  return token;
}

function signToken(token) {
  try {
    return jwt.verify(token, secretKeyJWT);
  } catch (error) {
    return null;
  }
}

module.exports = {
  createToken,
  signToken,
};
