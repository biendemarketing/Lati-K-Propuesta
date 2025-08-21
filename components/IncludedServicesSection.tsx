
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { CheckCircle, Camera, Users, Package, Truck, DollarSign } from 'lucide-react';

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
    <span className="text-amber-400 mr-4">{icon}</span>
    <span>{text}</span>
  </motion.li>
);

const IncludedServicesSection = () => {
  return (
    <motion.section
      className="py-24 print-page-break"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-center mb-12 text-amber-400"
        variants={{ hidden: { opacity: 0, y: 50 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}
      >
        Todo Incluido
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-2xl font-bold mb-6">Otros Servicios Incluidos</h3>
          <ul className="space-y-4">
            <ListItem icon={<Camera size={24} />} text="Fotógrafo para cubrir el evento" />
            <ListItem icon={<CheckCircle size={24} />} text="Fotos generales del evento" />
            <ListItem icon={<Package size={24} />} text="Videos para redes sociales" />
            <ListItem icon={<Truck size={24} />} text="Montaje, desmontaje y transporte de equipos" />
            <ListItem icon={<Users size={24} />} text="Equipo de staff para acompañar en el evento" />
          </ul>
        </div>
        
        <motion.div
          className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-amber-500 shadow-2xl shadow-amber-500/20 text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: 'backOut' }}
        >
          <div className="flex justify-center items-center mb-4">
            <DollarSign className="text-amber-400" size={40} />
            <h3 className="text-2xl font-bold ml-2">Costo del Lanzamiento</h3>
          </div>
          <p className="text-6xl font-black text-white my-4">RD $160,000</p>
          <p className="text-slate-400">Un paquete completo para un evento inolvidable.</p>
           <motion.button
            className="mt-8 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold py-3 px-8 rounded-full shadow-lg shadow-amber-500/30 transition-all no-print"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(245, 158, 11, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            Contactar Ahora
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default IncludedServicesSection;