const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("POST /addEvent - Create Event", () => {
  it("should return validation errors for missing data", (done) => {
    const eventData = {
      eventName: "Test Event",
      Description: "This is a test event",
      Members: ["656d6afdb41784541809ef05", "656d6b17b41784541809ef11"], // valid user IDs
    };
    chai
      .request(app)
      .post("/addEvent")
      .send(eventData)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property("errors");
        done();
      });
  });
});
