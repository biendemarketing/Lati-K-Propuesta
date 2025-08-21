import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import AIContentGeneratorModal from './AIContentGeneratorModal';

type EditableFieldProps = {
    label: string;
    path: string;
    type?: 'text' | 'textarea';
    value: string | string[];
    onChange: (path: string, value: any) => void;
};

const EditableField = ({ label, path, type = 'text', value, onChange }: EditableFieldProps) => {
    // Defensively handle value to ensure it's a string for rendering
    let displayValue: string;
    if (typeof value === 'string') {
        displayValue = value;
    } else if (Array.isArray(value)) {
        displayValue = value.join('\n');
    } else {
        // Log a warning for unexpected types
        if (value !== null && value !== undefined) {
             console.warn(`EditableField received an unexpected type for value at path "${path}":`, value);
        }
        displayValue = ''; // Default to empty string
    }

    return (
        <div className="w-full">
            {type === 'textarea' ? (
                <textarea
                    value={displayValue}
                    onChange={(e) => onChange(path, e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    rows={type === 'textarea' ? (displayValue.split('\n').length) : undefined}
                />
            ) : (
                <input
                    type="text"
                    value={displayValue}
                    onChange={(e) => onChange(path, e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                />
            )}
        </div>
    );
};


const EditableFieldWithAI = ({ label, path, type = 'text', value, onChange }: EditableFieldProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // This handler intelligently decides if the incoming text should be an array or a string.
    const handleApplyText = (text: string) => {
        // If the original value was an array, we assume the new value should also be an array.
        const finalValue = Array.isArray(value) ? text.split('\n') : text;
        onChange(path, finalValue);
        setIsModalOpen(false);
    };

    const contextDescription = `for a field labeled "${label}" in a section about "${path.split('.')[0]}"`;
    // Ensure the value passed to the modal is always a string.
    const currentValueForPrompt = Array.isArray(value) ? value.join('\n') : (value || '');

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
                onChange={(path, val) => {
                    // When the user types, if the original was an array, keep it as an array.
                    const finalVal = Array.isArray(value) ? val.split('\n') : val;
                    onChange(path, finalVal);
                }}
            />
            <AnimatePresence mode="wait">
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