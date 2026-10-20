// backend/index.js
// Exported endpoints from Cloud Functions codebase
const { createProduct, createCheckoutSession, adminAction, stripeWebhook } = require("../functions/index.js");

module.exports = {
  createProduct,
  createCheckoutSession,
  adminAction,
  stripeWebhook,
};
