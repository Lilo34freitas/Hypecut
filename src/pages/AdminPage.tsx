import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Lock,
  RefreshCw,
  LogOut,
  ChevronLeft,
  Grid,
  List,
} from 'lucide-react';
import {
  fetchAppointmentsForDate,
  updateAppointmentStatus,
  fetchProfessionals,
  toLocalDateStr,
} from '../lib/apiHandlers';
import { StaffCalendarGrid } from '../components/ui/StaffCalendarGrid';
import { EditAppointmentModal } from '../components/ui/EditAppointmentModal';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<string>(
    toLocalDateStr(new Date()) || new Date().toISOString().split('T')[0]
  );
  const [showAllDates, setShowAllDates] = useState<boolean>(false);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // View Mode Switcher: 'grid' (Grade da Equipe) | 'table' (Tabela de Registros)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Edit Modal State
  const [editingAppt, setEditingAppt] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  // Cancel Reason Prompt Modal State
  const [cancellingApptId, setCancellingApptId] = useState<string | null>(null);
  const [cancelReasonInput, setCancelReasonInput] = useState<string>('');

  useEffect(() => {
    const session = localStorage.getItem('hypecut_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, selectedDate, showAllDates]);

  const loadData = async () => {
    setLoading(true);
    try {
      const queryDate = showAllDates ? 'all' : selectedDate;
      const [appts, pros] = await Promise.all([
        fetchAppointmentsForDate(queryDate),
        fetchProfessionals(),
      ]);
      setAppointments(appts);
      setProfessionals(pros);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin' || password === 'hypecut2026') {
      setIsAuthenticated(true);
      localStorage.setItem('hypecut_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('hypecut_admin_auth');
  };

  const handleStatusChange = async (id: string, newStatus: string, reason?: string) => {
    try {
      await updateAppointmentStatus(id, newStatus, reason);
      setAppointments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus, cancelReason: reason } : item))
      );
      setCancellingApptId(null);
      setCancelReasonInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (appt: any) => {
    setEditingAppt(appt);
    setIsEditModalOpen(true);
  };

  // Compute Advanced Metrics
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const cancelledCount = appointments.filter((a) => a.status === 'CANCELLED').length;

  const validAppointments = appointments.filter(
    (a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED'
  );
  const totalRevenue = validAppointments.reduce(
    (acc, curr) => acc + (curr.service?.price || 60),
    0
  );
  const averageTicket = validAppointments.length > 0 ? totalRevenue / validAppointments.length : 0;

  // Total daily slots available across 6 pros (approx 12 slots/pro = 72 slots)
  const totalCapacitySlots = (professionals.length || 6) * 12;
  const occupancyRate = Math.min(100, Math.round((validAppointments.length / totalCapacitySlots) * 100));

  const filteredAppointments = statusFilter === 'todos'
    ? appointments
    : appointments.filter((a) => a.status === statusFilter);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0908] flex items-center justify-center p-4 text-[#F2EAD9]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 bg-black border-2 border-[#5E308A] shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#5E308A] mx-auto flex items-center justify-center text-white font-black text-xl">
              H
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">
              PAINEL DA EQUIPE <span className="text-[#5E308A]">HYPECUT</span>
            </h1>
            <p className="text-xs text-white/60 font-bold uppercase">
              Área restrita para colaboradores & administração
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-black uppercase text-[#F2EAD9] block mb-1.5">
                SENHA DE ACESSO
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Digite a senha..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3.5 pl-11 pr-4 bg-white/5 border border-white/20 focus:border-[#5E308A] text-white text-sm outline-none"
                />
                <Lock size={18} className="absolute left-4 top-3.5 text-white/40" />
              </div>
              {authError && (
                <p className="text-xs font-bold text-red-400 mt-1.5">
                  Senha incorreta! Tente novamente.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="Btn-purple w-full font-black text-xs uppercase tracking-widest py-3.5"
            >
              <span>ACESSAR PAINEL ›</span>
            </button>
          </form>

          <a
            href="/"
            className="block text-center text-xs font-bold text-white/50 hover:text-white uppercase tracking-wider transition-colors pt-2"
          >
            ← Voltar para o site público
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0908] text-[#F2EAD9]">
      {/* Top Navbar */}
      <header className="p-4 sm:px-8 bg-black border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-[#F2EAD9] hover:text-[#5E308A] transition-colors">
            <ChevronLeft size={24} />
          </a>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight">
              PAINEL DA EQUIPE & GESTÃO <span className="text-[#5E308A]">HYPECUT</span>
            </h1>
            <p className="text-[11px] text-white/60 font-bold uppercase">
              Controle de Agenda, Edição & Métricas Operacionais
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-900/40 text-xs font-bold uppercase border border-white/20 transition-colors"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Controls Bar: Date Filter & View Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-black border border-white/10">
          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <Calendar className="text-[#5E308A]" size={20} />
            <label className="text-xs font-black uppercase text-[#F2EAD9]">
              DATA DA AGENDA:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setShowAllDates(false);
              }}
              className="py-2 px-3 bg-white/10 border border-white/20 text-white text-xs font-black outline-none focus:border-[#5E308A]"
            />
            <button
              onClick={() => setShowAllDates(!showAllDates)}
              className={`px-3 py-2 text-xs font-black uppercase border transition-all ${
                showAllDates
                  ? 'bg-[#5E308A] text-white border-[#9D4EDD]'
                  : 'bg-white/5 text-white/70 border-white/20 hover:bg-white/10'
              }`}
            >
              {showAllDates ? '★ EXIBINDO TODAS AS DATAS' : 'VER TODAS AS DATAS'}
            </button>
          </div>

          {/* View Switcher Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex bg-white/5 p-1 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase transition-colors ${
                  viewMode === 'grid' ? 'bg-[#5E308A] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <Grid size={14} />
                <span>Grade por Profissional</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase transition-colors ${
                  viewMode === 'table' ? 'bg-[#5E308A] text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                <List size={14} />
                <span>Tabela de Registros</span>
              </button>
            </div>

            <button
              onClick={loadData}
              className="p-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20"
              title="Atualizar dados"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Metrics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-5 bg-black border-2 border-white/10 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
              FATURAMENTO ESTIMADO
            </span>
            <div className="text-xl font-black text-[#F2EAD9]">
              R$ {totalRevenue.toFixed(2).replace('.', ',')}
            </div>
          </div>

          <div className="p-5 bg-black border-2 border-[#5E308A]/40 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E0AAFF]">
              TICKET MÉDIO
            </span>
            <div className="text-xl font-black text-[#E0AAFF]">
              R$ {averageTicket.toFixed(2).replace('.', ',')}
            </div>
          </div>

          <div className="p-5 bg-black border-2 border-blue-900/40 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              TAXA DE OCUPAÇÃO
            </span>
            <div className="text-xl font-black text-blue-400">{occupancyRate}%</div>
          </div>

          <div className="p-5 bg-black border-2 border-green-900/40 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
              CONCLUÍDOS
            </span>
            <div className="text-xl font-black text-green-400">{completedCount}</div>
          </div>

          <div className="p-5 bg-black border-2 border-red-900/40 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400">
              CANCELADOS
            </span>
            <div className="text-xl font-black text-red-400">{cancelledCount}</div>
          </div>
        </div>

        {/* VIEW 1: STAFF CALENDAR GRID */}
        {viewMode === 'grid' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black uppercase text-[#F2EAD9]">
                GRADE HORÁRIA DA EQUIPE ({selectedDate.split('-').reverse().join('/')})
              </h2>
              <span className="text-xs text-white/50 font-bold">
                Clique em qualquer agendamento para editar ou remarcar.
              </span>
            </div>

            <StaffCalendarGrid
              appointments={appointments}
              professionals={professionals}
              onSelectAppointment={handleOpenEdit}
            />
          </div>
        )}

        {/* VIEW 2: APPOINTMENTS TABLE */}
        {viewMode === 'table' && (
          <div className="bg-black border border-white/10 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-base font-black uppercase text-[#F2EAD9]">
                REGISTROS DE AGENDAMENTOS DO DIA
              </h2>

              <div className="flex items-center gap-1 bg-white/5 p-1 border border-white/10">
                {['todos', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 text-[10px] font-black uppercase ${
                      statusFilter === st ? 'bg-[#5E308A] text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {st === 'todos' ? 'Todos' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white/60 font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Hora</th>
                    <th className="py-3.5 px-4">Cliente</th>
                    <th className="py-3.5 px-4">Telefone</th>
                    <th className="py-3.5 px-4">Serviço</th>
                    <th className="py-3.5 px-4">Profissional</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredAppointments.map((appt) => {
                    const timeLabel = new Date(appt.startTime).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <tr key={appt.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4 font-black text-sm text-[#E0AAFF]">
                          {timeLabel} hs
                        </td>
                        <td className="py-4 px-4 font-black text-sm text-[#F2EAD9]">
                          {appt.clientName}
                        </td>
                        <td className="py-4 px-4 font-bold text-white/80">
                          <a
                            href={`https://wa.me/55${appt.clientPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#25D366] transition-colors underline"
                          >
                            {appt.clientPhone}
                          </a>
                        </td>
                        <td className="py-4 px-4 font-bold text-white/90">
                          {appt.service?.name || 'Serviço HypeCut'}
                        </td>
                        <td className="py-4 px-4 font-bold text-white/70">
                          {appt.professional?.name || 'Qualquer'}
                        </td>
                        <td className="py-4 px-4">
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
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleOpenEdit(appt)}
                            className="px-3 py-1.5 bg-white/10 hover:bg-[#5E308A] text-white font-black text-[10px] uppercase cursor-pointer"
                          >
                            Editar
                          </button>
                          {appt.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleStatusChange(appt.id, 'COMPLETED')}
                              className="px-3 py-1.5 bg-green-800 hover:bg-green-700 text-white font-black text-[10px] uppercase cursor-pointer"
                            >
                              Concluir
                            </button>
                          )}
                          {appt.status !== 'CANCELLED' && (
                            <button
                              onClick={() => setCancellingApptId(appt.id)}
                              className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white font-black text-[10px] uppercase cursor-pointer"
                            >
                              Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* EDIT MODAL */}
      <EditAppointmentModal
        isOpen={isEditModalOpen}
        appointment={editingAppt}
        onClose={() => setIsEditModalOpen(false)}
        onSaveSuccess={loadData}
      />

      {/* CANCEL REASON PROMPT MODAL */}
      {cancellingApptId && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-md p-6 bg-[#0B0908] border-2 border-red-700 space-y-4">
            <h3 className="text-base font-black uppercase text-red-400">
              MOTIVO DO CANCELAMENTO
            </h3>
            <textarea
              rows={2}
              placeholder="Digite a justificativa do cancelamento..."
              value={cancelReasonInput}
              onChange={(e) => setCancelReasonInput(e.target.value)}
              className="w-full py-2 px-3 bg-black border border-white/20 text-white text-xs outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setCancellingApptId(null)}
                className="w-full py-2.5 bg-white/10 text-white font-black text-xs uppercase"
              >
                VOLTAR
              </button>
              <button
                onClick={() => handleStatusChange(cancellingApptId, 'CANCELLED', cancelReasonInput)}
                className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white font-black text-xs uppercase"
              >
                CONFIRMAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
