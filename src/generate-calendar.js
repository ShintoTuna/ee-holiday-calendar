import fetch from 'node-fetch';
import { writeFileSync, mkdirSync } from 'fs';
import { createEvents } from 'ics';

const API_URL = 'https://xn--riigiphad-v9a.ee/?output=json';
const OUTPUT_DIR = 'docs';
const OUTPUT_FILE = `${OUTPUT_DIR}/estonian-holidays.ics`;

async function fetchHolidays() {
  console.log('Fetching Estonian holidays...');
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch holidays: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`Fetched ${data.length} total entries`);
  return data;
}

function filterRelevantHolidays(holidays) {
  // Filter out kind_id "3" (Riiklik tähtpäev - National memorable days)
  // Keep kind_id "1" (Riigipüha - National holiday)
  //      kind_id "2" (Rahvuspüha - National celebration)
  //      kind_id "4" (Lühendatud tööpäev - Shortened work day)
  return holidays.filter(holiday => holiday.kind_id !== '3');
}

function parseDate(dateString) {
  // Parse YYYY-MM-DD format
  const [year, month, day] = dateString.split('-').map(Number);
  return { year, month, day };
}

function createCalendarEvents(holidays) {
  const events = holidays.map(holiday => {
    const date = parseDate(holiday.date);

    // Determine if it's a day off or shortened work day
    const isHoliday = holiday.kind_id === '1' || holiday.kind_id === '2';
    const isShortenedDay = holiday.kind_id === '4';

    // Build description
    let description = `${holiday.kind}`;
    if (holiday.notes) {
      description += `\n${holiday.notes}`;
    }
    if (isShortenedDay) {
      description += '\n⏰ Shortened work day (workday ends earlier)';
    }

    // Create event object
    const event = {
      start: [date.year, date.month, date.day],
      title: isHoliday ? `🎉 ${holiday.title}` : `⏰ ${holiday.title}`,
      description: description,
      status: 'CONFIRMED',
      busyStatus: isHoliday ? 'FREE' : 'BUSY',
      transp: isHoliday ? 'TRANSPARENT' : 'OPAQUE',
      // All-day event (no time specified)
      duration: { days: 1 }
    };

    return event;
  });

  return events;
}

async function generateCalendar() {
  try {
    // Fetch holidays
    const allHolidays = await fetchHolidays();

    // Filter relevant holidays
    const relevantHolidays = filterRelevantHolidays(allHolidays);
    console.log(`Filtered to ${relevantHolidays.length} relevant entries (excluding type 3)`);

    // Create calendar events
    const events = createCalendarEvents(relevantHolidays);

    // Generate ICS file
    const { error, value } = createEvents(events);

    if (error) {
      throw new Error(`Failed to create calendar: ${error}`);
    }

    // Ensure output directory exists
    mkdirSync(OUTPUT_DIR, { recursive: true });

    // Add custom calendar properties
    const calendarContent = value.replace(
      'BEGIN:VCALENDAR',
      `BEGIN:VCALENDAR\nNAME:Estonian Holidays\nX-WR-CALNAME:Estonian Holidays\nX-WR-CALDESC:Estonian public holidays and shortened work days\nX-WR-TIMEZONE:Europe/Tallinn`
    );

    // Write to file
    writeFileSync(OUTPUT_FILE, calendarContent);

    console.log(`✅ Calendar generated successfully: ${OUTPUT_FILE}`);
    console.log(`📅 Total events: ${events.length}`);

    // Count by type
    const dayOffs = relevantHolidays.filter(h => h.kind_id === '1' || h.kind_id === '2').length;
    const shortenedDays = relevantHolidays.filter(h => h.kind_id === '4').length;

    console.log(`   - Public holidays (day offs): ${dayOffs}`);
    console.log(`   - Shortened work days: ${shortenedDays}`);

  } catch (error) {
    console.error('❌ Error generating calendar:', error);
    process.exit(1);
  }
}

// Run the generator
generateCalendar();
