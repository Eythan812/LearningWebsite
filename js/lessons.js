// Quiz Engine
// This file handles rendering questions and tracking answers

let currentQuestionIndex = 0;
let correctAnswers = 0;
let currentLessonDataRef = null; // Store reference to current lesson for OK button

// Initialize the lesson quiz
function initLesson(lessonData) {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    currentLessonDataRef = lessonData;
    showQuestion(lessonData);
}

// Display the current question
function showQuestion(lessonData) {
    const question = lessonData.questions[currentQuestionIndex];
    const totalQuestions = lessonData.questions.length;
    
    // Hide explanation container when showing new question
    const explanationContainer = document.getElementById('explanation-container');
    if (explanationContainer) {
        explanationContainer.classList.add('hidden');
    }
    
    // Update progress text
    const progressElement = document.getElementById('progress');
    if (progressElement) {
        progressElement.textContent = `Question ${currentQuestionIndex + 1} of ${totalQuestions}`;
    }
    
    // Update question text
    const questionElement = document.getElementById('question-text');
    if (questionElement) {
        questionElement.textContent = question.question;
    }
    
    // Generate option buttons
    const optionsContainer = document.getElementById('options');
    if (optionsContainer) {
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.onclick = () => selectAnswer(index, lessonData);
            optionsContainer.appendChild(button);
        });
    }
}

// Show explanation and OK button (for Learn/Fun modes)
function showExplanation(question, isCorrect) {
    const explanationContainer = document.getElementById('explanation-container');
    const explanationText = document.getElementById('explanation-text');
    const explanationIcon = document.getElementById('explanation-icon');
    const explanationBox = document.getElementById('explanation-box');
    
    if (explanationContainer && explanationText) {
        // Set the explanation text
        const explanation = question.explanation || "Bonne question!";
        explanationText.textContent = explanation;
        
        // Update icon and style based on correct/incorrect
        if (explanationIcon) {
            explanationIcon.textContent = isCorrect ? '✅' : '💡';
        }
        if (explanationBox) {
            explanationBox.classList.remove('correct-explanation', 'incorrect-explanation');
            explanationBox.classList.add(isCorrect ? 'correct-explanation' : 'incorrect-explanation');
        }
        
        // Show the container
        explanationContainer.classList.remove('hidden');
    }
}

// Handle OK button click to go to next question (Learn/Fun modes)
function nextQuestionManual() {
    const explanationContainer = document.getElementById('explanation-container');
    if (explanationContainer) {
        explanationContainer.classList.add('hidden');
    }
    
    currentQuestionIndex++;
    
    if (currentQuestionIndex < currentLessonDataRef.questions.length) {
        showQuestion(currentLessonDataRef);
    } else {
        showCompletion(currentLessonDataRef);
    }
}

// Handle answer selection
function selectAnswer(selectedIndex, lessonData) {
    const question = lessonData.questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-btn');
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Mark correct and incorrect answers
    buttons.forEach((btn, index) => {
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex) {
            btn.classList.add('incorrect');
        }
    });
    
    // Track answer and award XP if correct
    const isCorrect = selectedIndex === question.correct;
    if (isCorrect) {
        correctAnswers++;
        
        // Fun Mode: Show celebration on correct answer
        if (typeof currentMode !== 'undefined' && currentMode === 'fun') {
            showCelebration();
        }
    } else {
        // Wrong answer ends the streak
        resetStreak();
        
        // Fun Mode: Show shake animation on wrong answer
        if (typeof currentMode !== 'undefined' && currentMode === 'fun') {
            showWrongAnimation();
        }
        
        // Challenge Mode: Lose a life
        if (typeof currentMode !== 'undefined' && currentMode === 'challenge') {
            const alive = loseLife();
            if (!alive) {
                // Game over - no more lives
                setTimeout(() => showGameOver(), 1000);
                return; // Don't continue to next question
            }
        }
    }
    recordAnswer(isCorrect);
    
    // Check if we should show explanation with OK button (Learn/Fun modes)
    const showExplanationMode = typeof currentMode !== 'undefined' && 
        (currentMode === 'learn' || currentMode === 'fun');
    
    if (showExplanationMode) {
        // Show explanation and wait for OK button
        setTimeout(() => {
            showExplanation(question, isCorrect);
        }, 500);
    } else {
        // Auto-advance for Speedrun and Challenge modes
        setTimeout(() => {
            currentQuestionIndex++;
            
            if (currentQuestionIndex < lessonData.questions.length) {
                // Speedrun: Reset timer for next question (with less time!)
                if (typeof currentMode !== 'undefined' && currentMode === 'speedrun') {
                    nextSpeedrunQuestion();
                }
                showQuestion(lessonData);
            } else {
                showCompletion(lessonData);
            }
        }, 1000);
    }
}

// Show the completion screen
function showCompletion(lessonData) {
    const questionCard = document.getElementById('question-card');
    const completionCard = document.getElementById('completion-card');
    
    if (questionCard) questionCard.classList.add('hidden');
    if (completionCard) completionCard.classList.remove('hidden');
    
    // Increment streak for completing a lesson
    incrementStreak();
    
    // Calculate base XP earned this session
    const xpEarned = correctAnswers * XP_PER_CORRECT;
    let bonusXP = 0;
    
    // Hide bonus elements by default
    const bonusEl = document.getElementById('bonus-xp');
    const timeEl = document.getElementById('time-result');
    const livesEl = document.getElementById('lives-result');
    const titleEl = document.getElementById('completion-title');
    
    if (bonusEl) bonusEl.classList.add('hidden');
    if (timeEl) timeEl.classList.add('hidden');
    if (livesEl) livesEl.classList.add('hidden');
    if (titleEl) titleEl.textContent = 'Lesson Complete!';
    
    // Mode-specific completion logic
    if (typeof currentMode !== 'undefined') {
        
        // Speedrun Mode: Calculate completion bonus
        if (currentMode === 'speedrun') {
            stopTimer();
            bonusXP = calculateSpeedBonus(lessonData.questions.length);
            
            if (timeEl) {
                timeEl.classList.remove('hidden');
                timeEl.textContent = `⚡ Completed all ${lessonData.questions.length} questions!`;
            }
            if (titleEl) titleEl.textContent = '🌟 Speed Run Complete!';
        }
        
        // Challenge Mode: Calculate survival bonus
        if (currentMode === 'challenge') {
            bonusXP = calculateChallengeBonus(livesRemaining);
            
            if (livesEl) {
                livesEl.classList.remove('hidden');
                const hearts = '❤️'.repeat(livesRemaining);
                livesEl.textContent = `Lives remaining: ${hearts}`;
            }
            if (titleEl) titleEl.textContent = 'Challenge Complete!';
        }
        
        // Fun Mode: Extra celebration
        if (currentMode === 'fun') {
            if (titleEl) titleEl.textContent = '🎉 Awesome Job! 🎉';
            spawnConfetti();
        }
    }
    
    // Award bonus XP if any
    if (bonusXP > 0) {
        // Add bonus XP to total
        const currentXP = getXP();
        saveXP(currentXP + bonusXP);
        updateStatsDisplay();
        
        if (bonusEl) {
            bonusEl.classList.remove('hidden');
            bonusEl.textContent = `🌟 Bonus: +${bonusXP} XP!`;
        }
    }
    
    // Update completion message
    const xpEarnedElement = document.getElementById('xp-earned');
    if (xpEarnedElement) {
        xpEarnedElement.textContent = `+${xpEarned} XP`;
    }
    
    // Show score
    const scoreElement = document.getElementById('score');
    if (scoreElement) {
        scoreElement.textContent = `${correctAnswers} / ${lessonData.questions.length} correct`;
    }
}
