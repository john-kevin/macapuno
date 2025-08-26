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
        
        // Create synchronized flames in the entries section
        this.createEntriesFlames();
        
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
     * Create flame effects in the entries section
     */
    createEntriesFlames() {
        const entriesSection = document.querySelector('.history-section');
        if (!entriesSection) return;

        // Get entries section position
        const rect = entriesSection.getBoundingClientRect();
        
        // Create flame containers at strategic positions around entries section
        const flamePositions = [
            { x: rect.left + rect.width * 0.2, y: rect.top + 20 }, // Top left area
            { x: rect.left + rect.width * 0.8, y: rect.top + 20 }, // Top right area  
            { x: rect.left + rect.width * 0.1, y: rect.top + rect.height * 0.4 }, // Mid left
            { x: rect.left + rect.width * 0.9, y: rect.top + rect.height * 0.4 }, // Mid right
            { x: rect.left + rect.width * 0.3, y: rect.top + rect.height - 30 }, // Bottom left
            { x: rect.left + rect.width * 0.7, y: rect.top + rect.height - 30 }, // Bottom right
        ];

        flamePositions.forEach((pos, index) => {
            // Stagger flame creation slightly for more organic effect
            setTimeout(() => {
                this.createFlameAtPosition(pos.x, pos.y);
            }, index * 100); // 100ms stagger between flames
        });
    }

    /**
     * Create a flame effect at specific position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate  
     */
    createFlameAtPosition(x, y) {
        const flameContainer = document.createElement('div');
        flameContainer.className = 'flame-container';
        flameContainer.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            pointer-events: none;
            z-index: 999;
        `;
        document.body.appendChild(flameContainer);

        // Create multiple flame particles for each position
        this.createFlameParticles(flameContainer);

        // Clean up after animation
        setTimeout(() => {
            if (flameContainer.parentNode) {
                document.body.removeChild(flameContainer);
            }
        }, 2500);
    }

    /**
     * Create flame particles at a position
     * @param {HTMLElement} container - Container for flame particles
     */
    createFlameParticles(container) {
        const flameColors = ['#ff6b35', '#f7931e', '#ffd700', '#ff4757', '#ff3838'];
        const particleCount = 8; // Flames per position

        for (let i = 0; i < particleCount; i++) {
            const flame = document.createElement('div');
            flame.className = 'flame-particle';
            
            // Flame movement - upward with slight horizontal drift
            const driftX = (Math.random() - 0.5) * 40; // -20 to +20px horizontal drift
            const riseY = -60 - Math.random() * 40; // -60 to -100px upward
            const duration = 1500 + Math.random() * 1000; // 1.5-2.5s duration
            const delay = Math.random() * 500; // 0-500ms stagger
            
            flame.style.cssText = `
                position: absolute;
                width: 8px;
                height: 12px;
                background: ${flameColors[Math.floor(Math.random() * flameColors.length)]};
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                transform: translate(-50%, -50%);
                opacity: 0.9;
                animation: flame-rise ${duration}ms ease-out ${delay}ms forwards;
                --drift-x: ${driftX}px;
                --rise-y: ${riseY}px;
            `;
            
            container.appendChild(flame);
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