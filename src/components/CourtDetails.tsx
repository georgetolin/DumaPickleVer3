import React, { useState } from 'react';
import { Court, Booking } from '../types';
import { MapPin, Info, DollarSign, Calendar, Eye, Phone, Zap, Star, MessageSquare, Plus, CheckCircle, XCircle } from 'lucide-react';

interface CourtDetailsProps {
  court: Court;
  currentUserCheckIn: boolean;
  onToggleCheckIn: () => void;
  currentProfileName: string;
  onSubmitReview: (rating: number, comment: string) => void;
  userDistance?: number | null; // Computed distance from active location in km
  bookings: Booking[];
  onBookSlot: (courtId: string, courtName: string, date: string, timeSlot: string, notes?: string) => void;
  onOpenDedicatedPage?: (courtId: string) => void;
}

export default function CourtDetails({
  court,
  currentUserCheckIn,
  onToggleCheckIn,
  currentProfileName,
  onSubmitReview,
  userDistance,
  bookings = [],
  onBookSlot,
  onOpenDedicatedPage
}: CourtDetailsProps) {
  // Theme Color Configurations
  const theme = court.themeColor || 'emerald';
  const colorMap: Record<string, {
    primary: string;
    bgLight: string;
    border: string;
    badge: string;
    button: string;
    text: string;
    activeIndicator: string;
  }> = {
    emerald: {
      primary: 'emerald',
      bgLight: 'bg-emerald-50/50',
      border: 'border-emerald-150',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_4px_0_0_#047857]',
      text: 'text-emerald-750',
      activeIndicator: 'bg-emerald-500'
    },
    amber: {
      primary: 'amber',
      bgLight: 'bg-amber-50/50',
      border: 'border-amber-150',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      button: 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-[0_4px_0_0_#d97706]',
      text: 'text-amber-805',
      activeIndicator: 'bg-amber-500'
    },
    indigo: {
      primary: 'indigo',
      bgLight: 'bg-indigo-50/50',
      border: 'border-indigo-150',
      badge: 'bg-indigo-100 text-indigo-805 border-indigo-200',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_4px_0_0_#4f46e5]',
      text: 'text-indigo-750',
      activeIndicator: 'bg-indigo-500'
    },
    rose: {
      primary: 'rose',
      bgLight: 'bg-rose-50/50',
      border: 'border-rose-150',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-[0_4px_0_0_#be123c]',
      text: 'text-rose-750',
      activeIndicator: 'bg-rose-500'
    },
    slate: {
      primary: 'slate',
      bgLight: 'bg-slate-50/50',
      border: 'border-slate-150',
      badge: 'bg-slate-100 text-slate-800 border-slate-200',
      button: 'bg-slate-700 hover:bg-slate-800 text-white shadow-[0_4px_0_0_#334155]',
      text: 'text-slate-750',
      activeIndicator: 'bg-slate-500'
    },
    sky: {
      primary: 'sky',
      bgLight: 'bg-sky-50/50',
      border: 'border-sky-150',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      button: 'bg-sky-600 hover:bg-sky-700 text-white shadow-[0_4px_0_0_#0369a1]',
      text: 'text-sky-750',
      activeIndicator: 'bg-sky-500'
    },
    teal: {
      primary: 'teal',
      bgLight: 'bg-teal-50/50',
      border: 'border-teal-150',
      badge: 'bg-teal-100 text-teal-800 border-teal-200',
      button: 'bg-teal-600 hover:bg-teal-700 text-white shadow-[0_4px_0_0_#0f766e]',
      text: 'text-teal-750',
      activeIndicator: 'bg-teal-500'
    },
    orange: {
      primary: 'orange',
      bgLight: 'bg-orange-50/50',
      border: 'border-orange-150',
      badge: 'bg-orange-100 text-orange-850 border-orange-200',
      button: 'bg-orange-600 hover:bg-orange-700 text-white shadow-[0_4px_0_0_#c2410c]',
      text: 'text-orange-750',
      activeIndicator: 'bg-orange-500'
    }
  };

  const activeColor = colorMap[theme] || colorMap.emerald;

  // Calendar State
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [bookingSlotSuccess, setBookingSlotSuccess] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopyCoords = () => {
    try {
      navigator.clipboard.writeText(`${court.latitude}, ${court.longitude}`);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    } catch (e) {
      console.error("Clipboard copy failed: ", e);
    }
  };

  const getNext5Days = () => {
    const list = [];
    const daysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const formatted = `${yyyy}-${mm}-${dd}`;
      list.push({
        formatted,
        label: `${daysName[d.getDay()]} ${d.getDate()}`,
        isToday: i === 0
      });
    }
    return list;
  };

  const defaultSlots = [
    '07:00 AM - 08:30 AM',
    '08:30 AM - 10:00 AM',
    '10:00 AM - 11:30 AM',
    '02:00 PM - 03:30 PM',
    '03:30 PM - 05:00 PM',
    '05:00 PM - 06:30 PM',
    '06:30 PM - 08:00 PM',
    '08:00 PM - 09:30 PM'
  ];
  const timeSlots = court.customSlots && court.customSlots.length > 0 ? court.customSlots : defaultSlots;

  const isSlotBooked = (slot: string) => {
    return bookings.find(b => b.courtId === court.id && b.date === selectedDate && b.timeSlot === slot && b.status !== 'Cancelled');
  };

  const handleBookSlotAction = (slot: string) => {
    onBookSlot(court.id, court.name, selectedDate, slot, bookingNotes);
    setBookingSlotSuccess(`Successfully booked ${slot} on ${selectedDate}! This is synchronized live.`);
    setBookingNotes('');
    setTimeout(() => setBookingSlotSuccess(null), 5000);
  };

  // Star/Rating form state
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Roster list of checked-in players
  const playersRoster = [...court.checkedInPlayers];
  if (currentUserCheckIn && !playersRoster.includes(currentProfileName)) {
    playersRoster.push(currentProfileName);
  }

  // Calculate rating stats
  const reviewsCount = court.reviews?.length || 0;
  const averageRating = reviewsCount > 0
    ? (court.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(1)
    : 'N/A';

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFormError('Please write a quick comment regarding your session.');
      return;
    }
    setFormError('');
    setSubmittingReview(true);

    setTimeout(() => {
      onSubmitReview(rating, comment.trim());
      setSubmittingReview(false);
      setComment('');
      setRating(5);
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 4000);
    }, 600); // UI flourish delay
  };

  const getStars = (r: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${i < r ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`}
      />
    ));
  };

  return (
    <div className="bg-white border-2 border-emerald-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-6.5 text-slate-800">
      
      {/* Upper header section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
        <div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              court.type === 'Indoor' 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : court.type === 'Covered'
                ? 'bg-cyan-100 text-cyan-700 border border-cyan-205'
                : 'bg-amber-100 text-amber-850 border border-amber-205'
            }`}>
              {court.type} Court
            </span>

            {/* Gps Coordinates proximity badge */}
            {userDistance !== undefined && userDistance !== null && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                📍 {userDistance.toFixed(1)} km away
              </span>
            )}

            {/* Average rating indicator badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
              ⭐ {averageRating} {reviewsCount > 0 ? `(${reviewsCount})` : '(No Reviews)'}
            </span>
          </div>

          <h2 className="text-2xl font-sans font-black text-slate-900 tracking-tight mt-2.5">{court.name}</h2>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-bold">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{court.location}</span>
          </p>

          {onOpenDedicatedPage && (
            <button
              onClick={() => onOpenDedicatedPage(court.id)}
              className="mt-3.5 inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-black text-[10px] uppercase tracking-wider rounded-xl cursor-pointer transition select-none shadow-md shadow-indigo-500/15 active:scale-95 border-none"
              id={`open-dedicated-page-btn-${court.id}`}
            >
              <span>🌐 Open Dedicated Court Info & Customizer</span>
            </button>
          )}
        </div>

        {/* Live Active Board ticker */}
        <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl p-3.5 flex items-center gap-4 shrink-0 justify-between md:justify-start">
          <div className="text-left">
            <div className="text-[9px] font-black text-emerald-800/60 uppercase tracking-widest">LIVE ACTION</div>
            <div className={`text-sm font-extrabold mt-0.5 whitespace-nowrap ${playersRoster.length > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
              ● {playersRoster.length} Checked In
            </div>
          </div>
          <button
            onClick={onToggleCheckIn}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer ${
              currentUserCheckIn
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-2 border-rose-205'
                : 'bg-amber-400 hover:bg-amber-500 text-amber-950 shadow-[0_4px_0_0_#d97706] active:translate-y-1 active:shadow-none'
            }`}
            id={`checkin-btn-${court.id}`}
          >
            {currentUserCheckIn ? '✅ Leave Court' : '👋 Check In Here'}
          </button>
        </div>
      </div>

      {/* Court Image Gallery section */}
      {court.images && court.images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-1.5 pb-2">
          {court.images.map((imgUrl, idx) => (
            <div key={idx} className="relative group overflow-hidden rounded-2xl h-40 border-2 border-slate-100 bg-slate-50">
              <img
                src={imgUrl}
                alt={`${court.name} snapshot ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors duration-250" />
              <span className="absolute bottom-2 left-2 bg-slate-950/70 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold text-white rounded-full">
                📸 View #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Description block */}
      <p className="text-sm text-slate-650 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100 leading-relaxed font-sans font-medium">
        {court.description}
      </p>

      {/* Grid containing spec metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4">
          <div className="text-[10px] font-black text-slate-405 uppercase tracking-wider">COURTS COUNT</div>
          <div className="text-xs font-black text-slate-900 mt-1 uppercase tracking-wide">
            {court.courtCount} Standard Net{court.courtCount > 1 ? 's' : ''}
          </div>
        </div>
        <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4">
          <div className="text-[10px] font-black text-slate-405 uppercase tracking-wider">PLAYING SURFACE</div>
          <div className="text-xs font-black text-slate-900 mt-1 uppercase tracking-wide">
            {court.surface}
          </div>
        </div>
        <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4">
          <div className="text-[10px] font-black text-slate-405 uppercase tracking-wider">LIGHTING SYSTEM</div>
          <div className="text-xs font-black text-slate-900 mt-1 uppercase tracking-wide flex items-center gap-1.5">
            {court.lights ? (
              <>
                <Zap className="w-4 h-4 text-emerald-600 shrink-0 fill-emerald-100" />
                <span className="text-emerald-700 font-extrabold">Night LED Rails</span>
              </>
            ) : (
              <span className="text-slate-400 font-extrabold">Daytime only</span>
            )}
          </div>
        </div>
        <div className="bg-slate-50 border-2 border-slate-100 rounded-2xl p-4">
          <div className="text-[10px] font-black text-slate-405 uppercase tracking-wider">FEE / COST</div>
          <div className="text-xs font-black text-emerald-700 mt-1 uppercase tracking-wide">
            {court.rentalFee === 0 ? 'Free Entry' : `₱${court.rentalFee} / ${court.feeUnit}`}
          </div>
        </div>
      </div>

      {/* Amenities indicator section */}
      <div className="bg-slate-50/50 border border-slate-150 p-4 rounded-2xl space-y-3">
        <div className="text-[10px] font-black text-slate-450 uppercase tracking-widest">COURT INFRASTRUCTURE DETAILS</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-150 shadow-xs">
            {court.lights ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-350 shrink-0" />
            )}
            <div>
              <div className="font-extrabold text-slate-800">Evening Play Lights</div>
              <div className="text-[9px] text-slate-400 font-bold tracking-tight uppercase">
                {court.lights ? 'OPERATING FLOODLIGHTS' : 'CLOSED AFTER SUNSET'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-150 shadow-xs">
            {court.restrooms ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-350 shrink-0" />
            )}
            <div>
              <div className="font-extrabold text-slate-800">Public Restrooms</div>
              <div className="text-[9px] text-slate-400 font-bold tracking-tight uppercase">
                {court.restrooms ? 'TOILETS ON-SITE' : 'NO DIRECT RESTROOMS'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-150 shadow-xs">
            {court.accessibility ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-slate-350 shrink-0" />
            )}
            <div>
              <div className="font-extrabold text-slate-800">Accessibility Access</div>
              <div className="text-[9px] text-slate-400 font-bold tracking-tight uppercase">
                {court.accessibility ? 'RAMPS & STEP-FREE' : 'LIMITED ACCESS STEPS'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 📅 DEDICATED RESERVATION & TIMESLOT BOOKING TABLE */}
      <div className={`border-t-2 ${activeColor.border} pt-6.5 space-y-5 text-left`}>
        <div>
          <h3 className={`text-sm font-black uppercase tracking-wider flex items-center gap-1.5 ${activeColor.text}`}>
            <Calendar className="w-5 h-5 text-emerald-600" />
            Live Arena Court Bookings & Calendar
          </h3>
          <p className="text-[11px] text-slate-400 font-semibold leading-normal mt-1">
            Pick an upcoming play date below to view court availability. Book slots instantly to secure your reserved time.
          </p>
        </div>

        {/* Date bubble options */}
        <div className="flex flex-wrap gap-2">
          {getNext5Days().map((day) => {
            const isSel = day.formatted === selectedDate;
            return (
              <button
                key={day.formatted}
                onClick={() => {
                  setSelectedDate(day.formatted);
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  isSel
                    ? `${activeColor.button} scale-[1.03]`
                    : 'bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 text-slate-600'
                }`}
              >
                {day.label} {day.isToday && <span className="text-[9px] bg-slate-950/20 text-white px-1.5 py-0.5 rounded ml-1 font-extrabold uppercase animate-pulse">Live</span>}
              </button>
            );
          })}
        </div>

        {/* Notes input prior to booking */}
        <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Reservation Note / Message (Optional)</span>
            <input
              type="text"
              placeholder="e.g. 4.0 Singles practice match vs Yoshi, or family group social play..."
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-400"
            />
          </div>
        </div>

        {/* Timeslot matrix visual table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {timeSlots.map((slot) => {
            const booking = isSlotBooked(slot);
            return (
              <div
                key={slot}
                className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 text-left transition-all ${
                  booking
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1">
                    <span>🕒</span> {slot}
                  </div>
                  {booking ? (
                    <div className="mt-1.5 block">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded">
                        ⌛ Reserved
                      </span>
                      <p className="text-[11px] text-slate-500 font-bold mt-1.5">
                        Booked: <strong className="text-slate-800">{booking.playerName}</strong>
                      </p>
                      {booking.notes && (
                        <p className="text-[10px] text-slate-400 italic mt-0.5 font-medium">"{booking.notes}"</p>
                      )}
                    </div>
                  ) : (
                    <div className="mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-150">
                        ● Available
                      </span>
                    </div>
                  )}
                </div>

                {!booking && (
                  <button
                    onClick={() => handleBookSlotAction(slot)}
                    className={`mt-2 w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-sans font-extrabold tracking-wider text-[10px] uppercase rounded-xl transition cursor-pointer text-center`}
                  >
                    ⚡ Secure Slot
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {bookingSlotSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs rounded-2xl animate-pulse flex items-center gap-2">
            <span>✔</span> {bookingSlotSuccess}
          </div>
        )}
      </div>

      {/* Checked-in player roster lists */}
      <div className="border-t border-slate-150 pt-5 space-y-3">
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 text-left">
          <Eye className="w-4.5 h-4.5 text-emerald-600" />
          Players on ground right now
        </h3>

        {playersRoster.length === 0 ? (
          <div className="text-xs text-slate-400 font-medium py-3 bg-slate-5 per rounded-2xl px-5 border border-slate-200 text-left">
            No active check-ins. If you are playing here or heading over, tap check-in to rally others!
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {playersRoster.map((player, idx) => (
              <span
                key={`${court.id}-player-${player}-${idx}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 border-2 border-emerald-100 text-xs text-emerald-800 font-bold shadow-sm"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{player}</span>
                {customerIsYou(player) && (
                  <span className="text-[9px] font-black bg-emerald-250 text-emerald-950 border border-emerald-350 px-2 py-0.5 rounded-full uppercase leading-none">You</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* REVIEWS & RATINGS BOARD (1-5 STARS AND COMMENTS) */}
      <div className="border-t border-slate-150 pt-6.5 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 text-left">
            <MessageSquare className="w-4.5 h-4.5 text-emerald-600" />
            Arena Reviews & Player Feedback
          </h3>
          <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            ★ {averageRating} / 5.0 Rating
          </span>
        </div>

        {/* Display previous reviews */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {court.reviews && court.reviews.length > 0 ? (
            court.reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-left hover:border-emerald-200 transition-all shadow-3xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-800">{rev.userName}</span>
                    <span className="flex items-center gap-0.5 ml-2">
                      {getStars(rev.rating)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider">{rev.createdAt}</span>
                </div>
                <p className="text-xs text-slate-650 leading-relaxed font-medium">
                  "{rev.comment}"
                </p>
              </div>
            ))
          ) : (
            <div className="text-xs text-slate-400 font-medium py-6 px-4 bg-slate-50 rounded-2xl border border-slate-200 italic text-center leading-relaxed">
              No written reviews recorded for this venue yet. Be the first to share your experience check-in!
            </div>
          )}
        </div>

        {/* SUBMIT NEW STAR REVIEW FORM */}
        <div className="bg-slate-50 border-2 border-slate-200 p-5.5 rounded-3xl space-y-4">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 text-left">
            <Plus className="w-4 h-4 text-emerald-600" /> Write a Court Review
          </h4>

          <form onSubmit={handleCreateReview} className="space-y-4">
            
            {/* Interactive Stars select */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 text-left">Your Star Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={`form-star-${starVal}`}
                    type="button"
                    onClick={() => { setRating(starVal); setFormError(''); }}
                    className="p-1 hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        starVal <= rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 hover:text-amber-200'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-[11px] font-bold text-slate-500 ml-2 font-mono uppercase">
                  {rating === 5 ? '🏆 Amazing Space!' : rating === 4 ? '👍 Very Good!' : rating === 3 ? '👌 Average Play' : rating === 2 ? '⚠️ Needs Work' : '👎 Disappointing'}
                </span>
              </div>
            </div>

            {/* Comment Body */}
            <div>
              <label className="block text-[10px] font-black text-slate-405 uppercase tracking-widest mb-1.5 text-left">Written Evaluation</label>
              <textarea
                rows={3}
                placeholder="e.g., The court texture is superb, lighting for evening matches is crisp. Nice restrooms as well."
                value={comment}
                onChange={(e) => { setComment(e.target.value); setFormError(''); }}
                className="w-full bg-white border-2 border-slate-200 text-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-xs outline-none placeholder-slate-400 font-sans resize-none transition"
              />
            </div>

            {/* Status alerts */}
            {formError && (
              <div className="text-[10px] font-bold text-rose-600 text-left bg-rose-50 border border-rose-200 p-2 rounded-xl animate-pulse">
                ⚠ {formError}
              </div>
            )}

            {submittedSuccess && (
              <div className="text-[10px] font-bold text-emerald-800 text-left bg-emerald-50 border border-emerald-250 p-2 rounded-xl">
                ✔ Review submitted successfully! Thank you for supporting Negros Oriental rankings.
              </div>
            )}

            {/* Submit button */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-slate-400 font-bold tracking-tight">Posting publicly as: <strong className="text-slate-600">{currentProfileName}</strong></span>
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-full px-5 py-2.5 shadow-[0_3px_0_0_#047857] active:translate-y-0.5 active:shadow-none transition-all font-sans cursor-pointer uppercase tracking-wider"
              >
                {submittingReview ? 'Publishing...' : 'Submit Evaluation'}
              </button>
            </div>

          </form>
        </div>
      </div>

      {/* Contact & directions quick reference */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href={`tel:${court.contact}`}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-emerald-50/20 border-2 border-emerald-200 text-slate-700 text-xs font-black rounded-2xl transition-all"
        >
          <Phone className="w-4 h-4 text-emerald-600" />
          <span>Contact Operator ({court.contact})</span>
        </a>
        <button
          onClick={handleCopyCoords}
          className="flex-shrink-0 flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600 text-xs font-black rounded-2xl transition-all cursor-pointer"
        >
          <Info className="w-4 h-4 text-slate-400" />
          <span>{copyFeedback ? '✓ Copied!' : 'Copy Coords'}</span>
        </button>
      </div>
    </div>
  );
}

// Simple helper checking
function customerIsYou(name: string) {
  const normalized = name.toLowerCase();
  return normalized === 'you' || normalized.includes('george') || normalized.includes('george t.');
}
