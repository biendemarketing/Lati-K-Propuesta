import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronRight, LogOut, Plus, Trash2, Save, RotateCcw, Loader, Check } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { iconNames } from './IconMapper';
import ImageUploader from './ImageUploader';
import get from 'lodash.get';

const Section = ({ title, id, children, isOpen, onToggle }: { title: string, id: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) => (
    <div className="border-b border-slate-700">
      <button onClick={onToggle} className="w-full flex justify-between items-center p-4 hover:bg-slate-700/50">
        <h3 className="font-semibold text-lg">{title}</h3>
        {isOpen ? <ChevronDown /> : <ChevronRight />}
      </button>
      {isOpen && <div className="p-4 bg-slate-800/50">{children}</div>}
    </div>
);

const EditableField = ({ label, path, type = 'text', value, onChange }: { label: string, path: string, type?: 'text' | 'textarea', value: string, onChange: (path: string, value: string) => void }) => {
    return (
        <div className="mb-4">
            <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => onChange(path, e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    rows={3}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(path, e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
            )}
        </div>
    );
};


const AdminPanel = ({ closePanel }: { closePanel: () => void }) => {
  const { draftData, updateDraftData, addItem, removeItem, saveChanges, isDirty, discardChanges, resetData } = useData();
  const { logout } = useAuth();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
      general: true
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleClose = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close? Your changes will be discarded.")) {
        discardChanges();
        closePanel();
      }
    } else {
      closePanel();
    }
  };

  const handleDiscard = () => {
    if(isDirty && window.confirm("Are you sure you want to discard all changes since your last save?")) {
        discardChanges();
    } else if (!isDirty) {
        discardChanges();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError('');
    try {
        await saveChanges();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000); // Reset success state after 2s
    } catch (error) {
        if (error instanceof Error) {
            setSaveError(error.message);
        } else {
            setSaveError("An unknown error occurred while saving.");
        }
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleReset = async () => {
    const confirmation = prompt("This is a destructive action. To confirm, please type 'RESET' below.");
    if (confirmation === 'RESET') {
        try {
            await resetData();
            alert("Data has been reset to defaults successfully.");
        } catch(error) {
            if (error instanceof Error) {
                alert(`Error resetting data: ${error.message}`);
            } else {
                alert('An unknown error occurred during reset.');
            }
        }
    } else {
        alert("Reset cancelled. Confirmation text did not match.");
    }
  };
  
  const handleSelectChange = (path: string, value: string) => {
    updateDraftData(path, value);
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const renderIconSelector = (label: string, path: string, currentValue: string) => (
    <div className="mb-2">
      <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
      <select 
        value={currentValue} 
        onChange={(e) => handleSelectChange(path, e.target.value)}
        className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
      >
        {iconNames.map(name => <option key={name} value={name}>{name}</option>)}
      </select>
    </div>
  );

  if (!draftData) {
    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-slate-800 text-slate-100 shadow-2xl z-50 border-l border-slate-700 flex items-center justify-center"
        >
            <p>Loading editor...</p>
        </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full max-w-lg bg-slate-800 text-slate-100 shadow-2xl z-50 border-l border-slate-700 flex flex-col"
    >
      <div className="flex justify-between items-center p-4 border-b border-slate-700 shrink-0">
        <h2 className="text-xl font-bold text-amber-400">Edit Content</h2>
        <button onClick={handleClose} className="p-2 rounded-full hover:bg-slate-700"><X /></button>
      </div>
      <div className="overflow-y-auto flex-grow">
        
        <Section title="General Settings" id="general" isOpen={!!openSections['general']} onToggle={() => toggleSection('general')}>
          <ImageUploader path="logoUrl" currentImageUrl={draftData.logoUrl} />
        </Section>
        
        <Section title="Hero Section" id="hero" isOpen={!!openSections['hero']} onToggle={() => toggleSection('hero')}>
          <ImageUploader path="hero.backgroundImageUrl" currentImageUrl={draftData.hero.backgroundImageUrl} />
          <EditableField label="Subtitle" path="hero.subtitle" value={get(draftData, 'hero.subtitle')} onChange={updateDraftData} />
          <EditableField label="Title" path="hero.title" value={get(draftData, 'hero.title')} onChange={updateDraftData} />
          <EditableField label="Description" path="hero.description" type="textarea" value={get(draftData, 'hero.description')} onChange={updateDraftData} />
          <div className="grid grid-cols-2 gap-4">
            <EditableField label="Client Label" path="hero.clientLabel" value={get(draftData, 'hero.clientLabel')} onChange={updateDraftData} />
            <EditableField label="Client Name" path="hero.clientName" value={get(draftData, 'hero.clientName')} onChange={updateDraftData} />
            <EditableField label="Activity Label" path="hero.activityLabel" value={get(draftData, 'hero.activityLabel')} onChange={updateDraftData} />
            <EditableField label="Activity Name" path="hero.activityName" value={get(draftData, 'hero.activityName')} onChange={updateDraftData} />
            <EditableField label="Theme Label" path="hero.themeLabel" value={get(draftData, 'hero.themeLabel')} onChange={updateDraftData} />
            <EditableField label="Theme Name" path="hero.themeName" value={get(draftData, 'hero.themeName')} onChange={updateDraftData} />
          </div>
        </Section>

        <Section title="Proposal Section" id="proposal" isOpen={!!openSections['proposal']} onToggle={() => toggleSection('proposal')}>
           <EditableField label="Section Title" path="proposal.title" value={get(draftData, 'proposal.title')} onChange={updateDraftData} />
           {draftData.proposal.cards.map((card, index) => (
             <div key={`proposal-card-${index}`} className="p-3 my-2 border border-slate-600 rounded-md relative">
                <h4 className="font-semibold mb-2">Card {index+1}</h4>
                 <button onClick={() => removeItem('proposal.cards', index)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                <EditableField label="Card Title" path={`proposal.cards.${index}.title`} value={card.title} onChange={updateDraftData} />
                <EditableField label="Card Description" path={`proposal.cards.${index}.description`} type="textarea" value={card.description} onChange={updateDraftData} />
                <ImageUploader path={`proposal.cards.${index}.imageUrl`} currentImageUrl={card.imageUrl} />
             </div>
           ))}
           <button onClick={() => addItem('proposal.cards')} className="mt-2 text-sm flex items-center gap-2 text-amber-400 font-semibold"><Plus size={16}/> Add Proposal Card</button>
        </Section>
        
        <Section title="Services Section" id="services" isOpen={!!openSections['services']} onToggle={() => toggleSection('services')}>
            <EditableField label="Section Title" path="services.title" value={get(draftData, 'services.title')} onChange={updateDraftData} />
            {draftData.services.cards.map((card, index) => (
             <div key={`service-card-${index}`} className="p-3 my-2 border border-slate-600 rounded-md relative">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Service Card {index+1}</h4>
                    <button onClick={() => removeItem('services.cards', index)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id={`service_enabled_${index}`} checked={card.enabled} onChange={(e) => updateDraftData(`services.cards.${index}.enabled`, e.target.checked)} />
                    <label htmlFor={`service_enabled_${index}`} className="text-sm font-medium">Enabled</label>
                </div>
                <EditableField label="Service Title" path={`services.cards.${index}.title`} value={card.title} onChange={updateDraftData} />
                {renderIconSelector('Icon', `services.cards.${index}.icon`, card.icon)}
                <EditableField label="List items (one per line)" path={`services.cards.${index}.items`} type="textarea" value={Array.isArray(card.items) ? card.items.join('\n') : ''} onChange={(path, value) => updateDraftData(path, value.split('\n'))} />
                <ImageUploader path={`services.cards.${index}.imageUrl`} currentImageUrl={card.imageUrl} />
             </div>
           ))}
           <button onClick={() => addItem('services.cards')} className="mt-2 text-sm flex items-center gap-2 text-amber-400 font-semibold"><Plus size={16}/> Add Service Card</button>
        </Section>

         <Section title="Features Section" id="features" isOpen={!!openSections['features']} onToggle={() => toggleSection('features')}>
            <EditableField label="Section Title" path="features.title" value={get(draftData, 'features.title')} onChange={updateDraftData} />
            {draftData.features.items.map((item, index) => (
             <div key={`feature-item-${index}`} className="p-3 my-2 border border-slate-600 rounded-md relative">
                 <h4 className="font-semibold mb-2">Feature {index+1}</h4>
                 <button onClick={() => removeItem('features.items', index)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                 <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id={`feature_reverse_${index}`} checked={item.reverse} onChange={(e) => updateDraftData(`features.items.${index}.reverse`, e.target.checked)} />
                    <label htmlFor={`feature_reverse_${index}`} className="text-sm font-medium">Reverse Layout</label>
                </div>
                <EditableField label="Feature Title" path={`features.items.${index}.title`} value={item.title} onChange={updateDraftData} />
                {renderIconSelector('Icon', `features.items.${index}.icon`, item.icon)}
                <EditableField label="Feature Description" path={`features.items.${index}.description`} type="textarea" value={item.description} onChange={updateDraftData} />
                <ImageUploader path={`features.items.${index}.imageUrl`} currentImageUrl={item.imageUrl} />
             </div>
           ))}
           <button onClick={() => addItem('features.items')} className="mt-2 text-sm flex items-center gap-2 text-amber-400 font-semibold"><Plus size={16}/> Add Feature</button>
        </Section>

        <Section title="Included Section" id="included" isOpen={!!openSections['included']} onToggle={() => toggleSection('included')}>
            <EditableField label="Section Title" path="included.title" value={get(draftData, 'included.title')} onChange={updateDraftData} />
            <hr className="my-4 border-slate-600"/>
            <EditableField label="List Title" path="included.listTitle" value={get(draftData, 'included.listTitle')} onChange={updateDraftData} />
             {draftData.included.items.map((item, index) => (
             <div key={`included-item-${index}`} className="p-3 my-2 border border-slate-600 rounded-md relative">
                 <h4 className="font-semibold mb-2">Item {index+1}</h4>
                 <button onClick={() => removeItem('included.items', index)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                {renderIconSelector('Icon', `included.items.${index}.icon`, item.icon)}
                <EditableField label="Item text" path={`included.items.${index}.text`} value={item.text} onChange={updateDraftData} />
             </div>
           ))}
           <button onClick={() => addItem('included.items')} className="mt-2 text-sm flex items-center gap-2 text-amber-400 font-semibold"><Plus size={16}/> Add Included Item</button>
            <hr className="my-4 border-slate-600"/>
            <EditableField label="Cost Title" path="included.costTitle" value={get(draftData, 'included.costTitle')} onChange={updateDraftData} />
            <EditableField label="Cost Amount" path="included.cost" value={get(draftData, 'included.cost')} onChange={updateDraftData} />
            <EditableField label="Cost Description" path="included.costDescription" value={get(draftData, 'included.costDescription')} onChange={updateDraftData} />
            <EditableField label="Button Text" path="included.ctaButtonText" value={get(draftData, 'included.ctaButtonText')} onChange={updateDraftData} />
        </Section>

        <Section title="Danger Zone" id="danger" isOpen={!!openSections['danger']} onToggle={() => toggleSection('danger')}>
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="font-semibold">Reset Data</h4>
                    <p className="text-xs text-slate-400">Reverts all content to the original defaults.</p>
                </div>
                <button onClick={handleReset} className="text-sm bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Reset to Defaults</button>
            </div>
             <div className="flex justify-between items-center mt-4">
                <div>
                    <h4 className="font-semibold">Logout</h4>
                    <p className="text-xs text-slate-400">End your current session.</p>
                </div>
                <button onClick={logout} className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold py-2 px-4 rounded-lg">
                    <LogOut size={16} /> Logout
                </button>
            </div>
        </Section>
        
      </div>
      <div className="p-4 bg-slate-900 border-t border-slate-700 flex justify-end items-center gap-4 shrink-0">
          <button 
            onClick={handleDiscard} 
            disabled={!isDirty || isSaving}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-100 font-bold py-2 px-4 rounded-lg transition-colors"
           >
              <RotateCcw size={16} /> Discard Changes
          </button>
          <button 
            onClick={handleSave} 
            disabled={!isDirty || isSaving}
            className={`flex items-center justify-center gap-2 w-40 text-slate-900 font-bold py-2 px-4 rounded-lg transition-all duration-300
              ${isSaving ? 'bg-slate-600 text-slate-400 cursor-not-allowed' : ''}
              ${saveSuccess ? 'bg-green-500' : 'bg-gradient-to-r from-amber-500 to-yellow-400'}
              ${!isDirty && !isSaving && !saveSuccess ? 'disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed' : 'hover:opacity-90'}
            `}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {isSaving ? (
                <motion.div key="saving" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  <span>Saving...</span>
                </motion.div>
              ) : saveSuccess ? (
                <motion.div key="success" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center gap-2">
                  <Check size={16} />
                  <span>Saved!</span>
                </motion.div>
              ) : (
                <motion.div key="default" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-center gap-2">
                   <Save size={16} />
                   <span>Save Changes</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
      </div>
       {saveError && <div className="absolute bottom-20 right-4 bg-red-800 text-white text-sm p-3 rounded-lg shadow-lg">{saveError}</div>}
    </motion.div>
  );
};

export default AdminPanel;