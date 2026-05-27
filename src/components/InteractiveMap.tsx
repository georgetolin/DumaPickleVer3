import React, { useState, useRef } from 'react';
import { Court } from '../types';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface InteractiveMapProps {
  courts: Court[];
  selectedCourtId: string | null;
  onSelectCourt: (courtId: string) => void;
}

export default function InteractiveMap({
  courts,
  selectedCourtId,
  onSelectCourt
}: InteractiveMapProps) {
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

  // State & Refs for Drag-to-Pan & Zoom controls
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
    
    // Set dragged flag if cursor is moved deliberately
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

      // Double-touch tap-to-reset Auto-Center check
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

    // Prevent default scroll behavior when dragging across the map container
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

  return (
    <div className="relative w-full h-[380px] md:h-[450px] bg-emerald-50/40 border-2 border-emerald-150 rounded-3xl overflow-hidden shadow-sm group/map select-none">
      {/* Background Grid Pattern - stationary for elegant parallax grid blueprint look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#a7f3d0_1px,transparent_1px),linear-gradient(to_bottom,#a7f3d0_1px,transparent_1px)] bg-[size:24px_24px] opacity-25 pointer-events-none" />

      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-4.5 py-2 rounded-full border-2 border-emerald-100 text-xs text-emerald-900 font-extrabold shadow-md tracking-wide flex items-center gap-2">
        <span>📍 Map: Dumaguete & Valencia (6200 Region)</span>
        <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-50 text-[10px] text-emerald-700 border border-emerald-200">Drag to Pan</span>
      </div>

      {/* Zoom and Re-center controls overlay */}
      <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1.5 bg-white/95 border-2 border-emerald-100 rounded-2xl p-1 shadow-lg backdrop-blur-md">
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-800 transition-colors flex items-center justify-center cursor-pointer font-bold border-b border-slate-100"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-800 transition-colors flex items-center justify-center cursor-pointer font-bold border-b border-slate-100"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          title="Recenter Map"
          className="p-1.5 hover:bg-emerald-50 rounded-lg text-emerald-800 transition-colors flex items-center justify-center cursor-pointer font-bold"
        >
          <RotateCcw className="w-4 h-4" />
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
          {/* Ocean/Tañon Strait on the east/right side */}
          <path
            d="M 100,0 L 78,0 Q 74,20 79,40 Q 84,65 76,80 Q 70,95 72,100 L 100,100 Z"
            fill="#bfdbfe"
            opacity="0.8"
            className="transition-colors duration-300"
          />

          {/* Ocean Coastline Highlight */}
          <path
            d="M 78,0 Q 74,20 79,40 Q 84,65 76,80 Q 70,95 72,100"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />

          {/* Mt. Talinis Mountains vector in the South-West / bottom-left corner */}
          <g stroke="#10b981" strokeWidth="0.8" fill="#d1fae5" opacity="0.6">
            <path d="M 0,90 L 12,70 L 25,85 L 35,68 L 50,95 Z" />
            <path d="M 5,95 L 18,78 L 28,92 Z" />
            {/* Valencia Highland label */}
            <text x="12" y="62" fill="#047857" fontSize="2.8" fontFamily="sans-serif" fontWeight="900">MT. TALINIS RANGE</text>
          </g>

          {/* Major Roads / Connecting Highways */}
          {/* Coastal Highway (North-South through Dumaguete) */}
          <path
            d="M 74,0 L 71,20 Q 74,40 73,55 L 70,82 L 67,100"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            opacity="0.85"
          />

          {/* Valencia Highlands Road branching off Westward */}
          <path
            d="M 73,55 Q 52,60 38,62 Q 22,65 10,75"
            fill="none"
            stroke="#64748b"
            strokeWidth="1.0"
            opacity="0.8"
            strokeDasharray="1.5 1.5"
          />

          {/* Sibulan Bypass northward */}
          <path
            d="M 71,20 Q 58,15 48,5"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="0.9"
            opacity="0.7"
          />

          {/* Geographical City Landmarks text labels */}
          <g fill="#334155" fontSize="2.5" fontFamily="sans-serif" fontWeight="900" opacity="0.75">
            <text x="79" y="55" transform="rotate(75, 79, 55)" fill="#1e40af">TAÑON STRAIT</text>
            <text x="56" y="28">SIBULAN</text>
            <text x="50" y="50">BAGACAY</text>
            <text x="52" y="70">DUMAGUETE CITY</text>
            <text x="14" y="82">VALENCIA</text>
          </g>

          {/* Interactive Connections between selected nodes */}
          {courts.map((court) => {
            if (court.id !== selectedCourtId) return null;
            const { x, y } = getCoords(court.latitude, court.longitude);
            return (
              <g key={`connection-${court.id}`} opacity="0.5">
                {/* Highlight radar ripple */}
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="0.8"
                  className="animate-pingOriginOrigin"
                  style={{ transformOrigin: `${x}% ${y}%`, animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}
                />
              </g>
            );
          })}
        </svg>

        {/* Markers placed over top via Absolute HTML coordinates so they are pixel perfect and robust */}
        <div className="absolute inset-0 pointer-events-none">
          {courts.map((court) => {
            const { x, y } = getCoords(court.latitude, court.longitude);
            const isSelected = selectedCourtId === court.id;

            return (
              <button
                key={court.id}
                onClick={(e) => {
                  if (hasMovedRef.current) {
                    e.preventDefault();
                    return;
                  }
                  onSelectCourt(court.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                }}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-20 outline-none"
                style={{ left: `${x}%`, top: `${y}%` }}
                id={`map-node-${court.id}`}
              >
                {/* Pin Outer Ring */}
                <div
                  className={`relative flex items-center justify-center rounded-2xl transition-all duration-300 ${
                    isSelected
                      ? 'w-11 h-11 bg-emerald-500 text-white border-4 border-white scale-110 shadow-lg shadow-emerald-250'
                      : 'w-9 h-9 bg-white text-emerald-600 hover:text-white border-2 border-emerald-200 hover:bg-emerald-500 hover:border-emerald-500 hover:scale-105 hover:shadow-md'
                  }`}
                >
                  {/* Visual Icon */}
                  <span className="text-sm font-bold">
                    {court.id === 'the-ryze' ? '🏆' : court.id === 'su-gym' ? '🎓' : court.id === 'valencia-municipal' ? '⛰️' : court.id === 'rizal-blvd' ? '🌊' : '📍'}
                  </span>

                  {/* Popover Card on Hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-white border-2 border-emerald-100 rounded-2xl p-3.5 shadow-2xl min-w-[180px] max-w-[220px] z-30 pointer-events-none text-left">
                    <div className="font-sans font-black text-slate-900 text-[11px] leading-tight truncate">{court.name}</div>
                    <div className="text-[9px] text-emerald-600 mt-0.5 tracking-wider font-extrabold uppercase">
                      {court.courtCount} {court.courtCount > 1 ? 'COURTS' : 'COURT'} · {court.type}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-500 font-bold border-t border-slate-50 pt-1.5">
                      <span>{court.rentalFee === 0 ? 'Free entry' : `₱${court.rentalFee}/${court.feeUnit}`}</span>
                      {court.lights && <span className="text-emerald-600">● LED Lights</span>}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend overlay */}
      <div className="absolute bottom-4 right-4 bg-white/95 border-2 border-emerald-100 rounded-3xl p-4.5 max-w-[210px] text-[10px] space-y-2 shadow-xl backdrop-blur-md text-slate-700">
        <div className="font-bold text-emerald-950 font-sans tracking-wide uppercase">PIN LEGEND</div>
        <div className="flex items-center gap-2">
          <span>🏆</span>
          <span className="text-slate-600 font-bold">The Ryze (Covered Pro)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🌊</span>
          <span className="text-slate-600 font-bold">Rizal Blvd (Public)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⛰️</span>
          <span className="text-slate-600 font-bold">Valencia (Cool Dome)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🎓</span>
          <span className="text-slate-600 font-bold">Silliman Gym (Indoor)</span>
        </div>
      </div>
    </div>
  );
}
