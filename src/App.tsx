import React, { useState, useEffect } from 'react';
import { Court, Game, Player, MatchResult, TournamentEvent, Coach } from './types';
import {
  initialCourts,
  initialPlayers,
  initialGames,
  initialEvents,
  initialCoaches
} from './data/mockData';
import InteractiveMap from './components/InteractiveMap';
import CourtDetails from './components/CourtDetails';
import GamesCardList from './components/GamesCardList';
import RankingsLeaderboard from './components/RankingsLeaderboard';
import EventsTimeline from './components/EventsTimeline';
import GuidesAndCoaches from './components/GuidesAndCoaches';
import CourtOwnerDashboard from './components/CourtOwnerDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import RegulatoryCompliance from './components/RegulatoryCompliance';
import DedicatedCourtPage from './components/DedicatedCourtPage';
import { UserRequest, FrontendConfig, ActivityLog, Booking } from './types';
import {
  Activity,
  Award,
  Calendar,
  Layers,
  Map,
  Settings,
  Trophy,
  User,
  HelpCircle,
  TrendingUp,
  Search,
  CheckCircle2,
  Info,
  Sun,
  Moon,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // 1. Initial State Managers (Hydrating from LocalStorage if existing)
  const [courts, setCourts] = useState<Court[]>(() => {
    const saved = localStorage.getItem('p6200_courts');
    return saved ? JSON.parse(saved) : initialCourts;
  });

  // Role and Administrator States
  const [appRole, setAppRole] = useState<'Player' | 'CourtOwner' | 'SuperAdmin'>(() => {
    return (localStorage.getItem('p6200_app_role') as any) || 'Player';
  });

  const [frontendConfig, setFrontendConfig] = useState<FrontendConfig>(() => {
    const saved = localStorage.getItem('p6200_frontend_config');
    if (saved) return JSON.parse(saved);
    return {
      announcementTicker: '🏆 Welcome to Dumaguete Community Hub! Book courts, join drop-ins, and track your active localized rating!',
      heroTitle: 'DUMAPICKLE 6200',
      heroSubtitle: 'Dumaguete Pickleball Community Hub',
      contactPhone: '+63 917 123 4567',
      contactEmail: 'contact@dumapickle.org',
      hubRulesNotice: 'Please respect other players, maintain the kitchen rule, and stack paddles when courts are full.',
      isTickerVisible: true,
      featuredAlertLevel: 'info'
    };
  });

  const [userRequests, setUserRequests] = useState<UserRequest[]>(() => {
    const saved = localStorage.getItem('p6200_user_requests');
    if (saved) return JSON.parse(saved);
    
    // Seed some initial pending requests for playability!
    return [
      {
        id: 'req-1',
        type: 'CoachApplication',
        status: 'Pending',
        title: 'Apply Code: Coach Melo R.',
        description: 'Applying for certified status. Specialized in drills, soft drops and strategic positioning.',
        submittedBy: 'Melo R.',
        submittedAt: '2026-05-26T12:00:00Z',
        details: {
          name: 'Melo R.',
          certification: 'IPTPA Level I instructor',
          rate: '₱250 / hr',
          specialty: 'Third shot drops & dinking strategies',
          contact: '+63 905 555 1234',
          availability: 'Daily 4:00 PM - 8:00 PM'
        }
      },
      {
        id: 'req-2',
        type: 'NewCourtSuggestion',
        status: 'Pending',
        title: 'Register Facility: Valencia Highlands Club',
        description: 'New outdoor court with tournament grade concrete, fully lit, located in Valencia scenic peak area.',
        submittedBy: 'Valencia Owner',
        submittedAt: '2026-05-26T14:20:00Z',
        details: {
          name: 'Valencia Highlands Pickle Club',
          location: 'Valencia Ridge Rd, Negros Oriental, 6215',
          type: 'Outdoor',
          surface: 'Concrete',
          courtCount: 3,
          lights: true,
          rentalFee: 200,
          feeUnit: 'hour',
          contact: '+63 919 444 8888',
          description: 'A beautiful outdoor venue nested high in the mountains of Valencia. Experience cool breeze, professional netting, floodlighting, and scenic view.',
          restrooms: true,
          accessibility: true,
          latitude: 9.2844,
          longitude: 123.2395,
          images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=600']
        }
      },
      {
        id: 'req-3',
        type: 'MatchVerification',
        status: 'Pending',
        title: 'Verify Rizal Boulevard Singles Game',
        description: 'Match submission verification for Yoshi Tan vs Melo R. reported 11-7 scoreline.',
        submittedBy: 'Yoshi Tan',
        submittedAt: '2026-05-26T15:10:00Z',
        details: {
          courtId: 'rizal-blvd',
          courtName: 'Rizal Boulevard Beachfront Courts',
          date: '2026-05-26',
          winnerIds: ['p10'],
          winnerNames: ['Yoshi Tan'],
          loserIds: ['p6'],
          loserNames: ['Melo R.'],
          score: '11-7'
        }
      }
    ];
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('p6200_players');
    const loaded: Player[] = saved ? JSON.parse(saved) : initialPlayers;
    const unique: Player[] = [];
    const seen = new Set<string>();
    for (const player of loaded) {
      if (!seen.has(player.id)) {
        seen.add(player.id);
        unique.push(player);
      }
    }
    return unique;
  });

  const [games, setGames] = useState<Game[]>(() => {
    const saved = localStorage.getItem('p6200_games');
    return saved ? JSON.parse(saved) : initialGames;
  });

  const [events, setEvents] = useState<TournamentEvent[]>(() => {
    const saved = localStorage.getItem('p6200_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [coaches, setCoaches] = useState<Coach[]>(() => {
    const saved = localStorage.getItem('p6200_coaches');
    return saved ? JSON.parse(saved) : initialCoaches;
  });

  const [recentMatches, setRecentMatches] = useState<MatchResult[]>(() => {
    const saved = localStorage.getItem('p6200_recent_matches');
    if (saved) return JSON.parse(saved);
    // Initial feed fallback matches
    return [
      {
        id: 'mr1',
        courtId: 'the-ryze',
        courtName: 'The Ryze Dumaguete',
        date: '2026-05-25',
        winnerIds: ['p1', 'p3'],
        winnerNames: ['Jay Flores', 'Princess Lumay'],
        loserIds: ['p2', 'p4'],
        loserNames: ['Mark Alviola', 'Dexter Teves'],
        score: '11-7, 11-9',
        submittedAt: '2026-05-25T14:30:00Z'
      },
      {
        id: 'mr2',
        courtId: 'rizal-blvd',
        courtName: 'Rizal Boulevard Beachfront Courts',
        date: '2026-05-24',
        winnerIds: ['p5'],
        winnerNames: ['Sarah G.'],
        loserIds: ['p10'],
        loserNames: ['Yoshi Tan'],
        score: '11-6',
        submittedAt: '2026-05-24T18:45:00Z'
      }
    ];
  });

  // 2. Active Tab & Viewing selectors
  const [activeTab, setActiveTab] = useState<'courts' | 'games' | 'rankings' | 'events' | 'guides'>('courts');
  const [activeCourtIdPage, setActiveCourtIdPage] = useState<string | null>(null);
  const [activeLegalTab, setActiveLegalTab] = useState<'privacy' | 'terms' | null>(null);
  const [complianceAccepted, setComplianceAccepted] = useState<boolean>(() => {
    return localStorage.getItem('p6200_compliance_accepted') === 'true';
  });
  const [selectedCourtId, setSelectedCourtId] = useState<string>('the-ryze');
  const [courtSearchQuery, setCourtSearchQuery] = useState('');
  const [courtTypeFilter, setCourtTypeFilter] = useState('All');

  // 2b. Advanced Facility Filters & Geolocation simulation states
  const [lightsOnly, setLightsOnly] = useState(false);
  const [restroomsOnly, setRestroomsOnly] = useState(false);
  const [accessibilityOnly, setAccessibilityOnly] = useState(false);
  const [courtSurfaceFilter, setCourtSurfaceFilter] = useState<'All' | 'Cushioned Acrylic' | 'Concrete' | 'Wooden Court' | 'Sport Tile' | 'Asphalt' | 'Sport Court'>('All');

  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [simulationAnchor, setSimulationAnchor] = useState<string>('none');
  const [sortByProximity, setSortByProximity] = useState(false);

  const simulatedLocations = [
    { id: 'none', name: 'None (Disable Proximity)', latitude: 0, longitude: 0 },
    { id: 'city-hall', name: 'Dumaguete City Hall (Center)', latitude: 9.3060, longitude: 123.3090 },
    { id: 'valencia-plaza', name: 'Valencia Highlands Plaza', latitude: 9.2811, longitude: 123.2458 },
    { id: 'sibulan-port', name: 'Sibulan Port Terminal', latitude: 9.3550, longitude: 123.3080 },
    { id: 'dauin-beach', name: 'Dauin Beach Front', latitude: 9.1850, longitude: 123.2680 }
  ];

  const handleSimulateLocation = (anchorId: string) => {
    setSimulationAnchor(anchorId);
    if (anchorId === 'none') {
      setUserCoords(null);
      setLocationError(null);
      setSortByProximity(false);
      return;
    }
    const loc = simulatedLocations.find(l => l.id === anchorId);
    if (loc) {
      setUserCoords({ latitude: loc.latitude, longitude: loc.longitude });
      setLocationError(null);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setSimulationAnchor('custom');
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError('GPS Permission denied. Standard for sandboxed previews. Try selecting an anchor in the Geo-Simulator console below.');
        } else {
          setLocationError(`Location error: ${error.message}`);
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // --- Dynamic System Telemetry Logs & Impersonation Hub states ---
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('p6200_activity_logs');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'log-1',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        role: 'SuperAdmin',
        actorName: 'System Kernel',
        action: 'Dumaguete 6200 Community Hub initialized',
        category: 'Admin',
        details: 'Initial seed of 4 pro-grade complexes and 10 competitive community players verified.'
      },
      {
        id: 'log-2',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        role: 'Player',
        actorName: 'Yoshi Tan',
        action: 'Created match claim vs Melo R.',
        category: 'Match',
        details: 'Singles game, score 11-7 at Rizal Boulevard Beachfront Courts.'
      },
      {
        id: 'log-3',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        role: 'CourtOwner',
        actorName: 'Valencia Owner',
        action: 'Submitted facility suggestion: Valencia Highlands Pickle Club',
        category: 'Court',
        details: 'Requested validation for a 3-court outdoor concrete arena with LED lights.'
      }
    ];
  });

  const [impersonatorActive, setImpersonatorActive] = useState<boolean>(() => {
    return localStorage.getItem('p6200_impersonator_active') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('p6200_impersonator_active', impersonatorActive.toString());
  }, [impersonatorActive]);

  useEffect(() => {
    localStorage.setItem('p6200_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('p6200_bookings');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'book-1',
        courtId: 'the-ryze',
        courtName: 'The Ryze Valencia',
        playerId: 'p-user',
        playerName: 'George T.',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '08:00 AM - 09:30 AM',
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString()
      },
      {
        id: 'book-2',
        courtId: 'rizal-beachfront',
        courtName: 'Rizal Boulevard Beachfront',
        playerId: 'p-3',
        playerName: 'Melo R.',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        timeSlot: '04:00 PM - 05:30 PM',
        status: 'Pending',
        createdAt: new Date().toISOString()
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('p6200_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const addSysLog = (action: string, category: ActivityLog['category'], details?: string) => {
    const actor = appRole === 'SuperAdmin' ? 'SuperAdmin' : (appRole === 'CourtOwner' ? 'Court Owner' : profileName);
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      role: appRole,
      actorName: actor,
      action,
      category,
      details,
      impersonatedBy: impersonatorActive ? 'SuperAdmin' : undefined
    };
    setActivityLogs(prev => {
      const next = [newLog, ...prev].slice(0, 150);
      return next;
    });
  };

  const clearSysLogs = () => {
    setActivityLogs([]);
    localStorage.removeItem('p6200_activity_logs');
  };

  // 3. Current Session User (Configurable via Profile Panel)
  const [profileName, setProfileName] = useState(() => {
    return localStorage.getItem('p6200_user_name') || 'George T.';
  });
  const [profileDupr, setProfileDupr] = useState(() => {
    return Number(localStorage.getItem('p6200_user_dupr') || '3.50');
  });
  const [profileGender, setProfileGender] = useState<'Male' | 'Female' | 'Other'>(() => {
    return (localStorage.getItem('p6200_user_gender') as any) || 'Male';
  });
  const [showProfileConfig, setShowProfileConfig] = useState(false);

  // 3b. Dark Mode & DUPR History states
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('p6200_dark_mode');
    return saved === 'true';
  });

  const [userDuprHistory, setUserDuprHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('p6200_user_dupr_history');
    if (saved) return JSON.parse(saved);
    // Beautiful curve up to current profileDupr (3.50 default)
    const historyList: any[] = [];
    const dates = [
      '2026-05-01', '2026-05-04', '2026-05-06', '2026-05-09', '2026-05-12',
      '2026-05-15', '2026-05-18', '2026-05-20', '2026-05-22', '2026-05-25'
    ];
    let currentRating = 3.05;
    const winsLosses = ['Win', 'Win', 'Loss', 'Win', 'Win', 'Loss', 'Win', 'Win', 'Loss', 'Win'];
    const opponents = ['Yoshi Tan', 'Nica S.', 'Sarah G.', 'Melo R.', 'Aries Lim', 'Princess Lumay', 'Dexter Teves', 'Mark Alviola', 'Jay Flores', 'Sarah G.'];
    const scores = ['11-7', '11-6', '8-11', '11-9', '11-7', '9-11', '11-5', '12-10', '7-11', '11-8'];

    for (let i = 0; i < 10; i++) {
      const matchResult = winsLosses[i];
      if (i > 0) {
        if (matchResult === 'Win') {
          currentRating = Number((currentRating + 0.05).toFixed(2));
        } else {
          currentRating = Number((currentRating - 0.05).toFixed(2));
        }
      }
      historyList.push({
        id: `h-${i}`,
        matchNumber: i + 1,
        rating: currentRating,
        date: dates[i],
        opponent: opponents[i],
        result: matchResult,
        score: scores[i]
      });
    }
    return historyList;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('p6200_dark_mode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('p6200_user_dupr_history', JSON.stringify(userDuprHistory));
  }, [userDuprHistory]);

  // Synced User record dynamically formatted
  const currentUserProfile: Player = {
    id: 'p-user',
    name: profileName,
    duprRating: profileDupr,
    wins: players.find(p => p.id === 'p-user')?.wins || 0,
    losses: players.find(p => p.id === 'p-user')?.losses || 0,
    avatarColor: 'bg-lime-400 text-slate-950 font-bold',
    contact: '0917-111-2222',
    hometown: 'Dumaguete City',
    gender: profileGender
  };

  // 4. Persistence Effect watchers
  useEffect(() => {
    localStorage.setItem('p6200_courts', JSON.stringify(courts));
  }, [courts]);

  useEffect(() => {
    localStorage.setItem('p6200_players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('p6200_coaches', JSON.stringify(coaches));
  }, [coaches]);

  useEffect(() => {
    localStorage.setItem('p6200_app_role', appRole);
  }, [appRole]);

  useEffect(() => {
    localStorage.setItem('p6200_frontend_config', JSON.stringify(frontendConfig));
  }, [frontendConfig]);

  useEffect(() => {
    localStorage.setItem('p6200_user_requests', JSON.stringify(userRequests));
  }, [userRequests]);

  useEffect(() => {
    localStorage.setItem('p6200_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('p6200_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('p6200_recent_matches', JSON.stringify(recentMatches));
  }, [recentMatches]);

  useEffect(() => {
    localStorage.setItem('p6200_user_name', profileName);
    localStorage.setItem('p6200_user_dupr', profileDupr.toString());
    localStorage.setItem('p6200_user_gender', profileGender);
  }, [profileName, profileDupr, profileGender]);

  // Ensure user is registered in the leaderboard players list if needed (deduplicated)
  useEffect(() => {
    setPlayers(prev => {
      const hasUser = prev.some(p => p.id === 'p-user');
      let baseList = prev;
      if (!hasUser) {
        baseList = [
          ...prev,
          {
            id: 'p-user',
            name: profileName,
            duprRating: profileDupr,
            wins: 0,
            losses: 0,
            avatarColor: 'bg-lime-400',
            contact: '09171112222',
            hometown: 'Dumaguete City',
            gender: profileGender
          }
        ];
      }
      const unique: Player[] = [];
      const seen = new Set<string>();
      for (const player of baseList) {
        if (!seen.has(player.id)) {
          seen.add(player.id);
          unique.push(player);
        }
      }
      return unique;
    });
  }, [profileName, profileDupr, profileGender]);

  // Sync profile edits with global player list representation
  const handleUpdateProfile = (name: string, rating: number, gender: 'Male' | 'Female' | 'Other') => {
    addSysLog(`Updated athlete profile details`, 'Account', `Name: ${name}, DUPR Rating: ${rating}, Gender: ${gender}`);
    setProfileName(name);
    setProfileDupr(rating);
    setProfileGender(gender);
    setPlayers(prev => prev.map(p => {
      if (p.id === 'p-user') {
        return {
          ...p,
          name,
          duprRating: rating,
          gender
        };
      }
      return p;
    }));

    if (rating !== profileDupr) {
      setUserDuprHistory(prev => {
        const newPoint = {
          id: `h-manual-${Date.now()}`,
          matchNumber: prev.length + 1,
          rating: rating,
          date: new Date().toISOString().split('T')[0],
          opponent: 'Manual Adjustment',
          result: 'Initial',
          score: 'N/A'
        };
        const updated = [...prev, newPoint].slice(-10);
        return updated.map((pt, ind) => ({ ...pt, matchNumber: ind + 1 }));
      });
    }

    setShowProfileConfig(false);
  };

  // 5. Interactive Operations triggers
  // 5a. Check-In Toggle
  const handleToggleCheckIn = (courtId: string) => {
    setCourts(prev => prev.map(c => {
      if (c.id === courtId) {
        const isCurrentlyCheckedIn = c.checkedInPlayers.includes(profileName);
        if (isCurrentlyCheckedIn) {
          addSysLog(`Checked out of court: "${c.name}"`, 'Court', `Athlete name: ${profileName}`);
          return {
            ...c,
            checkInCount: Math.max(0, c.checkInCount - 1),
            checkedInPlayers: c.checkedInPlayers.filter(p => p !== profileName)
          };
        } else {
          addSysLog(`Checked in to court: "${c.name}"`, 'Court', `Athlete name: ${profileName}`);
          return {
            ...c,
            checkInCount: c.checkInCount + 1,
            checkedInPlayers: [...c.checkedInPlayers, profileName]
          };
        }
      }
      return c;
    }));
  };

  // 5b. Join Game Schedule Card
  const handleJoinGame = (gameId: string) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        const alreadyJoined = g.currentPlayers.some(p => p.id === 'p-user');
        if (alreadyJoined) return g;

        addSysLog(`Joined game lobby: "${g.title}"`, 'Game', `Joined as: ${profileName} (DUPR ${profileDupr}) at ${g.courtName}`);
        return {
          ...g,
          currentPlayers: [
            ...g.currentPlayers,
            { id: 'p-user', name: profileName, level: profileDupr }
          ]
        };
      }
      return g;
    }));
  };

  // 5c. Leave Game Schedule Card
  const handleLeaveGame = (gameId: string) => {
    setGames(prev => prev.map(g => {
      if (g.id === gameId) {
        addSysLog(`Left game lobby: "${g.title}"`, 'Game', `Athlete name: ${profileName}`);
        return {
          ...g,
          currentPlayers: g.currentPlayers.filter(p => p.id !== 'p-user')
        };
      }
      return g;
    }));
  };

  // 5d. Create Game Lobby Event Publish
  const handleCreateGame = (newGameData: Omit<Game, 'id' | 'currentPlayers' | 'hostId' | 'hostName' | 'hostLevel'>) => {
    const newId = `g-new-${Date.now()}`;
    const completeGame: Game = {
      ...newGameData,
      id: newId,
      hostId: 'p-user',
      hostName: profileName,
      hostLevel: profileDupr,
      currentPlayers: [
        { id: 'p-user', name: profileName, level: profileDupr }
      ]
    };

    addSysLog(`Hosted new game lobby: "${newGameData.title}"`, 'Game', `Scheduled for: ${newGameData.date} ${newGameData.time} at ${newGameData.courtName}`);
    setGames(prev => [completeGame, ...prev]);
  };

  // 5e. Submit Match Result with Elo Dynamic Recalculation
  const handleCommitMatchResult = (matchData: Omit<MatchResult, 'id' | 'submittedAt'>) => {
    const newId = `tbl-${Date.now()}`;
    const submittedMatch: MatchResult = {
      ...matchData,
      id: newId,
      submittedAt: new Date().toISOString()
    };

    // Incremental Player Ladder Elo algorithm
    setPlayers(prev => prev.map(player => {
      const isWinner = matchData.winnerIds.includes(player.id);
      const isLoser = matchData.loserIds.includes(player.id);

      if (isWinner) {
        const currentDupr = player.duprRating;
        const reward = 0.05; // Base increment
        return {
          ...player,
          wins: player.wins + 1,
          duprRating: Math.min(6.0, Number((currentDupr + reward).toFixed(2)))
        };
      }

      if (isLoser) {
        const currentDupr = player.duprRating;
        const penalty = 0.05; // Base decrement
        return {
          ...player,
          losses: player.losses + 1,
          duprRating: Math.max(1.0, Number((currentDupr - penalty).toFixed(2)))
        };
      }

      return player;
    }));

    // Update Session user rating if they participated in the match outcome
    const userIsWinner = matchData.winnerIds.includes('p-user');
    const userIsLoser = matchData.loserIds.includes('p-user');
    let targetDupr = profileDupr;
    let matchType: 'Win' | 'Loss' | undefined = undefined;

    if (userIsWinner) {
      targetDupr = Math.min(6.0, Number((profileDupr + 0.05).toFixed(2)));
      matchType = 'Win';
      setProfileDupr(targetDupr);
    } else if (userIsLoser) {
      targetDupr = Math.max(1.0, Number((profileDupr - 0.05).toFixed(2)));
      matchType = 'Loss';
      setProfileDupr(targetDupr);
    }

    if (userIsWinner || userIsLoser) {
      setUserDuprHistory(prev => {
        const opponentNames = userIsWinner ? matchData.loserNames : matchData.winnerNames;
        const newPoint = {
          id: `h-match-${Date.now()}`,
          matchNumber: prev.length + 1,
          rating: targetDupr,
          date: matchData.date,
          opponent: opponentNames.join(' & '),
          result: matchType,
          score: matchData.score
        };
        const updated = [...prev, newPoint].slice(-10);
        return updated.map((pt, ind) => ({ ...pt, matchNumber: ind + 1 }));
      });
    }

    addSysLog(`Logged match score report for standing adjustments`, 'Match', `Score: ${matchData.score} at ${matchData.courtName}\nWinners: ${matchData.winnerNames.join(' & ')} \nLosers: ${matchData.loserNames.join(' & ')}`);
    // Append to Recent Ledger
    setRecentMatches(prev => [submittedMatch, ...prev]);
  };

  // 5f. RSVP/Register for event (Clinics + Tournaments)
  const handleRegisterForEvent = (eventId: string, entrantName: string) => {
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        if (e.registeredPlayers.includes(entrantName)) return e;

        addSysLog(`Registered for clinic/event: "${e.title}"`, 'Event', `Registered entrant: ${entrantName}`);
        return {
          ...e,
          spotsAvailable: Math.max(0, e.spotsAvailable - 1),
          registeredPlayers: [...e.registeredPlayers, entrantName]
        };
      }
      return e;
    }));
  };

  // 5g. Submit Court Reviews & Ratings
  const handleCommitReview = (courtId: string, rating: number, comment: string) => {
    setCourts(prev => prev.map(c => {
      if (c.id === courtId) {
        const newReview = {
          id: `rev-${Date.now()}`,
          userName: profileName,
          rating,
          comment,
          createdAt: new Date().toISOString().split('T')[0]
        };
        addSysLog(`Submitted review for court: "${c.name}"`, 'Review', `Rating: ${'★'.repeat(rating)}\nComment: "${comment}"`);
        const updatedReviews = [...(c.reviews || []), newReview];
        return {
          ...c,
          reviews: updatedReviews
        };
      }
      return c;
    }));
  };

  // 5h. Booking System Event Handlers
  const handleCreateBooking = (courtId: string, courtName: string, date: string, timeSlot: string, notes?: string) => {
    const newBooking: Booking = {
      id: `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      courtId,
      courtName,
      playerId: 'p-user',
      playerName: profileName,
      date,
      timeSlot,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      notes
    };
    setBookings(prev => [newBooking, ...prev]);
    addSysLog(`Registered new booking reservation: "${courtName}"`, 'Court', `Reserved Date: ${date} at ${timeSlot}\nPlayer: ${profileName}`);
  };

  const handleUpdateBookingStatus = (bookingId: string, status: 'Confirmed' | 'Cancelled') => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        addSysLog(`Booking reservation status modified: "${b.courtName}"`, 'Court', `Referenced Booking ID: ${bookingId}\nStatus altered to ${status}`);
        return { ...b, status };
      }
      return b;
    }));
  };

  const handleDeleteBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    addSysLog(`Booking reservation deleted from system log`, 'Court', `Booking ID: ${bookingId}`);
  };

  // Helper method for Haversine distance tracking
  function getDistanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  // 6. Selected Court detail computer
  const selectedCourt = courts.find(c => c.id === selectedCourtId) || courts[0];

  // 7. Court filters (Includes Standard Search, Advanced Filters, and Geolocation Distances sorting)
  const filteredCourts = courts.filter((court) => {
    // Hide hidden courts if not superadmin and not court owner
    if (court.isHidden && appRole !== 'SuperAdmin' && appRole !== 'CourtOwner') {
      return false;
    }
    const matchesSearch = court.name.toLowerCase().includes(courtSearchQuery.toLowerCase()) || 
                          court.location.toLowerCase().includes(courtSearchQuery.toLowerCase());
    const matchesType = courtTypeFilter === 'All' || court.type === courtTypeFilter;
    
    // Advanced facility specifications matching
    const matchesLights = !lightsOnly || court.lights;
    const matchesRestrooms = !restroomsOnly || court.restrooms;
    const matchesAccessibility = !accessibilityOnly || court.accessibility;
    const matchesSurface = courtSurfaceFilter === 'All' || court.surface === courtSurfaceFilter;

    return matchesSearch && matchesType && matchesLights && matchesRestrooms && matchesAccessibility && matchesSurface;
  });

  // Dynamically sort filtered courts based on proximity to the active coords anchor
  const processedCourts = [...filteredCourts];
  if (sortByProximity && userCoords) {
    processedCourts.sort((a, b) => {
      const distA = getDistanceInKm(userCoords.latitude, userCoords.longitude, a.latitude, a.longitude);
      const distB = getDistanceInKm(userCoords.latitude, userCoords.longitude, b.latitude, b.longitude);
      return distA - distB;
    });
  }

  if (activeCourtIdPage) {
    const activeCourtObj = courts.find(c => c.id === activeCourtIdPage);
    if (activeCourtObj) {
      return (
        <DedicatedCourtPage
          court={activeCourtObj}
          appRole={appRole}
          currentUserProfile={currentUserProfile}
          onBack={() => setActiveCourtIdPage(null)}
          onUpdateCourt={(updatedCourt) => {
            setCourts(prev => prev.map(c => c.id === updatedCourt.id ? updatedCourt : c));
          }}
          onToggleCheckIn={handleToggleCheckIn}
          onCommitReview={handleCommitReview}
          bookings={bookings}
          onBookSlot={handleCreateBooking}
          onAddSysLogOnPage={addSysLog}
        />
      );
    }
  }

  return (
    <div className="bg-emerald-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-200 pb-20 md:pb-0">
      
      {/* Primary Decorative top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[130px] rounded-full pointer-events-none" />

      {/* HEADER BAR HERO */}
      <header className="border-b-4 border-emerald-500/10 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-40 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          
          {/* Logo and metadata label */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-emerald-250 select-none animate-bounce-slow">
              🏓
            </div>
            <div>
              <h1 className="text-xl font-sans font-black tracking-tight text-emerald-900 dark:text-white leading-none flex items-center gap-1.5 uppercase">
                {frontendConfig.heroTitle}
              </h1>
              <p className="text-[10px] text-emerald-600/60 dark:text-emerald-500/80 font-mono tracking-widest uppercase mt-1 leading-none font-extrabold">
                {frontendConfig.heroSubtitle}
              </p>
            </div>
          </div>

          {/* Header Action Row: Dark Mode & User Profile Configurator */}
          <div className="flex items-center gap-3">
            {/* Dark Mode toggle button */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center transition-all duration-200 text-slate-650 dark:text-amber-400 outline-none cursor-pointer shadow-sm"
              title="Toggle theme mode"
              aria-label="Toggle theme mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Configurator widget */}
            <div className="relative">
              <button
                onClick={() => setShowProfileConfig(!showProfileConfig)}
                className="px-4 py-2 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-full flex items-center gap-2 text-xs transition-all duration-200 outline-none cursor-pointer text-slate-705 dark:text-slate-200"
                id="profile-trigger-btn"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold font-mono text-[10px]">
                  {profileName.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-sans font-black hidden sm:inline">{profileName}</span>
                <span className="font-mono bg-amber-400 text-amber-955 font-bold text-[9px] px-2 py-0.5 rounded-full leading-none uppercase">
                  DUPR {profileDupr.toFixed(2)}
                </span>
              </button>

              {/* Config panel popover panel */}
              {showProfileConfig && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-5 shadow-2xl min-w-[290px] z-50 animate-in fade-in slide-in-from-top-3 duration-200 text-left">
                  <div className="border-b border-emerald-50 dark:border-slate-800 pb-2.5 mb-3.5 flex items-center justify-between">
                    <div>
                      <h4 className="font-sans font-black text-xs text-emerald-950 dark:text-white">Profile Settings</h4>
                      <p className="text-[10px] text-emerald-600/60 dark:text-emerald-550/80 font-mono font-bold">DUMAGUETE ID CONSOLE</p>
                    </div>
                    <button
                      onClick={() => setShowProfileConfig(false)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold font-mono cursor-pointer"
                    >
                      ✖
                    </button>
                  </div>

                  {/* Profile quick-inputs */}
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 font-bold">Your Display Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 rounded-xl outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 font-bold">DUPR Rating</label>
                        <input
                          type="number"
                          min={1.0}
                          max={6.0}
                          step={0.01}
                          value={profileDupr}
                          onChange={(e) => setProfileDupr(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500 text-slate-800 dark:text-slate-100 font-mono text-xs px-2.5 py-2 rounded-xl outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 font-bold">Gender Class</label>
                        <select
                          value={profileGender}
                          onChange={(e) => setProfileGender(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500 text-slate-700 dark:text-slate-200 text-xs px-2.5 py-2 rounded-xl outline-none transition-all font-bold"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 font-bold">Access Portal Level</label>
                        <select
                          value={appRole}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setAppRole(val);
                            if (val === 'CourtOwner') {
                              setActiveTab('owner_portal');
                            } else if (val === 'SuperAdmin') {
                              setActiveTab('admin_portal');
                            } else {
                              setActiveTab('courts');
                            }
                          }}
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 focus:border-emerald-500 text-slate-800 dark:text-slate-100 text-xs px-2.5 py-2 rounded-xl outline-none transition-all font-black uppercase tracking-wider cursor-pointer"
                        >
                          <option value="Player">Athlete Mode (Public)</option>
                          <option value="CourtOwner">🚨 Court Owner Portal</option>
                          <option value="SuperAdmin">🛡️ SuperAdmin Operator</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => handleUpdateProfile(profileName, profileDupr, profileGender)}
                      className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-955 font-sans font-black text-xs rounded-full shadow-[0_4px_0_0_#d97706] active:translate-y-1 active:shadow-none transition-all shrink-0 mt-2 cursor-pointer"
                    >
                      Save Changes & Sync Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 🕵️ Impersonation Active Warn Banner */}
      {impersonatorActive && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 font-sans text-xs font-bold text-slate-950 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md z-40 relative border-b-2 border-amber-650 sticky top-16 duration-300">
          <div className="flex items-center gap-2">
            <span className="text-sm">🕵️</span>
            <span>
              Impersonation Mode Active: You are representing the <strong className="uppercase bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded text-[10px]">{appRole}</strong> portal. Changes update live database profiles.
            </span>
          </div>
          <button
            onClick={() => {
              addSysLog('Terminated impersonation session', 'Impersonation', `Operator returning to SuperAdmin privileges`);
              setImpersonatorActive(false);
              setAppRole('SuperAdmin');
              setActiveTab('admin_portal');
            }}
            className="px-3 shrink-0 py-1 bg-slate-950 text-amber-400 hover:bg-slate-900 font-black text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1 shadow"
          >
            ⏹️ Stop Impersonating & Return to Admin
          </button>
        </div>
      )}

      {/* Dynamic Admin announcement alert ribbon */}
      {frontendConfig.isTickerVisible && (
        <div className={`border-b-2 text-left py-2.5 px-4 md:px-6 relative z-30 flex items-center gap-3 overflow-hidden text-xs font-bold leading-normal transition-all duration-300 ${
          frontendConfig.featuredAlertLevel === 'success'
            ? 'bg-emerald-600 border-emerald-700 text-white'
            : frontendConfig.featuredAlertLevel === 'warning'
            ? 'bg-amber-500 border-amber-600 text-slate-900 shadow-md shadow-amber-250/20'
            : frontendConfig.featuredAlertLevel === 'error'
            ? 'bg-rose-600 border-rose-700 text-white font-extrabold animate-pulse'
            : 'bg-teal-600 border-teal-750 text-white'
        }`}>
          <div className="flex items-center gap-1.5 shrink-0 uppercase tracking-widest font-black text-[9px] bg-white/20 px-2.2 py-0.5 rounded-md leading-none select-none">
            📣 bulletin
          </div>
          <div className="flex-1 truncate select-none">
            {frontendConfig.announcementTicker}
          </div>
        </div>
      )}

      {/* CORE NAVIGATION NAV-RAIL & TABS SELECTORS */}
      <nav className="hidden md:block border-b-2 border-emerald-100 bg-emerald-50/50 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-1.5 py-3.5 overflow-x-auto scrollbar-none">
            
            <button
              onClick={() => setActiveTab('courts')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 uppercase cursor-pointer border-2 ${
                activeTab === 'courts'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              <Map className="w-4.5 h-4.5" />
              <span>Courts Map</span>
            </button>

            <button
              onClick={() => setActiveTab('games')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 uppercase cursor-pointer border-2 ${
                activeTab === 'games'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200'
                  : 'bg-white border-slate-200 text-slate-605 hover:text-emerald-900 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              <Activity className="w-4.5 h-4.5" />
              <span>Games & Drop-ins</span>
            </button>

            <button
              onClick={() => setActiveTab('rankings')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 uppercase cursor-pointer border-2 ${
                activeTab === 'rankings'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              <Trophy className="w-4.5 h-4.5" />
              <span>Ladder Standings</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 uppercase cursor-pointer border-2 ${
                activeTab === 'events'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              <Calendar className="w-4.5 h-4.5" />
              <span>Events & Clinics</span>
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 uppercase cursor-pointer border-2 ${
                activeTab === 'guides'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200'
                  : 'bg-white border-slate-200 text-slate-600 hover:text-emerald-900 hover:bg-emerald-50 hover:border-emerald-300'
              }`}
            >
              <HelpCircle className="w-4.5 h-4.5" />
              <span>Etiquette & Coaching</span>
            </button>

            {appRole === 'CourtOwner' && (
              <button
                onClick={() => setActiveTab('owner_portal')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 uppercase cursor-pointer border-2 ${
                  activeTab === 'owner_portal'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-amber-900 hover:bg-amber-50 hover:border-emerald-305'
                }`}
              >
                <Building2 className="w-4.5 h-4.5 text-amber-600" />
                <span>My Facilities</span>
              </button>
            )}

            {appRole === 'SuperAdmin' && (
              <button
                onClick={() => setActiveTab('admin_portal')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all shrink-0 uppercase cursor-pointer border-2 ${
                  activeTab === 'admin_portal'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-lg shadow-rose-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-rose-900 hover:bg-rose-50 hover:border-rose-305'
                }`}
              >
                <ShieldCheck className="w-4.5 h-4.5 text-rose-650" />
                <span>Admin Console</span>
              </button>
            )}

          </div>
        </div>
      </nav>

      {/* PRIMARY PAGE VIEW CONTROLLERS */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
            {/* COURTS MAP VIEW LAYOUT */}
        {activeTab === 'courts' && (
          <div className="space-y-8">
            {/* Split layout: Selector List and Interactive Map + detail panel side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Selector List Column */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* Search / Filter input */}
                <div className="bg-white border-2 border-emerald-100 rounded-3xl p-5 space-y-4 shadow-sm">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search courts (e.g. Valencia, Ryze)..."
                      value={courtSearchQuery}
                      onChange={(e) => setCourtSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-slate-250 text-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-xs outline-none focus:border-emerald-500 placeholder-slate-400 font-sans transition-all"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCourtTypeFilter('All')}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer border-2 transition-all ${
                        courtTypeFilter === 'All'
                          ? 'bg-emerald-500 text-white border-emerald-550 shadow-md shadow-emerald-250'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:border-emerald-305'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setCourtTypeFilter('Indoor')}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer border-2 transition-all ${
                        courtTypeFilter === 'Indoor'
                          ? 'bg-emerald-500 text-white border-emerald-555 shadow-md shadow-emerald-250'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:border-emerald-305'
                      }`}
                    >
                      Indoor
                    </button>
                    <button
                      onClick={() => setCourtTypeFilter('Covered')}
                      className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer border-2 transition-all ${
                        courtTypeFilter === 'Covered'
                          ? 'bg-emerald-500 text-white border-emerald-555 shadow-md shadow-emerald-250'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-emerald-50 hover:border-emerald-305'
                      }`}
                    >
                      Covered
                    </button>
                  </div>
                </div>

                {/* Proximity Location Anchor */}
                <div className="bg-white border-2 border-emerald-100 rounded-3xl p-5 space-y-3.5 shadow-sm text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">📍 Courts Near Me</h4>
                    {userCoords && (
                      <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">ACTIVE</span>
                    )}
                  </div>

                  <button
                    onClick={handleGetCurrentLocation}
                    disabled={isLocating}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white text-[10px] font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 select-none cursor-pointer uppercase tracking-wider"
                  >
                    {isLocating ? 'Determining GPS Coords...' : '🎯 Trace Active Device GPS'}
                  </button>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-black text-slate-405 uppercase tracking-widest">Or Select simulated region anchor:</label>
                    <select
                      value={simulationAnchor}
                      onChange={(e) => handleSimulateLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded-xl outline-none"
                    >
                      {simulatedLocations.map((loc) => (
                        <option key={`opt-sim-${loc.id}`} value={loc.id}>
                          {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {locationError && (
                    <div className="text-[9px] font-bold text-rose-600 leading-snug bg-rose-50 border border-rose-150 p-2 rounded-xl">
                      {locationError}
                    </div>
                  )}

                  {userCoords && (
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700 pt-1">
                      <input
                        type="checkbox"
                        checked={sortByProximity}
                        onChange={(e) => setSortByProximity(e.target.checked)}
                        className="rounded text-emerald-605 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Sort Courts Nearest First</span>
                    </label>
                  )}
                </div>

                {/* Advanced Specifications Filters */}
                <div className="bg-white border-2 border-emerald-100 rounded-3xl p-5 space-y-3.5 shadow-sm text-left">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">🛠 Area Facilities Filter</h4>
                  
                  <div className="space-y-2 text-xs font-bold text-slate-700">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-805 transition">
                      <input
                        type="checkbox"
                        checked={lightsOnly}
                        onChange={(e) => setLightsOnly(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Evening Play Lights</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-805 transition">
                      <input
                        type="checkbox"
                        checked={restroomsOnly}
                        onChange={(e) => setRestroomsOnly(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Public Restrooms Available</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer hover:text-emerald-805 transition">
                      <input
                        type="checkbox"
                        checked={accessibilityOnly}
                        onChange={(e) => setAccessibilityOnly(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span>Wheelchair Step-free Ramps</span>
                    </label>
                  </div>

                  <div className="pt-2 border-t border-slate-50">
                    <label className="block text-[10px] font-black text-slate-405 uppercase tracking-widest mb-1.5">Surface Texture Type</label>
                    <select
                      value={courtSurfaceFilter}
                      onChange={(e) => setCourtSurfaceFilter(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded-xl outline-none focus:border-emerald-505"
                    >
                      <option value="All">All Textures</option>
                      <option value="Cushioned Acrylic">Cushioned Acrylic</option>
                      <option value="Concrete">Concrete</option>
                      <option value="Wooden Court">Wooden Court</option>
                      <option value="Sport Tile">Sport Tile</option>
                      <option value="Asphalt">Asphalt</option>
                      <option value="Sport Court">Sport Court</option>
                    </select>
                  </div>
                </div>

                {/* Vertical lists of filtered court buttons */}
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {processedCourts.map((court) => {
                    const isSelected = court.id === selectedCourtId;
                    const hasYou = court.checkedInPlayers.includes(profileName);

                    // Compute review statistics
                    const rCount = court.reviews?.length || 0;
                    const avgR = rCount > 0
                      ? (court.reviews.reduce((acc, r) => acc + r.rating, 0) / rCount).toFixed(1)
                      : null;

                    // Geolocation distance computation
                    const distance = userCoords
                      ? getDistanceInKm(userCoords.latitude, userCoords.longitude, court.latitude, court.longitude)
                      : null;

                    return (
                      <button
                        key={court.id}
                        onClick={() => {
                          setSelectedCourtId(court.id);
                          setActiveCourtIdPage(court.id);
                        }}
                        className={`w-full text-left p-4.5 rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between space-y-3 outline-none font-sans cursor-pointer group hover:translate-y-[-1px] ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-400 shadow-md shadow-emerald-100'
                            : 'bg-white border-slate-150 hover:border-emerald-200 hover:bg-emerald-50/20'
                        }`}
                        id={`list-court-${court.id}`}
                      >
                        <div className="flex items-start justify-between gap-1 w-full flex-wrap">
                          <span className={`inline-block text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border leading-none ${
                            court.type === 'Indoor'
                              ? 'bg-purple-100 text-purple-700 border-purple-200'
                              : court.type === 'Covered'
                              ? 'bg-cyan-100 text-cyan-700 border-cyan-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {court.type}
                          </span>
                          
                          {distance !== null && (
                            <span className="text-[10px] text-slate-500 font-extrabold font-mono tracking-tight bg-slate-100 px-2 py-0.5 border border-slate-200 rounded-full leading-none shrink-0">
                              📍 {distance.toFixed(1)} km away
                            </span>
                          )}

                          {court.lights && (
                            <span className="text-[9px] text-emerald-600 font-black tracking-wider uppercase leading-none bg-emerald-50 px-1.5 py-0.5 border border-emerald-100 rounded-full">
                              ● LIGHTS
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-baseline justify-between gap-1.5 w-full">
                            <h4 className={`text-md font-sans font-black group-hover:text-emerald-800 transition-colors truncate max-w-[70%] ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                              {court.name}
                            </h4>
                            {avgR && (
                              <span className="text-[9px] text-amber-80 * font-extrabold flex items-center gap-0.5 shrink-0 bg-amber-50 border border-amber-200 py-0.5 px-1.5 rounded-full">
                                ⭐ {avgR}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
                            {court.location}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1 text-[10px] font-bold leading-none w-full">
                          <span className="text-slate-450 uppercase tracking-wider">
                            {court.courtCount} {court.courtCount > 1 ? 'Courts' : 'Court'}
                          </span>
                          <span className={court.checkedInPlayers.length > 0 ? 'text-emerald-6050 font-black tracking-wide' : 'text-slate-400'}>
                            {court.checkedInPlayers.length + (hasYou ? 1 : 0)} PLAYER{court.checkedInPlayers.length + (hasYou ? 1 : 0) !== 1 ? 'S' : ''} ACTIVE
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {processedCourts.length === 0 && (
                    <div className="text-xs text-slate-500 font-bold text-center py-10 bg-white border-2 border-slate-150 rounded-2xl">
                      No court matches your inputs. Try modifying the checklists or searching "Valencia"!
                    </div>
                  )}
                </div>

              </div>

              {/* Right Col: Map visualization on Top and Selected Court specifications Card directly below */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* Vector Map */}
                <InteractiveMap
                  courts={courts}
                  selectedCourtId={selectedCourtId}
                  onSelectCourt={(cId) => setSelectedCourtId(cId)}
                />

                {/* Expanded Details Spec */}
                <CourtDetails
                  court={selectedCourt}
                  currentUserCheckIn={selectedCourt.checkedInPlayers.includes(profileName)}
                  onToggleCheckIn={() => handleToggleCheckIn(selectedCourt.id)}
                  currentProfileName={profileName}
                  onSubmitReview={(rating, comment) => handleCommitReview(selectedCourt.id, rating, comment)}
                  bookings={bookings}
                  onBookSlot={handleCreateBooking}
                  onOpenDedicatedPage={setActiveCourtIdPage}
                  userDistance={
                    userCoords
                      ? getDistanceInKm(
                          userCoords.latitude,
                          userCoords.longitude,
                          selectedCourt.latitude,
                          selectedCourt.longitude
                        )
                      : null
                  }
                />

              </div>

            </div>
          </div>
        )}

        {/* GAMES SCHEDULING TAB VIEW */}
        {activeTab === 'games' && (
          <GamesCardList
            games={games}
            courts={courts}
            currentUserProfile={currentUserProfile}
            onJoinGame={(gameId) => handleJoinGame(gameId)}
            onLeaveGame={(gameId) => handleLeaveGame(gameId)}
            onCreateGame={(newGame) => handleCreateGame(newGame)}
          />
        )}

        {/* LEADERBOARD STANDINGS TAB VIEW */}
        {activeTab === 'rankings' && (
          <RankingsLeaderboard
            players={players}
            courts={courts}
            recentMatches={recentMatches}
            onSubmitMatch={(result) => handleCommitMatchResult(result)}
            currentProfileName={profileName}
            duprHistory={userDuprHistory}
          />
        )}

        {/* EVENTS TIMELINE & CLINICS TAB VIEW */}
        {activeTab === 'events' && (
          <EventsTimeline
            events={events}
            onRegisterForEvent={(eventId, pName) => handleRegisterForEvent(eventId, pName)}
            currentProfileName={profileName}
          />
        )}

        {/* RULES BOOK & COACHES Tab */}
        {activeTab === 'guides' && (
          <GuidesAndCoaches
            coaches={coaches}
            courts={courts}
          />
        )}

        {/* COURT BUSINESS PORTAL TAB */}
        {activeTab === 'owner_portal' && (
          <CourtOwnerDashboard
            courts={courts}
            ownerName={profileName}
            onUpdateCourtDirect={(updatedCourt) => {
              addSysLog(`Facility updated: "${updatedCourt.name}"`, 'Court', `Direct inventory configuration updated directly by Court Owner`);
              setCourts(prev => {
                const next = prev.map(c => c.id === updatedCourt.id ? updatedCourt : c);
                localStorage.setItem('p6200_courts', JSON.stringify(next));
                return next;
              });
            }}
            onAddCourtRequest={(newRequest) => {
              addSysLog(`Proposed new Court Arena: "${newRequest.title}"`, 'Court', `Submitted for SuperAdmin moderation:\nLocation: ${newRequest.details?.location || 'unspecified'}\nCourts count: ${newRequest.details?.courtCount}`);
              const fullRequest: UserRequest = {
                ...newRequest,
                id: `req-${Date.now()}`,
                submittedAt: new Date().toISOString(),
                status: 'Pending'
              };
              setUserRequests(prev => {
                const next = [...prev, fullRequest];
                localStorage.setItem('p6200_user_requests', JSON.stringify(next));
                return next;
              });
            }}
            userRequests={userRequests}
            bookings={bookings}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onDeleteBooking={handleDeleteBooking}
          />
        )}

        {/* SUPERADMIN OPERATOR TAB */}
        {activeTab === 'admin_portal' && (
          <SuperAdminDashboard
            courts={courts}
            setCourts={setCourts}
            players={players}
            setPlayers={setPlayers}
            coaches={coaches}
            setCoaches={setCoaches}
            events={events}
            setEvents={setEvents}
            recentMatches={recentMatches}
            setRecentMatches={setRecentMatches}
            userRequests={userRequests}
            setUserRequests={setUserRequests}
            frontendConfig={frontendConfig}
            setFrontendConfig={setFrontendConfig}
            appRole={appRole}
            setAppRole={setAppRole}
            impersonatorActive={impersonatorActive}
            setImpersonatorActive={setImpersonatorActive}
            activityLogs={activityLogs}
            onAddSysLog={addSysLog}
            onClearLogs={clearSysLogs}
            setActiveTab={setActiveTab}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-emerald-900 text-emerald-100 border-t-4 border-emerald-950 mt-16 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col gap-6 font-sans text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white">🏓</span>
              <span className="font-extrabold text-white">DUMAPICKLE 6200</span>
              <span className="text-emerald-300/80">· Serving Negros Oriental court-by-court since 2026.</span>
            </div>
            <div className="flex items-center gap-4 text-emerald-300 font-bold">
              <button 
                onClick={() => setActiveLegalTab('privacy')} 
                className="hover:text-white transition-colors cursor-pointer text-xs font-bold bg-transparent border-0 py-0 px-0"
              >
                Privacy Policy
              </button>
              <span>·</span>
              <button 
                onClick={() => setActiveLegalTab('terms')} 
                className="hover:text-white transition-colors cursor-pointer text-xs font-bold bg-transparent border-0 py-0 px-0"
              >
                Terms of Service
              </button>
              <span>·</span>
              <span className="text-amber-400 font-black uppercase tracking-widest font-mono text-[9px] bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-full leading-none">6200 CORE v2.4</span>
            </div>
          </div>

          {/* Secure Operator Portals Access Point */}
          <div className="border-t border-emerald-800/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-emerald-300 font-mono tracking-wide uppercase font-bold">
              🔒 Operator & Administration Gateways:
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setAppRole('CourtOwner');
                  setActiveTab('owner_portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3.5 py-1.5 rounded-lg border text-[10px] sm:text-[11px] font-black uppercase transition-all tracking-wider flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] ${
                  appRole === 'CourtOwner' && activeTab === 'owner_portal'
                    ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-emerald-950/60 border-emerald-800 text-amber-300 hover:bg-emerald-950 hover:text-white hover:border-amber-400/40'
                }`}
              >
                <span>🚨 Court Owner Portal</span>
              </button>

              <button
                onClick={() => {
                  setAppRole('SuperAdmin');
                  setActiveTab('admin_portal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3.5 py-1.5 rounded-lg border text-[10px] sm:text-[11px] font-black uppercase transition-all tracking-wider flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] ${
                  appRole === 'SuperAdmin' && activeTab === 'admin_portal'
                    ? 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-emerald-950/60 border-emerald-800 text-rose-350 hover:bg-emerald-950 hover:text-white hover:border-rose-400/40'
                }`}
              >
                <span>🛡️ SuperAdmin Operator</span>
              </button>

              <button
                onClick={() => {
                  setAppRole('Player');
                  setActiveTab('courts');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3.5 py-1.5 rounded-lg border text-[10px] sm:text-[11px] font-black uppercase transition-all tracking-wider flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] ${
                  appRole === 'Player' && activeTab === 'courts'
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                    : 'bg-emerald-950/30 border-emerald-800/50 text-emerald-350 hover:bg-emerald-950 hover:text-white'
                }`}
              >
                <span>Athlete Mode (Public)</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t-2 border-emerald-150 dark:border-slate-800 py-2 px-3 flex items-center justify-around z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => {
            setActiveTab('courts');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1.5 py-1 text-[9px] font-black uppercase tracking-wider transition-colors ${
            activeTab === 'courts' ? 'text-emerald-500 font-black' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Map className="w-4.5 h-4.5" />
          <span>Courts</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('games');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1.5 py-1 text-[9px] font-black uppercase tracking-wider transition-colors ${
            activeTab === 'games' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-4.5 h-4.5" />
          <span>Games</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('rankings');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1.5 py-1 text-[9px] font-black uppercase tracking-wider transition-colors ${
            activeTab === 'rankings' ? 'text-emerald-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4.5 h-4.5" />
          <span>Ladder</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('events');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1.5 py-1 text-[9px] font-black uppercase tracking-wider transition-colors ${
            activeTab === 'events' ? 'text-emerald-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4.5 h-4.5" />
          <span>Events</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('guides');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center gap-1.5 py-1 text-[9px] font-black uppercase tracking-wider transition-colors ${
            activeTab === 'guides' ? 'text-emerald-500 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4.5 h-4.5" />
          <span>Guides</span>
        </button>
        {appRole === 'CourtOwner' && (
          <button
            onClick={() => {
              setActiveTab('owner_portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1.5 py-1 text-[9px] font-black uppercase tracking-wider transition-colors ${
              activeTab === 'owner_portal' ? 'text-amber-500 font-bold' : 'text-slate-400'
            }`}
          >
            <Building2 className="w-4.5 h-4.5" />
            <span>Owner</span>
          </button>
        )}
        {appRole === 'SuperAdmin' && (
          <button
            onClick={() => {
              setActiveTab('admin_portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center gap-1.5 py-1 text-[9px] font-black uppercase tracking-wider transition-colors ${
              activeTab === 'admin_portal' ? 'text-rose-500 font-bold' : 'text-slate-400'
            }`}
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            <span>Admin</span>
          </button>
        )}
      </nav>

      {/* REGULATORY COMPLIANCE LEGAL HUBS & OVERLAYS */}
      <RegulatoryCompliance 
        activeDoc={activeLegalTab} 
        onClose={() => setActiveLegalTab(null)} 
      />

      {/* REGULATORY COMPLIANCE NOTIFICATION BAR */}
      {!complianceAccepted && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[480px] z-[95] bg-slate-900 border-2 border-emerald-500/30 text-white rounded-3xl p-5 shadow-2xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <span className="text-xl">🛡️</span>
            <div>
              <h4 className="font-extrabold text-[11px] uppercase text-emerald-400 tracking-wider">
                Philippine Data Privacy Act R.A.10173 Consent
              </h4>
              <p className="text-[10px] text-slate-300 mt-1 leading-relaxed font-sans">
                DumaPickle 6200 collects essential performance ELO values and court bookings in Negros Oriental to maintain tournament Integrity. Accessing features implies full agreement with our compliance terms.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 pt-3 mt-1.5 text-xs">
            <div className="flex items-center gap-2.5 text-[10px] text-slate-400 font-bold font-sans">
              <button 
                onClick={() => setActiveLegalTab('privacy')} 
                className="hover:text-emerald-400 underline transition cursor-pointer bg-transparent border-0 py-0 px-0"
              >
                Privacy Clauses
              </button>
              <span>·</span>
              <button 
                onClick={() => setActiveLegalTab('terms')} 
                className="hover:text-emerald-400 underline transition cursor-pointer bg-transparent border-0 py-0 px-0"
              >
                Full Terms
              </button>
            </div>
            <button
              onClick={() => {
                localStorage.setItem('p6200_compliance_accepted', 'true');
                setComplianceAccepted(true);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-slate-950 font-black uppercase text-[9px] tracking-wider rounded-xl cursor-pointer shadow-md shadow-emerald-500/20"
            >
              Acknowledge & Sync
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
