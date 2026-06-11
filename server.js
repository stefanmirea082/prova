import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Path to JSON bookings database
const DATA_DIR = path.join(__dirname, 'server', 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');

// Ensure data directory and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial mockup data
const services = {
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

// Seed initial bookings if file is empty
const loadBookings = () => {
  try {
    if (!fs.existsSync(BOOKINGS_FILE)) {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const initialBookings = [
        {
          id: 'mock-1',
          customerName: 'Marco Rossi',
          customerPhone: '3331234567',
          customerEmail: 'marco.rossi@gmail.com',
          serviceId: 'taglio-skin-fade-shampoo-barba',
          serviceName: 'Taglio Skin Fade + Shampoo + Barba',
          category: 'uomo',
          price: 42,
          duration: 45,
          date: today,
          time: '10:00',
          paymentMethod: 'online',
          paymentStatus: 'paid',
          notes: 'Preferisce sfumatura molto corta ai lati.'
        },
        {
          id: 'mock-2',
          customerName: 'Elena Bianchi',
          customerPhone: '3479876543',
          customerEmail: 'elena.bianchi@yahoo.it',
          serviceId: 'laminazione-piega',
          serviceName: 'Laminazione + Piega',
          category: 'donna',
          price: 43,
          duration: 60,
          date: today,
          time: '11:30',
          paymentMethod: 'salon',
          paymentStatus: 'pending',
          notes: 'Prima volta in salone.'
        },
        {
          id: 'mock-3',
          customerName: 'Giuseppe Verdi',
          customerPhone: '3201122334',
          customerEmail: 'g.verdi@outlook.it',
          serviceId: 'taglio-shampoo-barba',
          serviceName: 'Taglio + Shampoo + Barba',
          category: 'uomo',
          price: 39,
          duration: 45,
          date: tomorrow,
          time: '15:00',
          paymentMethod: 'salon',
          paymentStatus: 'pending',
          notes: ''
        }
      ];
      fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(initialBookings, null, 2));
      return initialBookings;
    }
    const data = fs.readFileSync(BOOKINGS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading bookings, returning empty array:', err);
    return [];
  }
};

const saveBookings = (bookings) => {
  try {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));
  } catch (err) {
    console.error('Error saving bookings:', err);
  }
};

// API: Get all services
app.get('/api/services', (req, res) => {
  res.json(services);
});

// API: Get all bookings
app.get('/api/bookings', (req, res) => {
  const bookings = loadBookings();
  res.json(bookings);
});

// Helper: check if a date is closed (Sunday = 0, Monday = 1)
const isDayClosed = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDay(); // 0 = Sunday, 1 = Monday
  return day === 0 || day === 1;
};

// API: Get available slots for a specific date and service duration
app.get('/api/available-slots', (req, res) => {
  const { date, duration } = req.query;
  if (!date || !duration) {
    return res.status(400).json({ error: 'Data e durata sono parametri obbligatori.' });
  }

  if (isDayClosed(date)) {
    return res.json([]); // Closed on Sunday and Monday
  }

  const durationMin = parseInt(duration);
  const bookings = loadBookings().filter(b => b.date === date);

  // Business hours: 09:00 to 19:00
  const startHour = 9;
  const endHour = 19;
  const timeSlots = [];

  // Generate 30-minute intervals
  for (let hour = startHour; hour < endHour; hour++) {
    for (let min of [0, 30]) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      timeSlots.push(timeStr);
    }
  }

  // Filter slots where the booking duration can fit
  const availableSlots = timeSlots.filter(slot => {
    const [slotH, slotM] = slot.split(':').map(Number);
    const slotStartMin = slotH * 60 + slotM;
    const slotEndMin = slotStartMin + durationMin;

    // Must finish before or at closing time (19:00 = 1140 minutes)
    if (slotEndMin > 19 * 60) return false;

    // Check conflict with other bookings
    const hasConflict = bookings.some(b => {
      const [bh, bm] = b.time.split(':').map(Number);
      const bStartMin = bh * 60 + bm;
      const bEndMin = bStartMin + b.duration;

      // Overlap condition
      return (slotStartMin < bEndMin && slotEndMin > bStartMin);
    });

    return !hasConflict;
  });

  res.json(availableSlots);
});

// API: Create new booking
app.post('/api/bookings', (req, res) => {
  const {
    customerName,
    customerPhone,
    customerEmail,
    serviceId,
    serviceName,
    category,
    price,
    duration,
    date,
    time,
    paymentMethod,
    paymentStatus,
    notes
  } = req.body;

  if (!customerName || !customerPhone || !serviceId || !date || !time || !paymentMethod) {
    return res.status(400).json({ error: 'Campi obbligatori mancanti.' });
  }

  if (isDayClosed(date)) {
    return res.status(400).json({ error: 'Il salone è chiuso di domenica e lunedì.' });
  }

  const bookings = loadBookings();

  // Validate conflict again on backend to prevent double-booking
  const durationMin = parseInt(duration);
  const [slotH, slotM] = time.split(':').map(Number);
  const slotStartMin = slotH * 60 + slotM;
  const slotEndMin = slotStartMin + durationMin;

  const hasConflict = bookings.filter(b => b.date === date).some(b => {
    const [bh, bm] = b.time.split(':').map(Number);
    const bStartMin = bh * 60 + bm;
    const bEndMin = bStartMin + b.duration;
    return (slotStartMin < bEndMin && slotEndMin > bStartMin);
  });

  if (hasConflict) {
    return res.status(409).json({ error: 'La fascia oraria selezionata non è più disponibile.' });
  }

  const newBooking = {
    id: `book-${Date.now()}`,
    customerName,
    customerPhone,
    customerEmail: customerEmail || '',
    serviceId,
    serviceName,
    category,
    price: parseFloat(price),
    duration: parseInt(duration),
    date,
    time,
    paymentMethod,
    paymentStatus: paymentStatus || 'pending',
    notes: notes || ''
  };

  bookings.push(newBooking);
  saveBookings(bookings);

  res.status(201).json(newBooking);
});

// API: Cancel booking
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  let bookings = loadBookings();
  const exists = bookings.some(b => b.id === id);

  if (!exists) {
    return res.status(404).json({ error: 'Prenotazione non trovata.' });
  }

  bookings = bookings.filter(b => b.id !== id);
  saveBookings(bookings);
  res.json({ message: 'Prenotazione cancellata con successo.' });
});

// Serve frontend build static files in production
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
