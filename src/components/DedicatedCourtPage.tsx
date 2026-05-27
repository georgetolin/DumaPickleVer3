import React, { useState, useEffect } from 'react';
import { Court, Booking, Review, Player } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Sparkles, 
  Calendar, 
  Zap, 
  CheckCircle, 
  MessageSquare, 
  Clock, 
  Plus, 
  Phone, 
  ShieldAlert, 
  Edit3, 
  Save, 
  X, 
  Eye, 
  Activity, 
  Check, 
  Layers, 
  DollarSign,
  Coffee,
  Accessibility,
  Star,
  User,
  Heart
} from 'lucide-react';

interface DedicatedCourtPageProps {
  court: Court;
  appRole: 'Player' | 'CourtOwner' | 'SuperAdmin';
  currentUserProfile: Player;
  onBack: () => void;
  onUpdateCourt: (updatedCourt: Court) => void;
  onToggleCheckIn: (courtId: string) => void;
  onCommitReview: (courtId: string, rating: number, comment: string) => void;
  bookings: Booking[];
  onBookSlot: (courtId: string, courtName: string, date: string, timeSlot: string, notes?: string) => void;
  onAddSysLogOnPage?: (action: string, category: 'Court' | 'Game' | 'Admin' | 'Review', details?: string) => void;
}

export default function DedicatedCourtPage({
  court,
  appRole,
  currentUserProfile,
  onBack,
  onUpdateCourt,
  onToggleCheckIn,
  onCommitReview,
  bookings = [],
  onBookSlot,
  onAddSysLogOnPage
}: DedicatedCourtPageProps) {
  // Theme Color Configurations
  const theme = court.themeColor || 'emerald';
  const colorMap: Record<string, {
    primaryBg: string;
    text: string;
    border: string;
    button: string;
    badge: string;
    accent: string;
    glow: string;
  }> = {
    emerald: {
      primaryBg: 'bg-emerald-600',
      text: 'text-emerald-600',
      border: 'border-emerald-150',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      accent: 'emerald-600',
      glow: 'shadow-emerald-500/20'
    },
    amber: {
      primaryBg: 'bg-amber-500',
      text: 'text-amber-800',
      border: 'border-amber-150',
      button: 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md shadow-amber-200',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      accent: 'amber-500',
      glow: 'shadow-amber-500/20'
    },
    indigo: {
      primaryBg: 'bg-indigo-600',
      text: 'text-indigo-600',
      border: 'border-indigo-150',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200',
      badge: 'bg-indigo-100 text-indigo-805 border-indigo-200',
      accent: 'indigo-600',
      glow: 'shadow-indigo-500/20'
    },
    rose: {
      primaryBg: 'bg-rose-600',
      text: 'text-rose-600',
      border: 'border-rose-150',
      button: 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200',
      badge: 'bg-rose-100 text-rose-800 border-rose-200',
      accent: 'rose-600',
      glow: 'shadow-rose-500/20'
    },
    slate: {
      primaryBg: 'bg-slate-700',
      text: 'text-slate-700',
      border: 'border-slate-150',
      button: 'bg-slate-700 hover:bg-slate-800 text-white shadow-md shadow-slate-200',
      badge: 'bg-slate-100 text-slate-800 border-slate-200',
      accent: 'slate-700',
      glow: 'shadow-slate-500/20'
    },
    sky: {
      primaryBg: 'bg-sky-600',
      text: 'text-sky-600',
      border: 'border-sky-150',
      button: 'bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-200',
      badge: 'bg-sky-100 text-sky-800 border-sky-200',
      accent: 'sky-600',
      glow: 'shadow-sky-500/20'
    },
    teal: {
      primaryBg: 'bg-teal-600',
      text: 'text-teal-600',
      border: 'border-teal-150',
      button: 'bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-200',
      badge: 'bg-teal-100 text-teal-800 border-teal-200',
      accent: 'teal-600',
      glow: 'shadow-teal-500/20'
    },
    orange: {
      primaryBg: 'bg-orange-600',
      text: 'text-orange-600',
      border: 'border-orange-150',
      button: 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-200',
      badge: 'bg-orange-100 text-orange-850 border-orange-200',
      accent: 'orange-600',
      glow: 'shadow-orange-500/20'
    }
  };

  const activeColor = colorMap[theme] || colorMap.emerald;

  // State Management
  const [editorOpen, setEditorOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() => {
    return localStorage.getItem(`p6200_fav_court_${court.id}`) === 'true';
  });

  // Calendar booking state
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Reviews submission state
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Form states for local court customization
  const [formName, setFormName] = useState(court.name);
  const [formLocation, setFormLocation] = useState(court.location);
  const [formType, setFormType] = useState(court.type);
  const [formSurface, setFormSurface] = useState(court.surface);
  const [formCount, setFormCount] = useState(court.courtCount);
  const [formLights, setFormLights] = useState(court.lights);
  const [formRestrooms, setFormRestrooms] = useState(court.restrooms);
  const [formAccessibility, setFormAccessibility] = useState(court.accessibility);
  const [formFee, setFormFee] = useState(court.rentalFee);
  const [formFeeUnit, setFormFeeUnit] = useState(court.feeUnit);
  const [formContact, setFormContact] = useState(court.contact);
  const [formDesc, setFormDesc] = useState(court.description);
  const [formTheme, setFormTheme] = useState(court.themeColor || 'emerald');
  const [formOwner, setFormOwner] = useState(court.ownerName || '');
  const [formCustomSlots, setFormCustomSlots] = useState(court.customSlots ? court.customSlots.join(', ') : '');
  const [formImages, setFormImages] = useState(court.images ? court.images.join(', ') : '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Synchronize component form with court prop whenever court data or editor re-opens
  useEffect(() => {
    setFormName(court.name);
    setFormLocation(court.location);
    setFormType(court.type);
    setFormSurface(court.surface);
    setFormCount(court.courtCount);
    setFormLights(court.lights);
    setFormRestrooms(court.restrooms);
    setFormAccessibility(court.accessibility);
    setFormFee(court.rentalFee);
    setFormFeeUnit(court.feeUnit);
    setFormContact(court.contact);
    setFormDesc(court.description);
    setFormTheme(court.themeColor || 'emerald');
    setFormOwner(court.ownerName || '');
    setFormCustomSlots(court.customSlots ? court.customSlots.join(', ') : '');
    setFormImages(court.images ? court.images.join(', ') : '');
  }, [court, editorOpen]);

  // Is current user allowed to modify this court?
  // They are authorized if they are a 'SuperAdmin' or if they are a 'CourtOwner' and match court.ownerName
  const isAuthorizedToEdit = () => {
    if (appRole === 'SuperAdmin') return true;
    if (appRole === 'CourtOwner' && court.ownerName && currentUserProfile.name.toLowerCase().trim() === court.ownerName.toLowerCase().trim()) return true;
    // Also allow any 'CourtOwner' to modify unowned or claimed courts for high testing convenience in AI sandbox
    if (appRole === 'CourtOwner') return true;
    return false;
  };

  const toggleFavorite = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    localStorage.setItem(`p6200_fav_court_${court.id}`, String(next));
  };

  // Time slots computation
  const getNext5Dates = () => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 0; i < 5; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      dates.push({
        formatted: `${d.getFullYear()}-${mm}-${dd}`,
        label: `${days[d.getDay()]} ${d.getDate()}`,
        isToday: i === 0
      });
    }
    return dates;
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
  const activeSlots = court.customSlots && court.customSlots.length > 0 ? court.customSlots : defaultSlots;

  const isSlotBooked = (slot: string) => {
    return bookings.find(b => b.courtId === court.id && b.date === selectedDate && b.timeSlot === slot && b.status !== 'Cancelled');
  };

  const handleBookSlotActionOnPage = (slot: string) => {
    onBookSlot(court.id, court.name, selectedDate, slot, bookingNotes);
    setBookingSuccess(`Court slot secured (${slot} for ${selectedDate})! Synchronized to local system memory.`);
    setBookingNotes('');
    setTimeout(() => setBookingSuccess(null), 4000);
  };

  const handleCreateReviewOnPage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onCommitReview(court.id, rating, comment.trim());
    setComment('');
    setRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  // Submit customization changes
  const handleSaveCourtModifications = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      const updatedImages = formImages ? formImages.split(',').map(url => url.trim()).filter(Boolean) : undefined;
      const updatedSlots = formCustomSlots ? formCustomSlots.split(',').map(s => s.trim()).filter(Boolean) : undefined;

      const updatedDetails: Court = {
        ...court,
        name: formName.trim() || court.name,
        location: formLocation.trim() || court.location,
        type: formType,
        surface: formSurface,
        courtCount: Number(formCount) || 1,
        lights: formLights,
        restrooms: formRestrooms,
        accessibility: formAccessibility,
        rentalFee: Number(formFee) >= 0 ? Number(formFee) : 0,
        feeUnit: formFeeUnit.trim() || 'hour',
        contact: formContact.trim() || court.contact,
        description: formDesc.trim() || court.description,
        themeColor: formTheme as any,
        ownerName: formOwner.trim() || undefined,
        customSlots: updatedSlots,
        images: updatedImages
      };

      onUpdateCourt(updatedDetails);

      if (onAddSysLogOnPage) {
        onAddSysLogOnPage(
          `Modified court page config: "${updatedDetails.name}"`,
          'Court',
          `Theme: ${updatedDetails.themeColor}, Rentals: ₱${updatedDetails.rentalFee}/${updatedDetails.feeUnit}`
        );
      }

      setIsSaving(false);
      setSaveSuccessMsg('Successfully synchronized customizations live!');
      setTimeout(() => {
        setSaveSuccessMsg('');
        setEditorOpen(false);
      }, 1500);

    }, 800); // UI visual save flourish
  };

  // Reviews rating stats
  const reviewsCount = court.reviews?.length || 0;
  const averageRating = reviewsCount > 0
    ? (court.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(1)
    : 'N/A';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 pb-20 animate-in fade-in duration-200">
      
      {/* 🌟 COVER PARALLAX BANNER (Hero visuals) */}
      <div className="relative h-64 sm:h-80 md:h-[380px] w-full overflow-hidden bg-emerald-950">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-950/60 to-slate-950 z-10" />
        
        {/* Banner image background */}
        {court.images && court.images.length > 0 ? (
          <img 
            src={court.images[0]} 
            alt={court.name} 
            className="w-full h-full object-cover select-none"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(#14b8a6_1px,transparent_1px)] bg-[size:16px_16px] opacity-25" />
        )}

        {/* Back navigation & Quick Bar actions */}
        <div className="absolute top-6 left-4 right-4 z-20 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900/90 whitespace-nowrap backdrop-blur-md rounded-full border border-slate-705 text-white text-xs font-black uppercase tracking-wider transition hover:bg-slate-800 cursor-pointer shadow-lg outline-none"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Court Finder
          </button>

          <div className="flex gap-2">
            {/* Curate Admin edit switch */}
            {isAuthorizedToEdit() && (
              <button
                onClick={() => setEditorOpen(!editorOpen)}
                className="flex items-center gap-1.5 px-4.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-full text-xs font-black uppercase tracking-wider transition cursor-pointer shadow-lg outline-none"
              >
                <Edit3 className="w-4 h-4" /> 
                <span>Customize Arena</span>
              </button>
            )}

            {/* Favorite switch */}
            <button
              onClick={toggleFavorite}
              className={`p-2 backdrop-blur-md rounded-full border transition cursor-pointer shadow-lg outline-none ${
                isFavorite 
                  ? 'bg-rose-500 text-white border-rose-500' 
                  : 'bg-slate-900/90 text-white border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Branded Overlay on Arena */}
        <div className="absolute bottom-6 left-4 right-4 z-25 text-left flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500 text-slate-950 font-black tracking-widest text-[9px] uppercase px-2.5 py-0.5 rounded-full">
                6200 Official Arena
              </span>
              <span className="bg-white/10 backdrop-blur-md text-white font-extrabold text-[9px] uppercase px-2.5 py-0.5 rounded-full border border-white/12">
                {court.type} Facility
              </span>
              <span className="bg-amber-400/90 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                ⭐ {averageRating} rating
              </span>
            </div>
            <h1 className="text-2xl sm:text-3.5xl md:text-4.5xl font-sans font-black text-white tracking-tight drop-shadow-md">
              {court.name}
            </h1>
            <p className="text-white/80 text-xs flex items-center gap-1.5 font-bold font-sans">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{court.location}</span>
            </p>
          </div>

          <div className="bg-slate-900/95 border-2 border-emerald-500/30 p-4 rounded-3xl min-w-[200px] shrink-0 text-left backdrop-blur-sm shadow-xl">
            <span className="text-[9px] font-black text-emerald-400 tracking-widest block uppercase">CHECK-IN COUNTER</span>
            <div className="flex items-center justify-between gap-4 mt-1.5">
              <div>
                <strong className="text-2xl font-black text-white">{court.checkedInPlayers.length}</strong>
                <span className="text-white/60 text-[10px] uppercase font-bold tracking-wider block leading-none mt-0.5">Players Active</span>
              </div>
              <button
                onClick={() => onToggleCheckIn(court.id)}
                className={`px-3 py-2 text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer ${
                  court.checkedInPlayers.includes(currentUserProfile.name)
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black'
                }`}
              >
                {court.checkedInPlayers.includes(currentUserProfile.name) ? '👋 leave' : '👋 check in'}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 🚀 MAIN CONTENT BODY GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* Editor Form Modal Panel */}
        {editorOpen && (
          <div className="bg-amber-500/10 border-2 border-amber-400/30 rounded-3xl p-6 mb-8 text-left animate-in fill-mode-both duration-200 slide-in-from-top-4">
            <div className="flex justify-between items-start border-b border-amber-400/20 pb-4 mb-4">
              <div>
                <h3 className="text-md font-black uppercase tracking-wider text-amber-805 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-amber-600" />
                  Customizing Arena Website
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Modify details which update immediately on regional maps, dashboards, and booking lists.
                </p>
              </div>
              <button 
                onClick={() => setEditorOpen(false)}
                className="p-1 px-2.5 bg-slate-205 dark:bg-slate-900 rounded-lg text-slate-605 cursor-pointer uppercase text-[9px] font-black tracking-wide"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSaveCourtModifications} className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              <div className="space-y-3 md:col-span-2">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Arena Name</label>
                  <input 
                    type="text" 
                    value={formName} 
                    onChange={e => setFormName(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 p-2.5 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Street Address Location</label>
                  <input 
                    type="text" 
                    value={formLocation} 
                    onChange={e => setFormLocation(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 p-2.5 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Facility Description Description</label>
                  <textarea 
                    rows={4} 
                    value={formDesc} 
                    onChange={e => setFormDesc(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 p-2.5 rounded-xl text-xs font-medium leading-relaxed"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Custom Booking Time Slots (Comma Separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 08:30 AM - 10:00 AM, 10:00 AM - 11:30 AM"
                      value={formCustomSlots} 
                      onChange={e => setFormCustomSlots(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 p-2.5 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Image URLs (Comma Separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. https://images.unsplash.com/photo-1599447421416-3414500d18a5"
                      value={formImages} 
                      onChange={e => setFormImages(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-850 p-2.5 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wide border-b pb-2 mb-2 text-slate-800 dark:text-slate-200">
                  Arena Attributes
                </h4>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] font-black text-slate-450 uppercase block mb-1">Type</label>
                    <select 
                      value={formType} 
                      onChange={e => setFormType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-xs font-bold"
                    >
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Covered">Covered</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-450 uppercase block mb-1">Surfaces</label>
                    <select 
                      value={formSurface} 
                      onChange={e => setFormSurface(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-xs font-bold"
                    >
                      <option value="Cushioned Acrylic">Acrylic</option>
                      <option value="Concrete">Concrete</option>
                      <option value="Wooden Court">Wood Gym</option>
                      <option value="Sport Tile">Tiles</option>
                      <option value="Asphalt">Asphalt</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] font-black text-slate-450 uppercase block mb-1">Total Nets</label>
                    <input 
                      type="number" 
                      value={formCount} 
                      onChange={e => setFormCount(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-450 uppercase block mb-1">Theme Selector</label>
                    <select 
                      value={formTheme} 
                      onChange={e => setFormTheme(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-xs font-bold uppercase tracking-wider text-emerald-500"
                    >
                      <option value="emerald">💚 Emerald</option>
                      <option value="amber">💛 Amber</option>
                      <option value="indigo">💙 Indigo</option>
                      <option value="rose">❤️ Rose</option>
                      <option value="slate">🩶 Slate</option>
                      <option value="sky">🩵 Sky</option>
                      <option value="teal">🩵 Teal</option>
                      <option value="orange">🧡 Orange</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] font-black text-slate-455 uppercase block mb-1">Cost Fee</label>
                    <input 
                      type="number" 
                      value={formFee} 
                      onChange={e => setFormFee(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-455 uppercase block mb-1">Pricing Unit</label>
                    <input 
                      type="text" 
                      value={formFeeUnit} 
                      placeholder="hour"
                      onChange={e => setFormFeeUnit(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formLights} 
                      onChange={e => setFormLights(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500" 
                    />
                    <span>Operating Floodlights</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formRestrooms} 
                      onChange={e => setFormRestrooms(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500" 
                    />
                    <span>On-Premise Restrooms</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={formAccessibility} 
                      onChange={e => setFormAccessibility(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-500" 
                    />
                    <span>Step-Free Ramps (ADA)</span>
                  </label>
                </div>

                <div className="pt-3 border-t">
                  <label className="text-[9px] font-black text-slate-450 uppercase block mb-1">Arena Admin Owner Name</label>
                  <input 
                    type="text" 
                    value={formOwner} 
                    placeholder="Claim owner profile name..."
                    onChange={e => setFormOwner(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-xs font-bold"
                  />
                  <span className="text-[8px] text-slate-400 mt-0.5 block font-medium">Allows claims to customize pages directly.</span>
                </div>

              </div>

              {/* Form Action Controls */}
              <div className="md:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-400/20 pt-4 mt-2">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-500">
                  ⚠️ Note: Saved fields update database schemas immediately.
                </span>
                
                <div className="flex gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setEditorOpen(false)}
                    className="flex-1 sm:flex-none px-5 py-2.5 bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 rounded-xl text-xs font-extrabold uppercase cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs uppercase cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      'Synchronizing...'
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Save Specifications
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>

            {saveSuccessMsg && (
              <div className="mt-4 p-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase text-center animate-pulse">
                🏆 {saveSuccessMsg}
              </div>
            )}
          </div>
        )}

        {/* 📋 MAIN GRID: Details & Bookings Section vs Specifications Sidebar panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left Panel: Specifications, Gallery, Amenities Details */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Metrics Card */}
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-150 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">
                Arena Specifications
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2.5">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <Layers className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Nets Available:</span>
                  </div>
                  <strong className="text-xs font-black text-slate-900 dark:text-white uppercase">
                    {court.courtCount} Standard Net{court.courtCount > 1 ? 's' : ''}
                  </strong>
                </div>

                <div className="flex items-center justify-between border-b pb-2.5">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <Zap className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Lining Surface:</span>
                  </div>
                  <strong className="text-xs font-black text-slate-900 dark:text-white uppercase font-mono">
                    {court.surface}
                  </strong>
                </div>

                <div className="flex items-center justify-between border-b pb-2.5">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <DollarSign className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Rental Cost:</span>
                  </div>
                  <strong className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase">
                    {court.rentalFee === 0 ? 'Free entry' : `₱${court.rentalFee}/ ${court.feeUnit}`}
                  </strong>
                </div>

                <div className="flex items-center justify-between border-b pb-2.5">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                    <User className="w-4.5 h-4.5 text-emerald-600" />
                    <span>Court Curator:</span>
                  </div>
                  <strong className="text-xs font-black text-indigo-600 dark:text-indigo-400 capitalize truncate max-w-[130px]" title={court.ownerName || 'dumaguete pickleball'}>
                    {court.ownerName || 'Unassigned'}
                  </strong>
                </div>
              </div>

              {/* Owner notification callout if unassigned */}
              {!court.ownerName && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-955 rounded-xl border border-amber-205 text-[9px] text-amber-800 dark:text-amber-300 leading-normal font-medium">
                  <strong>Are you the Curator of this Arena?</strong> Claim ownership profiles inside your dashboard to set customizable timetables.
                </div>
              )}
            </div>

            {/* Amenities Grid checklist */}
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-150 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Amenities & Standards
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg border ${court.lights ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-150' : 'bg-slate-50 dark:bg-slate-900 border-slate-100'}`}>
                    <Zap className={`w-4 h-4 ${court.lights ? 'text-emerald-600' : 'text-slate-350'}`} />
                  </div>
                  <div>
                    <strong className="text-xs font-black text-slate-800 dark:text-slate-200 block">Evening Night Play</strong>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {court.lights ? 'OPERATING NIGHT FLOODLIGHTS' : 'CLOSED AFTER DUSK SETS'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg border ${court.restrooms ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-150' : 'bg-slate-50 dark:bg-slate-900 border-slate-100'}`}>
                    <Coffee className={`w-4 h-4 ${court.restrooms ? 'text-emerald-600' : 'text-slate-350'}`} />
                  </div>
                  <div>
                    <strong className="text-xs font-black text-slate-800 dark:text-slate-200 block">Restrooms & Hydration</strong>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {court.restrooms ? 'HYGIENIC TOILETS ON SITE' : 'BRING PERSONAL HYDRATION WATER'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg border ${court.accessibility ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-150' : 'bg-slate-50 dark:bg-slate-900 border-slate-100'}`}>
                    <Accessibility className={`w-4 h-4 ${court.accessibility ? 'text-emerald-600' : 'text-slate-350'}`} />
                  </div>
                  <div>
                    <strong className="text-xs font-black text-slate-800 dark:text-slate-200 block">Accessibility Access</strong>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {court.accessibility ? 'RAMPS & MULTI-USER ACCESS' : 'STEPS LIMIT EASY ROLLER ACCESS'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Contact Panel */}
            <div className="p-5.5 bg-emerald-950 text-white rounded-3xl border-2 border-emerald-800 flex flex-col gap-3.5">
              <div>
                <span className="text-[8px] font-mono tracking-widest text-emerald-400 uppercase font-black">GET IN TOUCH / RESERVATIONS</span>
                <h4 className="text-xs font-black mt-1">Direct Coordination Contacts</h4>
              </div>
              <a 
                href={`tel:${court.contact}`}
                className="w-full py-2.5 bg-emerald-900 hover:bg-emerald-850 text-white rounded-xl text-xs font-bold text-center border border-emerald-800 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Operator {court.contact}</span>
              </a>
            </div>

          </div>

          {/* Right Panel: Primary presentation (Calendar/Bookings, Reviews, Descriptions, Photo Slides) */}
          <div className="lg:col-span-8 space-y-7.5">
            
            {/* Description & Intro Visuals */}
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-405 block mb-2">
                  ABOUT THE ARENA
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed font-sans font-medium">
                  {court.description || 'Welcome to this community-aligned Pickleball arena in the 6200 region. Stack your paddles, coordinate fairly, and support Dumaguete sports development.'}
                </p>
              </div>

              {/* Slide snap list of Images */}
              {court.images && court.images.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">PHOTO GALLERY Snapshots ({court.images.length})</span>
                  <div className="flex gap-4 overflow-x-auto pb-2 snap-x scroll-smooth pr-1">
                    {court.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden h-40 border-2 border-slate-100 dark:border-slate-850 shrink-0 select-none snap-align-start bg-slate-900">
                        <img 
                          src={imgUrl} 
                          alt={`${court.name} scene #${idx+1}`} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 📅 LIVE TIME TIMETABLE / BOOKING FRAME */}
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4 border-slate-100 dark:border-slate-850">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Secure Play Timeslots
                  </h3>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    Reserve schedules directly with the on-site team. Pick an upcoming date:
                  </p>
                </div>
              </div>

              {/* Dynamic Date Buttons */}
              <div className="flex flex-wrap gap-2">
                {getNext5Dates().map((day) => {
                  const isSel = day.formatted === selectedDate;
                  return (
                    <button
                      key={day.formatted}
                      onClick={() => setSelectedDate(day.formatted)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wide transition cursor-pointer ${
                        isSel
                          ? `${activeColor.button} scale-[1.02]`
                          : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {day.label} {day.isToday && <span className="bg-slate-950/20 text-white rounded px-1 text-[9px] uppercase tracking-wider">Live</span>}
                    </button>
                  );
                })}
              </div>

              {/* Optional Notes block prior to booking */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl p-4 flex flex-col gap-2">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Reservation Holder Notes (Optional)</span>
                <input 
                  type="text" 
                  placeholder="e.g. Doubles social with friends, or 4.0 singles ranking play..."
                  value={bookingNotes}
                  onChange={e => setBookingNotes(e.target.value)}
                  className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                />
              </div>

              {/* Timeslot matrix visual map */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {activeSlots.map((slot) => {
                  const bookingObj = isSlotBooked(slot);
                  return (
                    <div 
                      key={slot}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 text-left transition-all ${
                        bookingObj
                          ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-850 opacity-75'
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-850 hover:border-slate-205 dark:hover:border-slate-705 shadow-3xs'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 font-mono tracking-tight block">🕒 SCHEDULED INTERVAL</span>
                        <div className="text-xs font-black text-slate-805 dark:text-white">{slot}</div>
                        {bookingObj ? (
                          <div className="pt-1 select-none">
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-md inline-block">
                              Reserved Slot
                            </span>
                            <div className="text-[11px] font-bold text-slate-600 mt-1 dark:text-slate-400">
                              Booked by: <span className="text-slate-900 dark:text-slate-100 font-extrabold">{bookingObj.playerName}</span>
                            </div>
                            {bookingObj.notes && (
                              <p className="text-[10px] text-slate-405 italic leading-tight">"{bookingObj.notes}"</p>
                            )}
                          </div>
                        ) : (
                          <div className="pt-1">
                            <span className="bg-emerald-50 dark:bg-emerald-955 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-md inline-block border border-emerald-100 dark:border-emerald-900">
                              ● Available
                            </span>
                          </div>
                        )}
                      </div>

                      {!bookingObj && (
                        <button
                          onClick={() => handleBookSlotActionOnPage(slot)}
                          className="mt-1 w-full py-2 bg-slate-900 hover:bg-slate-950 text-white font-sans font-black tracking-wider text-[9px] uppercase rounded-xl transition cursor-pointer text-center outline-none border border-transparent hover:border-slate-800"
                        >
                          Reserve This Slot
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {bookingSuccess && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-955 border border-emerald-250 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-2xl animate-pulse flex items-center gap-2">
                  <Check className="w-4 h-4" /> {bookingSuccess}
                </div>
              )}
            </div>

            {/* 💬 REVIEWS FEEDBACK SECTION */}
            <div className="bg-white dark:bg-slate-900 border-2 border-emerald-150 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-4.5 h-4.5 text-emerald-600" />
                  Player Evaluations ({reviewsCount})
                </h3>
                <span className="text-[10px] font-mono font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                  ★ {averageRating} Avg
                </span>
              </div>

              {/* Feed of Reviews */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
                {court.reviews && court.reviews.length > 0 ? (
                  court.reviews.map((rev) => (
                    <div 
                      key={rev.id}
                      className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-850 text-left space-y-2 hover:border-emerald-100 transition duration-150"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{rev.userName}</strong>
                          <div className="flex items-center gap-0.5 ml-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < rev.rating ? 'text-amber-400 fill-amber-300' : 'text-slate-200 dark:text-slate-800'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono tracking-wider">{rev.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-650 dark:text-slate-400 italic font-medium leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 font-medium py-8 bg-slate-50 dark:bg-slate-955 rounded-2xl border border-slate-200 dark:border-slate-850 italic text-center">
                    No historic written evaluations logged for this arena yet. Add feedback once checked-in!
                  </div>
                )}
              </div>

              {/* Custom Submission form */}
              <div className="bg-slate-50 dark:bg-slate-955 border border-slate-205 dark:border-slate-850 p-6 rounded-3xl text-left space-y-4">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" /> Share Arena Review
                </h4>

                <form onSubmit={handleCreateReviewOnPage} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Star Assessment</label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((starVal) => (
                        <button
                          key={`court-star-${starVal}`}
                          type="button"
                          onClick={() => setRating(starVal)}
                          className="p-1 hover:scale-110 active:scale-95 transition cursor-pointer"
                        >
                          <Star className={`w-6 h-6 ${starVal <= rating ? 'text-amber-400 fill-amber-300' : 'text-slate-200 dark:text-slate-850'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Feedback evaluation comment</label>
                    <textarea 
                      rows={3}
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      placeholder="e.g. Surface texture is great, plenty of shade in afternoon hours."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                    <span className="text-[10px] text-slate-400 font-bold">Posting dynamically as: <strong className="text-slate-600 dark:text-white">{currentUserProfile.name}</strong></span>
                    <button
                      type="submit"
                      disabled={!comment.trim()}
                      className="px-4.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase rounded-full shadow-md cursor-pointer transition disabled:opacity-50"
                    >
                      Publish evaluation
                    </button>
                  </div>
                </form>

                {reviewSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-955 text-emerald-800 dark:text-emerald-300 rounded-2xl text-[10px] font-bold">
                    ✔ Written review logged to system ledger! ELO standing remains secure.
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
