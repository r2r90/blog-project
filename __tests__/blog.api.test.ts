import request from "supertest";
import { db } from "../src/db/db";
import { app } from "../src/app";

describe("/blogs === BLOG API TEST", () => {
  it("should return 200 with blogs array", async () => {
    await request(app).get("/blogs").expect(200, db.blogsDb);
  });
});
