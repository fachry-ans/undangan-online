import { WeddingData } from '../types/wedding';

export function formatWeddingDate(wedding: Pick<WeddingData, 'weddingDate' | 'timezone'>): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: wedding.timezone,
  }).format(new Date(wedding.weddingDate));
}

export function getWeddingCalendarUrl(wedding: WeddingData): string {
  const firstEvent = wedding.events[0];
  const lastEvent = wedding.events[wedding.events.length - 1];
  const startTime = firstEvent?.startTime.match(/\d{1,2}:\d{2}/)?.[0];
  const endTime = lastEvent?.endTime.match(/\d{1,2}:\d{2}/)?.[0];
  const start = new Date(wedding.weddingDate);
  let end = new Date(start);

  if (startTime && endTime) {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    let durationMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute);
    if (durationMinutes < 0) durationMinutes += 24 * 60;
    end = new Date(start.getTime() + durationMinutes * 60_000);
  }

  const calendarDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const details = wedding.events
    .map((event) => `${event.title}: ${event.date}, ${event.startTime} - ${event.endTime} at ${event.venue}, ${event.address}`)
    .join('\n');
  const location = firstEvent ? `${firstEvent.venue}, ${firstEvent.address}` : '';

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(wedding.title)}&dates=${calendarDate(start)}/${calendarDate(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
}