
import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useData } from '../contexts/DataContext';
import Footer from './Footer';
import IconMapper from './IconMapper';
import { Camera, Clapperboard, Tent, Music, Star, ArrowRight } from 'lucide-react';

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

const LandingPage = () => {
    const { data } = useData();
    if (!data) return null; // Or a loading state

    const mailtoHref = `mailto:${data.footer.emailAddress}?subject=${encodeURIComponent(
      `Solicitud de Información para Evento`
    )}`;

    return (
        <div className="bg-slate-900 text-slate-100 min-h-screen antialiased overflow-x-hidden">
            {/* Hero Section */}
            <motion.section
                className="relative min-h-screen flex flex-col justify-center text-center py-20 overflow-hidden"
                initial="offscreen"
                animate="onscreen"
                variants={sectionVariants}
            >
                <div
                    className="absolute inset-0 -z-10 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url('${data.hero.backgroundImageUrl}')`, maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)' }}
                    aria-hidden="true"
                ></div>
                <div className="absolute inset-0 -z-20 bg-gradient-to-b from-slate-900/50 to-slate-900"></div>

                <div className="container mx-auto px-6 md:px-8">
                    <motion.img src={data.logoUrl} alt="Lati Logo" className="w-96 mx-auto mb-8" variants={itemVariants} />
                    <motion.h1 className="text-5xl md:text-7xl font-black mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400" variants={itemVariants}>
                        Creamos Eventos Inolvidables
                    </motion.h1>
                    <motion.p className="max-w-3xl mx-auto text-slate-300 text-lg md:text-xl leading-relaxed mt-6" variants={itemVariants}>
                        Especialistas en graduaciones, fotografía y producción de eventos con un toque único y memorable.
                    </motion.p>
                    <motion.div variants={itemVariants} className="mt-12">
                        <a href={mailtoHref}>
                            <motion.button
                                className="bg-gradient-to-r from-[var(--color-primary-gradient-from)] to-[var(--color-primary-gradient-to)] text-slate-900 font-bold py-4 px-10 rounded-full shadow-lg shadow-amber-500/30 text-lg"
                                whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(245, 158, 11, 0.5)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Solicita tu Propuesta <ArrowRight className="inline ml-2" />
                            </motion.button>
                        </a>
                    </motion.div>
                </div>
            </motion.section>

            {/* About Us Section */}
            <motion.section
                className="py-24"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}
            >
                <div className="container mx-auto px-6 md:px-8 grid md:grid-cols-2 gap-12 items-center">
                    <motion.div variants={itemVariants}>
                        <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-6">Quiénes Somos</h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            En Lati K Publicidad, somos más que organizadores de eventos; somos arquitectos de experiencias. Con años de dedicación en el sector, nos especializamos en transformar momentos importantes en recuerdos imborrables.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            Nuestra pasión es la creatividad y la excelencia, cuidando cada detalle para que tu celebración supere todas las expectativas.
                        </p>
                    </motion.div>
                    <motion.div className="aspect-video rounded-lg shadow-2xl shadow-amber-500/20 overflow-hidden" variants={itemVariants}>
                        <img src={data.proposal.cards[0].imageUrl} alt="Equipo Lati K" className="w-full h-full object-cover"/>
                    </motion.div>
                </div>
            </motion.section>

             {/* Services Section */}
            <motion.section
                className="py-24 bg-slate-950/30"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}
            >
                <div className="container mx-auto px-6 md:px-8">
                    <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-amber-400" variants={itemVariants}>
                        Nuestros Servicios
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: 'Camera', title: 'Fotografía y Video', description: 'Capturamos la esencia de tu evento con equipos de última generación y un ojo artístico.' },
                            { icon: 'Clapperboard', title: 'Producción de Eventos', description: 'Logística, planificación y ejecución impecable para que no te preocupes por nada.' },
                            { icon: 'Tent', title: 'Decoración y Montaje', description: 'Creamos ambientes temáticos espectaculares que transportan a tus invitados.' },
                            { icon: 'Music', title: 'Entretenimiento', description: 'Desde DJs hasta shows en vivo, garantizamos la mejor atmósfera para tu celebración.' },
                        ].map(service => (
                            <motion.div key={service.title} className="bg-slate-800 p-8 rounded-lg border border-slate-700 text-center flex flex-col items-center hover:border-amber-400 transition-colors" variants={itemVariants}>
                                <div className="text-amber-400 mb-4"><IconMapper iconName={service.icon} size={40} /></div>
                                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                <p className="text-slate-400 text-sm">{service.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Gallery Section */}
            <motion.section
                 className="py-24"
                 initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants}
            >
                <div className="container mx-auto px-6 md:px-8">
                     <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-amber-400" variants={itemVariants}>
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

            {/* Testimonials Section */}
            <motion.section
                className="py-24 bg-slate-950/30"
                initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.3 }} variants={sectionVariants}
            >
                <div className="container mx-auto px-6 md:px-8">
                    <motion.h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-amber-400" variants={itemVariants}>
                        Lo Que Dicen Nuestros Clientes
                    </motion.h2>
                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            { quote: '¡El mejor evento de graduación! La organización fue impecable y la fiesta inolvidable. Gracias Lati K.', name: 'Ana Sofía R.', event: 'Graduación de Medicina' },
                            { quote: 'Profesionalismo y creatividad de principio a fin. Las fotos quedaron espectaculares y el ambiente fue mágico.', name: 'Carlos Mendoza', event: 'Lanzamiento de Marca' },
                            { quote: 'Superaron nuestras expectativas. Cada detalle fue perfecto. Sin duda los mejores para cualquier tipo de evento.', name: 'Valeria G.', event: 'Fiesta de Aniversario' },
                        ].map(testimonial => (
                             <motion.div key={testimonial.name} className="bg-slate-800 p-8 rounded-lg border border-slate-700" variants={itemVariants}>
                                <div className="flex text-amber-400 mb-4">
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
                className="py-24 relative"
                 initial="offscreen" whileInView="onscreen" viewport={{ once: true, amount: 0.4 }} variants={sectionVariants}
            >
                 <div 
                  className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" aria-hidden="true"
                >
                  <div 
                    className="relative left-1/2 aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-amber-600 to-yellow-400 opacity-20" 
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
                                className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 font-bold py-4 px-10 rounded-full shadow-lg shadow-amber-500/30 text-lg"
                                whileHover={{ scale: 1.05, boxShadow: "0px 0px 25px rgba(245, 158, 11, 0.5)" }}
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
