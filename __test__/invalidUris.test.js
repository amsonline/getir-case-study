const request = require("supertest");
const app = require("../app");

describe("Test the root path", () => {
  test("The status code should be 404", async () => {
    const response = await request(app)
          .get("/");
      expect(response.statusCode).toBe(404);
  });
});

describe("Test /records", () => {
  test("The status code should be 404", async () => {
    const response = await request(app)
          .get("/records/get");
      expect(response.statusCode).toBe(404);
  });
});

describe("Test /records/get with GET method", () => {
  test("The status code should be 404", async () => {
    const response = await request(app)
          .get("/records/get");
      expect(response.statusCode).toBe(404);
  });
});