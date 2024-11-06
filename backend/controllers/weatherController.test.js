const request = require("supertest");
const app = require("../app");

describe("GET /api/forecast/:city", () => {
  it("should return forecast data for a valid city", async () => {
    const response = await request(app).get("/api/forecast/London");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("forecast");
  });
});
