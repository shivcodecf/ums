import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const token = req?.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    req.user = decoded;

    next(); // ✅ fixed
  } catch (error) {
    return res.status(401).json({
      // 🔥 better than 500
      success: false,
      message: "Unauthorized",
    });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "access denied",
      });
    }
    next();
  };
};
