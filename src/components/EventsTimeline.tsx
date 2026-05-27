import React, { useState } from 'react';
import { TournamentEvent } from '../types';
import { Calendar, MapPin, Award, Heart, Check, CreditCard, Gift, Loader, Ticket } from 'lucide-react';

interface EventsTimelineProps {
  events: TournamentEvent[];
  onRegisterForEvent: (eventId: string, playerName: string) => void;
  currentProfileName: string;
}

export interface IssuedTicket {
  eventId: string;
  eventName: string;
  player: string;
  date: string;
  time: string;
  location: string;
  ticketId: string;
}

export default function EventsTimeline({
  events,
  onRegisterForEvent,
  currentProfileName
}: EventsTimelineProps) {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [skillLevel, setSkillLevel] = useState('3.0 - Intermediate');
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTicket, setActiveTicket] = useState<IssuedTicket | null>(null);

  const handleOpenRegistration = (eventId: string) => {
    // If already registered, skip to ticket details
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    if (event.registeredPlayers.includes(currentProfileName)) {
      // Re-generate previously registered ticket
      setActiveTicket({
        eventId: event.id,
        eventName: event.title,
        player: currentProfileName,
        date: event.date,
        time: event.time,
        location: event.location,
        ticketId: `TKT-${event.id.toUpperCase().substring(3)}-${Math.floor(1000 + Math.random() * 9000)}`
      });
      return;
    }

    setSelectedEventId(eventId);
  };

  const handleConfirmRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId) return;

    const event = events.find(e => e.id === selectedEventId);
    if (!event) return;

    setIsRegistering(true);

    setTimeout(() => {
      onRegisterForEvent(selectedEventId, currentProfileName);
      setIsRegistering(false);
      setSelectedEventId(null);

      // Create issued ticket mockup
      setActiveTicket({
        eventId: event.id,
        eventName: event.title,
        player: currentProfileName,
        date: event.date,
        time: event.time,
        location: event.location,
        ticketId: `TKT-${event.id.toUpperCase().substring(3)}-${Math.floor(1000 + Math.random() * 9000)}`
      });
    }, 850); // Small realistic delay for UI flourish
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Dynamic Ticket Overlay if issued */}
      {activeTicket && (
        <div className="bg-white border-2 border-emerald-150 rounded-3xl p-6.5 shadow-md relative overflow-hidden flex flex-col items-center space-y-4 max-w-2xl mx-auto animate-in fade-in duration-300">
          {/* Confetti layout header */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400" />
          
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-sans font-black uppercase tracking-wider bg-emerald-550/10 px-4 py-2 rounded-full border border-emerald-200">
            <Ticket className="w-4 h-4 text-emerald-600" /> Entry Pass Issued Successfully!
          </div>

          {/* Ticket Layout Core */}
          <div className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl relative flex flex-col md:flex-row shadow-sm mt-3">
            
            {/* Main Pass Chunk */}
            <div className="flex-1 p-5 space-y-4 text-left">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">DUMAGUETE COMMUNITY EVENT</span>
                <h4 className="text-md font-black font-sans text-slate-900 tracking-tight leading-snug">{activeTicket.eventName}</h4>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-150 py-3 text-[11px] font-sans">
                <div>
                  <span className="block text-[8px] uppercase font-black text-slate-400 tracking-wider">ENTRANT</span>
                  <span className="font-extrabold text-slate-800">{activeTicket.player}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase font-black text-slate-400 tracking-wider">PASS NUMBER</span>
                  <span className="font-mono font-black text-emerald-700">{activeTicket.ticketId}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase font-black text-slate-400 tracking-wider">DATE</span>
                  <span className="font-extrabold text-slate-700">{activeTicket.date}</span>
                </div>
                <div>
                  <span className="block text-[8px] uppercase font-black text-slate-400 tracking-wider">TIME SLOT</span>
                  <span className="font-mono font-extrabold text-slate-650">{activeTicket.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{activeTicket.location}</span>
              </div>
            </div>

            {/* Split dashed borders representing perforated tear lines */}
            <div className="hidden md:flex flex-col items-center justify-between py-1 relative w-0">
              <div className="absolute top-0 -mt-2 w-4 h-4 rounded-full bg-slate-105 border-b border-slate-200" />
              <div className="h-full border-l-2 border-dashed border-slate-200" />
              <div className="absolute bottom-0 -mb-2 w-4 h-4 rounded-full bg-slate-105 border-t border-slate-200" />
            </div>

            {/* Stub / Barcode section */}
            <div className="md:w-44 p-5 bg-slate-100/40 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col items-center justify-center space-y-3">
              {/* Synthetic Barcode SVG/CSS */}
              <div className="bg-white p-2.5 rounded-xl flex items-center justify-center shadow-md transition-transform hover:scale-105 border border-slate-100">
                <svg className="w-20 h-20" viewBox="0 0 100 100">
                  {/* Outer border */}
                  <rect x="0" y="0" width="100" height="100" fill="none" stroke="#22c55e" strokeWidth="1" />
                  {/* Grid layout pretending to be a QR code */}
                  <rect x="5" y="5" width="25" height="25" fill="#065f46" />
                  <rect x="10" y="10" width="15" height="15" fill="#fff" />
                  <rect x="13" y="13" width="9" height="9" fill="#065f46" />
                  
                  <rect x="70" y="5" width="25" height="25" fill="#065f46" />
                  <rect x="75" y="10" width="15" height="15" fill="#fff" />
                  <rect x="78" y="13" width="9" height="9" fill="#065f46" />

                  <rect x="5" y="70" width="25" height="25" fill="#065f46" />
                  <rect x="10" y="75" width="15" height="15" fill="#fff" />
                  <rect x="13" y="78" width="9" height="9" fill="#065f46" />

                  {/* Random noise squares */}
                  <rect x="40" y="20" width="15" height="5" fill="#065f46" />
                  <rect x="45" y="45" width="10" height="10" fill="#065f46" />
                  <rect x="25" y="50" width="15" height="15" fill="#065f46" />
                  <rect x="70" y="50" width="10" height="5" fill="#065f46" />
                  <rect x="80" y="40" width="15" height="15" fill="#065f46" />
                  <rect x="50" y="70" width="25" height="15" fill="#065f46" />
                  <rect x="85" y="85" width="10" height="10" fill="#065f46" />
                </svg>
              </div>
              <span className="text-[8px] font-sans font-black text-slate-400 uppercase tracking-widest text-center mt-1">VERIFY AT COURT</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTicket(null)}
            className="text-xs text-emerald-700 font-extrabold border-b-2 border-emerald-200 hover:text-emerald-850 pb-0.5 pt-2 transition-all font-sans cursor-pointer uppercase tracking-wider"
          >
            Dismiss Entry Pass ×
          </button>
        </div>
      )}

      {/* Events List Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((ev) => {
          const isRegistered = ev.registeredPlayers.includes(currentProfileName);
          const pointsRequired = ev.fee > 0 ? `₱${ev.fee}` : 'Free Entry';
          const isFull = ev.spotsAvailable <= 0;

          return (
            <div
              key={ev.id}
              className={`bg-white border-2 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm ${
                isRegistered
                  ? 'border-emerald-400 bg-emerald-50/10'
                  : 'border-emerald-100 hover:border-emerald-250'
              }`}
            >
              <div className="p-6 space-y-4">
                {/* Event Type / Badge header */}
                <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full font-black tracking-wider uppercase ${
                    ev.type === 'Tournament'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : ev.type === 'Social Mixer'
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-205'
                  }`}>
                    {ev.type}
                  </span>
                  
                  <span className="text-slate-450 font-black tracking-wider uppercase flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {ev.date}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-black font-sans text-slate-900 tracking-tight leading-snug">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-550 leading-relaxed font-semibold mt-2">
                    {ev.description}
                  </p>
                </div>

                {/* Event attributes */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2 text-[11px] font-sans">
                  <div className="flex items-center justify-between text-slate-500 font-bold">
                    <span>Venue Location:</span>
                    <span className="font-extrabold text-slate-800 text-right max-w-[180px] truncate">📍 {ev.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 font-bold">
                    <span>Registration Cost:</span>
                    <span className="font-sans text-emerald-700 font-black">{pointsRequired}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 font-bold">
                    <span>RSVP Index:</span>
                    <span className="font-sans font-extrabold text-slate-700">
                      {ev.maxSpots - ev.spotsAvailable} / {ev.maxSpots} Players Registered
                    </span>
                  </div>
                </div>

                {/* Registered users tags */}
                <div className="space-y-1.5">
                  <div className="text-[9px] uppercase font-black tracking-widest text-slate-450">COMMUNITY SIGNUPS INDEX</div>
                  <div className="flex flex-wrap gap-1.5">
                    {ev.registeredPlayers.map((name, idx) => (
                      <span
                        key={`${ev.id}-reg-${idx}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-[10px] text-slate-600 font-bold border border-slate-150"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        <span>{name}</span>
                        {name === currentProfileName && (
                          <span className="text-[8px] font-black bg-emerald-205 text-emerald-950 px-1.5 py-0.5 rounded-full uppercase leading-none border border-emerald-300">You</span>
                        )}
                      </span>
                    ))}
                    {ev.registeredPlayers.length === 0 && (
                      <span className="text-[10px] text-slate-405 font-semibold italic">No signups yet. Secure your spot now!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card CTA Footer */}
              <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4">
                <span className="text-[10px] font-mono text-slate-450 font-bold uppercase tracking-wider">
                  ⚡ Scheduled: {ev.time}
                </span>

                {isRegistered ? (
                  <button
                    onClick={() => handleOpenRegistration(ev.id)}
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-200 hover:border-emerald-300 text-xs font-black rounded-xl transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4 shrink-0" />
                    <span>View Pass</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenRegistration(ev.id)}
                    disabled={isFull}
                    className={`px-5 py-2.5 text-xs font-black rounded-xl transition-all border-2 cursor-pointer ${
                      isFull
                        ? 'bg-slate-100 text-slate-400 border-slate-200 scale-95 cursor-not-allowed'
                        : 'bg-amber-400 hover:bg-amber-500 text-amber-955 border-amber-400 shadow-[0_3px_0_0_#d97706] active:translate-y-0.5 active:shadow-none'
                    }`}
                  >
                    {isFull ? 'Sold Out' : 'Register Slot'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Event RSVP Dialog */}
      {selectedEventId && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-emerald-100 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-slate-8050">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-sans">Submit Event RSVP</h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Secure your spot for Negros Oriental showdowns</p>
              </div>
              <button
                onClick={() => setSelectedEventId(null)}
                className="text-slate-450 hover:text-slate-6050 text-sm font-bold font-mono p-1 border border-transparent hover:border-slate-200 rounded cursor-pointer"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleConfirmRegistration} className="p-6 space-y-4">
              {/* Event title overview */}
              <div className="bg-emerald-50 border-2 border-emerald-100 p-4 rounded-2xl">
                <div className="text-[9px] font-black text-emerald-850 uppercase tracking-widest">Selected Event Details</div>
                <div className="font-sans font-black text-sm text-slate-900 mt-1">
                  {events.find(e => e.id === selectedEventId)?.title}
                </div>
                <div className="text-[10px] text-emerald-700 mt-1 font-bold">
                  Venue: {events.find(e => e.id === selectedEventId)?.location}
                </div>
              </div>

              {/* Name (Lock current profile) */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Entrant Registration Name</label>
                <input
                  type="text"
                  value={currentProfileName}
                  disabled
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-500 font-bold rounded-xl px-4 py-3 text-sm font-sans cursor-not-allowed opacity-75"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Contact Phone Number</label>
                <input
                  type="tel"
                  placeholder="e.g., +63 917 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none placeholder-slate-400 font-mono font-bold"
                  required
                />
              </div>

              {/* Skill Classification */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Your Skill Classification</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-sans font-bold"
                >
                  <option value="1.0-2.0 - Beginner">1.0 - 2.0 (True Novice)</option>
                  <option value="2.5 - Advanced Novice">2.5 (Advanced Novice)</option>
                  <option value="3.0 - Intermediate">3.0 (Solid Regular)</option>
                  <option value="3.5 - High Intermediate">3.5 (Competitive Groupie)</option>
                  <option value="4.0+ - Advanced">4.0+ (Local Veteran)</option>
                </select>
              </div>

              {/* Important notice */}
              <p className="text-[10px] text-slate-500 leading-relaxed font-sans font-medium italic bg-slate-50 p-3 rounded-2xl border border-slate-100">
                Notice: Registrations are logged instantly in your session. Present your generated Entry Pass stub (with confirmation barcode) to verify details upon arrival.
              </p>

              {/* Submit panel */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedEventId(null)}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-500 font-bold text-xs rounded-full transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="bg-amber-400 hover:bg-amber-500 text-amber-955 text-xs font-black rounded-full px-6 py-3 shadow-[0_4px_0_0_#d97706] active:translate-y-0.5 active:shadow-none transition-all font-sans flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  {isRegistering ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin text-amber-955" />
                      <span>Generating Entry...</span>
                    </>
                  ) : (
                    <span>Register Slot</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
