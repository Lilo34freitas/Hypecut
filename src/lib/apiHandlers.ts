import { prisma } from './prisma';
import { getAvailabilityForDate } from './bookingService';

// Default mock fallback data if database is not yet migrated on Supabase
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

export function getLocalAppointments(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('hypecut_appointments');
    return raw ? JSON.parse(raw) : [];
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
  const end = new Date(start.getTime() + payload.durationMin * 60 * 1000);

  const selectedService = defaultServices.find((s) => s.id === payload.serviceId) || {
    id: payload.serviceId,
    name: 'Serviço HypeCut',
    price: 60,
    durationMin: payload.durationMin,
  };
  const selectedPro = defaultProfessionals.find((p) => p.id === payload.professionalId) || {
    id: payload.professionalId,
    name: 'JONATHAN NEMECEK',
    role: 'Barbeiro',
  };

  const newAppt = {
    id: 'appt-' + Math.random().toString(36).substring(2, 9),
    clientName: payload.clientName,
    clientPhone: payload.clientPhone,
    clientNotes: payload.clientNotes,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
    status: 'CONFIRMED',
    serviceId: payload.serviceId,
    professionalId: payload.professionalId,
    service: selectedService,
    professional: selectedPro,
    createdAt: new Date().toISOString(),
  };

  // 1. Save to LocalStorage immediately for instant SPA UI update
  const localList = getLocalAppointments();
  saveLocalAppointments([newAppt, ...localList]);

  // 2. Try DB in background
  try {
    await prisma.appointment.create({
      data: {
        id: newAppt.id,
        clientName: payload.clientName,
        clientPhone: payload.clientPhone,
        clientNotes: payload.clientNotes,
        startTime: start,
        endTime: end,
        status: 'CONFIRMED',
        serviceId: payload.serviceId,
        professionalId: payload.professionalId,
      },
    });
  } catch (err) {
    console.warn('DB creation fallback to local storage:', err);
  }

  return newAppt;
}

export async function fetchAppointmentsForDate(dateStr: string) {
  const targetDateStr = dateStr;

  let dbAppts: any[] = [];
  try {
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
  } catch {
    dbAppts = [];
  }

  // Merge with LocalStorage appointments for that date
  const localAppts = getLocalAppointments().filter((a) => {
    const apptDateStr = new Date(a.startTime).toISOString().split('T')[0];
    return apptDateStr === targetDateStr;
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
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: newStatus,
        ...(cancelReason ? { cancelReason } : {}),
      },
    });
  } catch (err) {
    console.warn('DB status update fallback:', err);
  }

  return { id: appointmentId, status: newStatus, cancelReason };
}

export async function findAppointmentsByPhone(phoneDigits: string) {
  const cleanPhone = phoneDigits.replace(/\D/g, '');

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
  return allMerged.filter((a) => (a.clientPhone || '').replace(/\D/g, '').includes(cleanPhone));
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

  const selectedService = defaultServices.find((s) => s.id === payload.serviceId) || {
    id: payload.serviceId,
    name: 'Serviço HypeCut',
    price: 60,
    durationMin: payload.durationMin,
  };
  const selectedPro = defaultProfessionals.find((p) => p.id === payload.professionalId) || {
    id: payload.professionalId,
    name: 'JONATHAN NEMECEK',
    role: 'Barbeiro',
  };

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
    await prisma.appointment.update({
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
    });
  } catch (err) {
    console.warn('Fallback update full appointment:', err);
  }

  return updatedObj;
}
