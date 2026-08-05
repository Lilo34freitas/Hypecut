import { prisma } from './prisma';
import { getAvailabilityForDate } from './bookingService';

export const defaultProfessionals = [
  { id: 'pro-1', name: 'JONATHAN NEMECEK', role: 'Barbeiro & Fundador', specialties: 'Cortes na Tesoura • Visagismo • Barboterapia', avatarUrl: '/jonathan.png' },
  { id: 'pro-2', name: 'BRUNO', role: 'Artista & Tatuador', specialties: 'Lettering • Dark Art • Freehand', avatarUrl: '/bruno.png' },
  { id: 'pro-3', name: 'BOSCO', role: 'Barbeiro', specialties: 'Cabelo Afro • Barba • Corte Americano', avatarUrl: '/bosco.png' },
  { id: 'pro-4', name: 'LUKINHA', role: 'Barbeiro', specialties: 'Moicano • Americano • Freestyle', avatarUrl: '/Lukinha.png' },
  { id: 'pro-5', name: 'MATHEUS', role: 'Tatuador', specialties: 'Realismo • Preto e Cinza • Fine Line', avatarUrl: '/matheus.png' },
  { id: 'pro-6', name: 'PORKS', role: 'Barbeiro & Estilo', specialties: 'Cortes Modernos • Degradê • Pigmentação', avatarUrl: '/porks.png' },
];

export const defaultServices = [
  { id: 'srv-1', name: 'Corte de Cabelo Masculino Stylist', category: 'barbearia', durationMin: 30, price: 60.0, description: 'Visagismo sob medida, corte com tesoura/máquina e finalização premium.' },
  { id: 'srv-2', name: 'Barboterapia com Toalha Quente', category: 'barbearia', durationMin: 30, price: 50.0, description: 'Esfoliação, óleo essencial, toalha quente e alinhamento na navalha.' },
  { id: 'srv-3', name: 'Combo VIP Complete', category: 'combos', durationMin: 60, price: 150.0, description: 'Corte + Barboterapia + Sobrancelha + Esfoliação facial.' },
  { id: 'srv-4', name: 'Cabelo + Barba + Sobrancelha', category: 'combos', durationMin: 60, price: 110.0, description: 'O combo mais pedido: alinhamento completo do visual.' },
  { id: 'srv-5', name: 'Cabelo + Barba', category: 'combos', durationMin: 45, price: 95.0, description: 'Corte masculino + modelagem e desenho de barba.' },
  { id: 'srv-6', name: 'Sessão de Tattoo Autoral / Consultoria', category: 'tattoo', durationMin: 60, price: 200.0, description: 'Consultoria e criação de projeto autoral sob medida.' },
  { id: 'srv-7', name: 'Limpeza de Pele & Cuidado Facial', category: 'estetica', durationMin: 30, price: 70.0, description: 'Remoção de cravos, esfoliação e hidratação profunda.' },
];

export function toLocalDateStr(dateInput: Date | string | number): string {
  if (!dateInput) return '';
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLocalAppointments(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('hypecut_appointments');
    if (!raw) {
      const initial = [
        {
          id: 'appt-demo-1',
          clientName: 'Murilo Freitas',
          clientPhone: '47988623836',
          clientNotes: 'Corte VIP com barboterapia',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          status: 'CONFIRMED',
          serviceId: 'srv-3',
          professionalId: 'pro-1',
          service: defaultServices[2],
          professional: defaultProfessionals[0],
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('hypecut_appointments', JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalAppointments(appts: any[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('hypecut_appointments', JSON.stringify(appts));
  } catch (err) {
    console.error('Error saving local appointments:', err);
  }
}

export async function fetchServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { price: 'desc' },
    });
    return services.length > 0 ? services : defaultServices;
  } catch {
    return defaultServices;
  }
}

export async function fetchProfessionals() {
  try {
    const pros = await prisma.professional.findMany({
      orderBy: { name: 'asc' },
    });
    return pros.length > 0 ? pros : defaultProfessionals;
  } catch {
    return defaultProfessionals;
  }
}

export async function fetchAvailability(dateStr: string, professionalId: string, durationMin: number = 30) {
  return await getAvailabilityForDate(dateStr, professionalId, durationMin);
}

export interface CreateAppointmentPayload {
  serviceId: string;
  professionalId: string;
  clientName: string;
  clientPhone: string;
  clientNotes?: string;
  startTime: string; // ISO string
  durationMin: number;
}

export async function createAppointment(payload: CreateAppointmentPayload) {
  const start = new Date(payload.startTime);
  const end = new Date(start.getTime() + (payload.durationMin || 30) * 60 * 1000);

  const selectedService = defaultServices.find((s) => s.id === payload.serviceId || s.name === payload.serviceId) || defaultServices[0];
  const selectedPro = defaultProfessionals.find((p) => p.id === payload.professionalId || p.name === payload.professionalId) || defaultProfessionals[0];

  const newAppt = {
    id: 'appt-' + Math.random().toString(36).substring(2, 9),
    clientName: payload.clientName,
    clientPhone: payload.clientPhone,
    clientNotes: payload.clientNotes,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    status: 'CONFIRMED',
    serviceId: selectedService.id,
    professionalId: selectedPro.id,
    service: selectedService,
    professional: selectedPro,
    createdAt: new Date().toISOString(),
  };

  // 1. Save to LocalStorage immediately & synchronously
  const localList = getLocalAppointments();
  saveLocalAppointments([newAppt, ...localList]);

  // 2. Try DB in background without blocking
  try {
    prisma.appointment.create({
      data: {
        id: newAppt.id,
        clientName: payload.clientName,
        clientPhone: payload.clientPhone,
        clientNotes: payload.clientNotes,
        startTime: start,
        endTime: end,
        status: 'CONFIRMED',
        serviceId: selectedService.id,
        professionalId: selectedPro.id,
      },
    }).catch((err) => console.warn('DB async insert fallback:', err));
  } catch (err) {
    console.warn('DB creation fallback to local storage:', err);
  }

  return newAppt;
}

export async function fetchAppointmentsForDate(dateStr: string) {
  let dbAppts: any[] = [];
  try {
    if (dateStr === 'all' || !dateStr) {
      dbAppts = await prisma.appointment.findMany({
        include: { service: true, professional: true },
        orderBy: { startTime: 'asc' },
      });
    } else {
      const targetDate = new Date(`${dateStr}T00:00:00`);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      dbAppts = await prisma.appointment.findMany({
        where: {
          startTime: { gte: startOfDay, lte: endOfDay },
        },
        include: {
          service: true,
          professional: true,
        },
        orderBy: { startTime: 'asc' },
      });
    }
  } catch {
    dbAppts = [];
  }

  // Merge with LocalStorage appointments
  const localAppts = getLocalAppointments().filter((a) => {
    if (dateStr === 'all' || !dateStr) return true;
    const apptDateStr = toLocalDateStr(a.startTime);
    return apptDateStr === dateStr;
  });

  const mergedMap = new Map();
  dbAppts.forEach((a) => mergedMap.set(a.id, a));
  localAppts.forEach((a) => {
    if (!mergedMap.has(a.id)) {
      mergedMap.set(a.id, a);
    }
  });

  return Array.from(mergedMap.values());
}

export async function updateAppointmentStatus(appointmentId: string, newStatus: string, cancelReason?: string) {
  // Update LocalStorage
  const localList = getLocalAppointments().map((a) =>
    a.id === appointmentId ? { ...a, status: newStatus, ...(cancelReason ? { cancelReason } : {}) } : a
  );
  saveLocalAppointments(localList);

  // Update DB in background
  try {
    prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: newStatus,
        ...(cancelReason ? { cancelReason } : {}),
      },
    }).catch((err) => console.warn('DB async status update fallback:', err));
  } catch (err) {
    console.warn('DB status update fallback:', err);
  }

  return { id: appointmentId, status: newStatus, cancelReason };
}

export async function findAppointmentsByPhone(phoneDigits: string) {
  const searchClean = phoneDigits.replace(/\D/g, '');
  if (!searchClean) return [];

  let dbAppts: any[] = [];
  try {
    dbAppts = await prisma.appointment.findMany({
      include: {
        service: true,
        professional: true,
      },
      orderBy: { startTime: 'asc' },
    });
  } catch {
    dbAppts = [];
  }

  const localAppts = getLocalAppointments();
  const mergedMap = new Map();
  dbAppts.forEach((a) => mergedMap.set(a.id, a));
  localAppts.forEach((a) => {
    if (!mergedMap.has(a.id)) mergedMap.set(a.id, a);
  });

  const allMerged = Array.from(mergedMap.values());

  return allMerged.filter((a) => {
    if (!a.clientPhone) return false;
    const targetClean = a.clientPhone.replace(/\D/g, '');
    if (!targetClean) return false;

    const isExactMatch = targetClean.includes(searchClean) || searchClean.includes(targetClean);
    const last8Search = searchClean.slice(-8);
    const last8Target = targetClean.slice(-8);
    const isSuffixMatch = last8Search.length >= 8 && last8Target.length >= 8 && last8Search === last8Target;

    return isExactMatch || isSuffixMatch;
  });
}

export interface UpdateAppointmentPayload {
  id: string;
  clientName: string;
  clientPhone: string;
  clientNotes?: string;
  serviceId: string;
  professionalId: string;
  startTime: string; // ISO String
  durationMin: number;
  status: string;
}

export async function updateFullAppointment(payload: UpdateAppointmentPayload) {
  const start = new Date(payload.startTime);
  const end = new Date(start.getTime() + payload.durationMin * 60 * 1000);

  const selectedService = defaultServices.find((s) => s.id === payload.serviceId) || defaultServices[0];
  const selectedPro = defaultProfessionals.find((p) => p.id === payload.professionalId) || defaultProfessionals[0];

  const updatedObj = {
    ...payload,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    service: selectedService,
    professional: selectedPro,
  };

  // Update LocalStorage
  const localList = getLocalAppointments().map((a) => (a.id === payload.id ? updatedObj : a));
  saveLocalAppointments(localList);

  // Update DB in background
  try {
    prisma.appointment.update({
      where: { id: payload.id },
      data: {
        clientName: payload.clientName,
        clientPhone: payload.clientPhone,
        clientNotes: payload.clientNotes,
        serviceId: payload.serviceId,
        professionalId: payload.professionalId,
        startTime: start,
        endTime: end,
        status: payload.status,
      },
    }).catch((err) => console.warn('DB async update full appt fallback:', err));
  } catch (err) {
    console.warn('Fallback update full appointment:', err);
  }

  return updatedObj;
}
