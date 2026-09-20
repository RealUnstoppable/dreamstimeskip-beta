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

// Mock firebase-admin since we now use it in createCheckoutSession
jest.mock("firebase-admin", () => {
  const mockVerifyIdToken = jest.fn();
  return {
    initializeApp: jest.fn(),
    auth: jest.fn().mockReturnValue({
      verifyIdToken: mockVerifyIdToken,
    }),
    _mockVerifyIdToken: mockVerifyIdToken, // Export for tests to access
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnValue({
        doc: jest.fn().mockReturnValue({
          get: jest.fn(),
          set: jest.fn(),
          update: jest.fn(),
        }),
        where: jest.fn().mockReturnValue({
          get: jest.fn(),
        }),
      }),
    }),
  };
});


jest.mock("firebase-functions", () => {
  const originalModule = jest.requireActual("firebase-functions");
  return {
    ...originalModule,
    https: {
      ...originalModule.https,
      onRequest: jest.fn((cb) => cb),
    },
    firestore: {
      ...originalModule.firestore,
      document: jest.fn().mockReturnValue({
        onWrite: jest.fn(),
      }),
    },
  };
});

jest.mock("firebase-functions/v2/firestore", () => {
  return {
    onDocumentUpdated: jest.fn(),
    onDocumentCreated: jest.fn(),
  };
});

// Import functions after mocks
const {createCheckoutSession, adminAction} = require("./index.js");

describe("createCheckoutSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require("firebase-admin")._mockVerifyIdToken.mockResolvedValue({
      uid: "user123",
      email: "test@example.com",
    });
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

  it("should return 401 if missing Authorization header", async () => {
    const req = mockReq({method: "POST"});
    const res = mockRes();

    await new Promise((resolve) => {
      res.send.mockImplementation(() => resolve());
      createCheckoutSession(req, res);
    });

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Unauthorized");
  });

  it("should create session with Pro plan & fallback URLs", async () => {
    require("firebase-admin")._mockVerifyIdToken.mockResolvedValueOnce({
      uid: "user123",
      email: "test@example.com",
    });
    mockCreateSession.mockResolvedValueOnce({
      url: "https://checkout.stripe.com/test-url",
    });

    const req = mockReq({
      method: "POST",
      headers: {
        authorization: "Bearer valid-token",
      },
      body: {
        plan: "Pro",
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
    require("firebase-admin")._mockVerifyIdToken.mockResolvedValue({
      uid: "bizuser",
      email: "biz@example.com",
    });

    mockCreateSession.mockResolvedValueOnce({
      url: "https://checkout.stripe.com/biz-url",
    });

    const req = mockReq({
      method: "POST",
      headers: {
        authorization: "Bearer valid-token",
      },
      body: {
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

    require("firebase-admin")._mockVerifyIdToken.mockResolvedValueOnce({
      uid: "user123",
      email: "test@example.com",
    });
    mockCreateSession.mockRejectedValueOnce(new Error("Stripe API Error"));

    const req = mockReq({
      method: "POST",
      headers: {
        authorization: "Bearer valid-token",
      },
      body: {},
    });
    const res = mockRes();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      createCheckoutSession(req, res);
    });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({error: "Checkout Error. Manager info: [Stripe API Error]"});

    console.error.mockRestore();
  });

  it("should return 401 if missing Authorization header", async () => {
    const req = mockReq({
      method: "POST",
      body: {
        plan: "Pro",
      },
    });
    const res = mockRes();

    await new Promise((resolve) => {
      res.send.mockImplementation(() => resolve());
      createCheckoutSession(req, res);
    });

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Unauthorized");
  });

  it("should return 401 if verification fails", async () => {
    const error = new Error("Token Expired");
    require("firebase-admin")._mockVerifyIdToken.mockRejectedValueOnce(error);
    jest.spyOn(console, "error").mockImplementation(() => {});

    const req = mockReq({
      method: "POST",
      headers: {
        authorization: "Bearer invalid-token",
      },
      body: {
        plan: "Pro",
      },
    });
    const res = mockRes();

    await new Promise((resolve) => {
      res.send.mockImplementation(() => resolve());
      createCheckoutSession(req, res);
    });

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith("Unauthorized");

    console.error.mockRestore();
  });
});


describe("adminAction", () => {
  let mockGetDoc;
  let mockUpdateDoc;
  let mockDeleteDoc;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDoc = jest.fn();
    mockUpdateDoc = jest.fn();
    mockDeleteDoc = jest.fn();

    // Override the mock we set up earlier for admin
    require("firebase-admin").firestore().collection().doc.mockReturnValue({
      get: mockGetDoc,
      update: mockUpdateDoc,
      delete: mockDeleteDoc,
    });

    require("firebase-admin")._mockVerifyIdToken.mockResolvedValue({
      uid: "admin123",
      email: "admin@example.com",
    });
  });

  it("should return 405 Method Not Allowed for non-POST requests", async () => {
    const req = mockReq({method: "GET"});
    const res = mockRes();

    await new Promise((resolve) => {
      res.send.mockImplementation(() => resolve());
      adminAction(req, res);
    });

    expect(res.status).toHaveBeenCalledWith(405);
  });

  it("should return 401 if missing Authorization header", async () => {
    const req = mockReq({method: "POST"});
    const res = mockRes();

    await new Promise((resolve) => {
      res.send.mockImplementation(() => resolve());
      adminAction(req, res);
    });

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return 403 if user is not an admin", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: true,
      data: () => ({ isAdmin: false })
    });

    const req = mockReq({
      method: "POST",
      headers: { authorization: "Bearer valid-token" },
      body: { action: "update", collection: "users", docId: "u1" }
    });
    const res = mockRes();

    await new Promise((resolve) => {
      res.send.mockImplementation(() => resolve());
      adminAction(req, res);
    });

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it("should return 400 for invalid collection", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: true,
      data: () => ({ isAdmin: true })
    });

    const req = mockReq({
      method: "POST",
      headers: { authorization: "Bearer valid-token" },
      body: { action: "update", collection: "secrets", docId: "s1", data: {} }
    });
    const res = mockRes();

    await new Promise((resolve) => {
      res.send.mockImplementation(() => resolve());
      adminAction(req, res);
    });

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should perform an update successfully", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: true,
      data: () => ({ isAdmin: true })
    });

    mockUpdateDoc.mockResolvedValueOnce();

    const req = mockReq({
      method: "POST",
      headers: { authorization: "Bearer valid-token" },
      body: { action: "update", collection: "users", docId: "u1", data: { isBanned: true } }
    });
    const res = mockRes();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      adminAction(req, res);
    });

    expect(mockUpdateDoc).toHaveBeenCalledWith({ isBanned: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("should perform a delete successfully", async () => {
    mockGetDoc.mockResolvedValueOnce({
      exists: true,
      data: () => ({ isAdmin: true })
    });

    mockDeleteDoc.mockResolvedValueOnce();

    const req = mockReq({
      method: "POST",
      headers: { authorization: "Bearer valid-token" },
      body: { action: "delete", collection: "quotes", docId: "q1" }
    });
    const res = mockRes();

    await new Promise((resolve) => {
      res.json.mockImplementation(() => resolve());
      adminAction(req, res);
    });

    expect(mockDeleteDoc).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});
