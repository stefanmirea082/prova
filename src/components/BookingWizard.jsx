import React, { useState, useEffect, useRef } from 'react';
import { Clock, Calendar as CalIcon, User, CreditCard as CardIcon, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Sparkles } from 'lucide-react';
import { SALON_CONFIG } from '../salonConfig.js';

const CATEGORIES = [
  { id: 'uomo', name: 'Uomo' },
  { id: 'donna', name: 'Donna' },
  { id: 'manicure', name: 'Manicure' }
];

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

function BookingWizard({ preselectedService, clearPreselected }) {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('uomo');
  const [service, setService] = useState(null);
  
  // Date & Time states
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Client Details states
  const [clientDetails, setClientDetails] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('salon'); // 'salon' or 'online'
  const [cardDetails, setCardDetails] = useState({
    number: '',
    holder: '',
    expiry: '',
    cvv: ''
  });
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Success state
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Listen to preselected services from catalog click
  useEffect(() => {
    if (preselectedService) {
      setCategory(preselectedService.category);
      setService(preselectedService);
      setStep(2);
      setSelectedDate('');
      setSelectedTime('');
      clearPreselected();
    }
  }, [preselectedService]);

  // Fetch slots whenever date or service changes
  useEffect(() => {
    if (selectedDate && service) {
      setLoadingSlots(true);
      setSelectedTime('');
      fetch(`/api/available-slots?date=${selectedDate}&duration=${service.duration}`)
        .then(res => res.json())
        .then(data => {
          setAvailableSlots(data);
          setLoadingSlots(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingSlots(false);
        });
    }
  }, [selectedDate, service]);

  const handleServiceSelect = (selectedS) => {
    setService(selectedS);
    setStep(2);
  };

  const handleNextStep = () => {
    if (step === 2 && (!selectedDate || !selectedTime)) return;
    if (step === 3 && (!clientDetails.name || !clientDetails.phone)) return;
    setStep(step + 1);
  };

  const handleBackStep = () => {
    setStep(step - 1);
  };

  // Monthly Calendar math
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    // getDay returns 0 = Sunday, 1 = Monday... we map it so 0 = Monday, 6 = Sunday
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (dayNum) => {
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    const day = dayNum.toString().padStart(2, '0');
    setSelectedDate(`${year}-${month}-${day}`);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentMonth);
    const dayElements = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    // Empty cells before first day of month
    for (let i = 0; i < firstDayIndex; i++) {
      dayElements.push(<div key={`empty-${i}`} className="calendar-day disabled"></div>);
    }

    // Days in month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isPast = cellDate < today;
      const dayOfWeek = cellDate.getDay(); // 0 = Sun, 1 = Mon
      const isClosed = dayOfWeek === 0 || dayOfWeek === 1; // Sun & Mon Closed
      
      const year = currentMonth.getFullYear();
      const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const dateString = `${year}-${month}-${dayStr}`;
      
      const isSelected = selectedDate === dateString;
      const isCurrentToday = today.getDate() === day && today.getMonth() === currentMonth.getMonth() && today.getFullYear() === currentMonth.getFullYear();

      const isDisabled = isPast || isClosed;

      dayElements.push(
        <button
          key={`day-${day}`}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''} ${isCurrentToday ? 'today' : ''}`}
          disabled={isDisabled}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </button>
      );
    }

    return dayElements;
  };

  const handleBookingSubmit = async (e) => {
    if (e) e.preventDefault();

    if (paymentMethod === 'online') {
      // Basic validation
      if (!cardDetails.number || !cardDetails.holder || !cardDetails.expiry || !cardDetails.cvv) {
        alert('Compila tutti i campi della carta di credito.');
        return;
      }
      setIsPaying(true);
      // Simulate processing animation
      await new Promise(resolve => setTimeout(resolve, 2500));
      setIsPaying(false);
    }

    const payload = {
      customerName: clientDetails.name,
      customerPhone: clientDetails.phone,
      customerEmail: clientDetails.email,
      serviceId: service.id,
      serviceName: service.name,
      category: category,
      price: service.price,
      duration: service.duration,
      date: selectedDate,
      time: selectedTime,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
      notes: clientDetails.notes
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        setConfirmedBooking(data);
        setStep(5);
      } else {
        const err = await response.json();
        alert(err.error || 'Errore durante la prenotazione. Riprova.');
      }
    } catch (err) {
      console.error(err);
      alert('Errore di connessione al server.');
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formattedValue += ' ';
      formattedValue += value[i];
    }
    setCardDetails({ ...cardDetails, number: formattedValue.substring(0, 19) });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setCardDetails({ ...cardDetails, expiry: value.substring(0, 5) });
  };

  const resetWizard = () => {
    setStep(1);
    setService(null);
    setSelectedDate('');
    setSelectedTime('');
    setClientDetails({ name: '', phone: '', email: '', notes: '' });
    setCardDetails({ number: '', holder: '', expiry: '', cvv: '' });
    setPaymentMethod('salon');
    setConfirmedBooking(null);
  };

  const progressPercent = ((step - 1) / 4) * 100;

  return (
    <div className="glass-card" style={{ maxWidth: '750px', margin: '0 auto', padding: '30px' }}>
      
      {/* Wizard Progress Bar */}
      {step < 5 && (
        <div className="wizard-progress">
          <div className="wizard-progress-bar" style={{ width: `${progressPercent}%` }}></div>
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`wizard-step-node ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
            >
              {step > num ? '✓' : num}
            </div>
          ))}
        </div>
      )}

      {/* STEP 1: SERVICE SELECTION */}
      {step === 1 && (
        <div className="animate-fade">
          <h4 style={{ fontSize: '1.4rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
            1. Seleziona Categoria e Servizio
          </h4>
          
          <div className="category-tabs">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`category-tab ${category === cat.id ? 'active' : ''}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '6px' }}>
            {SERVICES[category].map(s => (
              <div
                key={s.id}
                className="glass-card"
                onClick={() => handleServiceSelect(s)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderColor: 'rgba(207, 168, 50, 0.1)'
                }}
              >
                <div>
                  <h5 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{s.name}</h5>
                  <span className="service-duration" style={{ marginTop: '4px' }}>
                    <Clock size={12} /> {s.duration} min
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '1.1rem' }}>{s.price.toFixed(2)} €</span>
                  <div className="btn btn-gold" style={{ padding: '6px 14px', fontSize: '0.75rem' }}>Scegli</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME SELECTION */}
      {step === 2 && (
        <div className="animate-fade">
          <h4 style={{ fontSize: '1.4rem', marginBottom: '20px', fontFamily: 'var(--font-display)', display: 'flex', justifyContent: 'space-between' }}>
            <span>2. Scegli Data e Ora</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-gold)' }}>{service?.name} ({service?.price}€)</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Calendar Column */}
            <div className="calendar-widget">
              <div className="calendar-header">
                <button className="btn-text" onClick={handlePrevMonth} style={{ padding: '4px' }}>
                  <ChevronLeft size={20} />
                </button>
                <span className="calendar-month-title">
                  {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                </span>
                <button className="btn-text" onClick={handleNextMonth} style={{ padding: '4px' }}>
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="calendar-grid">
                {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
                  <div key={d} className="calendar-weekday">{d}</div>
                ))}
                {renderCalendarDays()}
              </div>
            </div>

            {/* Slots Column */}
            <div className="slots-container">
              <h5 className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalIcon size={16} /> {selectedDate ? new Date(selectedDate).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Seleziona una data'}
              </h5>
              
              {loadingSlots ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', gap: '12px', color: 'var(--text-secondary)' }}>
                  <Loader2 size={36} className="animate-spin" color="#cfa832" />
                  <span>Caricamento orari...</span>
                </div>
              ) : selectedDate ? (
                availableSlots.length > 0 ? (
                  <div className="slots-grid">
                    {availableSlots.map(timeStr => (
                      <button
                        key={timeStr}
                        className={`slot-button ${selectedTime === timeStr ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(timeStr)}
                      >
                        {timeStr}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state" style={{ height: '200px', justifyContent: 'center' }}>
                    <span>Nessun orario disponibile per la data selezionata. Il salone potrebbe essere chiuso o al completo.</span>
                  </div>
                )
              ) : (
                <div className="empty-state" style={{ height: '200px', justifyContent: 'center' }}>
                  <span>Fai clic su un giorno nel calendario per visualizzare le ore libere.</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <button className="btn btn-outline" onClick={handleBackStep}>Indietro</button>
            <button className="btn btn-gold" disabled={!selectedDate || !selectedTime} onClick={handleNextStep}>Continua</button>
          </div>
        </div>
      )}

      {/* STEP 3: CUSTOMER DETAILS */}
      {step === 3 && (
        <div className="animate-fade">
          <h4 style={{ fontSize: '1.4rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
            3. Dati Personali
          </h4>

          <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="client-name">Nome e Cognome *</label>
              <input
                id="client-name"
                type="text"
                className="form-control"
                placeholder="Inserisci il tuo nome completo"
                required
                value={clientDetails.name}
                onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="client-phone">Numero di Telefono *</label>
              <input
                id="client-phone"
                type="tel"
                className="form-control"
                placeholder="Es. 3331234567"
                required
                value={clientDetails.phone}
                onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="client-email">Email (opzionale)</label>
              <input
                id="client-email"
                type="email"
                className="form-control"
                placeholder="iltuonome@esempio.com"
                value={clientDetails.email}
                onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="client-notes">Note speciali o richieste</label>
              <textarea
                id="client-notes"
                className="form-control"
                placeholder="Facci sapere se hai richieste particolari..."
                value={clientDetails.notes}
                onChange={(e) => setClientDetails({ ...clientDetails, notes: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <button type="button" className="btn btn-outline" onClick={handleBackStep}>Indietro</button>
              <button type="submit" className="btn btn-gold">Continua</button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 4: PAYMENT SIMULATION */}
      {step === 4 && (
        <div className="animate-fade">
          <h4 style={{ fontSize: '1.4rem', marginBottom: '20px', fontFamily: 'var(--font-display)' }}>
            4. Metodo di Pagamento
          </h4>

          <div className="payment-selector">
            <div 
              className={`payment-option ${paymentMethod === 'salon' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('salon')}
            >
              <span style={{ fontSize: '1.5rem' }}>💶</span>
              <span className="payment-option-title">Paga in Loco</span>
              <span className="payment-option-desc">Paga direttamente in salone a servizio ultimato (contanti o carta).</span>
            </div>

            <div 
              className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('online')}
            >
              <span style={{ fontSize: '1.5rem' }}>💳</span>
              <span className="payment-option-title">Paga Online</span>
              <span className="payment-option-desc">Completa il pagamento subito per velocizzare il check-out in salone.</span>
            </div>
          </div>

          {/* Simulated Credit Card Layout */}
          {paymentMethod === 'online' && (
            <div className="animate-fade" style={{ marginTop: '24px' }}>
              <div className="card-simulation-container">
                <div 
                  className={`credit-card ${isCardFlipped ? 'flipped' : ''}`}
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                >
                  {/* FRONT */}
                  <div className="card-front">
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <div className="card-chip"></div>
                      <div className="card-logo">{SALON_CONFIG.shortName} Pay</div>
                    </div>
                    <div className="card-number-display">
                      {cardDetails.number || '•••• •••• •••• ••••'}
                    </div>
                    <div className="card-details-row">
                      <div>
                        <div style={{ fontSize: '0.55rem', opacity: 0.6 }}>Titolare</div>
                        <div className="card-holder-name">{cardDetails.holder.toUpperCase() || 'NOME COGNOME'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.55rem', opacity: 0.6 }}>Scadenza</div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{cardDetails.expiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  {/* BACK */}
                  <div className="card-back">
                    <div className="card-magnetic-stripe"></div>
                    <div style={{ padding: '0 24px', color: '#fff', fontSize: '0.55rem', textAlign: 'right', marginTop: '10px' }}>CVV/CVC</div>
                    <div className="card-signature-area">
                      <div className="card-cvv-display">{cardDetails.cvv || '•••'}</div>
                    </div>
                    <div style={{ fontSize: '0.45rem', color: 'rgba(255,255,255,0.4)', padding: '0 24px', marginTop: 'auto', textAlign: 'center' }}>
                      Transazione cifrata fittizia per scopi dimostrativi.
                    </div>
                  </div>
                </div>
              </div>

              {/* Card input fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Numero Carta</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="4000 1234 5678 9010"
                    maxLength={19}
                    value={cardDetails.number}
                    onChange={handleCardNumberChange}
                    onFocus={() => setIsCardFlipped(false)}
                  />
                </div>
                
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label">Titolare Carta</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Inserisci nome del titolare"
                    value={cardDetails.holder}
                    onChange={(e) => setCardDetails({ ...cardDetails, holder: e.target.value })}
                    onFocus={() => setIsCardFlipped(false)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Scadenza</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={cardDetails.expiry}
                    onChange={handleExpiryChange}
                    onFocus={() => setIsCardFlipped(false)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CVV (Retro)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="123"
                    maxLength={3}
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                    onFocus={() => setIsCardFlipped(true)}
                    onBlur={() => setIsCardFlipped(false)}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <button className="btn btn-outline" onClick={handleBackStep} disabled={isPaying}>Indietro</button>
            <button className="btn btn-gold" onClick={handleBookingSubmit} disabled={isPaying}>
              {isPaying ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Elaborazione...
                </>
              ) : (
                paymentMethod === 'online' ? `Paga ${service.price.toFixed(2)} €` : 'Conferma Prenotazione'
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUCCESS & RECEIPT */}
      {step === 5 && confirmedBooking && (
        <div className="animate-fade" style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(46,196,182,0.15)', padding: '16px', borderRadius: '50%', marginBottom: '20px', animation: 'float 5s infinite' }}>
            <CheckCircle2 size={54} color="var(--success)" />
          </div>
          
          <h4 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
            Prenotazione Confermata!
          </h4>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Grazie per aver scelto {SALON_CONFIG.name}. Ti abbiamo inviato una notifica di riepilogo.
          </p>

          {/* Jagged Edge Ticket */}
          <div className="ticket-wrapper animate-fade">
            <div className="ticket-header">
              <div className="ticket-logo" style={{ color: 'var(--bg-primary)' }}>
                {SALON_CONFIG.name}
              </div>
              <div className="ticket-date">Ticket #{confirmedBooking.id.split('-')[1]}</div>
            </div>

            <div className="ticket-row">
              <span className="ticket-label">Cliente</span>
              <span className="ticket-value">{confirmedBooking.customerName}</span>
            </div>

            <div className="ticket-row">
              <span className="ticket-label">Telefono</span>
              <span className="ticket-value">{confirmedBooking.customerPhone}</span>
            </div>

            <div className="ticket-row">
              <span className="ticket-label">Servizio</span>
              <span className="ticket-value">{confirmedBooking.serviceName}</span>
            </div>

            <div className="ticket-row">
              <span className="ticket-label">Data</span>
              <span className="ticket-value">
                {new Date(confirmedBooking.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <div className="ticket-row">
              <span className="ticket-label">Orario</span>
              <span className="ticket-value highlight">{confirmedBooking.time}</span>
            </div>

            <div className="ticket-row">
              <span className="ticket-label">Durata</span>
              <span className="ticket-value">{confirmedBooking.duration} minuti</span>
            </div>

            <div className="ticket-row">
              <span className="ticket-label">Stato Pagamento</span>
              <span className="ticket-value" style={{ color: confirmedBooking.paymentStatus === 'paid' ? 'var(--success)' : '#d4af37' }}>
                {confirmedBooking.paymentStatus === 'paid' ? 'Pagato Online' : 'Paga in salone'}
              </span>
            </div>

            <div className="ticket-row total">
              <span className="ticket-label" style={{ color: 'var(--bg-primary)' }}>Importo</span>
              <span className="ticket-value" style={{ color: 'var(--accent-gold)' }}>{confirmedBooking.price.toFixed(2)} €</span>
            </div>

            <div className="ticket-qr">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="120" height="120">
                <rect width="100" height="100" fill="none"/>
                {/* Simulated QR blocks */}
                <rect x="10" y="10" width="25" height="25" fill="#111"/>
                <rect x="15" y="15" width="15" height="15" fill="#fff"/>
                <rect x="18" y="18" width="9" height="9" fill="#111"/>

                <rect x="65" y="10" width="25" height="25" fill="#111"/>
                <rect x="70" y="15" width="15" height="15" fill="#fff"/>
                <rect x="73" y="18" width="9" height="9" fill="#111"/>

                <rect x="10" y="65" width="25" height="25" fill="#111"/>
                <rect x="15" y="70" width="15" height="15" fill="#fff"/>
                <rect x="18" y="73" width="9" height="9" fill="#111"/>

                <rect x="45" y="20" width="10" height="10" fill="#111"/>
                <rect x="55" y="35" width="15" height="10" fill="#111"/>
                <rect x="40" y="50" width="10" height="20" fill="#111"/>
                <rect x="50" y="65" width="15" height="15" fill="#111"/>
                <rect x="70" y="50" width="20" height="10" fill="#111"/>
                <rect x="80" y="75" width="10" height="15" fill="#111"/>
              </svg>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px' }}>Mostra questo codice QR al tuo arrivo in salone.</p>
          </div>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => window.print()}>Stampa Ricevuta</button>
            <button className="btn btn-gold" onClick={resetWizard}>Nuova Prenotazione</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingWizard;
