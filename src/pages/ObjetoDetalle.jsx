import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Heart, Share2, MapPin, Calendar, Package, Award, Eye, Box as Cube } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { objetos, usuarios } from '@/data/mockData';
import LazyImage from '@/components/LazyImage';
import Lazy3DViewer from '@/components/Lazy3DViewer';

const ObjetoDetalle = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [objeto, setObjeto] = useState(null);
  const [vendedor, setVendedor] = useState(null);

  useEffect(() => {
    // Buscar objeto en datos mock o localStorage
    const publishedObjects = JSON.parse(localStorage.getItem('publishedObjects') || '[]');
    const foundObject = publishedObjects.find(obj => obj.id === parseInt(id));
    
    if (foundObject) {
      // Objeto publicado por el usuario
      setObjeto({
        ...foundObject,
        views: Math.floor(Math.random() * 2000) + 100,
        specifications: {
          "Categoría": foundObject.category,
          "Período": foundObject.period || "No especificado",
          "Material": foundObject.material || "No especificado",
          "Estado": foundObject.condition,
          "Tipo": foundObject.type === 'venta' ? 'Venta directa' : 'Subasta',
          "Publicado": new Date(foundObject.publishedAt).toLocaleDateString('es-ES')
        }
      });
      setVendedor({ nombre: "Usuario Actual", valoracion: 5.0 });
    } else {
      // Buscar en objetos mock
      const objetoMock = objetos.find(obj => obj.id === parseInt(id));
      if (objetoMock) {
        const vendedorMock = usuarios.find(user => user.id === objetoMock.duenoId);
        setObjeto({
          ...objetoMock,
          views: Math.floor(Math.random() * 2000) + 100,
          specifications: {
            "Categoría": objetoMock.categoria.charAt(0).toUpperCase() + objetoMock.categoria.slice(1),
            "Período": objetoMock.epoca,
            "Material": objetoMock.materiales.join(', '),
            "Estado": objetoMock.estado,
            "Precio estimado": `€${objetoMock.precioEstimado.min.toLocaleString()} - €${objetoMock.precioEstimado.max.toLocaleString()}`,
            "Confianza": `${Math.round(objetoMock.precioEstimado.confianza * 100)}%`,
            "Publicado": new Date(objetoMock.creadoEn).toLocaleDateString('es-ES')
          }
        });
        setVendedor(vendedorMock);
      }
    }
  }, [id]);

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

  const handleContact = () => {
    toast({
      title: "🚧 Contacto no implementado aún",
      description: "¡Pero no te preocupes! Puedes solicitarlo en tu próximo prompt 🚀"
    });
  };

  const handleBuy = () => {
    toast({
      title: "🚧 Compra no implementada aún",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt 🚀"
    });
  };

  if (!objeto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando objeto...</p>
        </div>
      </div>
    );
  }

  const precio = objeto.precioAnunciado || objeto.price;
  const ubicacion = objeto.ubicacion?.ciudad || objeto.location;
  const categoria = objeto.categoria || objeto.category;
  const descripcion = objeto.descripcion || objeto.description;
  const imagenes = objeto.imagenes || objeto.images || [];

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>{objeto.titulo || objeto.title} - Collections</title>
        <meta name="description" content={`${objeto.titulo || objeto.title} - €${precio?.toLocaleString()}. ${descripcion?.substring(0, 150)}...`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galería de imágenes */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl luxury-shadow overflow-hidden">
                <div className="h-96 relative">
                  {imagenes.length > 0 ? (
                    <LazyImage
                      src={typeof imagenes[currentImageIndex] === 'string' && imagenes[currentImageIndex].startsWith('data:') 
                        ? imagenes[currentImageIndex] 
                        : "https://images.unsplash.com/photo-1615336523094-d786dac51efd"
                      }
                      alt={objeto.titulo || objeto.title}
                      className="w-full h-full"
                    />
                  ) : (
                    <LazyImage
                      src="https://images.unsplash.com/photo-1615336523094-d786dac51efd"
                      alt={objeto.titulo || objeto.title}
                      className="w-full h-full"
                    />
                  )}
                  
                  {/* Indicador de estado */}
                  <div className="absolute top-4 right-4 space-y-1">
                    {objeto.estadoDePrecio === 'oferta' && (
                      <div className="status-offer">Oferta</div>
                    )}
                    {objeto.estadoDePrecio === 'sobrevalorado' && (
                      <div className="status-overvalued">Sobrevalorado</div>
                    )}
                  </div>
                </div>
                
                {/* Miniaturas */}
                {imagenes.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {imagenes.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          currentImageIndex === index ? 'border-yellow-400' : 'border-gray-200'
                        }`}
                      >
                        <LazyImage
                          src={typeof image === 'string' && image.startsWith('data:') 
                            ? image 
                            : "https://images.unsplash.com/photo-1595872018818-97555653a011"
                          }
                          alt={`${objeto.titulo || objeto.title} imagen ${index + 1}`}
                          className="w-full h-full"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Visor 3D */}
              <div className="bg-white rounded-xl luxury-shadow p-6">
                <h3 className="elegant-title text-lg mb-4 flex items-center">
                  <Cube className="w-5 h-5 mr-2" />
                  Vista 3D
                </h3>
                <Lazy3DViewer 
                  modelo3D={objeto.modelo3D} 
                  titulo={objeto.titulo || objeto.title}
                />
              </div>
            </div>

            {/* Información del objeto */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl luxury-shadow p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="elegant-title text-3xl mb-2">{objeto.titulo || objeto.title}</h1>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {ubicacion} • {categoria}
                    </p>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Eye className="w-4 h-4 mr-1" />
                    {objeto.views?.toLocaleString()} vistas
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-4xl font-bold gold-accent mb-2">€{precio?.toLocaleString()}</p>
                  <p className="text-gray-600">
                    {objeto.estadoDePrecio === 'oferta' && 'Precio especial - '}
                    {objeto.estadoDePrecio === 'sobrevalorado' && 'Precio premium - '}
                    Precio fijo
                  </p>
                  
                  {/* Mostrar estimación si existe */}
                  {objeto.precioEstimado && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Estimación de mercado:</strong> €{objeto.precioEstimado.min.toLocaleString()} - €{objeto.precioEstimado.max.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Confianza: {Math.round(objeto.precioEstimado.confianza * 100)}%
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 mb-6">
                  <button
                    onClick={handleBuy}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
                  >
                    Comprar Ahora
                  </button>
                  <button
                    onClick={handleContact}
                    className="flex-1 border luxury-border py-3 rounded-lg font-semibold hover:bg-yellow-50 transition-colors"
                  >
                    Contactar
                  </button>
                </div>

                <div className="flex space-x-3 mb-6">
                  <button
                    onClick={handleFavorite}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 border luxury-border rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Favorito</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center space-x-2 py-2 border luxury-border rounded-lg hover:bg-yellow-50 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Compartir</span>
                  </button>
                </div>

                {/* Información del vendedor */}
                {vendedor && (
                  <div className="border-t luxury-border pt-6">
                    <h3 className="font-semibold mb-3">Vendedor</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{vendedor.nombre}</p>
                        <p className="text-sm text-gray-500">Miembro desde 2019</p>
                        <p className="text-sm text-gray-500">
                          {'⭐'.repeat(Math.floor(vendedor.valoracion))} ({vendedor.valoracion}/5) • 127 ventas
                        </p>
                      </div>
                      <button
                        onClick={handleContact}
                        className="px-4 py-2 border luxury-border rounded-lg hover:bg-yellow-50 transition-colors text-sm font-medium"
                      >
                        Ver perfil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ficha técnica */}
          <div className="mt-12 bg-white rounded-xl luxury-shadow p-8">
            <h2 className="elegant-title text-2xl mb-6">Ficha Técnica</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Descripción
                </h3>
                <p className="text-gray-600 leading-relaxed">{descripcion}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Especificaciones
                </h3>
                <div className="space-y-3">
                  {Object.entries(objeto.specifications || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-500">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-1">Estado: {objeto.estado || objeto.condition}</h4>
                <p className="text-sm text-gray-500">Verificado por expertos</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-1">Período: {objeto.epoca || objeto.period}</h4>
                <p className="text-sm text-gray-500">Datación confirmada</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-1">
                  Material: {objeto.materiales?.join(', ') || objeto.material}
                </h4>
                <p className="text-sm text-gray-500">Análisis incluido</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ObjetoDetalle;
