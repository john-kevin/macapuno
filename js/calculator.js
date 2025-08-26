/**
 * Macapuno Wrapper Salary Calculator
 * Calculation logic and rate management
 */

class Calculator {
    constructor() {
        this.ratePerWrapper = 0.20; // 500 wrappers = 100 pesos
        this.currency = 'PHP';
        this.currencySymbol = '₱';
        this.version = '1.5.2'; // App version - Localized fireworks animation around save button
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
     * @param {Array} entries - Array of entry objects
     * @returns {number} Number of consecutive work days
     */
    calculateWorkStreak(entries) {
        if (!entries || entries.length === 0) {
            return 0;
        }

        // Sort entries by date (newest first)
        const sortedEntries = entries
            .slice() // Create copy to avoid mutating original
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (sortedEntries.length === 0) {
            return 0;
        }

        // Start counting from the most recent entry
        let streak = 1; // Count the most recent entry
        let currentDate = new Date(sortedEntries[0].date);
        
        // Go through remaining entries and count consecutive days
        for (let i = 1; i < sortedEntries.length; i++) {
            const entry = sortedEntries[i];
            const entryDate = new Date(entry.date);
            
            // Calculate expected previous day
            const expectedPreviousDay = new Date(currentDate);
            expectedPreviousDay.setDate(expectedPreviousDay.getDate() - 1);
            
            // Check if this entry is for the expected previous day
            if (entry.date === expectedPreviousDay.toISOString().split('T')[0]) {
                streak++;
                currentDate = entryDate;
            } else {
                // Gap found, streak is broken
                break;
            }
        }

        return streak;
    }

    /**
     * Calculate weekly earnings for a specific week containing the given date
     * @param {Array} entries - Array of entry objects
     * @param {Date} referenceDate - Date to determine which week to calculate
     * @returns {number} Total earnings for that week
     */
    calculateWeeklyEarnings(entries, referenceDate = new Date()) {
        if (!entries || entries.length === 0) {
            return 0;
        }

        // Get start and end of the week containing the reference date
        const date = new Date(referenceDate);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Calculate start of week (Sunday)
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        
        // Calculate end of week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const startDateStr = startOfWeek.toISOString().split('T')[0];
        const endDateStr = endOfWeek.toISOString().split('T')[0];

        return entries
            .filter(entry => entry.date >= startDateStr && entry.date <= endDateStr)
            .reduce((total, entry) => total + (entry.earnings || 0), 0);
    }

    /**
     * Calculate monthly earnings for a specific month
     * @param {Array} entries - Array of entry objects
     * @param {Date} referenceDate - Date to determine which month to calculate
     * @returns {number} Total earnings for that month
     */
    calculateMonthlyEarnings(entries, referenceDate = new Date()) {
        if (!entries || entries.length === 0) {
            return 0;
        }

        const date = new Date(referenceDate);
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Get start and end of the month
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0); // Last day of month
        
        const startDateStr = startOfMonth.toISOString().split('T')[0];
        const endDateStr = endOfMonth.toISOString().split('T')[0];

        return entries
            .filter(entry => entry.date >= startDateStr && entry.date <= endDateStr)
            .reduce((total, entry) => total + (entry.earnings || 0), 0);
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
     * Debug work streak calculation (for testing)
     * @param {Array} entries - Array of entry objects
     * @returns {Object} Debug information about streak calculation
     */
    debugWorkStreak(entries) {
        if (!entries || entries.length === 0) {
            return { streak: 0, debug: 'No entries found' };
        }

        const sortedEntries = entries
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const today = new Date().toISOString().split('T')[0];
        const hasToday = sortedEntries.some(entry => entry.date === today);
        
        let expectedDate = new Date();
        expectedDate.setHours(0, 0, 0, 0);
        
        if (!hasToday) {
            expectedDate.setDate(expectedDate.getDate() - 1);
        }

        const debug = [];
        let streak = 0;

        debug.push(`Today: ${today}, Has today's entry: ${hasToday}`);
        debug.push(`Starting check from: ${expectedDate.toISOString().split('T')[0]}`);

        for (const entry of sortedEntries) {
            const expectedDateStr = expectedDate.toISOString().split('T')[0];
            
            if (entry.date === expectedDateStr) {
                streak++;
                debug.push(`✓ Found entry for ${entry.date}, streak: ${streak}`);
                expectedDate.setDate(expectedDate.getDate() - 1);
            } else if (entry.date < expectedDateStr) {
                debug.push(`✗ Entry ${entry.date} is older than expected ${expectedDateStr}, streak broken`);
                break;
            } else {
                debug.push(`⚠ Entry ${entry.date} is newer than expected ${expectedDateStr}, skipping`);
            }
        }

        return { streak, debug: debug.join('\n') };
    }

    /**
     * Get app version
     * @returns {string} Current app version
     */
    getVersion() {
        return this.version;
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