const express = require("express");
const router = express.Router();
const zod = require("zod");
const { Users, UserLog } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const signupBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
  jobRole: zod.string(),
});

router.post("/signup", async (req, res) => {
  const { success } = signupBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Invalid inputs",
    });
  }

  const existingUser = await Users.findOne({ username: req.body.username });
  if (existingUser) {
    return res.status(411).json({
      message: "User Already Exists",
    });
  }

  const user = await Users.create({
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    jobRole: req.body.jobRole,
  });

  const userId = user._id;

  const token = jwt.sign({ userId }, JWT_SECRET);

  res.json({
    message: "Account Created successfully",
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.string().email(),
  password: zod.string(),
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = signinBody.parse(req.body);

    // Find user by username
    const user = await Users.findOne({ username, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Verify the password
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create user log entry for successful sign-in
    const userLog = new UserLog({ user: user._id });
    await userLog.save();
    console.log("user log saved = ",userLog);
    const isAdmin = user.isAdmin;
    const firstName = user.firstName;
    const token = jwt.sign({ userId: user._id, isAdmin }, JWT_SECRET);

    res.json({ token, isAdmin, firstName: firstName });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, JWT_SECRET);
  const userId = decodedToken.userId;
  
  // console.log(token);
  
  try {
    // Find the most recent user log entry for the logged-in user
    const activesession = await UserLog.findOne({
      user: userId,
      logoutTime: null,
    });
    
    console.log(UserLog._id);
    // console.log(activesession);
    if (!UserLog) {
      return res.status(404).json({ message: "No active session found" });
      // console.log(logoutTime)
    }
    
    // Update the logout time for the user log entry
    if (activesession) {
      activesession.logoutTime = new Date();
      await activesession.save();
      
    }

    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
