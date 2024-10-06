import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request } from "express";
import { AuthConfig } from "../configs";
import { AppError } from "../utils/appError";
import { HTTP_STATUS } from "../constants/httpCodes";

interface JwtPayload {
  userId: string;
  name: string;
}

const AuthUtil = {
  createHashedPassword: async function (password: string): Promise<string> {
    const salt = await bcrypt.genSalt(AuthConfig.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },

  createJWT: function (userId: string, email: string, roles: string[]): string {
    if (!AuthConfig.tokenSecret) {
      throw new AppError(
        "Token secret is not defined",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    return jwt.sign({ userId, email, roles }, AuthConfig.tokenSecret, {
      expiresIn: AuthConfig.tokenLifetime,
    });
  },

  comparePasswords: async function (
    candidatePassword: string,
    hash: string
  ): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hash);
  },

  validateJWT: function (token: string): JwtPayload {
    if (!AuthConfig.tokenSecret) {
      throw new AppError(
        "Token secret is not defined",
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
    try {
      return jwt.verify(token, AuthConfig.tokenSecret) as JwtPayload;
    } catch (err) {
      throw new AppError("Authentication invalid", HTTP_STATUS.UNAUTHORIZED);
    }
  },

  extractTokenFromRequest(req: Request): string {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.split(" ")[1];
    }
    throw new AppError("Authentication invalid", HTTP_STATUS.UNAUTHORIZED);
  },

  async getUserIDFromToken(token: string): Promise<string> {
    try {
      const decodedToken = this.validateJWT(token);
      return decodedToken.userId;
    } catch (err) {
      throw new AppError("Authentication invalid", HTTP_STATUS.UNAUTHORIZED);
    }
  },
};

export default AuthUtil;
