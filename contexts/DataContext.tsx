import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import set from 'lodash.set';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import { supabase } from '../lib/supabaseClient';
import type { ProposalData, ProposalComment } from '../lib/supabaseClient';

// Types
interface DataContextType {
    data: ProposalData | null;
    draftData: ProposalData | null;
    isLoading: boolean;
    isDirty: boolean;
    updateDraftData: (path: string, value: any) => void;
    addItem: (path: string) => void;
    removeItem: (path: string, index: number) => void;
    saveChanges: () => Promise<void>;
    discardChanges: () => void;
    startEditing: () => void;
    resetData: () => Promise<void>;
    createProposal: (proposalName: string) => Promise<string>;
    deleteProposal: (slugToDelete: string) => Promise<void>;
    logProposalView: () => Promise<void>;
    addComment: (author: string, text: string) => Promise<void>;
    updateProposalStatus: (status: ProposalData['status']) => Promise<void>;
    fetchComments: () => Promise<ProposalComment[]>;
}

// Context
const DataContext = createContext<DataContextType | null>(null);

// Provider
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ProposalData | null>(null);
  const [draftData, setDraftData] = useState<ProposalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlug, setCurrentSlug] = useState('default');
  const [isAnalyticsFeatureAvailable, setIsAnalyticsFeatureAvailable] = useState(true);
  const [isCommentsFeatureAvailable, setIsCommentsFeatureAvailable] = useState(true);

  // --- DATA FETCHING & SYNC ---

  const fetchData = useCallback(async (slug: string) => {
    setIsLoading(true);
    const { data: proposalData, error } = await supabase
      .from('proposals')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !proposalData) {
      console.error(`Error fetching data for slug "${slug}":`, error?.message);
      setData(null);
    } else {
      setData(proposalData.data as ProposalData);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const proposalSlug = params.get('proposal') || 'default';
      if (proposalSlug !== currentSlug) {
        setCurrentSlug(proposalSlug);
      }
    };
    handleUrlChange(); // Initial check
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [currentSlug]);

  useEffect(() => {
    fetchData(currentSlug);
  }, [currentSlug, fetchData]);
  
  // Sync draft data whenever master data changes (e.g., after save or slug change)
  useEffect(() => {
    if (data) {
      setDraftData(cloneDeep(data));
    } else {
      setDraftData(null);
    }
  }, [data]);


  // --- STATE & DRAFT MANAGEMENT ---

  const startEditing = () => {
    setDraftData(cloneDeep(data));
  };
  
  const isDirty = useMemo(() => {
    if (!data || !draftData) return false;
    return JSON.stringify(data) !== JSON.stringify(draftData);
  }, [data, draftData]);

  const updateDraftData = (path: string, value: any) => {
    setDraftData(prevData => {
      if (!prevData) return null;
      const newData = cloneDeep(prevData);
      set(newData, path, value);
      return newData;
    });
  };
  
  const discardChanges = () => {
    setDraftData(cloneDeep(data));
  };

  const addItem = (path: string) => {
    const templates: Record<string, any> = {
      'proposal.cards': { title: 'New Card', description: 'New Description', imageUrl: '' },
      'services.cards': { enabled: true, title: 'New Service', icon: 'Sparkles', items: ['New Item'], imageUrl: '' },
      'features.items': { reverse: false, title: 'New Feature', icon: 'Sparkles', description: 'New Description', imageUrl: '' },
      'included.items': { icon: 'CheckCircle', text: 'New Item' }
    };
      
    setDraftData(prevData => {
        if (!prevData) return null;
        const newData = cloneDeep(prevData);
        const array = get(newData, path, []);
        if (Array.isArray(array) && templates[path]) {
            array.push(cloneDeep(templates[path]));
            set(newData, path, array);
        }
        return newData;
    });
  };

  const removeItem = (path: string, index: number) => {
    setDraftData(prevData => {
      if (!prevData) return null;
      const newData = cloneDeep(prevData);
      const array = get(newData, path);
      if (Array.isArray(array)) {
        array.splice(index, 1);
        set(newData, path, array);
      }
      return newData;
    });
  };
  
  // --- DATABASE ACTIONS ---

  const saveChanges = async () => {
    if (!isDirty || !draftData) return;
    
    const { error } = await supabase
      .from('proposals')
      .update({ data: draftData })
      .eq('slug', currentSlug);

    if (error) {
      console.error("Error saving changes:", error);
      throw new Error(`Failed to save: ${error.message}`);
    }
    setData(cloneDeep(draftData)); // Sync master data with draft
  };
  
  const resetData = async () => {
    const { data: defaultData, error: fetchError } = await supabase
      .from('proposals')
      .select('data')
      .eq('slug', 'default')
      .single();
    
    if (fetchError || !defaultData) {
      throw new Error('Failed to fetch default proposal data for reset.');
    }

    const { error: updateError } = await supabase
      .from('proposals')
      .update({ data: defaultData.data })
      .eq('slug', currentSlug);
    
    if (updateError) {
      throw new Error(`Failed to reset data: ${updateError.message}`);
    }
    
    setData(defaultData.data as ProposalData); // Update UI immediately
  };
  
  const createProposal = async (proposalName: string): Promise<string> => {
    const slug = proposalName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!slug) {
        throw new Error("Proposal name cannot be empty or invalid.");
    }

    const { data: existing, error: checkError } = await supabase.from('proposals').select('slug').eq('slug', slug).single();
    if (existing) {
      throw new Error(`A proposal with the name "${proposalName}" already exists.`);
    }
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116: row not found, which is expected
      throw new Error(`Error checking for existing proposal: ${checkError.message}`);
    }

    const { data: defaultProposal, error: fetchError } = await supabase.from('proposals').select('data').eq('slug', 'default').single();
    if (fetchError || !defaultProposal) {
      throw new Error('Could not find the default proposal template to clone.');
    }

    const newProposalData = cloneDeep(defaultProposal.data) as ProposalData;
    set(newProposalData, 'hero.clientName', proposalName.trim());
    
    if (!newProposalData.theme) {
      set(newProposalData, 'theme', {
        name: 'Lati Amber',
        primary: '#f59e0b',
        primaryGradientFrom: '#f59e0b',
        primaryGradientTo: '#facc15',
      });
    }

    if (!newProposalData.template) {
      set(newProposalData, 'template', 'classic');
    }

    if (!newProposalData.status) {
        set(newProposalData, 'status', 'Draft');
    }

    const { error: insertError } = await supabase.from('proposals').insert([{ slug, data: newProposalData }]);
    if (insertError) {
      throw new Error(`Could not create new proposal: ${insertError.message}`);
    }
    return slug;
  };

  const deleteProposal = async (slugToDelete: string) => {
    if (slugToDelete === 'default') {
      throw new Error("The default proposal cannot be deleted.");
    }
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('slug', slugToDelete);

    if (error) {
      console.error("Error deleting proposal:", error);
      throw new Error(`Failed to delete proposal: ${error.message}`);
    }
  };

  // --- NEW FEATURES ---

  const logProposalView = async () => {
    if (!isAnalyticsFeatureAvailable || !currentSlug) return;
    try {
        const { error } = await supabase.from('proposal_views').insert({ proposal_slug: currentSlug });
        if (error) throw error;
    } catch (error: any) {
        if (error.message.includes("Could not find the table")) {
             console.warn("Analytics feature disabled: 'proposal_views' table not found. Please run the setup SQL from 'ProposalListModal.tsx' to enable view tracking.");
             setIsAnalyticsFeatureAvailable(false);
        } else {
             console.error("Error logging proposal view:", error.message);
        }
    }
  };

  const addComment = async (author_name: string, comment_text: string) => {
    if (!currentSlug) throw new Error("No proposal selected.");
    const { error } = await supabase.from('proposal_comments').insert({ proposal_slug: currentSlug, author_name, comment_text });
    if (error) throw new Error(`Failed to add comment: ${error.message}`);
    await updateProposalStatus('Changes Requested');
  };

  const updateProposalStatus = async (status: ProposalData['status']) => {
    if (!data) throw new Error("Original data not loaded.");
    const newData = cloneDeep(data);
    newData.status = status;
    const { error } = await supabase.from('proposals').update({ data: newData }).eq('slug', currentSlug);
    if (error) throw new Error(`Failed to update status: ${error.message}`);
    setData(newData); // Update local state immediately
  };

  const fetchComments = async (): Promise<ProposalComment[]> => {
    if (!isCommentsFeatureAvailable || !currentSlug) return [];
    try {
        const { data: comments, error } = await supabase.from('proposal_comments').select('*').eq('proposal_slug', currentSlug).order('created_at', { ascending: false });
        if (error) throw error;
        return comments || [];
    } catch (error: any) {
      if (error.message.includes("Could not find the table")) {
          console.warn("Comments feature disabled: 'proposal_comments' table not found. Please run the setup SQL from 'AdminPanel.tsx' to enable comments.");
          setIsCommentsFeatureAvailable(false);
      } else {
          console.error("Error fetching comments:", error.message);
      }
      return [];
    }
  };


  // --- VALUE & RETURN ---
  
  const value = {
    data,
    draftData,
    isLoading,
    isDirty,
    updateDraftData,
    addItem,
    removeItem,
    saveChanges,
    discardChanges,
    startEditing,
    resetData,
    createProposal,
    deleteProposal,
    logProposalView,
    addComment,
    updateProposalStatus,
    fetchComments,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook
export const useData = () => {
  const context = useContext(DataContext);
  if (context === null) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};