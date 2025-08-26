/**
 * Celebration Manager - Handles celebration animations
 * Part of Macapuno Calculator modular architecture
 */

class CelebrationManager {
    constructor(app) {
        this.app = app;
    }

    /**
     * Trigger celebration animation for new entries - localized to save button
     * @param {number} wrapperCount - Number of wrappers for contextual messages
     */
    triggerCelebration(wrapperCount) {
        // Create localized celebration around save button
        this.createButtonFireworks();
        
        // Show celebration message
        this.showCelebrationMessage(wrapperCount);
    }

    /**
     * Create fireworks effect around the save button
     */
    createButtonFireworks() {
        const saveBtn = document.getElementById('saveBtn');
        if (!saveBtn) return;

        // Get button position and dimensions
        const rect = saveBtn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create container for button fireworks
        const fireworksContainer = document.createElement('div');
        fireworksContainer.className = 'button-fireworks-container';
        fireworksContainer.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 0;
            height: 0;
            pointer-events: none;
            z-index: 1000;
        `;
        document.body.appendChild(fireworksContainer);

        // Create multiple bursts of confetti
        this.createFireworksBurst(fireworksContainer, 0); // Immediate burst
        setTimeout(() => this.createFireworksBurst(fireworksContainer, 100), 150); // Second burst
        setTimeout(() => this.createFireworksBurst(fireworksContainer, 200), 300); // Third burst

        // Clean up after animation
        setTimeout(() => {
            if (fireworksContainer.parentNode) {
                document.body.removeChild(fireworksContainer);
            }
        }, 2000);
    }

    /**
     * Create a single fireworks burst
     * @param {HTMLElement} container - Container for fireworks
     * @param {number} delay - Animation delay offset
     */
    createFireworksBurst(container, delay = 0) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3'];
        const particleCount = 12; // Particles per burst

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            
            // Calculate random direction (360 degrees)
            const angle = (360 / particleCount) * i + (Math.random() * 30 - 15); // Spread particles evenly with some randomness
            const distance = 60 + Math.random() * 40; // Random distance 60-100px from button
            const duration = 1000 + Math.random() * 500; // Random duration 1-1.5s
            
            // Convert angle to radians and calculate end position
            const radian = (angle * Math.PI) / 180;
            const endX = Math.cos(radian) * distance;
            const endY = Math.sin(radian) * distance;
            
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                transform: translate(-50%, -50%);
                opacity: 1;
                animation: firework-burst ${duration}ms ease-out ${delay}ms forwards;
                --end-x: ${endX}px;
                --end-y: ${endY}px;
            `;
            
            container.appendChild(particle);
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