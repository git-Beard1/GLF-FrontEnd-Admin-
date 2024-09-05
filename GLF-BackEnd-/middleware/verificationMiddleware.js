const { query } = require("../database");
const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  console.log("http header - user ", req.headers["user"]);
  if (typeof req.headers.authorization !== "undefined") {
    let token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWTKey, (err, data) => {
      console.log("data extracted from token \n", data);
      if (err) {
        console.log(err);
        return res.status(401).json({ message: "Not Authorized" });
      } else {
        // req.body.userId = data.id;
        // req.body.role = data.role;
        res.locals.userId = data.id;
        res.locals.role = data.role;
        next();
      }
    });
  } else {
    res.status(403).send({ message: "Unauthorized access" });
  }
};

module.exports.verifyAdminOrEventManager = (req, res, next) => {
  if (res.locals.role === "Admin" || res.locals.role === "EventManager") {
    next();
  } else {
    res.status(403).send({ message: "Unauthorized access" });
  }
};

module.exports.verifyAdmin = (req, res, next) => {
  if (res.locals.role === "Admin") {
    next();
  } else {
    res.status(403).send({ message: "Unauthorized access" });
  }
};
