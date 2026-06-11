import React, { useState, useEffect } from 'react';
import BookingWizard from './components/BookingWizard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import SalonInfo from './components/SalonInfo.jsx';
import { Scissors, Calendar, MapPin, Phone, Clock, ArrowRight, Shield } from 'lucide-react';
import { SALON_CONFIG } from './salonConfig.js';

function App() {
  const [currentView, setCurrentView] = useState('client'); // 'client' or 'admin'
  const [selectedService, setSelectedService] = useState(null);

  // Simple routing based on hash or button toggle
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('client');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
  };

  const navigateToClient = () => {
    window.location.hash = '';
  };

  const scrollToSection = (id) => {
    if (currentView !== 'client') {
      navigateToClient();
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingStart = (service) => {
    setSelectedService(service);
    scrollToSection('prenota');
  };

  return (
    <div className="app-wrapper">
      {/* Premium Luxury Header */}
      <header className="main-header">
        <div className="container header-container">
          <a href="#" className="logo-link" onClick={(e) => { e.preventDefault(); navigateToClient(); }}>
            <Scissors className="logo-icon" size={26} color="#cfa832" />
            <h1 className="logo-text">{SALON_CONFIG.name}</h1>
          </a>

          <ul className="nav-links">
            {currentView === 'client' ? (
              <>
                <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('chi-siamo'); }}>Chi Siamo</a></li>
                <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('servizi'); }}>Servizi</a></li>
                <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('prenota'); }}>Prenota</a></li>
                <li><a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); scrollToSection('contatti'); }}>Contatti</a></li>
                <li>
                  <button className="btn btn-outline" onClick={navigateToAdmin} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                    <Shield size={14} /> Admin
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><a href="#" className="nav-link active">Admin Dashboard</a></li>
                <li>
                  <button className="btn btn-outline" onClick={navigateToClient} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                    Sito Cliente
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </header>

      {/* Main Content Area */}
      <main>
        {currentView === 'client' ? (
          <div className="animate-fade">
            {/* Elegant Landing Hero */}
            <section className="hero container">
              <div>
                <span className="hero-subtitle">{SALON_CONFIG.tagline}</span>
                <h2 className="hero-title">Definisci il Tuo Stile con un Tocco di Fascino</h2>
                <p className="hero-desc">
                  Moda Capelli Uomo, Donna e Bimbo, Barbershop e trattamenti esclusivi di Ossigenoterapia. 
                  Nel cuore di Baggio, offriamo servizi sartoriali ad alta precisione per esaltare la tua bellezza naturale.
                </p>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <button className="btn btn-gold" onClick={() => scrollToSection('prenota')}>
                    Prenota Ora <ArrowRight size={16} />
                  </button>
                  <button className="btn btn-outline" onClick={() => scrollToSection('servizi')}>
                    Scopri i Servizi
                  </button>
                </div>
              </div>
              <div className="hero-image-container">
                <img 
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop" 
                  alt={`${SALON_CONFIG.name} Hair Salon`}
                />
                <div className="hero-image-overlay"></div>
                <div className="hero-badge">
                  <span className="hero-badge-title">{SALON_CONFIG.address}</span>
                  <span className="hero-badge-desc">{SALON_CONFIG.city}</span>
                </div>
              </div>
            </section>

            {/* Chi Siamo Section */}
            <section id="chi-siamo" style={{ background: 'var(--bg-secondary)', padding: '80px 0' }}>
              <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                <span className="hero-subtitle">La nostra storia</span>
                <h3 className="section-title">Oltre 60 Anni di Passione</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '24px' }}>
                  Fondata nel 1963, {SALON_CONFIG.name} rappresenta un punto di riferimento storico per lo stile e la cura dei capelli a Milano.
                  La nostra forza è coniugare la tradizione artigianale del barbershop classico con le ultime tendenze moda femminili e 
                  i trattamenti di ossigenoterapia all'avanguardia per la salute della cute.
                </p>
              </div>
            </section>

            {/* Booking Wizard Section */}
            <section id="prenota" style={{ padding: '80px 0' }}>
              <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <span className="hero-subtitle">Prenotazioni online</span>
                  <h3 className="section-title">Pianifica il Tuo Trattamento</h3>
                  <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
                    Scegli i servizi desiderati, trova la fascia oraria che preferisci e paga comodamente online o direttamente in salone.
                  </p>
                </div>
                <BookingWizard preselectedService={selectedService} clearPreselected={() => setSelectedService(null)} onBookingCreated={() => {}} />
              </div>
            </section>

            {/* General Info / Services Catalog & Mappa */}
            <SalonInfo onSelectService={handleBookingStart} />
          </div>
        ) : (
          <div className="animate-fade">
            <div className="container" style={{ padding: '40px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px', marginBottom: '20px' }}>
                <div>
                  <span className="hero-subtitle">Accesso Amministratore</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Calendario Prenotazioni</h2>
                </div>
                <div className="booking-badge booking-badge-paid" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <Shield size={14} /> Modalità Salone Attiva
                </div>
              </div>
              <AdminDashboard />
            </div>
          </div>
        )}
      </main>

      {/* Luxury Footer */}
      <footer className="main-footer">
        <div className="container">
          <div className="footer-logo">
            {SALON_CONFIG.name}
          </div>
          <p style={{ marginBottom: '16px' }}>{SALON_CONFIG.tagline} | {SALON_CONFIG.city}, {SALON_CONFIG.address}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            &copy; {new Date().getFullYear()} {SALON_CONFIG.name}. Tutti i diritti riservati. P.IVA 06460760967.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
