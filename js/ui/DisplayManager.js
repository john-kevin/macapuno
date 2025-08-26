/**
 * Display Manager - Handles UI updates and display logic
 * Part of Macapuno Calculator modular architecture
 */

class DisplayManager {
    constructor(app) {
        this.app = app;
    }

    /**
     * Update current date display in header
     */
    updateCurrentDate() {
        const currentDateElement = document.getElementById('currentDate');
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        currentDateElement.textContent = today.toLocaleDateString('en-US', options);
    }

    /**
     * Update version display
     */
    updateVersionDisplay() {
        const versionElement = document.getElementById('appVersion');
        if (versionElement) {
            versionElement.textContent = `v${this.app.calculator.getVersion()}`;
        }
    }

    /**
     * Load and display all data
     */
    loadAndDisplayData() {
        this.updateSummaryData();
        this.app.navigationManager.updateMonthNavigation();
        this.displayHistoryEntries(this.app.navigationManager.getCurrentViewMonth());
        
        // Force a small delay to ensure DOM updates are complete
        setTimeout(() => {
            this.app.eventManager.attachHistoryEventListeners();
        }, 100);
    }

    /**
     * Update summary statistics based on currently viewed month
     */
    updateSummaryData() {
        const entries = this.app.storage.getAllEntries();
        
        // Total earnings (all time) with months count
        const totalEarnings = this.app.calculator.calculateTotalEarnings(entries);
        const monthsCount = this.getTotalMonthsCount(entries);
        
        document.getElementById('totalEarnings').textContent = this.app.calculator.formatEarnings(totalEarnings);
        
        // Update total earnings label with months info
        const totalLabel = document.getElementById('totalEarningsLabel');
        if (monthsCount > 0) {
            const monthText = monthsCount === 1 ? 'month' : 'months';
            totalLabel.textContent = `Total Earnings (${monthsCount} ${monthText}):`;
        } else {
            totalLabel.textContent = 'Total Earnings:';
        }

        // Use the currently viewed month as reference for week/month calculations
        const referenceDate = new Date(this.app.navigationManager.getCurrentViewMonth());
        const today = new Date();
        
        // Update labels based on context
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const isCurrentMonth = referenceDate.getMonth() === today.getMonth() && 
                              referenceDate.getFullYear() === today.getFullYear();
        
        // Update month label
        const monthLabel = document.getElementById('monthLabel');
        if (isCurrentMonth) {
            monthLabel.textContent = 'This Month';
        } else {
            monthLabel.textContent = `${monthNames[referenceDate.getMonth()]} ${referenceDate.getFullYear()}`;
        }

        // Update week label
        const weekLabel = document.getElementById('weekLabel');
        const weekStart = new Date(referenceDate);
        weekStart.setDate(referenceDate.getDate() - referenceDate.getDay()); // Start of week
        
        const isCurrentWeek = weekStart <= today && today <= new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
        
        if (isCurrentWeek) {
            weekLabel.textContent = 'This Week';
        } else {
            const weekMonth = monthNames[weekStart.getMonth()];
            const weekDay = weekStart.getDate();
            weekLabel.textContent = `Week of ${weekMonth} ${weekDay}`;
        }
        
        // Weekly earnings (for the week containing the viewed month's first day)
        const weeklyEarnings = this.app.calculator.calculateWeeklyEarnings(entries, referenceDate);
        document.getElementById('weeklyEarnings').textContent = this.app.calculator.formatEarnings(weeklyEarnings);

        // Monthly earnings (for the currently viewed month)
        const monthlyEarnings = this.app.calculator.calculateMonthlyEarnings(entries, referenceDate);
        document.getElementById('monthlyEarnings').textContent = this.app.calculator.formatEarnings(monthlyEarnings);

        // Daily average (only for the currently viewed month)
        const monthEntries = this.app.navigationManager.getEntriesForMonth(this.app.navigationManager.getCurrentViewMonth());
        const dailyAverage = this.app.calculator.calculateDailyAverage(monthEntries);
        document.getElementById('dailyAverage').textContent = dailyAverage.toString();

        // Work streak (global calculation - all entries)
        const workStreak = this.app.calculator.calculateWorkStreak(entries);
        document.getElementById('workStreak').textContent = `${workStreak} days`;
    }

    /**
     * Display history entries for specified month
     * @param {Date} currentViewMonth - Month to display entries for
     */
    displayHistoryEntries(currentViewMonth) {
        const historyList = document.getElementById('historyList');
        const monthEntries = this.app.navigationManager.getEntriesForMonth(currentViewMonth);
        
        // Sort entries newest first within the month
        const sortedEntries = monthEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (sortedEntries.length === 0) {
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const monthName = monthNames[currentViewMonth.getMonth()];
            historyList.innerHTML = `<div class="no-entries">No entries for ${monthName} ${currentViewMonth.getFullYear()}.</div>`;
            return;
        }

        // Clear and rebuild the list to ensure fresh data
        historyList.innerHTML = '';
        
        // Add transition effect
        historyList.classList.add('month-transition');
        
        setTimeout(() => {
            historyList.innerHTML = sortedEntries.map(entry => this.createHistoryItemHTML(entry)).join('');
            
            // Add event listeners to action buttons
            this.app.eventManager.attachHistoryEventListeners();
            
            // Show with transition
            historyList.classList.add('show');
        }, 150);

        setTimeout(() => {
            historyList.classList.remove('month-transition', 'show');
        }, 300);
    }

    /**
     * Create HTML for a history item
     * @param {Object} entry - Entry object
     * @returns {string} HTML string for history item
     */
    createHistoryItemHTML(entry) {
        const date = new Date(entry.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        return `
            <div class="history-item" data-date="${entry.date}">
                <div class="history-date">${date}</div>
                <div class="history-details">
                    <div class="history-wrappers">${entry.wrapperCount} wrappers</div>
                    <div class="history-earnings">${this.app.calculator.formatEarnings(entry.earnings)}</div>
                </div>
                <div class="history-actions">
                    <button class="edit-btn" data-date="${entry.date}">Edit</button>
                    <button class="delete-btn" data-date="${entry.date}">Delete</button>
                </div>
            </div>
        `;
    }

    /**
     * Get total number of months that have entries
     * @param {Array} entries - Array of entry objects
     * @returns {number} Number of unique months with entries
     */
    getTotalMonthsCount(entries) {
        if (!entries || entries.length === 0) {
            return 0;
        }

        const monthsSet = new Set();
        
        entries.forEach(entry => {
            const date = new Date(entry.date);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            monthsSet.add(monthKey);
        });
        
        return monthsSet.size;
    }

    /**
     * Scroll to entries section smoothly
     */
    scrollToEntries() {
        const entriesSection = document.querySelector('.history-section');
        if (entriesSection) {
            // Add a small delay to allow DOM updates to complete
            setTimeout(() => {
                entriesSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }

    /**
     * Show notification to user
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            maxWidth: '300px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.backgroundColor = colors[type] || colors.info;
        if (type === 'warning') {
            notification.style.color = '#212529';
        }

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DisplayManager;
}