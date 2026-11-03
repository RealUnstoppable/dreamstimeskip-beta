/**
 * js/mailbox.js
 * Universal User Mailbox Module:
 * Displays active Promo Codes / Coupons, Admin/Support Messages, and System Announcements.
 * Provides 1-click "Copy Code & Apply at Checkout" integration.
 */

import { db } from './firebase.js';
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { escapeHTML } from './utils.js';

export const DEFAULT_PROMO_CODES = [
    {
        code: 'WELCOME10',
        discountPercent: 10,
        description: '10% OFF entire order on all gear, apparel, and subscriptions.',
        tag: 'Welcome Gift',
        active: true
    },
    {
        code: 'VIP25',
        discountPercent: 25,
        description: '25% OFF for dedicated community fans and VIP supporters.',
        tag: 'VIP Special',
        active: true
    },
    {
        code: 'SUMMER20',
        discountPercent: 20,
        description: '20% OFF official Unstoppable Collection and DTS merchandise.',
        tag: 'Seasonal Drop',
        active: true
    },
    {
        code: 'MEDIXLYPRO',
        discountPercent: 90,
        description: '90% OFF First Month of Medixly Audio Pass ($1.00 intro rate).',
        tag: 'Audio Pass',
        active: true
    }
];

export async function fetchMailboxCoupons() {
    const list = [...DEFAULT_PROMO_CODES];
    const seen = new Set(list.map(c => c.code.toUpperCase()));

    try {
        if (db) {
            const snap = await getDocs(collection(db, 'promo_codes'));
            if (!snap.empty) {
                snap.docs.forEach(docSnap => {
                    const data = docSnap.data();
                    const code = (data.code || docSnap.id || '').toUpperCase();
                    if (code && !seen.has(code) && data.active !== false) {
                        seen.add(code);
                        list.unshift({
                            code: code,
                            discountPercent: Number(data.discountPercent || data.discount || 15),
                            description: data.description || `${data.discountPercent || 15}% OFF verified discount at checkout.`,
                            tag: data.stripeSync ? 'Stripe Verified' : 'Exclusive',
                            active: true
                        });
                    }
                });
            }
        }
    } catch (err) {
        console.warn('Manager info: Using preloaded promo codes for Mailbox:', err.message || err);
    }
    return list;
}

export function copyAndApplyCoupon(code) {
    if (!code) return;
    const cleanCode = code.toUpperCase().trim();
    
    // Copy to clipboard
    try {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(cleanCode);
        }
    } catch (_) {}

    // Store in localStorage for checkout / cart automatic application
    try {
        localStorage.setItem('activePromoCode', cleanCode);
    } catch (_) {}

    // Dispatch event for active carts
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('promoCodeApplied', { detail: { code: cleanCode } }));
    }
}

export function renderCouponCardsHtml(coupons) {
    return (coupons || DEFAULT_PROMO_CODES).map(c => `
        <div class="mailbox-coupon-card" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 18px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; transition: border-color 0.2s;">
            <div style="flex: 1; min-width: 200px;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                    <span style="font-family: monospace; font-size: 1.15rem; font-weight: 800; color: #fff; background: rgba(37,99,235,0.25); border: 1px dashed #3b82f6; padding: 4px 10px; border-radius: 6px; letter-spacing: 1px;">${escapeHTML(c.code)}</span>
                    <span style="background: #ef4444; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700;">${c.discountPercent}% OFF</span>
                    <span style="background: rgba(255,255,255,0.08); color: #94a3b8; padding: 3px 8px; border-radius: 4px; font-size: 0.72rem;">${escapeHTML(c.tag || 'Coupon')}</span>
                </div>
                <p style="color: var(--text-secondary, #94a3b8); margin: 0; font-size: 0.88rem; line-height: 1.4;">${escapeHTML(c.description)}</p>
            </div>
            <button type="button" class="apply-coupon-btn" data-code="${escapeHTML(c.code)}" style="background: #2563eb; hover: background: #1d4ed8; color: #fff; border: none; padding: 9px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s; white-space: nowrap;">
                <span>🎟️</span> Copy &amp; Apply at Checkout
            </button>
        </div>
    `).join('');
}

export function openUserMailboxModal() {
    if (typeof document === 'undefined') return;

    let modal = document.getElementById('user-mailbox-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'user-mailbox-modal';
        modal.className = 'user-mailbox-modal';
        modal.style.cssText = 'display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.75); backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px); z-index:100000; justify-content:center; align-items:center; padding:20px; box-sizing:border-box;';
        modal.innerHTML = `
            <div style="background:#0f1117; border:1px solid rgba(255,255,255,0.12); border-radius:18px; width:100%; max-width:680px; max-height:85vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.8);">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:18px 24px; border-bottom:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02);">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <span style="font-size:1.5rem;">📬</span>
                        <div>
                            <h3 style="margin:0; font-size:1.15rem; color:#fff;">User Mailbox &amp; Deals</h3>
                            <small style="color:#94a3b8;">Direct messages, coupons, and announcements</small>
                        </div>
                    </div>
                    <button type="button" id="close-mailbox-modal-btn" style="background:none; border:none; color:#94a3b8; font-size:1.6rem; cursor:pointer; line-height:1; padding:4px;" title="Close Mailbox">&times;</button>
                </div>
                
                <div style="display:flex; gap:8px; padding:12px 24px; border-bottom:1px solid rgba(255,255,255,0.08); background:rgba(0,0,0,0.2);">
                    <button type="button" class="mailbox-tab-btn active" data-tab="coupons" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15); color:#fff; padding:6px 14px; border-radius:20px; font-size:0.82rem; font-weight:600; cursor:pointer;">🎟️ Coupons</button>
                    <button type="button" class="mailbox-tab-btn" data-tab="messages" style="background:transparent; border:1px solid transparent; color:#94a3b8; padding:6px 14px; border-radius:20px; font-size:0.82rem; font-weight:500; cursor:pointer;">💬 Support</button>
                    <button type="button" class="mailbox-tab-btn" data-tab="announcements" style="background:transparent; border:1px solid transparent; color:#94a3b8; padding:6px 14px; border-radius:20px; font-size:0.82rem; font-weight:500; cursor:pointer;">📢 Announcements</button>
                </div>

                <div id="mailbox-content-container" style="flex:1; overflow-y:auto; padding:20px 24px;">
                    <div id="mailbox-tab-coupons">
                        <div style="margin-bottom:14px; font-size:0.88rem; color:#94a3b8;">
                            Exclusive discount codes sent to your account. Click to copy and automatically apply to your cart.
                        </div>
                        <div id="mailbox-coupons-list">
                            ${renderCouponCardsHtml(DEFAULT_PROMO_CODES)}
                        </div>
                    </div>
                    <div id="mailbox-tab-messages" style="display:none;">
                        <div style="text-align:center; padding:32px 16px; color:#94a3b8;">
                            <div style="font-size:2rem; margin-bottom:8px;">💬</div>
                            <h4 style="color:#fff; margin:0 0 6px;">No Pending Support Inquiries</h4>
                            <p style="font-size:0.88rem; margin:0 0 16px;">Have questions about an order or membership? Open a ticket anytime.</p>
                            <a href="account.html#support" style="display:inline-block; background:rgba(255,255,255,0.08); color:#fff; text-decoration:none; padding:8px 16px; border-radius:8px; font-size:0.85rem; font-weight:600;">Contact Support</a>
                        </div>
                    </div>
                    <div id="mailbox-tab-announcements" style="display:none;">
                        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:16px; margin-bottom:12px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <strong style="color:#fff; font-size:0.95rem;">🚀 Dreams TimeSkip Server Milestone</strong>
                                <span style="color:#64748b; font-size:0.75rem;">October 2026</span>
                            </div>
                            <p style="color:#94a3b8; font-size:0.85rem; margin:0;">Our persistent SMP architecture is currently in closed stress testing. Check the whitelist tab to secure your spot for the January 15, 2027 launch.</p>
                        </div>
                        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:16px;">
                            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                <strong style="color:#fff; font-size:0.95rem;">🎵 Medixly Audio Pass Launched</strong>
                                <span style="color:#64748b; font-size:0.75rem;">October 2026</span>
                            </div>
                            <p style="color:#94a3b8; font-size:0.85rem; margin:0;">Get high-definition lossless streams, custom 2D visual EQ curves, and offline stems for just $0.99 today.</p>
                        </div>
                    </div>
                </div>

                <div style="padding:14px 24px; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3);">
                    <span id="mailbox-toast-msg" style="color:#22c55e; font-size:0.85rem; font-weight:600; display:none;">✓ Code applied to checkout!</span>
                    <button type="button" id="mailbox-goto-cart-btn" onclick="window.location.href='cart.html'" style="margin-left:auto; background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.15); padding:8px 16px; border-radius:8px; font-size:0.85rem; font-weight:600; cursor:pointer;">View Cart &rarr;</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close listeners
        modal.querySelector('#close-mailbox-modal-btn').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        // Tab switching
        modal.querySelectorAll('.mailbox-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                modal.querySelectorAll('.mailbox-tab-btn').forEach(b => {
                    const active = b === btn;
                    b.classList.toggle('active', active);
                    b.style.background = active ? 'rgba(255,255,255,0.1)' : 'transparent';
                    b.style.borderColor = active ? 'rgba(255,255,255,0.15)' : 'transparent';
                    b.style.color = active ? '#fff' : '#94a3b8';
                });
                ['coupons', 'messages', 'announcements'].forEach(t => {
                    const el = modal.querySelector(`#mailbox-tab-${t}`);
                    if (el) el.style.display = t === tab ? 'block' : 'none';
                });
            });
        });

        // Copy button handling
        modal.addEventListener('click', (e) => {
            const btn = e.target.closest('.apply-coupon-btn');
            if (btn) {
                const code = btn.dataset.code;
                copyAndApplyCoupon(code);
                const toast = modal.querySelector('#mailbox-toast-msg');
                if (toast) {
                    toast.textContent = `✓ Copied "${code}"! Ready at checkout.`;
                    toast.style.display = 'inline-block';
                    setTimeout(() => { toast.style.display = 'none'; }, 3000);
                }
                const originalText = btn.innerHTML;
                btn.innerHTML = '✓ Copied!';
                btn.style.background = '#16a34a';
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '#2563eb';
                }, 2000);
            }
        });
    }

    modal.style.display = 'flex';

    // Populate live coupons asynchronously
    fetchMailboxCoupons().then(coupons => {
        const listEl = modal.querySelector('#mailbox-coupons-list');
        if (listEl) {
            listEl.innerHTML = renderCouponCardsHtml(coupons);
        }
    });
}

if (typeof window !== 'undefined') {
    window.openUserMailboxModal = openUserMailboxModal;
    window.copyAndApplyCoupon = copyAndApplyCoupon;
    window.fetchMailboxCoupons = fetchMailboxCoupons;
}
