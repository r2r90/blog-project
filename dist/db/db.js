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
exports.runDb = exports.postsCollection = exports.blogsCollection = void 0;
const dotenv_1 = require("dotenv");
const mongodb_1 = require("mongodb");
(0, dotenv_1.configDotenv)();
const uri = process.env.MONGO_URL ||
    "mongodb+srv://aghartur:admin0000@cluster0.novrywl.mongodb.net/?retryWrites=true&w=majority";
const client = new mongodb_1.MongoClient(uri);
const database = client.db("blog-app");
exports.blogsCollection = database.collection("blogs");
exports.postsCollection = database.collection("posts");
const runDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        console.log("Connected successfully to MongoDB ");
    }
    catch (e) {
        console.log(`ERROR: ${e}`);
        yield client.close();
    }
});
exports.runDb = runDb;
