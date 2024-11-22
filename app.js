// app.js
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import {authRoute, blogRoute} from './routes/index.js'
import { notFound, errorMiddleware } from "./middlewares/index.js";
import cors from 'cors'
import nodemailer from 'nodemailer'
dotenv.config();
const app = express();

app.use(cors())


// Use the join function to resolve paths
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use("/api/auth", authRoute);
app.use("/api/blog", blogRoute);


app.use(notFound)
app.use(errorMiddleware)

const port = process.env.PORT || 5000;

try {
  await mongoose.connect(process.env.MONGO_URL);
 app.listen(port, () => console.log(`Server started on port ${port}...`));
} catch (error) {
  console.log(error);
  process.exit(1);
}