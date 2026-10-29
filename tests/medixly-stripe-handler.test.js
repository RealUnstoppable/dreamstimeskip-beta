import { jest } from '@jest/globals';
import {
  createMedixlyCheckoutSession,
  handleMedixlyWebhookEvent
} from '../backend/medixly-stripe-handler.js';

describe('Medixly Stripe Handler & Webhook Integration', () => {
  let mockStripe;
  let mockAdminDb;
  let mockFieldValue;

  beforeEach(() => {
    mockStripe = {
      checkout: {
        sessions: {
          create: jest.fn().mockResolvedValue({
            id: 'cs_test_123',
            url: 'https://checkout.stripe.com/pay/cs_test_123'
          })
        }
      }
    };

    mockFieldValue = {
      serverTimestamp: jest.fn(() => ({ _methodName: 'serverTimestamp' }))
    };

    const mockDocRef = {
      set: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      get: jest.fn().mockResolvedValue({ exists: true, data: () => ({ email: 'fan@example.com' }) })
    };

    mockAdminDb = {
      collection: jest.fn((colName) => {
        if (colName === 'users') {
          return {
            doc: jest.fn(() => mockDocRef),
            where: jest.fn(() => ({
              limit: jest.fn(() => ({
                get: jest.fn().mockResolvedValue({
                  empty: false,
                  docs: [{ id: 'user_found_123', ref: mockDocRef, data: () => ({ email: 'fan@example.com' }) }]
                })
              })),
              get: jest.fn().mockResolvedValue({
                empty: false,
                size: 1,
                docs: [{ id: 'user_found_123', ref: mockDocRef, data: () => ({ email: 'fan@example.com' }) }]
              })
            }))
          };
        }
        if (colName === 'notifications' || colName === 'membership_orders') {
          return {
            doc: jest.fn(() => mockDocRef),
            add: jest.fn().mockResolvedValue({ id: 'notif_123' })
          };
        }
        return {
          doc: jest.fn(() => mockDocRef)
        };
      })
    };
  });

  describe('createMedixlyCheckoutSession', () => {
    it('throws error if Stripe client is not provided', async () => {
      await expect(createMedixlyCheckoutSession({ plan: 'premium', stripeClient: null }))
        .rejects.toThrow('Stripe client is not configured.');
    });

    it('throws error for invalid plan', async () => {
      await expect(createMedixlyCheckoutSession({ plan: 'diamond', stripeClient: mockStripe }))
        .rejects.toThrow("Invalid plan: diamond. Allowed plans are 'premium' or 'ultra'.");
    });

    it('creates a monthly recurring subscription session for Premium', async () => {
      const res = await createMedixlyCheckoutSession({
        plan: 'premium',
        billingCycle: 'monthly',
        mode: 'subscription',
        uid: 'user_test_999',
        email: 'listener@example.com',
        origin: 'https://realunstoppable.store',
        stripeClient: mockStripe
      });

      expect(res.sessionId).toBe('cs_test_123');
      expect(res.url).toContain('https://checkout.stripe.com');
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledTimes(1);

      const callArgs = mockStripe.checkout.sessions.create.mock.calls[0][0];
      expect(callArgs.mode).toBe('subscription');
      expect(callArgs.metadata.project).toBe('medixly');
      expect(callArgs.metadata.tier).toBe('premium');
      expect(callArgs.line_items[0].price_data.recurring.interval).toBe('month');
      expect(callArgs.customer_email).toBe('listener@example.com');
      expect(callArgs.client_reference_id).toBe('user_test_999');
    });

    it('creates a yearly recurring subscription session for Ultra with 2 months free', async () => {
      const res = await createMedixlyCheckoutSession({
        plan: 'ultra',
        billingCycle: 'yearly',
        mode: 'subscription',
        uid: 'user_vip_777',
        email: 'vip@example.com',
        stripeClient: mockStripe
      });

      expect(res.tier).toBe('ultra');
      expect(res.billingCycle).toBe('yearly');

      const callArgs = mockStripe.checkout.sessions.create.mock.calls[0][0];
      expect(callArgs.mode).toBe('subscription');
      expect(callArgs.line_items[0].price_data.recurring.interval).toBe('year');
      expect(callArgs.metadata.tier).toBe('ultra');
    });

    it('creates a one-time promotional lock session when mode is payment', async () => {
      const res = await createMedixlyCheckoutSession({
        plan: 'premium',
        billingCycle: 'monthly',
        mode: 'payment',
        uid: 'user_onetime',
        stripeClient: mockStripe
      });

      expect(res.mode).toBe('payment');
      const callArgs = mockStripe.checkout.sessions.create.mock.calls[0][0];
      expect(callArgs.mode).toBe('payment');
      expect(callArgs.line_items[0].price_data.recurring).toBeUndefined();
    });
  });

  describe('handleMedixlyWebhookEvent', () => {
    it('gracefully ignores non-medixly events', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            metadata: { project: 'ezmanage' }
          }
        }
      };

      const result = await handleMedixlyWebhookEvent({ event, adminDb: mockAdminDb, FieldValue: mockFieldValue, stripeClient: mockStripe });
      expect(result.handled).toBe(false);
      expect(result.reason).toContain('Non-medixly');
    });

    it('activates user subscription in Firestore upon checkout.session.completed', async () => {
      const event = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_medixly_abc',
            customer: 'cus_stripe_123',
            subscription: 'sub_stripe_456',
            payment_status: 'paid',
            metadata: {
              project: 'medixly',
              tier: 'premium',
              billingCycle: 'monthly',
              lockedPrice: '1.00',
              uid: 'user_test_999'
            }
          }
        }
      };

      const result = await handleMedixlyWebhookEvent({ event, adminDb: mockAdminDb, FieldValue: mockFieldValue, stripeClient: mockStripe });
      expect(result.handled).toBe(true);
      expect(result.tier).toBe('premium');
      expect(result.lockedPrice).toBe(1.00);
      expect(mockAdminDb.collection).toHaveBeenCalledWith('users');
      expect(mockAdminDb.collection).toHaveBeenCalledWith('notifications');
      expect(mockAdminDb.collection).toHaveBeenCalledWith('membership_orders');
    });

    it('reverts user tier to free upon customer.subscription.deleted', async () => {
      const event = {
        type: 'customer.subscription.deleted',
        data: {
          object: {
            customer: 'cus_stripe_123',
            id: 'sub_stripe_456'
          }
        }
      };

      const result = await handleMedixlyWebhookEvent({ event, adminDb: mockAdminDb, FieldValue: mockFieldValue, stripeClient: mockStripe });
      expect(result.handled).toBe(true);
      expect(result.affectedUsers).toBe(1);
    });

    it('flags past_due upon invoice.payment_failed and sends notification', async () => {
      const event = {
        type: 'invoice.payment_failed',
        data: {
          object: {
            customer: 'cus_stripe_123',
            last_finalization_error: { message: 'Card declined (insufficient funds)' }
          }
        }
      };

      const result = await handleMedixlyWebhookEvent({ event, adminDb: mockAdminDb, FieldValue: mockFieldValue, stripeClient: mockStripe });
      expect(result.handled).toBe(true);
      expect(mockAdminDb.collection).toHaveBeenCalledWith('notifications');
    });

    it('handles checkout.session.expired gracefully', async () => {
      const event = {
        type: 'checkout.session.expired',
        data: {
          object: { id: 'cs_expired_789' }
        }
      };

      const result = await handleMedixlyWebhookEvent({ event, adminDb: mockAdminDb, FieldValue: mockFieldValue, stripeClient: mockStripe });
      expect(result.handled).toBe(true);
      expect(result.sessionId).toBe('cs_expired_789');
    });
  });
});
