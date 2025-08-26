/**
 * Macapuno Wrapper Salary Calculator
 * Main application logic and UI interactions
 */

class MacapunoApp {
    constructor() {
        this.calculator = new Calculator();
        this.storage = new StorageManager();
        this.currentEditingEntry = null;
        this.currentViewMonth = new Date(); // Track current month being viewed
        
        // Initialize the app
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.updateCurrentDate();
        this.setDefaultDate();
        this.updateVersionDisplay();
        this.loadAndDisplayData();
        
        // Check localStorage support and show warning if needed
        if (!this.storage.isLocalStorageSupported) {
            this.showNotification('Warning: Data will not be saved between sessions. Please use a modern browser.', 'warning');
        }
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Main form interactions
        const wrapperCountInput = document.getElementById('wrapperCount');
        const saveBtn = document.getElementById('saveBtn');
        const entryDateInput = document.getElementById('entryDate');

        // Real-time earnings calculation
        wrapperCountInput.addEventListener('input', (e) => {
            this.updateCurrentEarnings(e.target.value);
        });

        // Save entry
        saveBtn.addEventListener('click', () => {
            this.saveEntry();
        });

        // Date change
        entryDateInput.addEventListener('change', () => {
            this.handleDateChange();
        });

        // Modal interactions
        const editModal = document.getElementById('editModal');
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const updateBtn = document.getElementById('updateBtn');
        const editWrapperCount = document.getElementById('editWrapperCount');

        // Modal close events
        closeModal.addEventListener('click', () => {
            this.closeEditModal();
        });
        
        cancelBtn.addEventListener('click', () => {
            this.closeEditModal();
        });

        // Close modal when clicking outside
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                this.closeEditModal();
            }
        });

        // Update earnings in modal
        editWrapperCount.addEventListener('input', (e) => {
            this.updateEditEarnings(e.target.value);
        });

        // Update entry
        updateBtn.addEventListener('click', () => {
            this.updateEntry();
        });

        // Month navigation
        const prevMonthBtn = document.getElementById('prevMonthBtn');
        const nextMonthBtn = document.getElementById('nextMonthBtn');
        const monthYear = document.getElementById('monthYear');

        prevMonthBtn.addEventListener('click', () => {
            this.navigateMonth(-1);
        });

        nextMonthBtn.addEventListener('click', () => {
            this.navigateMonth(1);
        });

        monthYear.addEventListener('click', () => {
            this.showMonthPicker();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Escape to close modal
            if (e.key === 'Escape') {
                this.closeEditModal();
            }
            
            // Enter to save (when not in modal)
            if (e.key === 'Enter' && !editModal.classList.contains('show')) {
                if (e.target === wrapperCountInput) {
                    this.saveEntry();
                }
            }
        });
    }

    /**
     * Update version display
     */
    updateVersionDisplay() {
        const versionElement = document.getElementById('appVersion');
        if (versionElement) {
            versionElement.textContent = `v${this.calculator.getVersion()}`;
        }
    }

    /**
     * Update current date display
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
     * Update selected date display with formatted text and styling
     * @param {string} dateString - Date string in YYYY-MM-DD format
     */
    updateSelectedDateDisplay(dateString) {
        const selectedDateElement = document.getElementById('selectedDateDisplay');
        if (!selectedDateElement || !dateString) return;

        const selectedDate = new Date(dateString);
        const today = new Date();
        
        // Reset time parts for accurate comparison
        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        // Format the date nicely
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        
        let displayText = selectedDate.toLocaleDateString('en-US', options);
        
        // Add contextual prefix and styling
        selectedDateElement.className = 'selected-date-display';
        
        if (selectedDate.getTime() === today.getTime()) {
            displayText = `Today, ${selectedDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            })}`;
            selectedDateElement.classList.add('today');
        } else if (selectedDate > today) {
            displayText = `Future Date: ${displayText}`;
            selectedDateElement.classList.add('future');
        } else {
            selectedDateElement.classList.add('past');
        }
        
        selectedDateElement.textContent = displayText;
    }

    /**
     * Set today's date as default in date input
     */
    setDefaultDate() {
        const entryDateInput = document.getElementById('entryDate');
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        
        entryDateInput.value = dateString;
        this.updateSelectedDateDisplay(dateString);
        this.handleDateChange();
    }

    /**
     * Handle date change - load existing entry if available
     */
    handleDateChange() {
        const entryDateInput = document.getElementById('entryDate');
        const selectedDate = entryDateInput.value;
        
        if (!selectedDate) return;

        // Update the selected date display
        this.updateSelectedDateDisplay(selectedDate);

        // Check if entry exists for selected date
        const existingEntry = this.storage.getEntryByDate(selectedDate);
        const saveBtn = document.getElementById('saveBtn');
        
        if (existingEntry) {
            // Load existing entry
            document.getElementById('wrapperCount').value = existingEntry.wrapperCount;
            this.updateCurrentEarnings(existingEntry.wrapperCount);
            
            // Update button for update mode
            saveBtn.textContent = 'Update Entry';
            saveBtn.classList.add('update-mode');
        } else {
            // Clear form for new entry
            document.getElementById('wrapperCount').value = '';
            this.updateCurrentEarnings(0);
            
            // Update button for save mode
            saveBtn.textContent = 'Save Entry';
            saveBtn.classList.remove('update-mode');
        }
    }

    /**
     * Update current earnings display
     */
    updateCurrentEarnings(wrapperCount) {
        const earnings = this.calculator.calculateEarnings(wrapperCount);
        const currentEarningsElement = document.getElementById('currentEarnings');
        currentEarningsElement.textContent = this.calculator.formatEarnings(earnings);
        
        // Add visual feedback for calculation
        currentEarningsElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            currentEarningsElement.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * Save or update entry
     */
    saveEntry() {
        const entryDate = document.getElementById('entryDate').value;
        const wrapperCountInput = document.getElementById('wrapperCount');
        const wrapperCount = this.calculator.sanitizeNumericInput(wrapperCountInput.value);

        // Validation
        if (!entryDate) {
            this.showNotification('Please select a date', 'error');
            return;
        }

        if (!this.calculator.isValidWrapperCount(wrapperCount)) {
            this.showNotification('Please enter a valid wrapper count', 'error');
            wrapperCountInput.focus();
            return;
        }

        // Calculate earnings
        const earnings = this.calculator.calculateEarnings(wrapperCount);

        // Create entry object
        const entry = {
            date: entryDate,
            wrapperCount: wrapperCount,
            earnings: earnings
        };

        // Save to storage
        if (this.storage.saveEntry(entry)) {
            this.showNotification('Entry saved successfully!', 'success');
            this.loadAndDisplayData();
            
            // Clear the wrapper count input for next entry
            wrapperCountInput.value = '';
            this.updateCurrentEarnings(0);
            
            // Since we just saved an entry for the selected date, 
            // the button should now be in "Update Entry" mode
            const saveBtn = document.getElementById('saveBtn');
            saveBtn.textContent = 'Update Entry';
            saveBtn.classList.add('update-mode');
            
            // Scroll to entries section to show the saved entry
            this.scrollToEntries();
            
            // Keep the same date for convenience (user might want to add more entries for same date)
        } else {
            this.showNotification('Failed to save entry. Please try again.', 'error');
        }
    }

    /**
     * Load and display all data
     */
    loadAndDisplayData() {
        this.updateSummaryData();
        this.updateMonthNavigation();
        this.displayHistoryEntries();
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
     * Navigate to different month
     * @param {number} direction - -1 for previous month, 1 for next month
     */
    navigateMonth(direction) {
        const newMonth = new Date(this.currentViewMonth);
        newMonth.setMonth(newMonth.getMonth() + direction);
        
        this.currentViewMonth = newMonth;
        this.updateMonthNavigation();
        this.displayHistoryEntries();
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

        console.log('Debug navigation:', {
            currentMonth: `${month} ${year}`,
            currentIndex,
            totalAvailable: availableMonths.length,
            prevDisabled: prevBtn.disabled,
            nextDisabled: nextBtn.disabled,
            availableMonths: availableMonths.map(m => `${monthNames[m.getMonth()]} ${m.getFullYear()}`)
        });
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
        
        return this.storage.getAllEntries().filter(entry => 
            entry.date >= startDateStr && entry.date <= endDateStr
        );
    }

    /**
     * Show month picker (simple version - can be enhanced later)
     */
    showMonthPicker() {
        const allEntries = this.storage.getAllEntries();
        if (allEntries.length === 0) {
            this.showNotification('No entries available', 'info');
            return;
        }

        // For now, just cycle through available months
        const availableMonths = this.getAvailableMonths();
        if (availableMonths.length <= 1) {
            this.showNotification('Only one month available', 'info');
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
        this.displayHistoryEntries();
    }

    /**
     * Get list of months that have entries
     * @returns {Array} Array of Date objects representing months with entries
     */
    getAvailableMonths() {
        const allEntries = this.storage.getAllEntries();
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
     * Update summary statistics based on currently viewed month
     */
    updateSummaryData() {
        const entries = this.storage.getAllEntries();
        
        // Total earnings (all time) with months count
        const totalEarnings = this.calculator.calculateTotalEarnings(entries);
        const monthsCount = this.getTotalMonthsCount(entries);
        
        document.getElementById('totalEarnings').textContent = this.calculator.formatEarnings(totalEarnings);
        
        // Update total earnings label with months info
        const totalLabel = document.getElementById('totalEarningsLabel');
        if (monthsCount > 0) {
            const monthText = monthsCount === 1 ? 'month' : 'months';
            totalLabel.textContent = `Total Earnings (${monthsCount} ${monthText}):`;
        } else {
            totalLabel.textContent = 'Total Earnings:';
        }

        // Use the currently viewed month as reference for week/month calculations
        const referenceDate = new Date(this.currentViewMonth);
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
        const weeklyEarnings = this.calculator.calculateWeeklyEarnings(entries, referenceDate);
        document.getElementById('weeklyEarnings').textContent = this.calculator.formatEarnings(weeklyEarnings);

        // Monthly earnings (for the currently viewed month)
        const monthlyEarnings = this.calculator.calculateMonthlyEarnings(entries, referenceDate);
        document.getElementById('monthlyEarnings').textContent = this.calculator.formatEarnings(monthlyEarnings);

        // Daily average (only for the currently viewed month)
        const monthEntries = this.getEntriesForMonth(this.currentViewMonth);
        const dailyAverage = this.calculator.calculateDailyAverage(monthEntries);
        document.getElementById('dailyAverage').textContent = dailyAverage.toString();

        // Work streak (global calculation - all entries)
        const workStreak = this.calculator.calculateWorkStreak(entries);
        document.getElementById('workStreak').textContent = `${workStreak} days`;
    }

    /**
     * Display history entries for current month
     */
    displayHistoryEntries() {
        const historyList = document.getElementById('historyList');
        const monthEntries = this.getEntriesForMonth(this.currentViewMonth);
        
        // Sort entries newest first within the month
        const sortedEntries = monthEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

        if (sortedEntries.length === 0) {
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            const monthName = monthNames[this.currentViewMonth.getMonth()];
            historyList.innerHTML = `<div class="no-entries">No entries for ${monthName} ${this.currentViewMonth.getFullYear()}.</div>`;
            return;
        }

        // Add transition effect
        historyList.classList.add('month-transition');
        
        setTimeout(() => {
            historyList.innerHTML = sortedEntries.map(entry => this.createHistoryItemHTML(entry)).join('');
            
            // Add event listeners to action buttons
            this.attachHistoryEventListeners();
            
            // Show with transition
            historyList.classList.add('show');
        }, 150);

        setTimeout(() => {
            historyList.classList.remove('month-transition', 'show');
        }, 300);
    }

    /**
     * Create HTML for a history item
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
                    <div class="history-earnings">${this.calculator.formatEarnings(entry.earnings)}</div>
                </div>
                <div class="history-actions">
                    <button class="edit-btn" data-date="${entry.date}">Edit</button>
                    <button class="delete-btn" data-date="${entry.date}">Delete</button>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners to history action buttons
     */
    attachHistoryEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const date = e.target.getAttribute('data-date');
                this.openEditModal(date);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const date = e.target.getAttribute('data-date');
                this.deleteEntry(date);
            });
        });
    }

    /**
     * Open edit modal for a specific entry
     */
    openEditModal(date) {
        const entry = this.storage.getEntryByDate(date);
        if (!entry) {
            this.showNotification('Entry not found', 'error');
            return;
        }

        this.currentEditingEntry = entry;
        
        // Populate modal fields
        document.getElementById('editDate').value = entry.date;
        document.getElementById('editWrapperCount').value = entry.wrapperCount;
        this.updateEditEarnings(entry.wrapperCount);

        // Show modal
        const modal = document.getElementById('editModal');
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Focus on wrapper count input
        setTimeout(() => {
            document.getElementById('editWrapperCount').focus();
        }, 100);
    }

    /**
     * Close edit modal
     */
    closeEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.remove('show');
        modal.style.display = 'none';
        this.currentEditingEntry = null;
    }

    /**
     * Update earnings display in edit modal
     */
    updateEditEarnings(wrapperCount) {
        const earnings = this.calculator.calculateEarnings(wrapperCount);
        const editEarningsElement = document.getElementById('editEarnings');
        editEarningsElement.textContent = this.calculator.formatEarnings(earnings);
    }

    /**
     * Update an existing entry
     */
    updateEntry() {
        if (!this.currentEditingEntry) return;

        const newWrapperCount = this.calculator.sanitizeNumericInput(
            document.getElementById('editWrapperCount').value
        );

        if (!this.calculator.isValidWrapperCount(newWrapperCount)) {
            this.showNotification('Please enter a valid wrapper count', 'error');
            return;
        }

        const newEarnings = this.calculator.calculateEarnings(newWrapperCount);
        
        const updatedData = {
            wrapperCount: newWrapperCount,
            earnings: newEarnings
        };

        if (this.storage.updateEntry(this.currentEditingEntry.date, updatedData)) {
            this.showNotification('Entry updated successfully!', 'success');
            this.closeEditModal();
            this.loadAndDisplayData();
            
            // Scroll to entries section to show the updated entry
            this.scrollToEntries();
            
            // Update main form if it's showing the same date
            const currentDate = document.getElementById('entryDate').value;
            if (currentDate === this.currentEditingEntry.date) {
                this.handleDateChange();
            }
        } else {
            this.showNotification('Failed to update entry. Please try again.', 'error');
        }
    }

    /**
     * Delete an entry with confirmation
     */
    deleteEntry(date) {
        const entry = this.storage.getEntryByDate(date);
        if (!entry) return;

        const confirmMessage = `Delete entry for ${new Date(date).toLocaleDateString()}?\n${entry.wrapperCount} wrappers - ${this.calculator.formatEarnings(entry.earnings)}`;
        
        if (confirm(confirmMessage)) {
            if (this.storage.deleteEntry(date)) {
                this.showNotification('Entry deleted successfully', 'success');
                this.loadAndDisplayData();
                
                // Update main form if it's showing the same date
                const currentDate = document.getElementById('entryDate').value;
                if (currentDate === date) {
                    this.handleDateChange();
                }
            } else {
                this.showNotification('Failed to delete entry. Please try again.', 'error');
            }
        }
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
     * Clear the main form
     */
    clearForm() {
        document.getElementById('wrapperCount').value = '';
        this.updateCurrentEarnings(0);
        this.setDefaultDate();
    }

    /**
     * Show notification to user
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

    /**
     * Export data functionality (for future use)
     */
    exportData() {
        const data = this.storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `macapuno-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!', 'success');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.macapunoApp = new MacapunoApp();
});

// Make app globally available for debugging
if (typeof window !== 'undefined') {
    window.MacapunoApp = MacapunoApp;
}