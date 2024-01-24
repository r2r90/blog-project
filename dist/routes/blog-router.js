"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blog_validators_1 = require("../middlewares/validators/blog-validators");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get("/", (req, res) => {
    const blogs = blogs_repository_1.blogsRepository.getAll();
    res.send(blogs).sendStatus(200);
});
exports.blogsRouter.get("/:id", (req, res) => {
    const foundedBlog = blogs_repository_1.blogsRepository.getBlogById(req.params.id);
    if (!foundedBlog) {
        res.send(404);
    }
    res.send(foundedBlog).sendStatus(200);
});
exports.blogsRouter.post("/", auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => {
    const { name, description, websiteUrl } = req.body;
    const newBlog = {
        id: Date.now().toString(),
        name,
        description,
        websiteUrl,
    };
    const createdBlog = blogs_repository_1.blogsRepository.createBlog(newBlog);
    res.status(201).send(createdBlog);
});
exports.blogsRouter.put("/:id", auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => {
    const foundedBlog = blogs_repository_1.blogsRepository.getBlogById(req.params.id);
    if (!foundedBlog) {
        res.status(404).send("Blog not found");
        return;
    }
    const { id } = req.params;
    const updates = req.body;
    const updatedBlog = blogs_repository_1.blogsRepository.updateBlog(id, updates);
    if (updatedBlog) {
        res.sendStatus(204);
    }
    else {
        res.status(500).send("Internal Server Error");
    }
});
exports.blogsRouter.delete("/:id", auth_middleware_1.authMiddleware, (req, res) => {
    const isDeleted = blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (isDeleted) {
        res.send(204);
    }
    else {
        res.send(404);
    }
});
