
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useData } from '../contexts/DataContext';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const Hero = () => {
  const { data } = useData();
  const { hero } = data;

  return (
    <motion.section
      className="relative min-h-screen flex flex-col justify-center text-center py-20 overflow-hidden hero-section print-slide"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('${hero.backgroundImageUrl}')`,
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        }}
        aria-hidden="true"
      ></div>

      <div className="container mx-auto px-6 md:px-8">
        <motion.div variants={itemVariants} className="mb-12 print:mb-8">
            <img 
              src={data.logoUrl}
              alt="Lati Graduaciones & Fotografia Logo" 
              className="w-96 mx-auto print:w-72"
            />
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8 print:mb-4">
          <h2 className="text-xl font-semibold text-amber-400 tracking-widest uppercase print:text-lg">
            {hero.subtitle}
          </h2>
          <h1 className="text-5xl md:text-7xl font-black mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 print:text-5xl">
            {hero.title}
          </h1>
        </motion.div>
        
        <motion.div variants={itemVariants} className="max-w-3xl mx-auto mb-8 bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 print:p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div>
              <p className="font-bold text-amber-400">{hero.clientLabel}:</p>
              <p>{hero.clientName}</p>
            </div>
            <div>
              <p className="font-bold text-amber-400">{hero.activityLabel}:</p>
              <p>{hero.activityName}</p>
            </div>
            <div>
              <p className="font-bold text-amber-400">{hero.themeLabel}:</p>
              <p>{hero.themeName}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.p variants={itemVariants} className="max-w-4xl mx-auto text-slate-300 text-lg md:text-xl leading-relaxed print:text-base">
         {hero.description}
        </motion.p>
      </div>
    </motion.section>
  );
};

export default Hero;
