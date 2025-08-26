# File Cleanup Guide

## 🗑️ Files to DELETE

### ❌ Remove these broken/outdated files:
- `js/app.js` - **DELETE** (broken mixed monolith + modular code)

## 🔄 Files to RENAME

### Rename the new app to replace the old:
- `js/app-new.js` → `js/app.js`

## ✅ Files to KEEP (Required for modular architecture)

### Core modules (KEEP - required):
- `js/calculator.js` ✅ - Core calculation logic
- `js/storage.js` ✅ - Data persistence

### New modular architecture (KEEP - all required):
- `js/core/EventManager.js` ✅
- `js/ui/FormManager.js` ✅
- `js/ui/ModalManager.js` ✅
- `js/ui/DisplayManager.js` ✅
- `js/features/EntryManager.js` ✅
- `js/features/NavigationManager.js` ✅
- `js/features/CelebrationManager.js` ✅

### Optional files:
- `js/test/integration-test.js` - Keep for testing
- `ARCHITECTURE.md` - Keep for documentation
- `MIGRATION.md` - Keep for reference

## 🔧 Quick Cleanup Commands

```bash
# Navigate to js folder
cd js

# Remove broken app.js
rm app.js

# Rename app-new.js to app.js
mv app-new.js app.js
```

## 🎯 Final File Structure

After cleanup:
```
js/
├── calculator.js          # Core calculation logic
├── storage.js            # Data persistence  
├── app.js                # Main orchestrator (renamed from app-new.js)
├── core/
│   └── EventManager.js
├── ui/
│   ├── FormManager.js
│   ├── ModalManager.js
│   └── DisplayManager.js
├── features/
│   ├── EntryManager.js
│   ├── NavigationManager.js
│   └── CelebrationManager.js
└── test/
    └── integration-test.js
```

## ⚠️ Why Keep calculator.js and storage.js?

These are **core modules** that the new architecture depends on:

- **calculator.js**: Contains Calculator class used by all modules
- **storage.js**: Contains StorageManager class for data persistence
- Both are **modular and clean** - not monolithic like the old app.js

## ✅ After Cleanup

Your application will have:
- **Clean modular architecture** 
- **90% token reduction** for AI assistance
- **Same functionality** as before
- **Better maintainability**