
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useData } from '../contexts/DataContext';

type SectionWrapperProps = {
  children: React.ReactNode;
};

const SectionWrapper = ({ children }: SectionWrapperProps) => (
  <motion.div
    initial="offscreen"
    whileInView="onscreen"
    viewport={{ once: true, amount: 0.3 }}
    transition={{ staggerChildren: 0.2 }}
    className="py-24 print-slide"
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
    className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex flex-col md:flex-row group print:flex-row"
    variants={contentVariants}
  >
    <div className="md:w-1/2 h-64 md:h-96 overflow-hidden shrink-0 print:h-auto print:w-1/2">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>
    <div className="md:w-1/2 p-8 flex flex-col justify-center print:p-4 print:w-1/2">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-slate-300 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const ProposalSection = () => {
  const { data } = useData();
  const { proposal } = data;

  return (
    <SectionWrapper>
      <Title>{proposal.title}</Title>
      <div className="space-y-12 print:space-y-0 print:flex print:gap-8">
        {proposal.cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            imageUrl={card.imageUrl}
          />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default ProposalSection;
