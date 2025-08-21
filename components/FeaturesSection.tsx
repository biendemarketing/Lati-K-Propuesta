
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Camera, Video, Sparkles, Tent } from 'lucide-react';

const sectionVariants: Variants = {
  offscreen: {},
  onscreen: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const featureVariants: Variants = {
  offscreen: { opacity: 0, x: -50 },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

const imageVariants: Variants = {
  offscreen: { opacity: 0, scale: 0.8 },
  onscreen: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

type FeatureProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageUrl: string;
  reverse?: boolean;
};

const Feature = ({ icon, title, description, imageUrl, reverse = false }: FeatureProps) => (
  <motion.div
    className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 print:flex-row print:gap-4`}
    variants={sectionVariants}
  >
    <motion.div className="md:w-1/2" variants={featureVariants}>
      <div className="flex items-center mb-4 print:mb-2">
        <span className="text-amber-400 mr-4 print:mr-2">{icon}</span>
        <h3 className="text-3xl font-bold">{title}</h3>
      </div>
      <p className="text-slate-300 leading-relaxed">{description}</p>
    </motion.div>
    <motion.div 
      className="w-full md:w-1/2 aspect-video rounded-lg shadow-2xl shadow-amber-900/20 overflow-hidden" 
      variants={imageVariants}
    >
      <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
    </motion.div>
  </motion.div>
);

const FeaturesSection = () => {
  return (
    <motion.section
      className="py-24 space-y-20 print:space-y-0 print-slide"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-400"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        Experiencias Adicionales
      </motion.h2>
      
      <div className="flex flex-col space-y-20 print:space-y-4 print:w-full">
        <Feature
          icon={<Tent size={32} />}
          title="Área de Fotos Interactiva"
          description="Una escenografía acorde al tema del evento para que los invitados se tomen fotos. Estará colocada en los laterales del escenario central, siendo completamente interactiva."
          imageUrl="https://i.pinimg.com/736x/a5/81/54/a58154ebb4f370385ef39c2d6f0ccd62.jpg"
        />
        
        <Feature
          icon={<Video size={32} />}
          title="Plataforma Videobook 30"
          description="Se montará un Videobook 360 en la entrada para que los invitados puedan grabar videos al llegar y luego seguir la 'carrera' hasta la meta, creando recuerdos dinámicos desde el primer momento."
          imageUrl="https://i.pinimg.com/1200x/87/f9/ce/87f9ce883d23b69fbf8434b471cbdcc6.jpg"
          reverse={true}
        />

        <Feature
          icon={<Sparkles size={32} />}
          title="Letras Gigantes 'PROMO 2025'"
          description="Para destacar el año de la promoción, colocaremos letras iluminadas con el texto 'PROMO 2025', dejando plasmado este año en los recuerdos de la promoción de una forma espectacular."
          imageUrl="https://m.media-amazon.com/images/I/71CrT-1QdEL._UF894,1000_QL80_.jpg"
        />
      </div>

    </motion.section>
  );
};

export default FeaturesSection;