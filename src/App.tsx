import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { Home } from './pages/Home';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { TattooPage } from './pages/TattooPage';
import { WhatsAppWidget } from './components/ui/WhatsAppWidget';

function ScrollToHashElement() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash, pathname]);

  return null;
}

import { useState } from 'react';
import { AdminPage } from './pages/AdminPage';
import { BookingWizard } from './components/ui/BookingWizard';
import { ClientManageModal } from './components/ui/ClientManageModal';

function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isManageOpen, setIsManageOpen] = useState(false);

  useEffect(() => {
    const handleOpenBooking = () => setIsBookingOpen(true);
    const handleOpenManage = () => setIsManageOpen(true);

    window.addEventListener('open-booking-modal', handleOpenBooking);
    window.addEventListener('open-manage-modal', handleOpenManage);

    return () => {
      window.removeEventListener('open-booking-modal', handleOpenBooking);
      window.removeEventListener('open-manage-modal', handleOpenManage);
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
      <ScrollToHashElement />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/servicos" element={<ServicesPage />} />
        <Route path="/tattoo" element={<TattooPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <WhatsAppWidget />
      <BookingWizard isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ClientManageModal isOpen={isManageOpen} onClose={() => setIsManageOpen(false)} />
    </BrowserRouter>
  );
}

export default App;
