import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader, Sparkles, Check } from 'lucide-react';

const API_KEY = 'AIzaSyBAYO5ltFsHTKfdhVZm0tLQCnRQxNmRcHU'; // Key provided by the user.

const AIContentGeneratorModal = ({ closeModal, onApplyText, contextDescription, currentValue }: { 
    closeModal: () => void; 
    onApplyText: (text: string) => void;
    contextDescription: string;
    currentValue: string;
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [generatedText, setGeneratedText] = useState('');

  const handleGenerate = async () => {
    if (!prompt.trim() || !API_KEY) return;
    setIsGenerating(true);
    setError('');
    setGeneratedText('');

    try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: API_KEY });

        const fullPrompt = `You are a creative copywriter for an event planning company called Lati K. 
        Your task is to generate content ${contextDescription}.
        The user's idea or theme is: "${prompt}".
        The current text in the field is: "${currentValue}". You can use this for context or to improve upon it.
        Keep the tone professional, exciting, and persuasive. 
        Generate a concise and impactful text suitable for the field.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt
        });

        setGeneratedText(response.text);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      console.error('Error generating content:', errorMessage);
      setError(`Failed to generate content: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleApply = () => {
    if (generatedText) {
        onApplyText(generatedText);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeModal}
    >
      <motion.div 
        className="w-full max-w-xl bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 relative flex flex-col gap-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-[var(--color-primary)] flex items-center gap-3">
                    <Sparkles/> Generate Content with AI
                </h2>
                <p className="text-sm text-slate-400 mt-1">Describe the idea, and AI will write the text for you.</p>
            </div>
            <button onClick={closeModal} className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors">
              <X size={24}/>
            </button>
        </div>
        
        <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Your Idea or Theme</label>
            <div className="flex gap-2">
                <input 
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-grow bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    placeholder="e.g., 'Graduation party with a casino theme'"
                />
                <button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-36 flex items-center justify-center gap-2 bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 font-bold py-2 px-4 rounded-lg shadow-lg shadow-[var(--color-primary)]/30 disabled:opacity-50">
                    {isGenerating ? <Loader size={18} className="animate-spin" /> : <><Sparkles size={16} /> Generate</>}
                </button>
            </div>
        </div>

        <div className="flex-grow min-h-[150px] bg-slate-900/50 rounded-lg border border-slate-700 p-4">
             <AnimatePresence mode="wait">
                {isGenerating ? (
                    <motion.div key="loading" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="h-full flex items-center justify-center text-center">
                        <p className="text-slate-300">Generating creative text...</p>
                    </motion.div>
                ) : generatedText ? (
                    <motion.div key="result" initial={{opacity: 0}} animate={{opacity: 1}} className="h-full">
                        <textarea
                            readOnly
                            value={generatedText}
                            className="w-full h-full bg-transparent border-none focus:ring-0 resize-none text-slate-100"
                        />
                    </motion.div>
                ) : (
                    <motion.div key="placeholder" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="h-full flex items-center justify-center">
                        <p className="text-slate-500">AI-generated content will appear here.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {error && <p className="text-red-400 text-center text-sm -my-2">{error}</p>}

        <div className="flex justify-end items-center">
             <button onClick={handleApply} disabled={!generatedText || isGenerating} className="w-48 flex justify-center items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                <Check size={18} /> Apply This Text
            </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AIContentGeneratorModal;