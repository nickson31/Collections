import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Box as Cube, Loader2 } from 'lucide-react';

const Lazy3DViewer = ({ modelo3D, titulo, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const viewerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (viewerRef.current) {
      observer.observe(viewerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad3D = () => {
    if (!modelo3D) return;
    
    setIsLoading(true);
    
    // Simular carga del modelo 3D
    setTimeout(() => {
      setIsLoading(false);
      setIsLoaded(true);
    }, 2000);
  };

  return (
    <div ref={viewerRef} className={`relative ${className}`}>
      {!isLoaded ? (
        <div 
          onClick={handleLoad3D}
          className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-colors"
        >
          <div className="text-center">
            {isLoading ? (
              <>
                <Loader2 className="w-12 h-12 mx-auto mb-3 text-gray-500 animate-spin" />
                <p className="font-semibold text-gray-600">Cargando modelo 3D...</p>
              </>
            ) : (
              <>
                <Cube className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="font-semibold text-gray-600">
                  {modelo3D ? 'Cargar vista 3D' : 'Vista 3D próximamente'}
                </p>
                <p className="text-sm text-gray-500">
                  {modelo3D ? 'Haz clic para cargar' : 'Función en desarrollo'}
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center"
        >
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse" />
            <p className="font-semibold text-purple-700">Modelo 3D de {titulo}</p>
            <p className="text-sm text-purple-600">Arrastra para rotar • Scroll para zoom</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Lazy3DViewer;
