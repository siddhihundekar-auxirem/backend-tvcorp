import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🔐 REGISTER
export const register = async (req, res) => {
  try {
    // ✅ Added role here
    const { name, email, password, role } = req.body;

    // ✅ VALIDATIONS
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 🔥 Strong Password validation (NEW)
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user (with role)
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // 🔥 NEW
    });

    // 🔥 Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });

  } catch (error) {
    console.log("REGISTER ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔐 LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ VALIDATION
    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password required" });
    }

    // ✅ CHECK USER
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // 🔥 UPDATED TOKEN (role added)
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role // 🔥 NEW
      },
      "secretkey",
      { expiresIn: "7d" }
    );

    // 🔥 Clean response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    });

  } catch (error) {
    console.log("LOGIN ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔥 GET CURRENT USER (VERY IMPORTANT)
export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role"],
    });

    res.json(user);

  } catch (error) {
    console.log("GET ME ERROR 👉", error);
    res.status(500).json({ message: "Server error" });
  }
};