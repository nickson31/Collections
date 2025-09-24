import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Upload, Camera, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const Publicar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    images: [],
    title: '',
    description: '',
    category: '',
    period: '',
    material: '',
    condition: '',
    price: '',
    type: 'venta' // venta, subasta
  });

  const steps = [
    { number: 1, title: 'Imágenes', description: 'Sube fotos de tu objeto' },
    { number: 2, title: 'Detalles', description: 'Información del objeto' },
    { number: 3, title: 'Revisión', description: 'Confirma y publica' }
  ];

  const categories = [
    'Arte', 'Relojes', 'Joyería', 'Cerámica', 'Libros', 'Monedas',
    'Instrumentos', 'Antigüedades', 'Manuscritos', 'Fósiles'
  ];

  const conditions = [
    'Excelente', 'Muy Bueno', 'Bueno', 'Regular', 'Necesita Restauración'
  ];

  // Cargar datos del tasador si vienen de ahí
  useEffect(() => {
    const tasadorData = localStorage.getItem('tasadorData');
    if (tasadorData) {
      try {
        const data = JSON.parse(tasadorData);
        setFormData(prev => ({
          ...prev,
          title: data.title || '',
          category: data.category || '',
          period: data.period || '',
          material: data.material || '',
          condition: data.condition || '',
          price: data.price || '',
          description: data.description || '',
          images: data.image ? [data.image] : []
        }));
        
        // Limpiar datos del localStorage
        localStorage.removeItem('tasadorData');
        
        toast({
          title: "✅ Datos cargados del tasador",
          description: "Información prellenada automáticamente"
        });
      } catch (error) {
        console.error('Error loading tasador data:', error);
      }
    }
  }, [toast]);

  const handleImageUpload = () => {
    toast({
      title: "🚧 Subida de imágenes no implementada aún",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo prompt 🚀"
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Simular guardado
    toast({
      title: "📝 Publicando objeto...",
      description: "Guardando información y procesando imágenes"
    });

    // Simular retardo de guardado
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generar ID simulado
    const objectId = Math.floor(Math.random() * 1000) + 1;
    
    // Guardar en localStorage para simular persistencia
    const publishedObject = {
      id: objectId,
      ...formData,
      publishedAt: new Date().toISOString(),
      views: 0,
      seller: "Usuario Actual",
      location: "Madrid"
    };

    // Guardar en lista de objetos publicados
    const existingObjects = JSON.parse(localStorage.getItem('publishedObjects') || '[]');
    existingObjects.push(publishedObject);
    localStorage.setItem('publishedObjects', JSON.stringify(existingObjects));

    toast({
      title: "🎉 ¡Objeto publicado con éxito!",
      description: "Redirigiendo a la página del objeto..."
    });

    // Redirigir a la página del objeto
    setTimeout(() => {
      navigate(`/objeto/${objectId}`);
    }, 1500);
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`step-indicator ${
                currentStep === step.number
                  ? 'step-active'
                  : currentStep > step.number
                  ? 'step-completed'
                  : 'step-inactive'
              }`}
            >
              {currentStep > step.number ? (
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <div className="text-center mt-2">
              <p className="font-semibold text-sm">{step.title}</p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className="w-16 h-0.5 bg-gray-300 mx-4 mt-[-20px]" />
          )}
        </div>
      ))}
    </div>
  );

  const StepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="elegant-title text-2xl text-center mb-8">
              Sube las imágenes de tu objeto
            </h2>
            
            {/* Mostrar imagen del tasador si existe */}
            {formData.images.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Imagen del Tasador:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Objeto ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg luxury-border"
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                        Del Tasador
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={handleImageUpload}
                className="border-2 border-dashed luxury-border rounded-xl p-8 text-center cursor-pointer hover:bg-yellow-50 transition-colors"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 gold-accent" />
                <p className="font-semibold mb-2">Subir desde dispositivo</p>
                <p className="text-sm text-gray-500">JPG, PNG hasta 10MB</p>
              </div>
              
              <div
                onClick={handleImageUpload}
                className="border-2 border-dashed luxury-border rounded-xl p-8 text-center cursor-pointer hover:bg-yellow-50 transition-colors"
              >
                <Camera className="w-12 h-12 mx-auto mb-4 gold-accent" />
                <p className="font-semibold mb-2">Tomar foto</p>
                <p className="text-sm text-gray-500">Usar cámara del dispositivo</p>
              </div>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg luxury-border">
              <h3 className="font-semibold mb-2">Consejos para mejores fotos:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Usa buena iluminación natural</li>
                <li>• Incluye diferentes ángulos</li>
                <li>• Muestra detalles importantes</li>
                <li>• Fotografía marcas o firmas</li>
              </ul>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="elegant-title text-2xl text-center mb-8">
              Detalles del objeto
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Ej: Reloj Omega Speedmaster 1969"
                  className="w-full px-4 py-3 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Categoría *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Período/Época</label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => handleInputChange('period', e.target.value)}
                  placeholder="Ej: 1960-1970, Siglo XIX"
                  className="w-full px-4 py-3 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Material</label>
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => handleInputChange('material', e.target.value)}
                  placeholder="Ej: Oro 18k, Porcelana, Madera"
                  className="w-full px-4 py-3 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Estado *</label>
                <select
                  value={formData.condition}
                  onChange={(e) => handleInputChange('condition', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Seleccionar estado</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Precio (€) *</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe tu objeto: historia, características especiales, procedencia..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Tipo de publicación</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="venta"
                    checked={formData.type === 'venta'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="mr-2"
                  />
                  Venta directa
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="subasta"
                    checked={formData.type === 'subasta'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="mr-2"
                  />
                  Subasta
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="elegant-title text-2xl text-center mb-8">
              Revisión y confirmación
            </h2>
            
            <div className="bg-white rounded-xl luxury-shadow p-6">
              <h3 className="elegant-title text-xl mb-4">Resumen de tu publicación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Información básica</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Título:</span> {formData.title || 'Sin título'}</p>
                    <p><span className="font-medium">Categoría:</span> {formData.category || 'Sin categoría'}</p>
                    <p><span className="font-medium">Estado:</span> {formData.condition || 'Sin especificar'}</p>
                    <p><span className="font-medium">Precio:</span> €{formData.price || '0'}</p>
                    <p><span className="font-medium">Tipo:</span> {formData.type === 'venta' ? 'Venta directa' : 'Subasta'}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Detalles adicionales</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Período:</span> {formData.period || 'Sin especificar'}</p>
                    <p><span className="font-medium">Material:</span> {formData.material || 'Sin especificar'}</p>
                    <p><span className="font-medium">Descripción:</span> {formData.description ? 'Incluida' : 'Sin descripción'}</p>
                    <p><span className="font-medium">Imágenes:</span> {formData.images.length} imagen(es)</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg luxury-border">
                <p className="text-sm text-gray-600">
                  Al publicar, aceptas nuestros términos y condiciones. Tu objeto será revisado antes de aparecer públicamente.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Publicar Objeto - Collections</title>
        <meta name="description" content="Publica tu objeto de colección en Collections. Proceso guiado paso a paso para vender o subastar tus tesoros." />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="elegant-title text-4xl md:text-5xl mb-4">
              Publicar <span className="gold-accent">Objeto</span>
            </h1>
            <p className="text-xl text-gray-600">
              Comparte tu tesoro con la comunidad de coleccionistas
            </p>
          </div>

          <StepIndicator />

          <div className="bg-white rounded-xl luxury-shadow p-8 mb-8">
            <StepContent />
          </div>

          {/* Navegación */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700 text-white'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Anterior</span>
            </button>

            {currentStep === 3 ? (
              <button
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
              >
                <Check className="w-5 h-5" />
                <span>Publicar</span>
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Publicar;
