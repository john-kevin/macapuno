/**
 * Personalization Manager - Handles user name and personalized experience
 * Part of Macapuno Calculator modular architecture
 */

class PersonalizationManager {
    constructor(app) {
        this.app = app;
        this.userName = null;
    }

    /**
     * Initialize personalization features
     */
    init() {
        // Check if user name is already saved
        this.userName = this.app.storage.getUserName();
        
        if (!this.userName) {
            // Show welcome modal for first-time users
            this.showWelcomeModal();
        } else {
            // Show personalized greeting for returning users
            this.showPersonalizedGreeting();
        }
    }

    /**
     * Show welcome modal for name input
     */
    showWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        modal.style.display = 'flex';
        modal.classList.remove('closing');
        
        // Force reflow then add show class for animation
        modal.offsetHeight;
        modal.classList.add('show');
        
        // Focus on name input
        setTimeout(() => {
            const nameInput = document.getElementById('userName');
            if (nameInput) {
                nameInput.focus();
            }
        }, 150);
    }

    /**
     * Close welcome modal
     */
    closeWelcomeModal() {
        const modal = document.getElementById('welcomeModal');
        
        // Add closing class for reverse animation
        modal.classList.remove('show');
        modal.classList.add('closing');
        
        // Hide modal after animation completes
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
        }, 300);
    }

    /**
     * Save user name and close modal
     */
    saveUserName() {
        const nameInput = document.getElementById('userName');
        const name = nameInput.value.trim();
        
        if (!name) {
            this.app.displayManager.showNotification('Please enter your name', 'warning');
            nameInput.focus();
            return;
        }

        // Save name to storage
        this.app.storage.saveUserName(name);
        this.userName = name;
        
        // Close modal and show greeting
        this.closeWelcomeModal();
        
        // Delay greeting to let modal close animation complete
        setTimeout(() => {
            this.showPersonalizedGreeting();
            this.app.displayManager.showNotification(`Welcome, ${name}! 🎉`, 'success');
        }, 400);
    }

    /**
     * Show personalized greeting in header
     */
    showPersonalizedGreeting() {
        if (!this.userName) return;
        
        const greetingElement = document.getElementById('personalGreeting');
        if (!greetingElement) return;

        // Create personalized greeting with emoji
        const greetingEmojis = ['👋', '😊', '🌟', '✨', '🎯'];
        const randomEmoji = greetingEmojis[Math.floor(Math.random() * greetingEmojis.length)];
        
        const greetingMessages = [
            `Hi ${this.userName}!`,
            `Hey there, ${this.userName}!`,
            `Welcome back, ${this.userName}!`,
            `Hello ${this.userName}!`,
            `Good to see you, ${this.userName}!`
        ];
        
        // Choose greeting based on whether it's first visit or returning
        let message;
        if (this.app.storage.getAllEntries().length === 0) {
            // First time - encourage to start
            message = `Hi ${this.userName}! Ready to start tracking?`;
        } else {
            // Returning user - welcome back
            message = greetingMessages[Math.floor(Math.random() * greetingMessages.length)];
        }
        
        greetingElement.innerHTML = `
            <span class="greeting-emoji">${randomEmoji}</span>
            ${message}
        `;
        
        // Show greeting with animation
        greetingElement.style.display = 'inline-block';
    }

    /**
     * Get current user name
     * @returns {string|null} User name or null if not set
     */
    getUserName() {
        return this.userName;
    }

    /**
     * Reset user name (for testing or settings)
     */
    resetUserName() {
        this.app.storage.removeUserName();
        this.userName = null;
        
        // Hide greeting
        const greetingElement = document.getElementById('personalGreeting');
        if (greetingElement) {
            greetingElement.style.display = 'none';
        }
        
        // Show welcome modal again
        this.showWelcomeModal();
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PersonalizationManager;
}