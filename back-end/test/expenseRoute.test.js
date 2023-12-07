const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
const { expect } = chai;

chai.use(chaiHttp);

describe("GET /expense/ExpenseDetail/:expenseId - Get Expense Details", () => {
  it("should return expense details with populated data", (done) => {
    const expenseId = "656d6c5eb41784541809ef8f"; // valid expense id

    chai
      .request(app)
      .get(`/expense/ExpenseDetail/${expenseId}`)
      .end((err, res) => {
        expect(res.body).to.have.property("_id", expenseId);
        expect(res.body).to.have.property("name").to.be.a("string");
        expect(res.body).to.have.property("totalAmount").to.be.a("number");
        expect(res.body).to.have.property("date").to.be.a("string");
        expect(res.body).to.have.property("event");

        if (res.body.event) {
          expect(res.body.event).to.have.property("date").to.be.a("string");
          expect(res.body.event)
            .to.have.property("description")
            .to.be.a("string");
          expect(res.body.event).to.have.property("expenses").to.be.an("array");
          expect(res.body.event).to.have.property("name").to.be.a("string");
          expect(res.body.event)
            .to.have.property("participants")
            .to.be.an("array");
          expect(res.body.event).to.have.property("_id").to.be.a("string");
        }

        expect(res.body).to.have.property("paidBy").to.be.an("object");
        if (res.body.paidBy) {
          expect(res.body.paidBy)
            .to.have.property("username")
            .to.be.a("string");
          expect(res.body.paidBy).to.have.property("_id").to.be.a("string");
        }

        expect(res.body).to.have.property("splitDetails").to.be.an("array");
        res.body.splitDetails.forEach((splitDetail) => {
          expect(splitDetail).to.have.property("settlement").to.be.an("object");
          expect(splitDetail.settlement)
            .to.have.property("amount")
            .to.be.a("number");
          expect(splitDetail.settlement)
            .to.have.property("event")
            .to.be.a("string");
          expect(splitDetail.settlement)
            .to.have.property("expense")
            .to.be.a("string");
          expect(splitDetail.settlement)
            .to.have.property("settleFrom")
            .to.be.a("string");
          expect(splitDetail.settlement)
            .to.have.property("settleTo")
            .to.be.a("string");
          expect(splitDetail.settlement)
            .to.have.property("status")
            .to.be.a("boolean");
          expect(splitDetail).to.have.property("user").to.be.an("object");
          expect(splitDetail.user).to.have.property("_id").to.be.a("string");
          expect(splitDetail.user).to.have.property("avatar").to.be.a("string");
          expect(splitDetail.user).to.have.property("email").to.be.a("string");
          expect(splitDetail.user).to.have.property("events").to.be.an("array");
          expect(splitDetail.user)
            .to.have.property("friends")
            .to.be.an("array");
          expect(splitDetail.user)
            .to.have.property("username")
            .to.be.a("string");
        });
        done();
      });
  });

  it("should return a 404 error for an invalid expense ID", (done) => {
    const invalidExpenseId = "684d6afdb41784512349ef05"; // non-existent expense id

    chai
      .request(app)
      .get(`/expense/ExpenseDetail/${invalidExpenseId}`)
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.have.property("message", "Expense not found");

        done();
      });
  });
});
