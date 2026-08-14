import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar as CalendarIcon,
  ArrowRight,
  Scissors,
  Sparkles,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import {
  fetchServices,
  fetchProfessionals,
  fetchAvailability,
  createAppointment,
} from '../../lib/apiHandlers';
import type { TimeSlot } from '../../lib/bookingService';
import { useAuth } from '../../context/AuthContext';

const isTattooArtist = (pro: any) => {
  if (!pro) return false;
  const name = (pro.name || '').toUpperCase();
  const role = (pro.role || '').toLowerCase();
  const specialties = (pro.specialties || '').toLowerCase();
  return (
    name === 'BRUNO' ||
    name === 'MATHEUS' ||
    role.includes('tatuad') ||
    role.includes('tattoo') ||
    specialties.includes('tatuag')
  );
};

const isTattooService = (service: any) => {
  if (!service) return false;
  const category = (service.category || '').toLowerCase();
  const name = (service.name || '').toLowerCase();
  return (
    category === 'tattoo' ||
    name.includes('tattoo') ||
    name.includes('tatuag')
  );
};

const formatServicePrice = (srv: any) => {
  if (!srv) return '';
  if (isTattooService(srv)) {
    return 'Sob consulta';
  }
  if (typeof srv.price === 'string') {
    if (srv.price.toLowerCase().includes('consulta') || srv.price.toLowerCase().includes('sob')) {
      return srv.price;
    }
    return srv.price.startsWith('R$') ? srv.price : `R$ ${srv.price}`;
  }
  if (typeof srv.price === 'number') {
    if (srv.price <= 0) return 'Sob consulta';
    return `R$ ${srv.price.toFixed(2).replace('.', ',')}`;
  }
  return 'Sob consulta';
};

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
  const { user, isAuthenticated, loginWithGoogle, registerUser } = useAuth();

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

  // Auth / Form State for non-logged in users in Step 4
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [clientNotes, setClientNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);

  // Upcoming 14 Days Array & Date Scroll Ref
  const dateContainerRef = useRef<HTMLDivElement>(null);
  const [upcomingDates, setUpcomingDates] = useState<{ dateStr: string; label: string; dayName: string; isSunday: boolean }[]>([]);

  const scrollDatesLeft = () => {
    if (dateContainerRef.current) {
      dateContainerRef.current.scrollBy({ left: -220, behavior: 'smooth' });
    }
  };

  const scrollDatesRight = () => {
    if (dateContainerRef.current) {
      dateContainerRef.current.scrollBy({ left: 220, behavior: 'smooth' });
    }
  };

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
      const firstValid = dates.find((d) => !d.isSunday) || dates[0];
      setSelectedDateStr(firstValid.dateStr);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadData();
    } else {
      // Reset state when closed
      setStep(1);
      setSelectedService(null);
      setSelectedProfessional(null);
      setSelectedTimeSlot(null);
      setErrorMsg('');
      setCreatedAppointment(null);
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [srvs, pros] = await Promise.all([fetchServices(), fetchProfessionals()]);
      setServices(srvs);
      setProfessionals(pros);

      if (initialServiceId) {
        const found = srvs.find((s: any) => s.id === initialServiceId || s.name === initialServiceId);
        if (found) {
          setSelectedService(found);
          setStep(2);
        }
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

  const isTattoo = isTattooService(selectedService);

  const filteredProfessionals = useMemo(() => {
    if (!selectedService) return professionals;
    if (isTattoo) {
      // Tatuagem -> apenas os tatuadores
      return professionals.filter(isTattooArtist);
    } else {
      // Masculino, Feminino, Combos -> todos os profissionais MENOS os tatuadores
      return professionals.filter((pro) => !isTattooArtist(pro));
    }
  }, [professionals, selectedService, isTattoo]);

  const handleSelectService = (srv: any) => {
    setSelectedService(srv);
    // If selected pro is incompatible with new service category, reset selection
    if (selectedProfessional) {
      const srvIsTattoo = isTattooService(srv);
      const proIsTattoo = isTattooArtist(selectedProfessional);
      if (srvIsTattoo !== proIsTattoo) {
        setSelectedProfessional(null);
      }
    }
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

  // Final submission of the appointment
  const executeBooking = async (clientName: string, clientPhone: string) => {
    if (!selectedTimeSlot || !selectedService) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const defaultFallbackProId = isTattoo ? 'pro-2' : 'pro-1';
      const proId = selectedProfessional
        ? selectedProfessional.id
        : (filteredProfessionals[0]?.id || defaultFallbackProId);

      const newAppt = await createAppointment({
        serviceId: selectedService.id,
        professionalId: proId,
        clientName,
        clientPhone,
        clientNotes,
        startTime: selectedTimeSlot.startTime,
        durationMin: selectedService.durationMin || 30,
      });

      setCreatedAppointment(newAppt);
      setStep(5);
    } catch (err) {
      console.error(err);
      setErrorMsg('Ocorreu um erro ao realizar o agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4 Handlers
  const handleLoggedInSubmit = async () => {
    if (!user) return;
    const fullName = `${user.name} ${user.surname || ''}`.trim();
    await executeBooking(fullName, user.phone);
  };

  const handleGoogleAuthBooking = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const loggedUser = await loginWithGoogle();
      const fullName = `${loggedUser.name} ${loggedUser.surname || ''}`.trim();
      await executeBooking(fullName, loggedUser.phone);
    } catch (e) {
      setErrorMsg('Falha ao autenticar com o Google.');
      setLoading(false);
    }
  };

  const handleLocalRegisterBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regSurname || !regEmail || !regPhone || !regPassword) {
      setErrorMsg('Por favor, preencha todos os campos obrigatórios para criar sua conta.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const registered = await registerUser({
        name: regName,
        surname: regSurname,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
      });
      const fullName = `${registered.name} ${registered.surname}`.trim();
      await executeBooking(fullName, registered.phone);
    } catch (e) {
      setErrorMsg('Erro ao cadastrar conta.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredServices = services.filter((s) => {
    if (categoryFilter === 'todos') return true;
    return s.category === categoryFilter;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] overflow-hidden">
        {/* Dark Backdrop with Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Side Drawer Panel (E-commerce Style) */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="fixed inset-y-0 right-0 w-full md:w-[70vw] lg:w-[60vw] xl:w-[52vw] max-w-4xl bg-[#0F0F12] border-l border-[#F2EAD9]/15 shadow-2xl z-[10000] flex flex-col text-[#F2EAD9] h-full max-h-screen"
        >
          {/* Header Bar */}
          <div className="p-5 md:p-6 border-b border-[#F2EAD9]/10 flex items-center justify-between bg-[#141418] shrink-0">
            <div className="flex items-center gap-3">
              {step > 1 && step < 5 && (
                <button
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="p-2 rounded-none hover:bg-white/10 text-[#F2EAD9] transition-colors cursor-pointer"
                  title="Voltar"
                >
                  <ChevronLeft size={22} />
                </button>
              )}
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#5E308A]">
                  AGENDAMENTO ONLINE
                </span>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#F2EAD9]">
                  {step === 1 && '1. Escolha o Serviço'}
                  {step === 2 && '2. Escolha o Profissional'}
                  {step === 3 && '3. Data e Horário'}
                  {step === 4 && '4. Sua Conta & Confirmação'}
                  {step === 5 && 'Agendamento Concluído!'}
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

          {/* Global Story Continuous Progress Bar */}
          <div className="w-full h-[3px] bg-white/10 rounded-none overflow-hidden relative shrink-0">
            <motion.div
              initial={false}
              animate={{
                width: step === 1 ? '15%' : step === 2 ? '45%' : step === 3 ? '78%' : '100%',
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="h-full bg-[#5E308A] shadow-[0_0_12px_rgba(94,48,138,0.8)]"
            />
          </div>

          {/* Stepper Bar with Continuous Connecting Lines & Progressive Purple Words */}
          <div className="bg-[#18181B] border-b border-[#F2EAD9]/10 px-6 py-4 flex items-center justify-between text-sm sm:text-base font-black uppercase tracking-wider shrink-0 select-none">
            {/* Step 1: Serviço */}
            <motion.span
              animate={{
                scale: step === 1 ? 1.04 : 1,
                color: step >= 1 ? '#A855F7' : 'rgba(242, 234, 217, 0.4)',
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`transition-all cursor-pointer ${
                step >= 1 ? 'font-black drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]' : 'font-black'
              }`}
              onClick={() => step > 1 && setStep(1)}
            >
              Serviço
            </motion.span>

            {/* Continuous Line 1 -> 2 */}
            <div className="flex-1 max-w-[42px] sm:max-w-[64px] md:max-w-[90px] h-[3px] bg-white/15 rounded-none overflow-hidden relative mx-2 sm:mx-3">
              <div
                className={`absolute inset-0 bg-[#5E308A] transition-transform duration-500 ease-in-out origin-left ${
                  step >= 2 ? 'scale-x-100 shadow-[0_0_8px_rgba(94,48,138,0.8)]' : 'scale-x-0'
                }`}
              />
            </div>

            {/* Step 2: Profissional */}
            <motion.span
              animate={{
                scale: step === 2 ? 1.04 : 1,
                color: step >= 2 ? '#A855F7' : 'rgba(242, 234, 217, 0.4)',
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`transition-all cursor-pointer ${
                step >= 2 ? 'font-black drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]' : 'font-black'
              }`}
              onClick={() => step > 2 && setStep(2)}
            >
              Profissional
            </motion.span>

            {/* Continuous Line 2 -> 3 */}
            <div className="flex-1 max-w-[42px] sm:max-w-[64px] md:max-w-[90px] h-[3px] bg-white/15 rounded-none overflow-hidden relative mx-2 sm:mx-3">
              <div
                className={`absolute inset-0 bg-[#5E308A] transition-transform duration-500 ease-in-out origin-left ${
                  step >= 3 ? 'scale-x-100 shadow-[0_0_8px_rgba(94,48,138,0.8)]' : 'scale-x-0'
                }`}
              />
            </div>

            {/* Step 3: Horário */}
            <motion.span
              animate={{
                scale: step === 3 ? 1.04 : 1,
                color: step >= 3 ? '#A855F7' : 'rgba(242, 234, 217, 0.4)',
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`transition-all cursor-pointer ${
                step >= 3 ? 'font-black drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]' : 'font-black'
              }`}
              onClick={() => step > 3 && setStep(3)}
            >
              Horário
            </motion.span>

            {/* Continuous Line 3 -> 4 */}
            <div className="flex-1 max-w-[42px] sm:max-w-[64px] md:max-w-[90px] h-[3px] bg-white/15 rounded-none overflow-hidden relative mx-2 sm:mx-3">
              <div
                className={`absolute inset-0 bg-[#5E308A] transition-transform duration-500 ease-in-out origin-left ${
                  step >= 4 ? 'scale-x-100 shadow-[0_0_8px_rgba(94,48,138,0.8)]' : 'scale-x-0'
                }`}
              />
            </div>

            {/* Step 4: Conta */}
            <motion.span
              animate={{
                scale: step === 4 ? 1.04 : 1,
                color: step >= 4 ? '#A855F7' : 'rgba(242, 234, 217, 0.4)',
              }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className={`transition-all ${
                step >= 4 ? 'font-black drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]' : 'font-black'
              }`}
            >
              Conta
            </motion.span>
          </div>

          {/* Main Scrollable Content */}
          <div
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            className="flex-1 overflow-y-auto min-h-0 p-6 sm:p-8 space-y-6 overscroll-contain"
          >
            {/* STEP TRANSITIONS WITH ANIMATEPRESENCE */}
            <AnimatePresence mode="wait">
              {/* STEP 1: SERVICE SELECTION */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="space-y-5"
                >
                  {/* Category Pills */}
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                    {['todos', 'masculino', 'feminino', 'combos', 'tattoo'].map((cat) => (
                      <motion.button
                        key={cat}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider rounded-none whitespace-nowrap transition-all cursor-pointer border-2 ${
                          categoryFilter === cat
                            ? 'bg-[#5E308A] text-[#F2EAD9] border-[#5E308A] shadow-[0_0_15px_rgba(94,48,138,0.4)]'
                            : 'bg-[#F2EAD9] text-[#0F0F12] border-[#F2EAD9] hover:bg-white hover:border-[#5E308A] shadow-sm'
                        }`}
                      >
                        {cat}
                      </motion.button>
                    ))}
                  </div>

                  {loading ? (
                    <div className="py-12 text-center text-[#F2EAD9]/60 text-sm uppercase tracking-widest animate-pulse font-bold">
                      Carregando serviços...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {filteredServices.map((srv) => (
                        <motion.div
                          key={srv.id}
                          whileHover={{ scale: 1.01, y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleSelectService(srv)}
                          className={`group p-5 sm:p-6 bg-[#F2EAD9] transition-all duration-300 cursor-pointer flex items-center justify-between border-2 ${
                            selectedService?.id === srv.id
                              ? 'border-[#5E308A] shadow-[0_0_25px_rgba(94,48,138,0.4)] ring-2 ring-[#5E308A]/30'
                              : 'border-[#F2EAD9]/80 hover:border-[#5E308A] shadow-md hover:shadow-xl'
                          }`}
                        >
                          <div className="space-y-2 pr-4 flex-1">
                            <div className="flex items-center gap-2.5">
                              <h4 className="font-black text-base sm:text-lg uppercase text-[#0F0F12] tracking-wide group-hover:text-[#5E308A] transition-colors">
                                {srv.name}
                              </h4>
                              {selectedService?.id === srv.id && (
                                <span className="text-[11px] font-black bg-[#5E308A] text-[#F2EAD9] px-2.5 py-0.5 uppercase tracking-wider">
                                  SELECIONADO
                                </span>
                              )}
                            </div>
                            <p className="text-xs sm:text-sm text-[#0F0F12]/80 font-medium leading-relaxed line-clamp-2">
                              {srv.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs font-black text-[#5E308A] pt-1">
                              <Clock size={15} className="text-[#5E308A]" />
                              <span>{srv.durationMin} min</span>
                            </div>
                          </div>

                          <div className="text-right shrink-0 pl-3">
                            <span className="block font-black text-xl sm:text-2xl text-[#0F0F12]">
                              {formatServicePrice(srv)}
                            </span>
                            <span className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-4 py-2 mt-2 transition-all ${
                              selectedService?.id === srv.id
                                ? 'bg-[#5E308A] text-[#F2EAD9]'
                                : 'bg-[#0F0F12] text-[#F2EAD9] group-hover:bg-[#5E308A]'
                            }`}>
                              <span>{selectedService?.id === srv.id ? 'Selecionado' : 'Selecionar'}</span>
                              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 2: PROFESSIONAL SELECTION */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="space-y-5"
                >
                  <p className="text-xs sm:text-sm text-[#F2EAD9]/90 font-black uppercase tracking-wider">
                    {isTattoo
                      ? 'Escolha o tatuador de sua preferência:'
                      : 'Escolha o profissional de sua preferência:'}
                  </p>

                  {/* Anyone option */}
                  <motion.div
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSelectProfessional(null)}
                    className={`p-6 sm:p-7 bg-[#F2EAD9] border-2 transition-all duration-300 cursor-pointer flex items-center justify-between group ${
                      selectedProfessional === null
                        ? 'border-[#5E308A] shadow-[0_0_30px_rgba(94,48,138,0.5)] ring-2 ring-[#5E308A]/40'
                        : 'border-[#F2EAD9]/80 hover:border-[#5E308A] shadow-md hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-center gap-5 sm:gap-6">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#5E308A] border-2 border-[#5E308A] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-md">
                        {isTattoo ? (
                          <Sparkles size={40} className="text-[#F2EAD9] group-hover:rotate-12 transition-transform duration-300" />
                        ) : (
                          <Scissors size={40} className="text-[#F2EAD9] group-hover:rotate-12 transition-transform duration-300" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h4 className="font-black text-xl sm:text-2xl uppercase text-[#0F0F12] tracking-wide group-hover:text-[#5E308A] transition-colors">
                            {isTattoo ? 'Qualquer Tatuador' : 'Qualquer Profissional'}
                          </h4>
                          {selectedProfessional === null && (
                            <span className="text-xs font-black bg-[#5E308A] text-[#F2EAD9] px-3 py-1 uppercase tracking-wider">
                              SELECIONADO
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-[#0F0F12]/80 font-semibold leading-relaxed">
                          {isTattoo
                            ? 'Primeiro tatuador com horário livre na agenda'
                            : 'Primeiro profissional com horário livre na agenda'}
                        </p>
                        <span className="inline-block mt-2 text-xs font-black uppercase tracking-widest text-[#F2EAD9] bg-[#5E308A] px-3.5 py-1 shadow-sm">
                          OPÇÃO MAIS RÁPIDA
                        </span>
                      </div>
                    </div>
                    <ChevronLeft size={28} className="rotate-180 text-[#5E308A] group-hover:translate-x-1.5 transition-transform shrink-0" />
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {filteredProfessionals.map((pro) => (
                      <motion.div
                        key={pro.id}
                        whileHover={{ scale: 1.015, y: -4 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleSelectProfessional(pro)}
                        className={`bg-[#F2EAD9] border-2 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group ${
                          selectedProfessional?.id === pro.id
                            ? 'border-[#5E308A] shadow-[0_0_30px_rgba(94,48,138,0.5)] ring-2 ring-[#5E308A]/40'
                            : 'border-[#F2EAD9]/80 hover:border-[#5E308A] shadow-md hover:shadow-2xl'
                        }`}
                      >
                        {/* Large Hero Portrait Photo */}
                        <div className="relative w-full h-64 sm:h-72 bg-[#18181B] overflow-hidden">
                          <img
                            src={pro.avatarUrl || '/imgs profissional agendamento/jonathan.png'}
                            alt={pro.name}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Selection indicator pill inside image header */}
                          {selectedProfessional?.id === pro.id && (
                            <div className="absolute top-3 right-3 bg-[#5E308A] text-[#F2EAD9] text-xs font-black px-3 py-1 uppercase tracking-wider shadow-lg">
                              SELECIONADO
                            </div>
                          )}
                        </div>

                        {/* Card Info */}
                        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1.5">
                            <h4 className="font-black text-xl sm:text-2xl uppercase text-[#0F0F12] leading-tight tracking-wide group-hover:text-[#5E308A] transition-colors">
                              {pro.name}
                            </h4>
                            <span className="inline-block text-xs font-black text-[#F2EAD9] uppercase tracking-wider bg-[#5E308A] px-3 py-1 shadow-sm">
                              {pro.role}
                            </span>
                            <p className="text-sm text-[#0F0F12]/90 pt-1 leading-relaxed font-semibold">
                              {pro.specialties}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#0F0F12]/10 flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-[#0F0F12]/70 group-hover:text-[#5E308A] transition-colors">
                              {selectedProfessional?.id === pro.id ? 'Selecionado' : 'Escolher este profissional'}
                            </span>
                            <ChevronRight size={18} className="text-[#5E308A] group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: DATE & TIME SLOT SELECTION */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="space-y-6"
                >
                  {/* Date Slider Header with Arrow Buttons */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-[#F2EAD9]">
                        Selecione o Dia:
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={scrollDatesLeft}
                          className="p-2 bg-[#F2EAD9] text-[#0F0F12] hover:bg-[#5E308A] hover:text-[#F2EAD9] transition-colors rounded-none shadow-sm cursor-pointer border border-[#F2EAD9]"
                          title="Voltar dias"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={scrollDatesRight}
                          className="p-2 bg-[#F2EAD9] text-[#0F0F12] hover:bg-[#5E308A] hover:text-[#F2EAD9] transition-colors rounded-none shadow-sm cursor-pointer border border-[#F2EAD9]"
                          title="Avançar dias"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    </div>

                    <div ref={dateContainerRef} className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
                      {upcomingDates.map((d) => (
                        <motion.button
                          key={d.dateStr}
                          disabled={d.isSunday}
                          whileHover={d.isSunday ? {} : { scale: 1.04, y: -1 }}
                          whileTap={d.isSunday ? {} : { scale: 0.96 }}
                          onClick={() => setSelectedDateStr(d.dateStr)}
                          className={`flex flex-col items-center justify-center min-w-[85px] sm:min-w-[95px] h-20 p-2.5 border-2 text-center transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                            selectedDateStr === d.dateStr
                              ? 'bg-[#5E308A] border-[#5E308A] text-[#F2EAD9] shadow-[0_0_15px_rgba(94,48,138,0.4)]'
                              : 'bg-[#F2EAD9] border-[#F2EAD9] text-[#0F0F12] hover:border-[#5E308A] hover:bg-white shadow-sm'
                          }`}
                        >
                          <span className="text-xs font-black uppercase tracking-wider">{d.dayName}</span>
                          <span className="text-base sm:text-lg font-black mt-0.5">{d.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Available Slots Grid */}
                  <div>
                    <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-[#F2EAD9] mb-3">
                      Horários Disponíveis:
                    </label>

                    {loadingSlots ? (
                      <div className="py-10 text-center text-sm text-[#F2EAD9]/60 uppercase tracking-widest animate-pulse font-bold">
                        Buscando horários disponíveis...
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <div className="py-10 text-center text-sm text-[#0F0F12] uppercase tracking-widest bg-[#F2EAD9] border-2 border-[#0F0F12]/15 p-5 font-bold">
                        Nenhum horário livre nesta data ou estabelecimento fechado.
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                        {availableSlots.map((slot) => (
                          <motion.button
                            key={slot.time}
                            disabled={!slot.available}
                            whileHover={!slot.available ? {} : { scale: 1.03 }}
                            whileTap={!slot.available ? {} : { scale: 0.97 }}
                            onClick={() => handleConfirmSlot(slot)}
                            className={`py-3.5 px-3 border-2 text-sm sm:text-base font-black tracking-wider transition-all cursor-pointer text-center ${
                              !slot.available
                                ? 'bg-red-500/10 border-red-500/20 text-red-400 line-through cursor-not-allowed'
                                : selectedTimeSlot?.time === slot.time
                                ? 'bg-[#5E308A] border-[#5E308A] text-[#F2EAD9] shadow-[0_0_15px_rgba(94,48,138,0.4)]'
                                : 'bg-[#F2EAD9] border-[#F2EAD9] text-[#0F0F12] hover:bg-white hover:border-[#5E308A] shadow-sm'
                            }`}
                          >
                            {slot.time}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: USER ACCOUNT & BOOKING CONFIRMATION */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="space-y-6"
                >
                  {/* Summary Card */}
                  <div className="bg-[#F2EAD9] border-2 border-[#5E308A]/40 p-6 space-y-3 shadow-lg">
                    <span className="text-xs sm:text-sm font-black text-[#5E308A] uppercase tracking-widest block">
                      RESUMO DO AGENDAMENTO
                    </span>
                    <div className="flex justify-between items-start pt-1 gap-4">
                      <div className="space-y-1">
                        <h4 className="font-black uppercase text-xl sm:text-2xl text-[#0F0F12]">
                          {selectedService?.name}
                        </h4>
                        <p className="text-sm sm:text-base text-[#0F0F12]/90 font-semibold">
                          Profissional: <strong className="text-[#5E308A] font-black">{selectedProfessional ? selectedProfessional.name : 'Qualquer Profissional'}</strong>
                        </p>
                      </div>
                      <span className="font-black text-[#0F0F12] text-2xl sm:text-3xl shrink-0">
                        {formatServicePrice(selectedService)}
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-black text-[#0F0F12] pt-3 border-t border-[#0F0F12]/15 flex items-center gap-2.5">
                      <CalendarIcon size={18} className="text-[#5E308A]" />
                      <span>
                        {selectedDateStr} às {selectedTimeSlot?.time} hs
                      </span>
                    </div>
                  </div>

                  {/* POLICY & RULES BOX */}
                  <div className="bg-[#18181B] border-2 border-[#5E308A]/60 p-4 sm:p-5 space-y-2 text-[#F2EAD9] shadow-xl">
                    <div className="flex items-center gap-2 text-[#C084FC] font-black uppercase text-xs sm:text-sm tracking-wider">
                      <AlertCircle size={16} className="shrink-0 text-[#C084FC]" />
                      <span>Políticas e Regras do Agendamento:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-[#F2EAD9]/85 font-medium list-disc list-inside leading-relaxed">
                      <li>
                        <strong className="text-[#F2EAD9]">Tolerância de Espera:</strong> Chegada com tolerância máxima de <strong className="text-[#C084FC]">15 minutos</strong>.
                      </li>
                      <li>
                        <strong className="text-[#F2EAD9]">Cancelamento & Reagendamento:</strong> Permitidos gratuitamente até <strong className="text-[#C084FC]">5 horas antes</strong>.
                      </li>
                      <li>
                        <strong className="text-[#F2EAD9]">Taxa de No-Show:</strong> Em caso de falta sem cancelamento prévio de 5h, será cobrado <strong className="text-[#C084FC]">50% do valor do corte</strong>.
                      </li>
                    </ul>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/30 text-red-300 text-sm font-bold">
                      {errorMsg}
                    </div>
                  )}

                  {/* IF LOGGED IN */}
                  {isAuthenticated && user ? (
                    <div className="space-y-5 pt-2">
                      <div className="p-5 bg-[#F2EAD9] border-2 border-[#5E308A] flex items-center justify-between shadow-md">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#5E308A] text-white flex items-center justify-center font-black text-lg uppercase shadow-md">
                            {user.name[0]}
                          </div>
                          <div>
                            <p className="text-sm sm:text-base font-black uppercase text-[#0F0F12]">
                              Logado como: {user.name} {user.surname}
                            </p>
                            <p className="text-xs sm:text-sm text-[#0F0F12]/80 font-bold">
                              {user.email} | {user.phone}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs bg-[#5E308A] text-[#F2EAD9] px-3 py-1 font-black uppercase shadow-sm">
                          Conta Ativa
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-black uppercase tracking-wider text-[#F2EAD9] mb-1.5">
                          Observações (opcional)
                        </label>
                        <textarea
                          value={clientNotes}
                          onChange={(e) => setClientNotes(e.target.value)}
                          placeholder="Ex: Preferência por corte com tesoura, toalha bem quente..."
                          rows={2}
                          className="w-full p-3.5 bg-[#F2EAD9] border-2 border-[#0F0F12]/20 text-[#0F0F12] placeholder-[#0F0F12]/50 text-sm font-semibold focus:border-[#5E308A] outline-none transition-colors"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleLoggedInSubmit}
                        disabled={loading}
                        className="w-full h-14 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-sm uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(94,48,138,0.4)] cursor-pointer mt-4"
                      >
                        {loading ? 'Confirmando Agendamento...' : 'CONFIRMAR AGENDAMENTO'}
                      </motion.button>
                    </div>
                  ) : (
                    /* IF NOT LOGGED IN -> ACCOUNT CREATION OR GOOGLE LOGIN */
                    <div className="space-y-5 pt-1">
                      <div className="text-center bg-[#F2EAD9] p-5 border-2 border-[#0F0F12]/15 shadow-sm space-y-1">
                        <h4 className="text-sm sm:text-base font-black uppercase text-[#0F0F12] tracking-wider">
                          Para finalizar o agendamento, acesse ou crie sua conta
                        </h4>
                        <p className="text-xs sm:text-sm text-[#0F0F12]/80 font-semibold">
                          Assim você poderá reagendar e consultar seus cortes a qualquer momento!
                        </p>
                      </div>

                      {/* Google Login Option */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={handleGoogleAuthBooking}
                        disabled={loading}
                        className="w-full h-14 bg-white text-black hover:bg-neutral-200 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-md cursor-pointer disabled:opacity-50 border-2 border-[#0F0F12]/20"
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
                        <span>Entrar com Google e Agendar</span>
                      </motion.button>

                      <div className="relative flex items-center justify-center my-3">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[#F2EAD9]/20" />
                        </div>
                        <span className="relative px-3.5 bg-[#0F0F12] text-xs uppercase tracking-widest text-[#F2EAD9]/80 font-black">
                          ou cadastre-se abaixo
                        </span>
                      </div>

                      {/* Local Register Form */}
                      <form onSubmit={handleLocalRegisterBooking} className="space-y-4 bg-[#F2EAD9] p-6 sm:p-7 border-2 border-[#0F0F12]/15 shadow-md">
                        <div className="grid grid-cols-2 gap-3.5">
                          <div>
                            <label className="block text-xs sm:text-sm font-black uppercase text-[#0F0F12] mb-1.5">
                              Nome *
                            </label>
                            <input
                              type="text"
                              value={regName}
                              onChange={(e) => setRegName(e.target.value)}
                              placeholder="Seu nome"
                              className="w-full h-12 px-3.5 bg-white border-2 border-[#0F0F12]/20 text-[#0F0F12] placeholder-[#0F0F12]/50 text-sm font-semibold focus:border-[#5E308A] outline-none transition-colors"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-black uppercase text-[#0F0F12] mb-1.5">
                              Sobrenome *
                            </label>
                            <input
                              type="text"
                              value={regSurname}
                              onChange={(e) => setRegSurname(e.target.value)}
                              placeholder="Sobrenome"
                              className="w-full h-12 px-3.5 bg-white border-2 border-[#0F0F12]/20 text-[#0F0F12] placeholder-[#0F0F12]/50 text-sm font-semibold focus:border-[#5E308A] outline-none transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-black uppercase text-[#0F0F12] mb-1.5">
                            E-mail *
                          </label>
                          <input
                            type="email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                            className="w-full h-12 px-3.5 bg-white border-2 border-[#0F0F12]/20 text-[#0F0F12] placeholder-[#0F0F12]/50 text-sm font-semibold focus:border-[#5E308A] outline-none transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-black uppercase text-[#0F0F12] mb-1.5">
                            Telefone (WhatsApp) *
                          </label>
                          <input
                            type="tel"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value)}
                            placeholder="(47) 99999-9999"
                            className="w-full h-12 px-3.5 bg-white border-2 border-[#0F0F12]/20 text-[#0F0F12] placeholder-[#0F0F12]/50 text-sm font-semibold focus:border-[#5E308A] outline-none transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-black uppercase text-[#0F0F12] mb-1.5">
                            Senha da Conta *
                          </label>
                          <input
                            type="password"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Crie uma senha"
                            className="w-full h-12 px-3.5 bg-white border-2 border-[#0F0F12]/20 text-[#0F0F12] placeholder-[#0F0F12]/50 text-sm font-semibold focus:border-[#5E308A] outline-none transition-colors"
                            required
                          />
                        </div>

                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          disabled={loading}
                          className="w-full h-14 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs sm:text-sm uppercase tracking-widest transition-all shadow-md cursor-pointer mt-3"
                        >
                          {loading ? 'Processando...' : 'CRIAR CONTA E FINALIZAR AGENDAMENTO'}
                        </motion.button>
                      </form>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 5: SUCCESS CONFIRMATION */}
              {step === 5 && createdAppointment && (() => {
                const isCreatedApptTattoo =
                  isTattooService(createdAppointment.service) ||
                  isTattooService(selectedService);
                const proName = createdAppointment.professional?.name || 'Tatuador';
                const whatsappMsg = `Olá ${proName}! Acabei de agendar uma sessão de Tatuagem pelo site para o dia ${selectedDateStr} às ${selectedTimeSlot?.time}hs (Cliente: ${createdAppointment.clientName}). Gostaria de enviar minhas referências e alinhar os detalhes e orçamento da arte.`;

                return (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="py-8 text-center space-y-6"
                  >
                    <div className="w-20 h-20 bg-[#5E308A] text-white rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(94,48,138,0.5)]">
                      <CheckCircle2 size={44} />
                    </div>

                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#F2EAD9]">
                        Agendamento Confirmado!
                      </h3>
                      <p className="text-xs sm:text-sm text-[#F2EAD9]/80 mt-1 max-w-sm mx-auto font-medium">
                        Seu horário foi reservado com sucesso na HypeCut. Enviamos a confirmação para a sua conta!
                      </p>
                    </div>

                    <div className="bg-[#18181B] border border-[#F2EAD9]/15 p-6 text-left space-y-2.5 text-sm shadow-lg">
                      <div className="flex justify-between border-b border-[#F2EAD9]/10 pb-2">
                        <span className="text-[#F2EAD9]/60 uppercase font-bold">Cliente</span>
                        <span className="font-black text-[#F2EAD9]">{createdAppointment.clientName}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#F2EAD9]/10 pb-2">
                        <span className="text-[#F2EAD9]/60 uppercase font-bold">Serviço</span>
                        <span className="font-black text-[#F2EAD9]">{createdAppointment.service?.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#F2EAD9]/10 pb-2">
                        <span className="text-[#F2EAD9]/60 uppercase font-bold">Profissional</span>
                        <span className="font-black text-[#F2EAD9]">{proName}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-[#F2EAD9]/60 uppercase font-bold">Data & Horário</span>
                        <span className="font-black text-[#C084FC]">
                          {selectedDateStr} às {selectedTimeSlot?.time} hs
                        </span>
                      </div>
                    </div>

                    {/* 15 MIN TOLERANCE & POLICY NOTICE */}
                    <div className="p-4 bg-[#5E308A]/15 border border-[#5E308A]/50 text-left space-y-1.5 text-xs text-[#F2EAD9]">
                      <div className="flex items-center gap-2 font-black uppercase text-[#C084FC]">
                        <Clock size={15} />
                        <span>Tolerância de Chegada: 15 minutos</span>
                      </div>
                      <p className="text-[#F2EAD9]/80 font-medium leading-relaxed">
                        Lembramos que o tempo de tolerância de espera é de até <strong>15 minutos</strong>. Caso precise remarcar ou cancelar, utilize o painel com até <strong>5 horas de antecedência</strong> para evitar a taxa de 50% por falta.
                      </p>
                    </div>

                    {/* DIRECT TATTOO ARTIST CONTACT ACTION */}
                    {isCreatedApptTattoo && (
                      <div className="p-6 bg-[#F2EAD9] border-2 border-[#5E308A] text-left space-y-3 shadow-2xl">
                        <h4 className="font-black text-sm sm:text-base uppercase tracking-wide text-[#0F0F12]">
                          Próximo Passo: Alinhamento da Arte com o Tatuador
                        </h4>
                        <p className="text-xs sm:text-sm text-[#0F0F12]/90 leading-relaxed font-semibold">
                          Como cada tatuagem é um projeto exclusivo e o valor final é sob consulta, clique abaixo para falar diretamente com o tatuador <strong>{proName}</strong> no WhatsApp, enviar suas referências e tirar dúvidas sobre a sua arte.
                        </p>
                        <a
                          href={`https://wa.me/5547999595843?text=${encodeURIComponent(whatsappMsg)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full h-14 bg-[#25D366] hover:bg-[#1EBE5D] text-black font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-lg mt-2 cursor-pointer"
                        >
                          <MessageCircle size={20} className="fill-black text-black" />
                          <span>FALAR COM {proName} NO WHATSAPP</span>
                        </a>
                      </div>
                    )}

                    <div className="pt-2 flex flex-col gap-3">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={onClose}
                        className="w-full h-12 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs uppercase tracking-widest transition-all shadow-md cursor-pointer"
                      >
                        CONCLUIR
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* Persistent Footer with Service Info & Navigation */}
          {step < 5 && (
            <div className="bg-[#18181B] border-t border-[#F2EAD9]/15 p-4 sm:p-5 flex items-center justify-between gap-4 shrink-0">
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#F2EAD9]/60 block">
                  SERVIÇO SELECIONADO:
                </span>
                <span className="font-black text-sm sm:text-base md:text-lg text-[#F2EAD9] truncate block">
                  {selectedService ? selectedService.name : 'Nenhum serviço selecionado'}
                </span>
                {selectedService && (
                  <span className="text-xs sm:text-sm font-black text-[#C084FC] block">
                    {formatServicePrice(selectedService)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {step > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep((s) => (s - 1) as any)}
                    className="h-11 sm:h-12 px-4 sm:px-5 bg-[#F2EAD9] text-[#0F0F12] hover:bg-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-[#F2EAD9]"
                  >
                    <ChevronLeft size={16} />
                    <span>Voltar</span>
                  </motion.button>
                )}

                {step === 2 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(3)}
                    className="h-11 sm:h-12 px-5 sm:px-7 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(94,48,138,0.4)] cursor-pointer"
                  >
                    <span>Avançar</span>
                    <ChevronRight size={16} />
                  </motion.button>
                )}

                {step === 3 && selectedTimeSlot && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(4)}
                    className="h-11 sm:h-12 px-5 sm:px-7 bg-[#5E308A] hover:bg-[#6C3DFF] text-[#F2EAD9] font-black text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(94,48,138,0.4)] cursor-pointer"
                  >
                    <span>Avançar</span>
                    <ChevronRight size={16} />
                  </motion.button>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
