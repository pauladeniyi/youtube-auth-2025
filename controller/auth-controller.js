const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist either with same username or email",
      });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Register a new user

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newUser.save();

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "New user registered",
      });
    } else {
      res.status(404).json({
        success: true,
        message: "Unable to register user",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// Login new user
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  // Check if user exists
  const isUserExist = await User.findOne({ username });
  if (!isUserExist) {
    return res.status(404).json({
      success: false,
      message: "user does not exist",
    });
  }

  // Compare the pasword
  const isPasswordMatched = await bcrypt.compare(
    password,
    isUserExist.password
  );
  if (!isPasswordMatched) {
    return res.status(404).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // create access Token
  const accessToken = jwt.sign(
    {
      userId: isUserExist._id,
      username: isUserExist.username,
      email: isUserExist.email,
      role: isUserExist.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    }
  );

  res.status(200).json({
    success: true,
    message: "User successfully logged in",
    accessToken,
  });
  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// User must first be logged in before changing password
const changePassword = async (req, res) => {
  try {
    // get the userId of the logged in user
    const userId = req.userInfo.userId;

    // extract old and new password
    const { oldPassword } = req.body;

    // get the logged in user
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // check if old password match the newly inputed password
    const isMatchedPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isMatchedPassword) {
      res.status(400).json({
        success: false,
        message: "Old password is not correct. Please try again",
      });
    }

    // hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(user.password, salt);

    // update the password
    user.password = newHashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password update successfull",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { registerUser, loginUser, changePassword };
