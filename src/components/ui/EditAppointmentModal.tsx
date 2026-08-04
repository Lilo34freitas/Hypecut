import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { updateFullAppointment, fetchServices, fetchProfessionals } from '../../lib/apiHandlers';

export interface EditAppointmentModalProps {
  isOpen: boolean;
  appointment: any;
  onClose: () => void;
  onSaveSuccess: () => void;
}

export const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  appointment,
  onClose,
  onSaveSuccess,
}) => {
  const [services, setServices] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);

  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [clientNotes, setClientNotes] = useState<string>('');
  const [serviceId, setServiceId] = useState<string>('');
  const [professionalId, setProfessionalId] = useState<string>('');

  const [dateStr, setDateStr] = useState<string>('');
  const [timeStr, setTimeStr] = useState<string>('');
  const [status, setStatus] = useState<string>('CONFIRMED');

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && appointment) {
      loadOptions();
      setClientName(appointment.clientName || '');
      setClientPhone(appointment.clientPhone || '');
      setClientNotes(appointment.clientNotes || '');
      setServiceId(appointment.serviceId || '');
      setProfessionalId(appointment.professionalId || '');
      setStatus(appointment.status || 'CONFIRMED');

      if (appointment.startTime) {
        const d = new Date(appointment.startTime);
        setDateStr(d.toISOString().split('T')[0]);
        setTimeStr(
          d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false })
        );
      }
    }
  }, [isOpen, appointment]);

  const loadOptions = async () => {
    const [s, p] = await Promise.all([fetchServices(), fetchProfessionals()]);
    setServices(s);
    setProfessionals(p);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment || !dateStr || !timeStr) return;

    setLoading(true);
    try {
      const selectedSrv = services.find((srv) => srv.id === serviceId);
      const durationMin = selectedSrv ? selectedSrv.durationMin : 30;

      const startTimeIso = new Date(`${dateStr}T${timeStr}:00`).toISOString();

      await updateFullAppointment({
        id: appointment.id,
        clientName,
        clientPhone,
        clientNotes,
        serviceId,
        professionalId,
        startTime: startTimeIso,
        durationMin,
        status,
      });

      onSaveSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

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
        className="relative w-full max-w-xl bg-[#0B0908] border-2 border-[#5E308A] rounded-none shadow-2xl z-10 overflow-hidden text-[#F2EAD9]"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-black border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-[#F2EAD9]">
              EDITAR AGENDAMENTO <span className="text-[#5E308A]">EQUIPE</span>
            </h3>
            <p className="text-[11px] text-white/60 font-bold uppercase">
              Alterar dados, horário, barbeiro ou serviço
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-[#5E308A] text-white transition-colors border border-white/20"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-[#F2EAD9] block mb-1">
                CLIENTE
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full py-2.5 px-3 bg-black border border-white/20 text-white text-xs font-semibold rounded-none outline-none focus:border-[#5E308A]"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-[#F2EAD9] block mb-1">
                WHATSAPP / TELEFONE
              </label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full py-2.5 px-3 bg-black border border-white/20 text-white text-xs font-semibold rounded-none outline-none focus:border-[#5E308A]"
              />
            </div>
          </div>

          {/* Service & Professional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-[#5E308A] block mb-1">
                SERVIÇO
              </label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full py-2.5 px-3 bg-black border border-white/20 text-white text-xs font-semibold rounded-none outline-none focus:border-[#5E308A]"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.name} (R$ {srv.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-black uppercase text-[#5E308A] block mb-1">
                PROFISSIONAL ATRIBUÍDO
              </label>
              <select
                value={professionalId}
                onChange={(e) => setProfessionalId(e.target.value)}
                className="w-full py-2.5 px-3 bg-black border border-white/20 text-white text-xs font-semibold rounded-none outline-none focus:border-[#5E308A]"
              >
                {professionals.map((pro) => (
                  <option key={pro.id} value={pro.id}>
                    {pro.name} ({pro.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-[#F2EAD9] block mb-1">
                DATA
              </label>
              <input
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full py-2.5 px-3 bg-black border border-white/20 text-white text-xs font-black rounded-none outline-none focus:border-[#5E308A]"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-[#F2EAD9] block mb-1">
                HORÁRIO (HH:MM)
              </label>
              <input
                type="time"
                required
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="w-full py-2.5 px-3 bg-black border border-white/20 text-white text-xs font-black rounded-none outline-none focus:border-[#5E308A]"
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-[#F2EAD9] block mb-1">
                STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full py-2.5 px-3 bg-black border border-white/20 text-white text-xs font-semibold rounded-none outline-none focus:border-[#5E308A]"
              >
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-black uppercase text-[#F2EAD9] block mb-1">
              OBSERVAÇÕES
            </label>
            <textarea
              rows={2}
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              className="w-full py-2 px-3 bg-black border border-white/20 text-white text-xs font-medium rounded-none outline-none resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="Btn-purple w-full font-black text-xs uppercase tracking-widest py-3"
            >
              <span>{loading ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES ›'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
