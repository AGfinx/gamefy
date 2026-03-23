// chapter-script.js – handles lesson steps, quizzes, XP, and completion

document.addEventListener("DOMContentLoaded", function () {
    if (typeof getCurrentUser === "function") {
        const user = getCurrentUser();
        if (user) {
            const elStreak = document.getElementById("hdr-streak");
            const elGems = document.getElementById("hdr-gems");
            const elAvatar = document.getElementById("hdr-avatar");
            if (elStreak) elStreak.textContent = user.streak;
            if (elGems) elGems.textContent = user.gems;
            if (elAvatar) elAvatar.textContent = user.avatar;
        }
    }

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    let currentStep = 0;
    const steps  = document.querySelectorAll(".lesson-step");
    const nextBtn = document.getElementById("nextBtn");

    function checkAnswer(button, isCorrect) {
        const quizBox  = button.parentElement;
        const feedback = quizBox.querySelector(".feedback");
        const buttons  = quizBox.querySelectorAll("button");

        if (isCorrect) {
            feedback.innerHTML   = "✅ Correct! +10 XP";
            feedback.style.color = "green";
            buttons.forEach(btn => btn.disabled = true);
            nextBtn.disabled = false;

            // Award small XP per correct answer
            awardXP(10);

        } else {
            feedback.innerHTML   = "❌ Try again.";
            feedback.style.color = "red";
        }
    }

    function nextStep() {
        if (steps[currentStep].querySelector(".quiz") && nextBtn.disabled) return;

        steps[currentStep].classList.remove("active");
        currentStep++;

        if (currentStep < steps.length) {
            steps[currentStep].classList.add("active");
            nextBtn.disabled = !!steps[currentStep].querySelector(".quiz");
            if (currentStep === steps.length - 1) nextBtn.innerText = "Finish 🎉";
        } else {
            // Chapter finished!
            completeChapter();
        }
    }

    function awardXP(amount) {
        // auth.js must be loaded before this script
        if (typeof getCurrentUser !== "function") return;
        const user = getCurrentUser();
        if (!user) return;
        user.xp += amount;
        user.gems += Math.floor(amount / 5);
        updateUser(user);
    }

    function completeChapter() {
        if (typeof getCurrentUser !== "function") {
            window.location.href = "Learn.html";
            return;
        }

        const user = getCurrentUser();
        if (!user) { window.location.href = "Learn.html"; return; }

        // Figure out chapter number from URL: chapter3.html → 3
        const match = window.location.pathname.match(/chapter(\d+)\.html/i);
        const chNum = match ? parseInt(match[1]) : null;

        let nextUrl = "Learn.html";
        if (chNum && chNum < 13) {
            nextUrl = `chapter${chNum + 1}.html`;
        }

        if (chNum && !user.completedChapters.includes(chNum)) {
            user.completedChapters.push(chNum);
            user.xp   += 50;   // bonus XP for finishing
            user.gems += 20;   // bonus gems
            user.streak = (user.streak || 0) + (chNum === 1 ? 1 : 0); // simple streak tick

            // Check achievements
            checkAchievements(user);
            updateUser(user);

            // Show a quick completion toast before redirect
            showCompletionToast(chNum, nextUrl);
        } else {
            window.location.href = nextUrl;
        }
    }

    function checkAchievements(user) {
        const earn = id => {
            if (!user.achievements.includes(id)) {
                user.achievements.push(id);
                // Find XP reward
                if (typeof ALL_ACHIEVEMENTS !== "undefined") {
                    const ach = ALL_ACHIEVEMENTS.find(a => a.id === id);
                    if (ach) user.xp += ach.xp;
                }
            }
        };
        if (user.completedChapters.length >= 1)  earn("first_step");
        if (user.completedChapters.length >= 7)  earn("halfway");
        if (user.completedChapters.length >= 13) earn("python_master");
        if (user.gems >= 200)                    earn("gem_collector");
        if (user.streak >= 5)                    earn("on_fire");
    }

    function showCompletionToast(chNum, nextUrl) {
        // Create overlay
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position:fixed;inset:0;background:rgba(0,0,0,.6);
            display:flex;align-items:center;justify-content:center;z-index:9999;
        `;
        overlay.innerHTML = `
            <div style="background:white;border-radius:24px;padding:40px 48px;text-align:center;
                        box-shadow:0 20px 60px rgba(0,0,0,.3);max-width:380px;width:90%;">
                <div style="font-size:4rem;margin-bottom:12px">🎉</div>
                <h2 style="font-size:1.8rem;font-weight:800;color:#3c3c3c;margin-bottom:8px">
                    Chapter ${chNum} Complete!
                </h2>
                <p style="color:#888;font-weight:600;font-size:1rem;margin-bottom:20px">
                    You earned <strong style="color:#58cc02">+50 XP</strong> and <strong style="color:#1cb0f6">+20 💎</strong>
                </p>
                <button onclick="this.parentElement.parentElement.remove(); window.location.href='${nextUrl}';"
                    style="background:linear-gradient(135deg,#58cc02,#89e219);color:white;
                           border:none;padding:14px 36px;border-radius:50px;font-size:1.1rem;
                           font-weight:800;cursor:pointer;font-family:'Nunito',sans-serif;
                           box-shadow:0 6px 0 #3f8c00;">
                    Continue →
                </button>
            </div>`;
        document.body.appendChild(overlay);
    }

    // Expose to HTML onclick attributes
    window.checkAnswer = checkAnswer;
    window.nextStep    = nextStep;

    // Initial state
    if (steps.length > 0 && steps[currentStep].querySelector(".quiz")) {
        nextBtn.disabled = true;
    }
});
