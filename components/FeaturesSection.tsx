
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import IconMapper from './IconMapper';

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
  const { data } = useData();
  const { features } = data;

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
        {features.title}
      </motion.h2>
      
      <div className="flex flex-col space-y-20 print:space-y-4 print:w-full">
        {features.items.map((feature, index) => (
          <Feature
            key={index}
            icon={<IconMapper iconName={feature.icon} />}
            title={feature.title}
            description={feature.description}
            imageUrl={feature.imageUrl}
            reverse={feature.reverse}
          />
        ))}
      </div>

    </motion.section>
  );
};

export default FeaturesSection;
