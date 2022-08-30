import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import jsonwebtoken, { JwtPayload } from "jsonwebtoken";

const pathToPrivateKey = path.join(__dirname, "..", "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, "utf-8");
const pathToPublicKey = path.join(__dirname, "..", "..", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPublicKey, "utf-8");

export interface JwtRequest extends Request {
  jwt?: string | JwtPayload;
}

const authMiddleware = (req: JwtRequest, res: Response, next: NextFunction) => {
  const tokenParts = req.headers.authorization!.split(" ");
  if (
    tokenParts[0] === "Bearer" &&
    tokenParts[1].match(/\S+\.\S+\.\S+/) !== null
  ) {
    try {
      const verification = jsonwebtoken.verify(tokenParts[1], PUB_KEY, {
        algorithms: ["RS256"],
      });
      req.jwt = verification;
      next();
    } catch (err) {
      res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
  } else {
    res.status(401).json({ success: false, message: "You are not authorized" });
  }
};

export default authMiddleware;
