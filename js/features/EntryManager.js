/**
 * Entry Manager - Handles CRUD operations for entries
 * Part of Macapuno Calculator modular architecture
 */

class EntryManager {
    constructor(app) {
        this.app = app;
    }

    /**
     * Save or update entry
     */
    saveEntry() {
        const entry = this.app.formManager.getFormData();
        if (!entry) return; // Form validation failed

        // Save to storage
        if (this.app.storage.saveEntry(entry)) {
            // Trigger celebration animation for new progress! 🎉
            this.app.celebrationManager.triggerCelebration(entry.wrapperCount);
            
            this.app.displayManager.showNotification('Entry saved successfully!', 'success');
            this.app.displayManager.loadAndDisplayData();
            
            // Reset form after save
            this.app.formManager.resetAfterSave();
            
            // Parallel animation: Start scroll during celebration (not after)
            setTimeout(() => {
                this.app.displayManager.scrollToEntries();
            }, 800); // Start scroll mid-celebration for smooth parallel effect
            
        } else {
            this.app.displayManager.showNotification('Failed to save entry. Please try again.', 'error');
        }
    }

    /**
     * Update an existing entry
     */
    updateEntry() {
        const currentEditingEntry = this.app.modalManager.getCurrentEditingEntry();
        if (!currentEditingEntry) return;

        const newWrapperCount = this.app.calculator.sanitizeNumericInput(
            document.getElementById('editWrapperCount').value
        );

        if (!this.app.calculator.isValidWrapperCount(newWrapperCount)) {
            this.app.displayManager.showNotification('Please enter a valid wrapper count', 'error');
            return;
        }

        const newEarnings = this.app.calculator.calculateEarnings(newWrapperCount);
        
        const updatedData = {
            wrapperCount: newWrapperCount,
            earnings: newEarnings
        };

        if (this.app.storage.updateEntry(currentEditingEntry.date, updatedData)) {
            this.app.displayManager.showNotification('Entry updated successfully!', 'success');
            this.app.modalManager.closeEditModal();
            
            // Refresh all data displays
            this.app.displayManager.loadAndDisplayData();
            
            // Update the main form if it's showing the same date
            const currentDate = document.getElementById('entryDate').value;
            if (currentDate === currentEditingEntry.date) {
                // Refresh the main form to show updated data
                this.app.formManager.handleDateChange();
            }
            
            // Scroll to entries section to show the updated entry
            this.app.displayManager.scrollToEntries();
            
        } else {
            this.app.displayManager.showNotification('Failed to update entry. Please try again.', 'error');
        }
    }

    /**
     * Delete an entry with confirmation
     * @param {string} date - Date of entry to delete
     */
    deleteEntry(date) {
        const entry = this.app.storage.getEntryByDate(date);
        if (!entry) return;

        const confirmMessage = `Delete entry for ${new Date(date).toLocaleDateString()}?\n${entry.wrapperCount} wrappers - ${this.app.calculator.formatEarnings(entry.earnings)}`;
        
        if (confirm(confirmMessage)) {
            if (this.app.storage.deleteEntry(date)) {
                this.app.displayManager.showNotification('Entry deleted successfully', 'success');
                this.app.displayManager.loadAndDisplayData();
                
                // Update main form if it's showing the same date
                const currentDate = document.getElementById('entryDate').value;
                if (currentDate === date) {
                    this.app.formManager.handleDateChange();
                }
            } else {
                this.app.displayManager.showNotification('Failed to delete entry. Please try again.', 'error');
            }
        }
    }

    /**
     * Export data functionality
     */
    exportData() {
        const data = this.app.storage.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `macapuno-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.app.displayManager.showNotification('Data exported successfully!', 'success');
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EntryManager;
}