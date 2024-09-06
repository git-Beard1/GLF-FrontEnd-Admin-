require("dotenv").config();
const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWTKey;

module.exports.verifyToken = (req, res, next) => {
  if (typeof req.headers.authorization !== "undefined") {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, jwtKey, (err, data) => {
      if (err) {
        console.log('Error when verifying jwt token',err);
        return res.status(401).json({ message: "Not Authorized" });
      } else {
        res.locals.userId = data.id;
        res.locals.role = data.role;
        console.log(`Successful token verification for ${data.id}`);
        next();
      }
    });
  } else {
    return res.status(403).send({ message: "Unauthorized access" });
  }
};

module.exports.verifyAdminOrEventManager = (req, res, next) => {
  if (res.locals.role === "Admin" || res.locals.role === "Event Manager") {
    console.log("verify admin or event manager success");
    next();
  } else {
    console.log("verify admin or event manager failed");
    return res.status(403).send({ message: "Unauthorized access" });
  }
};

module.exports.verifyAdmin = (req, res, next) => {
  if (res.locals.role === "Admin") {
    console.log("verify admin success");
    next();
  } else {
    return res.status(403).send({ message: "Unauthorized access" });
  }
};
