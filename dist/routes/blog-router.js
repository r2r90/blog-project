"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const auth_middleware_1 = require("../middlewares/auth/auth-middleware");
const blog_validators_1 = require("../middlewares/validators/blog-validators");
const mongodb_1 = require("mongodb");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blogs_repository_1.blogsRepository.getAll();
    res.send(blogs).sendStatus(200);
}));
exports.blogsRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const foundedBlog = yield blogs_repository_1.blogsRepository.getBlogById(req.params.id);
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.sendStatus(404);
    }
    res.send(foundedBlog).sendStatus(200);
    if (!foundedBlog) {
        res.sendStatus(404);
        return;
    }
}));
exports.blogsRouter.post("/", auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, websiteUrl } = req.body;
    const newBlog = {
        name,
        description,
        websiteUrl,
    };
    const createdBlog = yield blogs_repository_1.blogsRepository.createBlog(newBlog);
    res.status(201).send(createdBlog);
}));
exports.blogsRouter.put("/:id", auth_middleware_1.authMiddleware, (0, blog_validators_1.blogValidation)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description, websiteUrl } = req.body;
    const updateData = { name, description, websiteUrl };
    const id = req.params.id;
    const blog = yield blogs_repository_1.blogsRepository.updateBlog(id, updateData);
}));
exports.blogsRouter.delete("/:id", auth_middleware_1.authMiddleware, (req, res) => {
    const blogToDelete = blogs_repository_1.blogsRepository.getBlogById(req.params.id);
    if (!blogToDelete) {
        res.sendStatus(404);
        return;
    }
    else {
        blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
        res.send(204);
    }
});
