const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://rishav:rishav@cluster0.fyid77o.mongodb.net/tracker",
  {
    serverSelectionTimeoutMS: 10000,
  }
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    require: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  jobRole: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const empolyeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  salary: {
    type: Number,
    require: true,
  },
  jobRole: {
    type: String,
    require: true,
  },
});

const userLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  logoutTime: {
    type: Date,
  },
});

const UserLog = mongoose.model("UserLog", userLogSchema);

const Users = mongoose.model("users", userSchema);
const Empolyees = mongoose.model("Employees", empolyeeSchema);

module.exports = {
  Users,
  Empolyees,
  UserLog,
};
