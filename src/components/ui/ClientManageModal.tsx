import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  X,
} from 'lucide-react';
import {
  findAppointmentsByPhone,
  fetchAvailability,
  updateFullAppointment,
  updateAppointmentStatus,
} from '../../lib/apiHandlers';
import type { TimeSlot } from '../../lib/bookingService';

export interface ClientManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClientManageModal: React.FC<ClientManageModalProps> = ({
  isOpen,
  onClose,
}) => {
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
    }
  }, [isOpen]);

  const handleSearch = async (e: React.FormEvent) => {
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
    setSelectedAppt(appt);
    setMode('reschedule');
    setSelectedSlot(null);

    // Pick tomorrow or today's date
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

      setSuccessMessage('Agendamento remarcado com sucesso!');
      setMode('list');
      // Refresh list
      handleSearch(new Event('submit') as any);
    } catch (err) {
      console.error(err);
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleOpenCancel = (appt: any) => {
    setSelectedAppt(appt);
    setMode('cancel');
    setCancelReason('');
  };

  const handleConfirmCancel = async () => {
    if (!selectedAppt) return;

    setCancelLoading(true);
    try {
      await updateAppointmentStatus(selectedAppt.id, 'CANCELLED', cancelReason || 'Cancelado pelo cliente via site');
      setSuccessMessage('Agendamento cancelado com sucesso. Horário liberado na agenda.');
      setMode('list');
      // Refresh list
      handleSearch(new Event('submit') as any);
    } catch (err) {
      console.error(err);
    } finally {
      setCancelLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#0B0908] border-2 border-[#5E308A] rounded-none shadow-2xl z-10 overflow-hidden text-[#F2EAD9]"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-black border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-[#F2EAD9]">
              MEUS AGENDAMENTOS <span className="text-[#5E308A]">HYPECUT</span>
            </h3>
            <p className="text-[11px] text-white/60 font-bold uppercase">
              Reagende ou cancele seu horário diretamente
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-[#5E308A] text-white transition-colors border border-white/20"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {successMessage && (
            <div className="p-4 bg-green-950 border border-green-600 text-green-300 text-xs font-black uppercase flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* MODE 1: SEARCH & LIST */}
          {mode === 'list' && (
            <div className="space-y-6">
              {/* Phone Search Input */}
              <form onSubmit={handleSearch} className="space-y-2">
                <label className="text-xs font-black uppercase text-[#5E308A] block">
                  DIGITE SEU WHATSAPP / TELEFONE CADASTRADO
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="(47) 99999-9999"
                    value={phoneSearch}
                    onChange={(e) => setPhoneSearch(e.target.value)}
                    className="flex-1 py-3 px-4 bg-black border border-white/20 focus:border-[#5E308A] text-white text-sm font-semibold outline-none"
                  />
                  <button
                    type="submit"
                    disabled={loading || !phoneSearch}
                    className="Btn-purple px-6 font-black text-xs uppercase tracking-widest"
                  >
                    <span>{loading ? 'BUSCANDO...' : 'BUSCAR'}</span>
                  </button>
                </div>
              </form>

              {/* Results List */}
              {hasSearched && (
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-white/70">
                    AGENDAMENTOS ENCONTRADOS ({appointments.length}):
                  </h4>

                  {appointments.length === 0 ? (
                    <div className="p-6 border border-dashed border-white/20 text-center text-xs font-bold text-white/60 uppercase">
                      Nenhum agendamento ativo encontrado para este telefone.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.map((appt) => {
                        const dateFormatted = new Date(appt.startTime).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        });
                        const timeFormatted = new Date(appt.startTime).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <div
                            key={appt.id}
                            className="p-5 bg-black border border-white/15 space-y-3"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#5E308A]">
                                  {appt.service?.name}
                                </span>
                                <h5 className="font-black text-base uppercase text-[#F2EAD9]">
                                  Profissional: {appt.professional?.name}
                                </h5>
                                <p className="text-xs font-bold text-[#E0AAFF] mt-0.5">
                                  {dateFormatted} às {timeFormatted} hs
                                </p>
                              </div>

                              <span
                                className={`px-2.5 py-1 text-[10px] font-black uppercase border ${
                                  appt.status === 'CONFIRMED'
                                    ? 'bg-blue-950 text-blue-300 border-blue-600'
                                    : appt.status === 'COMPLETED'
                                    ? 'bg-green-950 text-green-300 border-green-600'
                                    : 'bg-red-950 text-red-300 border-red-600'
                                }`}
                              >
                                {appt.status}
                              </span>
                            </div>

                            {appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' && (
                              <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                                <button
                                  onClick={() => handleOpenReschedule(appt)}
                                  className="flex-1 py-2 px-3 bg-white/10 hover:bg-[#5E308A] text-white font-black text-xs uppercase tracking-wider transition-colors border border-white/20"
                                >
                                  REAGENDAR
                                </button>
                                <button
                                  onClick={() => handleOpenCancel(appt)}
                                  className="flex-1 py-2 px-3 bg-red-950/60 hover:bg-red-800 text-red-200 font-black text-xs uppercase tracking-wider transition-colors border border-red-700/40"
                                >
                                  CANCELAR
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* MODE 2: RESCHEDULE */}
          {mode === 'reschedule' && selectedAppt && (
            <div className="space-y-6">
              <button
                onClick={() => setMode('list')}
                className="text-xs font-bold text-white/60 hover:text-white uppercase"
              >
                ← Voltar para Meus Agendamentos
              </button>

              <div className="p-4 bg-[#5E308A]/15 border border-[#5E308A]">
                <span className="text-[10px] font-black uppercase text-[#E0AAFF]">REAGENDANDO:</span>
                <h4 className="font-black text-base text-[#F2EAD9] uppercase">
                  {selectedAppt.service?.name} com {selectedAppt.professional?.name}
                </h4>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-[#5E308A] block mb-2">
                  1. SELECIONE A NOVA DATA
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleDateStr}
                  onChange={(e) => {
                    setRescheduleDateStr(e.target.value);
                    loadSlots(e.target.value, selectedAppt.professionalId, selectedAppt.service?.durationMin || 30);
                  }}
                  className="w-full py-3 px-4 bg-black border border-white/20 text-white text-xs font-black rounded-none outline-none focus:border-[#5E308A]"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-[#5E308A] block mb-2">
                  2. SELECIONE O NOVO HORÁRIO LIVRE
                </label>
                {rescheduleLoading ? (
                  <div className="py-8 text-center text-xs font-bold text-white/60 uppercase">
                    Buscando novos horários...
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-6 p-4 border border-dashed border-white/20 text-center text-xs font-bold text-white/60 uppercase">
                    Sem horários livres nesta data. Tente outro dia.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-2 border text-xs font-black uppercase ${
                          !slot.available
                            ? 'opacity-30 line-through bg-black cursor-not-allowed border-white/5'
                            : selectedSlot?.time === slot.time
                            ? 'bg-[#5E308A] text-white border-[#5E308A]'
                            : 'bg-black text-[#F2EAD9] border-white/20 hover:border-[#5E308A]'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                disabled={!selectedSlot || rescheduleLoading}
                onClick={handleConfirmReschedule}
                className="Btn-purple w-full font-black text-xs uppercase tracking-widest py-3.5"
              >
                <span>CONFIRMAR NOVO HORÁRIO ›</span>
              </button>
            </div>
          )}

          {/* MODE 3: CANCEL */}
          {mode === 'cancel' && selectedAppt && (
            <div className="space-y-6">
              <button
                onClick={() => setMode('list')}
                className="text-xs font-bold text-white/60 hover:text-white uppercase"
              >
                ← Voltar para Meus Agendamentos
              </button>

              <div className="p-4 bg-red-950/40 border border-red-700/60 space-y-2">
                <span className="text-[10px] font-black uppercase text-red-400">
                  CONFIRMAÇÃO DE CANCELAMENTO
                </span>
                <h4 className="font-black text-base text-white uppercase">
                  {selectedAppt.service?.name} com {selectedAppt.professional?.name}
                </h4>
                <p className="text-xs text-white/70 font-bold">
                  Data: {new Date(selectedAppt.startTime).toLocaleDateString('pt-BR')} às{' '}
                  {new Date(selectedAppt.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} hs
                </p>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-[#F2EAD9] block mb-2">
                  MOTIVO DO CANCELAMENTO (OPCIONAL)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Imprevisto de trabalho, remarcação para próxima semana..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full py-3 px-4 bg-black border border-white/20 text-white text-xs font-medium outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider"
                >
                  VOLTAR
                </button>
                <button
                  type="button"
                  disabled={cancelLoading}
                  onClick={handleConfirmCancel}
                  className="w-full py-3.5 bg-red-700 hover:bg-red-600 text-white font-black text-xs uppercase tracking-widest"
                >
                  {cancelLoading ? 'CANCELANDO...' : 'CONFIRMAR CANCELAMENTO'}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
