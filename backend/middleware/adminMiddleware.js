import User from "../models/User.js";

export const admin = async (req, res, next) => {
    //check if the user is admin
  if (req.user && req.user.role === "admin") {
    next(); // if yes allow access
  } else {
    res.status(403).json({ message: "Admin access required" });
  }
};
