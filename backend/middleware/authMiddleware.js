import JWT from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res,next) => {
  let token;
  //check if Authorized token exists
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //if no token return not authorized
  if (!token)
    return res.status(401).json({ message: "Not authorized, no token" });

  try {
    //verify token
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    //fetch user from DB and attach the user
    req.user = await User.findById(decoded.id).select("-password");
    //call next to continue
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};
