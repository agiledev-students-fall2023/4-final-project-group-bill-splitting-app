const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("GET /event/:eventId - Get Event Details", () => {
  it("should return event details with populated expenses and settlements", (done) => {
    const eventId = "656d6c04b41784541809ef73"; // valid event id

    chai
      .request(app)
      .get(`/event/${eventId}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("_id", eventId);
        expect(res.body).to.have.property("name");
        expect(res.body).to.have.property("description");
        expect(res.body).to.have.property("date");
        expect(res.body).to.have.property("expenses").to.be.an("array");

        res.body.expenses.forEach((expense) => {
          expect(expense).to.have.property("_id");
          expect(expense).to.have.property("name");
          expect(expense).to.have.property("totalAmount");
          expect(expense).to.have.property("date");
          expect(expense).to.have.property("paidBy");
          expect(expense).to.have.property("splitDetails").to.be.an("array");

          expense.splitDetails.forEach((splitDetail) => {
            expect(splitDetail).to.have.property("_id");
            expect(splitDetail).to.have.property("user");
            expect(splitDetail)
              .to.have.property("settlement")
              .to.be.an("object");
            expect(splitDetail.settlement).to.have.property("amount");
            expect(splitDetail.settlement).to.have.property("event");
            expect(splitDetail.settlement).to.have.property("expense");
            expect(splitDetail.settlement).to.have.property("settleFrom");
            expect(splitDetail.settlement).to.have.property("settleTo");
            expect(splitDetail.settlement).to.have.property("status");
          });
        });

        done();
      });
  });

  it("should return a 404 error for an invalid event ID", (done) => {
    const invalidEventId = "684d6afdb41784512349ef05"; // nonexist event id

    chai
      .request(app)
      .get(`/event/${invalidEventId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Event not found");

        done();
      });
  });
});
