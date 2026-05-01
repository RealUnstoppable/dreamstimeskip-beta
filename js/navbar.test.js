import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadNavbar } from './navbar.js';

// Mock dependencies
vi.mock('./auth.js', () => ({
  auth: {},
  db: {}
}));

let mockAuthStateCallback = null;
vi.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js', () => ({
  onAuthStateChanged: vi.fn((auth, cb) => {
    mockAuthStateCallback = cb;
  })
}));

let mockDocExists = false;
let mockDocData = {};
let mockDocError = null;

vi.mock('https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(async () => {
    if (mockDocError) throw mockDocError;
    return {
      exists: () => mockDocExists,
      data: () => mockDocData
    };
  })
}));

describe('navbar', () => {
  beforeEach(() => {
    // Reset document
    document.body.innerHTML = `
      <header class="main-header"></header>
    `;
    vi.clearAllMocks();
    mockAuthStateCallback = null;
    mockDocExists = false;
    mockDocData = {};
    mockDocError = null;
  });

  it('injects navbar HTML into main-header', () => {
    loadNavbar();
    const header = document.querySelector('.main-header');
    expect(header.innerHTML).toContain('<nav class="navbar">');
    expect(header.innerHTML).toContain('href="unstoppable.html"');
    expect(header.innerHTML).toContain('href="dreamstimeskip.html"');
  });

  it('attaches click event to hamburger menu', () => {
    loadNavbar();

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    expect(hamburger.classList.contains('active')).toBe(false);
    expect(navLinks.classList.contains('active')).toBe(false);

    hamburger.click();

    expect(hamburger.classList.contains('active')).toBe(true);
    expect(navLinks.classList.contains('active')).toBe(true);

    hamburger.click();

    expect(hamburger.classList.contains('active')).toBe(false);
    expect(navLinks.classList.contains('active')).toBe(false);
  });

  it('updates auth link to "Sign In / Sign Up" when not logged in', async () => {
    loadNavbar();

    // Simulate auth state change (not logged in)
    if (mockAuthStateCallback) {
        await mockAuthStateCallback(null);
    }

    const authLink = document.getElementById('auth-link');
    expect(authLink.textContent).toBe("Sign In / Sign Up");
    expect(authLink.getAttribute('href')).toBe('sign in beta.html');
  });

  it('updates auth link to "My Account" and account.html when logged in as regular user', async () => {
    loadNavbar();

    mockDocExists = true;
    mockDocData = { isAdmin: false };

    // Simulate auth state change (logged in)
    if (mockAuthStateCallback) {
        await mockAuthStateCallback({ uid: 'user123' });
    }

    // Wait for the async getDoc call to complete and update DOM
    await new Promise(process.nextTick);

    const authLink = document.getElementById('auth-link');
    expect(authLink.textContent).toBe("My Account");
    expect(authLink.getAttribute('href')).toBe('account.html');
  });

  it('updates auth link to "My Account" and admin.html when logged in as admin user', async () => {
    loadNavbar();

    mockDocExists = true;
    mockDocData = { isAdmin: true };

    // Simulate auth state change (logged in)
    if (mockAuthStateCallback) {
        await mockAuthStateCallback({ uid: 'admin123' });
    }

    // Wait for the async getDoc call to complete and update DOM
    await new Promise(process.nextTick);

    const authLink = document.getElementById('auth-link');
    expect(authLink.textContent).toBe("My Account");
    expect(authLink.getAttribute('href')).toBe('admin.html');
  });

  it('handles getDoc error gracefully', async () => {
    loadNavbar();

    mockDocError = new Error("Database error");

    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Simulate auth state change (logged in)
    if (mockAuthStateCallback) {
        await mockAuthStateCallback({ uid: 'user123' });
    }

    // Wait for the async getDoc call to complete and update DOM
    await new Promise(process.nextTick);

    expect(consoleSpy).toHaveBeenCalledWith("Nav Error", mockDocError);

    consoleSpy.mockRestore();
  });
});
