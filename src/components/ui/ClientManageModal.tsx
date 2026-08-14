import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  X,
  Calendar as CalendarIcon,
  Clock,
  LogIn,
  Search,
  ArrowLeft,
  AlertCircle,
  Scissors,
  MessageCircle,
} from 'lucide-react';
import {
  findAppointmentsByPhone,
  fetchAvailability,
  updateFullAppointment,
  updateAppointmentStatus,
} from '../../lib/apiHandlers';
import type { TimeSlot } from '../../lib/bookingService';
import { useAuth } from '../../context/AuthContext';

export const getHoursUntilAppointment = (startTime: string | Date): number => {
  const apptTime = new Date(startTime).getTime();
  const now = Date.now();
  return (apptTime - now) / (1000 * 60 * 60);
};

export const canModifyAppointment = (startTime: string | Date): boolean => {
  return getHoursUntilAppointment(startTime) >= 5;
};

export interface ClientManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
}

export const ClientManageModal: React.FC<ClientManageModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const { user, isAuthenticated } = useAuth();

  const [phoneSearch, setPhoneSearch] = useState<string>('');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Active Appointment Selected for Reschedule or Cancel
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [mode, setMode] = useState<'list' | 'reschedule' | 'cancel'>('list');

  // Reschedule State
  const [rescheduleDateStr, setRescheduleDateStr] = useState<string>('');
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [rescheduleLoading, setRescheduleLoading] = useState<boolean>(false);

  // Cancel State
  const [cancelReason, setCancelReason] = useState<string>('');
  const [cancelLoading, setCancelLoading] = useState<boolean>(false);

  // Action Success Message
  const [successMessage, setSuccessMessage] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setPhoneSearch('');
      setAppointments([]);
      setHasSearched(false);
      setSelectedAppt(null);
      setMode('list');
      setSuccessMessage('');
    } else {
      if (user) {
        loadUserAppointments();
      }
    }
  }, [isOpen, user]);

  const loadUserAppointments = async () => {
    if (!user) return;
    setLoading(true);
    setSuccessMessage('');
    try {
      // Find appointments matching user phone, email or name
      const results = await findAppointmentsByPhone(user.phone || user.email);
      setAppointments(results);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneSearch) return;

    setLoading(true);
    setSuccessMessage('');
    try {
      const results = await findAppointmentsByPhone(phoneSearch);
      setAppointments(results);
      setHasSearched(true);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReschedule = async (appt: any) => {
    if (!canModifyAppointment(appt.startTime)) {
      alert('Não é possível reagendar com menos de 5 horas de antecedência. Entre em contato diretamente pelo WhatsApp.');
      return;
    }
    setSelectedAppt(appt);
    setMode('reschedule');
    setSelectedSlot(null);

    const today = new Date().toISOString().split('T')[0];
    setRescheduleDateStr(today);
    loadSlots(today, appt.professionalId, appt.service?.durationMin || 30);
  };

  const loadSlots = async (dateStr: string, proId: string, durationMin: number) => {
    setRescheduleLoading(true);
    try {
      const slots = await fetchAvailability(dateStr, proId, durationMin);
      setAvailableSlots(slots);
    } catch (err) {
      console.error(err);
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleConfirmReschedule = async () => {
    if (!selectedAppt || !selectedSlot) return;

    if (!canModifyAppointment(selectedAppt.startTime)) {
      alert('Prazo limite expirado. Reagendamentos só podem ser feitos com até 5 horas de antecedência.');
      return;
    }

    setRescheduleLoading(true);
    try {
      await updateFullAppointment({
        id: selectedAppt.id,
        clientName: selectedAppt.clientName,
        clientPhone: selectedAppt.clientPhone,
        clientNotes: selectedAppt.clientNotes,
        serviceId: selectedAppt.serviceId,
        professionalId: selectedAppt.professionalId,
        startTime: selectedSlot.startTime,
        durationMin: selectedAppt.service?.durationMin || 30,
        status: 'CONFIRMED',
      });

      setSuccessMessage('Agendamento reagendado com sucesso!');
      setMode('list');
      if (user) {
        loadUserAppointments();
      } else if (phoneSearch) {
        const results = await findAppointmentsByPhone(phoneSearch);
        setAppointments(results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppt) return;

    if (!canModifyAppointment(selectedAppt.startTime)) {
      alert('Prazo limite expirado. Cancelamentos só podem ser feitos com até 5 horas de antecedência.');
      return;
    }

    setCancelLoading(true);
    try {
      await updateAppointmentStatus(selectedAppt.id, 'CANCELLED', cancelReason || 'Cancelado pelo cliente');
      setSuccessMessage('Agendamento cancelado com sucesso.');
      setMode('list');
      if (user) {
        loadUserAppointments();
      } else if (phoneSearch) {
        const results = await findAppointmentsByPhone(phoneSearch);
        setAppointments(results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCancelLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
        />

        {/* Drawer Panel Sliding in from the LEFT */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="fixed inset-y-0 left-0 w-full md:w-[70vw] lg:w-[60vw] xl:w-[52vw] max-w-4xl bg-[#0F0F12] border-r border-[#F2EAD9]/15 shadow-2xl z-[10000] flex flex-col text-[#F2EAD9] h-full max-h-screen"
        >
          {/* Header */}
          <div className="p-6 pb-4 border-b border-[#F2EAD9]/10 flex items-center justify-between bg-[#0F0F12] shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-[#5E308A]/20 border-2 border-[#5E308A]/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(94,48,138,0.3)]">
                <CalendarIcon className="text-[#5E308A]" size={22} />
              </div>
              <div>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[#5E308A] block">
                  PAINEL DO CLIENTE
                </span>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-tight text-[#F2EAD9]">
                  MEUS AGENDAMENTOS
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-none hover:bg-white/10 text-[#F2EAD9]/60 hover:text-[#F2EAD9] transition-colors cursor-pointer"
              title="Fechar"
            >
              <X size={24} />
            </button>
          </div>

          {/* Subheader / Mode Indicator */}
          <div className="bg-[#18181B] border-b border-[#F2EAD9]/10 px-6 py-3.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider shrink-0">
            <div className="flex items-center gap-2">
              <Scissors size={14} className="text-[#5E308A]" />
              <span className="text-[#F2EAD9] font-black tracking-widest text-xs">
                {mode === 'list' && 'Histórico e Próximos Cortes'}
                {mode === 'reschedule' && 'Alteração de Horário'}
                {mode === 'cancel' && 'Confirmação de Cancelamento'}
              </span>
            </div>
            {mode !== 'list' && (
              <button
                onClick={() => setMode('list')}
                className="flex items-center gap-1.5 text-xs text-[#5E308A] hover:text-[#7D40B3] font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Voltar à lista</span>
              </button>
            )}
          </div>

          {/* Main Scrollable Content */}
          <div
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            className="flex-1 overflow-y-auto min-h-0 p-6 space-y-6 overscroll-contain"
          >
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider flex items-center gap-2.5 shadow-md"
              >
                <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {/* NOT LOGGED IN WARNING & SEARCH */}
            {!isAuthenticated && !hasSearched && (
              <div className="bg-[#F2EAD9] border-2 border-[#0F0F12]/20 p-6 shadow-sm space-y-5 text-[#0F0F12]">
                <div className="text-center space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#5E308A]">
                    ACESSO RÁPIDO
                  </span>
                  <h3 className="text-base md:text-lg font-black uppercase text-[#0F0F12]">
                    Consulte ou reagende seus cortes
                  </h3>
                  <p className="text-xs text-[#0F0F12]/80 font-medium max-w-md mx-auto">
                    Conecte-se na sua conta ou informe o número de telefone utilizado no momento do agendamento.
                  </p>
                </div>

                {onOpenAuth && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      onClose();
                      onOpenAuth();
                    }}
                    className="w-full py-3.5 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(94,48,138,0.4)]"
                  >
                    <LogIn size={16} />
                    <span>ENTRAR NA MINHA CONTA</span>
                  </motion.button>
                )}

                <div className="relative flex items-center justify-center my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#0F0F12]/20" />
                  </div>
                  <span className="relative px-3 bg-[#F2EAD9] text-[10px] uppercase tracking-widest text-[#0F0F12]/60 font-black">
                    ou consulte por telefone
                  </span>
                </div>

                <form onSubmit={handleManualSearch} className="flex gap-2">
                  <input
                    type="tel"
                    value={phoneSearch}
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    placeholder="Digite seu WhatsApp: (47) 98862-3836"
                    className="flex-1 h-12 px-4 bg-white border-2 border-[#0F0F12]/20 text-[#0F0F12] placeholder-[#0F0F12]/50 text-xs font-semibold focus:border-[#5E308A] outline-none transition-colors"
                    required
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="h-12 px-6 bg-[#0F0F12] hover:bg-[#18181B] text-[#F2EAD9] font-black text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center gap-2 shrink-0 disabled:opacity-50"
                  >
                    <Search size={15} />
                    <span>Buscar</span>
                  </motion.button>
                </form>
              </div>
            )}

            {/* APPOINTMENTS LIST MODE */}
            {mode === 'list' && (hasSearched || isAuthenticated) && (
              <div className="space-y-5">
                {/* RULES & POLICY BANNER */}
                <div className="bg-[#18181B] border-2 border-[#5E308A]/60 p-5 text-[#F2EAD9] space-y-3 shadow-xl">
                  <div className="flex items-center gap-2.5 text-[#C084FC] font-black uppercase tracking-wider text-xs sm:text-sm">
                    <AlertCircle size={18} className="shrink-0 text-[#C084FC]" />
                    <span>Regras e Políticas de Agendamento HypeCut</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#F2EAD9]/85 font-medium leading-relaxed list-disc list-inside">
                    <li>
                      <strong className="text-[#F2EAD9]">Tolerância de Chegada:</strong> Máximo de <strong className="text-[#C084FC]">15 minutos</strong> de tolerância após o horário agendado.
                    </li>
                    <li>
                      <strong className="text-[#F2EAD9]">Cancelamento & Reagendamento:</strong> Permitidos gratuitamente com até <strong className="text-[#C084FC]">5 horas de antecedência</strong>.
                    </li>
                    <li>
                      <strong className="text-[#F2EAD9]">Política de No-Show (Falta):</strong> Em caso de não comparecimento sem aviso prévio de 5h, será cobrado <strong className="text-[#C084FC]">50% (metade) do valor do serviço</strong> na próxima visita.
                    </li>
                  </ul>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-xs text-[#F2EAD9]/50 uppercase tracking-widest font-bold">
                    Carregando agendamentos...
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="bg-[#F2EAD9] border-2 border-[#0F0F12]/20 p-8 text-center text-[#0F0F12] space-y-2 shadow-sm">
                    <AlertCircle size={28} className="mx-auto text-[#5E308A]" />
                    <h4 className="font-black text-sm uppercase tracking-wide text-[#0F0F12]">
                      Nenhum agendamento encontrado
                    </h4>
                    <p className="text-xs text-[#0F0F12]/80 font-medium">
                      Não localizamos agendamentos pendentes ou confirmados para este contato.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appt) => {
                      const isCancelled = appt.status === 'CANCELLED';
                      const canModify = canModifyAppointment(appt.startTime);
                      const hoursLeft = getHoursUntilAppointment(appt.startTime);

                      return (
                        <motion.div
                          key={appt.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-5 md:p-6 bg-[#F2EAD9] border-2 border-[#F2EAD9]/80 text-[#0F0F12] shadow-md space-y-4 transition-all"
                        >
                          {/* Top Card Line: Title & Status */}
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                            <div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#5E308A] block">
                                SERVIÇO ESCOLHIDO
                              </span>
                              <h4 className="font-black text-base md:text-lg text-[#0F0F12] uppercase tracking-wide">
                                {appt.service?.name || 'Serviço HypeCut'}
                              </h4>
                              <p className="text-xs text-[#0F0F12]/80 font-bold uppercase mt-0.5">
                                Profissional: <span className="text-[#0F0F12]">{appt.professional?.name || 'Qualquer Profissional'}</span>
                              </p>
                            </div>

                            <div className="self-start">
                              <span
                                className={`text-[10px] font-black px-3 py-1 uppercase tracking-wider inline-block shadow-sm ${
                                  appt.status === 'CONFIRMED'
                                    ? 'bg-emerald-600 text-white'
                                    : appt.status === 'CANCELLED'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-amber-600 text-white'
                                }`}
                              >
                                {appt.status === 'CONFIRMED' ? 'Confirmado' : appt.status === 'CANCELLED' ? 'Cancelado' : 'Pendente'}
                              </span>
                            </div>
                          </div>

                          {/* Date & Time Chips */}
                          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#0F0F12]/15">
                            <div className="flex items-center gap-2 bg-white/70 px-3 py-2 border border-[#0F0F12]/15 text-xs font-black text-[#0F0F12]">
                              <CalendarIcon size={15} className="text-[#5E308A]" />
                              <span>{new Date(appt.startTime).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/70 px-3 py-2 border border-[#0F0F12]/15 text-xs font-black text-[#0F0F12]">
                              <Clock size={15} className="text-[#5E308A]" />
                              <span>
                                {new Date(appt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} hs
                              </span>
                            </div>
                            <div className="ml-auto text-xs font-black text-[#5E308A] uppercase">
                              {appt.service?.category === 'tattoo' || (typeof appt.service?.name === 'string' && appt.service.name.toLowerCase().includes('tatuag'))
                                ? 'Sob consulta'
                                : typeof appt.service?.price === 'number'
                                ? `R$ ${appt.service.price.toFixed(2).replace('.', ',')}`
                                : appt.service?.price || 'R$ 0,00'}
                            </div>
                          </div>

                          {/* 15 MIN TOLERANCE INFO */}
                          <div className="flex items-center gap-2 text-[11px] font-bold text-[#0F0F12]/80 bg-black/5 px-3 py-1.5 border border-[#0F0F12]/10">
                            <Clock size={13} className="text-[#5E308A]" />
                            <span>Tolerância de chegada no horário: <strong>15 minutos</strong></span>
                          </div>

                          {/* Actions (Reagendar & Cancelar) or Lock Alert */}
                          {!isCancelled && (
                            <div className="pt-2 border-t border-[#0F0F12]/15">
                              {canModify ? (
                                <div className="space-y-2">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <motion.button
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.99 }}
                                      onClick={() => handleOpenReschedule(appt)}
                                      className="w-full py-3 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md text-center"
                                    >
                                      Reagendar Horário
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.99 }}
                                      onClick={() => {
                                        setSelectedAppt(appt);
                                        setMode('cancel');
                                      }}
                                      className="w-full py-3 bg-[#0F0F12] hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md text-center"
                                    >
                                      Cancelar
                                    </motion.button>
                                  </div>
                                  <span className="text-[10px] text-[#0F0F12]/70 font-semibold block text-center">
                                    Alterações gratuitas permitidas até 5 horas antes do atendimento.
                                  </span>
                                </div>
                              ) : (
                                <div className="p-3.5 bg-amber-500/15 border-2 border-amber-600/40 text-[#0F0F12] space-y-2">
                                  <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wide text-amber-900">
                                    <AlertCircle size={16} className="text-amber-800 shrink-0" />
                                    <span>
                                      {hoursLeft < 0
                                        ? 'Horário já finalizado'
                                        : 'Prazo de alteração encerrado (menos de 5h)'}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#0F0F12]/90 font-medium leading-relaxed">
                                    {hoursLeft < 0
                                      ? 'Este agendamento já ocorreu e não pode mais ser alterado pelo painel.'
                                      : 'Faltam menos de 5 horas para o seu corte. Por política da barbearia (sujeito a 50% de taxa de no-show em caso de falta sem aviso prévio), entre em contato com nossa equipe pelo WhatsApp para avaliar o caso.'}
                                  </p>
                                  {hoursLeft >= 0 && (
                                    <a
                                      href={`https://wa.me/5547999595843?text=${encodeURIComponent(
                                        `Olá! Gostaria de falar sobre o meu agendamento de ${appt.service?.name} marcado para o dia ${new Date(
                                          appt.startTime
                                        ).toLocaleDateString('pt-BR')} às ${new Date(appt.startTime).toLocaleTimeString('pt-BR', {
                                          hour: '2-digit',
                                          minute: '2-digit',
                                        })}hs.`
                                      )}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-black text-[11px] uppercase tracking-wider shadow-sm transition-all mt-1"
                                    >
                                      <MessageCircle size={14} className="fill-black text-black" />
                                      <span>Falar no WhatsApp da HypeCut</span>
                                    </a>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* RESCHEDULE MODE */}
            {mode === 'reschedule' && selectedAppt && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#F2EAD9] border-2 border-[#0F0F12]/20 p-6 text-[#0F0F12] space-y-6 shadow-md"
              >
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#5E308A] block">
                    ALTERAR AGENDAMENTO
                  </span>
                  <h3 className="font-black text-lg uppercase text-[#0F0F12]">
                    {selectedAppt.service?.name}
                  </h3>
                  <p className="text-xs text-[#0F0F12]/80 font-bold uppercase mt-0.5">
                    Profissional: {selectedAppt.professional?.name || 'Qualquer Profissional'}
                  </p>
                </div>

                {/* Reschedule notice */}
                <div className="p-3.5 bg-[#5E308A]/10 border border-[#5E308A]/30 text-xs font-semibold text-[#0F0F12] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#5E308A] font-black uppercase">
                    <Clock size={14} />
                    <span>Lembrete de Políticas:</span>
                  </div>
                  <p className="text-[11px] text-[#0F0F12]/85">
                    O novo horário escolhido terá tolerância máxima de 15 minutos. Reagendamentos são permitidos com até 5h de antecedência.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase text-[#0F0F12] tracking-wider">
                    1. Selecione a Nova Data:
                  </label>
                  <input
                    type="date"
                    value={rescheduleDateStr}
                    onChange={(e) => {
                      setRescheduleDateStr(e.target.value);
                      loadSlots(e.target.value, selectedAppt.professionalId, selectedAppt.service?.durationMin || 30);
                    }}
                    className="w-full h-12 px-4 bg-white border-2 border-[#0F0F12]/20 text-[#0F0F12] text-xs font-bold focus:border-[#5E308A] outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-black uppercase text-[#0F0F12] tracking-wider">
                    2. Escolha o Novo Horário:
                  </label>
                  {rescheduleLoading ? (
                    <div className="py-8 text-center text-xs text-[#0F0F12]/70 font-bold uppercase tracking-wider">
                      Consultando horários disponíveis...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#0F0F12]/70 bg-white p-4 border border-[#0F0F12]/20 font-bold">
                      Nenhum horário livre nesta data. Por favor, escolha outro dia acima.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {availableSlots.map((slot) => (
                        <motion.button
                          whileHover={{ scale: slot.available ? 1.03 : 1 }}
                          whileTap={{ scale: slot.available ? 0.97 : 1 }}
                          key={slot.time}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-3 px-2 border-2 text-xs font-black transition-all cursor-pointer ${
                            !slot.available
                              ? 'bg-neutral-200 border-neutral-300 text-neutral-400 line-through cursor-not-allowed'
                              : selectedSlot?.time === slot.time
                              ? 'bg-[#5E308A] border-[#5E308A] text-[#F2EAD9] shadow-md'
                              : 'bg-white border-[#0F0F12]/20 text-[#0F0F12] hover:border-[#5E308A]'
                          }`}
                        >
                          {slot.time}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#0F0F12]/15">
                  <button
                    onClick={() => setMode('list')}
                    className="h-12 bg-white border-2 border-[#0F0F12]/20 text-[#0F0F12] font-black text-xs uppercase tracking-widest transition-all cursor-pointer hover:bg-neutral-100"
                  >
                    Voltar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleConfirmReschedule}
                    disabled={!selectedSlot || rescheduleLoading}
                    className="h-12 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    {rescheduleLoading ? 'Salvando...' : 'Confirmar Novo Horário'}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* CANCEL MODE */}
            {mode === 'cancel' && selectedAppt && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-[#F2EAD9] border-2 border-[#0F0F12]/20 p-6 text-[#0F0F12] space-y-6 shadow-md"
              >
                <div className="p-4 bg-red-500/10 border-2 border-red-500/30 text-red-800 space-y-2">
                  <h4 className="font-black text-sm uppercase tracking-wide">
                    Confirmação de Cancelamento
                  </h4>
                  <p className="text-xs font-medium leading-relaxed">
                    Tem certeza de que deseja cancelar o agendamento de <strong>{selectedAppt.service?.name}</strong> marcado para o dia{' '}
                    <strong>{new Date(selectedAppt.startTime).toLocaleDateString('pt-BR')}</strong> às{' '}
                    <strong>{new Date(selectedAppt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} hs</strong>?
                  </p>
                </div>

                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-[11px] text-[#0F0F12]/90 space-y-1 font-semibold">
                  <div className="flex items-center gap-1.5 text-amber-900 font-black uppercase">
                    <AlertCircle size={14} />
                    <span>Atenção à Política de Cancelamento:</span>
                  </div>
                  <p>
                    Cancelamentos realizados com mais de 5 horas de antecedência são 100% isentos de custos. Faltas sem aviso prévio estão sujeitas à cobrança de 50% na próxima visita.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black uppercase text-[#0F0F12] tracking-wider">
                    Motivo do Cancelamento (opcional):
                  </label>
                  <input
                    type="text"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Ex: Imprevisto no trabalho, mudança de planos..."
                    className="w-full h-12 px-4 bg-white border-2 border-[#0F0F12]/20 text-[#0F0F12] placeholder-[#0F0F12]/50 text-xs font-semibold focus:border-[#5E308A] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setMode('list')}
                    className="h-12 bg-white border-2 border-[#0F0F12]/20 text-[#0F0F12] font-black text-xs uppercase tracking-widest transition-all cursor-pointer hover:bg-neutral-100"
                  >
                    Voltar
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleConfirmCancel}
                    disabled={cancelLoading}
                    className="h-12 bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {cancelLoading ? 'Cancelando...' : 'Sim, Cancelar'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
