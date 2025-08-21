
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import Footer from './Footer';
import IconMapper from './IconMapper';
import { ArrowRight, Star, Menu, X, CheckCircle } from 'lucide-react';

const sectionVariants: Variants = {
  offscreen: { opacity: 0, y: 50 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      staggerChildren: 0.2
    },
  },
};

const itemVariants: Variants = {
  offscreen: { opacity: 0, y: 30 },
  onscreen: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const LandingHeader = ({ scrollToSection }: { scrollToSection: (id: string) => void }) => {
    const { data } = useData();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const navLinks = [
        { name: 'Quiénes Somos', id: 'about' },
        { name: 'Servicios', id: 'services' },
        { name: 'Planes', id: 'plans' },
        { name: 'Testimonios', id: 'testimonials' },
    ];
    
    if (!data) return null;

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-slate-950/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
                <div className="container mx-auto px-6 md:px-8 flex justify-between items-center h-20">
                    <motion.img 
                        src={data.logoUrl} 
                        alt="Lati Logo" 
                        className="w-40 h-auto cursor-pointer"
                        onClick={() => scrollToSection('hero')}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    />
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                             <div 
                                key={link.id}
                                className="relative"
                                onMouseEnter={() => link.id === 'services' && setIsMegaMenuOpen(true)}
                                onMouseLeave={() => link.id === 'services' && setIsMegaMenuOpen(false)}
                             >
                                <button onClick={() => scrollToSection(link.id)} className="text-slate-300 hover:text-[var(--color-primary)] transition-colors font-medium">
                                    {link.name}
                                </button>
                                {link.id === 'services' && isMegaMenuOpen && (
                                    <MegaMenu scrollToSection={scrollToSection} closeMenu={() => setIsMegaMenuOpen(false)} />
                                )}
                             </div>
                        ))}
                        <motion.button 
                             onClick={() => scrollToSection('contact')}
                             className="bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] font-semibold py-2 px-5 rounded-full transition-all duration-300"
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                        >
                            Contacto
                        </motion.button>
                    </nav>
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-2">
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </header>
            <MobileMenu isOpen={isMobileMenuOpen} closeMenu={() => setIsMobileMenuOpen(false)} navLinks={navLinks} scrollToSection={scrollToSection} />
        </>
    );
};

const MegaMenu = ({ scrollToSection, closeMenu }: { scrollToSection: (id: string) => void, closeMenu: () => void }) => {
    const { data } = useData();
    if (!data) return null;

    const services = [
        { icon: 'Camera', title: 'Fotografía y Video' },
        { icon: 'Clapperboard', title: 'Producción de Eventos' },
        { icon: 'Tent', title: 'Decoración y Montaje' },
        { icon: 'Music', title: 'Entretenimiento' },
    ];
    
    const handleClick = (id: string) => {
        scrollToSection(id);
        closeMenu();
    }

    return (
         <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -left-1/2 top-full mt-4 w-screen max-w-lg"
        >
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-lg shadow-2xl border border-slate-700 overflow-hidden">
                <div className="grid grid-cols-2 gap-4 p-6">
                    <div>
                        <h3 className="font-bold text-white mb-4">Nuestros Servicios</h3>
                        <ul className="space-y-3">
                            {services.map(service => (
                                <li key={service.title}>
                                    <button onClick={() => handleClick('services')} className="flex items-center gap-3 text-slate-300 hover:text-[var(--color-primary)] transition-colors w-full text-left">
                                        <IconMapper iconName={service.icon} size={20} />
                                        <span className="text-sm font-medium">{service.title}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-col justify-between">
                         <div className="aspect-video rounded-md overflow-hidden group">
                            <img src={data.features.items[1].imageUrl} alt="Evento Lati" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                         </div>
                         <button onClick={() => handleClick('contact')} className="mt-4 w-full bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 font-bold py-2 px-4 rounded-md text-sm hover:opacity-90 transition-opacity">
                            Cotiza tu Evento
                         </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const MobileMenu = ({ isOpen, closeMenu, navLinks, scrollToSection }: { isOpen: boolean, closeMenu: () => void, navLinks: { name: string, id: string }[], scrollToSection: (id: string) => void }) => {
    
    const handleClick = (id: string) => {
        scrollToSection(id);
        closeMenu();
    };
    
    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 md:hidden"
                onClick={closeMenu}
            >
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed top-0 right-0 h-full w-64 bg-slate-900 border-l border-slate-700 p-6 flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-end mb-8">
                        <button onClick={closeMenu} className="text-white p-2">
                            <X size={28} />
                        </button>
                    </div>
                    <nav className="flex flex-col gap-6">
                        {navLinks.map(link => (
                            <button key={link.id} onClick={() => handleClick(link.id)} className="text-slate-300 hover:text-[var(--color-primary)] transition-colors font-medium text-lg text-left">
                                {link.name}
                            </button>
                        ))}
                        <button onClick={() => handleClick('contact')} className="mt-4 bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 font-bold py-2 px-4 rounded-full text-center">
                            Contacto
                        </button>
                    </nav>
                </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
}


const LandingPage = () => {
    const { data } = useData();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
    
    if (!data) return null;

    const mailtoHref = `mailto:${data.footer.emailAddress}?subject=${encodeURIComponent(
      `Solicitud de Información para Evento`
    )}`;

    return (
        <div className="bg-slate-950 text-slate-100 min-h-screen antialiased overflow-x-hidden">
            <div className="animated-gradient-bg"></div>
            <LandingHeader scrollToSection={scrollToSection} />

            {/* Hero Section */}
            <motion.section
                id="hero"
                className="relative min-h-screen flex flex-col justify-center text-center py-20 overflow-hidden"
                initial="offscreen"
                animate="onscreen"
                variants={sectionVariants}
            >
                <div
                    className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url('${data.hero.backgroundImageUrl}')`, maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
                    aria-hidden="true"
                ></div>
               
                <div className="container mx-auto px-6 md:px-8 relative z-10">
                    <motion.h1 className="text-5xl md:text-7xl font-black mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400" variants={itemVariants}>
                        Creamos Eventos Inolvidables
                    </motion.h1>
                    <motion.p className="max-w-3xl mx-auto text-slate-300 text-lg md:text-xl leading-relaxed mt-6" variants={itemVariants}>
                        Especialistas en graduaciones, fotografía y producción de eventos con un toque único y memorable.
                    </motion.p>
                    <motion.div variants={itemVariants} className="mt-12">
                        <motion.button
                            onClick={() => scrollToSection('contact')}
                            className="bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 font-bold py-4 px-10 rounded-full shadow-lg shadow-[var(--color-primary)]/30 text-lg"
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px var(--color-primary)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Solicita tu Propuesta <ArrowRight className="inline ml-2" />
                        </motion.button>
                    </motion.div>
                </div>
                 <style>{`
                    .animated-gradient-bg {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: -20;
                        background: linear-gradient(300deg, #0f172a, #1e1b4b, #312e81, #0f172a);
                        background-size: 200% 200%;
                        animation: gradient-animation 20s ease infinite;
                    }

                    @keyframes gradient-animation {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                `}</style>
            </motion.section>

            {/* About Us Section */}
            <motion.section
                id="about"
                className="py-24"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}
            >
                <div className="container mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div variants={itemVariants}>
                        <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">Quiénes Somos</h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            En Lati K Publicidad, somos más que organizadores de eventos; somos arquitectos de experiencias. Con años de dedicación en el sector, nos especializamos en transformar momentos importantes en recuerdos imborrables.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            Nuestra pasión es la creatividad y la excelencia, cuidando cada detalle para que tu celebración supere todas las expectativas.
                        </p>
                    </motion.div>
                    <motion.div className="aspect-video rounded-lg shadow-2xl shadow-[var(--color-primary)]/20 overflow-hidden" variants={itemVariants}>
                        <img src={data.proposal.cards[0].imageUrl} alt="Equipo Lati K" className="w-full h-full object-cover"/>
                    </motion.div>
                </div>
            </motion.section>

             {/* Services Section */}
            <motion.section
                id="services"
                className="py-24 bg-slate-900/50"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}
            >
                <div className="container mx-auto px-6 md:px-8">
                    <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[var(--color-primary)]" variants={itemVariants}>
                        Nuestros Servicios
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: 'Camera', title: 'Fotografía y Video', description: 'Capturamos la esencia de tu evento con equipos de última generación y un ojo artístico.' },
                            { icon: 'Clapperboard', title: 'Producción de Eventos', description: 'Logística, planificación y ejecución impecable para que no te preocupes por nada.' },
                            { icon: 'Tent', title: 'Decoración y Montaje', description: 'Creamos ambientes temáticos espectaculares que transportan a tus invitados.' },
                            { icon: 'Music', title: 'Entretenimiento', description: 'Desde DJs hasta shows en vivo, garantizamos la mejor atmósfera para tu celebración.' },
                        ].map(service => (
                            <motion.div key={service.title} className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center flex flex-col items-center hover:border-[var(--color-primary)] transition-colors" variants={itemVariants}>
                                <div className="text-[var(--color-primary)] mb-4"><IconMapper iconName={service.icon} size={40} /></div>
                                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                <p className="text-slate-400 text-sm">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Gallery Section */}
            <motion.section
                 id="gallery"
                 className="py-24"
                 initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}
            >
                <div className="container mx-auto px-6 md:px-8">
                     <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[var(--color-primary)]" variants={itemVariants}>
                        Nuestro Trabajo
                    </motion.h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data.features.items.map((feature, index) => (
                            <motion.div key={index} className="aspect-square overflow-hidden rounded-lg group" variants={itemVariants}>
                                <img src={feature.imageUrl} alt={feature.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Plans Section */}
            <motion.section
                id="plans"
                className="py-24 bg-slate-900/50"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}
            >
                <div className="container mx-auto px-6 md:px-8">
                    <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-[var(--color-primary)]" variants={itemVariants}>
                        Planes a tu Medida
                    </motion.h2>
                    <motion.p className="text-center text-slate-400 max-w-2xl mx-auto mb-12" variants={itemVariants}>
                        Elige el paquete que mejor se adapte a tu visión y presupuesto. ¿Necesitas algo diferente? Contáctanos para una propuesta 100% personalizada.
                    </motion.p>
                    <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                        {/* Plan 1 */}
                        <motion.div className="bg-slate-800 p-8 rounded-lg border border-slate-700 flex flex-col" variants={itemVariants}>
                            <h3 className="text-2xl font-bold text-center mb-2">Esencial</h3>
                            <p className="text-slate-400 text-center mb-6">Ideal para eventos íntimos y bien definidos.</p>
                            <ul className="space-y-3 text-slate-300 mb-8 flex-grow">
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>Fotografía Profesional (4h)</span></li>
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>Coordinación del día del evento</span></li>
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>Música Ambiental y DJ</span></li>
                            </ul>
                            <button onClick={() => scrollToSection('contact')} className="mt-auto w-full bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors">
                                Consultar
                            </button>
                        </motion.div>
                        {/* Plan 2 - Destacado */}
                        <motion.div className="bg-slate-800 p-8 rounded-lg border-2 border-[var(--color-primary)] flex flex-col relative shadow-2xl shadow-[var(--color-primary)]/20" variants={itemVariants} style={{ transform: 'scale(1.05)' }}>
                             <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 text-sm font-bold px-4 py-1 rounded-full">
                                MÁS POPULAR
                            </div>
                            <h3 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-2">Avanzado</h3>
                            <p className="text-slate-400 text-center mb-6">La solución completa para un evento espectacular.</p>
                            <ul className="space-y-3 text-slate-300 mb-8 flex-grow">
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>Fotografía y Video Profesional (8h)</span></li>
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>Planificación y Coordinación Completa</span></li>
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>Decoración Temática Personalizada</span></li>
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>DJ, Iluminación y Sonido Pro</span></li>
                            </ul>
                            <button onClick={() => scrollToSection('contact')} className="mt-auto w-full bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">
                                Cotizar Ahora
                            </button>
                        </motion.div>
                        {/* Plan 3 */}
                        <motion.div className="bg-slate-800 p-8 rounded-lg border border-slate-700 flex flex-col" variants={itemVariants}>
                            <h3 className="text-2xl font-bold text-center mb-2">Premium</h3>
                            <p className="text-slate-400 text-center mb-6">La experiencia de lujo definitiva, sin límites.</p>
                            <ul className="space-y-3 text-slate-300 mb-8 flex-grow">
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>Todo lo del Plan Avanzado</span></li>
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>Cobertura Cinematográfica (Drone, etc.)</span></li>
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>Entretenimiento en Vivo y Shows</span></li>
                                <li className="flex gap-3"><CheckCircle className="text-[var(--color-primary)] w-5 h-5 shrink-0 mt-1"/><span>Diseño y Montaje de Lujo</span></li>
                            </ul>
                             <button onClick={() => scrollToSection('contact')} className="mt-auto w-full bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-600 transition-colors">
                                Consultar
                            </button>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Testimonials Section */}
            <motion.section
                id="testimonials"
                className="py-24"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}
            >
                <div className="container mx-auto px-6 md:px-8">
                    <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[var(--color-primary)]" variants={itemVariants}>
                        Lo Que Dicen Nuestros Clientes
                    </motion.h2>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            { quote: '¡El mejor evento de graduación! La organización fue impecable y la fiesta inolvidable. Gracias Lati K.', name: 'Ana Sofía R.', event: 'Graduación de Medicina' },
                            { quote: 'Profesionalismo y creatividad de principio a fin. Las fotos quedaron espectaculares y el ambiente fue mágico.', name: 'Carlos Mendoza', event: 'Lanzamiento de Marca' },
                            { quote: 'Superaron nuestras expectativas. Cada detalle fue perfecto. Sin duda los mejores para cualquier tipo de evento.', name: 'Valeria G.', event: 'Fiesta de Aniversario' },
                        ].map(testimonial => (
                             <motion.div key={testimonial.name} className="bg-slate-800 p-8 rounded-lg border border-slate-700" variants={itemVariants}>
                                <div className="flex text-[var(--color-primary)] mb-4">
                                    {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" />)}
                                </div>
                                <p className="text-slate-300 italic mb-6">"{testimonial.quote}"</p>
                                <div className="text-right">
                                    <p className="font-bold text-white">{testimonial.name}</p>
                                    <p className="text-sm text-slate-400">{testimonial.event}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

             {/* Final CTA Section */}
            <motion.section
                id="contact"
                className="py-24 relative"
                 initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.4 }} variants={sectionVariants}
            >
                 <div 
                  className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true"
                >
                  <div 
                    className="relative left-1/2 aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] opacity-20" 
                    style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
                  ></div>
                </div>
                <div className="container mx-auto px-6 md:px-8 text-center">
                    <motion.h2 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400" variants={itemVariants}>
                       ¿Listo para planear tu evento?
                    </motion.h2>
                    <motion.p className="max-w-2xl mx-auto text-slate-300 md:text-lg mt-6" variants={itemVariants}>
                        Contáctanos hoy mismo y déjanos convertir tu visión en una realidad espectacular. Estamos aquí para responder a todas tus preguntas y empezar a diseñar tu propuesta personalizada.
                    </motion.p>
                     <motion.div variants={itemVariants} className="mt-12">
                        <a href={mailtoHref}>
                            <motion.button
                                className="bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 font-bold py-4 px-10 rounded-full shadow-lg shadow-[var(--color-primary)]/30 text-lg"
                                whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px var(--color-primary)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Hablemos de tu Evento
                            </motion.button>
                        </a>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </div>
    );
};

export default LandingPage;