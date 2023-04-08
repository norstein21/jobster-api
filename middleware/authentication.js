const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authCheck = async (req, res, next) => {
  const headerAuth = req.headers.authorization;
  if (!headerAuth || !headerAuth.startsWith("Bearer")) {
    throw new UnauthenticatedError("No token exists");
  }
  const token = headerAuth.split(" ")[1];
  try {
    const checkAuth = jwt.verify(token, process.env.JWT_SECRET);
    const { userID, email } = checkAuth;
    req.user = { userID, email };
    next();
  } catch (err) {
    throw new UnauthenticatedError(err);
  }
  //kalau check berhasil lanjut ke function berikutnya
};

module.exports = authCheck;
