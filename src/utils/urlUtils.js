// Utilidades para manejo de URL y filtros

export function obtenerFiltrosDeURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    location: params.get('location') || '',
    category: params.get('category') || '',
    priceRange: params.get('priceRange') || '',
    period: params.get('period') || '',
    search: params.get('search') || '',
    sortBy: params.get('sortBy') || 'relevance'
  };
}

export function actualizarURLConFiltros(filtros) {
  const params = new URLSearchParams();
  
  Object.entries(filtros).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params.set(key, value);
    }
  });
  
  const nuevaURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
  window.history.replaceState({}, '', nuevaURL);
}

export function limpiarFiltrosURL() {
  window.history.replaceState({}, '', window.location.pathname);
}
