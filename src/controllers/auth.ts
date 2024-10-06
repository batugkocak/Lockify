import { Request, Response } from "express";
import { User } from "../models/user";
import { ApiResponse, ErrorResponse, SuccessResponse } from "../utils/response";
import { AppError } from "../utils/appError";
import AuthUtil from "../auth/AuthUtil";
import { HTTP_STATUS } from "../constants/httpCodes";

export const createUser = async (req: Request, res: Response): Promise<any> => {
  const { email, username, password, roles } = req.body;
  const errors = [];

  const existingUser = await findUser(email, username);

  if (existingUser) {
    const errors = [];
    if (existingUser.email === email)
      errors.push("There is already a user registered with this email.");
    if (existingUser.username === username)
      errors.push("There is already a user registered with this username.");
    return new ErrorResponse(
      "Invalid credentials.",
      HTTP_STATUS.BAD_REQUEST,
      errors
    ).send(res);
  }

  const passwordHash = await AuthUtil.createHashedPassword(password);
  const newUser = new User({
    email,
    username,
    passwordHash,
    roles: roles || ["user"],
  });

  await newUser.save();

  return new SuccessResponse(
    { email, username, roles },
    "User created.",
    HTTP_STATUS.CREATED
  ).send(res);
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, username, password } = req.body;

  if (!email && !username) {
    return new ErrorResponse(
      "Please provide either an email or a username.",
      HTTP_STATUS.BAD_REQUEST
    ).send(res);
  }

  try {
    const user = await findUser(email, username);

    if (!user) {
      return new ErrorResponse(
        "Invalid credentials.",
        HTTP_STATUS.UNAUTHORIZED
      ).send(res);
    }

    const PasswordValid = await AuthUtil.comparePasswords(
      password,
      user.passwordHash
    );

    if (!PasswordValid) {
      return new ErrorResponse(
        "Invalid credentials.",
        HTTP_STATUS.UNAUTHORIZED
      ).send(res);
    }

    const token = AuthUtil.createJWT(String(user._id), user.email, user.roles);

    return new SuccessResponse(
      { token: token },
      "Login successful.",
      HTTP_STATUS.OK
    ).send(res);
  } catch (error) {
    return new ErrorResponse(
      "Error during login.",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    ).send(res);
  }
};

const findUser = async (email: string, username: string) => {
  return await User.findOne({
    $or: [{ email }, { username }],
  });
};
