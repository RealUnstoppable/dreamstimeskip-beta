/**
 * Medixly Stripe & Firestore Production Integration Handler
 * Handles checkout session creation, webhook lifecycle events, and tier synchronization.
 */

import { calculateMedixlyDailyPrice, TIER_CONFIG, getPricingSnapshot } from '../js/medixly-pricing-engine.js';

/**
 * Creates a Stripe Checkout Session for Medixly Memberships
 */
export async function createMedixlyCheckoutSession({
  plan = 'premium',
  billingCycle = 'monthly',
  mode = 'subscription',
  uid = 'guest',
  email = '',
  successUrl = '',
  cancelUrl = '',
  origin = 'https://realunstoppable.store',
  stripeClient
}) {
  if (!stripeClient) {
    throw new Error('Stripe client is not configured.');
  }

  const normTier = (plan || 'premium').toLowerCase();
  if (normTier !== 'premium' && normTier !== 'ultra') {
    throw new Error(`Invalid plan: ${plan}. Allowed plans are 'premium' or 'ultra'.`);
  }

  const normCycle = billingCycle === 'yearly' ? 'yearly' : 'monthly';
  const isOneTime = mode === 'payment';
  const tierConfig = TIER_CONFIG[normTier];
  const tierName = normTier === 'ultra' ? 'Ultra' : 'Premium';

  // Server-side authoritative price verification using daily escalation engine
  const currentPrice = calculateMedixlyDailyPrice(normTier, normCycle);
  const unitAmountInCents = Math.round(currentPrice * 100);

  const defaultSuccess = `${origin}/medixly-pricing.html?status=success&session_id={CHECKOUT_SESSION_ID}&tier=${normTier}`;
  const defaultCancel = `${origin}/medixly-pricing.html?status=cancelled`;

  const productName = `Medixly ${tierName} Membership (${normCycle === 'yearly' ? 'Yearly Lock' : 'Monthly Lock'})`;
  const description = isOneTime
    ? `One-Off ${normCycle === 'yearly' ? '1-Year' : '30-Day'} Promotional Access at locked rate of $${currentPrice.toFixed(2)}`
    : `Lifetime Price Lock at $${currentPrice.toFixed(2)}${normCycle === 'yearly' ? '/yr' : '/mo'} (Promotion Daily Escalation Guarantee)`;

  const lineItem = {
    price_data: {
      currency: 'usd',
      product_data: {
        name: productName,
        description: description,
        images: ['https://realunstoppable.store/images/medixly-logo.png'],
        metadata: {
          project: 'medixly',
          tier: normTier,
          billingCycle: normCycle
        }
      },
      unit_amount: unitAmountInCents,
      ...(!isOneTime ? {
        recurring: {
          interval: normCycle === 'yearly' ? 'year' : 'month'
        }
      } : {})
    },
    quantity: 1
  };

  const sessionConfig = {
    mode: isOneTime ? 'payment' : 'subscription',
    line_items: [lineItem],
    allow_promotion_codes: true,
    success_url: successUrl || defaultSuccess,
    cancel_url: cancelUrl || defaultCancel,
    metadata: {
      project: 'medixly',
      tier: normTier,
      plan: normTier,
      planName: `Medixly ${tierName}`,
      billingCycle: normCycle,
      orderType: isOneTime ? 'one_time_lock' : 'subscription',
      lockedPrice: currentPrice.toFixed(2),
      uid: uid || 'guest',
      userEmail: email || ''
    }
  };

  // If customer email is known, set it on the session
  if (email && email.includes('@')) {
    sessionConfig.customer_email = email;
  }

  // Set client reference ID if authenticated user
  if (uid && uid !== 'guest' && uid !== 'unknown') {
    sessionConfig.client_reference_id = uid;
  }

  const session = await stripeClient.checkout.sessions.create(sessionConfig);
  return {
    url: session.url,
    sessionId: session.id,
    lockedPrice: currentPrice,
    tier: normTier,
    billingCycle: normCycle,
    mode: sessionConfig.mode
  };
}

/**
 * Processes incoming Stripe Webhook events for Medixly
 */
export async function handleMedixlyWebhookEvent({ event, adminDb, FieldValue, stripeClient }) {
  if (!event || !event.type) {
    return { handled: false, error: 'Empty or invalid event object' };
  }

  const eventType = event.type;
  const eventData = event.data?.object;

  // 1. Checkout Session Completed
  if (eventType === 'checkout.session.completed') {
    const session = eventData;
    const metadata = session.metadata || {};

    if (metadata.project !== 'medixly') {
      return { handled: false, reason: 'Non-medixly project event' };
    }

    const tier = (metadata.tier || metadata.plan || 'premium').toLowerCase();
    const billingCycle = metadata.billingCycle || 'monthly';
    const lockedPrice = parseFloat(metadata.lockedPrice || '1.00');
    const orderType = metadata.orderType || 'subscription';
    let uid = metadata.uid;
    const customerEmail = session.customer_details?.email || session.customer_email || metadata.userEmail || '';

    // Calculate subscription period end
    const nowMs = Date.now();
    let durationMs = billingCycle === 'yearly' ? (365 * 24 * 60 * 60 * 1000) : (30 * 24 * 60 * 60 * 1000);
    const expiresAt = new Date(nowMs + durationMs);

    const subscriptionRecord = {
      status: 'active',
      tier: tier,
      plan: `Medixly ${tier === 'ultra' ? 'Ultra' : 'Premium'}`,
      planName: `Medixly ${tier === 'ultra' ? 'Ultra' : 'Premium'}`,
      billingCycle: billingCycle,
      lockedPrice: lockedPrice,
      currency: 'usd',
      orderType: orderType,
      customerId: session.customer || null,
      subscriptionId: session.subscription || null,
      sessionId: session.id,
      paymentIntentId: session.payment_intent || null,
      paymentStatus: session.payment_status || 'paid',
      startedAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
      expiresAt: expiresAt,
      updatedAt: FieldValue ? FieldValue.serverTimestamp() : new Date()
    };

    if (adminDb) {
      try {
        // If uid is 'guest' or missing, attempt to find user by email
        if ((!uid || uid === 'guest' || uid === 'unknown') && customerEmail) {
          const userSnap = await adminDb.collection('users').where('email', '==', customerEmail).limit(1).get();
          if (!userSnap.empty) {
            uid = userSnap.docs[0].id;
          }
        }

        if (uid && uid !== 'guest' && uid !== 'unknown') {
          const userRef = adminDb.collection('users').doc(uid);
          await userRef.set({
            membershipLevel: tier,
            tier: tier,
            plan: `Medixly ${tier === 'ultra' ? 'Ultra' : 'Premium'}`,
            medixlySubscription: subscriptionRecord,
            subscription: {
              status: 'active',
              customerId: session.customer || null,
              subscriptionId: session.subscription || null,
              tier: tier
            }
          }, { merge: true });

          // Send welcome/confirmation notification
          await adminDb.collection('notifications').add({
            userId: uid,
            title: `Medixly ${tier === 'ultra' ? 'Ultra' : 'Premium'} Activated! 🎶`,
            message: `Your promotional rate of $${lockedPrice.toFixed(2)} is locked in! Enjoy uninterrupted, crystal-clear streaming.`,
            isRead: false,
            createdAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
            link: 'medixly.html',
            type: 'membership_upgrade'
          });
        }

        // Store persistent record in membership_orders
        await adminDb.collection('membership_orders').doc(session.id).set({
          orderId: `MDX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          project: 'medixly',
          userId: uid || 'guest',
          userEmail: customerEmail,
          tier: tier,
          billingCycle: billingCycle,
          lockedPrice: lockedPrice,
          totalAmount: session.amount_total ? session.amount_total / 100 : lockedPrice,
          stripeSessionId: session.id,
          stripeCustomerId: session.customer || null,
          stripeSubscriptionId: session.subscription || null,
          status: 'paid',
          createdAt: FieldValue ? FieldValue.serverTimestamp() : new Date()
        });

        return { handled: true, event: eventType, uid, tier, lockedPrice };
      } catch (dbErr) {
        console.error('Error updating Firestore on checkout.session.completed:', dbErr);
        return { handled: true, error: dbErr.message };
      }
    }

    return { handled: true, event: eventType, uid, tier, lockedPrice };
  }

  // 2. Subscription Cancelled / Deleted
  if (eventType === 'customer.subscription.deleted') {
    const sub = eventData;
    const customerId = sub.customer;

    if (adminDb && customerId) {
      try {
        const snap = await adminDb.collection('users')
          .where('medixlySubscription.customerId', '==', customerId)
          .get();

        const updates = snap.docs.map(doc => {
          return doc.ref.update({
            membershipLevel: 'free',
            tier: 'free',
            'medixlySubscription.status': 'canceled',
            'medixlySubscription.canceledAt': FieldValue ? FieldValue.serverTimestamp() : new Date(),
            'subscription.status': 'canceled'
          });
        });

        await Promise.all(updates);
        return { handled: true, event: eventType, affectedUsers: snap.size };
      } catch (err) {
        console.error('Error handling customer.subscription.deleted:', err);
        return { handled: false, error: err.message };
      }
    }
  }

  // 3. Subscription Updated (e.g. renewal or status change)
  if (eventType === 'customer.subscription.updated') {
    const sub = eventData;
    const customerId = sub.customer;
    const status = sub.status; // active, past_due, canceled, etc.
    const currentPeriodEnd = new Date(sub.current_period_end * 1000);

    if (adminDb && customerId) {
      try {
        const snap = await adminDb.collection('users')
          .where('medixlySubscription.customerId', '==', customerId)
          .get();

        const updates = snap.docs.map(doc => {
          const isStillActive = status === 'active';
          return doc.ref.update({
            ...(isStillActive ? {} : { membershipLevel: 'free', tier: 'free' }),
            'medixlySubscription.status': status,
            'medixlySubscription.currentPeriodEnd': currentPeriodEnd,
            'subscription.status': status
          });
        });

        await Promise.all(updates);
        return { handled: true, event: eventType, affectedUsers: snap.size, status };
      } catch (err) {
        console.error('Error handling customer.subscription.updated:', err);
        return { handled: false, error: err.message };
      }
    }
  }

  // 4. Payment Failure Notification
  if (eventType === 'invoice.payment_failed') {
    const invoice = eventData;
    const customerId = invoice.customer;

    if (adminDb && customerId) {
      try {
        const snap = await adminDb.collection('users')
          .where('medixlySubscription.customerId', '==', customerId)
          .get();

        const updates = snap.docs.map(doc => {
          const userRef = doc.ref;
          return Promise.all([
            userRef.update({
              'medixlySubscription.status': 'past_due',
              'medixlySubscription.lastPaymentError': invoice.last_finalization_error?.message || 'Payment failed'
            }),
            adminDb.collection('notifications').add({
              userId: doc.id,
              title: 'Medixly Payment Issue ⚠️',
              message: 'Your recent membership renewal payment could not be processed. Please update your payment method to maintain your locked rate.',
              isRead: false,
              createdAt: FieldValue ? FieldValue.serverTimestamp() : new Date(),
              link: 'account.html',
              type: 'payment_failed'
            })
          ]);
        });

        await Promise.all(updates);
        return { handled: true, event: eventType, affectedUsers: snap.size };
      } catch (err) {
        console.error('Error handling invoice.payment_failed:', err);
        return { handled: false, error: err.message };
      }
    }
  }

  // 5. Checkout Session Expired
  if (eventType === 'checkout.session.expired') {
    return { handled: true, event: eventType, sessionId: eventData.id };
  }

  return { handled: false, event: eventType, reason: 'Event not handled by Medixly processor' };
}
