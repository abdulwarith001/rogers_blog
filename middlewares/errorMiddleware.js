import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || "An unknown error occurred";
  const stack = process.env.NODE_ENV === "production" ? null : err.stack;

  res.status(statusCode).json({ message, stack });
  next();
};
export default errorHandler;
