
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

const DownloadButton = () => {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleDownloadClick = () => {
    setShowInstructions(true);
  };

  useEffect(() => {
    if (showInstructions) {
      // Give the user a moment to read before the print dialog opens
      const timer = setTimeout(() => {
        window.print();
        // Hide instructions after print dialog is likely closed
        setShowInstructions(false); 
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [showInstructions]);


  return (
    <>
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="no-print fixed bottom-28 right-8 bg-slate-800 text-slate-100 p-4 rounded-lg shadow-2xl z-50 max-w-xs border border-slate-700"
          >
            <p className="text-sm font-semibold">Generating PDF...</p>
            <p className="text-xs text-slate-300 mt-1">In the print window that opens, please select <strong className="text-amber-400">"Save as PDF"</strong> as the destination.</p>
             <button 
                onClick={() => setShowInstructions(false)} 
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
                aria-label="Close instructions"
              >
               <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="no-print fixed bottom-8 right-8 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40 z-50"
        onClick={handleDownloadClick}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        title="Download as PDF"
        aria-label="Download presentation as PDF"
      >
        <Download size={28} />
      </motion.button>
    </>
  );
};

export default DownloadButton;
