const schemas = require("../schemas/usersSchema");
const User = require("../models/User");
const bcrypt = require('bcryptjs');

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).select('-password').exec();
    return res.status(200).json({success: true, data: allUsers,});
  } catch (err) {
    console.log(chalk.red('Error'));
    return res.status(400).json({success: false, message: err.message,});
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const found = await User.findById(id).select('-password').exec();
    if (found) {
      return res.status(200).json({success: true, data: found,});
    }
    return res.status(404).json({success: false, message: `user id '${id}' not found`,});
  } catch (err) {
    console.log(chalk.red('Error'));
    return res.status(400).json({success: false, message: "Invalid format for user id",});
  }
};

const createNewUser = async (req, res) => {
  const { error, value } = schemas.createNewUser.validate(req.body);
  if (error) {
    const errorsArray = error.details.map((err) => err.message); 
    return res.status(400).json({ success: false, message: errorsArray });
  }
  const newUser = new User(value);
  try {
    const hashedPassword = await bcrypt.hash(newUser.password,10);
    newUser.password = hashedPassword;
    const saved = await newUser.save();
    const savedObject = saved.toObject();
    delete savedObject.password;
    return res.status(201).json({success: true, created: savedObject,});
  } catch (err) {
    if (err.code===11000) {return res.status(409).json({ success: false, message: `email ${newUser.email} is already registered! consider logging in.` })
    }
    console.log(chalk.red('Error'));
    return res.status(500).json({ success: false, message: `error saving the user` });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.findByIdAndDelete(id).select('-password').exec();
    if (!deleted) throw new Error();
    return res.status(200).json({ success: true, deleted: deleted });
  } catch (err) {
    console.log(chalk.red('Error'));
    return res.status(404).json({ success: false, message: `user id ${id} not found` });
  }
};

const updateUser = async (req, res) => {
  const { error, value } = schemas.updateUser.validate(req.body);
  if (error) {
    const errorsArray = error.details.map((err) => err.message);
    return res.status(400).json({ success: false, message: errorsArray });
  }
  const { id } = req.params;
  try {
    const updated = await User.findByIdAndUpdate(id, value, { new: true }).select('-password').exec();
    if (!updated) return res.status(404).json({ success: false, message: `user id ${id} was not found.` });
      return res.status(200).json({success: true,updated: updated,});
  } catch (err) {
    console.log(chalk.red('Error'));
    return res.status(404).json({ success: false, message: `user id ${id} was not found.` });
  }
};




module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  deleteUser,
  updateUser,
};
