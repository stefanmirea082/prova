import React, { useState, useEffect } from 'react';
import { Calendar as CalIcon, Clock, Phone, Mail, Trash2, Euro, ChevronLeft, ChevronRight, RefreshCw, MessageSquare } from 'lucide-react';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  
  const fetchBookings = () => {
    setLoading(true);
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = (id, customerName) => {
    if (window.confirm(`Sei sicuro di voler cancellare la prenotazione di ${customerName}?`)) {
      fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        fetchBookings();
      })
      .catch(err => {
        console.error(err);
        alert('Impossibile cancellare la prenotazione.');
      });
    }
  };

  // Filter bookings for the selected date
  const dailyBookings = bookings
    .filter(b => b.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Compute daily stats
  const totalRevenue = dailyBookings.reduce((sum, b) => sum + b.price, 0);
  const totalBookingsCount = dailyBookings.length;
  const paidBookingsCount = dailyBookings.filter(b => b.paymentStatus === 'paid').length;

  // Monthly Calendar math
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDayIndex = getFirstDayOfMonth(currentMonth);
    const dayElements = [];

    // Empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      dayElements.push(<div key={`empty-${i}`} className="calendar-day disabled"></div>);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const year = currentMonth.getFullYear();
      const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
      const dayStr = day.toString().padStart(2, '0');
      const dateString = `${year}-${month}-${dayStr}`;
      
      const isSelected = selectedDate === dateString;
      const countForDay = bookings.filter(b => b.date === dateString).length;

      dayElements.push(
        <button
          key={`day-${day}`}
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => setSelectedDate(dateString)}
          style={{ position: 'relative' }}
        >
          {day}
          {countForDay > 0 && (
            <span style={{
              position: 'absolute',
              bottom: '4px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: isSelected ? 'var(--bg-primary)' : 'var(--accent-gold)'
            }}></span>
          )}
        </button>
      );
    }

    return dayElements;
  };

  return (
    <div className="admin-layout">
      {/* Sidebar: Calendar and stats */}
      <div className="admin-sidebar">
        
        {/* Calendar Selection Card */}
        <div className="glass-card">
          <div className="calendar-widget">
            <div className="calendar-header">
              <button className="btn-text" onClick={handlePrevMonth} style={{ padding: '4px' }}>
                <ChevronLeft size={18} />
              </button>
              <span className="calendar-month-title" style={{ fontSize: '1.1rem' }}>
                {currentMonth.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
              </span>
              <button className="btn-text" onClick={handleNextMonth} style={{ padding: '4px' }}>
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="calendar-grid">
              {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, idx) => (
                <div key={idx} className="calendar-weekday" style={{ padding: '4px 0' }}>{d}</div>
              ))}
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Statistics Widgets */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-label">Ricavi Totali</span>
            <div className="admin-stat-value">{totalRevenue.toFixed(2)} €</div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Prenotazioni</span>
            <div className="admin-stat-value">{totalBookingsCount}</div>
          </div>
          <div className="admin-stat-card" style={{ gridColumn: 'span 2' }}>
            <span className="admin-stat-label">Pagati Online</span>
            <div className="admin-stat-value" style={{ color: 'var(--success)' }}>
              {paidBookingsCount} su {totalBookingsCount}
            </div>
          </div>
        </div>

        <button className="btn btn-outline" onClick={fetchBookings} disabled={loading} style={{ width: '100%' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Ricarica Dati
        </button>
      </div>

      {/* Main Panel: Booking list emphasizing TIME and CUSTOMER NAME */}
      <div className="admin-bookings-panel">
        <div className="admin-panel-header">
          <h3 className="admin-selected-date">
            {new Date(selectedDate).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {dailyBookings.length} prenotazioni per questa giornata
          </span>
        </div>

        {dailyBookings.length > 0 ? (
          <div className="booking-list-container">
            {dailyBookings.map((booking) => (
              <div key={booking.id} className="admin-booking-card">
                
                {/* 1. EMBEDDED TIME EXTREMELY EMPHASIZED */}
                <div className="booking-time-highlight">
                  <span>{booking.time}</span>
                  <span className="booking-time-duration">
                    <Clock size={10} style={{ marginRight: '2px', verticalAlign: 'middle' }} /> {booking.duration}'
                  </span>
                </div>

                {/* 2. CUSTOMER NAME EXTREMELY EMPHASIZED & DATA */}
                <div>
                  <h4 className="booking-name-highlight">{booking.customerName}</h4>
                  
                  <div className="booking-details-sub">
                    <div className="booking-detail-item" style={{ color: '#fff', fontWeight: 600 }}>
                      <span style={{ color: 'var(--accent-gold)' }}>Servizio:</span> {booking.serviceName}
                    </div>
                    
                    <div className="booking-detail-item">
                      <Phone size={13} color="var(--accent-gold)" /> 
                      <a href={`tel:${booking.customerPhone}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {booking.customerPhone}
                      </a>
                    </div>

                    {booking.customerEmail && (
                      <div className="booking-detail-item">
                        <Mail size={13} color="var(--accent-gold)" />
                        <a href={`mailto:${booking.customerEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {booking.customerEmail}
                        </a>
                      </div>
                    )}

                    <div className="booking-detail-item" style={{ fontWeight: 600 }}>
                      <Euro size={13} color="var(--accent-gold)" /> {booking.price.toFixed(2)} €
                    </div>
                  </div>

                  {booking.notes && (
                    <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '6px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '6px 12px', borderRadius: '4px' }}>
                      <MessageSquare size={12} color="var(--accent-gold)" />
                      <span><strong>Note:</strong> {booking.notes}</span>
                    </div>
                  )}
                </div>

                {/* 3. PAYMENT STATUS & ACTIONS */}
                <div className="booking-actions">
                  <span className={`booking-badge ${booking.paymentStatus === 'paid' ? 'booking-badge-paid' : 'booking-badge-pending'}`}>
                    {booking.paymentStatus === 'paid' ? 'Pagato Online' : 'In Loco'}
                  </span>
                  
                  <button 
                    className="btn-delete-icon"
                    onClick={() => handleDelete(booking.id, booking.customerName)}
                    title="Cancella Prenotazione"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <CalIcon size={48} color="var(--text-muted)" />
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Nessuna Prenotazione
            </h4>
            <p style={{ maxWidth: '300px', fontSize: '0.85rem' }}>
              Non ci sono appuntamenti registrati per questa data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
