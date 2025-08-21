

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './components/Hero';
import ProposalSection from './components/ProposalSection';
import ServicesSection from './components/ServicesSection';
import FeaturesSection from './components/FeaturesSection';
import IncludedServicesSection from './components/IncludedServicesSection';
import Footer from './components/Footer';
import DownloadButton from './components/DownloadButton';
import LoginModal from './components/Login';
import AdminPanel from './components/AdminPanel';
import ProposalListModal from './components/ProposalListModal';
import { useAuth } from './contexts/AuthContext';
import { useData } from './contexts/DataContext';
import { Edit, LogIn, Loader, Plus, List } from 'lucide-react';
import LandingPage from './components/LandingPage';

const App = () => {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, startEditing, createProposal } = useData();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProposalListModalOpen, setIsProposalListModalOpen] = useState(false);
  const [isLandingPage, setIsLandingPage] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsLandingPage(params.get('page') === 'landing');
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAdminPanelOpen(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isLandingPage) {
        document.title = 'Lati K Publicidad | Eventos Inolvidables';
        return;
    }
    if (data?.hero?.clientName) {
      document.title = `Lati K | Propuesta para ${data.hero.clientName}`;
    } else {
      document.title = 'Lati K Propuesta';
    }

    const defaultTheme = {
      name: 'Lati Amber',
      primary: '#f59e0b',
      primaryGradientFrom: '#f59e0b',
      primaryGradientTo: '#facc15',
    };

    const theme = (data?.theme && data.theme.primary) ? data.theme : defaultTheme;

    const styleId = 'dynamic-theme-style';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
      :root {
        --color-primary: ${theme.primary};
        --color-primary-gradient-from: ${theme.primaryGradientFrom};
        --color-primary-gradient-to: ${theme.primaryGradientTo};
      }
    `;
  }, [data, isLandingPage]);

  const handleOpenAdminPanel = () => {
    startEditing(); 
    setIsAdminPanelOpen(true);
  };
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === 'true' && isAuthenticated) {
      handleOpenAdminPanel();
      params.delete('edit');
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleCreateProposal = async () => {
    const proposalName = prompt("Introduce el nombre para la nueva propuesta (ej: nombre del cliente):");
    if (proposalName && proposalName.trim()) {
      try {
        const newSlug = await createProposal(proposalName.trim());
        window.location.href = `/?proposal=${newSlug}`;
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error al crear la propuesta: ${error.message}`);
        } else {
          alert("Ocurrió un error desconocido al crear la propuesta.");
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col items-center justify-center">
        <Loader className="animate-spin text-[var(--color-primary)]" size={48} />
        <p className="text-xl font-semibold mt-4">Cargando...</p>
      </div>
    );
  }
  
  if (isLandingPage) {
      return <LandingPage />;
  }

  if (!data) {
    return (
      <div className="bg-slate-900 text-slate-100 min-h-screen flex flex-col items-center justify-center text-center p-4">
         <p className="text-2xl font-semibold text-red-400">Error: La propuesta no existe.</p>
         <p className="text-md text-slate-400 mt-2">No se pudo encontrar la propuesta solicitada. Por favor, verifica el enlace.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen antialiased overflow-x-hidden">
      <div className="relative isolate">
        <div 
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 print-hide" 
          aria-hidden="true"
        >
          <div 
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          ></div>
        </div>

        <Hero />

        <main className="container mx-auto px-6 md:px-8">
          {(() => {
            const template = data.template || 'classic';
            switch (template) {
              case 'minimalist':
                return <IncludedServicesSection />;
              case 'services-focused':
                return (
                  <>
                    <ProposalSection />
                    <ServicesSection />
                    <IncludedServicesSection />
                  </>
                );
              case 'compact':
                return (
                  <>
                    <ServicesSection />
                    <IncludedServicesSection />
                  </>
                );
              case 'visual':
                return (
                  <>
                    <ProposalSection />
                    <FeaturesSection />
                    <IncludedServicesSection />
                  </>
                );
              case 'classic':
              default:
                return (
                  <>
                    <ProposalSection />
                    <ServicesSection />
                    <FeaturesSection />
                    <IncludedServicesSection />
                  </>
                );
            }
          })()}
        </main>
        
        <div 
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] print-hide" 
          aria-hidden="true"
        >
          <div 
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" 
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          ></div>
        </div>
      </div>
      <Footer />
      <DownloadButton isAuthenticated={isAuthenticated} />

      {isAuthenticated ? (
        <div className="no-print fixed bottom-8 right-8 z-50 flex flex-col gap-4">
           <motion.button
            className="bg-gradient-to-r from-purple-500 to-violet-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/40"
            onClick={() => setIsProposalListModalOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            title="Gestionar Propuestas"
          >
              <List size={28} />
          </motion.button>
          <motion.button
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-green-500/40"
            onClick={handleCreateProposal}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            title="Crear Nueva Propuesta"
          >
              <Plus size={28} />
          </motion.button>
          <motion.button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40"
            onClick={handleOpenAdminPanel}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            title="Editar Propuesta"
          >
              <Edit size={28} />
          </motion.button>
        </div>
      ) : (
         <div className="no-print fixed bottom-8 right-8 z-50">
          <motion.button
            className="bg-slate-700 text-slate-100 w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            onClick={() => setIsLoginModalOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            title="Admin Login"
          >
              <LogIn size={28} />
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModal 
            closeModal={() => setIsLoginModalOpen(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminPanelOpen && (
          <AdminPanel 
            closePanel={() => setIsAdminPanelOpen(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProposalListModalOpen && (
          <ProposalListModal closeModal={() => setIsProposalListModalOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;