import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Filter, MapPin, Calendar, Euro, X, Navigation, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { objetos, calcularDistancia } from '@/data/mockData';
import { obtenerFiltrosDeURL, actualizarURLConFiltros, limpiarFiltrosURL } from '@/utils/urlUtils';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import LazyImage from '@/components/LazyImage';

const Feed = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState(obtenerFiltrosDeURL());
  const [activeFilters, setActiveFilters] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [sortBy, setSortBy] = useState(filters.sortBy || 'relevance');
  const [objetosConDistancia, setObjetosConDistancia] = useState(objetos);

  const locations = ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao'];
  const categories = ['relojes', 'joyeria', 'ceramica', 'arte', 'instrumentos', 'libros', 'monedas', 'antiguedades'];
  const priceRanges = ['< €1,000', '€1,000 - €5,000', '€5,000 - €10,000', '€10,000 - €25,000', '> €25,000'];
  const periods = ['Siglo XVIII', 'Siglo XIX', 'Art Nouveau', 'Art Déco', '1950-1970', 'Contemporáneo'];

  // Atajos de teclado
  useKeyboardShortcuts({
    onSearch: () => {
      const searchInput = document.querySelector('input[placeholder*="Buscar"]');
      if (searchInput) {
        searchInput.focus();
      }
    }
  });

  // Obtener ubicación del usuario
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "❌ Geolocalización no disponible",
        description: "Tu navegador no soporta esta función",
        variant: "destructive"
      });
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Calcular distancias para todos los objetos
        const objetosConDist = objetos.map(obj => ({
          ...obj,
          distancia: calcularDistancia(latitude, longitude, obj.ubicacion.lat, obj.ubicacion.lng)
        }));
        
        setObjetosConDistancia(objetosConDist);
        setIsGettingLocation(false);
        setSortBy('distance');
        
        toast({
          title: "📍 Ubicación obtenida",
          description: "Ahora puedes ordenar por cercanía"
        });
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = "No se pudo obtener tu ubicación";
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado. Puedes seguir navegando sin esta función.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Información de ubicación no disponible.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tiempo de espera agotado al obtener ubicación.";
            break;
        }
        
        toast({
          title: "⚠️ Error de ubicación",
          description: errorMessage
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutos
      }
    );
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    updateActiveFilters(newFilters);
    actualizarURLConFiltros(newFilters);
  };

  const updateActiveFilters = (currentFilters) => {
    const active = [];
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && key !== 'sortBy') {
        active.push({ type: key, value, label: getFilterLabel(key, value) });
      }
    });
    setActiveFilters(active);
  };

  const getFilterLabel = (type, value) => {
    const labels = {
      location: `📍 ${value}`,
      category: `🏷️ ${value}`,
      priceRange: `💰 ${value}`,
      period: `📅 ${value}`,
      search: `🔍 ${value}`
    };
    return labels[type] || value;
  };

  const removeFilter = (filterType) => {
    const newFilters = { ...filters, [filterType]: '' };
    setFilters(newFilters);
    updateActiveFilters(newFilters);
    actualizarURLConFiltros(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = { location: '', category: '', priceRange: '', period: '', search: '', sortBy: 'relevance' };
    setFilters(clearedFilters);
    setActiveFilters([]);
    setSortBy('relevance');
    limpiarFiltrosURL();
  };

  // Filtrar objetos
  const getFilteredObjects = () => {
    let filtered = [...objetosConDistancia];
    
    // Filtro por ubicación
    if (filters.location) {
      filtered = filtered.filter(obj => obj.ubicacion.ciudad === filters.location);
    }
    
    // Filtro por categoría
    if (filters.category) {
      filtered = filtered.filter(obj => obj.categoria === filters.category);
    }
    
    // Filtro por rango de precio
    if (filters.priceRange) {
      filtered = filtered.filter(obj => {
        const precio = obj.precioAnunciado;
        switch (filters.priceRange) {
          case '< €1,000': return precio < 1000;
          case '€1,000 - €5,000': return precio >= 1000 && precio <= 5000;
          case '€5,000 - €10,000': return precio >= 5000 && precio <= 10000;
          case '€10,000 - €25,000': return precio >= 10000 && precio <= 25000;
          case '> €25,000': return precio > 25000;
          default: return true;
        }
      });
    }
    
    // Filtro por período
    if (filters.period) {
      filtered = filtered.filter(obj => obj.epoca === filters.period);
    }
    
    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(obj => 
        obj.titulo.toLowerCase().includes(searchTerm) ||
        obj.descripcion.toLowerCase().includes(searchTerm) ||
        obj.categoria.toLowerCase().includes(searchTerm) ||
        obj.materiales.some(material => material.toLowerCase().includes(searchTerm))
      );
    }
    
    return filtered;
  };

  // Ordenar objetos según el criterio seleccionado
  const getSortedObjects = () => {
    let sortedObjects = getFilteredObjects();
    
    switch (sortBy) {
      case 'distance':
        if (userLocation) {
          sortedObjects.sort((a, b) => (a.distancia || 0) - (b.distancia || 0));
        }
        break;
      case 'price':
        sortedObjects.sort((a, b) => a.precioAnunciado - b.precioAnunciado);
        break;
      case 'date':
        sortedObjects.sort((a, b) => new Date(b.creadoEn) - new Date(a.creadoEn));
        break;
      default:
        // relevance - mantener orden original
        break;
    }
    
    return sortedObjects;
  };

  const handleObjectClick = (id) => {
    window.location.href = `/objeto/${id}`;
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const newFilters = { ...filters, sortBy: newSortBy };
    setFilters(newFilters);
    actualizarURLConFiltros(newFilters);
  };

  useEffect(() => {
    updateActiveFilters(filters);
  }, []);

  const objetosFiltrados = getSortedObjects();

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Feed de Objetos - Collections</title>
        <meta name="description" content="Explora objetos únicos de coleccionistas. Filtra por ubicación, categoría, precio y época para encontrar tu próximo tesoro." />
      </Helmet>

      {/* Filtros pegajosos */}
      <div className="sticky-filters border-b luxury-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="px-4 py-2 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
            >
              <option value="">📍 Ubicación</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
            >
              <option value="">🏷️ Categoría</option>
              {categories.map(category => (
                <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
              ))}
            </select>

            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="px-4 py-2 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
            >
              <option value="">💰 Precio</option>
              {priceRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>

            <select
              value={filters.period}
              onChange={(e) => handleFilterChange('period', e.target.value)}
              className="px-4 py-2 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
            >
              <option value="">📅 Época</option>
              {periods.map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
          </div>

          {/* Controles adicionales */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={getUserLocation}
                disabled={isGettingLocation}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Obteniendo...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    <span>Usar mi ubicación</span>
                  </>
                )}
              </button>

              {userLocation && (
                <span className="text-sm text-green-600 font-medium">
                  📍 Ubicación activada
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-1 rounded border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-sm"
              >
                <option value="relevance">Relevancia</option>
                <option value="distance" disabled={!userLocation}>
                  Cercanía {!userLocation && '(requiere ubicación)'}
                </option>
                <option value="price">Precio</option>
                <option value="date">Más recientes</option>
              </select>
            </div>
          </div>

          {/* Filtros activos */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Filtros activos:</span>
              {activeFilters.map((filter) => (
                <span
                  key={filter.type}
                  className="filter-active inline-flex items-center px-3 py-1 rounded-full text-sm"
                >
                  {filter.label}
                  <button
                    onClick={() => removeFilter(filter.type)}
                    className="ml-2 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid de objetos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="elegant-title text-3xl md:text-4xl">
              Feed de <span className="gold-accent">Coleccionistas</span>
            </h1>
            <div className="text-gray-600">
              {objetosFiltrados.length} objetos encontrados
              {sortBy === 'distance' && userLocation && (
                <span className="block text-sm text-blue-600">Ordenados por cercanía</span>
              )}
            </div>
          </div>

          {objetosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="elegant-title text-xl mb-2">No se encontraron objetos</h3>
              <p className="text-gray-600 mb-4">Prueba ajustando los filtros de búsqueda</p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-3 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {objetosFiltrados.map((objeto) => (
                <motion.div
                  key={objeto.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl luxury-shadow overflow-hidden cursor-pointer"
                  onClick={() => handleObjectClick(objeto.id)}
                >
                  <div className="relative h-48">
                    <LazyImage
                      src="https://images.unsplash.com/photo-1571968846410-3cbceb432f0d"
                      alt={objeto.titulo}
                      className="w-full h-full"
                    />
                    
                    {/* Etiquetas de estado */}
                    <div className="absolute top-3 right-3 space-y-1">
                      {objeto.estadoDePrecio === 'oferta' && (
                        <div className="status-offer">Oferta</div>
                      )}
                      {objeto.estadoDePrecio === 'sobrevalorado' && (
                        <div className="status-overvalued">Sobrevalorado</div>
                      )}
                    </div>
                    
                    {/* Distancia */}
                    {objeto.distancia !== undefined && (
                      <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                        {objeto.distancia.toFixed(1)} km
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 font-medium capitalize">{objeto.categoria}</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {objeto.ubicacion.ciudad}
                      </div>
                    </div>
                    
                    <h3 className="elegant-title text-lg mb-2 line-clamp-2">{objeto.titulo}</h3>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold gold-accent">€{objeto.precioAnunciado.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">{objeto.epoca}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Estado: {objeto.estado}</span>
                      <button className="text-sm gold-accent hover:underline font-medium">
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Paginación placeholder */}
          {objetosFiltrados.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white rounded-lg luxury-shadow hover:bg-yellow-50 transition-colors">
                  Anterior
                </button>
                <button className="px-4 py-2 bg-yellow-400 text-white rounded-lg">1</button>
                <button className="px-4 py-2 bg-white rounded-lg luxury-shadow hover:bg-yellow-50 transition-colors">2</button>
                <button className="px-4 py-2 bg-white rounded-lg luxury-shadow hover:bg-yellow-50 transition-colors">3</button>
                <button className="px-4 py-2 bg-white rounded-lg luxury-shadow hover:bg-yellow-50 transition-colors">
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Feed;
