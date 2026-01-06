import { writeFileSync, mkdirSync } from 'fs';
import { createEvents } from 'ics';

const OUTPUT_DIR = 'docs';
const OUTPUT_FILE = `${OUTPUT_DIR}/estonian-holidays.ics`;

/**
 * Calculate Easter Sunday using the Anonymous Gregorian algorithm (Computus)
 * Returns the date of Easter Sunday for a given year
 */
function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

/**
 * Add days to a date
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Format date for ICS (year, month, day)
 */
function formatDate(date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  };
}

/**
 * Generate all Estonian holidays for a given year based on government rules
 */
function generateHolidaysForYear(year) {
  const holidays = [];
  const easter = calculateEaster(year);

  // Fixed National Holidays (Riigipüha - kind_id: 1)
  const fixedHolidays = [
    { month: 1, day: 1, title: 'Uusaasta', kind: 'Riigipüha', notes: 'puhkepäev' },
    { month: 5, day: 1, title: 'Kevadpüha', kind: 'Riigipüha', notes: 'puhkepäev' },
    { month: 6, day: 23, title: 'Võidupüha', kind: 'Riigipüha', notes: 'puhkepäev' },
    { month: 6, day: 24, title: 'Jaanipäev', kind: 'Riigipüha', notes: 'puhkepäev' },
    { month: 8, day: 20, title: 'Taasiseseisvumispäev', kind: 'Riigipüha', notes: 'puhkepäev' },
    { month: 12, day: 24, title: 'Jõululaupäev', kind: 'Riigipüha', notes: 'puhkepäev' },
    { month: 12, day: 25, title: 'Esimene jõulupüha', kind: 'Riigipüha', notes: 'puhkepäev' },
    { month: 12, day: 26, title: 'Teine jõulupüha', kind: 'Riigipüha', notes: 'puhkepäev' }
  ];

  fixedHolidays.forEach(holiday => {
    holidays.push({
      date: new Date(year, holiday.month - 1, holiday.day),
      title: holiday.title,
      kind: holiday.kind,
      kind_id: '1',
      notes: holiday.notes
    });
  });

  // National Celebration (Rahvuspüha - kind_id: 2)
  holidays.push({
    date: new Date(year, 1, 24), // February 24
    title: 'Iseseisvuspäev, Eesti Vabariigi aastapäev',
    kind: 'Rahvuspüha',
    kind_id: '2',
    notes: 'puhkepäev'
  });

  // Movable holidays based on Easter
  // Good Friday (2 days before Easter)
  holidays.push({
    date: addDays(easter, -2),
    title: 'Suur reede',
    kind: 'Riigipüha',
    kind_id: '1',
    notes: 'puhkepäev'
  });

  // Easter Sunday
  holidays.push({
    date: easter,
    title: 'Ülestõusmispühade 1. püha',
    kind: 'Riigipüha',
    kind_id: '1',
    notes: 'puhkepäev'
  });

  // Pentecost/Whit Sunday (49 days after Easter)
  holidays.push({
    date: addDays(easter, 49),
    title: 'Nelipühade 1. püha',
    kind: 'Riigipüha',
    kind_id: '1',
    notes: 'puhkepäev'
  });

  // Shortened work days (Lühendatud tööpäev - kind_id: 4)
  const shortenedDays = [
    { month: 2, day: 23, title: 'Eesti Vabariigi aastapäevale eelnev päev' },
    { month: 6, day: 22, title: 'võidupühale eelnev päev' },
    { month: 12, day: 23, title: 'jõululaupäevale eelnev päev' },
    { month: 12, day: 31, title: 'uuele aastale eelnev päev' }
  ];

  shortenedDays.forEach(day => {
    holidays.push({
      date: new Date(year, day.month - 1, day.day),
      title: day.title,
      kind: 'Lühendatud tööpäev',
      kind_id: '4',
      notes: null
    });
  });

  return holidays;
}

/**
 * Generate holidays for multiple years
 */
function generateHolidays() {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 1;
  const endYear = currentYear + 5;

  const allHolidays = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearHolidays = generateHolidaysForYear(year);
    allHolidays.push(...yearHolidays);
  }

  // Sort by date
  allHolidays.sort((a, b) => a.date - b.date);

  return allHolidays;
}

/**
 * Create calendar events from holidays
 */
function createCalendarEvents(holidays) {
  const events = holidays.map(holiday => {
    const date = formatDate(holiday.date);

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

/**
 * Main function to generate the calendar
 */
function generateCalendar() {
  try {
    console.log('Calculating Estonian holidays...');

    // Generate holidays using local algorithm
    const holidays = generateHolidays();
    console.log(`Generated ${holidays.length} total entries`);

    // Create calendar events
    const events = createCalendarEvents(holidays);

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
      `BEGIN:VCALENDAR\nNAME:Estonian Holidays\nX-WR-CALNAME:Estonian Holidays\nX-WR-CALDESC:Estonian public holidays and shortened work days (calculated locally)\nX-WR-TIMEZONE:Europe/Tallinn`
    );

    // Write to file
    writeFileSync(OUTPUT_FILE, calendarContent);

    console.log(`✅ Calendar generated successfully: ${OUTPUT_FILE}`);
    console.log(`📅 Total events: ${events.length}`);

    // Count by type
    const dayOffs = holidays.filter(h => h.kind_id === '1' || h.kind_id === '2').length;
    const shortenedDays = holidays.filter(h => h.kind_id === '4').length;

    console.log(`   - Public holidays (day offs): ${dayOffs}`);
    console.log(`   - Shortened work days: ${shortenedDays}`);

    // Show year range
    const years = [...new Set(holidays.map(h => h.date.getFullYear()))];
    console.log(`   - Year range: ${Math.min(...years)} - ${Math.max(...years)}`);

  } catch (error) {
    console.error('❌ Error generating calendar:', error);
    process.exit(1);
  }
}

// Run the generator
generateCalendar();
