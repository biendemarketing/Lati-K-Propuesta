
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950/50 border-t border-slate-800">
      <div className="container mx-auto px-6 md:px-8 py-12">
        <div className="text-center mb-12">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/drossmediapro.appspot.com/o/logo%20lati%20actual%202023%20(2)-04.png?alt=media&token=6a2bb838-c3a1-4162-b438-603bd74d836a" 
              alt="Lati K Publicidad Logo" 
              className="w-72 mx-auto"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              <Phone size={20} className="text-amber-400 mr-3" />
              <h4 className="font-bold text-lg">Cel/Whatsapp</h4>
            </div>
            <a href="tel:+18292862601" className="text-slate-300 hover:text-amber-400 transition-colors">+1 829 286 2601</a>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              <Mail size={20} className="text-amber-400 mr-3" />
              <h4 className="font-bold text-lg">Email</h4>
            </div>
            <a href="mailto:LATIKPUBLICIDAD@GMAIL.COM" className="text-slate-300 hover:text-amber-400 transition-colors break-all">LATIKPUBLICIDAD@GMAIL.COM</a>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              <MapPin size={20} className="text-amber-400 mr-3" />
              <h4 className="font-bold text-lg">Dirección</h4>
            </div>
            <p className="text-slate-300">C/ Principal #20, 1er Nivel, Guaricano, Villa Mella, SDN</p>
          </div>
        </div>
        <div className="text-center text-slate-500 mt-12 pt-8 border-t border-slate-800">
          <p>&copy; {new Date().getFullYear()} Lati K Publicidad. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;