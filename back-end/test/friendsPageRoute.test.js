const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app");

chai.use(chaiHttp);
describe("GET /friends/:userId - Success", () => {
  it("should return a user's information with a list of friends", (done) => {
    const validUserId = "656d6b9db41784541809ef20"; // valid ObjectID
    chai
      .request(app)
      .get(`/friends/${validUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.include.keys(
          "_id",
          "username",
          "email",
          "avatar",
          "friends"
        );
        expect(res.body.friends).to.be.an("array");
        res.body.friends.forEach((friend) => {
          expect(friend).to.include.keys(
            "_id",
            "username",
            "email",
            "avatar",
            "friends"
          );
        });
        done();
      });
  });
});

describe("GET /friends/:userId - User Not Found", () => {
  it("should return a 404 error if the user is not found", (done) => {
    const invalidUserId = "507f1f77bcf86cd799439011"; // non-existent user ID
    chai
      .request(app)
      .get(`/friends/${invalidUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("error", "User not found");
        done();
      });
  });
});
