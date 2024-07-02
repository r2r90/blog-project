import mongoose from "mongoose";
import { WithId } from "mongodb";

export type BlogDbType = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export const BlogsSchema = new mongoose.Schema({
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
