const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from the server environment");
  }

  return jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

/*
POST /api/auth/register
Creates a new user and returns a JWT.
*/
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with that email already exists.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = createToken(user._id.toString());

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.name === "ValidationError") {
      const validationMessages = Object.values(error.errors).map(
        (validationError) => validationError.message,
      );

      return res.status(400).json({
        message: validationMessages.join(" "),
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with that email already exists.",
      });
    }

    return res.status(500).json({
      message: "The user could not be registered.",
    });
  }
};

/*
POST /api/auth/login
Checks the user's credentials and returns a JWT.
*/
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = createToken(user._id.toString());

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: formatUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "The user could not be logged in.",
    });
  }
};

/*
GET /api/auth/me
Returns the currently authenticated user.
The authentication middleware will add req.user.
*/
const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      user: formatUser(req.user),
    });
  } catch (error) {
    console.error("Current-user error:", error);

    return res.status(500).json({
      message: "The current user could not be retrieved.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
