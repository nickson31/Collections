import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Mic, MicOff, Play, Pause, Volume2, RefreshCw, Loader2, Eye, Box as Cube, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { calcularEstimacionPrecio, determinarEstadoPrecio, comparables } from '@/data/mockData';

const Tasador = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [comparablesData, setComparablesData] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [is3DLoading, setIs3DLoading] = useState(false);
  const [show3DModel, setShow3DModel] = useState(false);

  // Atajos de teclado
  useKeyboardShortcuts({
    onCapture: () => {
      if (isCameraActive) {
        captureImage();
      }
    },
    onVoice: () => {
      handleVoiceToggle();
    }
  });

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'es-ES';
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(prev => prev + ' ' + finalTranscript);
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsRecording(false);
        
        let errorMessage = "Error en el reconocimiento de voz";
        if (event.error === 'not-allowed') {
          errorMessage = "Permiso de micrófono denegado. Permite el acceso para usar esta función.";
        }
        
        toast({
          title: "❌ Error de voz",
          description: errorMessage,
          variant: "destructive"
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [toast]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
        toast({
          title: "✅ Cámara activada",
          description: "Enfoca tu objeto para obtener la mejor tasación. Usa 'C' para capturar."
        });
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError(error.name);
      setIsCameraActive(false);
      
      let errorMessage = "No se pudo acceder a la cámara";
      if (error.name === 'NotAllowedError') {
        errorMessage = "Permiso de cámara denegado. Por favor, permite el acceso para continuar.";
      } else if (error.name === 'NotFoundError') {
        errorMessage = "No se encontró ninguna cámara en tu dispositivo.";
      }
      
      toast({
        title: "❌ Error de cámara",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
    setCameraError(null);
    toast({
      title: "📷 Cámara desactivada",
      description: "Puedes reactivarla cuando quieras"
    });
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleVoiceToggle = () => {
    if (!recognition) {
      toast({
        title: "❌ Reconocimiento de voz no disponible",
        description: "Tu navegador no soporta esta función",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      setIsListening(false);
    } else {
      setTranscript('');
      recognition.start();
      setIsRecording(true);
      setIsListening(true);
      toast({
        title: "🎤 Escuchando...",
        description: "Describe tu objeto para ayudar con la tasación. Usa 'V' para alternar."
      });
    }
  };

  const speakResults = () => {
    if (!results) return;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Objeto identificado: ${results.title}. Categoría: ${results.category}. Período: ${results.period}. Material: ${results.material}. Estado: ${results.condition}. Valor estimado: ${results.estimatedValue}`
      );
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
      
      toast({
        title: "🔊 Reproduciendo resultados",
        description: "Escucha la tasación completa"
      });
    } else {
      toast({
        title: "❌ Síntesis de voz no disponible",
        description: "Tu navegador no soporta esta función",
        variant: "destructive"
      });
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) {
      toast({
        title: "❌ Error de captura",
        description: "Asegúrate de que la cámara esté activa",
        variant: "destructive"
      });
      return;
    }

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    
    toast({
      title: "📸 Imagen capturada",
      description: "Analizando objeto con IA..."
    });
    
    analyzeObject(imageDataUrl);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "❌ Archivo inválido",
        description: "Por favor selecciona una imagen",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target.result;
      setCapturedImage(imageDataUrl);
      
      toast({
        title: "📁 Imagen cargada",
        description: "Analizando objeto con IA..."
      });
      
      analyzeObject(imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const analyzeObject = async (imageData) => {
    setIsAnalyzing(true);
    setResults(null);
    setComparablesData([]);

    // Simular análisis con retardo realista
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Determinar categoría basada en contexto de voz si está disponible
    let categoria = 'relojes'; // Por defecto
    if (transcript.toLowerCase().includes('joya') || transcript.toLowerCase().includes('collar') || transcript.toLowerCase().includes('anillo')) {
      categoria = 'joyeria';
    } else if (transcript.toLowerCase().includes('pintura') || transcript.toLowerCase().includes('cuadro') || transcript.toLowerCase().includes('arte')) {
      categoria = 'arte';
    } else if (transcript.toLowerCase().includes('jarrón') || transcript.toLowerCase().includes('cerámica') || transcript.toLowerCase().includes('porcelana')) {
      categoria = 'ceramica';
    }

    // Precio simulado para el análisis
    const precioSimulado = Math.floor(Math.random() * 15000) + 2000;
    
    // Calcular estimación inteligente
    const estimacion = calcularEstimacionPrecio(categoria, precioSimulado);
    const estadoPrecio = determinarEstadoPrecio(precioSimulado, estimacion);

    // Resultados simulados más detallados
    const mockResults = {
      title: "Reloj de Bolsillo Omega Vintage",
      category: categoria,
      period: "1920-1930",
      material: "Oro 18k con esfera de porcelana",
      condition: "Excelente",
      estimatedValue: `€${estimacion.min.toLocaleString()} - €${estimacion.max.toLocaleString()}`,
      estimatedPoint: estimacion.punto,
      confidence: `${Math.round(estimacion.confianza * 100)}%`,
      priceStatus: estadoPrecio,
      description: "Reloj de bolsillo Omega de manufactura suiza con movimiento mecánico manual. Presenta grabados florales característicos del período Art Déco y numeración de serie visible.",
      keywords: ["omega", "reloj bolsillo", "oro 18k", "art deco", "vintage", "suizo"],
      references: [
        {
          title: "Historia de Omega - Museo del Reloj",
          url: "https://museodelreloj.com/omega-historia",
          site: "Museo del Reloj"
        },
        {
          title: "Guía de Relojes de Bolsillo Vintage",
          url: "https://antiquewatchguide.com/pocket-watches",
          site: "Antique Watch Guide"
        },
        {
          title: "Valoración de Relojes Omega Antiguos",
          url: "https://christies.com/omega-vintage",
          site: "Christie's"
        }
      ]
    };

    setResults(mockResults);

    // Simular búsqueda de comparables
    setTimeout(async () => {
      const comparablesCategoria = comparables[categoria] || [];
      const mockComparables = comparablesCategoria.slice(0, 3).map((comp, index) => ({
        id: index + 1,
        title: comp.titulo,
        price: `€${comp.precio.toLocaleString()}`,
        date: comp.fecha,
        site: comp.fuente,
        url: comp.url,
        image: `Imagen de ${comp.titulo}`
      }));

      setComparablesData(mockComparables);
      setIsAnalyzing(false);
      
      toast({
        title: "✅ Análisis completado",
        description: `Tasación y ${mockComparables.length} comparables listos`
      });
    }, 1500);
  };

  const generate3DModel = async () => {
    if (!results) return;

    setIs3DLoading(true);
    
    // Simular carga del modelo 3D
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setShow3DModel(true);
    setIs3DLoading(false);
    
    toast({
      title: "🎯 Modelo 3D generado",
      description: "Vista tridimensional lista para explorar"
    });
  };

  const publishObject = () => {
    if (!results) {
      toast({
        title: "❌ No hay resultados para publicar",
        description: "Primero analiza un objeto",
        variant: "destructive"
      });
      return;
    }

    // Guardar datos en localStorage para prellenar el formulario
    const publishData = {
      title: results.title,
      category: results.category,
      period: results.period,
      material: results.material,
      condition: results.condition,
      price: results.estimatedPoint.toString(),
      description: results.description,
      image: capturedImage,
      fromTasador: true,
      priceStatus: results.priceStatus
    };

    localStorage.setItem('tasadorData', JSON.stringify(publishData));
    
    toast({
      title: "🚀 Redirigiendo a publicación",
      description: "Datos prellenados automáticamente"
    });

    navigate('/publicar');
  };

  return (
    <div className="min-h-screen py-8">
      <Helmet>
        <title>Tasador IA - Collections</title>
        <meta name="description" content="Tasa tus objetos de colección con inteligencia artificial. Obtén valoraciones precisas y profesionales al instante." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="elegant-title text-4xl md:text-5xl mb-4">
              Tasador <span className="gold-accent">Inteligente</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre el valor de tus objetos con nuestra IA especializada en antigüedades y coleccionables
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Atajos: <kbd className="px-2 py-1 bg-gray-100 rounded">C</kbd> capturar, 
              <kbd className="px-2 py-1 bg-gray-100 rounded ml-1">V</kbd> voz, 
              <kbd className="px-2 py-1 bg-gray-100 rounded ml-1">/</kbd> buscar
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Panel de Cámara */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl luxury-shadow p-6">
                <h2 className="elegant-title text-2xl mb-6">Vista de Cámara</h2>
                
                <div className="relative mb-6">
                  {isCameraActive ? (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-80 object-cover rounded-lg bg-black"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {/* Overlay de captura */}
                      <div className="absolute inset-0 border-2 border-dashed border-yellow-400 rounded-lg pointer-events-none opacity-50" />
                      
                      {/* Botón de captura flotante */}
                      <button
                        onClick={captureImage}
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-yellow-400 hover:bg-yellow-500 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
                        title="Capturar imagen (C)"
                      >
                        <Camera className="w-8 h-8" />
                      </button>
                    </div>
                  ) : (
                    <div className="camera-placeholder">
                      {cameraError ? (
                        <div className="text-center">
                          <Camera className="w-16 h-16 mx-auto mb-4 text-red-400" />
                          <p className="text-lg font-medium text-red-600 mb-2">Error de Cámara</p>
                          <p className="text-sm text-gray-500 mb-4">
                            {cameraError === 'NotAllowedError' 
                              ? 'Permiso denegado. Permite el acceso a la cámara en la configuración del navegador.'
                              : 'No se pudo acceder a la cámara. Verifica que esté conectada y disponible.'
                            }
                          </p>
                          <button
                            onClick={startCamera}
                            className="flex items-center space-x-2 mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            <RefreshCw className="w-4 h-4" />
                            <span>Reintentar</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                          <p className="text-lg font-medium">Cámara Inactiva</p>
                          <p className="text-sm text-gray-500">Activa la cámara para comenzar</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={toggleCamera}
                    className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      isCameraActive
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    {isCameraActive ? (
                      <>
                        <Pause className="w-5 h-5 inline mr-2" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 inline mr-2" />
                        Activar Cámara
                      </>
                    )}
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-300"
                  >
                    <Upload className="w-5 h-5 inline mr-2" />
                    Subir
                  </button>
                </div>
              </div>

              {/* Imagen capturada */}
              {capturedImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl luxury-shadow p-6"
                >
                  <h3 className="elegant-title text-lg mb-4">Imagen Capturada</h3>
                  <img 
                    src={capturedImage} 
                    alt="Objeto capturado" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </motion.div>
              )}
            </div>

            {/* Panel de Controles y Resultados */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl luxury-shadow p-6">
                <h2 className="elegant-title text-2xl mb-6">Controles de Tasación</h2>
                
                <div className="space-y-4">
                  <button
                    onClick={handleVoiceToggle}
                    className={`w-full flex items-center justify-center space-x-3 py-4 rounded-lg font-semibold transition-all duration-300 ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                    title="Alternar grabación de voz (V)"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5" />
                        <span>Detener Grabación</span>
                        {isListening && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5" />
                        <span>Hablar</span>
                      </>
                    )}
                  </button>

                  {/* Transcripción */}
                  {transcript && (
                    <div className="p-4 bg-blue-50 rounded-lg luxury-border">
                      <h4 className="font-semibold text-sm mb-2">Transcripción:</h4>
                      <p className="text-sm text-gray-700">{transcript}</p>
                      <button
                        onClick={() => setTranscript('')}
                        className="mt-2 text-xs text-blue-600 hover:underline"
                      >
                        Limpiar
                      </button>
                    </div>
                  )}

                  <button
                    onClick={captureImage}
                    disabled={!isCameraActive}
                    className="w-full flex items-center justify-center space-x-3 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Capturar imagen (C)"
                  >
                    <Camera className="w-5 h-5" />
                    <span>Capturar Imagen</span>
                  </button>
                </div>
              </div>

              {/* Análisis en progreso */}
              {isAnalyzing && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl luxury-shadow p-6"
                >
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto mb-4 text-yellow-500 animate-spin" />
                    <h3 className="elegant-title text-lg mb-2">Analizando objeto...</h3>
                    <p className="text-gray-600">Identificando características y buscando comparables</p>
                  </div>
                </motion.div>
              )}

              {/* Resultados */}
              {results && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl luxury-shadow p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="elegant-title text-xl">Resultados de Tasación</h3>
                    <div className="flex space-x-2">
                      <span className="text-sm bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        {results.confidence} confianza
                      </span>
                      {results.priceStatus !== 'normal' && (
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          results.priceStatus === 'oferta' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {results.priceStatus === 'oferta' ? 'Oferta' : 'Sobrevalorado'}
                        </span>
                      )}
                      <button
                        onClick={speakResults}
                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                        title="Escuchar resultados"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg gold-accent">{results.title}</h4>
                      <p className="text-gray-600">{results.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-500">Categoría:</span>
                        <p className="font-semibold capitalize">{results.category}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Período:</span>
                        <p className="font-semibold">{results.period}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Material:</span>
                        <p className="font-semibold">{results.material}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-500">Estado:</span>
                        <p className="font-semibold">{results.condition}</p>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-4 rounded-lg luxury-border">
                      <span className="font-medium text-gray-500">Valor Estimado:</span>
                      <p className="text-2xl font-bold gold-accent">{results.estimatedValue}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Punto medio: €{results.estimatedPoint?.toLocaleString()}
                      </p>
                    </div>

                    {/* Referencias */}
                    <div>
                      <h4 className="font-semibold mb-2">Referencias:</h4>
                      <div className="space-y-2">
                        {results.references.map((ref, index) => (
                          <a
                            key={index}
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <p className="font-medium text-sm">{ref.title}</p>
                            <p className="text-xs text-gray-500">{ref.site}</p>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={generate3DModel}
                        disabled={is3DLoading}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                      >
                        {is3DLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Generando...</span>
                          </>
                        ) : (
                          <>
                            <Cube className="w-5 h-5" />
                            <span>Generar 3D</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={publishObject}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300"
                      >
                        <ArrowRight className="w-5 h-5" />
                        <span>Publicar</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Modelo 3D */}
              {show3DModel && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl luxury-shadow p-6"
                >
                  <h3 className="elegant-title text-lg mb-4 flex items-center">
                    <Cube className="w-5 h-5 mr-2" />
                    Modelo 3D Generado
                  </h3>
                  <div className="h-64 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mx-auto mb-4 animate-pulse" />
                      <p className="font-semibold text-purple-700">Modelo 3D Interactivo</p>
                      <p className="text-sm text-purple-600">Arrastra para rotar • Scroll para zoom</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Comparables */}
              {comparablesData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl luxury-shadow p-6"
                >
                  <h3 className="elegant-title text-lg mb-4">Objetos Comparables</h3>
                  <div className="space-y-3">
                    {comparablesData.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{item.title}</h4>
                          <p className="text-xs text-gray-500">{item.site} • {new Date(item.date).toLocaleDateString('es-ES')}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold gold-accent">{item.price}</p>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                                                    Ver detalles
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Tasador;
