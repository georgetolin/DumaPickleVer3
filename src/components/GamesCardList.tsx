import React, { useState } from 'react';
import { Game, Court, Player } from '../types';
import { Calendar, Users, ShieldAlert, Plus, DoorOpen, HelpCircle } from 'lucide-react';

interface GamesCardListProps {
  games: Game[];
  courts: Court[];
  currentUserProfile: Player;
  onJoinGame: (gameId: string) => void;
  onLeaveGame: (gameId: string) => void;
  onCreateGame: (newGame: Omit<Game, 'id' | 'currentPlayers' | 'hostId' | 'hostName' | 'hostLevel'>) => void;
}

export default function GamesCardList({
  games,
  courts,
  currentUserProfile,
  onJoinGame,
  onLeaveGame,
  onCreateGame
}: GamesCardListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('All');
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [formError, setFormError] = useState<string | null>(null);

  // New Game Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCourtId, setFormCourtId] = useState(courts[0]?.id || '');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('17:00 - 19:00');
  const [formMaxPlayers, setFormMaxPlayers] = useState(4);
  const [formType, setFormType] = useState<'Singles' | 'Doubles' | 'Mixed Doubles' | 'Open Play' | 'Social Mixer'>('Doubles');
  const [formLevel, setFormLevel] = useState<'All Levels' | 'Beginner (<3.0)' | 'Intermediate (3.0-4.0)' | 'Advanced (4.0+)'>('All Levels');

  const filteredGames = games.filter((g) => {
    const matchesType = filterType === 'All' || g.type === filterType;
    const matchesLevel = filterLevel === 'All' || g.levelRequirement === filterLevel;
    return matchesType && matchesLevel;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setFormError('Validation Deficit: Please fill out a descriptive game title.');
      return;
    }
    setFormError(null);
    const selectedCourt = courts.find(c => c.id === formCourtId);
    if (!selectedCourt) return;

    onCreateGame({
      courtId: formCourtId,
      courtName: selectedCourt.name,
      title: formTitle,
      date: formDate || new Date().toISOString().split('T')[0],
      time: formTime,
      maxPlayers: Number(formMaxPlayers),
      type: formType,
      levelRequirement: formLevel
    });

    // Reset Form
    setFormTitle('');
    setFormDate('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Game Type Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mb-1.5">Game Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white border-2 border-slate-200 text-slate-700 rounded-xl px-4.5 py-2 text-xs outline-none focus:border-emerald-500 font-sans font-bold shadow-sm"
            >
              <option value="All">All Types</option>
              <option value="Singles">Singles</option>
              <option value="Doubles">Doubles</option>
              <option value="Mixed Doubles">Mixed Doubles</option>
              <option value="Open Play">Open Play</option>
              <option value="Social Mixer">Social Mixer</option>
            </select>
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-450 mb-1.5">Skill Tier</label>
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="bg-white border-2 border-slate-200 text-slate-700 rounded-xl px-4.5 py-2 text-xs outline-none focus:border-emerald-500 font-sans font-bold shadow-sm"
            >
              <option value="All">All Skill Levels</option>
              <option value="All Levels">Open to All</option>
              <option value="Beginner (<3.0)">Beginner (&lt;3.0)</option>
              <option value="Intermediate (3.0-4.0)">Intermediate (3.0-4.0)</option>
              <option value="Advanced (4.0+)">Advanced (4.0+)</option>
            </select>
          </div>
        </div>

        {/* Create Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-500 text-amber-955 text-xs font-black rounded-full shadow-[0_4px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all shrink-0 font-sans cursor-pointer uppercase tracking-wider"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Organize Game Slot</span>
        </button>
      </div>

      {/* Sessions Grid */}
      {filteredGames.length === 0 ? (
        <div className="bg-white border-2 border-emerald-100 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <Calendar className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-slate-800 font-black font-sans text-lg">No active matches registered</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed font-medium">
            Be the first to arrange a match on Rizal Blvd beachfront, Silliman Gym, or the cool Valencia highlands dome.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 text-xs text-emerald-600 font-extrabold border-b-2 border-emerald-600 hover:text-emerald-700 transition-all font-sans uppercase tracking-wider cursor-pointer"
          >
            Create A Public Match →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredGames.map((game) => {
            const isUserJoined = game.currentPlayers.some(p => p.id === currentUserProfile.id);
            const isFull = game.currentPlayers.length >= game.maxPlayers;
            const spotsRemaining = game.maxPlayers - game.currentPlayers.length;

            return (
              <div
                key={game.id}
                className={`bg-white border-2 rounded-3xl p-6.5 hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-6 ${
                  isUserJoined ? 'border-emerald-400 bg-emerald-50/15' : 'border-slate-150'
                }`}
              >
                {/* Header detail */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-1.5 text-[10px] font-black leading-none">
                    <span className="text-emerald-6050 uppercase tracking-wider">● {game.type}</span>
                    <span className="text-slate-400 uppercase font-bold tracking-wide">{game.time}</span>
                  </div>

                  <h3 className="text-md font-black font-sans text-slate-900 leading-tight tracking-tight">
                    {game.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-bold truncate">
                    📍 {game.courtName}
                  </p>
                </div>

                {/* Organizer Info & Players Roster */}
                <div className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100/70">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-450 font-black text-[9px] uppercase tracking-wider">ORGANIZER</span>
                    <span className="text-slate-700 font-sans font-extrabold">
                      {game.hostName} <span className="text-emerald-700 font-mono text-[10px] font-black">({game.hostLevel.toFixed(1)})</span>
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[9px] font-black text-slate-450 uppercase tracking-wider">
                      <span>ENTRANTS ({game.currentPlayers.length}/{game.maxPlayers})</span>
                      <span className={isFull ? 'text-rose-600' : 'text-emerald-700'}>
                        {isFull ? 'FULL LOBBY' : `${spotsRemaining} SLOT${spotsRemaining === 1 ? '' : 'S'} LEFT`}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {game.currentPlayers.map((player) => (
                        <span
                          key={`${game.id}-p-${player.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold shadow-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span>{player.name}</span>
                          <span className="text-[9px] font-black font-mono text-emerald-600/60">({player.level.toFixed(1)})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Control Footer */}
                <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4.5">
                  <div className="text-[10px] font-bold leading-none">
                    <div className="text-slate-400 text-[9px] uppercase tracking-wider">SKILL TIERS</div>
                    <div className="text-slate-800 font-black mt-1 text-xs">{game.levelRequirement}</div>
                  </div>

                  {isUserJoined ? (
                    <button
                      onClick={() => onLeaveGame(game.id)}
                      className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Leave Lobby
                    </button>
                  ) : (
                    <button
                      onClick={() => onJoinGame(game.id)}
                      disabled={isFull}
                      className={`px-5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
                        isFull
                          ? 'bg-slate-100 text-slate-405 border-slate-200 cursor-not-allowed'
                          : 'bg-amber-400 hover:bg-amber-500 text-amber-955 border-amber-400 shadow-[0_2.5px_0_0_#d97706] active:translate-y-0.5 active:shadow-none'
                      }`}
                    >
                      {isFull ? 'Lobby Full' : 'Join Matchup'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Host Match Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-emerald-100 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in duration-200 text-slate-8050">
            <div className="bg-slate-50 px-6 py-4 border-b border-light-slate-150 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-sans">Organize A Host Game</h3>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Let players near Dumaguete join your scheduled game slot</p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setFormError(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold font-mono p-1 border border-transparent hover:border-slate-200 rounded cursor-pointer"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {formError && (
                <div id="games-submission-error-banner" className="p-3.5 bg-rose-50 border-2 border-rose-150 text-rose-800 text-[11px] rounded-2xl flex items-start gap-2 animate-bounce font-sans font-black">
                  <span className="shrink-0 text-xs">⚠️</span>
                  <span className="leading-tight">{formError}</span>
                </div>
              )}
              {/* Form Title */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Game Description Label</label>
                <input
                  type="text"
                  placeholder="e.g., Friday Doubles / Blvd Sunsets Rally"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 placeholder-slate-400 font-sans transition-all"
                  required
                />
              </div>

              {/* Court Selection */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Select A Court</label>
                <select
                  value={formCourtId}
                  onChange={(e) => setFormCourtId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-sans font-bold"
                >
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>
                      {court.name} ({court.courtCount} cts · {court.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Specify Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-7050 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Session Timing</label>
                  <input
                    type="text"
                    placeholder="e.g., 17:00 - 19:00"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-750 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-mono font-bold"
                    required
                  />
                </div>
              </div>

              {/* Format Dropdowns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-1.5">Match Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-sans font-bold"
                  >
                    <option value="Singles">Singles</option>
                    <option value="Doubles">Doubles</option>
                    <option value="Mixed Doubles">Mixed Doubles</option>
                    <option value="Open Play">Open Play</option>
                    <option value="Social Mixer">Social Mixer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-1.5">Player Slots (Max)</label>
                  <input
                    type="number"
                    min={2}
                    max={16}
                    value={formMaxPlayers}
                    onChange={(e) => setFormMaxPlayers(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-200 text-slate-800 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Skill requirements */}
              <div>
                <label className="block text-[10px] font-black text-slate-455 uppercase tracking-widest mb-1.5">Skill Tier Requirement</label>
                <select
                  value={formLevel}
                  onChange={(e) => setFormLevel(e.target.value as any)}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-sans font-bold"
                >
                  <option value="All Levels">All Levels (Great for mixing!)</option>
                  <option value="Beginner (<3.0)">Beginner Rec (&lt;3.0)</option>
                  <option value="Intermediate (3.0-4.0)">Intermediate (3.0 - 4.0)</option>
                  <option value="Advanced (4.0+)">Advanced Competitive (4.0+)</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormError(null);
                  }}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-600 text-xs font-black rounded-full transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-amber-955 text-xs font-black rounded-full shadow-[0_4px_0_0_#d97706] active:translate-y-0.5 active:shadow-none transition-all font-sans cursor-pointer uppercase tracking-wider"
                >
                  Publish Match Lobby
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
