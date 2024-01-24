"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blog_router_1 = require("./routes/blog-router");
const testing_router_1 = require("./routes/testing-router");
const posts_router_1 = require("./routes/posts-router");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.get("/", (req, res) => {
    res.send("Blogs App OK!");
});
exports.app.use("/blogs", blog_router_1.blogsRouter);
exports.app.use("/posts", posts_router_1.postsRouter);
exports.app.use("/testing", testing_router_1.testingRouter);
