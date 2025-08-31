<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Account | DTS HUB</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
     <link rel="icon" type="image/png" href="/images/dreams-favicon.png">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="themes.css">
    <style>
        :root {
            --bg-color: #0A0A0A;
            --primary-card-color: #141414;
            --secondary-card-color: #1f1f1f;
            --border-color: rgba(255, 255, 255, 0.1);
            --text-primary: #F5F5F7;
            --text-secondary: #A3A3A3;
            --accent-blue: #2563EB;
            --accent-red: #DC2626;
            --accent-green: #16A34A;
            --accent-yellow: #FBBF24;
            --accent-purple: #9333EA;
            --font-main: 'Inter', sans-serif;
        }
        body {
            font-family: var(--font-main);
            background-color: var(--bg-color);
            color: var(--text-primary);
            margin: 0;
            display: flex;
            justify-content: center;
            padding: 40px 20px;
        }
        .account-layout { display: flex; width: 100%; max-width: 1200px; gap: 30px; }
        .sidebar { width: 250px; flex-shrink: 0; }
        .btn-admin-back { display: none; background-color: var(--accent-yellow); color: var(--bg-color); padding: 12px; border-radius: 8px; text-align: center; font-weight: 600; text-decoration: none; margin-bottom: 20px; transition: opacity 0.2s; cursor: pointer; }
        .btn-admin-back:hover { opacity: 0.85; }
        .sidebar-header { padding: 20px; background-color: var(--primary-card-color); border-radius: 12px; margin-bottom: 20px; border: 1px solid var(--border-color); }
        .sidebar-header h2 { font-size: 1.2rem; margin: 0 0 5px 0; line-height: 1.2; }
        .sidebar-header p { font-size: 0.9rem; color: var(--text-secondary); margin: 0; word-wrap: break-word; }
        .sidebar-nav ul { list-style: none; padding: 0; margin: 0; }
        .sidebar-nav a { display: block; padding: 15px 20px; color: var(--text-secondary); text-decoration: none; border-radius: 8px; margin-bottom: 5px; font-weight: 500; transition: background-color 0.2s, color 0.2s; }
        .sidebar-nav a:hover { background-color: var(--primary-card-color); color: var(--text-primary); }
        .sidebar-nav a.active { background-color: var(--accent-blue); color: var(--text-primary); }
        .sign-out-btn { width: 100%; margin-top: 20px; padding: 15px 20px; background-color: var(--primary-card-color); border: 1px solid var(--border-color); color: var(--text-secondary); font-weight: 500; border-radius: 8px; cursor: pointer; transition: background-color 0.2s, color 0.2s; }
        .sign-out-btn:hover { background-color: var(--accent-red); color: var(--text-primary); border-color: var(--accent-red); }
        .main-content { flex-grow: 1; }
        .content-section { display: none; background-color: var(--primary-card-color); padding: 40px; border-radius: 12px; border: 1px solid var(--border-color); }
        .content-section.active { display: block; }
        .content-section h3 { font-size: 1.8rem; margin-top: 0; margin-bottom: 30px; }
        .card { background-color: var(--secondary-card-color); padding: 25px; border-radius: 8px; margin-bottom: 20px; border: 1px solid var(--border-color); }
        .card h4 { margin-top: 0; margin-bottom: 15px; font-size: 1.2rem; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; color: var(--text-secondary); margin-bottom: 8px; font-weight: 500; }
        .form-group input, .form-group select { width: 100%; padding: 12px; border: 1px solid var(--border-color); background-color: #2c2c2c; color: var(--text-primary); border-radius: 5px; box-sizing: border-box; font-size: 1rem; }
        .btn { padding: 12px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-block; text-align: center; border: 1px solid transparent; transition: all 0.2s; }
        .btn-primary { background-color: var(--accent-blue); color: white; }
        .btn-primary:hover { background-color: #1D4ED8; }
        .btn-danger { background-color: var(--accent-red); color: white; }
        .btn-danger:hover { background-color: #B91C1C; }
        #delete-account-card { border-color: var(--accent-red); }
        .notification { padding: 10px; border-radius: 6px; font-size: 0.9rem; margin-top: 15px; display: none; }
        .notification.success { background-color: rgba(22, 163, 74, 0.2); color: var(--accent-green); }
        .notification.error { background-color: rgba(220, 38, 38, 0.2); color: var(--accent-red); }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-block; margin-left: 10px; }
        .badge-premium { background-color: var(--accent-blue); color: white; }
        .badge-ultimate { background: linear-gradient(90deg, var(--accent-purple), var(--accent-blue)); color: white; }
        .feature-locked { opacity: 0.5; cursor: not-allowed; }
        .feature-locked label, .feature-locked input, .feature-locked select { pointer-events: none; }
        .custom-theme-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
        .custom-theme-grid input[type="color"] { width: 50px; height: 30px; padding: 0; border: none; background: none; }
    </style>
</head>
<body style="display: none;">
    <div class="account-layout">
        <aside class="sidebar">
            <a href="admin.html" id="admin-back-button" class="btn-admin-back">← Back to Admin Dashboard</a>
            <div class="sidebar-header">
                <h2 id="welcome-header">Loading...</h2>
                <p id="user-email-sidebar"></p>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="index.html">← Return to Home</a></li>
                    <li><a href="#dashboard" class="nav-link active">Dashboard</a></li>
                    <li><a href="#settings" class="nav-link">Settings</a></li>
                    <li><a href="#support" class="nav-link">Support</a></li>
                </ul>
            </nav>
            <button class="sign-out-btn" id="sign-out">Sign Out</button>
        </aside>
        <main class="main-content">
            <section id="dashboard" class="content-section active">
                <h3>Dashboard</h3>
                <div class="card">
                    <h4>Membership Status</h4>
                    <p>You are currently on the <strong id="membership-level">Standard</strong> plan.</p>
                    <a href="memberships.html" class="btn btn-primary">Upgrade Plan</a>
                </div>
            </section>
            <section id="settings" class="content-section">
                <h3>Settings</h3>
                <div class="card">
                    <h4>Update Profile</h4>
                    <form id="update-profile-form">
                        <div class="form-group">
                            <label for="update-username">Username</label>
                            <input type="text" id="update-username" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                        <div id="profile-notification" class="notification"></div>
                    </form>
                </div>

                <div class="card" id="display-settings-card">
                    <h4>Display Settings</h4>
                    <form id="theme-settings-form">
                        <div class="form-group">
                            <label for="theme-select">Theme</label>
                            <select id="theme-select">
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Accent Color</label>
                            <div>
                                <input type="radio" id="accent-blue" name="accent-color" value="blue"><label for="accent-blue"> Blue</label>
                                <input type="radio" id="accent-red" name="accent-color" value="red"><label for="accent-red"> Red</label>
                                <input type="radio" id="accent-green" name="accent-color" value="green"><label for="accent-green"> Green</label>
                                <input type="radio" id="accent-purple" name="accent-color" value="purple"><label for="accent-purple"> Purple</label>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Save Theme</button>
                        <div id="theme-notification" class="notification"></div>
                    </form>
                </div>
                
                <div class="card" id="custom-theme-card" style="display: none;">
                    <h4>Custom Theme Creator (Ultimate)</h4>
                    <form id="custom-theme-form">
                        <div class="custom-theme-grid">
                            <div class="form-group"><label for="custom-bg-color">Background</label><input type="color" id="custom-bg-color" data-var="--bg-color"></div>
                            <div class="form-group"><label for="custom-card-color">Cards</label><input type="color" id="custom-card-color" data-var="--primary-card-color"></div>
                            <div class="form-group"><label for="custom-text-color">Primary Text</label><input type="color" id="custom-text-color" data-var="--text-primary"></div>
                            <div class="form-group"><label for="custom-accent-color">Accent</label><input type="color" id="custom-accent-color" data-var="--accent-color"></div>
                        </div>
                        <button type="submit" class="btn btn-primary">Apply Custom Theme</button>
                        <div id="custom-theme-notification" class="notification"></div>
                    </form>
                </div>

                <div class="card" id="delete-account-card">
                    <h4>Delete Account</h4>
                    <button class="btn btn-danger" id="delete-account-btn">Delete My Account</button>
                </div>
            </section>
             <section id="support" class="content-section">
                <h3>Contact Support</h3>
                <a href="mailto:unstoppableplays2016@hotmail.com" class="btn btn-primary">Email Support</a>
            </section>
        </main>
    </div>

    <script type="module">
        import { auth, db } from './auth.js';
        import { onAuthStateChanged, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
        import { doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
        
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    document.body.style.display = 'flex'; 
                    initializePage(user, userDoc.data());
                    setupEventListeners(user, userDoc.data());
                } else {
                    signOut(auth);
                }
            } else {
                window.location.replace('sign in beta.html');
            }
        });

        function initializePage(user, userData) {
            // General setup
            if (userData.isAdmin) document.getElementById('admin-back-button').style.display = 'block';
            document.getElementById('welcome-header').textContent = `Welcome, ${userData.username}!`;
            document.getElementById('user-email-sidebar').textContent = user.email;
            document.getElementById('update-username').value = userData.username;

            // Membership setup
            const level = userData.membershipLevel || 'standard';
            const levelCapitalized = level.charAt(0).toUpperCase() + level.slice(1);
            document.getElementById('membership-level').textContent = levelCapitalized;
            if (level === 'premium' || level === 'ultimate') {
                const badge = `<span class="badge badge-${level}">${levelCapitalized}</span>`;
                document.getElementById('welcome-header').innerHTML += badge;
            }

            // Theme setup based on membership
            const displaySettingsCard = document.getElementById('display-settings-card');
            const customThemeCard = document.getElementById('custom-theme-card');
            
            if (level === 'standard') {
                displaySettingsCard.classList.add('feature-locked');
                displaySettingsCard.querySelector('h4').textContent = 'Display Settings (Premium required)';
            } else {
                displaySettingsCard.classList.remove('feature-locked');
                displaySettingsCard.querySelector('h4').textContent = 'Display Settings';
            }

            if (level === 'ultimate') {
                customThemeCard.style.display = 'block';
                // Load custom colors if they exist
                if (userData.customTheme) {
                    for (const [key, value] of Object.entries(userData.customTheme)) {
                        document.getElementById(key).value = value;
                    }
                }
            }
            
            // Load saved theme settings
            document.getElementById('theme-select').value = userData.theme || 'dark';
            const currentAccent = userData.accentColor || 'blue';
            document.querySelector(`input[name="accent-color"][value="${currentAccent}"]`).checked = true;
        }

        function setupEventListeners(user, userData) {
            document.getElementById('sign-out').addEventListener('click', () => signOut(auth));
            
            document.getElementById('update-profile-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const newUsername = document.getElementById('update-username').value;
                await updateDoc(doc(db, "users", user.uid), { username: newUsername });
                showNotification(document.getElementById('profile-notification'), 'Username updated!', 'success');
            });

            document.getElementById('theme-settings-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                if (userData.membershipLevel === 'standard') return;
                const theme = document.getElementById('theme-select').value;
                const accentColor = document.querySelector('input[name="accent-color"]:checked').value;
                await updateDoc(doc(db, "users", user.uid), { theme, accentColor });
                showNotification(document.getElementById('theme-notification'), 'Theme saved!', 'success');
            });

            document.getElementById('custom-theme-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const customTheme = {
                    'custom-bg-color': document.getElementById('custom-bg-color').value,
                    'custom-card-color': document.getElementById('custom-card-color').value,
                    'custom-text-color': document.getElementById('custom-text-color').value,
                    'custom-accent-color': document.getElementById('custom-accent-color').value
                };
                await updateDoc(doc(db, "users", user.uid), { customTheme });
                showNotification(document.getElementById('custom-theme-notification'), 'Custom theme applied!', 'success');
            });

             document.getElementById('delete-account-btn').addEventListener('click', async () => {
                if (confirm('DANGER: Are you sure you want to permanently delete your account?')) {
                    try {
                        await deleteDoc(doc(db, "users", user.uid));
                        await deleteUser(user);
                        alert('Account deleted.');
                    } catch (error) {
                        alert(`Error: ${error.message}. Please sign out and sign back in to continue.`);
                    }
                }
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', e => {
                    e.preventDefault();
                    document.querySelectorAll('.nav-link, .content-section').forEach(el => el.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    document.querySelector(e.currentTarget.getAttribute('href')).classList.add('active');
                });
            });
        }
        
        const showNotification = (element, message, type) => {
            element.textContent = message;
            element.className = `notification ${type}`;
            element.style.display = 'block';
            setTimeout(() => { element.style.display = 'none'; }, 3000);
        };
    </script>
</body>
</html>