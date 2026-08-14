import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { TattooPage } from './pages/TattooPage';
import { AdminPage } from './pages/AdminPage';
import { WhatsAppWidget } from './components/ui/WhatsAppWidget';
import { BookingWizard } from './components/ui/BookingWizard';
import { ClientManageModal } from './components/ui/ClientManageModal';
import { AuthModal } from './components/ui/AuthModal';
import { AuthProvider } from './context/AuthContext';

function ScrollToHashElement({ lenis }: { lenis: Lenis | null }) {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    try {
      if (hash) {
        const targetId = hash.replace('#', '');
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        window.scrollTo(0, 0);
        if (lenis) {
          try {
            lenis.scrollTo(0, { immediate: true });
          } catch {
            // fallback
          }
        }
      }
    } catch {
      window.scrollTo(0, 0);
    }
  }, [hash, pathname, lenis]);

  return null;
}

function MainApp() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [lenisRef, setLenisRef] = useState<Lenis | null>(null);

  const isAnyModalOpen = isBookingOpen || isManageOpen || isAuthOpen;

  // Lock site scroll when modal is open
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (lenisRef) lenisRef.stop();
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      if (lenisRef) lenisRef.start();
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAnyModalOpen, lenisRef]);

  useEffect(() => {
    const handleOpenBooking = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.serviceTitle || customEvent.detail?.serviceId) {
        setSelectedServiceId(customEvent.detail.serviceTitle || customEvent.detail.serviceId);
      } else {
        setSelectedServiceId(undefined);
      }
      setIsBookingOpen(true);
    };

    const handleOpenManage = () => setIsManageOpen(true);
    const handleOpenAuth = () => setIsAuthOpen(true);

    window.addEventListener('open-booking-modal', handleOpenBooking);
    window.addEventListener('open-manage-modal', handleOpenManage);
    window.addEventListener('open-auth-modal', handleOpenAuth);

    return () => {
      window.removeEventListener('open-booking-modal', handleOpenBooking);
      window.removeEventListener('open-manage-modal', handleOpenManage);
      window.removeEventListener('open-auth-modal', handleOpenAuth);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    setLenisRef(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToHashElement lenis={lenisRef} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/tattoo" element={<TattooPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <WhatsAppWidget />
      <BookingWizard
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialServiceId={selectedServiceId}
      />
      <ClientManageModal
        isOpen={isManageOpen}
        onClose={() => setIsManageOpen(false)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
