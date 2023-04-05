const user = require("../models/userSchema");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRETKEY;
const bcrypt = require("bcrypt");

const userRegistration = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    username = username.charAt(0).toUpperCase() + username.slice(1);

    if (!password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\S+$).{8,20}/)) {
      res.status(400).send({
        message:
          "Password must contain Minimum eight and maximum 20 characters,at least one uppercase letter, one lowercase letter, one number and one special character",
      });
    } else {
      const bcryptPassword = await bcrypt.hash(password, 12);

      const userDetails = {
        username,
        email,
        password: bcryptPassword,
      };
      const userData = await user.create(userDetails);
      res
        .status(201)
        .send({ message: "User registered succesfully", userData });
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userData = await user.findOne({ email: email });

    if (userData) {
      const result = await bcrypt.compare(password, userData.password);
      if (result) {
        const token = jwt.sign(
          { id: userData.id, email: userData.email },
          secretKey,
          {
            expiresIn: 2 * (60 * 60), //2 Hours
          }
        );
        res
          .status(200)
          .send({ message: "user login successfully", data: userData, token });
      } else {
        res.status(401).send({ message: "Password is incorrect..." });
      }
    } else {
      res.status(401).send({ message: "Email is not registered..." });
    }
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await user
      .find({ _id: { $ne: req.params.id } })
      .select(["_id", "username", "email", "isOnline"]);
    res.status(200).send({ message: "All user get succesfully", data: users });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

const updateOnlineStatus = async (req, res, next) => {
  try {
    const { isOnline } = await req.body;
    const _id = await req.params.id;

    const userData = await user.findByIdAndUpdate(
      _id,
      { isOnline: isOnline },
      { new: true }
    );
    res.status(200).send({
      message: "user online status updated successfully",
      data: userData,
    });
  } catch (error) {
    res.status(400).send(error);
    console.log(error);
  }
};

module.exports = {
  userRegistration,
  userLogin,
  getAllUsers,
  updateOnlineStatus,
};
