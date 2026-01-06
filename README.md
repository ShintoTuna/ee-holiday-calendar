# Estonian Holidays Calendar 🇪🇪

Automatically generated ICS calendar file containing Estonian public holidays and shortened work days. Calculated locally using government-defined rules - no external dependencies! Perfect for adding to your personal calendar app.

## 📅 What's Included

This calendar includes:

- **🎉 Public Holidays** (Riigipüha & Rahvuspüha) - Official days off
- **⏰ Shortened Work Days** (Lühendatud tööpäev) - Days when the workday ends earlier

The calendar explicitly **excludes** National Memorable Days (Riiklik tähtpäev) to keep your calendar focused on days that affect your work schedule.

## 🔗 Subscribe to the Calendar

### Option 1: Direct Download
Download the `.ics` file and import it into your calendar app:
- Visit the [GitHub Pages site](https://[your-username].github.io/ee-holiday-calendar/)
- Click the download button

### Option 2: Subscribe (Recommended)
Add the calendar URL to your calendar app for automatic updates:

```
https://[your-username].github.io/ee-holiday-calendar/estonian-holidays.ics
```

#### Adding to Different Calendar Apps:

**Apple Calendar (macOS/iOS):**
1. Open Calendar app
2. File → New Calendar Subscription
3. Paste the URL above
4. Click Subscribe

**Google Calendar:**
1. Go to [Google Calendar](https://calendar.google.com)
2. Click the "+" next to "Other calendars"
3. Select "From URL"
4. Paste the URL above
5. Click "Add calendar"

**Outlook:**
1. Go to Calendar view
2. Click "Add calendar"
3. Select "Subscribe from web"
4. Paste the URL above
5. Click Import

**Thunderbird:**
1. Right-click on the calendar list
2. Select "New Calendar"
3. Choose "On the Network"
4. Select iCalendar (ICS)
5. Paste the URL above

## 🛠️ Development

### Prerequisites
- Node.js 20 or higher
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/ee-holiday-calendar.git
cd ee-holiday-calendar

# Install dependencies
npm install
```

### Usage

```bash
# Generate the calendar
npm run generate
```

This will:
1. Calculate Estonian holidays using local algorithms based on government rules
2. Generate holidays for current year ±6 years (7 years total)
3. Include public holidays and shortened work days (excludes National Memorable Days)
4. Create an ICS file at `docs/estonian-holidays.ics`

### Project Structure

```
.
├── .github/
│   └── workflows/
│       └── generate-calendar.yml    # GitHub Actions workflow
├── docs/
│   ├── index.html                    # GitHub Pages landing page
│   └── estonian-holidays.ics        # Generated calendar file
├── src/
│   └── generate-calendar.js         # Calendar generation script
├── package.json
└── README.md
```

## 🤖 Automation

The calendar is automatically updated every week using GitHub Actions:

- **Schedule**: Runs every Monday at 6:00 AM UTC
- **Manual Trigger**: Can be triggered manually from the Actions tab
- **Auto-commit**: Automatically commits and pushes changes if the calendar is updated

## 🧮 How It Works

This calendar uses **local calculation algorithms** based on Estonian government holiday rules - no external API calls required!

### Fixed Holidays
- **New Year's Day** - January 1
- **Independence Day** - February 24
- **Spring Day** - May 1
- **Victory Day** - June 23
- **St. John's Day** - June 24
- **Restoration of Independence Day** - August 20
- **Christmas Eve** - December 24
- **Christmas Day** - December 25
- **Boxing Day** - December 26

### Movable Holidays (Based on Easter)
Easter is calculated using the **Anonymous Gregorian Computus algorithm**:
- **Good Friday** - 2 days before Easter
- **Easter Sunday** - Calculated using Computus
- **Pentecost** - 49 days after Easter

### Shortened Work Days
- **February 23** - Day before Independence Day
- **June 22** - Day before Victory Day
- **December 23** - Day before Christmas Eve
- **December 31** - New Year's Eve

## 📝 Holiday Types

This calendar includes official Estonian holiday types:

| Type | Estonian | English | Included |
|------|----------|---------|----------|
| 1 | Riigipüha | National Holiday | ✅ Yes |
| 2 | Rahvuspüha | National Celebration | ✅ Yes |
| 3 | Riiklik tähtpäev | National Memorable Day | ❌ No |
| 4 | Lühendatud tööpäev | Shortened Work Day | ✅ Yes |

## 🚀 GitHub Pages Setup

To enable GitHub Pages for your fork:

1. Go to repository Settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select "Deploy from a branch"
4. Select branch: `main` (or `master`)
5. Select folder: `/docs`
6. Click Save

Your calendar will be available at: `https://[your-username].github.io/ee-holiday-calendar/`

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- Holiday rules based on official Estonian government legislation
- Easter calculation using the Anonymous Gregorian Computus algorithm
- Built with [ics](https://www.npmjs.com/package/ics) library
- Reference data validation from [riigipühad.ee](https://xn--riigiphad-v9a.ee/)
