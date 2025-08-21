
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { CheckCircle, Camera, Users, Package, Truck, DollarSign } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import IconMapper from './IconMapper';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
};

type ListItemProps = {
  icon: React.ReactNode;
  text: string;
};

const ListItem = ({ icon, text }: ListItemProps) => (
  <motion.li className="flex items-center text-lg" variants={itemVariants}>
    <span className="text-amber-400 mr-4 print:mr-2">{icon}</span>
    <span>{text}</span>
  </motion.li>
);

const IncludedServicesSection = () => {
  const { data } = useData();
  const { included } = data;

  return (
    <motion.section
      className="py-24 print-slide"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-amber-400"
        variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
      >
        {included.title}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center print:grid-cols-2 print:gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-6 print:mb-4">{included.listTitle}</h3>
          <ul className="space-y-4 print:space-y-2">
            {included.items.map((item, index) => (
              <ListItem 
                key={index} 
                icon={<IconMapper iconName={item.icon} />} 
                text={item.text} 
              />
            ))}
          </ul>
        </div>
        
        <motion.div
          className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-amber-500 shadow-2xl shadow-amber-500/20 text-center print:p-6"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'backOut' }}
        >
          <div className="flex justify-center items-center mb-4 print:mb-2">
            <DollarSign className="text-amber-400" size={40} />
            <h3 className="text-2xl font-bold ml-2">{included.costTitle}</h3>
          </div>
          <p className="text-6xl font-black text-white my-4 print:text-5xl print:my-2">{included.cost}</p>
          <p className="text-slate-400">{included.costDescription}</p>
           <motion.button
            className="mt-8 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-amber-500/30 transition-all no-print"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(245, 158, 11, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {included.ctaButtonText}
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default IncludedServicesSection;
