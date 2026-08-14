import { supabase, isSupabaseConfigured } from './supabase';
import { getAvailabilityForDate } from './bookingService';

export const defaultProfessionals = [
  { id: 'pro-1', name: 'JONATHAN NEMECEK', role: 'Barbeiro & Fundador', specialties: 'Cortes na Tesoura • Visagismo • Barboterapia', avatarUrl: '/imgs profissional agendamento/jonathan.png' },
  { id: 'pro-2', name: 'BRUNO', role: 'Artista & Tatuador', specialties: 'Lettering • Dark Art • Freehand', avatarUrl: '/imgs profissional agendamento/bruno.png' },
  { id: 'pro-3', name: 'BOSCO', role: 'Barbeiro', specialties: 'Cabelo Afro • Barba • Corte Americano', avatarUrl: '/imgs profissional agendamento/bosco.png' },
  { id: 'pro-4', name: 'LUKINHA', role: 'Barbeiro', specialties: 'Moicano • Americano • Freestyle', avatarUrl: '/imgs profissional agendamento/lukinha.png' },
  { id: 'pro-5', name: 'MATHEUS', role: 'Tatuador', specialties: 'Realismo • Preto e Cinza • Fine Line', avatarUrl: '/imgs profissional agendamento/matheus.png' },
];

export const defaultServices = [
  // Masculino
  { id: 'srv-m-1', name: 'Cabelo', category: 'masculino', durationMin: 30, price: 50.0, description: 'Corte masculino completo (moderno ou tradicional) com alinhamento e finalização.' },
  { id: 'srv-m-2', name: 'Tintura', category: 'masculino', durationMin: 45, price: 80.0, description: 'Coloração capilar profissional e cobertura dos fios.' },
  { id: 'srv-m-3', name: 'Barba', category: 'masculino', durationMin: 30, price: 45.0, description: 'Modelagem, desenho preciso das linhas e barboterapia com toalha quente.' },
  { id: 'srv-m-4', name: 'Hidratação', category: 'masculino', durationMin: 30, price: 30.0, description: 'Tratamento de nutrição profunda para saúde e brilho dos fios.' },
  { id: 'srv-m-5', name: 'Relaxamento Capilar', category: 'masculino', durationMin: 45, price: 45.0, description: 'Alinhamento, redução de volume e controle de frizz.' },
  { id: 'srv-m-6', name: 'Matizador', category: 'masculino', durationMin: 30, price: 30.0, description: 'Neutralização de tons amarelados e realce da cor.' },
  { id: 'srv-m-7', name: 'Luzes', category: 'masculino', durationMin: 60, price: 190.0, description: 'Técnica de iluminação e mechas masculinas platinadas ou douradas.' },
  { id: 'srv-m-8', name: 'Sobrancelha', category: 'masculino', durationMin: 15, price: 10.0, description: 'Design e alinhamento do desenho na navalha ou tesoura.' },
  { id: 'srv-m-9', name: 'Limpeza de Pele', category: 'masculino', durationMin: 30, price: 45.0, description: 'Esfoliação facial, remoção de cravos e desobstrução de poros.' },
  { id: 'srv-m-10', name: 'Depilação Orelha / Nariz', category: 'masculino', durationMin: 15, price: 20.0, description: 'Remoção prática e sem dor de pelos com cera quente.' },

  // Feminino
  { id: 'srv-f-1', name: 'Corte Feminino', category: 'feminino', durationMin: 45, price: 100.0, description: 'Corte estilizado com diagnóstico capilar, secagem e finalização.' },
  { id: 'srv-f-2', name: 'Tintura Cabelo', category: 'feminino', durationMin: 60, price: 80.0, description: 'Aplicação de tinta profissional com pigmentação intensa e brilho.' },
  { id: 'srv-f-3', name: 'Hidratação Feminina', category: 'feminino', durationMin: 30, price: 40.0, description: 'Tratamento intensivo de nutrição e restauração da fibra capilar.' },
  { id: 'srv-f-4', name: 'Relaxamento Capilar Feminino', category: 'feminino', durationMin: 45, price: 45.0, description: 'Alinhamento térmico e redução de volume para fios mais soltos.' },
  { id: 'srv-f-5', name: 'Limpeza de Pele Feminina', category: 'feminino', durationMin: 30, price: 45.0, description: 'Higienização facial profunda, esfoliação e hidratação calmante.' },

  // Combos
  { id: 'srv-c-1', name: 'Cabelo + Sobrancelha + Hidratação + Nariz + Limpeza de Pele', category: 'combos', durationMin: 90, price: 140.0, description: 'Combo VIP completo para renovação total do visual e cuidado facial.' },
  { id: 'srv-c-2', name: 'Cabelo + Barba + Sobrancelha', category: 'combos', durationMin: 60, price: 85.0, description: 'O combo mais pedido da casa: alinhamento completo de cabelo, barba e sobrancelha.' },
  { id: 'srv-c-3', name: 'Cabelo + Barba', category: 'combos', durationMin: 45, price: 80.0, description: 'Corte de cabelo completo acompanhado de barboterapia com toalha quente.' },
  { id: 'srv-c-4', name: 'Cabelo + Sobrancelha', category: 'combos', durationMin: 30, price: 60.0, description: 'Corte de cabelo alinhado com design de sobrancelha na navalha.' },

  // Tattoo
  { id: 'srv-t-1', name: 'Tatuagem Autoral (Sessão)', category: 'tattoo', durationMin: 60, price: 'Sob consulta', description: 'Projetos exclusivos de Lettering, Dark, Realismo e Freehand com nossos artistas.' },
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
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('price', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((s: any) => ({
          id: s.id,
          name: s.name,
          category: s.category,
          durationMin: s.duration_min || s.durationMin || 30,
          price: typeof s.price === 'number' ? s.price : parseFloat(s.price) || 0,
          description: s.description,
        }));
      }
    } catch (e) {
      console.warn('Fallback: Error fetching services from Supabase', e);
    }
  }
  return defaultServices;
}

export async function fetchProfessionals() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((p: any) => ({
          id: p.id,
          name: p.name,
          role: p.role,
          specialties: p.specialties,
          avatarUrl: p.avatar_url || p.avatarUrl,
        }));
      }
    } catch (e) {
      console.warn('Fallback: Error fetching professionals from Supabase', e);
    }
  }
  return defaultProfessionals;
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
  userId?: string;
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

  // 2. Try Supabase in background without blocking
  if (isSupabaseConfigured) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = payload.userId || session?.user?.id || null;

      await supabase.from('appointments').insert({
        id: newAppt.id,
        user_id: currentUserId,
        client_name: payload.clientName,
        client_phone: payload.clientPhone,
        client_notes: payload.clientNotes || null,
        service_id: selectedService.id,
        professional_id: selectedPro.id,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        status: 'CONFIRMED',
      });
    } catch (err) {
      console.warn('Supabase async insert fallback:', err);
    }
  }

  return newAppt;
}

export async function fetchAppointmentsForDate(dateStr: string) {
  let dbAppts: any[] = [];
  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('appointments')
        .select(`
          id,
          client_name,
          client_phone,
          client_notes,
          cancel_reason,
          start_time,
          end_time,
          status,
          service_id,
          professional_id,
          service:services(id, name, price, duration_min, category),
          professional:professionals(id, name, role, avatar_url)
        `)
        .order('start_time', { ascending: true });

      if (dateStr && dateStr !== 'all') {
        const targetDate = new Date(`${dateStr}T00:00:00`);
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        query = query.gte('start_time', startOfDay.toISOString()).lte('start_time', endOfDay.toISOString());
      }

      const { data, error } = await query;
      if (!error && data) {
        dbAppts = data.map((item: any) => ({
          id: item.id,
          clientName: item.client_name,
          clientPhone: item.client_phone,
          clientNotes: item.client_notes,
          cancelReason: item.cancel_reason,
          startTime: item.start_time,
          endTime: item.end_time,
          status: item.status,
          serviceId: item.service_id,
          professionalId: item.professional_id,
          service: item.service || defaultServices.find((s) => s.id === item.service_id),
          professional: item.professional || defaultProfessionals.find((p) => p.id === item.professional_id),
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch error, falling back to local storage:', e);
      dbAppts = [];
    }
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

  // Update Supabase in background
  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('appointments')
        .update({
          status: newStatus,
          cancel_reason: cancelReason || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', appointmentId);
    } catch (err) {
      console.warn('Supabase status update fallback:', err);
    }
  }

  return { id: appointmentId, status: newStatus, cancelReason };
}

export async function findAppointmentsByPhone(phoneDigits: string) {
  const searchClean = phoneDigits.replace(/\D/g, '');
  if (!searchClean) return [];

  let dbAppts: any[] = [];
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          client_name,
          client_phone,
          client_notes,
          cancel_reason,
          start_time,
          end_time,
          status,
          service_id,
          professional_id,
          service:services(id, name, price, duration_min, category),
          professional:professionals(id, name, role, avatar_url)
        `)
        .order('start_time', { ascending: true });

      if (!error && data) {
        dbAppts = data.map((item: any) => ({
          id: item.id,
          clientName: item.client_name,
          clientPhone: item.client_phone,
          clientNotes: item.client_notes,
          cancelReason: item.cancel_reason,
          startTime: item.start_time,
          endTime: item.end_time,
          status: item.status,
          serviceId: item.service_id,
          professionalId: item.professional_id,
          service: item.service || defaultServices.find((s) => s.id === item.service_id),
          professional: item.professional || defaultProfessionals.find((p) => p.id === item.professional_id),
        }));
      }
    } catch {
      dbAppts = [];
    }
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

  // Update Supabase in background
  if (isSupabaseConfigured) {
    try {
      await supabase
        .from('appointments')
        .update({
          client_name: payload.clientName,
          client_phone: payload.clientPhone,
          client_notes: payload.clientNotes || null,
          service_id: payload.serviceId,
          professional_id: payload.professionalId,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          status: payload.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payload.id);
    } catch (err) {
      console.warn('Fallback update full appointment in Supabase:', err);
    }
  }

  return updatedObj;
}
