

import React, { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { CheckCircle, DollarSign, X, MessageSquare, Send, Loader } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import IconMapper from './IconMapper';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

type ListItemProps = {
  icon: React.ReactNode;
  text: string;
};

const ListItem = ({ icon, text }: ListItemProps) => (
  <motion.li className="flex items-center text-lg" variants={itemVariants}>
    <span className="text-[var(--color-primary)] mr-4 print:mr-2">{icon}</span>
    <span>{text}</span>
  </motion.li>
);

const RequestChangesModal = ({ closeModal, onSubmit }: { closeModal: () => void, onSubmit: (name: string, comment: string) => Promise<void> }) => {
    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !comment.trim()) {
            setError('Por favor, completa todos los campos.');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await onSubmit(name, comment);
            setSuccess(true);
            setTimeout(() => closeModal(), 2000);
        } catch(err) {
            setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
         <motion.div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
        >
            <motion.div
                className="w-full max-w-lg bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 relative"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 30, opacity: 0 }}
                onClick={e => e.stopPropagation()}
            >
                 <button onClick={closeModal} className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors">
                  <X size={24}/>
                </button>
                <AnimatePresence mode="wait">
                {success ? (
                    <motion.div key="success" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="text-center py-12">
                        <CheckCircle size={48} className="text-green-400 mx-auto mb-4"/>
                        <h3 className="text-2xl font-bold text-white">¡Comentarios Enviados!</h3>
                        <p className="text-slate-300 mt-2">Gracias, nos pondremos en contacto pronto.</p>
                    </motion.div>
                ) : (
                    <motion.div key="form">
                        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-4 flex items-center gap-3"><MessageSquare/> Solicitar Cambios</h3>
                        <p className="text-slate-300 mb-6 text-sm">Por favor, déjanos tus comentarios y nos pondremos en contacto para ajustar la propuesta a tus necesidades.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Tu Nombre</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" required/>
                            </div>
                             <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1">Comentarios</label>
                                <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]" rows={4} required/>
                            </div>
                            {error && <p className="text-red-400 text-sm">{error}</p>}
                            <div className="flex justify-end">
                                <motion.button
                                    type="submit"
                                    disabled={loading}
                                    className="w-40 flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 font-bold py-2 px-4 rounded-full shadow-lg shadow-[var(--color-primary)]/30 disabled:opacity-50"
                                    whileHover={{ scale: loading ? 1 : 1.05 }}
                                    whileTap={{ scale: loading ? 1 : 0.95 }}
                                >
                                    {loading ? <><Loader size={18} className="animate-spin" /><span>Enviando...</span></> : <><Send size={18} /><span>Enviar</span></>}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

const IncludedServicesSection = () => {
  const { data, addComment, updateProposalStatus } = useData();
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { included, hero } = data;

  const handleAccept = async () => {
    if (window.confirm("¿Estás seguro de que quieres aceptar esta propuesta? Se notificará al equipo de Lati K.")) {
        try {
            await updateProposalStatus('Accepted');
            alert("¡Propuesta aceptada! Gracias por tu confianza. Nos pondremos en contacto contigo pronto.");
        } catch(err) {
            alert(err instanceof Error ? err.message : 'No se pudo actualizar el estado.');
        }
    }
  };

  return (
    <motion.section
      className="py-24 print-slide"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-[var(--color-primary)]"
        variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
      >
        {included.title}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center print:grid-cols-2 print:gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-6 print:mb-4">{included.listTitle}</h3>
          <ul className="space-y-4 print:space-y-2">
            {included.items.map((item, index) => (
              <ListItem 
                key={index} 
                icon={<IconMapper iconName={item.icon} />} 
                text={item.text} 
              />
            ))}
          </ul>
        </div>
        
        <motion.div
          className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-[var(--color-primary)] shadow-2xl shadow-[var(--color-primary)]/20 text-center print:p-6 flex flex-col"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'backOut' }}
        >
          <div className="flex justify-center items-center mb-4 print:mb-2">
            <DollarSign className="text-[var(--color-primary)]" size={40} />
            <h3 className="text-2xl font-bold ml-2">{included.costTitle}</h3>
          </div>
          <p className="text-6xl font-black text-white my-4 print:text-5xl print:my-2">{included.cost}</p>
          <p className="text-slate-400 mb-8">{included.costDescription}</p>
          
           {!isAuthenticated && (
                <div className="no-print mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-slate-700 text-slate-100 font-bold py-3 px-6 rounded-full transition-colors hover:bg-slate-600"
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    >
                       Solicitar Cambios
                    </motion.button>
                    <motion.button
                        onClick={handleAccept}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-green-500/30"
                        whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px #22c55e/0.5" }}
                        whileTap={{ scale: 0.95 }}
                    >
                       Aceptar Propuesta
                    </motion.button>
                </div>
           )}
        </motion.div>
      </div>
      <AnimatePresence>
        {isModalOpen && <RequestChangesModal closeModal={() => setIsModalOpen(false)} onSubmit={addComment} />}
      </AnimatePresence>
    </motion.section>
  );
};

export default IncludedServicesSection;
