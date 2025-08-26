/**
 * Event Manager - Handles all DOM event listeners
 * Part of Macapuno Calculator modular architecture
 */

class EventManager {
    constructor(app) {
        this.app = app;
    }

    /**
     * Set up all event listeners for the application
     */
    setupAllEventListeners() {
        this.setupFormEvents();
        this.setupModalEvents();
        this.setupNavigationEvents();
        this.setupKeyboardShortcuts();
    }

    /**
     * Main form interaction events
     */
    setupFormEvents() {
        const wrapperCountInput = document.getElementById('wrapperCount');
        const saveBtn = document.getElementById('saveBtn');
        const entryDateInput = document.getElementById('entryDate');

        // Real-time earnings calculation
        wrapperCountInput.addEventListener('input', (e) => {
            this.app.formManager.updateCurrentEarnings(e.target.value);
        });

        // Save entry
        saveBtn.addEventListener('click', () => {
            this.app.entryManager.saveEntry();
        });

        // Date change
        entryDateInput.addEventListener('change', () => {
            this.app.formManager.handleDateChange();
        });
    }

    /**
     * Modal interaction events
     */
    setupModalEvents() {
        const editModal = document.getElementById('editModal');
        const closeModal = document.getElementById('closeModal');
        const cancelBtn = document.getElementById('cancelBtn');
        const updateBtn = document.getElementById('updateBtn');
        const editWrapperCount = document.getElementById('editWrapperCount');

        // Modal close events
        closeModal.addEventListener('click', () => {
            this.app.modalManager.closeEditModal();
        });
        
        cancelBtn.addEventListener('click', () => {
            this.app.modalManager.closeEditModal();
        });

        // Close modal when clicking outside
        editModal.addEventListener('click', (e) => {
            if (e.target === editModal) {
                this.app.modalManager.closeEditModal();
            }
        });

        // Update earnings in modal
        editWrapperCount.addEventListener('input', (e) => {
            this.app.modalManager.updateEditEarnings(e.target.value);
        });

        // Update entry
        updateBtn.addEventListener('click', () => {
            this.app.entryManager.updateEntry();
        });
    }

    /**
     * Month navigation events
     */
    setupNavigationEvents() {
        const prevMonthBtn = document.getElementById('prevMonthBtn');
        const nextMonthBtn = document.getElementById('nextMonthBtn');
        const monthYear = document.getElementById('monthYear');

        prevMonthBtn.addEventListener('click', () => {
            this.app.navigationManager.navigateMonth(-1);
        });

        nextMonthBtn.addEventListener('click', () => {
            this.app.navigationManager.navigateMonth(1);
        });

        monthYear.addEventListener('click', () => {
            this.app.navigationManager.showMonthPicker();
        });
    }

    /**
     * Keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        const editModal = document.getElementById('editModal');
        const wrapperCountInput = document.getElementById('wrapperCount');

        document.addEventListener('keydown', (e) => {
            // Escape to close modal
            if (e.key === 'Escape') {
                this.app.modalManager.closeEditModal();
            }
            
            // Enter to save (when not in modal)
            if (e.key === 'Enter' && !editModal.classList.contains('show')) {
                if (e.target === wrapperCountInput) {
                    this.app.entryManager.saveEntry();
                }
            }
        });
    }

    /**
     * Attach history event listeners (dynamic content)
     */
    attachHistoryEventListeners() {
        // Edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const date = e.target.getAttribute('data-date');
                this.app.modalManager.openEditModal(date);
            });
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const date = e.target.getAttribute('data-date');
                this.app.entryManager.deleteEntry(date);
            });
        });
    }
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventManager;
}