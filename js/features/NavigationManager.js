/**
 * Navigation Manager - Handles month navigation
 * Part of Macapuno Calculator modular architecture
 */

class NavigationManager {
    constructor(app) {
        this.app = app;
        this.currentViewMonth = new Date(); // Track current month being viewed
    }

    /**
     * Navigate to different month
     * @param {number} direction - -1 for previous month, 1 for next month
     */
    navigateMonth(direction) {
        const newMonth = new Date(this.currentViewMonth);
        newMonth.setMonth(newMonth.getMonth() + direction);
        
        this.currentViewMonth = newMonth;
        this.updateMonthNavigation();
        this.app.displayManager.displayHistoryEntries(this.currentViewMonth);
    }

    /**
     * Update month navigation display
     */
    updateMonthNavigation() {
        const monthYear = document.getElementById('monthYear');
        const entryCount = document.getElementById('entryCount');
        const prevBtn = document.getElementById('prevMonthBtn');
        const nextBtn = document.getElementById('nextMonthBtn');

        // Format month and year
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];
        
        const month = monthNames[this.currentViewMonth.getMonth()];
        const year = this.currentViewMonth.getFullYear();
        monthYear.textContent = `${month} ${year}`;

        // Count entries for this month
        const monthEntries = this.getEntriesForMonth(this.currentViewMonth);
        const count = monthEntries.length;
        entryCount.textContent = `(${count} ${count === 1 ? 'entry' : 'entries'})`;

        // Get all available months with entries
        const availableMonths = this.getAvailableMonths();
        
        if (availableMonths.length === 0) {
            // No entries at all
            prevBtn.disabled = true;
            nextBtn.disabled = true;
            return;
        }

        // Sort available months (newest first)
        availableMonths.sort((a, b) => b - a);
        
        const currentMonthKey = `${this.currentViewMonth.getFullYear()}-${this.currentViewMonth.getMonth()}`;
        const currentIndex = availableMonths.findIndex(month => 
            `${month.getFullYear()}-${month.getMonth()}` === currentMonthKey
        );

        // Enable/disable buttons based on position in available months
        prevBtn.disabled = currentIndex >= availableMonths.length - 1; // Can't go further back
        nextBtn.disabled = currentIndex <= 0; // Can't go further forward
    }

    /**
     * Show month picker (simple version - can be enhanced later)
     */
    showMonthPicker() {
        const allEntries = this.app.storage.getAllEntries();
        if (allEntries.length === 0) {
            this.app.displayManager.showNotification('No entries available', 'info');
            return;
        }

        // For now, just cycle through available months
        const availableMonths = this.getAvailableMonths();
        if (availableMonths.length <= 1) {
            this.app.displayManager.showNotification('Only one month available', 'info');
            return;
        }

        // Find current position and move to next available month
        const currentMonthKey = `${this.currentViewMonth.getFullYear()}-${this.currentViewMonth.getMonth()}`;
        let currentIndex = availableMonths.findIndex(month => 
            `${month.getFullYear()}-${month.getMonth()}` === currentMonthKey
        );
        
        const nextIndex = (currentIndex + 1) % availableMonths.length;
        this.currentViewMonth = availableMonths[nextIndex];
        
        this.updateMonthNavigation();
        this.app.displayManager.displayHistoryEntries(this.currentViewMonth);
    }

    /**
     * Get entries for a specific month
     * @param {Date} date - Date in the target month
     * @returns {Array} Entries for that month
     */
    getEntriesForMonth(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        const startOfMonth = new Date(year, month, 1);
        const endOfMonth = new Date(year, month + 1, 0);
        
        const startDateStr = startOfMonth.toISOString().split('T')[0];
        const endDateStr = endOfMonth.toISOString().split('T')[0];
        
        return this.app.storage.getAllEntries().filter(entry => 
            entry.date >= startDateStr && entry.date <= endDateStr
        );
    }

    /**
     * Get list of months that have entries
     * @returns {Array} Array of Date objects representing months with entries
     */
    getAvailableMonths() {
        const allEntries = this.app.storage.getAllEntries();
        const monthsSet = new Set();
        
        allEntries.forEach(entry => {
            const date = new Date(entry.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            monthsSet.add(monthKey);
        });
        
        return Array.from(monthsSet)
            .map(monthKey => {
                const [year, month] = monthKey.split('-').map(Number);
                return new Date(year, month, 1);
            })
            .sort((a, b) => b - a); // Newest first for consistency
    }

    /**
     * Get current view month
     * @returns {Date} Current month being viewed
     */
    getCurrentViewMonth() {
        return this.currentViewMonth;
    }

    /**
     * Set current view month
     * @param {Date} date - Month to set as current view
     */
    setCurrentViewMonth(date) {
        this.currentViewMonth = new Date(date);
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationManager;
}