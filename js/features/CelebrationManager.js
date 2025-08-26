/**
 * Celebration Manager - Handles celebration animations
 * Part of Macapuno Calculator modular architecture
 */

class CelebrationManager {
    constructor(app) {
        this.app = app;
    }

    /**
     * Trigger celebration animation for new entries
     * @param {number} wrapperCount - Number of wrappers for contextual messages
     */
    triggerCelebration(wrapperCount) {
        // Create celebration overlay
        const overlay = document.createElement('div');
        overlay.className = 'celebration-overlay';
        document.body.appendChild(overlay);

        // Generate confetti
        this.createConfetti(overlay);
        
        // Generate balloons
        this.createBalloons(overlay);
        
        // Show celebration message
        this.showCelebrationMessage(wrapperCount);

        // Clean up after animation
        setTimeout(() => {
            if (overlay.parentNode) {
                document.body.removeChild(overlay);
            }
        }, 3500);
    }

    /**
     * Create confetti particles
     * @param {HTMLElement} container - Container for confetti
     */
    createConfetti(container) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }
    }

    /**
     * Create floating balloons
     * @param {HTMLElement} container - Container for balloons
     */
    createBalloons(container) {
        const balloonEmojis = ['🎈', '🎉', '🎊', '✨', '🌟', '💫', '🏆'];
        const balloonCount = 12;

        for (let i = 0; i < balloonCount; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.textContent = balloonEmojis[Math.floor(Math.random() * balloonEmojis.length)];
            balloon.style.left = Math.random() * 90 + 'vw';
            balloon.style.animationDelay = Math.random() * 1.5 + 's';
            balloon.style.animationDuration = (Math.random() * 1 + 2.5) + 's';
            container.appendChild(balloon);
        }
    }

    /**
     * Show contextual celebration message
     * @param {number} wrapperCount - Number of wrappers completed
     */
    showCelebrationMessage(wrapperCount) {
        const messages = [
            "Great work! 🎉",
            "Keep it up! ✨", 
            "Progress made! 🌟",
            "Well done! 🎊",
            "You're awesome! 🏆"
        ];

        // Special messages for milestones
        let message = messages[Math.floor(Math.random() * messages.length)];
        
        if (wrapperCount >= 1000) {
            message = "1000+ wrappers! Amazing! 🚀";
        } else if (wrapperCount >= 500) {
            message = "500+ wrappers! Fantastic! 🌟";
        } else if (wrapperCount === 0) {
            message = "Every step counts! 💪";
        }

        const celebrationMsg = document.createElement('div');
        celebrationMsg.className = 'celebration-message';
        celebrationMsg.textContent = message;
        document.body.appendChild(celebrationMsg);

        // Clean up message
        setTimeout(() => {
            if (celebrationMsg.parentNode) {
                document.body.removeChild(celebrationMsg);
            }
        }, 2000);
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CelebrationManager;
}