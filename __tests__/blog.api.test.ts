import request from "supertest";
import { db } from "../src/db/db";
import { app } from "../src/app";

describe("/blogs === BLOG API TEST", () => {
  it("should return status:200 -  content: blogs array", async () => {
    await request(app).get("/blogs").expect(200, db.blogsDb);
  });

  it(`/blogs: should create new blog; status 201; content: created blog`, async () => {
    await request(app).post("/blogs").expect(201, db.blogsDb);
  });

  it(`/blogs: shouldn't create new blog with incorrect input data; status 400`, async () => {
    await request(app).post("/blogs").expect(400, db.blogsDb);
  });

  it(`blogs/:id: should return status 200; content: blog by id`, async () => {
    await request(app)
      .post("/blogs")
      .send({ name: "" })
      .expect(200, db.blogsDb);
  });
});
