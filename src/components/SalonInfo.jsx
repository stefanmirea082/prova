import React from 'react';
import { Clock, MapPin, Phone, Mail, Sparkles, Check } from 'lucide-react';
import { SALON_CONFIG } from '../salonConfig.js';

const SERVICES = {
  uomo: [
    { id: 'taglio-skin-fade-shampoo-barba', name: 'Taglio Skin Fade + Shampoo + Barba', price: 42, duration: 45, desc: 'Servizio completo di rasatura sfumata, shampoo condizionante e cura della barba con massaggio.' },
    { id: 'taglio-skin-fade-shampoo', name: 'Taglio Skin Fade + Shampoo', price: 27, duration: 30, desc: 'Sfumatura pelle ad alta precisione, shampoo purificante e styling finale.' },
    { id: 'taglio-shampoo-barba', name: 'Taglio + Shampoo + Barba', price: 39, duration: 45, desc: 'Taglio classico o moderno, lavaggio profondo e rifinitura barba con panno caldo.' },
    { id: 'rasatura-shampoo-barba', name: 'Rasatura + Shampoo + Barba', price: 33, duration: 30, desc: 'Rasatura completa testa a macchinetta o rasoio, lavaggio e cura barba.' },
    { id: 'permanente-uomo', name: 'Permanente Uomo', price: 50, duration: 30, desc: 'Servizio di ondulazione permanente per capelli mossi o ricci definiti.' },
    { id: 'stiratura-uomo', name: 'Stiratura Capelli', price: 35, duration: 30, desc: 'Trattamento lisciante per capelli disciplinati e setosi.' },
    { id: 'colore-uomo', name: 'Colore Uomo', price: 30, duration: 30, desc: 'Copertura capelli bianchi o tonalizzazione naturale.' },
    { id: 'taglio-bimbo', name: 'Taglio Bimbo (Under 12)', price: 15, duration: 30, desc: 'Taglio per i più piccoli in un ambiente accogliente e rilassante.' }
  ],
  donna: [
    { id: 'colore-veloce-piega-shampoo-crema', name: 'Colore Veloce + Piega + Shampoo + Crema', price: 64, duration: 60, desc: 'Servizio colore a posa rapida, lavaggio idratante con maschera rigenerante e piega professionale.' },
    { id: 'laminazione-piega', name: 'Laminazione + Piega', price: 43, duration: 60, desc: 'Trattamento specchio laminante per capelli lucidi, forti e super luminosi.' },
    { id: 'taglio-donna-piega', name: 'Taglio Donna + Piega', price: 35, duration: 45, desc: 'Taglio personalizzato in base alla fisionomia, shampoo specifico e piega di tendenza.' },
    { id: 'colore-taglio-piega', name: 'Colore + Taglio + Piega', price: 70, duration: 90, desc: 'Colore completo, taglio moda e piega con styling.' },
    { id: 'balayage-piega', name: 'Balayage + Piega', price: 90, duration: 120, desc: 'Schiariture artistiche sfumate ad effetto naturale con tonalizzazione e piega.' },
    { id: 'piega', name: 'Piega Donna', price: 18, duration: 30, desc: 'Shampoo condizionante e piega con spazzola, phon o piastra.' },
    { id: 'ricostruzione-capelli', name: 'Trattamento Ricostruzione', price: 25, duration: 30, desc: 'Trattamento intensivo a base di cheratina per ricostruire la fibra capillare danneggiata.' },
    { id: 'raccolto-sposa', name: 'Raccolto Sposa (Consulenza inclusa)', price: 300, duration: 60, desc: 'Acconciatura da sposa personalizzata con prova preliminare inclusa.' }
  ],
  manicure: [
    { id: 'manicure', name: 'Manicure Classica', price: 15, duration: 30, desc: 'Cura delle unghie, rimozione cuticole, idratazione mani e applicazione smalto curativo o colorato.' }
  ]
};

const OPENING_HOURS = [
  { dayIndex: 2, name: 'Martedì', hours: '09:00 - 19:00' },
  { dayIndex: 3, name: 'Mercoledì', hours: '09:00 - 19:00' },
  { dayIndex: 4, name: 'Giovedì', hours: '09:00 - 19:00' },
  { dayIndex: 5, name: 'Venerdì', hours: '09:00 - 19:00' },
  { dayIndex: 6, name: 'Sabato', hours: '09:00 - 19:00' },
  { dayIndex: 0, name: 'Domenica', hours: 'Chiuso', closed: true },
  { dayIndex: 1, name: 'Lunedì', hours: 'Chiuso', closed: true }
];

function SalonInfo({ onSelectService }) {
  const currentDayOfWeek = new Date().getDay(); // 0 = Sun, 1 = Mon, 2 = Tue, etc.

  // Reorder hours to display Monday first
  const displayHours = [
    OPENING_HOURS.find(h => h.dayIndex === 1),
    ...OPENING_HOURS.filter(h => h.dayIndex !== 1 && h.dayIndex !== 0),
    OPENING_HOURS.find(h => h.dayIndex === 0)
  ];

  return (
    <div className="salon-info-section">
      {/* Service Menu List */}
      <section id="servizi" style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="hero-subtitle">Listino Prezzi</span>
            <h3 className="section-title">I Nostri Servizi Esclusivi</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            {/* UOMO */}
            <div>
              <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
                Prenotazioni Uomo
              </h4>
              <div className="categories-container">
                {SERVICES.uomo.map(service => (
                  <div key={service.id} className="glass-card service-card">
                    <div className="service-card-header">
                      <h5 className="service-name">{service.name}</h5>
                      <span className="service-price">{service.price.toFixed(2)} €</span>
                    </div>
                    <p className="service-desc">{service.desc}</p>
                    <div className="service-footer">
                      <span className="service-duration">
                        <Clock size={12} /> {service.duration} Min
                      </span>
                      <button className="btn btn-gold" onClick={() => onSelectService({ ...service, category: 'uomo' })} style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                        Prenota
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DONNA */}
            <div>
              <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
                Prenotazioni Donna
              </h4>
              <div className="categories-container">
                {SERVICES.donna.map(service => (
                  <div key={service.id} className="glass-card service-card">
                    <div className="service-card-header">
                      <h5 className="service-name">{service.name}</h5>
                      <span className="service-price">{service.price.toFixed(2)} €</span>
                    </div>
                    <p className="service-desc">{service.desc}</p>
                    <div className="service-footer">
                      <span className="service-duration">
                        <Clock size={12} /> {service.duration} Min
                      </span>
                      <button className="btn btn-gold" onClick={() => onSelectService({ ...service, category: 'donna' })} style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                        Prenota
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MANICURE */}
            <div>
              <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.6rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'var(--font-display)' }}>
                Manicure & Mani
              </h4>
              <div className="categories-container">
                {SERVICES.manicure.map(service => (
                  <div key={service.id} className="glass-card service-card">
                    <div className="service-card-header">
                      <h5 className="service-name">{service.name}</h5>
                      <span className="service-price">{service.price.toFixed(2)} €</span>
                    </div>
                    <p className="service-desc">{service.desc}</p>
                    <div className="service-footer">
                      <span className="service-duration">
                        <Clock size={12} /> {service.duration} Min
                      </span>
                      <button className="btn btn-gold" onClick={() => onSelectService({ ...service, category: 'manicure' })} style={{ padding: '8px 16px', fontSize: '0.75rem' }}>
                        Prenota
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info & Map Section */}
      <section id="contatti" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="hero-subtitle">Contatti & Orari</span>
            <h3 className="section-title">Vieni a Trovarci</h3>
          </div>

          <div className="info-grid">
            {/* Hours and Details */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={20} /> Orari di Apertura
                </h4>
                <table className="hours-table">
                  <tbody>
                    {displayHours.map((h) => {
                      const isToday = h.dayIndex === currentDayOfWeek;
                      return (
                        <tr key={h.name} className={isToday ? 'hours-today' : ''}>
                          <td className="hours-day">
                            {h.name} {isToday && ' (Oggi)'}
                          </td>
                          <td className={h.closed ? 'hours-closed' : 'hours-time'}>
                            {h.hours}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div>
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '1.3rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={20} /> Dove Siamo & Contatti
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <MapPin size={18} color="#cfa832" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <p style={{ color: '#fff', fontWeight: 600 }}>{SALON_CONFIG.name}</p>
                      <p>{SALON_CONFIG.address}</p>
                      <p>{SALON_CONFIG.postalCode} {SALON_CONFIG.city}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Phone size={18} color="#cfa832" />
                    <div>
                      <p>Telefono Salone: <a href={`tel:${SALON_CONFIG.phone.replace(/\s+/g, '')}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>{SALON_CONFIG.phone}</a></p>
                      <p>Cellulare/WhatsApp: <a href={`tel:${SALON_CONFIG.mobile.replace(/\s+/g, '')}`} style={{ color: '#fff', textDecoration: 'none' }}>{SALON_CONFIG.mobile}</a></p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Mail size={18} color="#cfa832" />
                    <p>Email: <a href={`mailto:${SALON_CONFIG.email}`} style={{ color: '#fff', textDecoration: 'none' }}>{SALON_CONFIG.email}</a></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="glass-card" style={{ padding: '0', overflow: 'hidden', height: '400px', position: 'relative' }}>
              <iframe
                title={`${SALON_CONFIG.name} Location Map`}
                src={SALON_CONFIG.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 'none', filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.2)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'var(--bg-primary)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: 600 }}>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SALON_CONFIG.name + ' ' + SALON_CONFIG.address)}`}
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ color: 'var(--accent-gold)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  Apri in Google Maps <Sparkles size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SalonInfo;
