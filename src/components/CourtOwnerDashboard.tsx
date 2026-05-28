import React, { useState } from 'react';
import { Court, UserRequest, Booking } from '../types';
import { 
  Building2, 
  Plus, 
  MapPin, 
  Sparkles, 
  Settings, 
  ArrowRight, 
  Save, 
  Image as ImageIcon, 
  Zap, 
  UserCheck, 
  Trash2, 
  CheckCircle,
  Clock,
  ExternalLink,
  DollarSign,
  Calendar
} from 'lucide-react';

interface CourtOwnerDashboardProps {
  courts: Court[];
  ownerName: string;
  onAddCourtRequest: (request: Omit<UserRequest, 'id' | 'submittedAt' | 'status'>) => void;
  onUpdateCourtDirect: (updatedCourt: Court) => void;
  userRequests: UserRequest[];
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, status: 'Confirmed' | 'Cancelled') => void;
  onDeleteBooking: (bookingId: string) => void;
}

const DUMAGUETE_HOVER_PRESETS = [
  { name: 'Tropical Azure Acrylic', url: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=600' },
  { name: 'Highlands Covered Hardwood', url: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?auto=format&fit=crop&q=80&w=600' },
  { name: 'Negros Waterfront Arena', url: 'https://images.unsplash.com/photo-1521537634581-0d31f3b25f38?auto=format&fit=crop&q=80&w=600' },
  { name: 'Boulevard Pro Court', url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=600' }
];

export default function CourtOwnerDashboard({
  courts,
  ownerName,
  onAddCourtRequest,
  onUpdateCourtDirect,
  userRequests,
  bookings = [],
  onUpdateBookingStatus,
  onDeleteBooking
}: CourtOwnerDashboardProps) {
  // Navigation internal tabs
  const [activeSubTab, setActiveSubTab] = useState<'my-courts' | 'submit-new' | 'pending-reviews' | 'bookings'>('my-courts');

  // Edit State
  const [editingCourtId, setEditingCourtId] = useState<string | null>(null);

  // Form Fields State (shared for edit or new court)
  const [courtName, setCourtName] = useState('');
  const [courtLocation, setCourtLocation] = useState('');
  const [courtType, setCourtType] = useState<'Indoor' | 'Outdoor' | 'Covered'>('Outdoor');
  const [courtSurface, setCourtSurface] = useState<'Cushioned Acrylic' | 'Concrete' | 'Wooden Court' | 'Sport Tile' | 'Asphalt' | 'Sport Court'>('Cushioned Acrylic');
  const [courtCount, setCourtCount] = useState(2);
  const [lights, setLights] = useState(true);
  const [rentalFee, setRentalFee] = useState(150);
  const [feeUnit, setFeeUnit] = useState('hour');
  const [contact, setContact] = useState('');
  const [description, setDescription] = useState('');
  const [restrooms, setRestrooms] = useState(true);
  const [accessibility, setAccessibility] = useState(true);
  const [latitude, setLatitude] = useState(9.3075);
  const [longitude, setLongitude] = useState(123.3114);
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [successBanner, setSuccessBanner] = useState('');
  const [errorBanner, setErrorBanner] = useState('');

  // Customizable Page Themes & Timeslot state
  const [courtThemeColor, setCourtThemeColor] = useState<'emerald' | 'amber' | 'indigo' | 'rose' | 'slate' | 'sky' | 'teal' | 'orange'>('emerald');
  const [courtCustomSlots, setCourtCustomSlots] = useState('');

  // Owned listings matching context - Strictly isolated to guarantee separate accounts cannot access other people's listings
  const myOwnedCourts = courts.filter(c => {
    // 1. Direct ownership matching: If court belongs strictly to this logged-in manager
    if (c.ownerName === ownerName) return true;
    
    // 2. Demo fallback sandbox: Only the designated demo managers get access to unassigned/unowned seed courts
    if (ownerName === 'Demo Facility Manager' || ownerName === 'George T.') {
      return !c.ownerName || c.ownerName === 'Owner' || c.ownerName === '';
    }
    
    return false;
  });
  const myOwnedCourtIds = myOwnedCourts.map(c => c.id);
  const myOwnedBookings = bookings.filter(b => myOwnedCourtIds.includes(b.courtId));

  // Choose a court to edit
  const handleSelectEditCourt = (court: Court) => {
    setEditingCourtId(court.id);
    setCourtName(court.name);
    setCourtLocation(court.location);
    setCourtType(court.type);
    setCourtSurface(court.surface);
    setCourtCount(court.courtCount);
    setLights(court.lights);
    setRentalFee(court.rentalFee);
    setFeeUnit(court.feeUnit);
    setContact(court.contact);
    setDescription(court.description);
    setRestrooms(court.restrooms);
    setAccessibility(court.accessibility);
    setLatitude(court.latitude);
    setLongitude(court.longitude);
    setImagesList(court.images || []);
    setCourtThemeColor(court.themeColor || 'emerald');
    setCourtCustomSlots(court.customSlots ? court.customSlots.join(', ') : '');
  };

  const handleSaveEditedCourt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourtId) return;

    const updated: Court = {
      ...courts.find(c => c.id === editingCourtId)!,
      id: editingCourtId,
      name: courtName,
      location: courtLocation,
      type: courtType,
      surface: courtSurface,
      courtCount: Number(courtCount),
      lights,
      rentalFee: Number(rentalFee),
      feeUnit,
      contact,
      description,
      restrooms,
      accessibility,
      latitude: Number(latitude),
      longitude: Number(longitude),
      images: imagesList,
      themeColor: courtThemeColor,
      customSlots: courtCustomSlots ? courtCustomSlots.split(',').map(s => s.trim()).filter(Boolean) : undefined
    };

    onUpdateCourtDirect(updated);
    setSuccessBanner(`Successfully synchronized changes to "${courtName}"! Theme accent shifted to ${courtThemeColor}.`);
    setEditingCourtId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSuccessBanner(''), 4500);
  };

  const handleCreateNewCourtApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courtName || !courtLocation) {
      setErrorBanner('Please provide a Court Name and physical street Location');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setErrorBanner(''), 4500);
      return;
    }
    setErrorBanner('');

    onAddCourtRequest({
      type: 'NewCourtSuggestion',
      title: `Register Facility: ${courtName}`,
      description: `New proposal for a ${courtType} (${courtSurface}) court, offering ${courtCount} nets at ₱${rentalFee}/${feeUnit}.`,
      submittedBy: ownerName,
      details: {
        name: courtName,
        location: courtLocation,
        type: courtType,
        surface: courtSurface,
        courtCount: Number(courtCount),
        lights,
        rentalFee: Number(rentalFee),
        feeUnit,
        contact,
        description,
        restrooms,
        accessibility,
        latitude: Number(latitude),
        longitude: Number(longitude),
        images: imagesList.length > 0 ? imagesList : [DUMAGUETE_HOVER_PRESETS[0].url]
      }
    });

    setSuccessBanner('Your court registration application has been securely transmitted! A SuperAdmin operator will review the specifications for listing shortly.');
    setActiveSubTab('pending-reviews');
    
    // Clear forms
    setCourtName('');
    setCourtLocation('');
    setContact('');
    setDescription('');
    setImagesList([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSuccessBanner(''), 5500);
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setImagesList(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
  };

  const handlePickPresetImage = (url: string) => {
    if (imagesList.includes(url)) return;
    setImagesList(prev => [...prev, url]);
  };

  const handleRemoveImage = (index: number) => {
    setImagesList(prev => prev.filter((_, i) => i !== index));
  };

  // Find requests submitted by this owner
  const myRequests = userRequests.filter(
    r => r.submittedBy === ownerName && r.type === 'NewCourtSuggestion'
  );

  return (
    <div className="space-y-6 font-sans text-slate-800 dark:text-slate-100">
      
      {/* Intro Dashboard Ribbon */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6.5 text-white shadow-md text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/30 border border-emerald-400/40 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
            <Building2 className="w-3.5 h-3.5" /> Court Business Portal
          </div>
          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight leading-tight">
            Manage Court Information & Visual Galleries
          </h2>
          <p className="text-emerald-100 text-xs font-medium leading-relaxed">
            Welcome back, <strong className="text-amber-300 font-extrabold">{ownerName}</strong>! Propose new facilities, update evening lights schedules, manage fee pricing units, and modify interactive image carousels synchronously.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => { setActiveSubTab('my-courts'); setEditingCourtId(null); }}
            className={`px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border-2 ${
              activeSubTab === 'my-courts' && !editingCourtId
                ? 'bg-white text-emerald-950 border-white shadow-md'
                : 'bg-emerald-700/40 hover:bg-emerald-700/60 text-white border-transparent'
            }`}
          >
            My Courts ({courts.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('bookings'); setEditingCourtId(null); }}
            className={`px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border-2 ${
              activeSubTab === 'bookings'
                ? 'bg-white text-emerald-950 border-white shadow-md'
                : 'bg-emerald-700/40 hover:bg-emerald-700/60 text-white border-transparent'
            }`}
          >
            Reservations Ledger ({myOwnedBookings.length})
          </button>
          <button
            onClick={() => { setActiveSubTab('submit-new'); setEditingCourtId(null); }}
            className={`px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border-2 ${
              activeSubTab === 'submit-new'
                ? 'bg-white text-emerald-950 border-white shadow-md'
                : 'bg-emerald-700/40 hover:bg-emerald-700/60 text-white border-transparent'
            }`}
          >
            Add Facility
          </button>
        </div>
      </div>

      {/* Action Notification Feed Banner */}
      {successBanner && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-100 dark:border-emerald-900/65 p-4 rounded-2xl text-left flex items-start gap-3 animate-in fade-in duration-300">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-800 dark:text-emerald-400">DATABASE UPDATE COMPLETED</span>
            <p className="text-xs text-slate-750 dark:text-slate-350 leading-relaxed font-bold">{successBanner}</p>
          </div>
        </div>
      )}

      {errorBanner && (
        <div className="bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-100 dark:border-rose-900/40 p-4 rounded-2xl text-left flex items-start gap-3 animate-in fade-in duration-300">
          <span className="text-xs text-rose-500 mt-1">⚠️</span>
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-black tracking-widest text-rose-800 dark:text-rose-450">VALIDATION DISCREPANCY</span>
            <p className="text-xs text-rose-950 dark:text-rose-200 leading-relaxed font-bold">{errorBanner}</p>
          </div>
        </div>
      )}

      {/* Main Core Layout switch */}
      {editingCourtId ? (
        /* ================= COURT EDITING ZONE ================= */
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-6.5 shadow-sm text-left">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">ADVANCED FORM EDITOR</span>
              <h3 className="text-lg font-black font-sans text-slate-900 dark:text-white leading-none">
                Modify Court Details · {courtName}
              </h3>
            </div>
            <button
              onClick={() => setEditingCourtId(null)}
              className="text-xs font-black text-slate-450 hover:text-slate-700 uppercase bg-slate-50 dark:bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer"
            >
              Cancel Edit
            </button>
          </div>

          <form onSubmit={handleSaveEditedCourt} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Left Group */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Court/Facility Name</label>
                  <input
                    type="text"
                    required
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-455 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Street Location Address</label>
                  <input
                    type="text"
                    required
                    value={courtLocation}
                    onChange={(e) => setCourtLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-855 dark:text-slate-100 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Latitude Coordinate</label>
                    <input
                      type="number"
                      step={0.0001}
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-250 dark:border-slate-850 text-slate-700 dark:text-slate-100 font-mono text-xs px-3.5 py-2 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Longitude Coordinate</label>
                    <input
                      type="number"
                      step={0.0001}
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-250 dark:border-slate-850 text-slate-700 dark:text-slate-100 font-mono text-xs px-3.5 py-2 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Infrastructure Type</label>
                    <select
                      value={courtType}
                      onChange={(e) => setCourtType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-855 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                    >
                      <option value="Indoor">Indoor (Air / Fans)</option>
                      <option value="Outdoor">Outdoor open-air</option>
                      <option value="Covered">Covered Dome</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Deck Surface Texture</label>
                    <select
                      value={courtSurface}
                      onChange={(e) => setCourtSurface(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-855 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                    >
                      <option value="Cushioned Acrylic">Cushioned Acrylic</option>
                      <option value="Concrete">Concrete</option>
                      <option value="Wooden Court">Wooden Court</option>
                      <option value="Sport Tile">Sport Tile</option>
                      <option value="Asphalt">Asphalt</option>
                      <option value="Sport Court">Sport Court</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Standard Courts Count</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={courtCount}
                      onChange={(e) => setCourtCount(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 text-slate-870 dark:text-slate-100 text-xs px-3.5 py-2 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Contact Hotline Phone</label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-855 text-slate-800 dark:text-slate-100 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Rental Booking Cost (₱)</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={rentalFee}
                      onChange={(e) => setRentalFee(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 font-mono text-xs px-3.5 py-2 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Fee Booking Cycle Unit</label>
                    <select
                      value={feeUnit}
                      onChange={(e) => setFeeUnit(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-855 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                    >
                      <option value="hour">per hour</option>
                      <option value="session">per session (flat)</option>
                      <option value="day">per day</option>
                      <option value="free">free of charge</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Group: Description & Image Galleries */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-450 dark:text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Public Physical Description</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none transition-all resize-none"
                  />
                </div>

                {/* Checklist Amenities */}
                <div className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-850 p-4.5 rounded-2xl text-xs space-y-3">
                  <span className="text-[9px] font-black text-slate-405 dark:text-slate-505 tracking-wider uppercase block">Amenity Infrastructure Checklist</span>
                  <div className="grid grid-cols-3 gap-2 font-bold text-slate-700 dark:text-slate-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lights}
                        onChange={(e) => setLights(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Night Lights</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={restrooms}
                        onChange={(e) => setRestrooms(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Restrooms</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessibility}
                        onChange={(e) => setAccessibility(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Accessible</span>
                    </label>
                  </div>
                </div>

                {/* CUSTOM IMAGES CORNER */}
                <div className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-850 p-4.5 rounded-2xl space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" /> Court Visual Galleries ({imagesList.length})
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">
                      Add custom photo links to display your venue grid elegantly inside player dashboard feeds.
                    </p>
                  </div>

                  {/* Add URL field */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Insert online image URL (e.g. Unsplash, Imgur)..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-3 py-2 rounded-xl outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-xl uppercase tracking-wider"
                    >
                      Add Url
                    </button>
                  </div>

                  {/* Beautiful Pre-defined Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-slate-450 dark:text-slate-505 uppercase tracking-wider block">Or select Dumaguete themed local landscape presets:</span>
                    <div className="grid grid-cols-2 gap-2 text-left">
                      {DUMAGUETE_HOVER_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handlePickPresetImage(preset.url)}
                          className="p-1 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center gap-2 transition"
                        >
                          <img src={preset.url} alt={preset.name} className="w-9 h-9 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                          <span className="text-[9px] font-black tracking-tight leading-dense truncate font-sans">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Curators active image grid */}
                  {imagesList.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-150 dark:border-slate-800">
                      {imagesList.map((img, idx) => (
                        <div key={`form-gallery-item-${idx}`} className="group relative h-16 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          <img src={img} alt="Court preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-opacity shadow-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 italic py-2 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
                      No visual assets selected. App will automatically fall back to classic map details.
                    </div>
                  )}

                </div>

                {/* THEME COLOR ACCENT & TIME SLOT CUSTOMIZATION */}
                <div className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-850 p-4.5 rounded-2xl space-y-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5 font-sans">
                      🎨 Listing Display Color Accent
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">
                      Pick a custom color accent for this court's dedicated detail page and booking calendars.
                    </p>
                  </div>
                  <select
                    value={courtThemeColor}
                    onChange={(e) => setCourtThemeColor(e.target.value as any)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-xs px-3.5 py-2.5 rounded-xl outline-none font-bold"
                  >
                    <option value="emerald">Emerald Green (Classic)</option>
                    <option value="amber">Amber Gold</option>
                    <option value="indigo">Indigo Tech</option>
                    <option value="rose">Sunset Rose</option>
                    <option value="slate">Slate Minimalist</option>
                    <option value="sky">Sky Blue</option>
                    <option value="teal">Ocean Teal</option>
                    <option value="orange">Bright Orange</option>
                  </select>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-850 p-4.5 rounded-2xl space-y-4 font-sans">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      📅 Custom Reservable Timeslots
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">
                      Enter customized reservation hour slots separated by commas. (Or leave blank to use defaults).
                    </p>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. 08:00 AM - 09:30 AM, 10:00 AM - 11:30 AM"
                    value={courtCustomSlots}
                    onChange={(e) => setCourtCustomSlots(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-xs px-3.5 py-2.5 rounded-xl outline-none font-mono"
                  />
                  <p className="text-[9px] text-slate-450 dark:text-slate-400 font-medium">
                    Separate slots by comma like: <code className="bg-slate-200 dark:bg-slate-900 dark:text-emerald-400 px-1 rounded text-[10px]">07:00 AM - 09:00 AM, 09:00 AM - 11:00 AM</code>.
                  </p>
                </div>

              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingCourtId(null)}
                className="px-5 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 text-xs font-black rounded-full uppercase cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-full shadow-[0_4px_0_0_#047857] active:translate-y-0.5 active:shadow-none transition-all uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Court Configuration</span>
              </button>
            </div>
          </form>
        </div>
      ) : activeSubTab === 'submit-new' ? (
        /* ================= SUBMIT NEW PROPOSAL ZONE ================= */
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-6.5 shadow-sm text-left">
          <div className="border-b border-rose-50 dark:border-slate-800 pb-3 mb-6">
            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">OFFICIAL PARTNERSHIP REGISTRY</span>
            <h3 className="text-lg font-black font-sans text-slate-900 dark:text-white mt-1">
              File New Arena Listing Application
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed mt-1 font-semibold">
              Fill out the physical specifications of your pickleball facility. All submissions go through a manual auditing step by the DUMAPICKLE operator before joining the public directory.
            </p>
          </div>

          <form onSubmit={handleCreateNewCourtApplication} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Left Column fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Facility Arena Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Valencia Highlands Pickle Club"
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Street Location Address</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Km 12 Highlands highway, Valencia, 6215"
                    value={courtLocation}
                    onChange={(e) => setCourtLocation(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-250 dark:border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Latitude Coordinate</label>
                    <input
                      type="number"
                      step={0.0001}
                      required
                      value={latitude}
                      onChange={(e) => setLatitude(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 font-mono text-xs px-3.5 py-2 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Longitude Coordinate</label>
                    <input
                      type="number"
                      step={0.0001}
                      required
                      value={longitude}
                      onChange={(e) => setLongitude(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 font-mono text-xs px-3.5 py-2 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-455 uppercase tracking-widest mb-1.5 font-bold">Arena Type</label>
                    <select
                      value={courtType}
                      onChange={(e) => setCourtType(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 text-xs px-3.5 py-2 rounded-xl outline-none font-bold"
                    >
                      <option value="Indoor">Indoor (Fans / Aircon)</option>
                      <option value="Outdoor">Outdoor open-air</option>
                      <option value="Covered">Covered Dome</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-455 uppercase tracking-widest mb-1.5 font-bold">Surface Deck</label>
                    <select
                      value={courtSurface}
                      onChange={(e) => setCourtSurface(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 text-xs px-3.5 py-2 rounded-xl outline-none font-bold"
                    >
                      <option value="Cushioned Acrylic">Cushioned Acrylic</option>
                      <option value="Concrete">Concrete</option>
                      <option value="Wooden Court">Wooden Court</option>
                      <option value="Sport Tile">Sport Tile</option>
                      <option value="Asphalt">Asphalt</option>
                      <option value="Sport Court">Sport Court</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Nets/Court Count</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={courtCount}
                      onChange={(e) => setCourtCount(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 text-xs px-3.5 py-2 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Hotline Phone</label>
                    <input
                      type="text"
                      required
                      placeholder="+63 900 000 0000"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-250 dark:border-slate-850 text-xs px-3.5 py-2 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-455 uppercase tracking-widest mb-1.5 font-bold">Rental Booking Cost (₱)</label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={rentalFee}
                      onChange={(e) => setRentalFee(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-850 font-mono text-xs px-3.5 py-2 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-455 uppercase tracking-widest mb-1.5 font-bold">Booking Unit cycle</label>
                    <select
                      value={feeUnit}
                      onChange={(e) => setFeeUnit(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-205 dark:border-slate-855 text-xs px-3.5 py-2.5 rounded-xl outline-none"
                    >
                      <option value="hour">per hour</option>
                      <option value="session">per session (flat)</option>
                      <option value="free">free of charge</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: Descriptions & Images */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Physical Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide a welcoming description detailing your spectator seating, equipment rentals, paddle stacks systems, or cafe items..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-250 dark:border-slate-850 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none transition-all resize-none"
                  />
                </div>

                {/* Amenity Checklist */}
                <div className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-850 p-4.5 rounded-2xl text-xs space-y-3">
                  <span className="text-[9px] font-black text-slate-405 dark:text-slate-550 uppercase tracking-wider block">Amenity Infrastructure Checklist</span>
                  <div className="grid grid-cols-3 gap-2 font-bold text-slate-700 dark:text-slate-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lights}
                        onChange={(e) => setLights(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Night Lights</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={restrooms}
                        onChange={(e) => setRestrooms(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Restrooms</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accessibility}
                        onChange={(e) => setAccessibility(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Accessible</span>
                    </label>
                  </div>
                </div>

                {/* Images section */}
                <div className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-850 p-4.5 rounded-2xl space-y-4">
                  <span className="text-[9px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest block">Add Photos or Text Presets</span>
                  
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="Insert online image URL..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-3 py-2 rounded-xl outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-xl uppercase tracking-wider"
                    >
                      Add Url
                    </button>
                  </div>

                  {/* Built-in Presets list */}
                  <div className="grid grid-cols-2 gap-2 text-left">
                    {DUMAGUETE_HOVER_PRESETS.map((preset) => (
                      <button
                        key={`preset-${preset.name}`}
                        type="button"
                        onClick={() => handlePickPresetImage(preset.url)}
                        className="p-1 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center gap-2 transition"
                      >
                        <img src={preset.url} alt={preset.name} className="w-9 h-9 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                        <span className="text-[9px] font-black tracking-tight leading-dense truncate font-sans">{preset.name}</span>
                      </button>
                    ))}
                  </div>

                  {imagesList.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-150">
                      {imagesList.map((img, idx) => (
                        <div key={`idx-new-gal-${idx}`} className="group relative h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                          <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-rose-600 text-white rounded-full transition shadow-xs"
                          >
                            ✖
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-4.5 bg-amber-400 hover:bg-amber-500 text-amber-955 font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_5px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4.5 h-4.5 text-amber-955" />
              <span>Transmit Listing Proposal Application</span>
            </button>
          </form>
        </div>
      ) : activeSubTab === 'bookings' ? (
        /* ================= BOOKINGS RESERVATIONS ZONE ================= */
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-6.5 shadow-sm text-left space-y-6">
          <div className="border-b border-rose-50 dark:border-slate-800 pb-3">
            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">OWNER RESERVATIONS LEDGER</span>
            <h3 className="text-lg font-black font-sans text-slate-900 dark:text-white mt-1">
              Active Playing Court Bookings
            </h3>
            <p className="text-[11px] text-slate-400 mt-1 font-semibold leading-relaxed">
              Accept, confirm, cancel or purge booking reservations submitted by local athletes for your managed facilities list. This updates client calendar tables dynamically.
            </p>
          </div>

          {myOwnedBookings.length === 0 ? (
            <div className="py-12 text-center border-2 border-dashed border-slate-150 dark:border-slate-800 rounded-2xl">
              <span className="text-3xl block filter grayscale mb-2">📅</span>
              <h4 className="font-extrabold text-slate-800 dark:text-slate-250 text-sm">No reservations requested yet</h4>
              <p className="text-[11px] text-slate-400 font-medium max-w-sm mx-auto mt-1">
                Direct client bookings will show up here. You can manually test this by navigating to any court on the map and requesting a reservation.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-850">
              {myOwnedBookings.map((booking) => (
                <div key={booking.id} className="py-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-md tracking-wider uppercase">
                        {booking.courtName}
                      </span>
                      <span className="text-slate-400 text-xs font-bold font-mono">
                        📅 {booking.date} · 🕒 {booking.timeSlot}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold">
                      Requested by: <strong className="text-slate-800 dark:text-slate-200">{booking.playerName}</strong>
                    </p>
                    {booking.notes && (
                      <p className="text-[11px] text-slate-400 italic bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-150 dark:border-slate-850 font-sans font-medium">
                        "{booking.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded border ${
                      booking.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                        : booking.status === 'Cancelled'
                        ? 'bg-rose-50 text-rose-650 border-rose-250'
                        : 'bg-amber-50 text-amber-805 border-amber-250 animate-pulse'
                    }`}>
                      {booking.status}
                    </span>

                    {booking.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => onUpdateBookingStatus(booking.id, 'Confirmed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onUpdateBookingStatus(booking.id, 'Cancelled')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-650 border border-rose-200 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {booking.status === 'Confirmed' && (
                      <button
                        onClick={() => onUpdateBookingStatus(booking.id, 'Cancelled')}
                        className="px-3 py-1.5 bg-slate-150 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer"
                      >
                        Cancel Play
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteBooking(booking.id)}
                      className="p-2 text-rose-605 bg-rose-50 hover:bg-rose-100 rounded-lg transition shrink-0 cursor-pointer"
                      title="Purge Reservation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ================= MY COURTS LIST ZONE ================= */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 p-6 rounded-3xl text-left space-y-4">
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              📁 Managed Facilities & Venues
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              You can claiming-edit any court defined in the app below, or submit suggestions for new venues! Changes synchronized here update dynamically across client maps and check-in boards.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {courts.map((court) => (
                <div
                  key={`owner-court-card-${court.id}`}
                  className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-150 dark:border-slate-850 p-5 rounded-2xl hover:border-emerald-300 dark:hover:border-emerald-800 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-black text-emerald-800 dark:text-emerald-400 bg-emerald-100/75 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full uppercase leading-none">
                        Active Court ID: {court.id}
                      </span>
                      <span className="text-xs font-mono font-black text-slate-650 dark:text-slate-350">
                        ₱{court.rentalFee} / {court.feeUnit}
                      </span>
                    </div>

                    <div className="space-y-1 text-left">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white font-sans leading-snug">{court.name}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1 leading-none font-bold">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="truncate max-w-[280px]">{court.location}</span>
                      </p>
                    </div>

                    {/* Image thumbnails deck */}
                    {court.images && court.images.length > 0 ? (
                      <div className="flex gap-1.5 overflow-x-auto pr-1">
                        {court.images.map((img, i) => (
                          <img
                            key={`thumb-${court.id}-${i}`}
                            src={img}
                            alt=""
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-[9px] text-slate-400 italic font-medium">No custom court image thumbnails loaded.</div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleSelectEditCourt(court)}
                      className="flex-1 py-2 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-850 hover:border-emerald-300 dark:hover:border-emerald-700 border-2 border-slate-205 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      Configure Amenities & Pics
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Applications Log */}
          {myRequests.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 p-6 rounded-3xl text-left space-y-4">
              <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5 shadow-3xs">
                <Clock className="w-4.5 h-4.5 text-amber-500" /> My Proposals & Registration Progress ({myRequests.length})
              </h3>
              <div className="space-y-3">
                {myRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-4.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-medium"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 dark:text-white">{request.title}</span>
                        <span className="text-[9px] font-mono text-slate-400">· Proposed {request.submittedAt.split('T')[0]}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">{request.description}</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border text-center font-mono ${
                      request.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-250'
                        : request.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 border-rose-250'
                        : 'bg-amber-50 text-amber-800 border-amber-250 animate-pulse'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
