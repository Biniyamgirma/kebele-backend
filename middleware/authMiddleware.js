const { verifyToken } = require("../utils/utils");

const authmiddleware = (requiredRoles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    try {
      const decoded = verifyToken(token);
      const userRole = decoded.role;
      if (!requiredRoles.includes(userRole)) {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = authmiddleware;
