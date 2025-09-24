import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Clock, Users, TrendingUp, Gavel, Heart, Share2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { subastas as subastasIniciales, objetos, usuarios } from '@/data/mockData';
import { validarPuja, aplicarReglasAntiUltimoSegundo, calcularTiempoRestante } from '@/utils/subastaUtils';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import LazyImage from '@/components/LazyImage';

const SubastaDetalle = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [bidAmount, setBidAmount] = useState('');
  const [subasta, setSubasta] = useState(null);
  const [objeto, setObjeto] = useState(null);
  const [vendedor, setVendedor] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);

  const usuarioActualId = 999; // ID simulado del usuario actual

  // Atajos de teclado
  useKeyboardShortcuts({
    onEscape: () => setBidAmount('')
  });

  useEffect(() => {
    const subastaEncontrada = subastasIniciales.find(s => s.id === parseInt(id));
    if (subastaEncontrada) {
      setSubasta(subastaEncontrada);
      
      const objetoEncontrado = objetos.find(obj => obj.id === subastaEncontrada.objetoId);
      setObjeto(objetoEncontrado);
      
      if (objetoEncontrado) {
        const vendedorEncontrado = usuarios.find(user => user.id === objetoEncontrado.duenoId);
        setVendedor(vendedorEncontrado);
      }
      
      // Formatear historial de pujas
      const historialFormateado = subastaEncontrada.pujas.map((puja, index) => {
        const usuario = usuarios.find(u => u.id === puja.usuarioId);
        const tiempoTranscurrido = Date.now() - new Date(puja.hora).getTime();
        const minutosTranscurridos = Math.floor(tiempoTranscurrido / (1000 * 60));
        
        return {
          ...puja,
          bidder: usuario ? `${usuario.nombre.split(' ')[0]}***${usuario.id}` : `Usuario***${puja.usuarioId}`,
          time: minutosTranscurridos < 60 ? `Hace ${minutosTranscurridos} minutos` : `Hace ${Math.floor(minutosTranscurridos / 60)} horas`,
          isUser: puja.usuarioId === usuarioActualId
        };
      }).reverse(); // Más recientes primero
      
      setBidHistory(historialFormateado);
    }
  }, [id]);

  // Actualizar temporizador cada segundo
  useEffect(() => {
    if (!subasta) return;
    
    const timer = setInterval(() => {
      const tiempo = calcularTiempoRestante(subasta.termina);
      setTiempoRestante(tiempo);
      
      // Si la subasta ha terminado, actualizar estado
      if (tiempo.total <= 0) {
        setSubasta(prev => ({ ...prev, estado: 'finalizada' }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [subasta]);

  // Simular pujas de otros usuarios cada 2-3 segundos
  useEffect(() => {
    if (!subasta || subasta.estado !== 'activa') return;
    
    const bidTimer = setInterval(() => {
      // 15% de probabilidad de nueva puja
      if (Math.random() < 0.15) {
        const incrementoAleatorio = subasta.incrementoMinimo + Math.floor(Math.random() * subasta.incrementoMinimo);
        const nuevaCantidad = subasta.precioActual + incrementoAleatorio;
        
        const usuariosBot = [10, 11, 12, 13, 14];
        const usuarioAleatorio = usuariosBot[Math.floor(Math.random() * usuariosBot.length)];
        
        const nuevaPuja = {
          usuarioId: usuarioAleatorio,
          cantidad: nuevaCantidad,
          hora: new Date().toISOString()
        };
        
        // Aplicar reglas anti-último-segundo
        const subastaActualizada = aplicarReglasAntiUltimoSegundo(subasta, nuevaPuja);
        setSubasta(subastaActualizada);
        
        // Actualizar historial
        const nuevaEntradaHistorial = {
          ...nuevaPuja,
          bidder: `Usuario***${usuarioAleatorio}`,
          time: "Ahora mismo",
          isUser: false
        };
        
        setBidHistory(prev => [nuevaEntradaHistorial, ...prev.slice(0, 9)]);
        
        toast({
          title: "🔥 Nueva puja recibida",
          description: `Puja de €${nuevaCantidad.toLocaleString()} recibida`,
          duration: 3000
        });
      }
    }, Math.random() * 2000 + 2000); // Entre 2-4 segundos

    return () => clearInterval(bidTimer);
  }, [subasta, toast]);

  const handleBid = () => {
    if (!subasta || !bidAmount) return;

    const cantidad = parseFloat(bidAmount);
    const validacion = validarPuja(subasta, cantidad, usuarioActualId);
    
    if (!validacion.valida) {
      toast({
        title: "Puja inválida",
        description: validacion.errors.join('. '),
        variant: "destructive"
      });
      return;
    }

    const nuevaPuja = {
      usuarioId: usuarioActualId,
      cantidad: cantidad,
      hora: new Date().toISOString()
    };
    
    // Aplicar reglas anti-último-segundo
    const subastaActualizada = aplicarReglasAntiUltimoSegundo(subasta, nuevaPuja);
    setSubasta(subastaActualizada);

    // Actualizar historial
    const nuevaEntradaHistorial = {
      ...nuevaPuja,
      bidder: "Tú",
      time: "Ahora mismo",
      isUser: true
    };
    
    setBidHistory(prev => [nuevaEntradaHistorial, ...prev.slice(0, 9)]);
    setBidAmount('');
    
    toast({
      title: "✅ ¡Puja realizada!",
      description: `Has pujado €${cantidad.toLocaleString()} con éxito`
    });

    // Simular respuesta competitiva después de un tiempo aleatorio
    setTimeout(() => {
      if (Math.random() < 0.7) { // 70% de probabilidad de respuesta
        const competitiveBid = cantidad + Math.floor(Math.random() * 1500) + 500;
        const bidders = [10, 11, 12, 13];
        const randomBidder = bidders[Math.floor(Math.random() * bidders.length)];
        
        const pujaCompetitiva = {
          usuarioId: randomBidder,
          cantidad: competitiveBid,
          hora: new Date().toISOString()
        };
        
        const subastaConRespuesta = aplicarReglasAntiUltimoSegundo(subastaActualizada, pujaCompetitiva);
        setSubasta(subastaConRespuesta);

        setBidHistory(prev => [
          {
            ...pujaCompetitiva,
            bidder: `Usuario***${randomBidder}`,
            time: "Hace 1 minuto",
            isUser: false
          },
          ...prev.slice(0, 9)
        ]);

        toast({
          title: "⚡ Te han superado",
          description: `Nueva puja de €${competitiveBid.toLocaleString()}`
        });
      }
    }, Math.random() * 60000 + 30000); // Entre 30 segundos y 1.5 minutos
  };

  const handleFavorite = () => {
    toast({
      title: "🚧 Favoritos no implementado aún",
      description: "¡Pero no te preocupes! Puedes solicitarlo en tu próximo prompt 🚀"
    });
  };

  const handleShare = () => {
    toast({
      title: "🚧 Compartir no implementado aún",
      description: "¡Pero no te preocupes! Puedes solicitarlo en tu próximo prompt 🚀"
    });
  };

  if (!subasta || !objeto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando subasta...</p>
        </div>
      </div>
    );
  }

  const nextMinBid = subasta.precioActual + subasta.incrementoMinimo;

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>{objeto.titulo} - Subasta - Collections</title>
        <meta name="description" content={`Puja por ${objeto.titulo}. Puja actual: €${subasta.precioActual.toLocaleString()}. ${objeto.descripcion}`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Imagen y galería */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl luxury-shadow overflow-hidden">
                <div className="h-96">
                  <LazyImage
                    src="https://images.unsplash.com/photo-1509930854872-0f61005b282e"
                    alt={objeto.titulo}
                    className="w-full h-full"
                  />
                </div>
              </div>
              
              {/* Información del vendedor */}
              {vendedor && (
                <div className="bg-white rounded-xl luxury-shadow p-6">
                  <h3 className="elegant-title text-lg mb-4">Información del Vendedor</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Vendedor:</span> {vendedor.nombre}</p>
                    <p><span className="font-medium">Ubicación:</span> {vendedor.ciudad}</p>
                    <p><span className="font-medium">Valoración:</span> {'⭐'.repeat(Math.floor(vendedor.valoracion))} ({vendedor.valoracion}/5)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Información de la subasta */}
            <div className="space-y-6">
              {/* Temporizador */}
              <div className="bg-white rounded-xl luxury-shadow p-6">
                <div className="text-center mb-6">
                  <h1 className="elegant-title text-3xl mb-2">{objeto.titulo}</h1>
                  <p className="text-gray-600 capitalize">{objeto.categoria}</p>
                </div>

                {tiempoRestante && (
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-500 mb-2">Tiempo restante:</p>
                    <div className="flex justify-center space-x-4">
                      <div className="timer-digit">
                        <div>{tiempoRestante.days}</div>
                        <div className="text-xs">días</div>
                      </div>
                      <div className="timer-digit">
                        <div>{tiempoRestante.hours}</div>
                        <div className="text-xs">horas</div>
                      </div>
                      <div className="timer-digit">
                        <div>{tiempoRestante.minutes}</div>
                        <div className="text-xs">min</div>
                      </div>
                      <div className="timer-digit">
                        <div>{tiempoRestante.seconds}</div>
                        <div className="text-xs">seg</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-1">Puja actual:</p>
                  <p className="text-4xl font-bold gold-accent">€{subasta.precioActual.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">{subasta.pujas.length} pujas realizadas</p>
                </div>

                {/* Formulario de puja */}
                {subasta.estado === 'activa' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tu puja (mínimo €{nextMinBid.toLocaleString()})
                      </label>
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={nextMinBid.toString()}
                        className="w-full px-4 py-3 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400 text-lg"
                        min={nextMinBid}
                        step={subasta.incrementoMinimo}
                      />
                    </div>
                    
                    <button
                      onClick={handleBid}
                      className="bid-button w-full"
                      disabled={!bidAmount || parseFloat(bidAmount) < nextMinBid}
                    >
                      <Gavel className="w-6 h-6 inline mr-2" />
                      Realizar Puja
                    </button>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={handleFavorite}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 border luxury-border rounded-lg hover:bg-yellow-50 transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                        <span>Favorito</span>
                      </button>
                      <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 border luxury-border rounded-lg hover:bg-yellow-50 transition-colors"
                      >
                        <Share2 className="w-5 h-5" />
                        <span>Compartir</span>
                      </button>
                    </div>
                  </div>
                )}

                {subasta.estado === 'finalizada' && (
                  <div className="text-center p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">Subasta Finalizada</h3>
                    <p className="text-gray-600">Precio final: €{subasta.precioActual.toLocaleString()}</p>
                  </div>
                )}

                {subasta.estado === 'programada' && (
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-xl font-bold text-blue-700 mb-2">Subasta Programada</h3>
                    <p className="text-blue-600">La subasta comenzará pronto</p>
                  </div>
                )}

                <div className="mt-4 p-3 bg-yellow-50 rounded-lg luxury-border flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Reglas de la subasta:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Las pujas son vinculantes</li>
                      <li>• Incremento mínimo: €{subasta.incrementoMinimo.toLocaleString()}</li>
                      <li>• No se permiten pujas consecutivas del mismo usuario</li>
                      <li>• Extensión automática si hay pujas en los últimos 60 segundos</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Historial de pujas */}
              <div className="bg-white rounded-xl luxury-shadow p-6">
                <h3 className="elegant-title text-lg mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Historial de Pujas
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {bidHistory.map((bid, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0 ${
                        bid.isUser ? 'bg-green-50 px-2 rounded' : ''
                      }`}
                    >
                      <div>
                        <p className="font-semibold">€{bid.cantidad.toLocaleString()}</p>
                        <p className={`text-sm ${bid.isUser ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                          {bid.bidder}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">{bid.time}</p>
                    </motion.div>
                  ))}
                  
                  {bidHistory.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No hay pujas aún</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detalles del objeto */}
          <div className="mt-12 bg-white rounded-xl luxury-shadow p-8">
            <h2 className="elegant-title text-2xl mb-6">Detalles del Objeto</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">{objeto.descripcion}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4">Especificaciones</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estado:</span>
                    <span className="font-medium">{objeto.estado}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Período:</span>
                    <span className="font-medium">{objeto.epoca}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Material:</span>
                    <span className="font-medium">{objeto.materiales.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Precio inicial:</span>
                    <span className="font-medium">€{subasta.precioInicio.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Incremento mínimo:</span>
                    <span className="font-medium">€{subasta.incrementoMinimo.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SubastaDetalle;
