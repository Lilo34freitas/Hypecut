import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Lock,
  RefreshCw,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { fetchAppointmentsForDate, updateAppointmentStatus } from '../lib/apiHandlers';

export const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<boolean>(false);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // Check stored auth token
  useEffect(() => {
    const session = localStorage.getItem('hypecut_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated, selectedDate]);

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

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointmentsForDate(selectedDate);
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      setAppointments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Compute Daily Metrics
  const totalCount = appointments.length;
  const confirmedCount = appointments.filter((a) => a.status === 'CONFIRMED').length;
  const completedCount = appointments.filter((a) => a.status === 'COMPLETED').length;
  const totalRevenue = appointments
    .filter((a) => a.status === 'CONFIRMED' || a.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.service?.price || 60), 0);

  const filteredAppointments = statusFilter === 'todos'
    ? appointments
    : appointments.filter((a) => a.status === statusFilter);

  // AUTH LOGIN SCREEN
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
              PAINEL ADMINISTRATIVO <span className="text-[#5E308A]">HYPECUT</span>
            </h1>
            <p className="text-xs text-white/60 font-bold uppercase">
              Área restrita de gestão de agendamentos
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
                  placeholder="Digite a senha de admin..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3.5 pl-11 pr-4 bg-white/5 border border-white/20 focus:border-[#5E308A] text-white text-sm rounded-none outline-none"
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
            ← Voltar para o site principal
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0908] text-[#F2EAD9]">
      {/* Top Admin Navbar */}
      <header className="p-4 sm:px-8 bg-black border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a href="/" className="text-[#F2EAD9] hover:text-[#5E308A] transition-colors">
            <ChevronLeft size={24} />
          </a>
          <div>
            <h1 className="text-lg font-black uppercase tracking-tight">
              PAINEL DE OPERAÇÃO & AGENDAMENTOS <span className="text-[#5E308A]">HYPECUT</span>
            </h1>
            <p className="text-[11px] text-white/60 font-bold uppercase">
              Visão Geral Diária da Barbearia & Estúdio Tattoo
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-red-900/40 text-xs font-bold uppercase tracking-wider border border-white/20 transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
        {/* Controls Bar: Date Filter & Refresh */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-black border border-white/10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Calendar className="text-[#5E308A]" size={20} />
            <label className="text-xs font-black uppercase text-[#F2EAD9] whitespace-nowrap">
              DATA SELECIONADA:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="py-2 px-3 bg-white/10 border border-white/20 text-white text-xs font-black rounded-none outline-none focus:border-[#5E308A]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={loadAppointments}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#5E308A] hover:bg-[#4A2370] text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Atualizar</span>
            </button>
          </div>
        </div>

        {/* Daily Metrics Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 bg-black border-2 border-white/10 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">
              TOTAL DE CLIENTES
            </span>
            <div className="text-2xl font-black text-[#F2EAD9]">{totalCount} AGENDAMENTOS</div>
          </div>

          <div className="p-5 bg-black border-2 border-blue-900/40 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">
              CONFIRMADOS
            </span>
            <div className="text-2xl font-black text-blue-400">{confirmedCount}</div>
          </div>

          <div className="p-5 bg-black border-2 border-green-900/40 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-green-400">
              CONCLUÍDOS
            </span>
            <div className="text-2xl font-black text-green-400">{completedCount}</div>
          </div>

          <div className="p-5 bg-black border-2 border-[#5E308A] space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#E0AAFF]">
              FATURAMENTO ESTIMADO
            </span>
            <div className="text-2xl font-black text-[#F2EAD9]">
              R$ {totalRevenue.toFixed(2).replace('.', ',')}
            </div>
          </div>
        </div>

        {/* Appointments Table Section */}
        <div className="bg-black border border-white/10 overflow-hidden">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-lg font-black uppercase text-[#F2EAD9]">
              TABELA DE AGENDAMENTOS DO DIA ({selectedDate.split('-').reverse().join('/')})
            </h2>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-white/5 p-1 border border-white/10">
              {['todos', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                    statusFilter === st
                      ? 'bg-[#5E308A] text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {st === 'todos' ? 'Todos' : st === 'CONFIRMED' ? 'Confirmados' : st === 'COMPLETED' ? 'Concluídos' : 'Cancelados'}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-xs font-bold text-white/60 uppercase tracking-widest">
                Carregando registros do banco de dados...
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="py-16 text-center text-xs font-bold text-white/60 uppercase tracking-widest">
                Nenhum agendamento encontrado para os filtros selecionados.
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-white/60 font-black uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Hora</th>
                    <th className="py-3.5 px-4">Cliente</th>
                    <th className="py-3.5 px-4">Telefone</th>
                    <th className="py-3.5 px-4">Serviço</th>
                    <th className="py-3.5 px-4">Profissional</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Ações Gerenciais</th>
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
                        <td className="py-4 px-4 font-black text-sm text-[#E0AAFF] whitespace-nowrap">
                          {timeLabel} hs
                        </td>
                        <td className="py-4 px-4 font-black text-sm text-[#F2EAD9]">
                          {appt.clientName}
                        </td>
                        <td className="py-4 px-4 font-bold text-white/80 whitespace-nowrap">
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
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border ${
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
                          {appt.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleStatusChange(appt.id, 'COMPLETED')}
                              className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white font-black text-[10px] uppercase tracking-wider cursor-pointer"
                            >
                              Concluir
                            </button>
                          )}
                          {appt.status !== 'CANCELLED' && (
                            <button
                              onClick={() => handleStatusChange(appt.id, 'CANCELLED')}
                              className="px-3 py-1.5 bg-red-800 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-wider cursor-pointer"
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
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
