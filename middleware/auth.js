import jwt from "jsonwebtoken";

export async function auth(req, res, next) {
  console.log("entre al auth")
  try {
    const token = req.header("Token");
    jwt.verify(token, process.env.SECRET);
    next();
  } catch (error) {
    res.status(401).send("error en auth middleware");
  }
}
