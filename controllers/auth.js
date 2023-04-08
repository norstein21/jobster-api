const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const { UnauthenticatedError, BadRequestError } = require("../errors");

const register = async (req, res) => {
  const user = await UserModel.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  //Kalau salah satu email dan password null
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  //Temukan salah satu email
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credential");
  }
  const check = await bcrypt.compare(password, user.password);
  if (!check) {
    throw new UnauthenticatedError("Invalid password");
  }

  const token = await user.createJWT();
  res.status(StatusCodes.OK).json({ msg: "Success login", token, user });
};

module.exports = { register, login };
