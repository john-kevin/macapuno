/**
 * Macapuno Wrapper Salary Calculator
 * Main application orchestrator - connects all modules
 * Modular architecture v1.5.0
 */

class MacapunoApp {
    constructor() {
        // Core modules
        this.calculator = new Calculator();
        this.storage = new StorageManager();
        
        // Initialize managers
        this.initializeManagers();
        
        // Initialize the app
        this.init();
    }

    /**
     * Initialize all manager modules
     */
    initializeManagers() {
        // UI Managers
        this.formManager = new FormManager(this);
        this.modalManager = new ModalManager(this);
        this.displayManager = new DisplayManager(this);
        
        // Feature Managers
        this.entryManager = new EntryManager(this);
        this.navigationManager = new NavigationManager(this);
        this.celebrationManager = new CelebrationManager(this);
        
        // Core Managers (must be last as it references other managers)
        this.eventManager = new EventManager(this);
    }

    /**
     * Initialize the application
     */
    init() {
        // Set up all event listeners
        this.eventManager.setupAllEventListeners();
        
        // Initialize UI displays
        this.displayManager.updateCurrentDate();
        this.formManager.setDefaultDate();
        this.displayManager.updateVersionDisplay();
        this.displayManager.loadAndDisplayData();
        
        // Check localStorage support and show warning if needed
        if (!this.storage.isLocalStorageSupported) {
            this.displayManager.showNotification(
                'Warning: Data will not be saved between sessions. Please use a modern browser.', 
                'warning'
            );
        }

        // Log successful initialization
        console.log(`🎉 Macapuno Calculator v${this.calculator.getVersion()} initialized successfully!`);
        console.log('📦 Modular architecture loaded:', {
            core: ['Calculator', 'StorageManager', 'EventManager'],
            ui: ['FormManager', 'ModalManager', 'DisplayManager'],
            features: ['EntryManager', 'NavigationManager', 'CelebrationManager']
        });
    }

    /**
     * Get app version for debugging
     * @returns {string} App version
     */
    getVersion() {
        return this.calculator.getVersion();
    }

    /**
     * Export data functionality (exposed method)
     */
    exportData() {
        this.entryManager.exportData();
    }

    /**
     * Get app statistics for debugging
     * @returns {Object} App statistics
     */
    getStats() {
        const entries = this.storage.getAllEntries();
        return {
            version: this.getVersion(),
            totalEntries: entries.length,
            totalMonths: this.displayManager.getTotalMonthsCount(entries),
            totalEarnings: this.calculator.calculateTotalEarnings(entries),
            currentMonth: this.navigationManager.getCurrentViewMonth().toISOString().split('T')[0],
            storageSupported: this.storage.isLocalStorageSupported,
            modules: {
                calculator: !!this.calculator,
                storage: !!this.storage,
                formManager: !!this.formManager,
                modalManager: !!this.modalManager,
                displayManager: !!this.displayManager,
                entryManager: !!this.entryManager,
                navigationManager: !!this.navigationManager,
                celebrationManager: !!this.celebrationManager,
                eventManager: !!this.eventManager
            }
        };
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