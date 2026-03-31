import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // ✅ Get token from header
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    // ✅ Remove "Bearer "
    const cleanToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    // ✅ Verify token
    const decoded = jwt.verify(cleanToken, "secretkey");

    // ✅ Attach user to request
    req.user = decoded;

    next();

  } catch (error) {
    console.log("AUTH ERROR 👉", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;