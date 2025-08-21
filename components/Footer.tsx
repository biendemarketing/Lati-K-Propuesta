
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Footer = () => {
  const { data } = useData();
  const { footer, logoUrl } = data;

  return (
    <footer className="bg-slate-950/50 border-t border-slate-800">
      <div className="container mx-auto px-6 md:px-8 py-12">
        <div className="text-center mb-12">
            <img 
              src={logoUrl}
              alt={footer.logoAlt}
              className="w-72 mx-auto"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              <Phone size={20} className="text-amber-400 mr-3" />
              <h4 className="font-bold text-lg">{footer.phoneLabel}</h4>
            </div>
            <a href={`tel:${footer.phoneNumber}`} className="text-slate-300 hover:text-amber-400 transition-colors">{footer.phoneNumber}</a>
          </div>
          
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              <Mail size={20} className="text-amber-400 mr-3" />
              <h4 className="font-bold text-lg">{footer.emailLabel}</h4>
            </div>
            <a href={`mailto:${footer.emailAddress}`} className="text-slate-300 hover:text-amber-400 transition-colors break-all">{footer.emailAddress}</a>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center mb-2">
              <MapPin size={20} className="text-amber-400 mr-3" />
              <h4 className="font-bold text-lg">{footer.addressLabel}</h4>
            </div>
            <p className="text-slate-300">{footer.address}</p>
          </div>
        </div>
        <div className="text-center text-slate-500 mt-12 pt-8 border-t border-slate-800">
          <p>{footer.copyright.replace('{year}', new Date().getFullYear().toString())}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
