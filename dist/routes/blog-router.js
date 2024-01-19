"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get('/', (req, res) => {
    res.send(db_1.db.blogsDb);
});
exports.blogsRouter.get('/:id', (req, res) => {
    let foundBlogById = db_1.db.blogsDb.find((b) => b.id === req.params.id);
    if (foundBlogById) {
        res.status(200).send(foundBlogById);
    }
    else {
        res.status(400).send('Please provide a valid ID for the resource lookup');
    }
});
exports.blogsRouter.post('/', (req, res) => {
});
