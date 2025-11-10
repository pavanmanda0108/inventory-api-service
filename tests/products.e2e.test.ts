import request from "supertest";
import app from "../src/app";

describe("POST /api/products/lookup", () => {
  it("returns 400 when no identifiers", async () => {
    await request(app).post("/api/products/lookup").send({}).expect(400);
  });
});
