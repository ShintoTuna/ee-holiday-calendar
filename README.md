# Estonian Holidays Calendar

ICS calendar of Estonian public holidays and shortened work days, auto-updated weekly and hosted on GitHub Pages.

**Calendar URL:**
```
https://shintotuna.github.io/ee-holiday-calendar/estonian-holidays.ics
```

## What's included

- **Public holidays** (Riigipüha & Rahvuspüha) - official days off
- **Shortened work days** (Lühendatud tööpäev) - days when the workday ends 3 hours earlier

National Memorable Days (Riiklik tähtpäev) are intentionally excluded, as they don't affect your work schedule.

## How to subscribe

### Google Calendar
1. Open [Google Calendar](https://calendar.google.com)
2. Click "+" next to "Other calendars" → "From URL"
3. Paste the calendar URL above

### Apple Calendar (macOS/iOS)
1. File → New Calendar Subscription
2. Paste the calendar URL above

### Outlook
1. Calendar → Add calendar → Subscribe from web
2. Paste the calendar URL above

## How it works

Holidays are calculated locally from Estonian government legislation — no external API calls. Easter-based movable holidays use the Anonymous Gregorian Computus algorithm. The calendar covers the current year ±6 years and is regenerated every Monday via GitHub Actions.
