/**
 * Module Integration Test
 * Verify all modules load and initialize correctly
 */

// Test function to verify modular architecture
function testModularArchitecture() {
    console.log('🧪 Testing Macapuno Modular Architecture...');
    
    // Wait for app to initialize
    setTimeout(() => {
        const app = window.macapunoApp;
        
        if (!app) {
            console.error('❌ App not initialized');
            return;
        }
        
        const stats = app.getStats();
        console.log('📊 App Statistics:', stats);
        
        // Test each module
        const tests = [
            { name: 'Calculator', test: () => app.calculator && app.calculator.calculateEarnings(100) === 20 },
            { name: 'Storage', test: () => app.storage && typeof app.storage.getAllEntries === 'function' },
            { name: 'FormManager', test: () => app.formManager && typeof app.formManager.updateCurrentEarnings === 'function' },
            { name: 'ModalManager', test: () => app.modalManager && typeof app.modalManager.openEditModal === 'function' },
            { name: 'DisplayManager', test: () => app.displayManager && typeof app.displayManager.showNotification === 'function' },
            { name: 'EntryManager', test: () => app.entryManager && typeof app.entryManager.saveEntry === 'function' },
            { name: 'NavigationManager', test: () => app.navigationManager && typeof app.navigationManager.navigateMonth === 'function' },
            { name: 'CelebrationManager', test: () => app.celebrationManager && typeof app.celebrationManager.triggerCelebration === 'function' },
            { name: 'EventManager', test: () => app.eventManager && typeof app.eventManager.setupAllEventListeners === 'function' }
        ];
        
        let passedTests = 0;
        tests.forEach(({ name, test }) => {
            try {
                if (test()) {
                    console.log(`✅ ${name}: PASS`);
                    passedTests++;
                } else {
                    console.log(`❌ ${name}: FAIL`);
                }
            } catch (error) {
                console.log(`❌ ${name}: ERROR -`, error.message);
            }
        });
        
        const success = passedTests === tests.length;
        console.log(`\n🎯 Test Results: ${passedTests}/${tests.length} modules passed`);
        
        if (success) {
            console.log('🎉 All modules loaded successfully!');
            console.log('🚀 Modular architecture is working correctly');
        } else {
            console.log('⚠️  Some modules failed to load properly');
        }
        
        return success;
    }, 1000);
}

// Auto-run test when loaded
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        testModularArchitecture();
    });
}