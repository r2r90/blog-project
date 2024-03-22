import mongoose from "mongoose";
import { BlogDbType } from "../../models/db-types";
import { WithId } from "mongodb";

const BlogsSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 15 },
  description: { type: String, required: true, maxlength: 500 },
  websiteUrl: { type: String, required: true, maxlength: 100 },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true },
});

export const BlogsModel = mongoose.model<WithId<BlogDbType>>(
  "blogs",
  BlogsSchema
);
