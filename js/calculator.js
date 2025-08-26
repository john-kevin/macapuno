/**
 * Macapuno Wrapper Salary Calculator
 * Calculation logic and rate management
 */

class Calculator {
    constructor() {
        this.ratePerWrapper = 0.20; // 500 wrappers = 100 pesos
        this.currency = 'PHP';
        this.currencySymbol = '₱';
    }

    /**
     * Calculate earnings based on wrapper count
     * @param {number} wrapperCount - Number of wrappers completed
     * @returns {number} Calculated earnings
     */
    calculateEarnings(wrapperCount) {
        if (!this.isValidWrapperCount(wrapperCount)) {
            return 0;
        }
        
        return Math.round((wrapperCount * this.ratePerWrapper) * 100) / 100;
    }

    /**
     * Format earnings for display
     * @param {number} earnings - Raw earnings amount
     * @returns {string} Formatted earnings string
     */
    formatEarnings(earnings) {
        if (typeof earnings !== 'number' || isNaN(earnings)) {
            return `${this.currencySymbol}0.00`;
        }
        
        return `${this.currencySymbol}${earnings.toFixed(2)}`;
    }

    /**
     * Validate wrapper count input
     * @param {any} wrapperCount - Input to validate
     * @returns {boolean} Whether input is valid
     */
    isValidWrapperCount(wrapperCount) {
        const num = Number(wrapperCount);
        return !isNaN(num) && num >= 0 && num <= 999999; // Reasonable upper limit
    }

    /**
     * Calculate daily average from entries
     * @param {Array} entries - Array of entry objects
     * @returns {number} Daily average wrapper count
     */
    calculateDailyAverage(entries) {
        if (!entries || entries.length === 0) {
            return 0;
        }

        const totalWrappers = entries.reduce((sum, entry) => {
            return sum + (entry.wrapperCount || 0);
        }, 0);

        return Math.round(totalWrappers / entries.length);
    }

    /**
     * Calculate work streak (consecutive days with entries)
     * @param {Array} entries - Array of entry objects sorted by date (newest first)
     * @returns {number} Number of consecutive work days
     */
    calculateWorkStreak(entries) {
        if (!entries || entries.length === 0) {
            return 0;
        }

        // Sort entries by date (newest first)
        const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (const entry of sortedEntries) {
            const entryDate = new Date(entry.date);
            entryDate.setHours(0, 0, 0, 0);
            
            const daysDiff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === streak) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (daysDiff === streak + 1 && streak === 0) {
                // Allow for today not having an entry yet
                streak++;
                currentDate = new Date(entryDate);
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    }

    /**
     * Calculate weekly earnings (last 7 days)
     * @param {Array} entries - Array of entry objects
     * @returns {number} Total earnings for the week
     */
    calculateWeeklyEarnings(entries) {
        return this.calculateEarningsForPeriod(entries, 7);
    }

    /**
     * Calculate monthly earnings (last 30 days)
     * @param {Array} entries - Array of entry objects
     * @returns {number} Total earnings for the month
     */
    calculateMonthlyEarnings(entries) {
        return this.calculateEarningsForPeriod(entries, 30);
    }

    /**
     * Calculate total earnings for all entries
     * @param {Array} entries - Array of entry objects
     * @returns {number} Total earnings
     */
    calculateTotalEarnings(entries) {
        if (!entries || entries.length === 0) {
            return 0;
        }

        return entries.reduce((total, entry) => {
            return total + (entry.earnings || 0);
        }, 0);
    }

    /**
     * Calculate earnings for a specific period (days back from today)
     * @param {Array} entries - Array of entry objects
     * @param {number} days - Number of days to look back
     * @returns {number} Total earnings for the period
     */
    calculateEarningsForPeriod(entries, days) {
        if (!entries || entries.length === 0) {
            return 0;
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        cutoffDate.setHours(0, 0, 0, 0);

        return entries
            .filter(entry => {
                const entryDate = new Date(entry.date);
                return entryDate >= cutoffDate;
            })
            .reduce((total, entry) => total + (entry.earnings || 0), 0);
    }

    /**
     * Get rate information for display
     * @returns {object} Rate information
     */
    getRateInfo() {
        return {
            perWrapper: this.ratePerWrapper,
            baseRate: '500 wrappers = ₱100.00',
            currency: this.currency,
            symbol: this.currencySymbol
        };
    }

    /**
     * Update rate (for future extensibility)
     * @param {number} newRate - New rate per wrapper
     */
    updateRate(newRate) {
        if (typeof newRate === 'number' && newRate > 0) {
            this.ratePerWrapper = newRate;
        }
    }

    /**
     * Validate and sanitize numeric input
     * @param {any} input - Input value to sanitize
     * @returns {number} Sanitized numeric value
     */
    sanitizeNumericInput(input) {
        const num = Number(input);
        if (isNaN(num) || num < 0) {
            return 0;
        }
        return Math.floor(num); // Ensure integer wrapper counts
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}