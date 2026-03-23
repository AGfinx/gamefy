// ============================================================
//  auth.js  –  Shared auth & user data helpers
// ============================================================

const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };

// Seed default users if none exist
function initStorage() {
    if (!localStorage.getItem("gf_users")) {
        const defaultUsers = [
            {
                id: "u1",
                username: "demo",
                password: "demo123",
                name: "Demo User",
                email: "demo@gamefy.com",
                avatar: "🐍",
                xp: 320,
                gems: 250,
                streak: 5,
                joinDate: "2024-11-01",
                completedChapters: [1, 2, 3],
                achievements: ["first_step", "on_fire", "gem_collector"],
                lastLogin: new Date().toISOString()
            }
        ];
        localStorage.setItem("gf_users", JSON.stringify(defaultUsers));
    }
}

function getUsers() {
    return JSON.parse(localStorage.getItem("gf_users") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("gf_users", JSON.stringify(users));
}

function checkAndUpdateStreak(user) {
    const now = new Date();
    
    if (!user.lastLogin) {
        user.lastLogin = now.toISOString();
        if(user.streak === 0) user.streak = 1;
        updateUser(user);
        return user;
    }

    const lastLoginDate = new Date(user.lastLogin);
    
    if (user.streak === 0) {
        user.streak = 1;
    }

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const last = new Date(lastLoginDate.getFullYear(), lastLoginDate.getMonth(), lastLoginDate.getDate());
    
    if (today > last) {
        const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            user.streak += 1;
        } else if (diffDays > 1) {
            user.streak = 1;
        }
        user.lastLogin = now.toISOString();
        updateUser(user);
    }
    return user;
}

function getCurrentUser() {
    const id = sessionStorage.getItem("gf_current_user");
    if (!id) return null;
    let user = getUsers().find(u => u.id === id) || null;
    if (user) {
        user = checkAndUpdateStreak(user);
    }
    return user;
}

function setCurrentUser(user) {
    sessionStorage.setItem("gf_current_user", user.id);
}

function logout() {
    sessionStorage.removeItem("gf_current_user");
    window.location.href = "login.html";
}

function requireLogin() {
    if (!getCurrentUser()) {
        window.location.href = "login.html";
    }
}

function updateUser(updatedUser) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
        users[idx] = updatedUser;
        saveUsers(users);
    }
}

function register(name, username, email, password) {
    const users = getUsers();
    if (users.find(u => u.username === username)) return { ok: false, msg: "Username already taken." };
    if (users.find(u => u.email === email)) return { ok: false, msg: "Email already registered." };
    const newUser = {
        id: "u" + Date.now(),
        username,
        password,
        name,
        email,
        avatar: "🐍",
        xp: 0,
        gems: 50,
        streak: 0,
        joinDate: new Date().toISOString().slice(0, 10),
        completedChapters: [],
        achievements: [],
        lastLogin: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    return { ok: true, user: newUser };
}

function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return { ok: false, msg: "Wrong username or password." };
    user.lastLogin = new Date().toISOString();
    updateUser(user);
    setCurrentUser(user);
    return { ok: true, user };
}

// Level from XP
function getLevel(xp) {
    return Math.floor(xp / 100) + 1;
}
function getXpForNextLevel(xp) {
    return 100 - (xp % 100);
}

// All possible achievements
const ALL_ACHIEVEMENTS = [
    { id: "first_step",     icon: "🚀", title: "First Step",      desc: "Complete your first chapter",         xp: 50  },
    { id: "on_fire",        icon: "🔥", title: "On Fire",         desc: "Reach a 5-day streak",                xp: 80  },
    { id: "gem_collector",  icon: "💎", title: "Gem Collector",   desc: "Collect 200 gems",                    xp: 60  },
    { id: "halfway",        icon: "🏃", title: "Halfway There",   desc: "Complete 7 chapters",                 xp: 120 },
    { id: "python_master",  icon: "🐍", title: "Python Master",   desc: "Complete all 13 chapters",            xp: 300 },
    { id: "speed_learner",  icon: "⚡", title: "Speed Learner",   desc: "Complete 3 chapters in one day",      xp: 100 },
    { id: "night_owl",      icon: "🦉", title: "Night Owl",       desc: "Study after midnight",                xp: 50  },
    { id: "perfect_score",  icon: "🎯", title: "Perfect Score",   desc: "Get all quiz answers right first try", xp: 75  },
    { id: "social_butterfly",icon:"🦋", title: "Social Butterfly","desc": "Login 10 days in a row",            xp: 90  },
    { id: "bookworm",       icon: "📚", title: "Bookworm",        desc: "Spend 5 hours learning",              xp: 70  },
];

initStorage();
