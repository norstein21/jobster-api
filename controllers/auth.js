const UserModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  //gen salt > parameternya adalah byte yg ingin ditambahkan, makin banyak makin bagus tp bakal menambah beban processing data
  const salt = await bcrypt.genSalt(10);
  //hash password yg ada plus salt
  const hashPassword = await bcrypt.hash(password, salt);
  const tempUser = { name, email, password: hashPassword };
  const user = await UserModel.create({ ...tempUser });
  res.status(StatusCodes.CREATED).json({ msg: "Success add users", user });
};

const login = async (req, res) => {
  res.send("login user");
};

module.exports = { register, login };
