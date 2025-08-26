/**
 * Macapuno Wrapper Salary Calculator
 * Main application logic and UI interactions
 */

class MacapunoApp {
    constructor() {
        this.calculator = new Calculator();
        this.storage = new StorageManager();
        this.currentEditingEntry = null;
        
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
     * Set today's date as default in date input
     */
    setDefaultDate() {
        const entryDateInput = document.getElementById('entryDate');
        const today = new Date();
        const dateString = today.toISOString().split('T')[0];
        
        entryDateInput.value = dateString;
        this.handleDateChange();
    }

    /**
     * Handle date change - load existing entry if available
     */
    handleDateChange() {
        const entryDateInput = document.getElementById('entryDate');
        const selectedDate = entryDateInput.value;
        
        if (!selectedDate) return;

        // Check if entry exists for selected date
        const existingEntry = this.storage.getEntryByDate(selectedDate);
        
        if (existingEntry) {
            // Load existing entry
            document.getElementById('wrapperCount').value = existingEntry.wrapperCount;
            this.updateCurrentEarnings(existingEntry.wrapperCount);
            document.getElementById('saveBtn').textContent = 'Update Entry';
        } else {
            // Clear form for new entry
            document.getElementById('wrapperCount').value = '';
            this.updateCurrentEarnings(0);
            document.getElementById('saveBtn').textContent = 'Save Entry';
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
            
            // Optional: Clear form after successful save
            // this.clearForm();
        } else {
            this.showNotification('Failed to save entry. Please try again.', 'error');
        }
    }

    /**
     * Load and display all data
     */
    loadAndDisplayData() {
        this.updateSummaryData();
        this.displayHistoryEntries();
    }

    /**
     * Update summary statistics
     */
    updateSummaryData() {
        const entries = this.storage.getAllEntries();
        
        // Total earnings
        const totalEarnings = this.calculator.calculateTotalEarnings(entries);
        document.getElementById('totalEarnings').textContent = this.calculator.formatEarnings(totalEarnings);

        // Weekly earnings
        const weeklyEarnings = this.calculator.calculateWeeklyEarnings(entries);
        document.getElementById('weeklyEarnings').textContent = this.calculator.formatEarnings(weeklyEarnings);

        // Monthly earnings
        const monthlyEarnings = this.calculator.calculateMonthlyEarnings(entries);
        document.getElementById('monthlyEarnings').textContent = this.calculator.formatEarnings(monthlyEarnings);

        // Daily average
        const dailyAverage = this.calculator.calculateDailyAverage(entries);
        document.getElementById('dailyAverage').textContent = dailyAverage.toString();

        // Work streak
        const workStreak = this.calculator.calculateWorkStreak(entries);
        document.getElementById('workStreak').textContent = `${workStreak} days`;
    }

    /**
     * Display history entries
     */
    displayHistoryEntries() {
        const historyList = document.getElementById('historyList');
        const entries = this.storage.getSortedEntries(); // Newest first

        if (entries.length === 0) {
            historyList.innerHTML = '<div class="no-entries">No entries yet. Start tracking your work!</div>';
            return;
        }

        historyList.innerHTML = entries.map(entry => this.createHistoryItemHTML(entry)).join('');
        
        // Add event listeners to action buttons
        this.attachHistoryEventListeners();
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