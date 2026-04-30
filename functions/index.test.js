const test = require("firebase-functions-test")();

describe("createCheckoutSession", () => {
  let myFunctions;
  let mockStripe;

  beforeAll(() => {
    // We mock stripe so we can observe calls and control returns
    mockStripe = {
      checkout: {
        sessions: {
          create: jest.fn(),
        },
      },
    };

    // Override require('stripe') to return a function that returns our mockStripe
    jest.mock("stripe", () => {
      return jest.fn(() => mockStripe);
    });

    // We can just require the index.js file now that stripe is mocked
    myFunctions = require("./index.js");
  });

  afterAll(() => {
    test.cleanup();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 405 if method is not POST", (done) => {
    const req = { method: "GET", headers: { origin: "http://localhost" } };
    const res = {
      setHeader: () => {},
      getHeader: () => {},
      status: (code) => {
        expect(code).toBe(405);
        return {
          send: (msg) => {
            expect(msg).toBe("Method Not Allowed");
            done();
          },
        };
      },
    };

    myFunctions.createCheckoutSession(req, res);
  });

  it("should successfully create a checkout session and return 200", async () => {
    // Setup the mock to resolve with a fake session
    mockStripe.checkout.sessions.create.mockResolvedValue({
      url: "https://checkout.stripe.com/test",
    });

    const req = {
      method: "POST",
      headers: { origin: "http://localhost" },
      body: {
        uid: "test-uid",
        email: "test@example.com",
        plan: "Business Pro",
      },
    };

    // We can use a Promise to wait for the response since the function handles it asynchronously
    const responsePromise = new Promise((resolve) => {
      const res = {
        setHeader: () => {},
        getHeader: () => {},
        status: (code) => {
          return {
            json: (data) => {
              resolve({ code, data });
            },
            send: (msg) => {
              resolve({ code, data: msg });
            }
          };
        },
      };
      myFunctions.createCheckoutSession(req, res);
    });

    const { code, data } = await responsePromise;

    expect(code).toBe(200);
    expect(data).toEqual({ url: "https://checkout.stripe.com/test" });

    // Verify that stripe.checkout.sessions.create was called with the correct parameters
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledTimes(1);
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        payment_method_types: ["card"],
        customer_email: "test@example.com",
        line_items: [{ price: "price_1THHbVBp2C5GdKaKvCVoMf1X", quantity: 1 }],
      })
    );
  });

  it("should return 500 if stripe throws an error", async () => {
    // Setup the mock to reject with an error
    mockStripe.checkout.sessions.create.mockRejectedValue(new Error("Stripe API error"));

    const req = {
      method: "POST",
      headers: { origin: "http://localhost" },
      body: {
        uid: "test-uid",
        email: "test@example.com",
        plan: "Business Pro",
      },
    };

    const responsePromise = new Promise((resolve) => {
      const res = {
        setHeader: () => {},
        getHeader: () => {},
        status: (code) => {
          return {
            json: (data) => {
              resolve({ code, data });
            },
            send: (msg) => {
              resolve({ code, data: msg });
            }
          };
        },
      };
      myFunctions.createCheckoutSession(req, res);
    });

    const { code, data } = await responsePromise;

    expect(code).toBe(500);
    expect(data).toEqual({ error: "Stripe API error" });
    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledTimes(1);
  });
});
