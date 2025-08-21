import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import AIContentGeneratorModal from './AIContentGeneratorModal';

type EditableFieldProps = {
    label: string;
    path: string;
    type?: 'text' | 'textarea';
    value: string;
    onChange: (path: string, value: any) => void;
};

const EditableField = ({ label, path, type = 'text', value, onChange }: EditableFieldProps) => {
    return (
        <div className="w-full">
            {type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(path, e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    rows={type === 'textarea' ? (Array.isArray(value) ? value.length : 3) : undefined}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(path, e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
            )}
        </div>
    );
};


const EditableFieldWithAI = ({ label, path, type = 'text', value, onChange }: EditableFieldProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleApplyText = (text: string) => {
        const finalValue = Array.isArray(value) ? text.split('\n') : text;
        onChange(path, finalValue);
        setIsModalOpen(false);
    };

    const contextDescription = `for a field labeled "${label}" in a section about "${path.split('.')[0]}"`;
    const currentValueForPrompt = Array.isArray(value) ? value.join('\n') : value;

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-400">{label}</label>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-[var(--color-primary)] transition-colors"
                    title="Generate with AI"
                >
                    <Sparkles size={14} /> Generate
                </button>
            </div>
            <EditableField 
                label={label}
                path={path}
                type={type}
                value={value}
                onChange={onChange}
            />
            <AnimatePresence>
                {isModalOpen && (
                    <AIContentGeneratorModal 
                        closeModal={() => setIsModalOpen(false)}
                        onApplyText={handleApplyText}
                        contextDescription={contextDescription}
                        currentValue={currentValueForPrompt}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditableFieldWithAI;