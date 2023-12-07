const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Replace with the actual path to your Express app
const { expect } = chai;

chai.use(chaiHttp);

describe("GET /user-info/:userId - Get User Details", () => {
  it("should return user details for a valid user ID", (done) => {
    const validUserId = "656d6b9db41784541809ef20"; // valid id

    chai
      .request(app)
      .get(`/user-info/${validUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("_id").to.be.a("string");
        expect(res.body).to.have.property("username").to.be.a("string");
        expect(res.body).to.have.property("email").to.be.a("string");
        expect(res.body).to.have.property("avatar").to.be.a("string");
        expect(res.body).to.have.property("events").to.be.an("array");
        expect(res.body).to.have.property("friends").to.be.an("array");
        done();
      });
  });

  it("should return a 404 error for an invalid user ID", (done) => {
    const invalidUserId = "507f1f77bcf86cd799439011"; // nonexist id

    chai
      .request(app)
      .get(`/user-info/${invalidUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "User not found");
        done();
      });
  });
});
