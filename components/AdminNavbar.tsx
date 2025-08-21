

import React from 'react';
import { List, Plus, Edit, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface AdminNavbarProps {
  onManageProposals: () => void;
  onCreateProposal: () => void;
  onEditProposal: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onManageProposals, onCreateProposal, onEditProposal }) => {
  const { logout } = useAuth();
  const { data } = useData();

  if (!data) return null;

  const navItems = [
    { label: 'Manage Proposals', icon: <List size={20} />, action: onManageProposals },
    { label: 'New Proposal', icon: <Plus size={20} />, action: onCreateProposal },
    { label: 'Edit Proposal', icon: <Edit size={20} />, action: onEditProposal },
  ];

  return (
    <header className="no-print fixed top-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-lg shadow-lg border-b border-slate-700/50 hidden md:block">
      <div className="container mx-auto px-6 md:px-8 flex justify-between items-center h-16">
        <div className="flex items-center gap-4">
          <img src={data.logoUrl} alt="Lati Logo" className="w-28 h-auto" />
          <span className="inline-block text-sm font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
            Admin Mode
          </span>
        </div>

        <nav className="flex items-center gap-4">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={item.action}
              className="flex items-center gap-2 text-slate-300 hover:text-[var(--color-primary)] transition-colors font-medium px-4 py-2 rounded-md hover:bg-slate-800"
              title={item.label}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors font-medium px-4 py-2 rounded-md hover:bg-slate-800"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminNavbar;