const { expect } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../app");
chai.use(chaiHttp);

describe("Event Member Retrieval API", () => {
  describe("GET /addExpensePayer/EventMember/:eventId - Successful Retrieval", () => {
    it("should return event members for a valid event ID", (done) => {
      const validEventId = "656e161842e8c71b07c5c521"; // valid event ID
      chai
        .request(app)
        .get(`/addExpensePayer/EventMember/${validEventId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          res.body.forEach((member) => {
            expect(member).to.be.an("object");
            expect(member).to.have.all.keys(
              "_id",
              "username",
              "password",
              "email",
              "avatar",
              "events",
              "friends",
              "__v"
            );
          });
          done();
        });
    });
  });

  describe("GET /EventMember/:eventId - Event Not Found", () => {
    it("should return an error if the event is not found", (done) => {
      const invalidEventId = "507f1f77bcf86cd799439011"; // nonexistent EventId
      chai
        .request(app)
        .get(`/addExpensePayer/EventMember/${invalidEventId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property(
            "message",
            "Event not found or you don't have access to it"
          );
          done();
        });
    });
  });
});
