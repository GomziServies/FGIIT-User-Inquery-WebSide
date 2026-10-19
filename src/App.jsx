import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Accreditation from './components/Accreditation';
import CoachLevelQuiz from './components/CoachLevelQuiz';
import LearnYourWay from './components/LearnYourWay';
import FreeDemoBanner from './components/FreeDemoBanner';
import PracticalClasses from './components/PracticalClasses';
import Courses from './components/Courses';
import Curriculum from './components/Curriculum';
import Journey from './components/Journey';
import CertificateOnly from './components/CertificateOnly';
import Coaches from './components/Coaches';
import PlacementCell from './components/PlacementCell';
import FAQ from './components/FAQ';
import BottomCTA from './components/BottomCTA';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import ModalRoot from './components/modals/ModalRoot';

export default function App() {
  const [modalState, setModalState] = useState({ type: null, data: null });

  const handleOpenDemo = () => setModalState({ type: 'demo', data: null });
  const handleOpenCourse = (courseId) => setModalState({ type: 'course', data: courseId });
  const handleOpenReport = (reportData) => setModalState({ type: 'report', data: reportData });
  const handleApplyExam = (courseData) => setModalState({ type: 'apply', data: courseData });
  const handleOpenEmi = () => setModalState({ type: 'emi', data: null });
  const handleCloseModal = () => setModalState({ type: null, data: null });

  return (
    <>
      <Header onOpenDemo={handleOpenDemo} />

      <main>
        <Hero onOpenDemo={handleOpenDemo} />
        <Accreditation />
        <CoachLevelQuiz onOpenReport={handleOpenReport} />
        <LearnYourWay />
        <FreeDemoBanner onOpenDemo={handleOpenDemo} />
        <PracticalClasses />
        <Courses onOpenCourse={handleOpenCourse} />
        <Curriculum />
        <Journey />
        <CertificateOnly onApplyExam={handleApplyExam} onOpenEmi={handleOpenEmi} />
        <Coaches />
        <PlacementCell />
        <FAQ />
        <BottomCTA onOpenDemo={handleOpenDemo} />
      </main>

      <Footer />
      <WhatsAppFloat />

      <ModalRoot modalState={modalState} onClose={handleCloseModal} />
    </>
  );
}
