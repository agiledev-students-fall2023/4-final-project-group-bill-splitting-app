const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

describe("POST for Forgot Password", () => {
  describe("POST /forgot-password", () => {
    it("should return a success response", (done) => {
      chai
        .request(app)
        .post("/forgot-password")
        .send({
          email: "candy@gmail.com",
          username: "candy",
          newPassword: "candy01",
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("success", true);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });

  describe("POST /forgot-password", () => {
    it("should return an unsuccessful response", (done) => {
      chai
        .request(app)
        .post("/forgot-password")
        .send({
          email: "candy01@gmail.com",
          username: "candy",
          newPassword: "candy01",
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });
});
