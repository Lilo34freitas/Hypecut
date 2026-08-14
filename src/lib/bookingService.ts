import { supabase, isSupabaseConfigured } from './supabase';

export interface TimeSlot {
  time: string; // "14:00"
  available: boolean;
  startTime: string; // ISO String
  endTime: string; // ISO String
}

/**
 * Gets business working hours for a given Day of Week (0 = Sun, 1 = Mon, ..., 6 = Sat)
 */
export function getBusinessHours(dayOfWeek: number): { openHour: number; openMin: number; closeHour: number; closeMin: number } | null {
  switch (dayOfWeek) {
    case 1: // Monday: 14:00 - 20:00
      return { openHour: 14, openMin: 0, closeHour: 20, closeMin: 0 };
    case 2: // Tuesday
    case 3: // Wednesday
    case 4: // Thursday
    case 5: // Friday: 09:00 - 21:00
      return { openHour: 9, openMin: 0, closeHour: 21, closeMin: 0 };
    case 6: // Saturday: 08:00 - 17:00
      return { openHour: 8, openMin: 0, closeHour: 17, closeMin: 0 };
    default: // Sunday: Closed
      return null;
  }
}

/**
 * Core Availability Engine: Computes available time slots for a given date and professional
 */
export async function getAvailabilityForDate(
  dateStr: string, // "YYYY-MM-DD"
  professionalId: string,
  serviceDurationMin: number = 30
): Promise<TimeSlot[]> {
  const targetDate = new Date(`${dateStr}T00:00:00`);
  if (isNaN(targetDate.getTime())) {
    throw new Error('Data inválida.');
  }

  const dayOfWeek = targetDate.getDay();
  const businessHours = getBusinessHours(dayOfWeek);

  if (!businessHours) {
    return []; // Closed on Sundays
  }

  // Define start and end of day in Date objects
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(businessHours.openHour, businessHours.openMin, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(businessHours.closeHour, businessHours.closeMin, 0, 0);

  // Fetch existing appointments for professional on target date (CONFIRMED or PENDING)
  let dbAppts: Array<{ startTime: Date; endTime: Date }> = [];
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('appointments')
        .select('start_time, end_time')
        .in('status', ['CONFIRMED', 'PENDING'])
        .gte('start_time', startOfDay.toISOString())
        .lt('start_time', endOfDay.toISOString());

      if (professionalId && professionalId !== 'any') {
        query = query.eq('professional_id', professionalId);
      }

      const { data, error } = await query;
      if (!error && data) {
        dbAppts = data.map((item: any) => ({
          startTime: new Date(item.start_time),
          endTime: new Date(item.end_time),
        }));
      }
    } catch (err) {
      console.warn('Fallback: Supabase fetch error, fallback to local storage.', err);
    }
  }

  // Merge local storage appointments
  let localAppts: Array<{ startTime: Date; endTime: Date }> = [];
  try {
    const raw = localStorage.getItem('hypecut_appointments');
    if (raw) {
      const parsed = JSON.parse(raw);
      localAppts = parsed
        .filter((a: any) => {
          if (a.status !== 'CONFIRMED' && a.status !== 'PENDING') return false;
          if (professionalId !== 'any' && a.professionalId !== professionalId) return false;
          const apptTime = new Date(a.startTime).getTime();
          return apptTime >= startOfDay.getTime() && apptTime < endOfDay.getTime();
        })
        .map((a: any) => ({
          startTime: new Date(a.startTime),
          endTime: new Date(a.endTime),
        }));
    }
  } catch (e) {
    console.warn(e);
  }

  const existingAppointments = [...dbAppts, ...localAppts];

  // Generate 30-min candidate slots
  const slots: TimeSlot[] = [];
  const currentSlot = new Date(startOfDay);

  while (currentSlot.getTime() + serviceDurationMin * 60 * 1000 <= endOfDay.getTime()) {
    const slotStart = new Date(currentSlot);
    const slotEnd = new Date(currentSlot.getTime() + serviceDurationMin * 60 * 1000);

    const timeLabel = slotStart.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    // Check collision with existing appointments
    const hasCollision = existingAppointments.some((appt) => {
      const apptStart = new Date(appt.startTime).getTime();
      const apptEnd = new Date(appt.endTime).getTime();
      return !(apptEnd <= slotStart.getTime() || apptStart >= slotEnd.getTime());
    });

    slots.push({
      time: timeLabel,
      available: !hasCollision,
      startTime: slotStart.toISOString(),
      endTime: slotEnd.toISOString(),
    });

    // Increment candidate slot by 30 mins
    currentSlot.setMinutes(currentSlot.getMinutes() + 30);
  }

  return slots;
}
