/**
 * Modal Manager - Handles all modal operations
 * Part of Macapuno Calculator modular architecture
 */

class ModalManager {
    constructor(app) {
        this.app = app;
        this.currentEditingEntry = null;
    }

    /**
     * Open edit modal with entry data
     * @param {string} date - Date of entry to edit
     */
    openEditModal(date) {
        const entry = this.app.storage.getEntryByDate(date);
        if (!entry) {
            this.app.displayManager.showNotification('Entry not found.', 'error');
            return;
        }

        this.currentEditingEntry = entry;
        
        // Format and display the date (read-only)
        const entryDate = new Date(entry.date);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = entryDate.toLocaleDateString('en-US', options);
        document.getElementById('editDateDisplay').textContent = formattedDate;
        
        // Populate the editable fields
        document.getElementById('editWrapperCount').value = entry.wrapperCount;
        document.getElementById('editEarnings').textContent = this.app.calculator.formatEarnings(entry.earnings);
        
        // Show modal with proper animation
        const modal = document.getElementById('editModal');
        modal.style.display = 'flex'; // Use flex for centering
        modal.classList.remove('closing'); // Remove any previous closing state
        
        // Force reflow then add show class for animation
        modal.offsetHeight; 
        modal.classList.add('show');
        
        // Focus on wrapper count input for immediate editing
        setTimeout(() => {
            const wrapperInput = document.getElementById('editWrapperCount');
            if (wrapperInput) {
                wrapperInput.focus();
                wrapperInput.select();
            }
        }, 150);
    }

    /**
     * Close edit modal with animation
     */
    closeEditModal() {
        const modal = document.getElementById('editModal');
        
        // Add closing class for reverse animation
        modal.classList.remove('show');
        modal.classList.add('closing');
        
        // Hide modal after animation completes
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
        }, 300);
        
        this.currentEditingEntry = null;
    }

    /**
     * Update earnings display in edit modal
     * @param {number} wrapperCount - Wrapper count to calculate earnings for
     */
    updateEditEarnings(wrapperCount) {
        const earnings = this.app.calculator.calculateEarnings(wrapperCount);
        const editEarningsElement = document.getElementById('editEarnings');
        editEarningsElement.textContent = this.app.calculator.formatEarnings(earnings);
    }

    /**
     * Get current editing entry
     * @returns {Object|null} Current entry being edited
     */
    getCurrentEditingEntry() {
        return this.currentEditingEntry;
    }

    /**
     * Open delete confirmation modal
     * @param {string} date - Date of entry to delete
     */
    openDeleteModal(date) {
        const entry = this.app.storage.getEntryByDate(date);
        if (!entry) {
            this.app.displayManager.showNotification('Entry not found.', 'error');
            return;
        }

        this.currentEditingEntry = entry; // Reuse for delete operations
        
        // Format and display the entry details
        const entryDate = new Date(entry.date);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const formattedDate = entryDate.toLocaleDateString('en-US', options);
        
        // Populate delete entry info
        const deleteEntryInfo = document.getElementById('deleteEntryInfo');
        deleteEntryInfo.innerHTML = `
            <div class="delete-entry-date">${formattedDate}</div>
            <div class="delete-entry-details">${entry.wrapperCount} wrappers</div>
            <div class="delete-entry-earnings">${this.app.calculator.formatEarnings(entry.earnings)}</div>
        `;
        
        // Show modal with proper animation
        const modal = document.getElementById('deleteModal');
        modal.style.display = 'flex';
        modal.classList.remove('closing');
        
        // Force reflow then add show class for animation
        modal.offsetHeight;
        modal.classList.add('show');
    }

    /**
     * Close delete confirmation modal
     */
    closeDeleteModal() {
        const modal = document.getElementById('deleteModal');
        
        // Add closing class for reverse animation
        modal.classList.remove('show');
        modal.classList.add('closing');
        
        // Hide modal after animation completes
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
        }, 300);
        
        this.currentEditingEntry = null;
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModalManager;
}