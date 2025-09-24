import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clock, Users, TrendingUp, Gavel } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { subastas as subastasIniciales, objetos } from '@/data/mockData';
import { calcularTiempoRestante, formatearTiempoRestante, obtenerEstadoSubasta, simularPujaAutomatica } from '@/utils/subastaUtils';
import LazyImage from '@/components/LazyImage';

const Subastas = () => {
  const { toast } = useToast();
  const [filter, setFilter] = useState('todas'); // todas, activas, finalizando, nuevas, programadas
  const [subastas, setSubastas] = useState(subastasIniciales);

  // Actualizar temporizadores cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setSubastas(prevSubastas => 
        prevSubastas.map(subasta => {
          const nuevoEstado = obtenerEstadoSubasta(subasta);
          const tiempoRestante = calcularTiempoRestante(subasta.termina);
          
          return {
            ...subasta,
            estado: nuevoEstado,
            tiempoRestante
          };
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simular pujas automáticas cada 30 segundos
  useEffect(() => {
    const bidTimer = setInterval(() => {
      setSubastas(prevSubastas => {
        const updatedSubastas = [...prevSubastas];
        
        // Intentar simular puja en una subasta aleatoria
        const subastasActivas = updatedSubastas.filter(s => s.estado === 'activa');
        if (subastasActivas.length > 0) {
          const randomIndex = Math.floor(Math.random() * subastasActivas.length);
          const subastaSeleccionada = subastasActivas[randomIndex];
          const subastaIndex = updatedSubastas.findIndex(s => s.id === subastaSeleccionada.id);
          
          const pujaSimulada = simularPujaAutomatica(subastaSeleccionada);
          if (pujaSimulada) {
            updatedSubastas[subastaIndex] = {
              ...subastaSeleccionada,
              precioActual: pujaSimulada.cantidad,
              pujas: [...subastaSeleccionada.pujas, pujaSimulada]
            };
            
            // Mostrar notificación ocasionalmente
            if (Math.random() < 0.3) {
              toast({
                title: "🔥 Nueva puja en subasta",
                description: `Puja de €${pujaSimulada.cantidad.toLocaleString()} recibida`
              });
            }
          }
        }
        
        return updatedSubastas;
      });
    }, 30000); // Cada 30 segundos

    return () => clearInterval(bidTimer);
  }, [toast]);

  const filteredSubastas = subastas.filter(subasta => {
    if (filter === 'todas') return true;
    if (filter === 'finalizando') {
      return subasta.estado === 'activa' && subasta.tiempoRestante?.total < 24 * 60 * 60 * 1000; // Menos de 24h
    }
    return subasta.estado === filter;
  });

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'programada': return 'bg-blue-100 text-blue-600';
      case 'activa': return 'bg-green-100 text-green-600';
      case 'finalizada': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (estado) => {
    switch (estado) {
      case 'programada': return 'Programada';
      case 'activa': return 'Activa';
      case 'finalizada': return 'Finalizada';
      default: return 'Desconocido';
    }
  };

  const handleSubastaClick = (id) => {
    window.location.href = `/subastas/${id}`;
  };

  const obtenerObjetoSubasta = (objetoId) => {
    return objetos.find(obj => obj.id === objetoId);
  };

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Subastas - Collections</title>
        <meta name="description" content="Participa en subastas exclusivas de objetos únicos. Encuentra diamantes, arte, antigüedades y más en Collections." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="elegant-title text-4xl md:text-5xl mb-4">
              Subastas <span className="gold-accent">Exclusivas</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Participa en subastas de objetos únicos y extraordinarios
            </p>
          </div>

          {/* Filtros */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { key: 'todas', label: 'Todas las Subastas', icon: Gavel },
              { key: 'programada', label: 'Programadas', icon: TrendingUp },
              { key: 'activa', label: 'Activas', icon: Users },
              { key: 'finalizando', label: 'Finalizando', icon: Clock }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  filter === key
                    ? 'filter-active'
                    : 'bg-white hover:bg-yellow-50 luxury-shadow'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Grid de subastas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSubastas.map((subasta) => {
              const objeto = obtenerObjetoSubasta(subasta.objetoId);
              if (!objeto) return null;

              return (
                <motion.div
                  key={subasta.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl luxury-shadow overflow-hidden cursor-pointer"
                  onClick={() => handleSubastaClick(subasta.id)}
                >
                  <div className="relative h-48">
                    <LazyImage
                      src="https://images.unsplash.com/photo-1509930854872-0f61005b282e"
                      alt={objeto.titulo}
                      className="w-full h-full"
                    />
                    
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subasta.estado)}`}>
                      {getStatusText(subasta.estado)}
                    </div>
                    
                    {subasta.estado !== 'finalizada' && subasta.tiempoRestante && (
                      <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                        ⏰ {formatearTiempoRestante(subasta.tiempoRestante)}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 font-medium capitalize">{objeto.categoria}</span>
                      <div className="flex items-center text-red-500 text-sm font-medium">
                        <Clock className="w-4 h-4 mr-1" />
                        {subasta.tiempoRestante ? formatearTiempoRestante(subasta.tiempoRestante) : 'Calculando...'}
                      </div>
                    </div>
                    
                    <h3 className="elegant-title text-xl mb-4 line-clamp-2">{objeto.titulo}</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Puja actual:</span>
                        <span className="text-2xl font-bold gold-accent">€{subasta.precioActual.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Precio inicial:</span>
                        <span className="text-sm font-medium">€{subasta.precioInicio.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-1" />
                          {subasta.pujas.length} pujas
                        </div>
                        <button 
                          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                            subasta.estado === 'finalizada' 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : subasta.estado === 'programada'
                              ? 'bg-blue-500 hover:bg-blue-600 text-white'
                              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white'
                          }`}
                          disabled={subasta.estado === 'finalizada'}
                        >
                          {subasta.estado === 'finalizada' ? 'Finalizada' : 
                           subasta.estado === 'programada' ? 'Próximamente' : 'Pujar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredSubastas.length === 0 && (
            <div className="text-center py-12">
              <Gavel className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="elegant-title text-xl mb-2">No hay subastas en esta categoría</h3>
              <p className="text-gray-600">Prueba con otro filtro o vuelve más tarde</p>
            </div>
          )}

          {/* Estadísticas */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl luxury-shadow p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="w-6 h-6 gold-accent" />
              </div>
              <h3 className="elegant-title text-2xl mb-2">
                {subastas.filter(s => s.estado === 'activa' || s.estado === 'programada').length}
              </h3>
              <p className="text-gray-600">Subastas activas</p>
            </div>
            
            <div className="bg-white rounded-xl luxury-shadow p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="elegant-title text-2xl mb-2">
                {subastas.reduce((total, s) => total + s.pujas.length, 0)}
              </h3>
              <p className="text-gray-600">Pujas realizadas</p>
            </div>
            
            <div className="bg-white rounded-xl luxury-shadow p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="elegant-title text-2xl mb-2">
                €{Math.floor(subastas.reduce((total, s) => total + s.precioActual, 0) / 1000)}K
              </h3>
              <p className="text-gray-600">Valor total en subasta</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Subastas;
