import React, { useState, useRef, useEffect } from 'react';
import { Court } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Map as MapIcon, Eye, ExternalLink, Settings, Sparkles } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

interface InteractiveMapProps {
  courts: Court[];
  selectedCourtId: string | null;
  onSelectCourt: (courtId: string) => void;
}

// Extract Google Maps API Key from environment config
const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && 
                    API_KEY.startsWith('AIzaSy') && 
                    API_KEY.trim().length >= 30;

export default function InteractiveMap({
  courts,
  selectedCourtId,
  onSelectCourt
}: InteractiveMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
  const [showRealMap, setShowRealMap] = useState(hasValidKey && !authFailed);
  const [activeTab, setActiveTab] = useState<'setup' | 'vector'>(hasValidKey ? 'vector' : 'setup');

  // Sync state if hasValidKey changes or auth status updates
  useEffect(() => {
    setShowRealMap(hasValidKey && !authFailed);
    if (!hasValidKey && activeTab !== 'vector') {
      setActiveTab('setup');
    }
  }, [hasValidKey, authFailed]);

  // Trap runtime Google Maps authentication failure (InvalidKeyMapError, etc)
  useEffect(() => {
    const originalAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.warn("Google Maps API authentication failed.");
      setAuthFailed(true);
      setShowRealMap(false);
      setActiveTab('setup');
      if (originalAuthFailure) {
        try {
          originalAuthFailure();
        } catch (e) {
          console.error(e);
        }
      }
    };
    return () => {
      (window as any).gm_authFailure = originalAuthFailure;
    };
  }, []);

  // Escape key listener for fullscreen exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Bounding box coordinates for Dumaguete region
  const minLat = 9.25;
  const maxLat = 9.38;
  const minLon = 123.22;
  const maxLon = 123.33;

  // Convert coords to map percentage
  const getCoords = (lat: number, lon: number) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  // State & Refs for Drag-to-Pan & Zoom controls (for the custom vector map fallback)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  
  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const lastTapRef = useRef<number>(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only drag with left click
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...panOffset };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      hasMovedRef.current = true;
    }

    setPanOffset({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setPanOffset({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      hasMovedRef.current = false;
      dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStartRef.current = { ...panOffset };

      const now = Date.now();
      if (now - lastTapRef.current < 280) {
        handleReset();
      }
      lastTapRef.current = now;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    
    if (Math.abs(dx) > 6 || Math.abs(dy) > 6) {
      hasMovedRef.current = true;
    }

    if (e.cancelable) {
      e.preventDefault();
    }

    setPanOffset({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(3.5, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(1, prev - 0.25));
  };

  const selectedCourtGlobal = courts.find(c => c.id === selectedCourtId);

  // Split UI between Google Maps and Vector Map fallback
  return (
    <div className={`transition-all duration-300 relative ${
      isFullscreen
        ? 'fixed inset-0 z-[90] w-screen h-screen bg-slate-950 overflow-hidden'
        : 'w-full h-[400px] md:h-[480px] bg-slate-950 border-2 border-emerald-500/40 rounded-3xl overflow-hidden shadow-xl group/map'
    }`}>

      {/* RENDER MODE A: LIVE GOOGLE MAPS ACTIVE */}
      {hasValidKey && showRealMap ? (
        <div className="w-full h-full relative" id="live-google-map-node">
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={{ lat: 9.3075, lng: 123.3012 }}
              defaultZoom={13}
              mapId="DUMAGUETE_MAP_MAIN"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              gestureHandling={'cooperative'}
              disableDefaultUI={false}
            >
              {courts.map((court) => {
                const isSelected = selectedCourtId === court.id;
                return (
                  <AdvancedMarker
                    key={`google-marker-${court.id}`}
                    position={{ lat: court.latitude, lng: court.longitude }}
                    onClick={() => onSelectCourt(court.id)}
                    title={court.name}
                  >
                    {/* Clear custom dimensions to prevent zero sizing (CF3) */}
                    <div style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="cursor-pointer">
                      <div
                        className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 shadow-md ${
                          isSelected
                            ? 'w-10 h-10 bg-emerald-500 text-white border-2 border-white scale-110 shadow-lg shadow-emerald-400'
                            : 'w-9 h-9 bg-white text-emerald-700 border-2 border-emerald-300 hover:bg-emerald-50'
                        }`}
                      >
                        <span className="text-sm font-bold">
                          {court.id === 'the-ryze' ? '🏆' : court.id === 'su-gym' ? '🎓' : court.id === 'valencia-municipal' ? '⛰️' : court.id === 'rizal-blvd' ? '🌊' : '📍'}
                        </span>
                      </div>
                    </div>
                  </AdvancedMarker>
                );
              })}

              {selectedCourtGlobal && (
                <InfoWindow
                  position={{ lat: selectedCourtGlobal.latitude, lng: selectedCourtGlobal.longitude }}
                  onCloseClick={() => onSelectCourt('')}
                  pixelOffset={[0, -20]}
                >
                  <div className="p-2 max-w-[200px] text-slate-900 bg-white dark:bg-slate-950 rounded-xl space-y-1 font-sans">
                    <div className="font-black text-xs leading-tight text-slate-950 dark:text-white truncate">{selectedCourtGlobal.name}</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">
                      {selectedCourtGlobal.courtCount} {selectedCourtGlobal.courtCount > 1 ? 'Courts' : 'Court'} · {selectedCourtGlobal.type}
                    </div>
                    <div className="text-[9px] text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
                      {selectedCourtGlobal.location}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-[9px] text-slate-600 dark:text-slate-350 font-bold border-t border-slate-100 dark:border-slate-800 pt-1.5">
                      <span>₱{selectedCourtGlobal.rentalFee}/{selectedCourtGlobal.feeUnit}</span>
                      {selectedCourtGlobal.lights && <span className="text-emerald-600 font-extrabold">● LIGHTS</span>}
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>

          {/* Quick toggle bar on top of live map */}
          <div className="absolute top-4 right-4 z-40 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-xs text-white shadow-xl flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              Live Google map Active
            </span>
            <button
              onClick={() => setShowRealMap(false)}
              className="text-[9px] font-bold text-slate-300 hover:text-white underline cursor-pointer uppercase tracking-wider"
            >
              Use Vector Map
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-[10px] text-slate-300 hover:text-white transition"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ) : (

        /* RENDER MODE B: CONFIGURATION SPLASH / VECTOR FALLBACK PANEL */
        <div className="w-full h-full relative flex flex-col">
          {/* Header navigation bar to toggle between Interactive Setup and the Vector Map Preview */}
          <div className="absolute top-3 left-3 right-3 z-30 bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white">
              <MapIcon className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold tracking-wide">Pickletown Geographic Engine</span>
            </div>
            
            <div className="flex items-center gap-1.5 bg-slate-950 p-0.5 rounded-lg border border-slate-805">
              <button
                onClick={() => setActiveTab('setup')}
                className={`px-3 py-1 text-[9px] uppercase font-black tracking-wider rounded-md transition-colors cursor-pointer ${
                  activeTab === 'setup'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔌 Connect Real Map
              </button>
              <button
                onClick={() => setActiveTab('vector')}
                className={`px-3 py-1 text-[9px] uppercase font-black tracking-wider rounded-md transition-colors cursor-pointer ${
                  activeTab === 'vector'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🗺️ Local Vector Map
              </button>
            </div>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 text-slate-400 hover:text-white transition"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Sub Tab Panel A: Interactive API key instructions */}
          {activeTab === 'setup' && (
            <div className="flex-1 flex items-center justify-center p-6 pt-16 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white min-h-full overflow-y-auto" id="maps-splash-screen">
              <div className="max-w-md w-full text-center space-y-5 bg-slate-900/70 p-6 md:p-8 rounded-3xl border border-emerald-500/20 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 -mr-6 -mt-6 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                
                {authFailed && (
                  <div className="text-left bg-rose-500/10 border border-rose-500/30 text-rose-200 p-4 rounded-2xl text-[11px] leading-relaxed relative overflow-hidden backdrop-blur-md mb-2">
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-12 h-12 bg-rose-500/10 rounded-full blur-lg pointer-events-none" />
                    <strong className="text-rose-400 block font-black text-xs uppercase tracking-wide mb-1">⚠️ API Auth Failure Detected</strong>
                    Your Google Maps API key failed to validate inside the browser (<code className="bg-rose-950/70 text-rose-300 font-mono px-1 py-0.5 rounded">InvalidKeyMapError</code>). Please check:
                    <ul className="list-disc pl-4 mt-1.5 space-y-1 text-slate-300 font-medium">
                      <li>The key has not been deleted or deactivated.</li>
                      <li>The <strong className="text-white">Maps JavaScript API</strong> is enabled in your GCP project.</li>
                      <li>The referrer restrictions on the key allow this development URL.</li>
                    </ul>
                  </div>
                )}

                <div className="inline-flex p-3.5 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 rounded-2xl shadow-inner animate-pulse">
                  <Sparkles className="w-6 h-6" />
                </div>
                
                <div className="space-y-1.5">
                  <h3 className="text-sm font-black uppercase tracking-wider text-emerald-400">Live Google Maps Required</h3>
                  <p className="text-[11px] text-slate-300 leading-relaxed max-w-sm mx-auto">
                    Configure your key to unlock live street views, satellite terrain, high-fidelity pins, and real location data for PickleTown 6200.
                  </p>
                </div>

                {/* Styled Step-by-Step Instructions */}
                <div className="text-left bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3.5 text-[11px]">
                  <div className="flex gap-2 text-slate-350">
                    <span className="flex-shrink-0 w-5 h-5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-md flex items-center justify-center font-bold font-mono text-[10px]">1</span>
                    <p className="leading-relaxed scale-95 origin-left">
                      <a 
                        href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline font-extrabold inline-flex items-center gap-0.5"
                      >
                        Acquire a Maps API Key <ExternalLink className="w-3 h-3" />
                      </a> from Google Cloud Platform.
                    </p>
                  </div>

                  <div className="flex gap-2 text-slate-350">
                    <span className="flex-shrink-0 w-5 h-5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-md flex items-center justify-center font-bold font-mono text-[10px]">2</span>
                    <p className="leading-relaxed scale-95 origin-left">
                      Click the <strong className="text-slate-100 font-bold uppercase font-mono bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-[10px]">Settings ⚙️ gear icon</strong> in the top-right toolbar of Google AI Studio.
                    </p>
                  </div>

                  <div className="flex gap-2 text-slate-350">
                    <span className="flex-shrink-0 w-5 h-5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-md flex items-center justify-center font-bold font-mono text-[10px]">3</span>
                    <p className="leading-relaxed scale-95 origin-left">
                      Select <strong className="text-slate-100">Secrets</strong>, add a secret named <code className="text-emerald-300 font-black tracking-wide font-mono select-all bg-emerald-950 px-1 py-0.5 rounded">GOOGLE_MAPS_PLATFORM_KEY</code>, paste your API key, and press Enter.
                    </p>
                  </div>

                  <div className="flex gap-2 text-slate-350">
                    <span className="flex-shrink-0 w-5 h-5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 rounded-md flex items-center justify-center font-bold font-mono text-[10px]">4</span>
                    <p className="leading-relaxed scale-95 origin-left">
                      The container will build the live app automatically. No reload is needed.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => setActiveTab('vector')}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase text-[10px] tracking-widest rounded-xl transition duration-150 flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/15 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Launch offline vector map backup instead
                  </button>
                  
                  {hasValidKey && (
                    <button
                      onClick={() => setShowRealMap(true)}
                      className="w-full py-2 border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:text-white font-bold uppercase text-[9px] tracking-wider rounded-xl transition cursor-pointer"
                    >
                      🧪 API Key detected! Click to force launch Live Google Map
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sub Tab Panel B: Custom responsive vector mapsfallback visualization */}
          {activeTab === 'vector' && (
            <div className="flex-1 w-full h-full relative overflow-hidden select-none bg-emerald-950/10">
              {/* Parallax grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-[0.06] transition-opacity duration-300" />

              {/* Vector zoom controls overlay */}
              <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-lg backdrop-blur-md">
                <button
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition cursor-pointer font-bold border-b border-slate-800"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition cursor-pointer font-bold border-b border-slate-800"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={handleReset}
                  title="Recenter Map"
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition cursor-pointer font-bold"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Informative notification banner urging to configure live maps */}
              <div className="absolute bottom-4 left-20 z-10 hidden md:flex items-center gap-2 bg-amber-500/95 backdrop-blur-sm border border-amber-400/30 text-slate-950 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-xl animate-bounce">
                <span>💡 Maps could look better! Connect your live key today</span>
                <button
                  onClick={() => setActiveTab('setup')}
                  className="underline bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full hover:bg-slate-900 transition font-black"
                >
                  Configure
                </button>
              </div>

              {/* Pannable & Zoomable content wrapper containing SVG backgrounds + Markers */}
              <div
                className="w-full h-full relative"
                style={{
                  transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onDoubleClick={handleReset}
              >
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Ocean Coastline layout */}
                  <path
                    d="M 100,0 L 78,0 Q 74,20 79,40 Q 84,65 76,80 Q 70,95 72,100 L 100,100 Z"
                    fill="#1e293b"
                    opacity="0.9"
                  />
                  <path
                    d="M 78,0 Q 74,20 79,40 Q 84,65 76,80 Q 70,95 72,100"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                    opacity="0.4"
                  />

                  {/* Mountains */}
                  <g stroke="#047857" strokeWidth="0.6" fill="#064e3b" opacity="0.3">
                    <path d="M 0,90 L 12,70 L 25,85 L 35,68 L 50,95 Z" />
                    <text x="12" y="62" fill="#10b981" fontSize="2.8" fontFamily="sans-serif" fontWeight="900">MT. TALINIS RANGE</text>
                  </g>

                  {/* Connecting Roads */}
                  <path
                    d="M 74,0 L 71,20 Q 74,40 73,55 L 70,82 L 67,100"
                    fill="none"
                    stroke="#475569"
                    strokeWidth="0.8"
                    opacity="0.6"
                  />
                  <path
                    d="M 73,55 Q 52,60 38,62 Q 22,65 10,75"
                    fill="none"
                    stroke="#334155"
                    strokeWidth="0.7"
                    opacity="0.6"
                    strokeDasharray="1.5 1.5"
                  />

                  {/* Geographical Landmarks */}
                  <g fill="#94a3b8" fontSize="2.5" fontFamily="sans-serif" fontWeight="950" opacity="0.45">
                    <text x="81" y="55" transform="rotate(75, 81, 55)" fill="#60a5fa">TAÑON STRAIT</text>
                    <text x="56" y="28">SIBULAN (6201)</text>
                    <text x="50" y="50">BAGACAY</text>
                    <text x="52" y="70">DUMAGUETE CITY (6200)</text>
                    <text x="14" y="82">VALENCIA (6215)</text>
                  </g>
                </svg>

                {/* Absolute markers placing over vector background */}
                <div className="absolute inset-0 pointer-events-none">
                  {courts.map((court) => {
                    const { x, y } = getCoords(court.latitude, court.longitude);
                    const isSelected = selectedCourtId === court.id;

                    return (
                      <button
                        key={`vector-btn-${court.id}`}
                        onClick={(e) => {
                          if (hasMovedRef.current) {
                            e.preventDefault();
                            return;
                          }
                          onSelectCourt(court.id);
                        }}
                        onDoubleClick={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 outline-none"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        id={`vector-node-${court.id}`}
                      >
                        {/* Pin style layout (minimum sizes mapped to prevent collapse CF3) */}
                        <div style={{ width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div
                            className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 ${
                              isSelected
                                ? 'w-10 h-10 bg-emerald-500 text-white border-2 border-white scale-110 shadow-lg shadow-emerald-400'
                                : 'w-9 h-9 bg-slate-900 border border-emerald-500/30 text-emerald-400 hover:bg-slate-800'
                            }`}
                          >
                            <span className="text-sm font-bold">
                              {court.id === 'the-ryze' ? '🏆' : court.id === 'su-gym' ? '🎓' : court.id === 'valencia-municipal' ? '⛰️' : court.id === 'rizal-blvd' ? '🌊' : '📍'}
                            </span>

                            {/* Popover Card */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 bg-slate-900 border border-slate-800 rounded-2xl p-3.5 shadow-2xl min-w-[190px] max-w-[210px] z-30 pointer-events-none text-left opacity-0 translate-y-2 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-300 ease-out">
                              <div className="font-sans font-black text-white text-[11px] leading-tight truncate">{court.name}</div>
                              <div className="text-[9px] text-emerald-400 mt-0.5 tracking-wider font-extrabold uppercase">
                                {court.courtCount} {court.courtCount > 1 ? 'COURTS' : 'COURT'} · {court.type}
                              </div>
                              <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 font-bold border-t border-slate-800 pt-1.5">
                                <span>{court.rentalFee === 0 ? 'Free entry' : `₱${court.rentalFee}/${court.feeUnit}`}</span>
                                {court.lights && <span className="text-emerald-400">● LED Lights</span>}
                              </div>
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-800 rotate-45" />
                            </div>

                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Simple Vector Map Legend Overlay */}
              <div className="absolute bottom-3 right-3 bg-slate-950/95 border border-slate-800 rounded-2xl p-3 max-w-[160px] text-[9px] space-y-1.5 shadow-xl backdrop-blur-md text-slate-300 pointer-events-none">
                <div className="font-bold text-emerald-400 tracking-wider uppercase">MAP LEGEND</div>
                <div className="flex items-center gap-2">
                  <span>🏆</span>
                  <span className="text-slate-400 font-bold truncate">The Ryze (Indoor)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌊</span>
                  <span className="text-slate-400 font-bold truncate">Rizal Blvd (Public)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⛰️</span>
                  <span className="text-slate-400 font-bold truncate">Valencia Dome</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
