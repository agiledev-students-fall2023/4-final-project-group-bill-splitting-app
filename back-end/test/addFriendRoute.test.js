const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
chai.use(chaiHttp);

describe("Add Friend API", () => {
  describe("POST /addFriends - One or Both Users Not Found", () => {
    it("should return an error if one or both users are not found", (done) => {
      const currentUserId = "507f1f77bcf86cd799439011"; // nonexistentUserId
      const friendUserId = "656d6bb42bda8464c472ed7f"; // valid ID
      chai
        .request(app)
        .post("/addFriends")
        .send({ currentUserId, friendUserId })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.text).to.equal("One or both users not found");
          done();
        });
    });
  });

  describe("POST /addFriends - Users Already Friends", () => {
    it("should return a message if users are already friends", (done) => {
      const currentUserId = "656d6bb42bda8464c472ed7f"; // valid IDs already friends
      const friendUserId = "656d6afdb41784541809ef05"; // valid IDs already friends
      chai
        .request(app)
        .post("/addFriends")
        .send({ currentUserId, friendUserId })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.text).to.equal("Already friends");
          done();
        });
    });
  });
});
