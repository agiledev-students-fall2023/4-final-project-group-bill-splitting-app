const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app"); // Replace with the actual path to your Express app
const { expect } = chai;

chai.use(chaiHttp);

describe("POST /add-expense - Create Expense", () => {
  it("should return validation errors for invalid data", (done) => {
    const invalidExpenseData = {
      name: "Test Expense",
      description: "This is a test expense",
      totalAmount: 100.0,
      date: "2023-12-01",
    };

    chai
      .request(app)
      .post("/add-expense")
      .send(invalidExpenseData)
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an("object");
        expect(res.body).to.have.property("errors").to.be.an("array");
        done();
      });
  });
});
