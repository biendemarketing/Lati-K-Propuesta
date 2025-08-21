
import React from 'react';
import { motion, Variants } from 'framer-motion';

type SectionWrapperProps = {
  children: React.ReactNode;
};

const SectionWrapper = ({ children }: SectionWrapperProps) => (
  <motion.div
    initial="offscreen"
    whileInView="onscreen"
    viewport={{ once: true, amount: 0.3 }}
    transition={{ staggerChildren: 0.2 }}
    className="py-24 print-page-break"
  >
    {children}
  </motion.div>
);

type TitleProps = {
  children: React.ReactNode;
};

const contentVariants: Variants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: { y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
};

const Title = ({ children }: TitleProps) => (
  <motion.h2 
    className="text-4xl md:text-5xl font-bold text-center mb-12 text-amber-400"
    variants={contentVariants}
  >
    {children}
  </motion.h2>
);

type CardProps = {
  title: string;
  description: string;
  imageUrl: string;
};

const Card = ({ title, description, imageUrl }: CardProps) => (
  <motion.div
    className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex flex-col md:flex-row group"
    variants={contentVariants}
  >
    <div className="md:w-1/2 h-64 md:h-96 overflow-hidden shrink-0">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>
    <div className="md:w-1/2 p-8 flex flex-col justify-center">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-300 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const ProposalSection = () => {
  return (
    <SectionWrapper>
      <Title>Propuesta de Ambientación</Title>
      <div className="space-y-12">
        <Card
          title="Decoración de Entrada: Pista de Carreras"
          description="Montaje de un camino simulando una pista de carreras, con columnas de cuadros blancos y negros. Una simulación de pista negra con líneas blancas, gomas y banderines para que los invitados sientan que están entrando a una carrera de Fórmula 1."
          imageUrl="https://i.pinimg.com/1200x/00/53/92/005392f76e2c520aa9244466cab10066.jpg"
        />
        <Card
          title="Decoración del Escenario: Meta de Carrera"
          description="Escenografía para el fondo del escenario con tema de carreras. Recrearemos una meta con un letrero de 'FINISH' y otros elementos como semáforos, señalizaciones, banderines y gomas de colores para simular la llegada a la meta."
          imageUrl="https://i.pinimg.com/1200x/d8/2c/0d/d82c0d5fd203742288c4d02d5eca6dbe.jpg"
        />
      </div>
    </SectionWrapper>
  );
};

export default ProposalSection;