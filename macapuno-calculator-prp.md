# Product Requirements Prompt (PRP): Macapuno Wrapper Salary Calculator Web Application

## Overview
Create a mobile-friendly web application that allows users to track daily macapuno wrapper completion and automatically calculate their earnings based on a fixed rate structure. The application will be hosted as a static site on GitHub Pages and use browser local storage for data persistence.

## Current State
No existing application - this is a new greenfield project.

## Desired State
A fully functional web application with the following characteristics:
- Mobile-optimized interface accessible via phone browsers
- Daily wrapper count input functionality
- Automatic salary calculation based on rate: 500 wrappers = 100 pesos
- Local storage persistence for data retention
- Scalable architecture with separated concerns (HTML, CSS, JavaScript)
- GitHub Pages hosting ready

## System Architecture Context
The application will follow a client-side only architecture:
1. **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
2. **Storage**: Browser Local Storage API
3. **Hosting**: GitHub Pages static site hosting
4. **Access**: Mobile browser URL access

## Requirements

### Functional Requirements

1. **Daily Wrapper Entry**
   - Input field for daily macapuno wrapper count
   - Date selection/display for entry
   - Save entry to local storage
   - Input validation for numeric values

2. **Salary Calculation**
   - Auto-calculate earnings based on wrapper count
   - Rate structure: 500 wrappers = 100 pesos (0.20 pesos per wrapper)
   - Real-time calculation display
   - Running total calculations

3. **Data Management**
   - Persistent storage using browser Local Storage
   - Daily entry history viewing
   - Edit/delete existing entries
   - Data export functionality (optional)

4. **Mobile-First Interface**
   - Responsive design optimized for mobile phones
   - Touch-friendly input controls
   - Clear, readable typography on small screens
   - Fast loading and minimal data usage

### Technical Requirements

1. **File Structure Organization**
   ```
   mami-macapuno-app/
   ├── index.html
   ├── css/
   │   ├── main.css
   │   └── components.css
   ├── js/
   │   ├── app.js
   │   ├── storage.js
   │   └── calculator.js
   ├── assets/
   │   └── images/
   └── README.md
   ```

2. **Core Application Files**
   - **index.html**: Main application structure and layout
   - **css/main.css**: Core styling and responsive design
   - **css/components.css**: Component-specific styles
   - **js/app.js**: Main application logic and UI interactions
   - **js/storage.js**: Local storage management functions
   - **js/calculator.js**: Salary calculation logic

3. **Local Storage Schema**
   ```javascript
   // Storage structure
   {
     "macapuno-entries": [
       {
         "date": "2024-01-15",
         "wrapperCount": 750,
         "earnings": 150.00,
         "timestamp": 1705123456789
       }
     ],
     "user-settings": {
       "ratePerWrapper": 0.20,
       "currency": "PHP"
     }
   }
   ```

4. **Calculation Logic**
   - Base rate: 500 wrappers = 100 pesos
   - Per-wrapper rate: 0.20 pesos
   - Formula: `earnings = wrapperCount * 0.20`
   - Support for partial wrapper calculations

### Non-Functional Requirements

1. **Performance**
   - Fast loading on mobile networks
   - Minimal JavaScript bundle size
   - Efficient local storage operations
   - Responsive UI interactions

2. **Usability**
   - Intuitive interface requiring minimal learning
   - Clear visual feedback for user actions
   - Accessible design following basic WCAG guidelines
   - Offline functionality after initial load

3. **Compatibility**
   - Modern mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)
   - Progressive enhancement approach
   - Graceful degradation for older browsers

4. **Maintainability**
   - Clean separation of concerns
   - Modular JavaScript architecture
   - Consistent coding standards
   - Comprehensive documentation

## User Interface Requirements

### Primary Screen Layout
1. **Header Section**
   - App title: "Macapuno Calculator"
   - Current date display
   - Total earnings summary

2. **Input Section**
   - Date picker (default to today)
   - Number input for wrapper count
   - Real-time earnings display
   - Save/Update button

3. **History Section**
   - Scrollable list of previous entries
   - Date, wrapper count, and earnings per entry
   - Edit/delete actions for each entry

4. **Summary Section**
   - Weekly/monthly totals
   - Average daily production
   - Streak tracking (consecutive work days)

### Mobile Optimization Features
- Large, touch-friendly buttons (minimum 44px tap targets)
- Optimized input types (numeric keypad for wrapper count)
- Swipe gestures for navigation
- Pull-to-refresh functionality
- Minimal scrolling requirements

## Data Management Requirements

### Local Storage Operations
1. **Create Entry**
   - Validate input data
   - Calculate earnings
   - Store with timestamp
   - Update UI immediately

2. **Read Entries**
   - Retrieve all entries for display
   - Filter by date range
   - Sort by date (newest first)

3. **Update Entry**
   - Modify existing entry
   - Recalculate earnings
   - Maintain data integrity

4. **Delete Entry**
   - Remove entry from storage
   - Update totals and summaries
   - Confirmation dialog

### Data Validation
- Wrapper count: Positive integers only
- Date: Valid date format
- Duplicate prevention: One entry per date
- Data integrity checks on load

## Success Criteria

1. **Core Functionality**
   - Users can input daily wrapper counts successfully
   - Salary calculations are accurate and immediate
   - Data persists between browser sessions
   - All CRUD operations work reliably

2. **User Experience**
   - App loads in under 3 seconds on 3G connection
   - Interface is intuitive without instructions
   - No data loss during normal usage
   - Responsive design works on common mobile devices

3. **Technical Quality**
   - Clean, maintainable code structure
   - No JavaScript errors in browser console
   - Proper error handling and user feedback
   - GitHub Pages deployment successful

## Implementation Examples

### Calculation Examples
```javascript
// Examples of expected calculations
750 wrappers = 750 × 0.20 = 150.00 pesos
1000 wrappers = 1000 × 0.20 = 200.00 pesos
250 wrappers = 250 × 0.20 = 50.00 pesos
```

### Sample UI Flow
1. User opens app on phone
2. Sees today's date pre-selected
3. Enters wrapper count (e.g., "750")
4. Sees immediate calculation: "₱150.00"
5. Taps "Save Entry"
6. Entry appears in history list
7. Summary totals update automatically

### Local Storage Example
```javascript
// Sample data structure
localStorage.setItem('macapuno-entries', JSON.stringify([
  {
    date: '2024-01-15',
    wrapperCount: 750,
    earnings: 150.00,
    timestamp: 1705123456789
  },
  {
    date: '2024-01-16',
    wrapperCount: 600,
    earnings: 120.00,
    timestamp: 1705209856789
  }
]));
```

## Hosting and Deployment Requirements

### GitHub Pages Setup
1. **Repository Structure**
   - Public repository named `mami-macapuno-app`
   - All files in root directory for simple hosting
   - README.md with setup and usage instructions

2. **Deployment Process**
   - Push to main branch triggers automatic deployment
   - Custom domain support (optional)
   - HTTPS enabled by default

3. **URL Structure**
   - Primary URL: `https://username.github.io/mami-macapuno-app`
   - Mobile bookmark friendly
   - Easy to share via messaging apps

## Future Enhancement Considerations

### Phase 2 Features (Out of Scope for MVP)
- Data export to CSV/Excel
- Backup/restore functionality
- Multiple rate structures
- Goal setting and progress tracking
- Dark/light theme toggle
- PWA (Progressive Web App) features

### Scalability Considerations
- Modular architecture allows for easy feature additions
- Local storage can be replaced with cloud storage later
- Component-based CSS allows for theme extensions
- API integration points for future backend services

## Technical Implementation Notes

### Browser Compatibility Strategy
- Use vanilla JavaScript (no framework dependencies)
- Feature detection for Local Storage support
- Fallback messaging for unsupported browsers
- Progressive enhancement approach

### Performance Optimization
- Minimize HTTP requests
- Compress/minify assets for production
- Use efficient DOM manipulation techniques
- Implement debouncing for real-time calculations

### Security Considerations
- Client-side only (no server-side vulnerabilities)
- Input sanitization and validation
- No sensitive data storage
- Safe HTML rendering practices

## Acceptance Criteria

### Minimum Viable Product (MVP)
- [ ] User can input daily wrapper count
- [ ] Earnings calculate correctly (500 wrappers = 100 pesos)
- [ ] Data saves to local storage
- [ ] Previous entries display in history
- [ ] Mobile responsive design works
- [ ] App deploys successfully on GitHub Pages

### Definition of Done
- [ ] All functional requirements implemented
- [ ] Code reviewed and tested on mobile devices
- [ ] Documentation complete (README + code comments)
- [ ] No browser console errors
- [ ] Performance acceptable on 3G networks
- [ ] GitHub Pages deployment verified working