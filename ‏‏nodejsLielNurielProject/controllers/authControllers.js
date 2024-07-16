const schemas = require("../schemas/usersSchema");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");

const { JWT_SECRET } = process.env;
const { JWT_EXPIRES_IN } = process.env;

const register = async (req, res) => {
  const { error, value } = schemas.createNewUser.validate(req.body);
  if (error) {
    const errorsArray = error.details.map((err) => err.message); 
    return res.status(400).json({ success: false, message: errorsArray });
  }
  try {
    const existingUser = await User.find({ email: value.email });
    if (existingUser.length > 0)
      return res
        .status(409)
        .json({
          success: false,
          message: `Email ${value.email} is already in use! consider logging in`,
        });
    const newUser = new User(value);
    const hashedPassword = await bcrypt.hash(value.password, 10);
    newUser.password = hashedPassword;
    newUser.isAdmin = false;
    const saved = await newUser.save();
    const token = jwt.sign(
      {
        id: saved.id,
        isBusiness: saved.isBusiness,
        isAdmin: saved.isAdmin,
      },
      JWT_SECRET,
      {
        expiresIn: "10",
      }
    );
    return res
      .status(201)
      .json({ success: true, created: newUser, token: token });
  } catch (err) {
    console.log(chalk.red('Error registering'));
    return res
      .status(500)
      .json({
        success: false,
        message: `Error registering user: ${err.message}`,
      });
  }
};

const login = async (req, res) => {
  const { error, value } = schemas.login.validate(req.body);
  if (error) {
    const errorsArray = error.details.map((err) => err.message); 
    return res.status(400).json({ success: false, message: errorsArray });
  }

  try {
    const user = await User.findOne({ email: value.email });
    if (!user)
      return res
        .status(403)
        .json({ sucees: false, message: "Invalid email" });
    const isMatch = bcrypt.compare(value.password, user.password);
    if (!isMatch)
      return res
        .status(403)
        .json({ sucees: false, message: "Invalid password" });
    const token = jwt.sign(
      {
        id: user._id,
        isBusiness: user.isBusiness,
        isAdmin: user.isAdmin,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );
    return res.status(200).json({ success: true, token: token, user:User });
  } catch (err) {
    console.log(chalk.red('Error logging in'));
    return res
      .status(500)
      .json({ success: false, message: `Error loggin-in: ${err.message}` });
  }
};

const changeStatus = async(req, res) => {
  const { error, value } = schemas.updateUser.validate(req.body);
  if (error) {
    const errorsArray = error.details.map((err) => err.message); 
    return res.status(400).json({ success: false, message: errorsArray });
  }
    const { id } = req.params;
  try {
    const status = User.findByIdAndUpdate(id, value, { new: true }).select('-password').exec();
  if (!status)
    return res
      .status(404)
      .json({ success: false, message: `status was not found.` })
    return res.status(200).json({
      success: true,
      updated: status, 
    });
  } catch (err) {
    console.log(chalk.red('Error changing status'));
    return res
      .status(500)
      .json({ success: false, message: `Could not change Status: ${err.message}` });
  }
};

const mustLogin = (req,res,next) => {
  const token = req.header('x-auth-token')
  if (!token) return res.status(403).json({ sucees: false, message: 'Forbidden: you must be logged-in to view this content' })
  try {
    const payload = jwt.verify(token, JWT_SECRET,)
    req.user = payload;
    return next();
  } catch(err) {
    console.log(chalk.red('Error in must loggin'));
    return res.status(403).json({ sucees: false, message: 'Forbidden: you must be logged-in to view this content' })
  }
}

const allowedRoles = (allowedRoles) => {
  return (req,res,next) => {
    if (!Array.isArray(allowedRoles)) throw new Error('Error: allowedRoles must be an array');
    if (allowedRoles.length===0) throw new Error('Error: allowedRoles must contain at-least one element');
    if (!req.user) return res.status(403).json({ sucees: false, message: 'Forbidden: you must be logged-in to view this content' })
    const { isBusiness, isAdmin } = req.user;
    let hasRole = false;

    if (allowedRoles.includes('business') && isBusiness) hasRole=true;
    if (allowedRoles.includes('admin') && isAdmin) hasRole=true;

    if (!hasRole) {
      const allowedRolesString = allowedRoles.join('/')
      return res.status(401).json({ success: false, message: `Unauthorized: only ${allowedRolesString} users can access this resource` })
    }
    return next();
  }
}

module.exports = {
  register,
  login,
  changeStatus,
  mustLogin,
  allowedRoles,
}
