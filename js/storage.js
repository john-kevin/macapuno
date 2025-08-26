/**
 * Macapuno Wrapper Salary Calculator
 * Local Storage management and data persistence
 */

class StorageManager {
    constructor() {
        this.storageKey = 'macapuno-entries';
        this.settingsKey = 'macapuno-settings';
        this.isLocalStorageSupported = this.checkLocalStorageSupport();
    }

    /**
     * Check if localStorage is supported and available
     * @returns {boolean} Whether localStorage is supported
     */
    checkLocalStorageSupport() {
        try {
            const test = 'localStorage-test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not supported or blocked');
            return false;
        }
    }

    /**
     * Get all entries from localStorage
     * @returns {Array} Array of entry objects
     */
    getAllEntries() {
        if (!this.isLocalStorageSupported) {
            return [];
        }

        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) {
                return [];
            }
            
            const entries = JSON.parse(data);
            return Array.isArray(entries) ? entries : [];
        } catch (error) {
            console.error('Error reading entries from storage:', error);
            return [];
        }
    }

    /**
     * Save entry to localStorage
     * @param {Object} entry - Entry object to save
     * @returns {boolean} Success status
     */
    saveEntry(entry) {
        if (!this.isLocalStorageSupported) {
            console.warn('Cannot save entry: localStorage not supported');
            return false;
        }

        if (!this.validateEntry(entry)) {
            console.error('Invalid entry data:', entry);
            return false;
        }

        try {
            const entries = this.getAllEntries();
            
            // Check for existing entry on the same date
            const existingIndex = entries.findIndex(e => e.date === entry.date);
            
            if (existingIndex !== -1) {
                // Update existing entry
                entries[existingIndex] = {
                    ...entries[existingIndex],
                    ...entry,
                    timestamp: Date.now()
                };
            } else {
                // Add new entry
                entries.push({
                    ...entry,
                    timestamp: Date.now()
                });
            }

            localStorage.setItem(this.storageKey, JSON.stringify(entries));
            return true;
        } catch (error) {
            console.error('Error saving entry to storage:', error);
            return false;
        }
    }

    /**
     * Update an existing entry
     * @param {string} date - Date of entry to update
     * @param {Object} updatedData - Updated entry data
     * @returns {boolean} Success status
     */
    updateEntry(date, updatedData) {
        if (!this.isLocalStorageSupported) {
            return false;
        }

        try {
            const entries = this.getAllEntries();
            const entryIndex = entries.findIndex(entry => entry.date === date);
            
            if (entryIndex === -1) {
                console.error('Entry not found for date:', date);
                return false;
            }

            entries[entryIndex] = {
                ...entries[entryIndex],
                ...updatedData,
                timestamp: Date.now()
            };

            localStorage.setItem(this.storageKey, JSON.stringify(entries));
            return true;
        } catch (error) {
            console.error('Error updating entry:', error);
            return false;
        }
    }

    /**
     * Delete an entry by date
     * @param {string} date - Date of entry to delete
     * @returns {boolean} Success status
     */
    deleteEntry(date) {
        if (!this.isLocalStorageSupported) {
            return false;
        }

        try {
            const entries = this.getAllEntries();
            const filteredEntries = entries.filter(entry => entry.date !== date);
            
            if (filteredEntries.length === entries.length) {
                console.error('Entry not found for date:', date);
                return false;
            }

            localStorage.setItem(this.storageKey, JSON.stringify(filteredEntries));
            return true;
        } catch (error) {
            console.error('Error deleting entry:', error);
            return false;
        }
    }

    /**
     * Get entry by date
     * @param {string} date - Date to search for (YYYY-MM-DD format)
     * @returns {Object|null} Entry object or null if not found
     */
    getEntryByDate(date) {
        const entries = this.getAllEntries();
        return entries.find(entry => entry.date === date) || null;
    }

    /**
     * Get entries for a date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {Array} Array of entries within the date range
     */
    getEntriesInDateRange(startDate, endDate) {
        const entries = this.getAllEntries();
        
        return entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= startDate && entryDate <= endDate;
        });
    }

    /**
     * Get entries sorted by date
     * @param {boolean} ascending - Sort order (true for oldest first, false for newest first)
     * @returns {Array} Sorted array of entries
     */
    getSortedEntries(ascending = false) {
        const entries = this.getAllEntries();
        
        return entries.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return ascending ? dateA - dateB : dateB - dateA;
        });
    }

    /**
     * Clear all entries (with confirmation)
     * @returns {boolean} Success status
     */
    clearAllEntries() {
        if (!this.isLocalStorageSupported) {
            return false;
        }

        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing entries:', error);
            return false;
        }
    }

    /**
     * Export data as JSON
     * @returns {string} JSON string of all data
     */
    exportData() {
        const entries = this.getAllEntries();
        const settings = this.getSettings();
        
        return JSON.stringify({
            entries,
            settings,
            exportDate: new Date().toISOString(),
            version: '1.0'
        }, null, 2);
    }

    /**
     * Import data from JSON
     * @param {string} jsonData - JSON string to import
     * @returns {boolean} Success status
     */
    importData(jsonData) {
        if (!this.isLocalStorageSupported) {
            return false;
        }

        try {
            const data = JSON.parse(jsonData);
            
            if (data.entries && Array.isArray(data.entries)) {
                // Validate all entries before importing
                const validEntries = data.entries.filter(entry => this.validateEntry(entry));
                
                if (validEntries.length > 0) {
                    localStorage.setItem(this.storageKey, JSON.stringify(validEntries));
                }
            }

            if (data.settings) {
                this.saveSettings(data.settings);
            }

            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    /**
     * Validate entry data structure
     * @param {Object} entry - Entry object to validate
     * @returns {boolean} Whether entry is valid
     */
    validateEntry(entry) {
        if (!entry || typeof entry !== 'object') {
            return false;
        }

        // Required fields
        if (!entry.date || !entry.hasOwnProperty('wrapperCount') || !entry.hasOwnProperty('earnings')) {
            return false;
        }

        // Validate date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
            return false;
        }

        // Validate numeric values
        if (typeof entry.wrapperCount !== 'number' || entry.wrapperCount < 0) {
            return false;
        }

        if (typeof entry.earnings !== 'number' || entry.earnings < 0) {
            return false;
        }

        return true;
    }

    /**
     * Get user settings
     * @returns {Object} Settings object
     */
    getSettings() {
        if (!this.isLocalStorageSupported) {
            return this.getDefaultSettings();
        }

        try {
            const data = localStorage.getItem(this.settingsKey);
            if (!data) {
                return this.getDefaultSettings();
            }
            
            return { ...this.getDefaultSettings(), ...JSON.parse(data) };
        } catch (error) {
            console.error('Error reading settings:', error);
            return this.getDefaultSettings();
        }
    }

    /**
     * Save user settings
     * @param {Object} settings - Settings object
     * @returns {boolean} Success status
     */
    saveSettings(settings) {
        if (!this.isLocalStorageSupported) {
            return false;
        }

        try {
            const currentSettings = this.getSettings();
            const updatedSettings = { ...currentSettings, ...settings };
            
            localStorage.setItem(this.settingsKey, JSON.stringify(updatedSettings));
            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    /**
     * Get default settings
     * @returns {Object} Default settings object
     */
    getDefaultSettings() {
        return {
            ratePerWrapper: 0.20,
            currency: 'PHP',
            theme: 'light',
            dateFormat: 'YYYY-MM-DD'
        };
    }

    /**
     * Get storage statistics
     * @returns {Object} Storage usage statistics
     */
    getStorageStats() {
        const entries = this.getAllEntries();
        
        return {
            totalEntries: entries.length,
            isLocalStorageSupported: this.isLocalStorageSupported,
            oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => new Date(e.date))) : null,
            newestEntry: entries.length > 0 ? Math.max(...entries.map(e => new Date(e.date))) : null,
            storageUsed: this.getStorageSize()
        };
    }

    /**
     * Calculate approximate storage size used
     * @returns {number} Storage size in bytes (approximate)
     */
    getStorageSize() {
        if (!this.isLocalStorageSupported) {
            return 0;
        }

        try {
            const entriesData = localStorage.getItem(this.storageKey) || '';
            const settingsData = localStorage.getItem(this.settingsKey) || '';
            
            return new Blob([entriesData + settingsData]).size;
        } catch (error) {
            return 0;
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageManager;
}