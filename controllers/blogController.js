import Blog from "../models/blogModel.js";
import { BadRequestError, NotFoundError } from "../errors/customErrors.js";
import mongoose from "mongoose";
import day from "dayjs";

export const createBlogPost = async (req, res) => {
  req.body.createdBy = req.user._id;
  req.body.postedBy = req.user.blogName;
  // req.body.image = req.image
  const blog = await Blog.create(req.body);
  res.status(201).json(blog);
};

export const getLatestBlogPost = async (req, res) => {
  const blog = await Blog.find({}).sort("-createdAt").limit(20);
  if (!blog) throw new NotFoundError("No blog posts is available");
  res.status(200).json(blog);
};

export const getOwnersBlogPost = async (req, res) => {
  const filter = { createdBy: req.user._id };
  const blogs = await Blog.find(filter).sort("-createdAt");
  if (blogs.length < 1) throw new NotFoundError("No blog posts is available");
  res.status(200).json({ total: blogs.length, data: blogs });
};

export const getPostByName = async (req, res) => {
  const decodedTitle = decodeURIComponent(req.query.title);

  // Perform a case-insensitive search for similar titles
  const filter = { title: new RegExp(decodedTitle, "i") };

  const blog = await Blog.findOne(filter);

  if (!blog) {
    throw new NotFoundError("Blog not found");
  }

  res.status(200).json(blog);
};

export const deletePostById = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    throw new NotFoundError("Blog Not Found");
  }
  res.status(200).json({ message: "Blog deleted Successfully" });
};

export const createReaction = async (req, res) => {
  const { reaction, postId } = req.body;

  // Validate the reaction or handle invalid cases
  const validReactions = ["like", "love", "excellent"]; // Add other valid reactions as needed
  if (!validReactions.includes(reaction))
    throw new BadRequestError(
      "Invalid reaction sent (like, love, excellent only)"
    );

  // Update the post in your database with the incremented reaction count
  const updatedBlog = await Blog.findByIdAndUpdate(
    postId,
    { $inc: { [`reactions.${reaction}`]: 1 } },
    { new: true }
  );

  if (!updatedBlog) throw new NotFoundError("Blog not found");

  // Send the updated Blog as a response
  res.status(200).json(updatedBlog);
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) throw new NotFoundError("Blog unavailable");
  res.status(200).json(blog);
};

export const updatePost = async (req, res) => {
  const filter = req.body.id;
  const blog = await Blog.findByIdAndUpdate(filter, req.body, { new: true });
  if (!blog) throw new NotFoundError("Blog not found");
  res.status(200).json(blog);
};

export const getBlogStats = async (req, res) => {
  const userId = req.user._id;

  const blog = await Blog.findOne({ createdBy: userId })
  let reactions;
  if (blog) {
      const reactionStats = await Blog.aggregate([
        {
          $match: {
            createdBy: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null, // Group all documents together
            like: { $sum: "$reactions.like" },
            love: { $sum: "$reactions.love" },
            excellent: { $sum: "$reactions.excellent" },
          },
        },
      ]);
      reactions = {
        like: reactionStats[0].like || 0,
        love: reactionStats[0].love || 0,
        excellent: reactionStats[0].excellent || 0,
      };
  } else {
     reactions = {
       like:0,
       love:0,
       excellent:0,
     };
  }



  let monthlyBlogs = await Blog.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

   monthlyBlogs = monthlyBlogs
     .map((item) => {
       const {
         _id: { year, month },
         count,
       } = item;

       const date = day()
         .month(month - 1)
         .year(year)
         .format("MMM YY");

       return { date, count };
     })
     .reverse();

  res.status(200).json({ reactions, monthlyBlogs });
};
