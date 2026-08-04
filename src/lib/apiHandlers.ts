import { prisma } from './prisma';
import { getAvailabilityForDate } from './bookingService';

// Default mock fallback data if database is not yet migrated on Supabase
const defaultProfessionals = [
  { id: 'pro-1', name: 'JONATHAN NEMECEK', role: 'Barbeiro & Fundador', specialties: 'Cortes na Tesoura • Visagismo • Barboterapia', avatarUrl: '/jonathan.png' },
  { id: 'pro-2', name: 'BRUNO', role: 'Artista & Tatuador', specialties: 'Lettering • Dark Art • Freehand', avatarUrl: '/bruno.png' },
  { id: 'pro-3', name: 'BOSCO', role: 'Barbeiro', specialties: 'Cabelo Afro • Barba • Corte Americano', avatarUrl: '/bosco.png' },
  { id: 'pro-4', name: 'LUKINHA', role: 'Barbeiro', specialties: 'Moicano • Americano • Freestyle', avatarUrl: '/Lukinha.png' },
  { id: 'pro-5', name: 'MATHEUS', role: 'Tatuador', specialties: 'Realismo • Preto e Cinza • Fine Line', avatarUrl: '/matheus.png' },
  { id: 'pro-6', name: 'PORKS', role: 'Barbeiro & Estilo', specialties: 'Cortes Modernos • Degradê • Pigmentação', avatarUrl: '/porks.png' },
];

const defaultServices = [
  { id: 'srv-1', name: 'Corte de Cabelo Masculino Stylist', category: 'barbearia', durationMin: 30, price: 60.0, description: 'Visagismo sob medida, corte com tesoura/máquina e finalização premium.' },
  { id: 'srv-2', name: 'Barboterapia com Toalha Quente', category: 'barbearia', durationMin: 30, price: 50.0, description: 'Esfoliação, óleo essencial, toalha quente e alinhamento na navalha.' },
  { id: 'srv-3', name: 'Combo VIP Complete', category: 'combos', durationMin: 60, price: 150.0, description: 'Corte + Barboterapia + Sobrancelha + Esfoliação facial.' },
  { id: 'srv-4', name: 'Cabelo + Barba + Sobrancelha', category: 'combos', durationMin: 60, price: 110.0, description: 'O combo mais pedido: alinhamento completo do visual.' },
  { id: 'srv-5', name: 'Cabelo + Barba', category: 'combos', durationMin: 45, price: 95.0, description: 'Corte masculino + modelagem e desenho de barba.' },
  { id: 'srv-6', name: 'Sessão de Tattoo Autoral / Consultoria', category: 'tattoo', durationMin: 60, price: 200.0, description: 'Consultoria e criação de projeto autoral sob medida.' },
  { id: 'srv-7', name: 'Limpeza de Pele & Cuidado Facial', category: 'estetica', durationMin: 30, price: 70.0, description: 'Remoção de cravos, esfoliação e hidratação profunda.' },
];

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

  try {
    const appointment = await prisma.appointment.create({
      data: {
        clientName: payload.clientName,
        clientPhone: payload.clientPhone,
        clientNotes: payload.clientNotes,
        startTime: start,
        endTime: end,
        status: 'CONFIRMED',
        serviceId: payload.serviceId,
        professionalId: payload.professionalId,
      },
      include: {
        service: true,
        professional: true,
      },
    });
    return appointment;
  } catch (err) {
    console.warn('Fallback booking creation in local state:', err);
    return {
      id: 'appt-' + Math.random().toString(36).substring(2, 9),
      clientName: payload.clientName,
      clientPhone: payload.clientPhone,
      startTime: start,
      endTime: end,
      status: 'CONFIRMED',
      serviceId: payload.serviceId,
      professionalId: payload.professionalId,
    };
  }
}

export async function fetchAppointmentsForDate(dateStr: string) {
  const targetDate = new Date(`${dateStr}T00:00:00`);
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    return await prisma.appointment.findMany({
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
    return [];
  }
}

export async function updateAppointmentStatus(appointmentId: string, newStatus: string) {
  try {
    return await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus },
    });
  } catch (err) {
    console.warn('Status update fallback:', err);
    return { id: appointmentId, status: newStatus };
  }
}
