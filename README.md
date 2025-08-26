# Macapuno Wrapper Salary Calculator

A mobile-friendly web application for tracking daily macapuno wrapper completion and calculating earnings. Perfect for piecework salary tracking with automatic calculations.

## Features

- **Daily Tracking**: Input daily wrapper counts with date selection
- **Automatic Calculations**: Real-time salary calculation (500 wrappers = ₱100.00)
- **Persistent Storage**: Data saved in browser local storage
- **Summary Statistics**: Weekly, monthly totals and work streaks
- **History Management**: View, edit, and delete previous entries
- **Mobile Optimized**: Touch-friendly interface for phone usage
- **Offline Ready**: Works without internet after initial load

## Live Demo

[Visit the live application](https://your-username.github.io/mami-macapuno-app)

## Getting Started

### Online Usage (Recommended)

1. Visit the live application URL on your mobile phone
2. Bookmark it for easy access
3. Start entering your daily wrapper counts
4. View your earnings and statistics

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/mami-macapuno-app.git
   cd mami-macapuno-app
   ```

2. Open `index.html` in your web browser or serve with a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

## How to Use

### Adding Daily Entries

1. **Select Date**: Choose the date for your entry (defaults to today)
2. **Enter Count**: Input the number of wrappers you completed
3. **View Earnings**: See your calculated earnings in real-time
4. **Save Entry**: Click "Save Entry" to store your data

### Viewing Statistics

The app automatically calculates and displays:

- **Total Earnings**: All-time earnings sum
- **This Week**: Last 7 days earnings
- **This Month**: Last 30 days earnings  
- **Daily Average**: Average wrappers per day
- **Work Streak**: Consecutive working days

### Managing History

- **View Past Entries**: Scroll through your recent entries
- **Edit Entry**: Click "Edit" to modify any previous entry
- **Delete Entry**: Click "Delete" to remove an entry (with confirmation)

## Salary Calculation

The app uses a fixed rate structure:
- **Base Rate**: 500 wrappers = ₱100.00
- **Per Wrapper**: ₱0.20
- **Formula**: `Earnings = Wrapper Count × ₱0.20`

### Examples:
- 750 wrappers = ₱150.00
- 1,000 wrappers = ₱200.00
- 250 wrappers = ₱50.00

## Technical Details

### Architecture

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Browser Local Storage API
- **Hosting**: GitHub Pages (static hosting)
- **Mobile**: Progressive Web App principles

### File Structure

```
mami-macapuno-app/
├── index.html              # Main application page
├── css/
│   ├── main.css           # Core styles and responsive design
│   └── components.css     # Component-specific styles
├── js/
│   ├── app.js            # Main application logic
│   ├── storage.js        # Local storage management
│   └── calculator.js     # Salary calculation logic
└── README.md             # This file
```

### Browser Compatibility

- **Mobile**: iOS Safari 12+, Chrome Mobile 70+, Samsung Internet 10+
- **Desktop**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **Requirements**: Local Storage support, ES6 features

## Data Management

### Storage

All data is stored locally in your browser using Local Storage:

- **Entries**: Daily wrapper counts and earnings
- **Settings**: User preferences and app configuration
- **Privacy**: No data is sent to external servers

### Data Structure

```javascript
{
  "macapuno-entries": [
    {
      "date": "2024-01-15",
      "wrapperCount": 750,
      "earnings": 150.00,
      "timestamp": 1705123456789
    }
  ]
}
```

### Export/Import

- Data can be exported as JSON for backup
- Import functionality for restoring data
- Manual backup recommended for important data

## Deployment

### GitHub Pages Setup

1. **Create Repository**: Fork or create a new repository
2. **Enable Pages**: Go to Settings → Pages → Source: Deploy from branch
3. **Select Branch**: Choose `main` branch and `/` root folder
4. **Access URL**: Your app will be available at `https://username.github.io/repo-name`

### Custom Domain (Optional)

1. Add `CNAME` file with your domain
2. Configure DNS settings
3. Enable HTTPS in repository settings

## Development

### Local Development

```bash
# Clone the repository
git clone https://github.com/your-username/mami-macapuno-app.git

# Navigate to directory
cd mami-macapuno-app

# Serve locally (choose one method)
python -m http.server 8000
# or
npx http-server
# or
php -S localhost:8000
```

### Project Structure

- **HTML**: Semantic structure with accessibility in mind
- **CSS**: Mobile-first responsive design with CSS Grid/Flexbox
- **JavaScript**: ES6+ vanilla JavaScript, modular architecture
- **No Build Process**: Direct file serving for simplicity

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly on mobile devices
5. Submit a pull request

## Troubleshooting

### Data Not Saving

- **Check Browser**: Ensure Local Storage is enabled
- **Private Mode**: Data won't persist in incognito/private browsing
- **Storage Full**: Clear other site data if storage is full

### Mobile Issues

- **Add to Home Screen**: Use browser's "Add to Home Screen" feature
- **Zoom Issues**: Ensure viewport meta tag is present
- **Touch Targets**: All buttons meet 44px minimum size requirement

### Performance Issues

- **Clear Cache**: Refresh the page or clear browser cache
- **Network**: App works offline after first load
- **Old Browsers**: Upgrade to a modern browser for best experience

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For issues, questions, or feature requests:

1. Check existing [GitHub Issues](https://github.com/your-username/mami-macapuno-app/issues)
2. Create a new issue with detailed information
3. Include browser version and device information for bugs

## Changelog

### Version 1.0.0
- Initial release
- Basic wrapper tracking and calculation
- Local storage persistence
- Mobile-responsive design
- History management with edit/delete
- Summary statistics and work streaks

---

**Built with ❤️ for macapuno wrapper workers**