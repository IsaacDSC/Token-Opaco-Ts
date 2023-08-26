const express = require("express");
const { Buffer } = require("node:buffer");

const cors = require("cors");
const { authenticateToken } = require("./middleware/auth.js");
const { corsOptions } = require("./middleware/cors.js");
const { createToken } = require("./helpers/jwt.js");

const app = express();
const port = 3000;

app.use(express.json());

app.post("/generate-token", cors(corsOptions), (req, res) => {
  const { enterpriseId, keyId, type } = req.body;
  const token = createToken(enterpriseId, keyId, type);
  res.json({ token });
});

app.get("/protected", cors(corsOptions), authenticateToken, (req, res) => {
  res.send({
    alive: true,
  });
});

const buf = Buffer.from(
  JSON.stringify({
    enterpriseId: "123",
    keyId: "shortId",
    type: "short",
  }),
  "binary"
);
console.log({ buf: buf.toString("base64") });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
