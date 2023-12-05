const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

const should = chai.should(); // the same assertion library in the style using the word 'should'

chai.use(chaiHttp);

describe("POST for Login", () => {
  describe("POST / with correct login credentials", () => {
    it("should return a 200 success response", (done) => {
      chai
        .request(app)
        .post("/")
        .send({ username: "cindy", password: "hi" })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("success", true);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("POST / with incorrect login credentials", () => {
    it("should return a 401 unauthorized response", (done) => {
      chai
        .request(app)
        .post("/")
        .send({ username: "incorrect", password: "incorrect" })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });
});
