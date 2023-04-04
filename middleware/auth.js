const jwt = require("jsonwebtoken");

exports.validateAuth = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).send("Unauthorized Token!");
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).send("Unauthorized Token!");
  }
};
