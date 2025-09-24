import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Camera, Upload, Gavel, Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/feed?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md luxury-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="elegant-title text-3xl gold-accent">Collections</h1>
          </Link>

          {/* Buscador central - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar objetos, categorías, épocas..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80"
                />
              </div>
            </form>
          </div>

          {/* Navegación - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/tasador"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              <Camera className="w-5 h-5 gold-accent" />
              <span className="font-medium">Tasador IA</span>
            </Link>
            <Link
              to="/publicar"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              <Upload className="w-5 h-5 gold-accent" />
              <span className="font-medium">Publicar</span>
            </Link>
            <Link
              to="/subastas"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors"
            >
              <Gavel className="w-5 h-5 gold-accent" />
              <span className="font-medium">Subastas</span>
            </Link>
          </nav>

          {/* Menú móvil */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-yellow-50"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menú móvil expandido */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t luxury-border"
          >
            {/* Buscador móvil */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="w-full pl-12 pr-4 py-3 rounded-full border luxury-border focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white/80"
                />
              </div>
            </form>

            {/* Enlaces móviles */}
            <div className="space-y-2">
              <Link
                to="/tasador"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-yellow-50 transition-colors"
              >
                <Camera className="w-5 h-5 gold-accent" />
                <span className="font-medium">Tasador IA</span>
              </Link>
              <Link
                to="/publicar"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-yellow-50 transition-colors"
              >
                <Upload className="w-5 h-5 gold-accent" />
                <span className="font-medium">Publicar</span>
              </Link>
              <Link
                to="/subastas"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-yellow-50 transition-colors"
              >
                <Gavel className="w-5 h-5 gold-accent" />
                <span className="font-medium">Subastas</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
