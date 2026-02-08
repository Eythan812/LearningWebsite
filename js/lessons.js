// Quiz Engine
// This file handles rendering questions and tracking answers

let currentQuestionIndex = 0;
let correctAnswers = 0;

// Initialize the lesson quiz
function initLesson(lessonData) {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    showQuestion(lessonData);
}

// Display the current question
function showQuestion(lessonData) {
    const question = lessonData.questions[currentQuestionIndex];
    const totalQuestions = lessonData.questions.length;
    
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
    }
    recordAnswer(isCorrect);
    
    // Move to next question after a delay
    setTimeout(() => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < lessonData.questions.length) {
            showQuestion(lessonData);
        } else {
            showCompletion(lessonData);
        }
    }, 1000);
}

// Show the completion screen
function showCompletion(lessonData) {
    const questionCard = document.getElementById('question-card');
    const completionCard = document.getElementById('completion-card');
    
    if (questionCard) questionCard.classList.add('hidden');
    if (completionCard) completionCard.classList.remove('hidden');
    
    // Increment streak for completing a lesson
    incrementStreak();
    
    // Calculate XP earned this session
    const xpEarned = correctAnswers * XP_PER_CORRECT;
    
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
