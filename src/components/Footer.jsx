import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white/90 backdrop-blur-md luxury-shadow mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div>
            <span className="elegant-title text-2xl gold-accent">Collections</span>
            <p className="mt-4 text-gray-600 leading-relaxed">
              La plataforma de lujo para coleccionistas. Descubre, tasa y subasta objetos únicos con la ayuda de inteligencia artificial.
            </p>
          </div>

          {/* Enlaces legales */}
          <div>
            <span className="elegant-title text-lg text-gray-900 block mb-4">Legal</span>
            <div className="space-y-3">
              <Link to="/legal/terminos" className="block text-gray-600 hover:text-yellow-600 transition-colors">
                Términos y Condiciones
              </Link>
              <Link to="/legal/privacidad" className="block text-gray-600 hover:text-yellow-600 transition-colors">
                Política de Privacidad
              </Link>
              <Link to="/legal/cookies" className="block text-gray-600 hover:text-yellow-600 transition-colors">
                Política de Cookies
              </Link>
            </div>
          </div>

          {/* Soporte */}
          <div>
            <span className="elegant-title text-lg text-gray-900 block mb-4">Soporte</span>
            <div className="space-y-3">
              <Link to="/faq" className="block text-gray-600 hover:text-yellow-600 transition-colors">
                Preguntas Frecuentes
              </Link>
              <Link to="/contacto" className="block text-gray-600 hover:text-yellow-600 transition-colors">
                Contacto
              </Link>
              <Link to="/ayuda" className="block text-gray-600 hover:text-yellow-600 transition-colors">
                Centro de Ayuda
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t luxury-border mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2024 Collections. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
