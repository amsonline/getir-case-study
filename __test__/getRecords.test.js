const request = require("supertest");
const app = require("../app");

// describe("Test /records with valid payload", () => {
//   test("The status code should be 200 with valid data", async () => {
//     const response = await request(app)
//           .post("/records")
//           .send({
//             "startDate": "2016-01-26",
//             "endDate": "2018-01-06",
//             "minCount": 2700,
//             "maxCount": 3000
//             });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.code).toBe(0);
//     expect(response.body.msg).toBe("Success");
//     expect(response.body.records.length).toBeGreaterThan(0);

//     // Because we don't use Mock database and the amount of records may change, no assertion is made on the data itself
//   });
// });

// describe("Test /records with valid payload, but minCount and maxCount as strings", () => {
//   test("The status code should be 200 and the result should not depend of their types", async () => {
//     const response = await request(app)
//           .post("/records")
//           .send({
//             "startDate": "2016-01-26",
//             "endDate": "2018-01-06",
//             "minCount": "2700",
//             "maxCount": "3000"
//             });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.code).toBe(0);
//     expect(response.body.msg).toBe("Success");
//     expect(response.body.records.length).toBeGreaterThan(0);

//     // Because we don't use Mock database and the amount of records may change, no assertion is made on the data itself
//   });
// });

describe("Test /records with POST method without any payloads", () => {
  test("The status code should be 400 with returned code = -101", async () => {
    const response = await request(app)
          .post("/records");
    expect(response.statusCode).toBe(400);
    // -101 error: Some parts are missing
    expect(response.body.code).toBe(-101);
  });
});

describe("Test /records without startDate", () => {
    test("The status code should be 400 with returned code -101", async () => {
      const response = await request(app)
            .post("/records")
            .send({
              "endDate": "2018-01-06",
              "minCount": 2700,
              "maxCount": 3000
              });
      expect(response.statusCode).toBe(400);
      // -101 error: Some parts are missing
      expect(response.body.code).toBe(-101);
    });
  });
  
  describe("Test /records without endDate", () => {
    test("The status code should be 400 with returned code -101", async () => {
      const response = await request(app)
            .post("/records")
            .send({
              "startDate": "2016-01-26",
              "minCount": 2700,
              "maxCount": 3000
              });
      expect(response.statusCode).toBe(400);
      // -101 error: Some parts are missing
      expect(response.body.code).toBe(-101);
    });
  });
  
  describe("Test /records without minCount", () => {
    test("The status code should be 400 with returned code -101", async () => {
      const response = await request(app)
            .post("/records")
            .send({
                "startDate": "2016-01-26",
                "endDate": "2018-01-06",
                "maxCount": 3000
              });
      expect(response.statusCode).toBe(400);
      // -101 error: Some parts are missing
      expect(response.body.code).toBe(-101);
    });
  });
  
  describe("Test /records without maxCount", () => {
    test("The status code should be 400 with returned code -101", async () => {
      const response = await request(app)
            .post("/records")
            .send({
                "startDate": "2016-01-26",
                "endDate": "2018-01-06",
                "minCount": 2700
              });
      expect(response.statusCode).toBe(400);
      // -101 error: Some parts are missing
      expect(response.body.code).toBe(-101);
    });
  });
  
  describe("Test /records with POST method with invalid startDate", () => {
  test("The status code should be 400 with returned code = -111", async () => {
    const response = await request(app)
          .post("/records")
          .send({
            "startDate": "Hey",
            "endDate": "2018-01-06",
            "minCount": 2700,
            "maxCount": 3000
            });
    expect(response.statusCode).toBe(400);
    // -111 error: startDate is invalid
    expect(response.body.code).toBe(-111);
  });
});

describe("Test /records with POST method with invalid endDate", () => {
  test("The status code should be 400 with returned code = -112", async () => {
    const response = await request(app)
          .post("/records")
          .send({
            "startDate": "2016-01-26",
            "endDate": "INVALID",
            "minCount": 2700,
            "maxCount": 3000
            });
    expect(response.statusCode).toBe(400);
    // -112 error: endDate is invalid
    expect(response.body.code).toBe(-112);
  });
});

describe("Test /records with POST method with startDate after endDate", () => {
  test("The status code should be 400 with returned code = -113", async () => {
    const response = await request(app)
          .post("/records")
          .send({
            "startDate": "2019-01-26",
            "endDate": "2018-11-23",
            "minCount": 2700,
            "maxCount": 3000
            });
    expect(response.statusCode).toBe(400);
    // -113 error: startDate is after endDate
    expect(response.body.code).toBe(-113);
  });
});

describe("Test /records with POST method with invalid minCount", () => {
  test("The status code should be 400 with returned code = -121", async () => {
    const response = await request(app)
          .post("/records")
          .send({
            "startDate": "2016-01-26",
            "endDate": "2018-01-06",
            "minCount": "test",
            "maxCount": 3000
            });
    expect(response.statusCode).toBe(400);
    // -121 error: minCount is invalid
    expect(response.body.code).toBe(-121);
  });
});

describe("Test /records with POST method with invalid maxCount", () => {
  test("The status code should be 400 with returned code = -122", async () => {
    const response = await request(app)
          .post("/records")
          .send({
            "startDate": "2016-01-26",
            "endDate": "2018-01-06",
            "minCount": 2700,
            "maxCount": "test"
            });
    expect(response.statusCode).toBe(400);
    // -122 error: maxCount is invalid
    expect(response.body.code).toBe(-122);
  });
});

describe("Test /records with POST method with maxCount being less than minCount", () => {
  test("The status code should be 400 with returned code = -123", async () => {
    const response = await request(app)
          .post("/records")
          .send({
            "startDate": "2016-01-26",
            "endDate": "2018-01-06",
            "minCount": 3700,
            "maxCount": 3000
            });
    expect(response.statusCode).toBe(400);
    // -123 error: maxCount is less than minCount
    expect(response.body.code).toBe(-123);
  });
});
