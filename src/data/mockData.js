// Datos simulados para la demo
export const usuarios = [
  { id: 1, nombre: "Antonio M.", avatar: null, ciudad: "Madrid", valoracion: 4.8 },
  { id: 2, nombre: "Carmen L.", avatar: null, ciudad: "Barcelona", valoracion: 4.9 },
  { id: 3, nombre: "Miguel R.", avatar: null, ciudad: "Valencia", valoracion: 4.7 },
  { id: 4, nombre: "Isabel F.", avatar: null, ciudad: "Sevilla", valoracion: 4.6 },
  { id: 5, nombre: "Carlos V.", avatar: null, ciudad: "Bilbao", valoracion: 4.9 },
  { id: 6, nombre: "Elena P.", avatar: null, ciudad: "Madrid", valoracion: 4.8 },
  { id: 7, nombre: "Francisco J.", avatar: null, ciudad: "Barcelona", valoracion: 4.7 },
  { id: 8, nombre: "Ana M.", avatar: null, ciudad: "Valencia", valoracion: 4.5 }
];

export const comparables = {
  "relojes": [
    { fuente: "Heritage Auctions", titulo: "Omega Speedmaster 1969", precio: 12800, moneda: "EUR", fecha: "2024-01-15", url: "https://ha.com/omega-1969" },
    { fuente: "Christie's", titulo: "Rolex Submariner 1965", precio: 18500, moneda: "EUR", fecha: "2024-01-20", url: "https://christies.com/rolex-1965" },
    { fuente: "Sotheby's", titulo: "Patek Philippe Calatrava", precio: 85000, moneda: "EUR", fecha: "2024-01-10", url: "https://sothebys.com/patek" },
    { fuente: "Bonhams", titulo: "Omega Pocket Watch 1925", precio: 3200, moneda: "EUR", fecha: "2024-01-25", url: "https://bonhams.com/omega-pocket" },
    { fuente: "Phillips", titulo: "Cartier Tank 1970", precio: 8900, moneda: "EUR", fecha: "2024-01-18", url: "https://phillips.com/cartier" }
  ],
  "joyeria": [
    { fuente: "Sotheby's", titulo: "Collar Art Déco Perlas", precio: 3800, moneda: "EUR", fecha: "2024-01-12", url: "https://sothebys.com/collar-deco" },
    { fuente: "Christie's", titulo: "Anillo Diamante 2.5ct", precio: 45000, moneda: "EUR", fecha: "2024-01-22", url: "https://christies.com/diamante" },
    { fuente: "Bonhams", titulo: "Broche Esmeralda Art Nouveau", precio: 12500, moneda: "EUR", fecha: "2024-01-08", url: "https://bonhams.com/esmeralda" },
    { fuente: "Heritage", titulo: "Pendientes Rubí Vintage", precio: 7200, moneda: "EUR", fecha: "2024-01-30", url: "https://ha.com/rubi" }
  ],
  "ceramica": [
    { fuente: "Sotheby's", titulo: "Jarrón Ming Dinastía", precio: 9200, moneda: "EUR", fecha: "2024-01-14", url: "https://sothebys.com/ming" },
    { fuente: "Christie's", titulo: "Plato Talavera S.XVIII", precio: 1800, moneda: "EUR", fecha: "2024-01-28", url: "https://christies.com/talavera" },
    { fuente: "Bonhams", titulo: "Figura Porcelana Meissen", precio: 4500, moneda: "EUR", fecha: "2024-01-16", url: "https://bonhams.com/meissen" }
  ],
  "arte": [
    { fuente: "Sotheby's", titulo: "Óleo Paisaje S.XIX", precio: 15800, moneda: "EUR", fecha: "2024-01-11", url: "https://sothebys.com/oleo" },
    { fuente: "Christie's", titulo: "Acuarela Impresionista", precio: 125000, moneda: "EUR", fecha: "2024-01-19", url: "https://christies.com/acuarela" },
    { fuente: "Phillips", titulo: "Escultura Bronce Art Nouveau", precio: 7500, moneda: "EUR", fecha: "2024-01-26", url: "https://phillips.com/bronce" }
  ],
  "instrumentos": [
    { fuente: "Tarisio", titulo: "Violín Alemán 1890", precio: 24500, moneda: "EUR", fecha: "2024-01-13", url: "https://tarisio.com/violin" },
    { fuente: "Bonhams", titulo: "Piano Steinway 1920", precio: 45000, moneda: "EUR", fecha: "2024-01-21", url: "https://bonhams.com/steinway" }
  ],
  "libros": [
    { fuente: "Heritage", titulo: "Manuscrito Medieval", precio: 18200, moneda: "EUR", fecha: "2024-01-17", url: "https://ha.com/manuscrito" },
    { fuente: "Sotheby's", titulo: "Primera Edición Quijote", precio: 12800, moneda: "EUR", fecha: "2024-01-24", url: "https://sothebys.com/quijote" }
  ],
  "monedas": [
    { fuente: "Heritage", titulo: "Moneda Romana Aureus", precio: 4100, moneda: "EUR", fecha: "2024-01-09", url: "https://ha.com/aureus" },
    { fuente: "Stack's", titulo: "Doblón Español 1650", precio: 8500, moneda: "EUR", fecha: "2024-01-27", url: "https://stacks.com/doblon" }
  ],
  "antiguedades": [
    { fuente: "Bonhams", titulo: "Armadura Samurái S.XVII", precio: 28000, moneda: "EUR", fecha: "2024-01-23", url: "https://bonhams.com/samurai" },
    { fuente: "Christie's", titulo: "Mapa Antiguo América 1650", precio: 2200, moneda: "EUR", fecha: "2024-01-29", url: "https://christies.com/mapa" }
  ]
};

export const objetos = [
  {
    id: 1,
    titulo: "Reloj Omega Speedmaster 1969",
    descripcion: "Excepcional Omega Speedmaster Professional de 1969, el mismo modelo que acompañó a los astronautas en la misión Apollo 11. Este ejemplar presenta el calibre 861 manual, caja de acero inoxidable de 42mm y la icónica esfera negra con subdiales. Incluye documentación de autenticidad y caja original.",
    categoria: "relojes",
    epoca: "1950-1970",
    estado: "Excelente",
    materiales: ["Acero Inoxidable", "Cristal Hesalite"],
    imagenes: ["omega-speedmaster-1.jpg", "omega-speedmaster-2.jpg"],
    modelo3D: null,
    ubicacion: { lat: 40.4168, lng: -3.7038, ciudad: "Madrid" },
    creadoEn: "2024-01-15T10:30:00Z",
    duenoId: 1,
    precioAnunciado: 12500,
    precioEstimado: { min: 11800, max: 13500, punto: 12650, confianza: 0.89 },
    estadoDePrecio: "normal"
  },
  {
    id: 2,
    titulo: "Jarrón Ming Dinastía Auténtico",
    descripcion: "Extraordinario jarrón de la dinastía Ming (1368-1644) con decoración de dragones en azul cobalto sobre fondo blanco. Pieza de museo con certificado de autenticidad y procedencia documentada. Altura: 35cm.",
    categoria: "ceramica",
    epoca: "Siglo XV-XVII",
    estado: "Muy Bueno",
    materiales: ["Porcelana", "Esmalte Cobalto"],
    imagenes: ["ming-vase-1.jpg", "ming-vase-2.jpg"],
    modelo3D: "ming-vase.glb",
    ubicacion: { lat: 41.3851, lng: 2.1734, ciudad: "Barcelona" },
    creadoEn: "2024-01-20T14:15:00Z",
    duenoId: 2,
    precioAnunciado: 6500, // Precio bajo = oferta
    precioEstimado: { min: 8200, max: 10500, punto: 9350, confianza: 0.82 },
    estadoDePrecio: "oferta"
  },
  {
    id: 3,
    titulo: "Pintura Óleo Paisaje Romántico S.XIX",
    descripcion: "Magnífico óleo sobre lienzo del período romántico español. Paisaje montañoso con técnica impresionista temprana. Firmado 'J. Martínez 1887'. Marco original dorado de época. Dimensiones: 80x60cm.",
    categoria: "arte",
    epoca: "Siglo XIX",
    estado: "Excelente",
    materiales: ["Óleo", "Lienzo", "Marco Dorado"],
    imagenes: ["oleo-paisaje-1.jpg", "oleo-paisaje-2.jpg"],
    modelo3D: null,
    ubicacion: { lat: 39.4699, lng: -0.3763, ciudad: "Valencia" },
    creadoEn: "2024-01-18T09:45:00Z",
    duenoId: 3,
    precioAnunciado: 22000, // Precio alto = sobrevalorado
    precioEstimado: { min: 14500, max: 17200, punto: 15850, confianza: 0.76 },
    estadoDePrecio: "sobrevalorado"
  },
  {
    id: 4,
    titulo: "Collar Art Déco Perlas Naturales",
    descripcion: "Elegante collar Art Déco de los años 20 con perlas naturales de Akoya y cierre de platino con diamantes. Longitud: 45cm. Incluye certificado gemológico de autenticidad de las perlas.",
    categoria: "joyeria",
    epoca: "Art Déco",
    estado: "Excelente",
    materiales: ["Perlas Naturales", "Platino", "Diamantes"],
    imagenes: ["collar-deco-1.jpg", "collar-deco-2.jpg"],
    modelo3D: "collar-deco.glb",
    ubicacion: { lat: 37.3886, lng: -5.9823, ciudad: "Sevilla" },
    creadoEn: "2024-01-22T16:20:00Z",
    duenoId: 4,
    precioAnunciado: 3400,
    precioEstimado: { min: 3200, max: 4100, punto: 3650, confianza: 0.91 },
    estadoDePrecio: "normal"
  },
  {
    id: 5,
    titulo: "Violín Alemán Mittenwald 1890",
    descripcion: "Violín alemán de la escuela de Mittenwald, circa 1890. Tapa de abeto alemán, fondo de arce flameado. Sonoridad cálida y proyección excelente. Incluye arco de pernambuco y estuche de época.",
    categoria: "instrumentos",
    epoca: "Siglo XIX",
    estado: "Muy Bueno",
    materiales: ["Abeto", "Arce", "Ébano"],
    imagenes: ["violin-aleman-1.jpg", "violin-aleman-2.jpg"],
    modelo3D: "violin.glb",
    ubicacion: { lat: 43.2627, lng: -2.9253, ciudad: "Bilbao" },
    creadoEn: "2024-01-25T11:10:00Z",
    duenoId: 5,
    precioAnunciado: 25000,
    precioEstimado: { min: 23500, max: 26800, punto: 25150, confianza: 0.88 },
    estadoDePrecio: "normal"
  },
  {
    id: 6,
    titulo: "Manuscrito Iluminado Medieval",
    descripcion: "Página de manuscrito medieval del siglo XIV con iluminaciones en oro y pigmentos naturales. Texto en latín con iniciales decoradas. Procedencia: Monasterio de Silos. Conservación excepcional.",
    categoria: "libros",
    epoca: "Siglo XIV",
    estado: "Excelente",
    materiales: ["Pergamino", "Oro", "Pigmentos Naturales"],
    imagenes: ["manuscrito-1.jpg", "manuscrito-2.jpg"],
    modelo3D: null,
    ubicacion: { lat: 40.4168, lng: -3.7038, ciudad: "Madrid" },
    creadoEn: "2024-01-28T13:30:00Z",
    duenoId: 6,
    precioAnunciado: 18500,
    precioEstimado: { min: 17800, max: 19500, punto: 18650, confianza: 0.85 },
    estadoDePrecio: "normal"
  },
  {
    id: 7,
    titulo: "Moneda Romana Aureus Trajano",
    descripcion: "Aureus de oro del emperador Trajano (98-117 d.C.). Anverso: busto laureado. Reverso: Victoria con corona. Peso: 7.2g. Estado de conservación EBC. Pátina natural dorada.",
    categoria: "monedas",
    epoca: "Siglo II d.C.",
    estado: "Muy Bueno",
    materiales: ["Oro"],
    imagenes: ["aureus-1.jpg", "aureus-2.jpg"],
    modelo3D: "aureus.glb",
    ubicacion: { lat: 41.3851, lng: 2.1734, ciudad: "Barcelona" },
    creadoEn: "2024-01-30T08:45:00Z",
    duenoId: 7,
    precioAnunciado: 4200,
    precioEstimado: { min: 3900, max: 4500, punto: 4200, confianza: 0.93 },
    estadoDePrecio: "normal"
  },
  {
    id: 8,
    titulo: "Escultura Bronce Art Nouveau",
    descripción: "Escultura de bronce patinado representando una figura femenina con motivos florales típicos del Art Nouveau. Firmada 'L. Moreau'. Base de mármol negro. Altura: 42cm.",
    categoria: "arte",
    epoca: "Art Nouveau",
    estado: "Excelente",
    materiales: ["Bronce Patinado", "Mármol Negro"],
    imagenes: ["bronce-nouveau-1.jpg", "bronce-nouveau-2.jpg"],
    modelo3D: "bronce-nouveau.glb",
    ubicacion: { lat: 39.4699, lng: -0.3763, ciudad: "Valencia" },
    creadoEn: "2024-02-01T15:20:00Z",
    duenoId: 8,
    precioAnunciado: 5800, // Precio bajo = oferta
    precioEstimado: { min: 7200, max: 8100, punto: 7650, confianza: 0.79 },
    estadoDePrecio: "oferta"
  },
  {
    id: 9,
    titulo: "Reloj Patek Philippe Calatrava 1950",
    descripcion: "Excepcional Patek Philippe Calatrava de 1950 en oro rosa de 18k. Movimiento manual calibre 89. Esfera marfil con índices aplicados. Correa de cocodrilo original. Caja y papeles incluidos.",
    categoria: "relojes",
    epoca: "1950-1970",
    estado: "Excelente",
    materiales: ["Oro Rosa 18k", "Cristal Zafiro"],
    imagenes: ["patek-calatrava-1.jpg", "patek-calatrava-2.jpg"],
    modelo3D: "patek-calatrava.glb",
    ubicacion: { lat: 40.4168, lng: -3.7038, ciudad: "Madrid" },
    creadoEn: "2024-02-02T12:15:00Z",
    duenoId: 1,
    precioAnunciado: 85000,
    precioEstimado: { min: 82000, max: 88000, punto: 85000, confianza: 0.95 },
    estadoDePrecio: "normal"
  },
  {
    id: 10,
    titulo: "Mapa Antiguo América Ortelius 1570",
    descripcion: "Mapa histórico de América del cartógrafo Abraham Ortelius, 1570. Primera representación moderna del continente americano. Coloreado a mano de época. Enmarcado con cristal UV.",
    categoria: "antiguedades",
    epoca: "Siglo XVI",
    estado: "Bueno",
    materiales: ["Papel", "Tintas Naturales"],
    imagenes: ["mapa-america-1.jpg", "mapa-america-2.jpg"],
    modelo3D: null,
    ubicacion: { lat: 37.3886, lng: -5.9823, ciudad: "Sevilla" },
    creadoEn: "2024-02-03T10:30:00Z",
    duenoId: 4,
    precioAnunciado: 3500, // Precio alto = sobrevalorado
    precioEstimado: { min: 2000, max: 2600, punto: 2300, confianza: 0.71 },
    estadoDePrecio: "sobrevalorado"
  },
  {
    id: 11,
    titulo: "Armadura Samurái Edo Completa",
    descripcion: "Armadura completa de samurái del período Edo (1603-1868). Incluye kabuto (casco), do (coraza), kote (guantes) y suneate (espinilleras). Laca negra con mon familiar dorado.",
    categoria: "antiguedades",
    epoca: "Siglo XVII-XIX",
    estado: "Muy Bueno",
    materiales: ["Hierro", "Laca", "Seda", "Cuero"],
    imagenes: ["armadura-samurai-1.jpg", "armadura-samurai-2.jpg"],
    modelo3D: "armadura-samurai.glb",
    ubicacion: { lat: 43.2627, lng: -2.9253, ciudad: "Bilbao" },
    creadoEn: "2024-02-04T14:45:00Z",
    duenoId: 5,
    precioAnunciado: 28500,
    precioEstimado: { min: 26800, max: 30200, punto: 28500, confianza: 0.87 },
    estadoDePrecio: "normal"
  },
  {
    id: 12,
    titulo: "Diamante Talla Brillante 2.5ct",
    descripcion: "Excepcional diamante de talla brillante de 2.5 quilates con certificación GIA. Claridad VS1, color G. Montado en anillo de platino con diseño clásico solitario. Procedencia documentada.",
    categoria: "joyeria",
    epoca: "Contemporáneo",
    estado: "Excelente",
    materiales: ["Diamante", "Platino"],
    imagenes: ["diamante-brillante-1.jpg", "diamante-brillante-2.jpg"],
    modelo3D: "diamante-brillante.glb",
    ubicacion: { lat: 41.3851, lng: 2.1734, ciudad: "Barcelona" },
    creadoEn: "2024-02-05T16:00:00Z",
    duenoId: 2,
    precioAnunciado: 45000,
    precioEstimado: { min: 43500, max: 47200, punto: 45350, confianza: 0.92 },
    estadoDePrecio: "normal"
  }
];

export const subastas = [
  {
    id: 1,
    objetoId: 12, // Diamante
    precioInicio: 25000,
    precioActual: 45000,
    incrementoMinimo: 1000,
    empieza: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    termina: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
    estado: "activa",
    pujas: [
      { usuarioId: 1, cantidad: 25000, hora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 3, cantidad: 28000, hora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString() },
      { usuarioId: 5, cantidad: 32000, hora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 7, cantidad: 38000, hora: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 1, cantidad: 42000, hora: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 3, cantidad: 45000, hora: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 2,
    objetoId: 11, // Armadura Samurái
    precioInicio: 15000,
    precioActual: 28500,
    incrementoMinimo: 500,
    empieza: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    termina: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(),
    estado: "activa",
    pujas: [
      { usuarioId: 2, cantidad: 15000, hora: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 4, cantidad: 18000, hora: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 6, cantidad: 22000, hora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 8, cantidad: 26000, hora: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 2, cantidad: 28500, hora: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 3,
    objetoId: 6, // Manuscrito
    precioInicio: 12000,
    precioActual: 35200,
    incrementoMinimo: 800,
    empieza: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    termina: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    estado: "activa",
    pujas: [
      { usuarioId: 1, cantidad: 12000, hora: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 3, cantidad: 15000, hora: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 5, cantidad: 20000, hora: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 7, cantidad: 25000, hora: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 1, cantidad: 30000, hora: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
      { usuarioId: 3, cantidad: 35200, hora: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() }
    ]
  },
  {
    id: 4,
    objetoId: 9, // Patek Philippe
    precioInicio: 50000,
    precioActual: 50000,
    incrementoMinimo: 2000,
    empieza: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    termina: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    estado: "programada",
    pujas: []
  },
  {
    id: 5,
    objetoId: 5, // Violín
    precioInicio: 18000,
    precioActual: 18000,
    incrementoMinimo: 1000,
    empieza: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    termina: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    estado: "programada",
    pujas: []
  }
];

// Función para calcular estimación de precio
export function calcularEstimacionPrecio(categoria, precioAnunciado) {
  const comparablesCategoria = comparables[categoria] || [];
  
  if (comparablesCategoria.length === 0) {
    return {
      min: precioAnunciado * 0.8,
      max: precioAnunciado * 1.2,
      punto: precioAnunciado,
      confianza: 0.5
    };
  }

  // Ordenar por fecha (más recientes primero) y dar más peso
  const ahora = new Date();
  const preciosConPeso = comparablesCategoria.map(comp => {
    const fechaComp = new Date(comp.fecha);
    const diasDiferencia = (ahora - fechaComp) / (1000 * 60 * 60 * 24);
    const peso = Math.max(0.1, 1 - (diasDiferencia / 365)); // Peso decrece con el tiempo
    return { precio: comp.precio, peso };
  });

  // Quitar extremos (10% más alto y bajo)
  const precios = preciosConPeso.map(p => p.precio).sort((a, b) => a - b);
  const inicio = Math.floor(precios.length * 0.1);
  const fin = Math.ceil(precios.length * 0.9);
  const preciosFiltrados = precios.slice(inicio, fin);

  // Calcular media ponderada
  const sumaPonderada = preciosConPeso.reduce((sum, item) => sum + (item.precio * item.peso), 0);
  const sumaPesos = preciosConPeso.reduce((sum, item) => sum + item.peso, 0);
  const mediaPonderada = sumaPonderada / sumaPesos;

  // Calcular desviación estándar
  const varianza = preciosFiltrados.reduce((sum, precio) => sum + Math.pow(precio - mediaPonderada, 2), 0) / preciosFiltrados.length;
  const desviacion = Math.sqrt(varianza);

  // Confianza basada en cantidad de datos y dispersión
  const confianza = Math.min(0.95, Math.max(0.5, 
    (preciosConPeso.length / 10) * (1 - (desviacion / mediaPonderada))
  ));

  return {
    min: Math.round(mediaPonderada - desviacion * 0.5),
    max: Math.round(mediaPonderada + desviacion * 0.5),
    punto: Math.round(mediaPonderada),
    confianza: Math.round(confianza * 100) / 100
  };
}

// Función para determinar estado de precio
export function determinarEstadoPrecio(precioAnunciado, estimacion) {
  const { punto, min, max } = estimacion;
  const desviacion = (max - min) / 2;
  
  if (precioAnunciado < punto - 0.7 * desviacion) {
    return "oferta";
  } else if (precioAnunciado > punto + 0.7 * desviacion) {
    return "sobrevalorado";
  } else {
    return "normal";
  }
}

// Función para calcular distancia entre coordenadas
export function calcularDistancia(lat1, lng1, lat2, lng2) {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
