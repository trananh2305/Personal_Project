import { Request, Response } from "express";
import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ms from "ms";
import { User } from "../types/user";

interface RegisterRequestBody {
  username: string;
  password: string;
  phone?: string;
  role?: string;
}

// đăng ký người dùng mới
const register = async (
  req: Request<unknown, unknown, RegisterRequestBody>,
  res: Response
) => {
  try {
    const { username, password, role, phone } = req.body;
    //   kiem tra trong database co email nay chua
    const userAvailable = await UserModel.findOne({ username });

    if (userAvailable) {
      res.status(400).json({ message: "User already registered" });
      return;
    }
    // Hash password

    const hashedPassword = await bcrypt.hash(password, 10);
    //   tao 1 user moi trong database
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      role,
      phone, // default role is 'user'
    });
    if (newUser) {
      res.status(201).json({ message: "Create user successfully!", newUser });
    } else {
      res.status(400).json({ message: "User data is not valid" });
    }
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

const login = async (
  req: Request<unknown, unknown, { username: string; password: string }>,
  res: Response
) => {
  try {
    const { username, password } = req.body;
    //   kiem tra trong database co email nay chua
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    //  so sanh password
    if (await bcrypt.compare(password, user.password)) {
      const userInfo = {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      };

      const accessToken = jwt.sign(
        userInfo,
        process.env.ACCESS_TOKEN_SECRET || "roipro",
        {
          expiresIn: "2m",
        }
      );

      const refreshToken = jwt.sign(
        userInfo,
        process.env.REFRESH_TOKEN_SECRET || "roipro",
        { expiresIn: "10d" }
      );
      /**
       * Xử lý trường hợp trả về httpOnly Cookie cho phía Client
       * maxAge: thời gian sống của Cookie tính theo mili giây để tối đa 14 ngày. Cái này là thời gian sống của Cookie
       */
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms("7 days"),
      });
      res.status(200).json({ userInfo, accessToken, refreshToken });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    // Xóa cookie refreshToken
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const newAccessToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token is missing" });
      return;
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "roipro"
    ) as User;

    const newAccessToken = jwt.sign(
      decoded,
      process.env.ACCESS_TOKEN_SECRET || "roipro",
      { expiresIn: "2m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

const resetPassword = async (
  req: Request<
    unknown,
    unknown,
    { id: string; newPassword: string; oldPassword: string }
  >,
  res: Response
) => {
  try {
    const { id, newPassword, oldPassword } = req.body;
    const user = await UserModel.findById(id);
    if (!user) {
       res.status(404).json({ message: "User not found" });
       return;
    }
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
       res.status(400).json({ message: "Old password is incorrect" });
       return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json({ message: "Password reset successfully" });
    } else {
      res.status(400).json({ message: "Failed to reset password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { login, register, logout, newAccessToken, resetPassword };
