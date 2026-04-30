const {expect} = require("chai");
const sinon = require("sinon");
require("firebase-functions-test")();

// Stub out firebase-admin before requiring index.js
const admin = require("firebase-admin");
sinon.stub(admin, "initializeApp");

const myFunctions = require("./index.js");

describe("stripeWebhook", () => {
  let req;
  let res;
  let statusStub;
  let sendStub;
  let jsonStub;
  let consoleErrorStub;

  beforeEach(() => {
    statusStub = sinon.stub();
    sendStub = sinon.stub();
    jsonStub = sinon.stub();

    // Silence the console.error output during the test
    consoleErrorStub = sinon.stub(console, "error");

    res = {
      status: statusStub,
      send: sendStub,
      json: jsonStub,
    };

    // Make status return res to allow chaining res.status().send()
    statusStub.returns(res);

    req = {
      headers: {
        "stripe-signature": "invalid_signature",
      },
      rawBody: "fake_raw_body",
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return 400 when stripe signature verification fails", async () => {
    // Calling the function with dummy data should automatically throw an error
    await myFunctions.stripeWebhook(req, res);

    expect(statusStub.calledWith(400)).to.be.true;
    expect(sendStub.calledOnce).to.be.true;
    expect(sendStub.firstCall.args[0]).to.include("Webhook Error:");
    expect(consoleErrorStub.called).to.be.true;
  });
});
