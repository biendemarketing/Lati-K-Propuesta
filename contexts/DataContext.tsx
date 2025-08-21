
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import set from 'lodash.set';
import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import { supabase } from '../lib/supabaseClient';
import type { Json } from '@supabase/supabase-js';

const initialData = {
  logoUrl: "https://firebasestorage.googleapis.com/v0/b/drossmediapro.appspot.com/o/logo%20lati%20actual%202023%20(2)-04.png?alt=media&token=6a2bb838-c3a1-4162-b438-603bd74d836a",
  hero: {
    backgroundImageUrl: "https://cdn.magicdecor.in/com/2025/01/22172354/Red-Formula-One-Car-Wallpaper-Mural.jpg",
    subtitle: "Propuesta de Lanzamiento",
    title: "Promoción 2025",
    clientLabel: "Cliente",
    clientName: "Politécnico Aragón, promoción",
    activityLabel: "Actividad",
    activityName: "Lanzamiento de promoción",
    themeLabel: "Tema",
    themeName: "Circuito de Carreras (F1)",
    description: "Es para nosotros un honor formar parte de este momento inolvidable. Con 15 años de experiencia, garantizamos un resultado óptimo que quedará para siempre en los recuerdos de cada uno de los participantes."
  },
  proposal: {
    title: "Propuesta de Ambientación",
    cards: [
      {
        title: "Decoración de Entrada: Pista de Carreras",
        description: "Montaje de un camino simulando una pista de carreras, con columnas de cuadros blancos y negros. Una simulación de pista negra con líneas blancas, gomas y banderines para que los invitados sientan que están entrando a una carrera de Fórmula 1.",
        imageUrl: "https://i.pinimg.com/1200x/00/53/92/005392f76e2c520aa9244466cab10066.jpg"
      },
      {
        title: "Decoración del Escenario: Meta de Carrera",
        description: "Escenografía para el fondo del escenario con tema de carreras. Recrearemos una meta con un letrero de 'FINISH' y otros elementos como semáforos, señalizaciones, banderines y gomas de colores para simular la llegada a la meta.",
        imageUrl: "https://i.pinimg.com/1200x/d8/2c/0d/d82c0d5fd203742288c4d02d5eca6dbe.jpg"
      }
    ]
  },
  services: {
    title: "Producción Técnica y Efectos",
    cards: [
      {
        icon: "Music",
        title: "Sonido Profesional",
        items: ["DJ Profesional", "Bocinas Amplificadas", "Bajos Amplificados", "Consola Mixer", "Micrófonos Inalámbricos"],
        imageUrl: "https://i.pinimg.com/1200x/03/a5/c2/03a5c2680c42b8749977c81f0530f3dd.jpg",
        enabled: true,
      },
      {
        icon: "Sparkles",
        title: "Efectos Especiales",
        items: ["Máquina de Confeti", "Máquina de Humo", "Pirotecnia Fría"],
        imageUrl: "https://i.pinimg.com/736x/0b/60/52/0b60522f443304a8c79fe2c141aa30c1.jpg",
        enabled: true,
      },
      {
        icon: "UserCheck",
        title: "Personal Técnico",
        items: ["Técnico para Sonido", "Técnico para Efectos"],
        imageUrl: "https://i.pinimg.com/1200x/3f/ff/e1/3fffe126f54f0ed032a68095cec1d1ba.jpg",
        enabled: true,
      },
      {
        icon: "Construction",
        title: "Estructuras Truss",
        items: ["Estructura para Escenario", "Estructura para Área de Fotos"],
        imageUrl: "https://i.pinimg.com/1200x/07/c9/61/07c961d3018391638bc2581fdb689402.jpg",
        enabled: true,
      }
    ]
  },
  features: {
      title: "Experiencias Adicionales",
      items: [
          {
              icon: "Tent",
              title: "Área de Fotos Interactiva",
              description: "Una escenografía acorde al tema del evento para que los invitados se tomen fotos. Estará colocada en los laterales del escenario central, siendo completamente interactiva.",
              imageUrl: "https://i.pinimg.com/736x/a5/81/54/a58154ebb4f370385ef39c2d6f0ccd62.jpg",
              reverse: false
          },
          {
              icon: "Video",
              title: "Plataforma Videobook 360",
              description: "Se montará un Videobook 360 en la entrada para que los invitados puedan grabar videos al llegar y luego seguir la 'carrera' hasta la meta, creando recuerdos dinámicos desde el primer momento.",
              imageUrl: "https://i.pinimg.com/1200x/87/f9/ce/87f9ce883d23b69fbf8434b471cbdcc6.jpg",
              reverse: true
          },
          {
              icon: "Sparkles",
              title: "Letras Gigantes 'PROMO 2025'",
              description: "Para destacar el año de la promoción, colocaremos letras iluminadas con el texto 'PROMO 2025', dejando plasmado este año en los recuerdos de la promoción de una forma espectacular.",
              imageUrl: "https://m.media-amazon.com/images/I/71CrT-1QdEL._UF894,1000_QL80_.jpg",
              reverse: false
          }
      ]
  },
  included: {
      title: "Todo Incluido",
      listTitle: "Otros Servicios Incluidos",
      items: [
          { icon: "Camera", text: "Fotógrafo para cubrir el evento" },
          { icon: "CheckCircle", text: "Fotos generales del evento" },
          { icon: "Package", text: "Videos para redes sociales" },
          { icon: "Truck", text: "Montaje, desmontaje y transporte de equipos" },
          { icon: "Users", text: "Equipo de staff para acompañar en el evento" }
      ],
      costTitle: "Costo del Lanzamiento",
      cost: "RD $160,000",
      costDescription: "Un paquete completo para un evento inolvidable.",
      ctaButtonText: "Contactar Ahora"
  },
  footer: {
      logoAlt: "Lati K Publicidad Logo",
      phoneLabel: "Cel/Whatsapp",
      phoneNumber: "+1 829 286 2601",
      emailLabel: "Email",
      emailAddress: "LATIKPUBLICIDAD@GMAIL.COM",
      addressLabel: "Dirección",
      address: "C/ Principal #20, 1er Nivel, Guaricano, Villa Mella, SDN",
      copyright: "© {year} Lati K Publicidad. Todos los derechos reservados."
  }
};

type ProposalData = typeof initialData;

const newItemsTemplates = {
    'proposal.cards': { title: "New Proposal", description: "Details...", imageUrl: "" },
    'services.cards': { icon: "Sparkles", title: "New Service", items: [], imageUrl: "", enabled: true },
    'features.items': { icon: "Sparkles", title: "New Feature", description: "Details...", imageUrl: "", reverse: false },
    'included.items': { icon: "CheckCircle", text: "New included service" }
};

interface DataContextType {
  data: ProposalData | null;
  isLoading: boolean;
  draftData: ProposalData | null;
  isDirty: boolean;
  startEditing: () => void;
  saveChanges: () => Promise<void>;
  discardChanges: () => void;
  updateDraftData: (path: string, value: any) => void;
  addItem: (path: keyof typeof newItemsTemplates) => void;
  removeItem: (path: string, index: number) => void;
  resetData: () => Promise<void>;
  updateData: (path: string, value: any) => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ProposalData | null>(null);
  const [draftData, setDraftData] = useState<ProposalData | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on initial mount
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const { data: proposalData, error } = await supabase
            .from('proposals')
            .select('data')
            .eq('slug', 'default')
            .single();

        if (error) {
            console.error("Error fetching proposal data from Supabase:", error);
            setData(initialData); // Fallback to hardcoded data on error
        } else if (proposalData) {
            setData(proposalData.data as ProposalData);
        } else {
            console.error("No proposal with slug 'default' found.");
            setData(initialData); // Fallback if no data is found
        }
        setIsLoading(false);
    };

    fetchData();
  }, []);
  
  // Check for changes between draft and saved data
  useEffect(() => {
    if (draftData && data) {
      setIsDirty(JSON.stringify(data) !== JSON.stringify(draftData));
    } else {
      setIsDirty(false);
    }
  }, [draftData, data]);
  
  const startEditing = () => {
    setDraftData(cloneDeep(data));
  };
  
  const saveChanges = async () => {
    if (!draftData) return;
    
    const { data: updatedData, error } = await supabase
      .from('proposals')
      .update({ data: draftData as unknown as Json })
      .eq('slug', 'default')
      .select('data')
      .single();

    if (error) {
      console.error("Error saving changes to Supabase:", error);
      alert("Error: Could not save changes.");
    } else if (updatedData) {
      setData(updatedData.data as ProposalData);
      setDraftData(null); // Exit editing mode
    }
  };
  
  const discardChanges = () => {
      setDraftData(cloneDeep(data)); // Reset draft to the original saved data
  };

  const updateDraftData = (path: string, value: any) => {
    setDraftData(prevData => {
      if (!prevData) return null;
      const newData = cloneDeep(prevData);
      set(newData, path, value);
      return newData;
    });
  };
  
  const addItem = (path: keyof typeof newItemsTemplates) => {
    if (!draftData) return;
    const currentArray = get(draftData, path, []);
    const newItem = cloneDeep(newItemsTemplates[path]);
    updateDraftData(path, [...currentArray, newItem]);
  };
  
  const removeItem = (path: string, index: number) => {
    if (!draftData) return;
    const currentArray = get(draftData, path, []);
    const newArray = [...currentArray];
    newArray.splice(index, 1);
    updateDraftData(path, newArray);
  };

  const resetData = async () => {
    if(window.confirm("Are you sure you want to reset all content to the original defaults? This will overwrite the data in the database.")) {
      const { error } = await supabase
          .from('proposals')
          .update({ data: initialData as unknown as Json })
          .eq('slug', 'default');
      
      if (error) {
        console.error("Error resetting data in Supabase:", error);
        alert("Error: Could not reset data.");
      } else {
        setData(initialData);
        if (draftData) {
          setDraftData(cloneDeep(initialData));
        }
      }
    }
  };

  const value: DataContextType = {
    data,
    isLoading,
    draftData,
    isDirty,
    startEditing,
    saveChanges,
    discardChanges,
    updateDraftData,
    addItem,
    removeItem,
    resetData,
    updateData: updateDraftData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === null) {
      throw new Error('useData must be used within an AuthProvider');
  }
  return context;
};