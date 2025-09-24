import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Tasador from '@/pages/Tasador';
import Publicar from '@/pages/Publicar';
import Feed from '@/pages/Feed';
import Subastas from '@/pages/Subastas';
import SubastaDetalle from '@/pages/SubastaDetalle';
import ObjetoDetalle from '@/pages/ObjetoDetalle';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <div className="min-h-screen wood-texture">
        <Helmet>
          <html lang="es" />
          <title>Collections - Descubre, tasa y subasta tesoros</title>
          <meta name="description" content="Plataforma de lujo para coleccionistas. Descubre, tasa con IA y subasta objetos únicos y valiosos." />
        </Helmet>
        
        <Header />
        
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasador" element={<Tasador />} />
            <Route path="/publicar" element={<Publicar />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/subastas" element={<Subastas />} />
            <Route path="/subastas/:id" element={<SubastaDetalle />} />
            <Route path="/objeto/:id" element={<ObjetoDetalle />} />
          </Routes>
        </main>
        
        <Footer />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
