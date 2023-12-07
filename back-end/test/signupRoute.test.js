const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

describe("POST for Signup", () => {
  describe("POST /signup", () => {
    it("should return a unsuccessful response", (done) => {
      chai
        .request(app)
        .post("/signup")
        .send({
          email: "cindyliang01@gmail.com",
          username: "cindy",
          password: "hi",
        })
        .end((err, res) => {
          expect(res).to.have.status(409);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("message");
          done();
        });
    });
  });
});
