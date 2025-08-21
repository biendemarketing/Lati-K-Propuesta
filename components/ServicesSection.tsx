
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import IconMapper from './IconMapper';

const sectionVariants: Variants = {
  offscreen: { opacity: 0 },
  onscreen: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

type IconCardProps = {
  icon: React.ReactNode;
  title: string;
  items: string[];
  imageUrl?: string;
};

const IconCard = ({ icon, title, items, imageUrl }: IconCardProps) => (
  <motion.div
    className="bg-slate-800 rounded-lg border border-slate-700 h-full hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col overflow-hidden group"
    variants={itemVariants}
  >
    {imageUrl && (
      <div className="h-48 w-full overflow-hidden shrink-0 print:h-24">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
    )}
    <div className="p-6 flex-grow print:p-3">
      <div className="flex items-center mb-4 print:mb-2">
        <span className="text-amber-400 mr-4 print:mr-2">{icon}</span>
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <ul className="list-disc list-inside text-slate-300 space-y-1">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const ServicesSection = () => {
  const { data } = useData();
  const { services } = data;

  const enabledServices = services.cards.filter(service => service.enabled);

  return (
    <motion.section 
      className="py-24 print-slide"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
      variants={sectionVariants}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-amber-400"
        variants={itemVariants}
      >
        {services.title}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 print:grid-cols-4 print:gap-4">
        {enabledServices.map((service, index) => (
          <IconCard 
            key={index} 
            icon={<IconMapper iconName={service.icon} />} 
            title={service.title} 
            items={service.items} 
            imageUrl={service.imageUrl} 
          />
        ))}
      </div>
    </motion.section>
  );
};

export default ServicesSection;
