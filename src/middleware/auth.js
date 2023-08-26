// const jwt = require("jsonwebtoken");
const { Buffer } = require("node:buffer");
const { createToken, signToken } = require("../helpers/jwt");

function getCartId(cookie) {
  try {
    const match = cookie.match(new RegExp("(^| )" + "token" + "=([^;]+)"));
    if (match) return match[2];
    return null;
  } catch (error) {
    return null;
  }
}

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!!!token) return res.status(401).send("Access denied.");
  const payload = signToken(token);
  if (!payload) {
    if (!!!req.headers.apptoken) return res.status(403).send("Invalid token.");
    const plain = Buffer.from(req.headers.apptoken, "base64").toString("utf8");
    const { enterpriseId, keyId, type } = JSON.parse(plain);
    if (!!!enterpriseId || !!!keyId || !!!type)
      return res.status(403).send("Invalid appToken");
    const refreshToken = createToken(enterpriseId, keyId, type);
    const oldToken = getCartId(req.headers.cookie);
    const newCookie = req.headers.cookie.replace(
      `token=${oldToken};`,
      `token=${refreshToken};`
    );
    res.header("refresh-token", refreshToken);
    res.header("set-cookie", newCookie);
    req.refreshToken = refreshToken;
    req.enterpriseId = enterpriseId;
    req.type = type;
    req.keyId = keyId;
    return next();
  }
  const { enterpriseId, keyId, type } = payload;
  req.enterpriseId = enterpriseId;
  req.type = type;
  req.keyId = keyId;
  next();
}

module.exports = {
  authenticateToken,
};
