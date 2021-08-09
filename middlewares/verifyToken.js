const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  async verifyToken(req, res, next) {
    try {
      if (req.headers["authorization"]) {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
          if (err) {
            res.status(401).json({ status: false, message: "Unauthorized" });
          } else if (decoded) {
            next();
          }
        });
      } else {
        res.status(403).json({ status: false, message: "Forbidden" });
      }
    } catch (err) {
      res.status(500).json({ status: false, message: err });
    }
  },
};
