import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/customErrors.js";
import User from "../models/userModel.js";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateRegister = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("Name is a required field")
    .isLength({ min: 3, max: 25 })
    .withMessage("Name must be between 3 and 25 characters")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide valid email")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new BadRequestError(["User already exists..."]);
      }
    }),
  body("password").notEmpty().withMessage("Password is required"),
  body("blogName")
    .notEmpty()
    .withMessage("Blog name is required")
    .custom(async (blogName) => {
      const user = await User.findOne({blogName})
      if (user) {
        throw new BadRequestError(["Blog name is not available, choose another name"]);
      }
    }),
]);

export const validateLogin = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is a required field")
    .isEmail()
    .withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
]);

export const validateBlogInput = withValidationErrors([
  body("title")
    .notEmpty()
    .withMessage("Title is a required field"),
  body("content").notEmpty().withMessage("content is required"),
]);
