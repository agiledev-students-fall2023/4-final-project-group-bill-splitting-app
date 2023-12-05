const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const expect = chai.expect;

chai.use(chaiHttp);

describe(" GET Endpoint for logout", () => {
  describe("/GET /logout", () => {
    it("it should return a 200 status code", (done) => {
      chai
        .request(server)
        .get("/logout")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body).to.have.property("success", true);
          done();
        });
    });
  });
});
