
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ChevronDown, ChevronRight, LogOut, Plus, Trash2, Save, RotateCcw } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { iconNames } from './IconMapper';
import ImageUploader from './ImageUploader';

const AdminPanel = ({ closePanel }: { closePanel: () => void }) => {
  const { draftData, updateDraftData, resetData, addItem, removeItem, saveChanges, isDirty, discardChanges } = useData();
  const { logout } = useAuth();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
      general: true
  });

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

  const handleSave = () => {
    saveChanges();
    closePanel();
  };

  const handleInputChange = (path: string, value: string | boolean | string[]) => {
    updateDraftData(path, value);
  };
  
  const handleSelectChange = (path: string, value: string) => {
    updateDraftData(path, value);
  };

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };
  
  const renderField = (label: string, path: string, type: 'text' | 'textarea' = 'text') => {
    const getNestedValue = (obj: any, pathStr: string): string => {
        return pathStr.split('.').reduce((acc, part) => acc && acc[part], obj) || '';
    }
    const value = getNestedValue(draftData, path);

    return (
        <div className="mb-4">
            <label className="block text-xs font-medium text-slate-400 mb-1">{label}</label>
            {type === 'textarea' ? (
                <textarea
                    value={value}
                    onChange={(e) => handleInputChange(path, e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                    rows={3}
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleInputChange(path, e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
            )}
        </div>
    );
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

  const Section = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => (
    <div className="border-b border-slate-700">
      <button onClick={() => toggleSection(id)} className="w-full flex justify-between items-center p-4 hover:bg-slate-700/50">
        <h3 className="font-semibold text-lg">{title}</h3>
        {openSections[id] ? <ChevronDown /> : <ChevronRight />}
      </button>
      {openSections[id] && <div className="p-4 bg-slate-800/50">{children}</div>}
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
        
        <Section title="General Settings" id="general">
          <ImageUploader path="logoUrl" currentImageUrl={draftData.logoUrl} />
        </Section>
        
        <Section title="Hero Section" id="hero">
          <ImageUploader path="hero.backgroundImageUrl" currentImageUrl={draftData.hero.backgroundImageUrl} />
          {renderField('Subtitle', 'hero.subtitle')}
          {renderField('Title', 'hero.title')}
          {renderField('Description', 'hero.description', 'textarea')}
          <div className="grid grid-cols-2 gap-4">
            {renderField('Client Label', 'hero.clientLabel')}
            {renderField('Client Name', 'hero.clientName')}
            {renderField('Activity Label', 'hero.activityLabel')}
            {renderField('Activity Name', 'hero.activityName')}
            {renderField('Theme Label', 'hero.themeLabel')}
            {renderField('Theme Name', 'hero.themeName')}
          </div>
        </Section>

        <Section title="Proposal Section" id="proposal">
           {renderField('Section Title', 'proposal.title')}
           {draftData.proposal.cards.map((card, index) => (
             <div key={index} className="p-3 my-2 border border-slate-600 rounded-md relative">
                <h4 className="font-semibold mb-2">Card {index+1}</h4>
                 <button onClick={() => removeItem('proposal.cards', index)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                <input type="text" value={card.title} onChange={(e) => handleInputChange(`proposal.cards.${index}.title`, e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm mb-2" placeholder="Card Title" />
                <textarea value={card.description} onChange={(e) => handleInputChange(`proposal.cards.${index}.description`, e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm mb-2" placeholder="Card Description" />
                <ImageUploader path={`proposal.cards.${index}.imageUrl`} currentImageUrl={card.imageUrl} />
             </div>
           ))}
           <button onClick={() => addItem('proposal.cards')} className="mt-2 text-sm flex items-center gap-2 text-amber-400 font-semibold"><Plus size={16}/> Add Proposal Card</button>
        </Section>
        
        <Section title="Services Section" id="services">
            {renderField('Section Title', 'services.title')}
            {draftData.services.cards.map((card, index) => (
             <div key={index} className="p-3 my-2 border border-slate-600 rounded-md relative">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Service Card {index+1}</h4>
                    <button onClick={() => removeItem('services.cards', index)} className="p-1 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id={`service_enabled_${index}`} checked={card.enabled} onChange={(e) => handleInputChange(`services.cards.${index}.enabled`, e.target.checked)} />
                    <label htmlFor={`service_enabled_${index}`} className="text-sm font-medium">Enabled</label>
                </div>
                <input type="text" value={card.title} onChange={(e) => handleInputChange(`services.cards.${index}.title`, e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm mb-2" placeholder="Service Title" />
                {renderIconSelector('Icon', `services.cards.${index}.icon`, card.icon)}
                <textarea value={card.items.join('\n')} onChange={(e) => handleInputChange(`services.cards.${index}.items`, e.target.value.split('\n'))} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm mb-2" placeholder="List items (one per line)" />
                <ImageUploader path={`services.cards.${index}.imageUrl`} currentImageUrl={card.imageUrl} />
             </div>
           ))}
           <button onClick={() => addItem('services.cards')} className="mt-2 text-sm flex items-center gap-2 text-amber-400 font-semibold"><Plus size={16}/> Add Service Card</button>
        </Section>

         <Section title="Features Section" id="features">
            {renderField('Section Title', 'features.title')}
            {draftData.features.items.map((item, index) => (
             <div key={index} className="p-3 my-2 border border-slate-600 rounded-md relative">
                 <h4 className="font-semibold mb-2">Feature {index+1}</h4>
                 <button onClick={() => removeItem('features.items', index)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                 <div className="flex items-center gap-2 mb-2">
                    <input type="checkbox" id={`feature_reverse_${index}`} checked={item.reverse} onChange={(e) => handleInputChange(`features.items.${index}.reverse`, e.target.checked)} />
                    <label htmlFor={`feature_reverse_${index}`} className="text-sm font-medium">Reverse Layout</label>
                </div>
                <input type="text" value={item.title} onChange={(e) => handleInputChange(`features.items.${index}.title`, e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm mb-2" placeholder="Feature Title" />
                {renderIconSelector('Icon', `features.items.${index}.icon`, item.icon)}
                <textarea value={item.description} onChange={(e) => handleInputChange(`features.items.${index}.description`, e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm mb-2" placeholder="Feature Description" />
                <ImageUploader path={`features.items.${index}.imageUrl`} currentImageUrl={item.imageUrl} />
             </div>
           ))}
           <button onClick={() => addItem('features.items')} className="mt-2 text-sm flex items-center gap-2 text-amber-400 font-semibold"><Plus size={16}/> Add Feature</button>
        </Section>

        <Section title="Included Section" id="included">
            {renderField('Section Title', 'included.title')}
            <hr className="my-4 border-slate-600"/>
            {renderField('List Title', 'included.listTitle')}
             {draftData.included.items.map((item, index) => (
             <div key={index} className="p-3 my-2 border border-slate-600 rounded-md relative">
                 <h4 className="font-semibold mb-2">Item {index+1}</h4>
                 <button onClick={() => removeItem('included.items', index)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-400"><Trash2 size={16}/></button>
                {renderIconSelector('Icon', `included.items.${index}.icon`, item.icon)}
                <input type="text" value={item.text} onChange={(e) => handleInputChange(`included.items.${index}.text`, e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm mb-2" placeholder="Item text" />
             </div>
           ))}
           <button onClick={() => addItem('included.items')} className="mt-2 text-sm flex items-center gap-2 text-amber-400 font-semibold"><Plus size={16}/> Add Included Item</button>
            <hr className="my-4 border-slate-600"/>
            {renderField('Cost Title', 'included.costTitle')}
            {renderField('Cost Amount', 'included.cost')}
            {renderField('Cost Description', 'included.costDescription')}
            {renderField('Button Text', 'included.ctaButtonText')}
        </Section>

        <Section title="Danger Zone" id="danger">
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="font-semibold">Reset Data</h4>
                    <p className="text-xs text-slate-400">Reverts all content to the original defaults.</p>
                </div>
                <button onClick={resetData} className="text-sm bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Reset to Defaults</button>
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
            disabled={!isDirty}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-100 font-bold py-2 px-4 rounded-lg transition-colors"
           >
              <RotateCcw size={16} /> Discard Changes
          </button>
          <button 
            onClick={handleSave} 
            disabled={!isDirty}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:opacity-90 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-slate-900 font-bold py-2 px-4 rounded-lg transition-opacity"
          >
              <Save size={16} /> Save Changes
          </button>
      </div>
    </motion.div>
  );
};

export default AdminPanel;
