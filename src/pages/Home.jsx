import React, { useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, TrendingUp, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const Home = () => {
  const { toast } = useToast();
  const nuevosRef = useRef(null);
  const ofertasRef = useRef(null);
  const subastasRef = useRef(null);

  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleItemClick = (type, id) => {
    toast({
      title: "🚧 Esta función no está implementada aún",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt 🚀"
    });
  };

  // Datos de ejemplo
  const nuevosItems = [
    {
      id: 1,
      title: "Reloj Omega Speedmaster 1969",
      price: "€12,500",
      image: "Reloj vintage Omega Speedmaster de 1969",
      category: "Relojes"
    },
    {
      id: 2,
      title: "Jarrón Ming Dinastía",
      price: "€8,900",
      image: "Jarrón chino de la dinastía Ming",
      category: "Cerámica"
    },
    {
      id: 3,
      title: "Pintura Óleo S.XIX",
      price: "€15,200",
      image: "Pintura al óleo del siglo XIX",
      category: "Arte"
    },
    {
      id: 4,
      title: "Moneda Romana Aureus",
      price: "€3,400",
      image: "Moneda romana de oro aureus",
      category: "Numismática"
    },
    {
      id: 5,
      title: "Violín Stradivarius Copia",
      price: "€25,000",
      image: "Violín copia de Stradivarius",
      category: "Instrumentos"
    }
  ];

  const ofertasItems = [
    {
      id: 6,
      title: "Collar Art Déco 1920",
      originalPrice: "€4,500",
      offerPrice: "€3,200",
      discount: "29%",
      image: "Collar art déco de los años 20",
      category: "Joyería"
    },
    {
      id: 7,
      title: "Libro Primera Edición Quijote",
      originalPrice: "€18,000",
      offerPrice: "€12,800",
      discount: "29%",
      image: "Primera edición del Quijote",
      category: "Libros"
    },
    {
      id: 8,
      title: "Escultura Bronce Art Nouveau",
      originalPrice: "€7,200",
      offerPrice: "€5,100",
      discount: "29%",
      image: "Escultura de bronce art nouveau",
      category: "Escultura"
    },
    {
      id: 9,
      title: "Mapa Antiguo América 1650",
      originalPrice: "€2,800",
      offerPrice: "€1,950",
      discount: "30%",
      image: "Mapa antiguo de América de 1650",
      category: "Cartografía"
    }
  ];

  const subastasItems = [
    {
      id: 10,
      title: "Diamante Talla Brillante 2.5ct",
      currentBid: "€45,000",
      timeLeft: "2d 14h",
      bids: 23,
      image: "Diamante talla brillante de 2.5 quilates",
      category: "Joyería"
    },
    {
      id: 11,
      title: "Armadura Samurái S.XVII",
      currentBid: "€28,500",
      timeLeft: "1d 8h",
      bids: 15,
      image: "Armadura completa de samurái del siglo XVII",
      category: "Antigüedades"
    },
    {
      id: 12,
      title: "Manuscrito Medieval Iluminado",
      currentBid: "€35,200",
      timeLeft: "3d 2h",
      bids: 31,
      image: "Manuscrito medieval con iluminaciones",
      category: "Manuscritos"
    },
    {
      id: 13,
      title: "Fósil Trilobites Completo",
      currentBid: "€1,850",
      timeLeft: "5h 23m",
      bids: 8,
      image: "Fósil completo de trilobites",
      category: "Fósiles"
    }
  ];

  const CarouselCard = ({ item, type, onClick }) => (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex-shrink-0 w-80 bg-white rounded-xl luxury-shadow overflow-hidden cursor-pointer"
      onClick={() => onClick(type, item.id)}
    >
      <div className="h-48 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        <img alt={item.image} className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 font-medium">{item.category}</span>
          {type === 'subastas' && (
            <div className="flex items-center text-red-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {item.timeLeft}
            </div>
          )}
        </div>
        <h3 className="elegant-title text-lg mb-3 line-clamp-2">{item.title}</h3>
        
        {type === 'ofertas' && (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold gold-accent">{item.offerPrice}</span>
              <span className="text-sm text-gray-500 line-through ml-2">{item.originalPrice}</span>
            </div>
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
              -{item.discount}
            </span>
          </div>
        )}
        
        {type === 'nuevos' && (
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold gold-accent">{item.price}</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
        )}
        
        {type === 'subastas' && (
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold gold-accent">{item.currentBid}</span>
              <span className="text-sm text-gray-500 ml-2">({item.bids} pujas)</span>
            </div>
            <Gavel className="w-5 h-5 text-blue-500" />
          </div>
        )}
      </div>
    </motion.div>
  );

  const CarouselSection = ({ title, items, type, scrollRef }) => (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="elegant-title text-3xl">{title}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => scrollCarousel(scrollRef, 'left')}
            className="p-2 rounded-full bg-white luxury-shadow hover:bg-yellow-50 transition-colors"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scrollCarousel(scrollRef, 'right')}
            className="p-2 rounded-full bg-white luxury-shadow hover:bg-yellow-50 transition-colors"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto carousel-container pb-4"
      >
        {items.map((item) => (
          <CarouselCard
            key={item.id}
            item={item}
            type={type}
            onClick={handleItemClick}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Collections - Descubre, tasa y subasta tesoros</title>
        <meta name="description" content="Descubre objetos únicos, tasa con IA y participa en subastas exclusivas. La plataforma de lujo para coleccionistas." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="elegant-title text-5xl md:text-7xl mb-6 leading-tight">
              Descubre, tasa y subasta
              <span className="block gold-accent">tesoros únicos</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              La plataforma de lujo donde coleccionistas descubren objetos extraordinarios, 
              valoran sus tesoros con IA y participan en subastas exclusivas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/feed"
                className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 luxury-shadow"
              >
                Explorar Colecciones
              </Link>
              <Link
                to="/tasador"
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 luxury-shadow luxury-border"
              >
                Tasar con IA
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Carouseles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <CarouselSection
          title="Nuevos Tesoros"
          items={nuevosItems}
          type="nuevos"
          scrollRef={nuevosRef}
        />
        
        <CarouselSection
          title="Ofertas Especiales"
          items={ofertasItems}
          type="ofertas"
          scrollRef={ofertasRef}
        />
        
        <CarouselSection
          title="Subastas Activas"
          items={subastasItems}
          type="subastas"
          scrollRef={subastasRef}
        />
      </div>
    </div>
  );
};

export default Home;
