const UserModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const user = await UserModel.create({ ...req.body });
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Success add users", email: user.email, token });
  // const { name, email, password } = req.body;
  // //JANGAN LUPA PAKE AWAIT, SALT DAN HASHNYA
  // //gen salt > parameternya adalah byte yg ingin ditambahkan, makin banyak makin bagus tp bakal menambah beban processing data
  // const salt = await bcrypt.genSalt(10);
  // //hash password yg ada plus salt
  // const hashPassword = await bcrypt.hash(password, salt);
  // const tempUser = { name, email, password: hashPassword };
};

const login = async (req, res) => {
  res.send("login user");
};

module.exports = { register, login };
