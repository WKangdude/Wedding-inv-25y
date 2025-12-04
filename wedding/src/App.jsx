import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [videoStage, setVideoStage] = useState('intro'); // 'intro' o 'loop'
  const [allowScroll, setAllowScroll] = useState(false);
  
  // Referencias a los videos para controlarlos
  const introVideoRef = useRef(null);
  const loopVideoRef = useRef(null);

  useEffect(() => {
    // Un temporizador de seguridad
    const safetyTimer = setTimeout(() => {
      if (isLoading) {
        console.warn("⚠️ El video tardó mucho. Forzando apertura.");
        setIsLoading(false);
        // Intentamos dar play por si acaso ya cargó algo
        if(introVideoRef.current) introVideoRef.current.play().catch(() => {});
      }
    }, 8000); // Espera máximo 8 segundos

    return () => clearTimeout(safetyTimer); // Limpieza
  }, [isLoading]);

  // Efecto para detectar cuando el primer video ha cargado lo suficiente
// En App.jsx

  const handleVideoLoad = () => {
    console.log("✅ El video notificó que ya cargó datos."); // <--- AGREGA ESTO
    setTimeout(() => {
      setIsLoading(false);
      if(introVideoRef.current) {
        console.log("▶️ Intentando reproducir video..."); // <--- AGREGA ESTO
        introVideoRef.current.play()
          .then(() => console.log("🎥 Reproduciendo con éxito"))
          .catch(e => console.error("❌ Error al reproducir:", e));
      }
    }, 1500);
  };

  // Función que se ejecuta cuando el Video 1 termina
  const handleIntroEnded = () => {
    setVideoStage('loop');
    setAllowScroll(true); // Habilitamos el scroll
    if(loopVideoRef.current) {
      loopVideoRef.current.play();
    }
  };

  return (
    <div className={`app-container ${allowScroll ? 'scroll-enabled' : 'scroll-locked'}`}>
      
      {/* 1. PANTALLA DE CARGA */}
      {isLoading && (
        <div className="loader-screen">
          <div className="spinner"></div>
          <p>Cargando invitación</p>
        </div>
      )}

      {/* 2. SECCIÓN HERO (VIDEOS) */}
      <section className="hero-section">
        
        {/* VIDEO 1: Intro (Puertas abriendo) */}
        <video
          ref={introVideoRef}
          className={`video-bg ${videoStage === 'intro' ? 'visible' : 'hidden'}`}
          muted
          playsInline // Importante para iPhone
          onLoadedData={handleVideoLoad} // Cuando carga, quitamos el loader
          onEnded={handleIntroEnded} // Cuando termina, cambiamos al loop
        >
          <source src="./intro.mp4" type="video/mp4" />
        </video>

        {/* VIDEO 2: Loop (Flores y puertas abiertas) */}
        <video
          ref={loopVideoRef}
          className={`video-bg ${videoStage === 'loop' ? 'visible' : 'hidden'}`}
          muted
          loop
          playsInline
        >
          <source src="./loop.mp4" type="video/mp4" />
        </video>

        {/* CAPA DE TEXTO (Solo aparece en la fase de Loop) */}
        {videoStage === 'loop' && (
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2, delay: 0.5 }}
          >
            <h1 className="title-names">Betty <br /> & <br /> Albino</h1>
            <h2 className="subtitle">Bodas de Plata</h2>
            
            <motion.div 
              className="scroll-hint"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <p>Desliza para ver detalles</p>
              <span>↓</span>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* 3. SECCIÓN DE INFORMACIÓN (Aparece abajo al hacer scroll) */}
      <section className="info-section">
        <div className="content-wrapper">
          <h2>La Ceremonia</h2>
          <p>Acompáñanos a celebrar 25 años de amor.</p>
          <div className="details-card">
            <h3>Fecha</h3>
            <p>Sábado, 20 de Octubre</p>
            <h3>Lugar</h3>
            <p>Jardín Las Camelias</p>
          </div>
          {/* Relleno para que haya scroll */}
          <br/><br/><br/>
        </div>
      </section>

    </div>
  );
}

export default App;