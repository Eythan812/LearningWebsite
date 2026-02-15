// XP and Level System
const XP_PER_CORRECT = 5;
const XP_PER_LEVEL = 30;

// ========== STATS GETTERS ==========

function getXP() {
    return parseInt(localStorage.getItem('xp')) || 0;
}

function getQuestionsAnswered() {
    return parseInt(localStorage.getItem('questionsAnswered')) || 0;
}

function getCorrectAnswers() {
    return parseInt(localStorage.getItem('correctAnswers')) || 0;
}

function getStreak() {
    return parseInt(localStorage.getItem('streak')) || 0;
}

// ========== STATS SETTERS ==========

function saveXP(xp) {
    localStorage.setItem('xp', xp);
}

function incrementQuestionsAnswered() {
    const current = getQuestionsAnswered();
    localStorage.setItem('questionsAnswered', current + 1);
}

function incrementCorrectAnswers() {
    const current = getCorrectAnswers();
    localStorage.setItem('correctAnswers', current + 1);
}

function incrementStreak() {
    const current = getStreak();
    localStorage.setItem('streak', current + 1);
}

function resetStreak() {
    localStorage.setItem('streak', 0);
    updateStatsDisplay();
}

// ========== CALCULATIONS ==========

function getLevel(xp) {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function getXPInCurrentLevel(xp) {
    return xp % XP_PER_LEVEL;
}

function getAccuracy() {
    const answered = getQuestionsAnswered();
    const correct = getCorrectAnswers();
    if (answered === 0) return 0;
    return Math.round((correct / answered) * 100);
}

function getPlayerTitle(level) {
    if (level >= 10) return 'Master';
    if (level >= 7) return 'Expert';
    if (level >= 4) return 'Scholar';
    if (level >= 2) return 'Learner';
    return 'Apprentice';
}

// ========== XP AWARD ==========

function awardCorrectAnswerXP() {
    const currentXP = getXP();
    const newXP = currentXP + XP_PER_CORRECT;
    saveXP(newXP);
    incrementCorrectAnswers();
    updateStatsDisplay();
    return newXP;
}

function recordAnswer(isCorrect) {
    incrementQuestionsAnswered();
    if (isCorrect) {
        awardCorrectAnswerXP();
    } else {
        updateStatsDisplay();
    }
}

// ========== UI UPDATES ==========

function updateStatsDisplay() {
    const xp = getXP();
    const level = getLevel(xp);
    const xpInLevel = getXPInCurrentLevel(xp);
    const xpPercent = (xpInLevel / XP_PER_LEVEL) * 100;
    const xpToNext = XP_PER_LEVEL - xpInLevel;
    
    // Level display
    const levelEl = document.getElementById('level');
    if (levelEl) levelEl.textContent = level;
    
    // XP text
    const xpTextEl = document.getElementById('xp-text');
    if (xpTextEl) xpTextEl.textContent = `${xpInLevel} / ${XP_PER_LEVEL} XP`;
    
    // XP bar
    const xpFillEl = document.getElementById('xp-fill');
    if (xpFillEl) xpFillEl.style.width = `${xpPercent}%`;
    
    // XP hint
    const xpHintEl = document.querySelector('.xp-hint');
    if (xpHintEl) xpHintEl.textContent = `+${xpToNext} XP to next level`;
    
    // Player title
    const titleEl = document.querySelector('.player-title');
    if (titleEl) titleEl.textContent = getPlayerTitle(level);
    
    // Quick stats
    const totalXpEl = document.getElementById('total-xp');
    if (totalXpEl) totalXpEl.textContent = xp;
    
    const answeredEl = document.getElementById('questions-answered');
    if (answeredEl) answeredEl.textContent = getQuestionsAnswered();
    
    const accuracyEl = document.getElementById('accuracy');
    if (accuracyEl) accuracyEl.textContent = `${getAccuracy()}%`;
    
    // Streak
    const streakEl = document.getElementById('streak');
    if (streakEl) streakEl.textContent = getStreak();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateStatsDisplay);
