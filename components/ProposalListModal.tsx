import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, Loader, Trash2, ExternalLink, Edit } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useData } from '../contexts/DataContext';

interface ProposalInfo {
  slug: string;
  created_at: string;
}

const ProposalListModal = ({ closeModal }: { closeModal: () => void }) => {
  const [proposals, setProposals] = useState<ProposalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { deleteProposal } = useData();

  const fetchProposals = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(`Failed to fetch proposals: ${error.message}`);
      console.error(error);
    } else {
      setProposals(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  const handleDelete = async (slug: string) => {
    if (slug === 'default') return;
    if (window.confirm(`Are you sure you want to delete the proposal "${slug}"? This action cannot be undone.`)) {
      try {
        await deleteProposal(slug);
        fetchProposals(); // Refresh the list after deletion
      } catch (err) {
        if (err instanceof Error) {
          alert(`Error deleting proposal: ${err.message}`);
        } else {
          alert('An unknown error occurred while deleting.');
        }
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
  }

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="w-full max-w-2xl bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 relative flex flex-col"
        style={{ maxHeight: '90vh' }}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="flex justify-between items-center mb-6 shrink-0">
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">Gestionar Propuestas</h2>
            <button onClick={closeModal} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors">
              <X size={24}/>
            </button>
        </div>
        
        <div className="overflow-y-auto flex-grow">
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader className="animate-spin text-[var(--color-primary)]" size={32} />
                </div>
            ) : error ? (
                <p className="text-red-400 text-center">{error}</p>
            ) : proposals.length === 0 ? (
                 <p className="text-slate-400 text-center">No se encontraron propuestas.</p>
            ) : (
                <ul className="space-y-3">
                    {proposals.map((proposal, index) => (
                        <motion.li 
                            key={proposal.slug}
                            className="flex items-center justify-between bg-slate-700/50 p-4 rounded-lg border border-slate-600"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div>
                                <p className="font-semibold text-white capitalize">{proposal.slug.replace(/-/g, ' ')}</p>
                                <p className="text-xs text-slate-400">Creada: {formatDate(proposal.created_at)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <a 
                                    href={proposal.slug === 'default' ? '/' : `/?proposal=${proposal.slug}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-2 text-slate-300 hover:text-[var(--color-primary)] transition-colors"
                                    title="Abrir Propuesta"
                                >
                                    <ExternalLink size={18} />
                                </a>
                                <a
                                    href={proposal.slug === 'default' ? '/?edit=true' : `/?proposal=${proposal.slug}&edit=true`}
                                    className="p-2 text-slate-300 hover:text-blue-400 transition-colors"
                                    title="Editar Propuesta"
                                >
                                    <Edit size={18} />
                                </a>
                                {proposal.slug !== 'default' && (
                                    <button 
                                        onClick={() => handleDelete(proposal.slug)}
                                        className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                        title="Eliminar Propuesta"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </motion.li>
                    ))}
                </ul>
            )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProposalListModal;