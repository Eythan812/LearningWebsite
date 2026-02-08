// XP and Level System
const XP_PER_LESSON = 10;
const XP_PER_LEVEL = 30;

// Get current XP from localStorage
function getXP() {
    return parseInt(localStorage.getItem('xp')) || 0;
}

// Save XP to localStorage
function saveXP(xp) {
    localStorage.setItem('xp', xp);
}

// Calculate level from XP
function getLevel(xp) {
    return Math.floor(xp / XP_PER_LEVEL) + 1;
}

// Get XP progress within current level (0 to XP_PER_LEVEL)
function getXPInCurrentLevel(xp) {
    return xp % XP_PER_LEVEL;
}

// Get completed lessons from localStorage
function getCompletedLessons() {
    const data = localStorage.getItem('completedLessons');
    return data ? JSON.parse(data) : [];
}

// Mark a lesson as completed and award XP
function completeLesson(lessonId) {
    const completedLessons = getCompletedLessons();
    
    // Only award XP if lesson hasn't been completed before
    if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        localStorage.setItem('completedLessons', JSON.stringify(completedLessons));
        
        const currentXP = getXP();
        const newXP = currentXP + XP_PER_LESSON;
        saveXP(newXP);
        
        return true; // XP was awarded
    }
    
    return false; // Already completed, no XP awarded
}

// Check if a lesson has been completed
function isLessonCompleted(lessonId) {
    return getCompletedLessons().includes(lessonId);
}

// Update the UI with current XP and level
function updateStatsDisplay() {
    const xp = getXP();
    const level = getLevel(xp);
    const xpInLevel = getXPInCurrentLevel(xp);
    const xpPercent = (xpInLevel / XP_PER_LEVEL) * 100;
    
    // Update level display
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.textContent = level;
    }
    
    // Update XP text
    const xpTextElement = document.getElementById('xp-text');
    if (xpTextElement) {
        xpTextElement.textContent = `${xpInLevel} / ${XP_PER_LEVEL}`;
    }
    
    // Update XP bar
    const xpFillElement = document.getElementById('xp-fill');
    if (xpFillElement) {
        xpFillElement.style.width = `${xpPercent}%`;
    }
}

// Initialize stats display on page load
document.addEventListener('DOMContentLoaded', updateStatsDisplay);
