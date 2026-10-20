import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Accreditation from './components/Accreditation';
import Pricing from './components/Pricing';
import Courses from './components/Courses';
import Curriculum from './components/Curriculum';
import AppSection from './components/AppSection';
import DemoCta from './components/DemoCta';
import LearnYourWay from './components/LearnYourWay';
import PracticalClasses from './components/PracticalClasses';
import CoachLevelQuiz from './components/CoachLevelQuiz';
import Students from './components/Students';
import InptaSection from './components/InptaSection';
import FAQ from './components/FAQ';
import BottomCTA from './components/BottomCTA';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import ModalRoot from './components/modals/ModalRoot';

export default function App() {
  const [modalState, setModalState] = useState({ type: null, data: null });

  // Direct links to a section (e.g. /#courses) are not scrolled by the browser
  // because the SPA renders after load. Scroll to the target once mounted.
  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.replace('#', '');
      if (!id) return;
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ block: 'start' });
    };

    window.addEventListener('load', scrollToHash);
    const timer = window.setTimeout(scrollToHash, 900);

    return () => {
      window.removeEventListener('load', scrollToHash);
      window.clearTimeout(timer);
    };
  }, []);

  const handleOpenDemo = () => setModalState({ type: 'demo', data: null });
  const handleOpenCourse = (courseId) => setModalState({ type: 'course', data: courseId });
  const handleOpenBuy = (courseId) => setModalState({ type: 'buy', data: courseId });
  const handleOpenReport = (reportData) => setModalState({ type: 'report', data: reportData });
  const handleOpenCertificate = () => setModalState({ type: 'certapply', data: null });
  const handleOpenBrochure = () => setModalState({ type: 'brochure', data: null });
  const handleCloseModal = () => setModalState({ type: null, data: null });

  return (
    <>
      <Header onOpenDemo={handleOpenDemo} />

      <main>
        <Hero onOpenDemo={handleOpenDemo} />
        <Accreditation />
        <Pricing onOpenDemo={handleOpenDemo} />
        <Courses onOpenCourse={handleOpenCourse} onOpenBuy={handleOpenBuy} />
        <Curriculum onOpenBrochure={handleOpenBrochure} />
        <AppSection />
        <DemoCta onOpenDemo={handleOpenDemo} />
        <LearnYourWay />
        <PracticalClasses />
        <CoachLevelQuiz onOpenReport={handleOpenReport} />
        <Students />
        <InptaSection onApplyCertificate={handleOpenCertificate} />
        <FAQ />
        <BottomCTA onOpenDemo={handleOpenDemo} />
      </main>

      <Footer />
      <WhatsAppFloat />

      <ModalRoot modalState={modalState} onClose={handleCloseModal} />
    </>
  );
}
