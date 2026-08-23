const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const router = express.Router();

const User = require("../models/User");

const {
  sendVerificationEmail,
} = require("../utils/sendEmail");

// ======================
// REGISTER
// ======================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const verificationExpires =
      Date.now() + 24 * 60 * 60 * 1000;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "reader",
      isVerified: false,
      verificationToken,
      verificationExpires,
    });

    await newUser.save();

    const verificationLink =
      `http://localhost:5000/api/auth/verify-email/${verificationToken}`;

    await sendVerificationEmail(
      newUser.email,
      newUser.name,
      verificationLink
    );

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

// ======================
// VERIFY EMAIL
// ======================

router.get(
  "/verify-email/:token",
  async (req, res) => {
    try {
      const { token } = req.params;

      const user =
        await User.findOne({
          verificationToken: token,
          verificationExpires: {
            $gt: Date.now(),
          },
        });

      if (!user) {
        return res.status(400).send(`
          <h2>❌ Verification link is invalid or has expired.</h2>
        `);
      }

      user.isVerified = true;
      user.verificationToken = null;
      user.verificationExpires = null;

      await user.save();

      res.send(`
        <div
          style="
            font-family:Arial;
            text-align:center;
            margin-top:80px;
          "
        >
          <h1>✅ Email Verified Successfully</h1>

          <p>
            Your Readora account has been activated.
          </p>

          <a
            href="http://localhost:5173/login"
          >
            Go to Login
          </a>
        </div>
      `);

    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// ======================
// LOGIN
// ======================
router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    // Email verification check
    /*if (!user.isVerified) {
      return res.status(401).json({
        message:
          "Please verify your email before logging in.",
      });
    }*/

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "bookverse_secret",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;