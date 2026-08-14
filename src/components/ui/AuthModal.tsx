import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn, UserPlus, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle, loginWithCredentials, registerUser } = useAuth();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      setErrorMsg('Falha ao conectar com o Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setErrorMsg('Informe seu e-mail ou telefone.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithCredentials(emailOrPhone, loginPassword);
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      setErrorMsg('Erro ao realizar login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regSurname || !regEmail || !regPhone || !regPassword) {
      setErrorMsg('Preencha todos os campos para criar a conta.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      await registerUser({
        name: regName,
        surname: regSurname,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (e) {
      setErrorMsg('Erro ao cadastrar usuário.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="relative w-full max-w-md bg-[#0F0F12] border border-[#F2EAD9]/20 rounded-none shadow-2xl p-6 md:p-8 z-10 text-[#F2EAD9] max-h-[90vh] overflow-y-auto overscroll-contain"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F2EAD9]/10">
            <div>
              <h2 className="text-xl font-black uppercase tracking-wide text-[#F2EAD9]">
                Sua Conta <span className="text-[#5E308A]">HypeCut</span>
              </h2>
              <p className="text-xs text-[#F2EAD9]/60">Acesse ou crie sua conta para gerenciar agendamentos</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-none hover:bg-white/10 text-[#F2EAD9]/70 hover:text-[#F2EAD9] transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Google Login CTA */}
          <div className="mt-5">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full h-12 bg-white text-black hover:bg-neutral-200 font-bold text-xs uppercase tracking-wider rounded-none flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                />
              </svg>
              <span>Continuar com Google</span>
            </button>
          </div>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#F2EAD9]/10" />
            </div>
            <span className="relative px-3 bg-[#0F0F12] text-[10px] uppercase tracking-widest text-[#F2EAD9]/50 font-bold">
              ou use seus dados
            </span>
          </div>

          {/* Tabs Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#18181B] border border-[#F2EAD9]/15 mb-5">
            <button
              onClick={() => { setTab('login'); setErrorMsg(''); }}
              className={`h-9 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                tab === 'login' ? 'bg-[#5E308A] text-[#F2EAD9]' : 'text-[#F2EAD9]/60 hover:text-[#F2EAD9]'
              }`}
            >
              <LogIn size={14} />
              <span>Entrar</span>
            </button>
            <button
              onClick={() => { setTab('register'); setErrorMsg(''); }}
              className={`h-9 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                tab === 'register' ? 'bg-[#5E308A] text-[#F2EAD9]' : 'text-[#F2EAD9]/60 hover:text-[#F2EAD9]'
              }`}
            >
              <UserPlus size={14} />
              <span>Criar Conta</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Form Login */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#F2EAD9]/80 mb-1">
                  E-mail ou Telefone
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-[#F2EAD9]/40" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="seuemail@exemplo.com ou (47) 99999-9999"
                    className="w-full h-11 pl-10 pr-3 bg-[#18181B] border border-[#F2EAD9]/20 text-[#F2EAD9] text-xs focus:border-[#5E308A] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#F2EAD9]/80 mb-1">
                  Senha
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3.5 text-[#F2EAD9]/40" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Sua senha secreta"
                    className="w-full h-11 pl-10 pr-3 bg-[#18181B] border border-[#F2EAD9]/20 text-[#F2EAD9] text-xs focus:border-[#5E308A] outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer mt-2"
              >
                {loading ? 'Entrando...' : 'Entrar na Conta'}
              </button>
            </form>
          )}

          {/* Form Register */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EAD9]/80 mb-1">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="João"
                    className="w-full h-10 px-3 bg-[#18181B] border border-[#F2EAD9]/20 text-[#F2EAD9] text-xs focus:border-[#5E308A] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EAD9]/80 mb-1">
                    Sobrenome *
                  </label>
                  <input
                    type="text"
                    value={regSurname}
                    onChange={(e) => setRegSurname(e.target.value)}
                    placeholder="Silva"
                    className="w-full h-10 px-3 bg-[#18181B] border border-[#F2EAD9]/20 text-[#F2EAD9] text-xs focus:border-[#5E308A] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EAD9]/80 mb-1">
                  E-mail *
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-[#F2EAD9]/40" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="joao.silva@exemplo.com"
                    className="w-full h-10 pl-9 pr-3 bg-[#18181B] border border-[#F2EAD9]/20 text-[#F2EAD9] text-xs focus:border-[#5E308A] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EAD9]/80 mb-1">
                  Telefone (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-3 text-[#F2EAD9]/40" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="(47) 99999-9999"
                    className="w-full h-10 pl-9 pr-3 bg-[#18181B] border border-[#F2EAD9]/20 text-[#F2EAD9] text-xs focus:border-[#5E308A] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#F2EAD9]/80 mb-1">
                  Senha *
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-3 text-[#F2EAD9]/40" />
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Crie uma senha"
                    className="w-full h-10 pl-9 pr-3 bg-[#18181B] border border-[#F2EAD9]/20 text-[#F2EAD9] text-xs focus:border-[#5E308A] outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer mt-3"
              >
                {loading ? 'Cadastrando...' : 'Criar Minha Conta'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
