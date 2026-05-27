import React, { useState } from 'react';
import { Coach, Court } from '../types';
import { BookOpen, Calendar, HelpCircle, Loader, MessageCircle, Star, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

interface GuidesAndCoachesProps {
  coaches: Coach[];
  courts: Court[];
}

export default function GuidesAndCoaches({
  coaches,
  courts
}: GuidesAndCoachesProps) {
  const [activeTab, setActiveTab] = useState<'coaches' | 'rules'>('coaches');
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
  const [bookingCourtId, setBookingCourtId] = useState(courts[0]?.id || '');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoach) return;

    setIsSubmittingBooking(true);

    setTimeout(() => {
      setIsSubmittingBooking(false);
      setBookingSuccessMsg(`Your training request has been securely routed to ${selectedCoach.name}! They will contact you shortly to coordinate!`);
      
      // Clear message inputs
      setBookingMessage('');
      setBookingDate('');
    }, 1000); // Small professional delay for visual flourish
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Tab Selectors */}
      <div className="flex border-b border-slate-150">
        <button
          onClick={() => {
            setActiveTab('coaches');
            setBookingSuccessMsg('');
            setSelectedCoach(null);
          }}
          className={`px-6 py-3.5 text-xs uppercase tracking-wider font-extrabold border-b-4 transition-all cursor-pointer ${
            activeTab === 'coaches'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/20'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🎓 Certified Coaches ({coaches.length})
        </button>
        <button
          onClick={() => {
            setActiveTab('rules');
            setBookingSuccessMsg('');
            setSelectedCoach(null);
          }}
          className={`px-6 py-3.5 text-xs uppercase tracking-wider font-extrabold border-b-4 transition-all cursor-pointer ${
            activeTab === 'rules'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/20'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          🏸 Rules Handbook (101)
        </button>
      </div>

      {activeTab === 'coaches' ? (
        <div className="space-y-6">
          {/* Booking Request Banner if complete */}
          {bookingSuccessMsg && (
            <div className="bg-emerald-50 border-2 border-emerald-100 p-5.5 rounded-3xl flex flex-col md:flex-row items-center gap-4 text-xs animate-in slide-in-from-top duration-300 shadow-sm text-slate-800">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-7050 shrink-0 border border-emerald-300">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-1 text-left">
                <span className="text-[9px] uppercase tracking-widest font-black text-emerald-800">BOOKING COMMITTED</span>
                <p className="text-slate-650 leading-relaxed font-sans font-extrabold">{bookingSuccessMsg}</p>
              </div>
              <button
                onClick={() => setBookingSuccessMsg('')}
                className="md:ml-auto text-[10px] font-sans font-black text-slate-600 hover:text-slate-800 uppercase bg-white px-4 py-2 rounded-xl border border-slate-200 cursor-pointer shadow-sm"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Coaches dynamic lists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coaches.map((coach) => (
              <div
                key={coach.id}
                className="bg-white border-2 border-emerald-100 rounded-3xl p-6.5 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-sm"
              >
                <div className="space-y-4 text-left">
                  {/* Portrait Details */}
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl ${coach.avatarColor} flex items-center justify-center font-sans text-white font-black text-base uppercase shadow-sm`}>
                      {coach.name.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 font-sans tracking-tight text-base leading-tight">{coach.name}</h3>
                      <p className="text-[9px] text-emerald-700 font-black uppercase tracking-wider mt-1">{coach.certification}</p>
                    </div>
                  </div>

                  {/* Pricing and Location info row */}
                  <div className="grid grid-cols-2 gap-3 text-center border-t border-b border-slate-100 py-3 bg-slate-50 rounded-xl font-sans text-[11px] font-bold">
                    <div>
                      <span className="block text-[8px] font-black uppercase tracking-wider text-slate-450">HOURLY RATE</span>
                      <span className="font-extrabold text-slate-800 mt-1 inline-block">{coach.rate}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-black uppercase tracking-wider text-slate-455">AVAILABILITY</span>
                      <span className="font-sans font-bold text-slate-650 block truncate mt-1" title={coach.availability}>
                        {coach.availability}
                      </span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="space-y-1 text-xs font-sans">
                    <span className="text-[9px] font-black text-slate-450 uppercase tracking-widest block">Primary Specialty</span>
                    <p className="text-slate-600 leading-relaxed font-semibold">{coach.specialty}</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBookingSuccessMsg('');
                    setSelectedCoach(coach);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-500 text-amber-955 text-xs font-black rounded-full shadow-[0_3px_0_0_#d97706] active:translate-y-0.5 active:shadow-none transition duration-150 font-sans cursor-pointer uppercase tracking-wider"
                >
                  <Calendar className="w-4 h-4 text-amber-955" />
                  <span>Request Training</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Rules Handbook Tab content */
        <div className="bg-white border-2 border-emerald-100 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 max-w-4xl mx-auto text-slate-850">
          <div className="flex items-center gap-2 border-b-2 border-emerald-100 pb-4 text-left">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wide font-sans">Dumaguete Pickleball 101 Rules Cheatsheet</h3>
          </div>

          <div className="space-y-5 text-xs text-left">
            {/* The Kitchen rule */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100/70">
              <div className="md:col-span-1 space-y-1 bg-white p-4.5 border border-slate-100 rounded-2xl shadow-sm">
                <span className="px-2.5 py-1 bg-rose-100 border border-rose-250 rounded-full text-[8px] tracking-wider font-sans text-rose-700 uppercase font-black">CRITICAL RULE</span>
                <h4 className="font-black text-slate-900 text-sm mt-2.5 font-sans">The Kitchen Rule (NVZ)</h4>
              </div>
              <div className="md:col-span-2 text-slate-600 leading-relaxed space-y-2 font-sans font-semibold text-xs py-1">
                <p>
                  The <strong className="text-slate-900">Kitchen</strong> is the 7-foot non-volley line area bounding both sides of the net.
                </p>
                <p>
                  You are <strong className="text-slate-900">strictly forbidden</strong> from hitting the ball out of the air (volley) while having *any part of your body* touching inside the kitchen lines or on the line itself. A player must let the ball <strong className="text-emerald-700">bounce first</strong> if they want to play a ball while stepping inside the Kitchen boundary.
                </p>
              </div>
            </div>

            {/* Two-Bounce Rule */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100/70">
              <div className="md:col-span-1 space-y-1 bg-white p-4.5 border border-slate-100 rounded-2xl shadow-sm">
                <span className="px-2.5 py-1 bg-emerald-100 border border-emerald-250 rounded-full text-[8px] tracking-wider font-sans text-emerald-800 uppercase font-black">GAMEPLAY FLOW</span>
                <h4 className="font-black text-slate-900 text-sm mt-2.5 font-sans">Two-Bounce Rule</h4>
              </div>
              <div className="md:col-span-2 text-slate-600 leading-relaxed space-y-2 font-sans font-semibold text-xs py-1">
                <p>
                  This governs early rallying options for both sides.
                </p>
                <p>
                  The receiving team must let the server's ball <strong className="text-slate-900 font-extrabold">bounce</strong> before returning it. Similarly, the serving team must let the returned shot <strong className="text-slate-900 font-extrabold">bounce</strong> once on their side before playing it. Once these two bounces have been fulfilled (one bounce on each side), players can volley balls out of the air or hit them on the bounce!
                </p>
              </div>
            </div>

            {/* How to Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100/70">
              <div className="md:col-span-1 space-y-1 bg-white p-4.5 border border-slate-100 rounded-2xl shadow-sm">
                <span className="px-2.5 py-1 bg-sky-100 border border-sky-250 rounded-full text-[8px] tracking-wider font-sans text-sky-850 uppercase font-black">COUNTING LOGIC</span>
                <h4 className="font-black text-slate-900 text-sm mt-2.5 font-sans">Calling the Score</h4>
              </div>
              <div className="md:col-span-2 text-slate-600 leading-relaxed space-y-2 font-sans font-semibold text-xs py-1">
                <p>
                  In doubles, you call the scoring with three separate integers: e.g., <strong className="text-slate-950 font-black">"Server Score - Receiver Score - Server Number (1 or 2)"</strong>.
                </p>
                <p>
                  Remember, points can <strong className="text-emerald-700 font-extrabold">only</strong> be earned by the serving team. If you win a rally as receivers, you do not score a point, but you rotate who serves or obtain a side-out!
                </p>
              </div>
            </div>
            
            {/* Paddle rules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-slate-50 p-5 rounded-2xl border-2 border-slate-100/70">
              <div className="md:col-span-1 space-y-1 bg-white p-4.5 border border-slate-100 rounded-2xl shadow-sm">
                <span className="px-2.5 py-1 bg-purple-100 border border-purple-250 rounded-full text-[8px] tracking-wider font-sans text-purple-800 uppercase font-black">ETIQUETTE</span>
                <h4 className="font-black text-slate-900 text-sm mt-2.5 font-sans">Boulevard Paddle Stack</h4>
              </div>
              <div className="md:col-span-2 text-slate-600 leading-relaxed space-y-2 font-sans font-semibold text-xs py-1">
                <p>
                  If any part of the ball touches any part of the boundary line on court, it is considered <strong className="text-emerald-700 font-extrabold">in</strong>.
                </p>
                <p>
                  At public courts like <strong className="text-slate-900">Rizal Boulevard</strong>, paddle stacking guides rotation: when games conclude, the waiting players tap paddles and step up. Standard etiquette is to play to 11 points (must win by 2!).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Coach Request Popup */}
      {selectedCoach && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white border-2 border-emerald-100 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-slate-8050">
            <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-sans">Schedule Training Client</h3>
                <p className="text-xs text-slate-550 mt-1 font-semibold">Contact certified mentor {selectedCoach.name}</p>
              </div>
              <button
                onClick={() => setSelectedCoach(null)}
                className="text-slate-400 hover:text-slate-650 text-sm font-bold font-mono p-1 border border-transparent hover:border-slate-200 rounded cursor-pointer"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
              <div className="bg-emerald-50 border-2 border-emerald-100 p-4 rounded-xl text-xs flex justify-between items-center text-left">
                <div>
                  <div className="text-[9px] font-black text-emerald-850 uppercase tracking-widest">COACH RATE</div>
                  <div className="font-sans font-black text-emerald-800 text-sm mt-1">{selectedCoach.rate}</div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-black text-emerald-850 uppercase tracking-widest">SCOPE</div>
                  <div className="text-amber-800 font-black mt-1 uppercase tracking-wider">1 Hr Private Lesson</div>
                </div>
              </div>

              {/* Preferred Venue Venue */}
              <div>
                <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-1.5">Select Arena Venue</label>
                <select
                  value={bookingCourtId}
                  onChange={(e) => setBookingCourtId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-sans font-bold"
                >
                  {courts.map((court) => (
                    <option key={`co-court-${court.id}`} value={court.id}>{court.name}</option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-1.5">Target Date & Time</label>
                <input
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-205 text-slate-755 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-mono font-bold"
                  required
                />
              </div>

              {/* Message introduction */}
              <div>
                <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-1.5">Message Note (Focus Drills)</label>
                <textarea
                  rows={3}
                  placeholder="e.g., I want to focus on third-shot drops and kitchen footwork. DUPR is 3.10."
                  value={bookingMessage}
                  onChange={(e) => setBookingMessage(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none placeholder-slate-400 font-sans resize-none transition"
                />
              </div>

              <p className="text-[10px] text-slate-500 font-sans font-medium italic leading-relaxed text-left bg-slate-50 p-3 rounded-xl border border-slate-100">
                Notice: Coach {selectedCoach.name} responds typically within 12 hours via text or call to verify details and reserve nets.
              </p>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedCoach(null)}
                  className="px-5 py-2.5 bg-white hover:bg-slate-5 border-2 border-slate-200 text-slate-500 font-bold text-xs rounded-full transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingBooking}
                  className="bg-amber-400 hover:bg-amber-500 text-amber-955 text-xs font-black rounded-full px-6 py-3 shadow-[0_4px_0_0_#d97706] active:translate-y-0.5 active:shadow-none transition-all font-sans flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  {isSubmittingBooking ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin text-amber-955" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    <span>Submit Request</span>
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
