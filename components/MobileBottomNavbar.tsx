import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, PlusCircle, FilePenLine, LogOut } from 'lucide-react';

interface MobileBottomNavbarProps {
  onManageProposals: () => void;
  onCreateProposal: () => void;
  onEditProposal: () => void;
  onLogout: () => void;
}

const MobileBottomNavbar: React.FC<MobileBottomNavbarProps> = ({
  onManageProposals,
  onCreateProposal,
  onEditProposal,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState('Home');

  const navItems = [
    { label: 'Home', icon: <Home size={24} />, action: onManageProposals },
    { label: 'New', icon: <PlusCircle size={24} />, action: onCreateProposal },
    { label: 'Edit', icon: <FilePenLine size={24} />, action: onEditProposal },
    { label: 'Logout', icon: <LogOut size={24} />, action: onLogout },
  ];

  const handleAction = (label: string, action: () => void) => {
    setActiveTab(label);
    action();
  };

  return (
    <footer className="no-print fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 md:hidden">
      <nav className="relative bg-slate-950/80 backdrop-blur-lg border border-slate-700/50 rounded-full shadow-2xl shadow-black/50 flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={item.label}
              onClick={() => handleAction(item.label, item.action)}
              className={`relative flex flex-col items-center justify-center gap-1 w-20 h-full transition-colors duration-300 z-10 
                ${isActive ? 'text-[var(--color-primary)]' : 'text-slate-400 hover:text-slate-200'}`
              }
              title={item.label}
              style={{
                filter: isActive ? `drop-shadow(0 0 10px var(--color-primary))` : 'none',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute top-2 h-1 w-8 rounded-full bg-[var(--color-primary)]"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              {item.icon}
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};

export default MobileBottomNavbar;
