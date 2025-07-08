import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
// Xac thuc token de bt user nay co quyen j
interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const validateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;
    let authHeader: string | undefined =
      (req.headers.Authorization as string) ||
      (req.headers.authorization as string);
    if (authHeader && authHeader.startsWith("Bearer")) {
      token = authHeader.split(" ")[1];

      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
        (
          err: jwt.VerifyErrors | null,
          decoded: string | JwtPayload | undefined
        ) => {
          if (err) {
            return res.status(401).json({ message: "Invalid token" });
          }
          req.user = decoded;
          next();
        }
      );
    }
    if (!token) {
      res
        .status(401)
        .json({ message: "User is not authorized or token is missing" });
      return;
    }
  } catch (error) {
    console.error("Error in validateToken middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
