import React, { useState } from 'react';
import { Player, MatchResult, Court } from '../types';
import { Search, Trophy, TrendingUp, Calendar, ArrowRight, UserCheck, Star, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface RankingsLeaderboardProps {
  players: Player[];
  courts: Court[];
  recentMatches: MatchResult[];
  onSubmitMatch: (match: Omit<MatchResult, 'id' | 'submittedAt'>) => void;
  currentProfileName: string;
  duprHistory: any[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-xl space-y-1 text-left">
        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider">{data.date}</p>
        <p className="text-xs font-black text-slate-900 dark:text-slate-100">DUPR: {data.rating.toFixed(2)}</p>
        {data.opponent && (
          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
            vs {data.opponent}
          </p>
        )}
        {data.result && (
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${data.result === 'Win' ? 'bg-emerald-500' : data.result === 'Loss' ? 'bg-rose-500' : 'bg-slate-400'}`} />
            <span className={`text-[9px] font-black uppercase ${data.result === 'Win' ? 'text-emerald-600 dark:text-emerald-450' : data.result === 'Loss' ? 'text-rose-600 dark:text-rose-450' : 'text-slate-400'}`}>
              {data.result} {data.score && data.score !== 'N/A' && `(${data.score})`}
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function RankingsLeaderboard({
  players,
  courts,
  recentMatches,
  onSubmitMatch,
  currentProfileName,
  duprHistory
}: RankingsLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Find player trend statistics
  const startRating = duprHistory && duprHistory.length > 0 ? duprHistory[0].rating : 3.50;
  const currentRating = duprHistory && duprHistory.length > 0 ? duprHistory[duprHistory.length - 1].rating : 3.50;
  const duprChange = currentRating - startRating;

  // Match submission state
  const [formCourtId, setFormCourtId] = useState(courts[0]?.id || '');
  const [winner1Id, setWinner1Id] = useState(players[0]?.id || '');
  const [winner2Id, setWinner2Id] = useState(''); // Optional partner
  const [loser1Id, setLoser1Id] = useState(players[1]?.id || '');
  const [loser2Id, setLoser2Id] = useState(''); // Optional partner
  const [scoreSet1Winner, setScoreSet1Winner] = useState('11');
  const [scoreSet1Loser, setScoreSet1Loser] = useState('8');
  const [scoreSet2Winner, setScoreSet2Winner] = useState('');
  const [scoreSet2Loser, setScoreSet2Loser] = useState('');

  // Sorted Leaderboard
  const sortedPlayers = [...players]
    .sort((a, b) => b.duprRating - a.duprRating)
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (p.hometown && p.hometown.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesGender = genderFilter === 'All' || p.gender === genderFilter;
      return matchesSearch && matchesGender;
    });

  const handleSubmitResult = (e: React.FormEvent) => {
    e.preventDefault();

    if (winner1Id === loser1Id || (winner2Id && winner2Id === loser2Id) || winner1Id === loser2Id) {
      alert('Players cannot play against themselves! Please select unique players.');
      return;
    }

    const selectedCourt = courts.find(c => c.id === formCourtId);
    if (!selectedCourt) return;

    // Formatting Score text
    let finalScore = `${scoreSet1Winner}-${scoreSet1Loser}`;
    if (scoreSet2Winner && scoreSet2Loser) {
      finalScore += `, ${scoreSet2Winner}-${scoreSet2Loser}`;
    }

    const winnerNames = [players.find(p => p.id === winner1Id)?.name || ''];
    const winnerIds = [winner1Id];
    if (winner2Id) {
      winnerNames.push(players.find(p => p.id === winner2Id)?.name || '');
      winnerIds.push(winner2Id);
    }

    const loserNames = [players.find(p => p.id === loser1Id)?.name || ''];
    const loserIds = [loser1Id];
    if (loser2Id) {
      loserNames.push(players.find(p => p.id === loser2Id)?.name || '');
      loserIds.push(loser2Id);
    }

    onSubmitMatch({
      courtId: formCourtId,
      courtName: selectedCourt.name,
      date: new Date().toISOString().split('T')[0],
      winnerIds,
      winnerNames,
      loserIds,
      loserNames,
      score: finalScore
    });

    // Reset states
    setScoreSet1Winner('11');
    setScoreSet1Loser('8');
    setScoreSet2Winner('');
    setScoreSet2Loser('');
    setWinner2Id('');
    setLoser2Id('');
    setIsSubmitModalOpen(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-slate-800">
      {/* Standings list (Main) */}
      <div className="lg:col-span-2 space-y-4">
        {/* Filter Controls & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4.5 border-2 border-slate-150 rounded-3xl shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
            <input
              type="text"
              placeholder="Search by player name or home city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-2xl pl-10 pr-4 py-2 text-xs text-slate-800 outline-none font-sans font-semibold placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-slate-50 border-2 border-slate-200 text-slate-650 rounded-2xl px-3 py-2 text-xs outline-none focus:border-emerald-400 font-sans font-bold"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-955 text-xs font-black rounded-full shadow-[0_4px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all duration-100 shrink-0 font-sans cursor-pointer uppercase tracking-wider"
            >
              <Trophy className="w-4 h-4" />
              <span>Log Match Result</span>
            </button>
          </div>
        </div>

        {/* Standings Table container */}
        <div className="bg-white border-2 border-emerald-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4.5 border-b-2 border-emerald-100 bg-emerald-50/25 flex items-center justify-between">
            <h3 className="text-sm font-sans font-black text-emerald-950 uppercase tracking-wide flex items-center gap-2">
              <Trophy className="w-5 h-5 text-emerald-650" />
              Negros Oriental DUPR Standing Ladder
            </h3>
            <span className="text-[10px] font-sans font-black text-emerald-850 uppercase tracking-widest">Active players: {sortedPlayers.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-[10px] uppercase font-bold text-slate-400 bg-slate-50">
                  <th className="py-3 px-4 text-center w-12">Rank</th>
                  <th className="py-3 px-4">Player Details</th>
                  <th className="py-3 px-4 text-center">DUPR Rating</th>
                  <th className="py-3 px-4 text-center">Wins</th>
                  <th className="py-3 px-4 text-center">Losses</th>
                  <th className="py-3 px-4 text-center">Win %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedPlayers.map((player, index) => {
                  const wins = player.wins;
                  const losses = player.losses;
                  const total = wins + losses;
                  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

                  return (
                    <tr
                      key={player.id}
                      className="hover:bg-emerald-50/20 transition-all text-xs text-slate-700"
                    >
                      {/* Rank Indicator */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {index === 0 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-250 text-xs font-black">🥇</span>
                        ) : index === 1 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-200 text-xs font-black">🥈</span>
                        ) : index === 2 ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 border-2 border-orange-205 text-xs font-black">🥉</span>
                        ) : (
                          <span className="text-slate-400 font-black">{(index + 1)}</span>
                        )}
                      </td>

                      {/* Name & Location info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${player.avatarColor || 'bg-slate-350'} flex items-center justify-center font-sans text-white font-black text-xs uppercase shadow-sm`}>
                            {player.name.substring(0, 2)}
                          </div>
                          <div>
                            <div className="font-extrabold text-slate-900">{player.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold tracking-wide">
                              📍 {player.hometown || 'Dumaguete'} · {player.gender || 'Player'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* DUPR score */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-800 font-mono font-bold text-[12px]">
                          {player.duprRating.toFixed(2)}
                        </span>
                      </td>

                      {/* Stats */}
                      <td className="py-3.5 px-4 text-center font-mono text-slate-700 font-bold">{wins}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 font-medium">{losses}</td>
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className={`font-black ${winRate >= 65 ? 'text-emerald-700' : winRate >= 45 ? 'text-slate-700' : 'text-slate-400'}`}>
                          {winRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {sortedPlayers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium italic">
                      No matching players found on the ladder. Take center court to register new competitors!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Side segment: DUPR Trend Analytics & Recent match submissions tracker */}
      <div className="space-y-6 text-slate-800 dark:text-slate-100 font-sans">
        {/* DUPR Trend Chart Card */}
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-450" />
              <div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider leading-none">
                  My DUPR Trend
                </h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1 font-bold">
                  {currentProfileName} · SINGLES/DOUBLES
                </p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-black text-emerald-700 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/45 border border-emerald-200 dark:border-emerald-900/60 px-2 py-0.5 rounded-full leading-none">
              LAST 10
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            Progression curve tracking across your ten final verified local matches.
          </p>

          <div className="h-44 w-full text-xs" style={{ minWidth: '100px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={duprHistory} margin={{ top: 5, right: 5, left: -28, bottom: 5 }}>
                <defs>
                  <linearGradient id="duprChartGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                <XAxis 
                  dataKey="matchNumber" 
                  tickLine={false} 
                  axisLine={false} 
                  stroke="#94a3b8" 
                  style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 'bold' }} 
                  tickFormatter={(v) => `#${v}`}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  axisLine={false} 
                  tickLine={false} 
                  stroke="#94a3b8" 
                  style={{ fontSize: '9px', fontFamily: 'monospace', fontWeight: 'bold' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="rating" 
                  stroke="#10b981" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#duprChartGlow)" 
                  activeDot={{ r: 5, stroke: '#10b981', strokeWidth: 1.5, fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Spark dashboard row */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50 dark:border-slate-800/60 text-left w-full">
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="block text-[8px] font-black text-slate-400 dark:text-slate-505 uppercase tracking-widest leading-none">START LEVEL</span>
              <span className="block text-xs font-black text-slate-750 dark:text-slate-300 mt-1 font-mono">{startRating.toFixed(2)}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
              <span className="block text-[8px] font-black text-slate-400 dark:text-slate-505 uppercase tracking-widest leading-none">CURRENT LEVEL</span>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-xs font-black text-emerald-650 dark:text-emerald-450 font-mono">{currentRating.toFixed(2)}</span>
                <span className={`text-[9px] font-black font-mono ${duprChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {duprChange >= 0 ? `+${duprChange.toFixed(2)}` : `${duprChange.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Board Ledger Card */}
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-5.5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b-2 border-emerald-100 dark:border-slate-800 pb-3">
            <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-450" />
              Verified Board Ledger
            </h3>
            <span className="text-[9px] font-black text-emerald-700 dark:text-emerald-450 bg-emerald-100 dark:bg-emerald-950/45 px-2.5 py-0.5 rounded-full border border-emerald-250 dark:border-emerald-800/60 leading-none">REACTIVE</span>
          </div>

          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1">
            {recentMatches.map((match) => (
              <div
                key={match.id}
                className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-850 p-4 rounded-2xl hover:border-emerald-200 dark:hover:border-emerald-900 transition-all space-y-2.5 text-xs text-left"
              >
                <div className="flex items-center justify-between text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <span>📍 {match.courtName}</span>
                  <span>{match.date}</span>
                </div>

                {/* Match result flow */}
                <div className="space-y-1.5 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-205 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-850 dark:text-slate-200 leading-tight">🏆 {match.winnerNames.join(' & ')}</span>
                    <span className="font-mono text-emerald-750 dark:text-emerald-450 font-black">{match.score}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/60 pt-1.5 mt-1">
                    <span className="font-bold text-slate-450 dark:text-slate-400">💀 {match.loserNames.join(' & ')}</span>
                  </div>
                </div>
              </div>
            ))}

            {recentMatches.length === 0 && (
              <div className="text-center py-8 text-slate-400 dark:text-slate-505 text-xs italic font-medium leading-relaxed">
                No match results recorded yet in this session. Submit some wins to initiate ladder Elo recalculations!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Match Result Modal Popup */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-emerald-100 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in duration-200 text-slate-800">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 font-sans">Submit Match Result</h3>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Log match scores to dynamically adjust DUPR values</p>
              </div>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold font-mono p-1 border border-transparent hover:border-slate-200 rounded cursor-pointer"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmitResult} className="p-6 space-y-4">
              {/* Select Court */}
              <div>
                <label className="block text-[10px] font-black text-slate-450 uppercase tracking-widest mb-1.5">Select Arena</label>
                <select
                  value={formCourtId}
                  onChange={(e) => setFormCourtId(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-200 text-slate-700 rounded-2xl px-4 py-3 text-sm outline-none focus:border-emerald-500 font-sans font-bold"
                >
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>{court.name}</option>
                  ))}
                </select>
              </div>

              {/* Winners Picker */}
              <div className="bg-emerald-50 border-2 border-emerald-100 p-4 rounded-2xl space-y-3.5">
                <div className="text-xs font-black text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4.5 h-4.5 text-emerald-700" /> WINNERS LOBBY
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-black text-emerald-600 mb-1">Player 1</label>
                    <select
                      value={winner1Id}
                      onChange={(e) => setWinner1Id(e.target.value)}
                      className="w-full bg-white border-2 border-emerald-150 text-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 font-bold"
                    >
                      {players.map(p => <option key={`w1-${p.id}`} value={p.id}>{p.name} ({p.duprRating.toFixed(2)})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-black text-emerald-600 mb-1">Player 2 (Doubles Optional)</label>
                    <select
                      value={winner2Id}
                      onChange={(e) => setWinner2Id(e.target.value)}
                      className="w-full bg-white border-2 border-emerald-150 text-slate-7050 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 font-bold"
                    >
                      <option value="">-- Single Player (Singles) --</option>
                      {players.map(p => <option key={`w2-${p.id}`} value={p.id}>{p.name} ({p.duprRating.toFixed(2)})</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Losers Picker */}
              <div className="bg-rose-50/50 border-2 border-rose-100 p-4 rounded-2xl space-y-3.5">
                <div className="text-xs font-black text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-4.5 h-4.5 text-rose-6050" /> DEFEATED BOARD
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-black text-rose-600 mb-1">Player 1</label>
                    <select
                      value={loser1Id}
                      onChange={(e) => setLoser1Id(e.target.value)}
                      className="w-full bg-white border-2 border-rose-150 text-slate-700 rounded-xl p-2.5 text-xs outline-none focus:border-rose-500 font-bold"
                    >
                      {players.map(p => <option key={`l1-${p.id}`} value={p.id}>{p.name} ({p.duprRating.toFixed(2)})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-black text-rose-600 mb-1">Player 2 (Doubles Optional)</label>
                    <select
                      value={loser2Id}
                      onChange={(e) => setLoser2Id(e.target.value)}
                      className="w-full bg-white border-2 border-rose-150 text-slate-7050 rounded-xl p-2.5 text-xs outline-none focus:border-rose-500 font-bold"
                    >
                      <option value="">-- Single Player (Singles) --</option>
                      {players.map(p => <option key={`l2-${p.id}`} value={p.id}>{p.name} ({p.duprRating.toFixed(2)})</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Score Input */}
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 space-y-3">
                <div className="text-[10px] font-black text-slate-450 uppercase tracking-widest">Match Score Sheets</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-black text-slate-400 mb-1">Set 1: Winners Score</label>
                    <input
                      type="number"
                      min={0}
                      value={scoreSet1Winner}
                      onChange={(e) => setScoreSet1Winner(e.target.value)}
                      className="w-full bg-white border-2 border-slate-205 text-slate-800 rounded-xl p-2.5 text-xs text-center font-mono font-black outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-black text-slate-400 mb-1">Set 1: Losers Score</label>
                    <input
                      type="number"
                      min={0}
                      value={scoreSet1Loser}
                      onChange={(e) => setScoreSet1Loser(e.target.value)}
                      className="w-full bg-white border-2 border-slate-205 text-slate-800 rounded-xl p-2.5 text-xs text-center font-mono font-black outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-black text-slate-400 mb-1">Set 2 Winners (Optional)</label>
                    <input
                      type="number"
                      min={0}
                      value={scoreSet2Winner}
                      onChange={(e) => setScoreSet2Winner(e.target.value)}
                      className="w-full bg-white border-2 border-slate-205 text-slate-800 rounded-xl p-2.5 text-xs text-center font-mono font-black outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-black text-slate-400 mb-1">Set 2 Losers (Optional)</label>
                    <input
                      type="number"
                      min={0}
                      value={scoreSet2Loser}
                      onChange={(e) => setScoreSet2Loser(e.target.value)}
                      className="w-full bg-white border-2 border-slate-205 text-slate-800 rounded-xl p-2.5 text-xs text-center font-mono font-black outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Control Row */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-5 py-2.5 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-500 font-bold text-xs rounded-full transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-amber-955 text-xs font-black rounded-full shadow-[0_4px_0_0_#d97706] active:translate-y-0.5 active:shadow-none transition-all font-sans cursor-pointer uppercase tracking-wider"
                >
                  Commit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
