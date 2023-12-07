const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("GET /events/for/:userId - Fetch User's Events", () => {
  it("should return user's events with populated expenses and settlements", (done) => {
    const userId = "656d6afdb41784541809ef05";

    chai
      .request(app)
      .get(`/events/for/${userId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("avatar").to.be.a("string");
        expect(res.body).to.have.property("email").to.be.a("string");
        expect(res.body).to.have.property("username").to.be.a("string");
        expect(res.body).to.have.property("_id").to.be.a("string");
        expect(res.body).to.have.property("events").to.be.an("array");

        res.body.events.forEach((event) => {
          expect(event).to.be.an("object");
          expect(event).to.have.property("_id").to.be.a("string");
          expect(event).to.have.property("name").to.be.a("string");
          expect(event).to.have.property("description").to.be.a("string");
          expect(event).to.have.property("date").to.be.a("string");
          expect(event).to.have.property("participants").to.be.an("array");

          event.expenses.forEach((expense) => {
            expect(expense).to.have.property("date").to.be.a("string");
            expect(expense).to.have.property("event").to.be.a("string");
            expect(expense).to.have.property("name").to.be.a("string");
            expect(expense).to.have.property("paidBy").to.be.a("string");
            expect(expense).to.have.property("_id").to.be.a("string");
            expect(expense).to.have.property("totalAmount").to.be.a("number");
            expect(expense).to.have.property("splitDetails").to.be.an("array");
          });
        });

        done();
      });
  });

  it("should return 404 if the user is not found", (done) => {
    const invalidUserId = "507f1f77bcf86cd799439011";

    chai
      .request(app)
      .get(`/events/for/${invalidUserId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("message", "User not found");
        done();
      });
  });
});
