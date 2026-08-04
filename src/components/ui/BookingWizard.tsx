import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  ChevronLeft,
  X,
  Sparkles,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import {
  fetchServices,
  fetchProfessionals,
  fetchAvailability,
  createAppointment,
} from '../../lib/apiHandlers';
import type { TimeSlot } from '../../lib/bookingService';

export interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  isOpen,
  onClose,
  initialServiceId,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [services, setServices] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);

  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Upcoming 14 Days Array
  const [upcomingDates, setUpcomingDates] = useState<{ dateStr: string; label: string; dayName: string; isSunday: boolean }[]>([]);

  useEffect(() => {
    // Generate next 14 available days
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase();
      const label = `${day}/${month}`;
      const isSunday = d.getDay() === 0;

      dates.push({ dateStr, label, dayName, isSunday });
    }

    setUpcomingDates(dates);
    if (dates.length > 0) {
      // Pick first non-sunday date
      const firstValid = dates.find((d) => !d.isSunday) || dates[0];
      setSelectedDateStr(firstValid.dateStr);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [srvs, pros] = await Promise.all([fetchServices(), fetchProfessionals()]);
      setServices(srvs);
      setProfessionals(pros);

      if (initialServiceId) {
        const found = srvs.find((s: any) => s.id === initialServiceId);
        if (found) setSelectedService(found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Load Time Slots when Date, Professional or Service changes
  useEffect(() => {
    if (step === 3 && selectedDateStr && selectedService) {
      loadTimeSlots();
    }
  }, [step, selectedDateStr, selectedProfessional, selectedService]);

  const loadTimeSlots = async () => {
    setLoadingSlots(true);
    setSelectedTimeSlot(null);
    try {
      const proId = selectedProfessional ? selectedProfessional.id : 'any';
      const duration = selectedService ? selectedService.durationMin : 30;
      const slots = await fetchAvailability(selectedDateStr, proId, duration);
      setAvailableSlots(slots);
    } catch (err) {
      console.error(err);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSelectService = (srv: any) => {
    setSelectedService(srv);
    setStep(2);
  };

  const handleSelectProfessional = (pro: any) => {
    setSelectedProfessional(pro);
    setStep(3);
  };

  const handleConfirmSlot = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
    setStep(4);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !selectedTimeSlot || !selectedService) return;

    setLoading(true);
    try {
      const payload = {
        serviceId: selectedService.id,
        professionalId: selectedProfessional ? selectedProfessional.id : 'pro-1',
        clientName,
        clientPhone,
        clientNotes,
        startTime: selectedTimeSlot.startTime,
        durationMin: selectedService.durationMin,
      };

      await createAppointment(payload);
      setStep(5);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedProfessional(null);
    setSelectedTimeSlot(null);
    setClientName('');
    setClientPhone('');
    setClientNotes('');
    onClose();
  };

  const filteredServices = categoryFilter === 'todos'
    ? services
    : services.filter((s) => s.category === categoryFilter);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={resetWizard}
        className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl bg-[#0B0908] border-2 border-[#5E308A] rounded-none shadow-2xl z-10 overflow-hidden my-auto text-[#F2EAD9]"
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-black border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#5E308A] flex items-center justify-center text-white font-black text-xs shadow-md">
              H
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-[#F2EAD9]">
                AGENDAMENTO ONLINE <span className="text-[#5E308A]">HYPECUT</span>
              </h2>
              <p className="text-[11px] text-white/60 font-bold uppercase tracking-wider">
                Passo 0{step} de 05 — {step === 1 ? 'Escolha o Serviço' : step === 2 ? 'Escolha o Profissional' : step === 3 ? 'Data & Horário Vago' : step === 4 ? 'Seus Dados' : 'Agendamento Confirmado'}
              </p>
            </div>
          </div>

          <button
            onClick={resetWizard}
            className="p-2 bg-white/10 hover:bg-[#5E308A] text-white transition-colors rounded-none cursor-pointer border border-white/20"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-accent-light via-[#5E308A] to-accent-glow transition-all duration-500"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* STEP CONTENT */}
        <div className="p-6 sm:p-8 min-h-[460px] max-h-[75vh] overflow-y-auto">
          {/* STEP 1: SERVICE SELECTION */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { id: 'todos', label: 'Todos os Serviços' },
                  { id: 'barbearia', label: 'Barbearia' },
                  { id: 'combos', label: 'Combos VIP' },
                  { id: 'tattoo', label: 'Tattoo Autoral' },
                  { id: 'estetica', label: 'Estética Facial' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-4 py-2 text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all rounded-none ${
                      categoryFilter === cat.id
                        ? 'bg-[#5E308A] text-white shadow-lg border border-[#9D4EDD]'
                        : 'bg-white/5 text-[#F2EAD9]/80 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredServices.map((srv) => (
                  <div
                    key={srv.id}
                    onClick={() => handleSelectService(srv)}
                    className={`p-5 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                      selectedService?.id === srv.id
                        ? 'border-[#5E308A] bg-[#1a0f26]'
                        : 'border-white/10 bg-black hover:border-white/30 hover:bg-white/5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-0.5 bg-[#5E308A]/30 text-[#E0AAFF] font-black text-[10px] uppercase tracking-widest border border-[#5E308A]/40">
                          {srv.durationMin} MINUTOS
                        </span>
                        <span className="font-black text-lg text-[#F2EAD9]">
                          R$ {srv.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <h3 className="font-black text-base uppercase text-[#F2EAD9] tracking-tight group-hover:text-[#5E308A] transition-colors mb-1">
                        {srv.name}
                      </h3>

                      <p className="text-xs text-white/70 font-medium leading-relaxed mb-4">
                        {srv.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-end text-xs font-black uppercase text-[#5E308A] group-hover:translate-x-1 transition-transform gap-1">
                      <span>Selecionar</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: PROFESSIONAL SELECTION */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs font-bold text-[#F2EAD9]/70 hover:text-white uppercase tracking-wider"
                >
                  <ChevronLeft size={16} />
                  <span>Voltar para Serviços</span>
                </button>

                <span className="text-xs font-bold text-[#5E308A] uppercase">
                  Serviço: {selectedService?.name}
                </span>
              </div>

              {/* Professionals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Any Professional Option */}
                <div
                  onClick={() => handleSelectProfessional(null)}
                  className={`p-5 border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 ${
                    selectedProfessional === null
                      ? 'border-[#5E308A] bg-[#1a0f26]'
                      : 'border-white/10 bg-black hover:border-white/30'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-[#5E308A]/30 border-2 border-[#5E308A] flex items-center justify-center text-[#E0AAFF]">
                    <Sparkles size={28} />
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase text-[#F2EAD9]">
                      PRÓXIMO DISPONÍVEL
                    </h4>
                    <p className="text-[11px] text-white/60 font-bold uppercase mt-0.5">
                      Qualquer Barbeiro/Tatuador
                    </p>
                  </div>
                </div>

                {/* Specific Professionals */}
                {professionals.map((pro) => (
                  <div
                    key={pro.id}
                    onClick={() => handleSelectProfessional(pro)}
                    className={`p-5 border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-between space-y-3 group ${
                      selectedProfessional?.id === pro.id
                        ? 'border-[#5E308A] bg-[#1a0f26]'
                        : 'border-white/10 bg-black hover:border-white/30'
                    }`}
                  >
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-[#5E308A] transition-colors mx-auto">
                      <img
                        src={pro.avatarUrl || '/jonathan.png'}
                        alt={pro.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#5E308A] block">
                        {pro.role}
                      </span>
                      <h4 className="font-black text-base uppercase text-[#F2EAD9] tracking-tight group-hover:text-[#5E308A] transition-colors">
                        {pro.name}
                      </h4>
                      <p className="text-[10px] text-white/60 font-medium leading-tight mt-1 line-clamp-2">
                        {pro.specialties}
                      </p>
                    </div>

                    <span className="text-[11px] font-black uppercase text-[#5E308A]">
                      Selecionar ›
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: DATE & TIME PICKER */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-xs font-bold text-[#F2EAD9]/70 hover:text-white uppercase tracking-wider"
                >
                  <ChevronLeft size={16} />
                  <span>Voltar para Profissional</span>
                </button>

                <div className="text-xs font-bold text-right">
                  <span className="text-white/60">Profissional: </span>
                  <span className="text-[#5E308A] font-black uppercase">
                    {selectedProfessional ? selectedProfessional.name : 'Qualquer Profissional'}
                  </span>
                </div>
              </div>

              {/* Upcoming Date Tabs */}
              <div>
                <label className="text-xs font-black uppercase text-[#5E308A] tracking-wider block mb-3">
                  1. SELECIONE O DIA DE ATENDIMENTO
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {upcomingDates.map((d) => (
                    <button
                      key={d.dateStr}
                      disabled={d.isSunday}
                      onClick={() => setSelectedDateStr(d.dateStr)}
                      className={`flex flex-col items-center justify-center p-3 min-w-[76px] border-2 transition-all rounded-none ${
                        d.isSunday
                          ? 'opacity-40 cursor-not-allowed bg-black/40 border-white/5 text-white/30'
                          : selectedDateStr === d.dateStr
                          ? 'border-[#5E308A] bg-[#5E308A] text-white shadow-lg scale-105'
                          : 'border-white/10 bg-black text-[#F2EAD9] hover:border-white/30'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {d.dayName}
                      </span>
                      <span className="text-base font-black tracking-tight mt-0.5">
                        {d.label}
                      </span>
                      {d.isSunday && (
                        <span className="text-[8px] font-bold uppercase text-red-400 mt-1">Fechado</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots Grid */}
              <div>
                <label className="text-xs font-black uppercase text-[#5E308A] tracking-wider block mb-3">
                  2. SELECIONE O HORÁRIO LIVRE (DURAÇÃO: {selectedService?.durationMin} MIN)
                </label>

                {loadingSlots ? (
                  <div className="py-12 text-center text-xs font-bold text-white/60 uppercase tracking-widest">
                    Buscando horários livres em tempo real no banco de dados...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-10 p-6 border border-dashed border-white/20 text-center text-xs font-bold text-white/70 uppercase tracking-wider bg-black">
                    Não há horários disponíveis para esta data. Por favor selecione outro dia.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        disabled={!slot.available}
                        onClick={() => handleConfirmSlot(slot)}
                        className={`py-3 px-2 border-2 text-xs font-black uppercase tracking-wider transition-all rounded-none flex items-center justify-center gap-1.5 ${
                          !slot.available
                            ? 'opacity-30 line-through bg-black border-white/5 cursor-not-allowed text-white/40'
                            : selectedTimeSlot?.time === slot.time
                            ? 'border-[#5E308A] bg-[#5E308A] text-white shadow-lg scale-105'
                            : 'border-white/15 bg-black text-[#F2EAD9] hover:border-[#5E308A] hover:bg-[#5E308A]/20'
                        }`}
                      >
                        <Clock size={12} />
                        <span>{slot.time}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: CLIENT INFO FORM */}
          {step === 4 && (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1 text-xs font-bold text-[#F2EAD9]/70 hover:text-white uppercase tracking-wider"
                >
                  <ChevronLeft size={16} />
                  <span>Voltar para Horários</span>
                </button>
              </div>

              {/* Booking Summary Pill */}
              <div className="p-4 border border-[#5E308A] bg-[#5E308A]/15 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#E0AAFF] block">
                    RESUMO DO AGENDAMENTO
                  </span>
                  <h4 className="font-black text-base uppercase text-[#F2EAD9]">
                    {selectedService?.name} — {selectedProfessional ? selectedProfessional.name : 'Qualquer Profissional'}
                  </h4>
                  <p className="text-xs font-bold text-white/80 uppercase mt-0.5">
                    Data: {selectedDateStr.split('-').reverse().join('/')} às {selectedTimeSlot?.time} hs
                  </p>
                </div>
                <span className="font-black text-xl text-[#F2EAD9]">
                  R$ {selectedService?.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Client Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#F2EAD9] block mb-1.5">
                    SEU NOME COMPLETO *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Gabriel Silva"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full py-3.5 px-4 bg-black border border-white/20 focus:border-[#5E308A] text-white text-sm font-semibold rounded-none outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#F2EAD9] block mb-1.5">
                    SEU TELEFONE / WHATSAPP *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(47) 99999-9999"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full py-3.5 px-4 bg-black border border-white/20 focus:border-[#5E308A] text-white text-sm font-semibold rounded-none outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-[#F2EAD9] block mb-1.5">
                    OBSERVAÇÕES OU PREFERÊNCIAS (OPCIONAL)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Preferência por corte com navalha nas laterais..."
                    value={clientNotes}
                    onChange={(e) => setClientNotes(e.target.value)}
                    className="w-full py-3 px-4 bg-black border border-white/20 focus:border-[#5E308A] text-white text-xs font-medium rounded-none outline-none transition-colors resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !clientName || !clientPhone}
                className="Btn-purple w-full font-black text-sm uppercase tracking-widest shadow-2xl"
              >
                <span>{loading ? 'FINALIZANDO AGENDAMENTO...' : 'CONFIRMAR MEU AGENDAMENTO NOW ›'}</span>
              </button>
            </form>
          )}

          {/* STEP 5: SUCCESS CONFIRMATION */}
          {step === 5 && (
            <div className="py-8 text-center space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-[#5E308A] border-4 border-[#9D4EDD] flex items-center justify-center text-white shadow-2xl animate-bounce">
                <CheckCircle2 size={44} />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#E0AAFF] block mb-1">
                  AGENDAMENTO REGISTRADO COM SUCESSO!
                </span>
                <h3 className="text-3xl font-black uppercase text-[#F2EAD9] tracking-tight">
                  TE ESPERAMOS NA HYPECUT!
                </h3>
              </div>

              {/* Voucher Box */}
              <div className="w-full max-w-md p-6 border-2 border-[#5E308A] bg-[#5E308A]/15 text-left space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase text-white/60">Cliente:</span>
                  <span className="font-black text-sm text-[#F2EAD9]">{clientName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase text-white/60">Serviço:</span>
                  <span className="font-black text-sm text-[#F2EAD9]">{selectedService?.name}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase text-white/60">Profissional:</span>
                  <span className="font-black text-sm text-[#F2EAD9]">
                    {selectedProfessional ? selectedProfessional.name : 'Qualquer Barbeiro'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-white/60">Data & Hora:</span>
                  <span className="font-black text-sm text-[#E0AAFF]">
                    {selectedDateStr.split('-').reverse().join('/')} às {selectedTimeSlot?.time}h
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md pt-2">
                <a
                  href={`https://wa.me/5547999595843?text=${encodeURIComponent(
                    `Olá! Acabei de fazer um agendamento online no site da HypeCut:\n\n• Cliente: ${clientName}\n• Serviço: ${selectedService?.name}\n• Profissional: ${
                      selectedProfessional ? selectedProfessional.name : 'Qualquer'
                    }\n• Data: ${selectedDateStr.split('-').reverse().join('/')} às ${selectedTimeSlot?.time}h`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 px-6 bg-[#25D366] hover:bg-[#1ebd59] text-black font-black text-xs uppercase tracking-widest rounded-none flex items-center justify-center gap-2 shadow-xl transition-all"
                >
                  <MessageSquare size={18} />
                  <span>ENVIAR NO WHATSAPP DA HYPECUT</span>
                </a>

                <button
                  onClick={resetWizard}
                  className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 text-[#F2EAD9] font-black text-xs uppercase tracking-widest rounded-none transition-all"
                >
                  FECHAR JANELA
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
