const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
chai.use(chaiHttp);

describe("Friend Data Retrieval API", () => {
  describe("GET /search-user-info/:friendId - Successful Friend Retrieval", () => {
    it("should return friend data for a valid friend ID", (done) => {
      const validFriendId = "656d6b9db41784541809ef20";
      chai
        .request(app)
        .get(`/search-user-info/${validFriendId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("_id", validFriendId);
          expect(res.body).to.have.property("username");
          expect(res.body).to.have.property("email");
          expect(res.body).to.have.property("events").to.be.an("array");
          expect(res.body).to.have.property("friends").to.be.an("array");
          done();
        });
    });
  });

  describe("GET /search-user-info/:friendId - Friend Not Found", () => {
    it("should return a 404 error if the friend is not found", (done) => {
      const invalidFriendId = "507f1f77bcf86cd799439011"; // non-existent user ID
      chai
        .request(app)
        .get(`/search-user-info/${invalidFriendId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("message", "Friend not found");
          done();
        });
    });
  });
});
