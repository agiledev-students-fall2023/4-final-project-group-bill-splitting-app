const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("GET /addEventMember/friendsList/:userId - Get User's Friends List", () => {
  it("should return a user's friends list for a valid user ID", (done) => {
    const validUserId = "656d6bb42bda8464c472ed7f";

    chai
      .request(app)
      .get(`/addEventMember/friendsList/${validUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("_id", validUserId);
        expect(res.body).to.have.property("avatar").to.be.an("string");
        expect(res.body).to.have.property("email").to.be.an("string");
        expect(res.body).to.have.property("username").to.be.an("string");
        expect(res.body).to.have.property("events").to.be.an("array");
        expect(res.body).to.have.property("friends").to.be.an("array");
        const friendsList = res.body.friends;
        for (const friend of friendsList) {
          expect(friend).to.have.property("avatar").to.be.a("string");
          expect(friend).to.have.property("email").to.be.a("string");
          expect(friend).to.have.property("username").to.be.a("string");
          expect(friend).to.have.property("events").to.be.an("array");
          expect(friend).to.have.property("friends").to.be.an("array");
        }
        done();
      });
  });

  it("should return a 404 error for an invalid user ID", (done) => {
    const invalidUserId = "507f1f77bcf86cd799439011";

    chai
      .request(app)
      .get(`/addEventMember/friendsList/${invalidUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.text).to.equal("User not found");
        done();
      });
  });
});
