/**
 * Form Manager - Handles main form operations
 * Part of Macapuno Calculator modular architecture
 */

class FormManager {
    constructor(app) {
        this.app = app;
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
        const existingEntry = this.app.storage.getEntryByDate(selectedDate);
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
     * Update current earnings display with animation
     * @param {number} wrapperCount - Wrapper count to calculate earnings for
     */
    updateCurrentEarnings(wrapperCount) {
        const earnings = this.app.calculator.calculateEarnings(wrapperCount);
        const currentEarningsElement = document.getElementById('currentEarnings');
        currentEarningsElement.textContent = this.app.calculator.formatEarnings(earnings);
        
        // Add visual feedback for calculation
        currentEarningsElement.style.transform = 'scale(1.05)';
        setTimeout(() => {
            currentEarningsElement.style.transform = 'scale(1)';
        }, 150);
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
     * Get form data for saving
     * @returns {Object|null} Form data or null if invalid
     */
    getFormData() {
        const entryDate = document.getElementById('entryDate').value;
        const wrapperCountInput = document.getElementById('wrapperCount');
        const wrapperCount = this.app.calculator.sanitizeNumericInput(wrapperCountInput.value);

        // Validation
        if (!entryDate) {
            this.app.displayManager.showNotification('Please select a date', 'error');
            return null;
        }

        if (!this.app.calculator.isValidWrapperCount(wrapperCount)) {
            this.app.displayManager.showNotification('Please enter a valid wrapper count', 'error');
            wrapperCountInput.focus();
            return null;
        }

        // Calculate earnings
        const earnings = this.app.calculator.calculateEarnings(wrapperCount);

        return {
            date: entryDate,
            wrapperCount: wrapperCount,
            earnings: earnings
        };
    }

    /**
     * Reset form after successful save
     */
    resetAfterSave() {
        const wrapperCountInput = document.getElementById('wrapperCount');
        
        // Clear the wrapper count input for next entry
        wrapperCountInput.value = '';
        this.updateCurrentEarnings(0);
        
        // Since we just saved an entry for the selected date, 
        // the button should now be in "Update Entry" mode
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.textContent = 'Update Entry';
        saveBtn.classList.add('update-mode');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormManager;
}