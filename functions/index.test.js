const testEnv = require("firebase-functions-test")();

// Mock Stripe BEFORE importing index.js
const mockCreateSession = jest.fn();
jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: mockCreateSession,
      },
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
    subscriptions: {
      list: jest.fn(),
      cancel: jest.fn(),
    },
  }));
});

// Mock request and response objects
const mockReq = (options = {}) => ({
  method: "POST",
  body: {},
  headers: {},
  ...options,
});

const mockRes = () => {
  const res = {};
  res.setHeader = jest.fn();
  res.getHeader = jest.fn();
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Import functions after mocks
const {createCheckoutSession} = require("./index.js");

describe("createCheckoutSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    testEnv.cleanup();
  });

  it("should return 405 Method Not Allowed for non-POST requests", async () => {
    const req = mockReq({method: "GET"});
    const res = mockRes();

    // The function might return before internal promise is resolved,
    // wrapping it to ensure it completes before asserting
    await new Promise((resolve) => {
      res.send.mockImplementation(() => resolve());
      createCheckoutSession(req, res);
    });

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.send).toHaveBeenCalledWith("Method Not Allowed");
  });

  it("should create session with Pro plan & fallback URLs", async () => {
    mockCreateSession.mockResolvedValueOnce({
      url: "https://checkout.stripe.com/test-url",
    });

    const req = mockReq({
      method: "POST",
      body: {
        uid: "user123",
        email: "test@example.com",
      },
    });
    const res = mockRes();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      createCheckoutSession(req, res);
    });

    expect(mockCreateSession).toHaveBeenCalledWith(expect.objectContaining({
      customer_email: "test@example.com",
      line_items: [{price: "price_1THHYPBp2C5GdKaKxNpqndNE", quantity: 1}],
      success_url: "https://dreamstimeskip-beta.pages.dev/tracker?success=true",
      cancel_url: "https://dreamstimeskip-beta.pages.dev/tracker?canceled=true",
      metadata: {
        uid: "user123",
        planName: "Pro", // default if not provided
      },
    }));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({url: "https://checkout.stripe.com/test-url"});
  });

  it("should create session with Business Pro & custom URLs", async () => {
    mockCreateSession.mockResolvedValueOnce({
      url: "https://checkout.stripe.com/biz-url",
    });

    const req = mockReq({
      method: "POST",
      body: {
        uid: "bizuser",
        email: "biz@example.com",
        plan: "Business Pro",
        successUrl: "https://mycustomurl.com/success",
        cancelUrl: "https://mycustomurl.com/cancel",
      },
    });
    const res = mockRes();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      createCheckoutSession(req, res);
    });

    expect(mockCreateSession).toHaveBeenCalledWith(expect.objectContaining({
      customer_email: "biz@example.com",
      line_items: [{price: "price_1THHbVBp2C5GdKaKvCVoMf1X", quantity: 1}],
      success_url: "https://mycustomurl.com/success",
      cancel_url: "https://mycustomurl.com/cancel",
      metadata: {
        uid: "bizuser",
        planName: "Business Pro",
      },
    }));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({url: "https://checkout.stripe.com/biz-url"});
  });

  it("should handle stripe session errors and return 500", async () => {
    // Suppress console.error in tests for expected errors
    jest.spyOn(console, "error").mockImplementation(() => {});

    mockCreateSession.mockRejectedValueOnce(new Error("Stripe API Error"));

    const req = mockReq({
      method: "POST",
      body: {email: "test@example.com"},
    });
    const res = mockRes();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      createCheckoutSession(req, res);
    });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error: "Stripe API Error"});

    console.error.mockRestore();
  });
});
