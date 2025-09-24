import { useEffect } from 'react';

export function useKeyboardShortcuts(callbacks) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignorar si el usuario está escribiendo en un input
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        // Permitir solo la tecla '/' para buscar
        if (event.key === '/' && callbacks.onSearch) {
          event.preventDefault();
          callbacks.onSearch();
        }
        return;
      }
      
      switch (event.key.toLowerCase()) {
        case 'c':
          if (callbacks.onCapture) {
            event.preventDefault();
            callbacks.onCapture();
          }
          break;
        case 'v':
          if (callbacks.onVoice) {
            event.preventDefault();
            callbacks.onVoice();
          }
          break;
        case '/':
          if (callbacks.onSearch) {
            event.preventDefault();
            callbacks.onSearch();
          }
          break;
        case 'escape':
          if (callbacks.onEscape) {
            event.preventDefault();
            callbacks.onEscape();
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [callbacks]);
}
