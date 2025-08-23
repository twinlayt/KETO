// Main Application JavaScript
class KetoApp {
    constructor() {
        this.currentQuizStep = 0;
        this.quizAnswers = [];
        this.isExitIntentShown = false;
        this.stickyBarShown = false;
        
        this.quizData = [
            {
                question: "What's your biggest challenge with keto diet?",
                options: ["Meal planning", "Shopping lists", "Portion control", "Motivation"]
            },
            {
                question: "How many meals do you prefer per day?",
                options: ["2 meals", "3 meals", "4-5 small meals", "Intermittent fasting"]
            },
            {
                question: "How much time do you like to spend in the kitchen?",
                options: ["Very little (15 min max)", "Moderate (30 min)", "Enough (45 min)", "A lot (1 hour+)"]
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.trackVisitor();
        this.loadContent();
    }

    setupEventListeners() {
        // Scroll event for sticky bar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600 && !this.stickyBarShown) {
                this.showStickyBar();
            }
        });

        // Exit intent detection
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !this.isExitIntentShown) {
                this.showExitPopup();
            }
        });

        // Email form submissions
        document.getElementById('email-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitEmail('hero');
        });

        document.getElementById('exit-email-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitEmail('exit-popup');
        });

        // Admin access (hidden shortcut)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                this.showAdminLogin();
            }
        });
    }

    loadContent() {
        const savedContent = localStorage.getItem('keto-content');
        if (savedContent) {
            const content = JSON.parse(savedContent);
            this.updatePageContent(content);
        }
    }

    updatePageContent(content) {
        // Update guarantee text
        const guaranteeElement = document.getElementById('guarantee-text');
        if (guaranteeElement && content.cta) {
            guaranteeElement.textContent = `${content.cta.guaranteeText} • ${content.cta.noCardText}`;
        }

        // Update popup content
        if (content.popup) {
            const popupTitle = document.getElementById('popup-title');
            const popupSubtitle = document.getElementById('popup-subtitle');
            const popupButton = document.getElementById('popup-button');
            const popupDismiss = document.getElementById('popup-dismiss');

            if (popupTitle) popupTitle.textContent = content.popup.title;
            if (popupSubtitle) popupSubtitle.textContent = content.popup.subtitle;
            if (popupButton) popupButton.textContent = content.popup.buttonText;
            if (popupDismiss) popupDismiss.textContent = content.popup.dismissText;
        }

        // Update colors
        if (content.colors) {
            this.updateColors(content.colors);
        }
    }

    updateColors(colors) {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--secondary-color', colors.secondary);
        root.style.setProperty('--accent-color', colors.accent);
        root.style.setProperty('--success-color', colors.success);
        root.style.setProperty('--warning-color', colors.warning);
        root.style.setProperty('--error-color', colors.error);
        root.style.setProperty('--background-color', colors.background);
        root.style.setProperty('--surface-color', colors.surface);
        root.style.setProperty('--text-color', colors.text);
        root.style.setProperty('--text-secondary-color', colors.textSecondary);
    }

    trackVisitor() {
        const visitor = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct',
            page: window.location.pathname
        };

        const visitors = JSON.parse(localStorage.getItem('keto-visitors') || '[]');
        visitors.unshift(visitor);
        localStorage.setItem('keto-visitors', JSON.stringify(visitors.slice(0, 1000)));
    }

    startQuiz() {
        document.getElementById('quiz-start').classList.add('d-none');
        document.getElementById('quiz-questions').classList.remove('d-none');
        this.showQuizQuestion();
    }

    showQuizQuestion() {
        const question = this.quizData[this.currentQuizStep];
        document.getElementById('current-question').textContent = this.currentQuizStep + 1;
        document.getElementById('question-text').textContent = question.question;
        
        const progress = ((this.currentQuizStep + 1) / this.quizData.length) * 100;
        document.getElementById('quiz-progress').style.width = `${progress}%`;

        const optionsContainer = document.getElementById('question-options');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-secondary quiz-option w-100 text-start';
            button.textContent = option;
            button.onclick = () => this.answerQuiz(index);
            optionsContainer.appendChild(button);
        });
    }

    answerQuiz(answerIndex) {
        this.quizAnswers.push(answerIndex);
        
        if (this.currentQuizStep < this.quizData.length - 1) {
            this.currentQuizStep++;
            this.showQuizQuestion();
        } else {
            this.completeQuiz();
        }
    }

    completeQuiz() {
        document.getElementById('quiz-questions').classList.add('d-none');
        document.getElementById('quiz-complete').classList.remove('d-none');
    }

    resetQuiz() {
        this.currentQuizStep = 0;
        this.quizAnswers = [];
        document.getElementById('quiz-complete').classList.add('d-none');
        document.getElementById('quiz-start').classList.remove('d-none');
    }

    submitQuizEmail() {
        const email = document.getElementById('quiz-email').value;
        if (email) {
            this.saveEmail(email, 'quiz', this.quizAnswers);
            this.showSuccessMessage('Quiz sonuçlarınız email adresinize gönderildi!');
            document.getElementById('quiz-email').value = '';
        }
    }

    submitStickyEmail() {
        const email = document.getElementById('sticky-email').value;
        if (email) {
            this.saveEmail(email, 'sticky-bar');
            this.showSuccessMessage('Email adresiniz kaydedildi!');
            document.getElementById('sticky-email').value = '';
            this.hideStickyBar();
        }
    }

    submitEmail(source) {
        const emailInput = source === 'exit-popup' ? 
            document.getElementById('exit-email-input') : 
            document.getElementById('email-input');
        
        const email = emailInput.value;
        if (email) {
            this.saveEmail(email, source);
            this.showSuccessMessage('Keto rehberiniz email adresinize gönderildi!');
            emailInput.value = '';
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(
                source === 'exit-popup' ? 
                document.getElementById('exitModal') : 
                document.getElementById('emailModal')
            );
            modal?.hide();
        }
    }

    saveEmail(email, source, quizAnswers = null) {
        const emailData = {
            id: Date.now().toString(),
            email,
            source,
            timestamp: new Date().toISOString(),
            quizAnswers
        };

        const emails = JSON.parse(localStorage.getItem('keto-emails') || '[]');
        emails.unshift(emailData);
        localStorage.setItem('keto-emails', JSON.stringify(emails));

        // Send to database
        this.sendToDatabase('emails', emailData);
    }

    sendToDatabase(table, data) {
        // MySQL database integration will be handled here
        console.log(`Sending to ${table}:`, data);
        
        // Simulate API call
        fetch('/api/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ table, data })
        }).catch(err => console.log('Database not connected yet:', err));
    }

    showEmailModal(source) {
        const modal = new bootstrap.Modal(document.getElementById('emailModal'));
        modal.show();
        
        // Store source for form submission
        document.getElementById('email-form').dataset.source = source;
    }

    showExitPopup() {
        this.isExitIntentShown = true;
        const modal = new bootstrap.Modal(document.getElementById('exitModal'));
        modal.show();
    }

    showStickyBar() {
        this.stickyBarShown = true;
        const stickyBar = document.getElementById('sticky-bar');
        stickyBar.classList.remove('d-none');
        stickyBar.classList.add('sticky-bar-enter');
        setTimeout(() => {
            stickyBar.classList.add('sticky-bar-show');
        }, 100);
    }

    hideStickyBar() {
        const stickyBar = document.getElementById('sticky-bar');
        stickyBar.classList.remove('sticky-bar-show');
        setTimeout(() => {
            stickyBar.classList.add('d-none');
        }, 300);
    }

    showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-floating fade show';
        alert.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alert);

        setTimeout(() => {
            alert.remove();
        }, 5000);
    }

    showAdminLogin() {
        document.body.style.overflow = 'hidden';
        document.getElementById('admin-login').classList.remove('d-none');
    }
}

// Global functions for HTML onclick events
function scrollToQuiz() {
    document.getElementById('keto-quiz').scrollIntoView({ behavior: 'smooth' });
}

function showEmailModal(source) {
    app.showEmailModal(source);
}

function startQuiz() {
    app.startQuiz();
}

function submitQuizEmail() {
    app.submitQuizEmail();
}

function resetQuiz() {
    app.resetQuiz();
}

function submitStickyEmail() {
    app.submitStickyEmail();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new KetoApp();
});