import React, { useEffect, useState, useCallback } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Accreditation from './components/Accreditation';
import Pricing from './components/Pricing';
import Curriculum from './components/Curriculum';
import AppSection from './components/AppSection';
import DemoCta from './components/DemoCta';
import LearnYourWay from './components/LearnYourWay';
import PracticalClasses from './components/PracticalClasses';
import Students from './components/Students';
import Placements from './components/Placements';
import InptaSection from './components/InptaSection';
import FAQ from './components/FAQ';
import BottomCTA from './components/BottomCTA';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import AssessmentPage from './pages/AssessmentPage';
import CookiePolicy from './components/CookiePolicy';
import CookieConsent from './components/CookieConsent';
import { smoothScrollTo } from './utils/scroll';

// Code-split ModalRoot chunk to keep initial landing page load instant (< 60kB)
const ModalRoot = React.lazy(() => import('./components/modals/ModalRoot'));

function getInitialRoute() {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  if (path === '/assessment' || path.startsWith('/assessment') || hash === '#assessment' || hash === '#test') {
    return 'assessment';
  }
  if (path === '/cookie-policy' || path.startsWith('/cookie-policy') || hash === '#cookie-policy') {
    return 'cookie-policy';
  }
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState(getInitialRoute);
  const [modalState, setModalState] = useState({ type: null, data: null });

  const navigate = useCallback((page, targetHash = '') => {
    if (page === 'assessment') {
      const url = '/assessment' + (targetHash ? `#${targetHash}` : '');
      if (window.location.pathname !== '/assessment') {
        window.history.pushState({ page: 'assessment' }, '', url);
      }
      setCurrentPage('assessment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (page === 'cookie-policy') {
      if (window.location.pathname !== '/cookie-policy') {
        window.history.pushState({ page: 'cookie-policy' }, '', '/cookie-policy');
      }
      setCurrentPage('cookie-policy');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const url = targetHash ? `/#${targetHash}` : '/';
      window.history.pushState({ page: 'home' }, '', url);
      setCurrentPage('home');
      if (targetHash) {
        setTimeout(() => {
          smoothScrollTo(targetHash);
        }, 50);
      } else {
        smoothScrollTo(document.body, 0);
      }
    }
  }, []);

  // Listen to browser Back / Forward buttons and hash changes
  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute();
      setCurrentPage(route);

      if (route === 'home' && window.location.hash) {
        const id = window.location.hash.replace('#', '');
        setTimeout(() => {
          smoothScrollTo(id);
        }, 50);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    // Initial hash scroll if starting on homepage with hash
    if (currentPage === 'home' && window.location.hash) {
      const id = window.location.hash.replace('#', '');
      setTimeout(() => {
        smoothScrollTo(id);
      }, 100);
    }

    // Idle prefetch ModalRoot so user clicking any CTA experiences zero delay
    const idlePrefetch = () => {
      import('./components/modals/ModalRoot').catch(() => {});
    };
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(idlePrefetch);
      } else {
        setTimeout(idlePrefetch, 1800);
      }
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, [currentPage]);

  const handleOpenDemo = () => setModalState({ type: 'demo', data: null });
  const handleOpenReport = (reportData) => setModalState({ type: 'report', data: reportData });
  const handleOpenCertificate = () => setModalState({ type: 'certapply', data: null });
  const handleOpenBrochure = () => setModalState({ type: 'brochure', data: null });
  const handleCloseModal = () => setModalState({ type: null, data: null });

  return (
    <>
      <Header
        onOpenDemo={handleOpenDemo}
        currentPage={currentPage}
        onNavigate={navigate}
      />

      <main>
        {currentPage === 'assessment' ? (
          <AssessmentPage
            onOpenReport={handleOpenReport}
            onNavigate={navigate}
            onOpenDemo={handleOpenDemo}
          />
        ) : currentPage === 'cookie-policy' ? (
          <CookiePolicy onNavigate={navigate} />
        ) : (
          <>
            <Hero onOpenDemo={handleOpenDemo} onNavigate={navigate} />
            <Accreditation />
            <Pricing onOpenDemo={handleOpenDemo} onNavigate={navigate} />
            <Curriculum onOpenBrochure={handleOpenBrochure} />
            <AppSection />
            <DemoCta onOpenDemo={handleOpenDemo} />
            <LearnYourWay />
            <PracticalClasses />
            <Students />
            <Placements />
            <InptaSection onApplyCertificate={handleOpenCertificate} />
            <FAQ />
            <BottomCTA onOpenDemo={handleOpenDemo} onNavigate={navigate} />
          </>
        )}
      </main>

      <Footer onNavigate={navigate} />
      <WhatsAppFloat />
      <CookieConsent onNavigate={navigate} />

      <React.Suspense fallback={null}>
        <ModalRoot modalState={modalState} onClose={handleCloseModal} />
      </React.Suspense>
    </>
  );
}
