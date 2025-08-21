import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, FileText, RectangleHorizontal } from 'lucide-react';

const DownloadButton = () => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  const handleDownload = (selectedOrientation: 'portrait' | 'landscape') => {
    setOrientation(selectedOrientation);
    setShowInstructions(true);

    const styleId = 'print-orientation-style';
    // Remove any existing style element
    document.getElementById(styleId)?.remove();

    // Create and inject the new style element
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `@page { size: A4 ${selectedOrientation}; margin: 0; }`;
    document.head.appendChild(style);
    
    // Give the user a moment to read before the print dialog opens
    setTimeout(() => {
        window.print();
        setShowInstructions(false);
        setOptionsVisible(false);
        // Clean up the style element after printing is likely done
        setTimeout(() => document.getElementById(styleId)?.remove(), 100);
    }, 500);
  };

  const optionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="no-print fixed bottom-28 right-8 bg-slate-800 text-slate-100 p-4 rounded-lg shadow-2xl z-40 max-w-xs border border-slate-700"
          >
            <p className="text-sm font-semibold">Generating PDF ({orientation})...</p>
            <p className="text-xs text-slate-300 mt-1">In the print window, please select <strong className="text-amber-400">"Save as PDF"</strong> as the destination.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="no-print fixed bottom-8 right-8 z-50 flex flex-col items-center gap-4">
        <AnimatePresence>
          {optionsVisible && (
            <motion.div 
              className="flex flex-col items-center gap-4"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              <motion.button
                className="bg-slate-700 text-slate-100 w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg"
                onClick={() => handleDownload('landscape')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                variants={optionVariants}
                title="Download Horizontal PDF"
              >
                <RectangleHorizontal size={24} />
                 <span className="text-xs mt-1 font-bold">H</span>
              </motion.button>
              <motion.button
                className="bg-slate-700 text-slate-100 w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg"
                onClick={() => handleDownload('portrait')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                variants={optionVariants}
                title="Download Vertical PDF"
              >
                <FileText size={24} />
                <span className="text-xs mt-1 font-bold">V</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.button
          className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40"
          onClick={() => setOptionsVisible(!optionsVisible)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          title={optionsVisible ? "Close Options" : "Download as PDF"}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={optionsVisible ? 'x' : 'download'}
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {optionsVisible ? <X size={28} /> : <Download size={28} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
};

export default DownloadButton;