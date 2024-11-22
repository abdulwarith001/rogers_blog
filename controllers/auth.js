import User from "../models/userModel.js";
import { BadRequestError } from "../errors/customErrors.js";
import { generateToken } from "../utils/generateToken.js";
import sendMail from '../config/mailConfig.js'
// import welcomeImage from '../utils/welcome'
export const register = async (req, res) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? "admin" : "user";

  const user = await User.create(req.body);
  const token = generateToken(res, user.id, user.role);
  const html = `<h1>Hi ${user.name}, <br> Thank you registering on MI BLogs.</h1><br/><img src=${process.env.WELCOME_IMAGE} alt="Welcome image"/></br> <p>You can start blogging right away by clicking on the GET STARTED button on the homepage. You can also click the link below </p> <br> <a href="https://mi-blogs.onrender.com/dashboard"> START BLOGGING RIGHT AWAY!!!</a>`;
  const isMailSent = await sendMail("Welcome to MI Blogs.", user.email, html)
  const data = {
    _id: user._id,
    name: user.name,
    blogName: user.blogName,
    role: user.role,
    token,
    isMailSent
  }
  res.status(201).json(data);
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user && (await user.matchPasswords(req.body.password))) {
    const token = generateToken(res, user.id, user.role);
    const data = {
      _id: user._id,
      name: user.name,
      blogName: user.blogName,
      role: user.role,
      token,
    };
    res.status(200).json(data)
  } else {
    throw new BadRequestError('Invalid email or password')
  }
};
