import React, { useState } from 'react';
import { Court, Player, Coach, TournamentEvent, MatchResult, UserRequest, FrontendConfig, ActivityLog } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Map, 
  Trophy, 
  FileText, 
  Save, 
  Check, 
  X, 
  UserPlus, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Volume2, 
  Sliders, 
  PhoneCall, 
  Mail, 
  Award,
  Clock,
  ListFilter,
  Activity,
  User,
  ShieldAlert,
  Trash
} from 'lucide-react';

interface SuperAdminDashboardProps {
  courts: Court[];
  setCourts: React.Dispatch<React.SetStateAction<Court[]>>;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  coaches: Coach[];
  setCoaches: React.Dispatch<React.SetStateAction<Coach[]>>;
  events: TournamentEvent[];
  setEvents: React.Dispatch<React.SetStateAction<TournamentEvent[]>>;
  recentMatches: MatchResult[];
  setRecentMatches: React.Dispatch<React.SetStateAction<MatchResult[]>>;
  userRequests: UserRequest[];
  setUserRequests: React.Dispatch<React.SetStateAction<UserRequest[]>>;
  frontendConfig: FrontendConfig;
  setFrontendConfig: React.Dispatch<React.SetStateAction<FrontendConfig>>;
  
  // Impersonation and Log props
  appRole: 'Player' | 'CourtOwner' | 'SuperAdmin';
  setAppRole: (role: 'Player' | 'CourtOwner' | 'SuperAdmin') => void;
  impersonatorActive: boolean;
  setImpersonatorActive: (active: boolean) => void;
  activityLogs: ActivityLog[];
  onAddSysLog: (action: string, category: ActivityLog['category'], details?: string) => void;
  onClearLogs: () => void;
  setActiveTab: (tab: 'courts' | 'games' | 'rankings' | 'events' | 'guides' | 'owner_portal' | 'admin_portal') => void;
}

export default function SuperAdminDashboard({
  courts,
  setCourts,
  players,
  setPlayers,
  coaches,
  setCoaches,
  events,
  setEvents,
  recentMatches,
  setRecentMatches,
  userRequests,
  setUserRequests,
  frontendConfig,
  setFrontendConfig,
  appRole,
  setAppRole,
  impersonatorActive,
  setImpersonatorActive,
  activityLogs,
  onAddSysLog,
  onClearLogs,
  setActiveTab
}: SuperAdminDashboardProps) {
  // Tabs management
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'requests' | 'front-edit' | 'players-ledger' | 'courts-ledger' | 'system-analytics' | 'audit-logs'>('requests');

  // Player Edit States inside database ledger
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editPlayerName, setEditPlayerName] = useState('');
  const [editPlayerDupr, setEditPlayerDupr] = useState(3.50);
  const [editPlayerGender, setEditPlayerGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [editPlayerHometown, setEditPlayerHometown] = useState('');
  const [editPlayerWins, setEditPlayerWins] = useState(0);
  const [editPlayerLosses, setEditPlayerLosses] = useState(0);
  const [editPlayerRole, setEditPlayerRole] = useState<'Player' | 'CourtOwner' | 'SuperAdmin'>('Player');
  const [editPlayerIsHidden, setEditPlayerIsHidden] = useState(false);

  // Court Edit states inside court console ledger
  const [editingCourtId, setEditingCourtId] = useState<string | null>(null);
  const [editCourtName, setEditCourtName] = useState('');
  const [editCourtLocation, setEditCourtLocation] = useState('');
  const [editCourtType, setEditCourtType] = useState<'Indoor' | 'Outdoor' | 'Covered'>('Outdoor');
  const [editCourtSurface, setEditCourtSurface] = useState<'Cushioned Acrylic' | 'Concrete' | 'Wooden Court' | 'Sport Tile' | 'Asphalt' | 'Sport Court'>('Cushioned Acrylic');
  const [editCourtCount, setEditCourtCount] = useState(1);
  const [editCourtLights, setEditCourtLights] = useState(true);
  const [editCourtRentalFee, setEditCourtRentalFee] = useState(150);
  const [editCourtFeeUnit, setEditCourtFeeUnit] = useState('hour');
  const [editCourtContact, setEditCourtContact] = useState('');
  const [editCourtDescription, setEditCourtDescription] = useState('');
  const [editCourtIsHidden, setEditCourtIsHidden] = useState(false);
  const [editCourtOwnerName, setEditCourtOwnerName] = useState('');
  const [editCourtThemeColor, setEditCourtThemeColor] = useState<'emerald' | 'amber' | 'indigo' | 'rose' | 'slate' | 'sky' | 'teal' | 'orange'>('emerald');
  const [editCourtCustomSlots, setEditCourtCustomSlots] = useState('');

  // Input states for inserting new players manually
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerDupr, setNewPlayerDupr] = useState(3.50);
  const [newPlayerContact, setNewPlayerContact] = useState('');
  const [newPlayerHometown, setNewPlayerHometown] = useState('Dumaguete City');
  const [newPlayerGender, setNewPlayerGender] = useState<'Male' | 'Female' | 'Other'>('Male');

  // Notification banners
  const [auditMessage, setAuditMessage] = useState('');

  // Frontend local form editor states
  const [tickerText, setTickerText] = useState(frontendConfig.announcementTicker);
  const [headTitle, setHeadTitle] = useState(frontendConfig.heroTitle);
  const [headSub, setHeadSub] = useState(frontendConfig.heroSubtitle);
  const [contactP, setContactP] = useState(frontendConfig.contactPhone);
  const [contactE, setContactE] = useState(frontendConfig.contactEmail);
  const [rulesN, setRulesN] = useState(frontendConfig.hubRulesNotice);
  const [tickerVis, setTickerVis] = useState(frontendConfig.isTickerVisible);
  const [alertType, setAlertType] = useState<'info' | 'success' | 'warning' | 'error'>(frontendConfig.featuredAlertLevel);

  // Stats calculators
  const totalCheckIns = courts.reduce((sum, c) => sum + (c.checkedInPlayers?.length || 0), 0);
  const pendingRequestsCount = userRequests.filter(r => r.status === 'Pending').length;

  // Handle Frontend Configuration Savings
  const handleSaveFrontendConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FrontendConfig = {
      announcementTicker: tickerText,
      heroTitle: headTitle,
      heroSubtitle: headSub,
      contactPhone: contactP,
      contactEmail: contactE,
      hubRulesNotice: rulesN,
      isTickerVisible: tickerVis,
      featuredAlertLevel: alertType
    };
    setFrontendConfig(updated);
    localStorage.setItem('p6200_frontend_config', JSON.stringify(updated));
    onAddSysLog('Updated frontend configuration', 'Admin', `Title changed to: "${headTitle}"`);
    setAuditMessage('Frontend layout variables updated live! Players will see the changes immediately on reload.');
    setTimeout(() => setAuditMessage(''), 4505);
  };

  // Process Requests approvals/rejections
  const handleProcessRequest = (requestId: string, status: 'Approved' | 'Rejected') => {
    const targetReq = userRequests.find(r => r.id === requestId);
    if (!targetReq) return;

    // Execute business logic based on request types
    if (status === 'Approved') {
      try {
        if (targetReq.type === 'NewCourtSuggestion') {
          // Add proposed court into active system list
          const details = targetReq.details;
          const newCourtId = details.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
          
          const expandedCourt: Court = {
            id: newCourtId,
            name: details.name,
            location: details.location,
            type: details.type || 'Outdoor',
            surface: details.surface || 'Concrete',
            courtCount: Number(details.courtCount || 2),
            lights: details.lights !== undefined ? details.lights : true,
            rentalFee: Number(details.rentalFee || 0),
            feeUnit: details.feeUnit || 'hour',
            contact: details.contact || 'None',
            description: details.description || 'Welcome to this beautiful new arena.',
            checkInCount: 0,
            checkedInPlayers: [],
            restrooms: details.restrooms !== undefined ? details.restrooms : true,
            accessibility: details.accessibility !== undefined ? details.accessibility : true,
            reviews: [],
            images: details.images || [],
            latitude: Number(details.latitude || 9.3060),
            longitude: Number(details.longitude || 123.3090)
          };

          setCourts(prev => {
            const next = [...prev, expandedCourt];
            localStorage.setItem('p6200_courts', JSON.stringify(next));
            return next;
          });
          onAddSysLog(`Approved installation proposal: "${details.name}"`, 'Court', `Location: ${details.location}`);
          setAuditMessage(`Approved new play court: "${details.name}" is now dynamically listed on the interactive map!`);

        } else if (targetReq.type === 'CoachApplication') {
          // Insert coach into general listings
          const details = targetReq.details;
          const colors = ['bg-orange-500', 'bg-purple-500', 'bg-indigo-500', 'bg-teal-500', 'bg-pink-500'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];

          const newCoach: Coach = {
            id: `coach-${Date.now()}`,
            name: details.name,
            certification: details.certification || 'Certified Professional',
            rate: details.rate || '₱300 / hr',
            specialty: details.specialty || 'General Pickleball Instruction',
            contact: details.contact || '+63 900 000 0000',
            avatarColor: randomColor,
            availability: details.availability || 'Weekends / Evenings'
          };

          setCoaches(prev => {
            const next = [...prev, newCoach];
            localStorage.setItem('p6200_coaches', JSON.stringify(next));
            return next;
          });
          onAddSysLog(`Approved Coach credentialing: "${details.name}"`, 'Coach', `Certified specialty level: ${details.specialty}`);
          setAuditMessage(`Approved Coach: "${details.name}" has been inducted with a public certified instructor badge!`);

        } else if (targetReq.type === 'MatchVerification') {
          // Update standing scores of winners & losers & insert historic result
          const details = targetReq.details;
          const winnersArray: string[] = details.winnerNames || [];
          const losersArray: string[] = details.loserNames || [];

          // 1. DUPR Adjustments - Winners gain +0.12, Losers lose -0.08
          setPlayers(prev => {
            const next = prev.map(p => {
              const lowercaseName = p.name.toLowerCase();
              const isWinner = winnersArray.some(w => lowercaseName.includes(w.toLowerCase()) || w.toLowerCase().includes(lowercaseName));
              const isLoser = losersArray.some(l => lowercaseName.includes(l.toLowerCase()) || l.toLowerCase().includes(lowercaseName));

              if (isWinner) {
                return {
                  ...p,
                  wins: p.wins + 1,
                  duprRating: Number((Math.min(6.0, p.duprRating + 0.12)).toFixed(2))
                };
              } else if (isLoser) {
                return {
                  ...p,
                  losses: p.losses + 1,
                  duprRating: Number((Math.max(1.0, p.duprRating - 0.08)).toFixed(2))
                };
              }
              return p;
            });
            localStorage.setItem('p6200_players', JSON.stringify(next));
            return next;
          });

          // 2. Insert match into active global feed
          const verifiedMatch: MatchResult = {
            id: `mr-verify-${Date.now()}`,
            courtId: details.courtId || 'the-ryze',
            courtName: details.courtName || 'The Ryze Dumaguete',
            date: details.date || '2026-05-26',
            winnerIds: details.winnerIds || [],
            winnerNames: winnersArray,
            loserIds: details.loserIds || [],
            loserNames: losersArray,
            score: details.score || '11-9',
            submittedAt: new Date().toISOString()
          };

          setRecentMatches(prev => {
            const next = [verifiedMatch, ...prev];
            localStorage.setItem('p6200_recent_matches', JSON.stringify(next));
            return next;
          });

          onAddSysLog(`Verified match scoring result: ${winnersArray.join(', ')} beat ${losersArray.join(', ')}`, 'Match', `Score: ${details.score} at ${details.courtName}`);
          setAuditMessage(`Match score verified! Rating ledger calibrated: winners DUPR rating boosted.`);

        } else if (targetReq.type === 'SpecialEventPermit') {
          // Create tournament/clinic event
          const details = targetReq.details;
          const newEvent: TournamentEvent = {
            id: `evt-${Date.now()}`,
            title: details.title,
            description: details.description,
            date: details.date,
            time: details.time,
            type: details.type || 'Tournament',
            fee: Number(details.fee || 0),
            location: details.location,
            spotsAvailable: Number(details.maxSpots || 16),
            maxSpots: Number(details.maxSpots || 16),
            registeredPlayers: []
          };

          setEvents(prev => {
            const next = [...prev, newEvent];
            localStorage.setItem('p6200_events', JSON.stringify(next));
            return next;
          });
          onAddSysLog(`Approved tournament / special event permit: "${newEvent.title}"`, 'Event', `Type: ${newEvent.type}, spots left: ${newEvent.spotsAvailable}`);
          setAuditMessage(`Approved Community Event "${details.title}" is now published to the timeline!`);
        }
      } catch (err: any) {
        onAddSysLog(`Permit Approval Interruption: ${err.message}`, 'Admin', 'Critical payload mapping issue');
        setAuditMessage(`Approval Error: Failed to process selection permit. Details: ${err.message}`);
      }
    } else {
      onAddSysLog(`Rejected proposal request item: ID ${requestId}`, 'Admin', `Target type: ${targetReq.type}`);
      setAuditMessage(`Action: Request was rejected/dismissed securely.`);
    }

    // Set request status & save to state
    setUserRequests(prev => {
      const next = prev.map(r => r.id === requestId ? { ...r, status } : r);
      localStorage.setItem('p6200_user_requests', JSON.stringify(next));
      return next;
    });

    setTimeout(() => setAuditMessage(''), 4500);
  };

  // Direct Player Ledger Control Handlers
  const handleCreatePlayerManually = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;

    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-indigo-500', 'bg-teal-500', 'bg-rose-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const added: Player = {
      id: `man-p-${Date.now()}`,
      name: newPlayerName.trim(),
      duprRating: Number(newPlayerDupr),
      wins: 0,
      losses: 0,
      avatarColor: randomColor,
      contact: newPlayerContact.trim() || undefined,
      hometown: newPlayerHometown.trim() || undefined,
      gender: newPlayerGender
    };

    setPlayers(prev => {
      const next = [...prev, added];
      localStorage.setItem('p6200_players', JSON.stringify(next));
      return next;
    });

    onAddSysLog(`Manually registered core player: "${newPlayerName}"`, 'Account', `DUPR Rate: ${newPlayerDupr}, Gender: ${newPlayerGender}`);
    setAuditMessage(`Manually added Player candidate "${newPlayerName}" to the Negros Oriental standings ledger!`);
    setNewPlayerName('');
    setNewPlayerContact('');
    setTimeout(() => setAuditMessage(''), 4000);
  };

  const handleDeletePlayer = (playerId: string) => {
    const targetPlayer = players.find(p => p.id === playerId);
    if (!window.confirm(`Are you absolutely sure you want to dismiss this athlete profile ("${targetPlayer?.name || playerId}")?`)) return;
    setPlayers(prev => {
      const next = prev.filter(p => p.id !== playerId);
      localStorage.setItem('p6200_players', JSON.stringify(next));
      return next;
    });
    onAddSysLog(`Dismissed player profile: "${targetPlayer?.name || playerId}"`, 'Admin', `Had rating: ${targetPlayer?.duprRating || 'N/A'}`);
    setAuditMessage('Player dismissed from standings successfully.');
    setTimeout(() => setAuditMessage(''), 3000);
  };

  // Player editing actions
  const handleSelectEditPlayer = (p: Player) => {
    setEditingPlayerId(p.id);
    setEditPlayerName(p.name);
    setEditPlayerDupr(p.duprRating);
    setEditPlayerGender(p.gender || 'Male');
    setEditPlayerHometown(p.hometown || 'Dumaguete');
    setEditPlayerWins(p.wins);
    setEditPlayerLosses(p.losses);
    setEditPlayerRole(p.role || 'Player');
    setEditPlayerIsHidden(!!p.isHidden);
  };

  const handleSaveEditedPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlayerId) return;

    setPlayers(prev => {
      const next = prev.map(p => {
        if (p.id === editingPlayerId) {
          return {
            ...p,
            name: editPlayerName,
            duprRating: Number(editPlayerDupr),
            gender: editPlayerGender,
            hometown: editPlayerHometown,
            wins: Number(editPlayerWins),
            losses: Number(editPlayerLosses),
            role: editPlayerRole,
            isHidden: editPlayerIsHidden
          };
        }
        return p;
      });
      localStorage.setItem('p6200_players', JSON.stringify(next));
      return next;
    });

    onAddSysLog(`SuperAdmin modified athlete config: "${editPlayerName}"`, 'Admin', `Rating: ${editPlayerDupr}, Role: ${editPlayerRole}, Hidden: ${editPlayerIsHidden}`);
    setAuditMessage(`Successfully synchronized member account changes for "${editPlayerName}"!`);
    setEditingPlayerId(null);
    setTimeout(() => setAuditMessage(''), 3500);
  };

  // Court editing actions
  const handleSelectEditCourt = (c: Court) => {
    setEditingCourtId(c.id);
    setEditCourtName(c.name);
    setEditCourtLocation(c.location);
    setEditCourtType(c.type);
    setEditCourtSurface(c.surface);
    setEditCourtCount(c.courtCount);
    setEditCourtLights(c.lights);
    setEditCourtRentalFee(c.rentalFee);
    setEditCourtFeeUnit(c.feeUnit);
    setEditCourtContact(c.contact);
    setEditCourtDescription(c.description);
    setEditCourtIsHidden(!!c.isHidden);
    setEditCourtOwnerName(c.ownerName || '');
    setEditCourtThemeColor(c.themeColor || 'emerald');
    setEditCourtCustomSlots(c.customSlots ? c.customSlots.join(', ') : '');
  };

  const handleSaveEditedCourt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourtId) return;

    setCourts(prev => {
      const next = prev.map(c => {
        if (c.id === editingCourtId) {
          return {
            ...c,
            name: editCourtName,
            location: editCourtLocation,
            type: editCourtType,
            surface: editCourtSurface,
            courtCount: Number(editCourtCount),
            lights: editCourtLights,
            rentalFee: Number(editCourtRentalFee),
            feeUnit: editCourtFeeUnit,
            contact: editCourtContact,
            description: editCourtDescription,
            isHidden: editCourtIsHidden,
            ownerName: editCourtOwnerName,
            themeColor: editCourtThemeColor,
            customSlots: editCourtCustomSlots ? editCourtCustomSlots.split(',').map(s => s.trim()).filter(Boolean) : undefined
          };
        }
        return c;
      });
      localStorage.setItem('p6200_courts', JSON.stringify(next));
      return next;
    });

    onAddSysLog(`SuperAdmin customized court listings: "${editCourtName}"`, 'Admin', `Hidden: ${editCourtIsHidden}, Configured Theme: ${editCourtThemeColor}`);
    setAuditMessage(`Successfully customized arena parameters for "${editCourtName}"!`);
    setEditingCourtId(null);
    setTimeout(() => setAuditMessage(''), 3500);
  };

  const handleDeleteCourt = (courtId: string, name: string) => {
    if (!window.confirm(`Are you completely sure you want to permanently purge "${name}" from Negros listings directory?`)) return;

    setCourts(prev => {
      const next = prev.filter(c => c.id !== courtId);
      localStorage.setItem('p6200_courts', JSON.stringify(next));
      return next;
    });

    onAddSysLog(`SuperAdmin purged court: "${name}"`, 'Admin', `Fully removed standard row entry`);
    setAuditMessage(`Permanent facility purge for "${name}" completed successfully.`);
    setTimeout(() => setAuditMessage(''), 3550);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-slate-100 font-sans">
      
      {/* Super Header Banner */}
      <div className="bg-slate-900 border-b-4 border-emerald-500 rounded-3xl p-6.5 text-white shadow-xl relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-[300px] h-full bg-emerald-500/10 blur-[100px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest leading-none">
              <ShieldCheck className="w-3.5 h-3.5" /> SuperAdmin Console Mode
            </div>
            <h2 className="text-xl md:text-2xl font-black font-display tracking-tight leading-tight">
              Universal Platform Operator Dashboard
            </h2>
            <p className="text-slate-400 text-xs font-semibold leading-relaxed">
              Global system monitoring, responsive database auditing, and immediate layout content override controllers.
            </p>
          </div>

          <div className="flex flex-wrap bg-slate-950 p-1.5 rounded-2xl gap-1 shrink-0 border border-slate-800">
            <button
              onClick={() => setActiveAdminSubTab('requests')}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeAdminSubTab === 'requests'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Requests ({pendingRequestsCount})
            </button>
            <button
              onClick={() => setActiveAdminSubTab('front-edit')}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeAdminSubTab === 'front-edit'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Frontend Config
            </button>
            <button
              onClick={() => { setActiveAdminSubTab('players-ledger'); setEditingPlayerId(null); }}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeAdminSubTab === 'players-ledger'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Players Ledger
            </button>
            <button
              onClick={() => { setActiveAdminSubTab('courts-ledger'); setEditingCourtId(null); }}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeAdminSubTab === 'courts-ledger'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Courts Console
            </button>
            <button
              onClick={() => setActiveAdminSubTab('system-analytics')}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeAdminSubTab === 'system-analytics'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveAdminSubTab('audit-logs')}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeAdminSubTab === 'audit-logs'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              System Logs
            </button>
          </div>
        </div>
      </div>

      {/* Audit System message banner */}
      {auditMessage && (
        <div className="bg-amber-400 text-amber-955 p-4 rounded-2xl font-sans text-xs font-bold text-left flex items-center gap-3 animate-bounce-slow border-2 border-amber-500 shadow-sm shadow-amber-250">
          <Sparkles className="w-5 h-5 text-amber-950 shrink-0" />
          <span>{auditMessage}</span>
        </div>
      )}

      {/* 🕵️ Role Impersonation Dashboard Console */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-2 border-dashed border-amber-505/30 rounded-3xl p-5 text-left space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase text-amber-620 dark:text-amber-400 tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-amber-500 shrink-0" /> Dynamic Role Impersonation Hub
            </h3>
            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Temporarily assume standard portal sessions to verify, update, and manage the system from a Court Owner or Athlete's perspective. You can instantly return to the Admin Operator panel at any point via the warning ribbon shown at the top of the portal.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => {
                setImpersonatorActive(true);
                setAppRole('CourtOwner');
                onAddSysLog('Initiated impersonation as Court Owner', 'Impersonation', 'Operator representing localized court facility managers (Court Owner)');
                setActiveTab('owner_portal');
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 border-b-2 border-amber-700 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <ShieldAlert className="w-3.5 h-3.5" /> Impersonate Court Owner
            </button>
            <button
              onClick={() => {
                setImpersonatorActive(true);
                setAppRole('Player');
                onAddSysLog('Initiated impersonation as Public Athlete User', 'Impersonation', 'Operator representing localized Athlete profile "George T."');
                setActiveTab('courts');
              }}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 border-b-2 border-amber-700 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <User className="w-3.5 h-3.5" /> Impersonate Athlete
            </button>
          </div>
        </div>
      </div>

      {/* Tab Panel contents */}
      {activeAdminSubTab === 'requests' ? (
        /* ================= PENDING REQUESTS PANEL ================= */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left">
            <div className="flex items-center justify-between border-b pb-3 mb-4 dark:border-slate-850">
              <div className="space-y-0.5">
                <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white">Pending Requests Board</h3>
                <p className="text-[11px] text-slate-400">Moderate applications submitted by court owners and coaches in Negros Oriental.</p>
              </div>
              <span className="text-[10px] font-mono bg-amber-100 dark:bg-slate-950 text-amber-850 dark:text-amber-400 border border-amber-250 dark:border-slate-800 font-extrabold px-3 py-1 rounded-full leading-none">
                {pendingRequestsCount} WAITING AUDIT
              </span>
            </div>

            {userRequests.filter(r => r.status === 'Pending').length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-405 border border-dashed border-slate-205 rounded-2xl px-4 text-center space-y-2 dark:border-slate-800">
                <ShieldCheck className="w-8 h-8 text-slate-300" />
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-500">All Operations Clear!</h4>
                  <p className="text-[11px] text-slate-400 leading-normal max-w-sm mt-1">
                    No pending match scores, arena proposals, or certified coach registries are awaiting your verification. Everything is up to date!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userRequests
                  .filter(r => r.status === 'Pending')
                  .map((req) => (
                    <div
                      key={`admin-req-${req.id}`}
                      className="bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2 text-xs flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest font-mono border ${
                            req.type === 'NewCourtSuggestion'
                              ? 'bg-purple-100 text-purple-700 border-purple-200'
                              : req.type === 'CoachApplication'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : req.type === 'MatchVerification'
                              ? 'bg-blue-100 text-blue-700 border-blue-200'
                              : 'bg-amber-100 text-amber-800 border-amber-200'
                          }`}>
                            {req.type}
                          </span>
                          <span className="text-slate-450 text-[10px] uppercase font-bold tracking-tight">Requested by: <strong className="text-slate-650 dark:text-slate-350">{req.submittedBy}</strong></span>
                          <span className="text-[10px] text-slate-400 font-mono tracking-tight ml-auto md:ml-0">· {req.submittedAt.split('T')[0]}</span>
                        </div>

                        <div className="text-left space-y-1">
                          <h4 className="font-sans font-black text-slate-900 dark:text-white leading-normal text-sm">{req.title}</h4>
                          <p className="text-slate-600 dark:text-slate-400 leading-normal">{req.description}</p>
                        </div>

                        {/* Expandable details preview for specific requests */}
                        {req.type === 'MatchVerification' && req.details && (
                          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-md text-[11px] space-y-1 text-slate-600 dark:text-slate-450 leading-relaxed font-semibold">
                            <span className="text-[8px] font-sans font-black uppercase tracking-widest text-slate-400">Match score data blueprint:</span>
                            <div className="grid grid-cols-2 gap-1.5 font-mono pt-1">
                              <div>🏆 Winners: <strong className="text-emerald-700">{req.details.winnerNames?.join(' + ')}</strong></div>
                              <div>😢 Losers: <strong className="text-rose-600">{req.details.loserNames?.join(' + ')}</strong></div>
                              <div>🏓 Arena: <strong>{req.details.courtName}</strong></div>
                              <div>📊 Score: <strong>{req.details.score}</strong></div>
                            </div>
                          </div>
                        )}

                        {req.type === 'NewCourtSuggestion' && req.details && (
                          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-relaxed text-[11px] text-slate-600 dark:text-slate-450 space-y-1">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">PROPOSED ARENA BLUEPRINT</span>
                            <div>Address: <strong>{req.details.location}</strong> ({req.details.latitude}, {req.details.longitude})</div>
                            <div>Details: <strong>{req.details.courtCount} courts</strong> · <strong>{req.details.type}</strong> · {req.details.surface} surface · Fee: ₱{req.details.rentalFee}/{req.details.feeUnit}</div>
                            {req.details.images && req.details.images.length > 0 && (
                              <div className="flex gap-1 pt-1.5">
                                {req.details.images.map((imgUrl: string, idx: number) => (
                                  <img key={`req-img-${idx}`} src={imgUrl} alt="" className="w-8 h-8 rounded-md object-cover border" referrerPolicy="no-referrer" />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {req.type === 'CoachApplication' && req.details && (
                          <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-[11px] text-slate-600 dark:text-slate-450 leading-relaxed space-y-1">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">APPLICANT INSTRUCTOR BRIEF</span>
                            <div>Certifications: <strong>{req.details.certification}</strong></div>
                            <div>Preferred specialties: <strong>{req.details.specialty}</strong></div>
                            <div>Rates: <strong>{req.details.rate}</strong> · Availability: <strong>{req.details.availability}</strong></div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 shrink-0 md:flex-col justify-end">
                        <button
                          onClick={() => handleProcessRequest(req.id, 'Approved')}
                          className="px-4.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-sm transition"
                        >
                          <Check className="w-4 h-4 shrink-0" /> Approve Application
                        </button>
                        <button
                          onClick={() => handleProcessRequest(req.id, 'Rejected')}
                          className="px-4.5 py-2.5 bg-slate-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer transition border border-slate-350 hover:border-rose-205"
                        >
                          <X className="w-4 h-4 shrink-0" /> Reject / Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : activeAdminSubTab === 'front-edit' ? (
        /* ================= FRONTEND CONFIGURATOR Zone ================= */
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-6.5 shadow-sm text-left">
          <div className="border-b pb-3 mb-5 border-slate-100 dark:border-slate-850">
            <h3 className="font-extrabold text-sm uppercase text-slate-905 dark:text-white flex items-center gap-1">
              <Sliders className="w-4 h-4 text-emerald-600" /> Edit Dynamic Frontend Information
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              Alter global values, notification ribbons, rules sheets, and contact methods in the layout directly.
            </p>
          </div>

          <form onSubmit={handleSaveFrontendConfig} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Hero Hub title (Editable)</label>
                  <input
                    type="text"
                    required
                    value={headTitle}
                    onChange={(e) => setHeadTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-100 font-sans font-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-455 uppercase tracking-widest mb-1.5 font-bold">Hero community Subtitle (Editable)</label>
                  <input
                    type="text"
                    required
                    value={headSub}
                    onChange={(e) => setHeadSub(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-800 dark:text-slate-100 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Rules notice block summary</label>
                  <textarea
                    rows={4}
                    required
                    value={rulesN}
                    onChange={(e) => setRulesN(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 resize-none font-medium leading-relaxed"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Main Hotline Phone</label>
                    <input
                      type="text"
                      required
                      value={contactP}
                      onChange={(e) => setContactP(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-450 uppercase tracking-widest mb-1.5 font-bold">Operator Support Email</label>
                    <input
                      type="email"
                      required
                      value={contactE}
                      onChange={(e) => setContactE(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-850 rounded-xl px-3 py-2 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Announcement Ticker Section */}
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider">📢 Announcement Alert Ticker</span>
                    <label className="flex items-center gap-1.5 text-[10px] font-black text-slate-650 cursor-pointer user-select-none">
                      <input
                        type="checkbox"
                        checked={tickerVis}
                        onChange={(e) => setTickerVis(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4.5 h-4.5"
                      />
                      <span>Live Ticker Active</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1 font-bold">Ticker text content</label>
                    <input
                      type="text"
                      value={tickerText}
                      onChange={(e) => setTickerText(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-805 text-left font-sans font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <div>
                      <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Alert Ribbon styling:</label>
                      <select
                        value={alertType}
                        onChange={(e) => setAlertType(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-800 px-2.0 py-1 rounded-lg"
                      >
                        <option value="info">Interactive Emerald Blue</option>
                        <option value="success">Success Meadow Olive</option>
                        <option value="warning">Warning Gold Amber</option>
                        <option value="error">Critical Salmon Crimson</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <button
              type="submit"
              className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-amber-955 font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_0_0_#d97706] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Save className="w-4 h-4 text-amber-955" />
              <span>Synchronize New Site Variables</span>
            </button>
          </form>
        </div>
      ) : activeAdminSubTab === 'players-ledger' ? (
        /* ================= LADDER MEMBERS DATABASE LEDGER ================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Ledger Database: Table list of all players */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left space-y-4">
              <h3 className="font-extrabold text-sm uppercase text-slate-900 dark:text-white flex items-center gap-1.5">
                🏆 Negros Oriental active Standings Board ({players.length})
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <thead>
                    <tr className="border-b-2 border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider text-left bg-slate-50 dark:bg-slate-950/60 font-mono">
                      <th className="py-2 px-3">Athlete</th>
                      <th className="py-2 px-1 text-center">DUPR</th>
                      <th className="py-2 px-1 text-center">Wins</th>
                      <th className="py-2 px-1 text-center">Losses</th>
                      <th className="py-2 px-1 text-center">Hometown</th>
                      <th className="py-2 px-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {players
                      .sort((a, b) => b.duprRating - a.duprRating)
                      .map((p) => {
                        return (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <span className={`w-6 h-6 rounded-lg ${p.avatarColor || 'bg-slate-400'} flex items-center justify-center text-white font-mono text-[9px] uppercase font-bold`}>
                                  {p.name.substring(0,2)}
                                </span>
                                <div>
                                  <div className="font-sans font-black text-slate-850 dark:text-white flex items-center gap-1.5 flex-wrap">
                                    <span>{p.name}</span>
                                    {p.role === 'CourtOwner' && (
                                      <span className="bg-amber-100 dark:bg-amber-955 text-amber-805 dark:text-amber-300 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">Owner</span>
                                    )}
                                    {p.role === 'SuperAdmin' && (
                                      <span className="bg-blue-100 dark:bg-blue-955 text-blue-800 dark:text-blue-300 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">Admin</span>
                                    )}
                                    {p.isHidden && (
                                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase font-mono">Hidden</span>
                                    )}
                                  </div>
                                  <div className="text-[9px] text-slate-400 font-mono italic">{p.gender || 'Classified'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-1 text-center font-mono font-black text-amber-750 dark:text-amber-400">
                              {p.duprRating.toFixed(2)}
                            </td>
                            <td className="py-3 px-1 text-center text-emerald-700 font-black">{p.wins}</td>
                            <td className="py-3 px-1 text-center text-rose-600 font-extrabold">{p.losses}</td>
                            <td className="py-3 px-1 text-center text-slate-450 text-[10px] font-bold">{p.hometown || 'Dumaguete'}</td>
                            <td className="py-3 px-2 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleSelectEditPlayer(p)}
                                  className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-350 rounded transition text-[10px] uppercase font-black"
                                  title="Configure Profile"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeletePlayer(p.id)}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition"
                                  title="Dismiss Athlete profile"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Form panel: Onboard player manually or edit player */}
            {editingPlayerId ? (
              /* === EDIT PLAYER REGISTER FORM === */
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left space-y-4 font-sans">
                <div className="border-b pb-2 flex items-center justify-between">
                  <h4 className="font-extrabold text-xs uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    ✏️ Modify Member Profile
                  </h4>
                  <button
                    onClick={() => setEditingPlayerId(null)}
                    className="text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSaveEditedPlayer} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-405 uppercase tracking-widest mb-1.5 font-black">Athlete Name</label>
                    <input
                      type="text"
                      required
                      value={editPlayerName}
                      onChange={(e) => setEditPlayerName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.5 py-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-450 uppercase tracking-widest mb-1 font-bold">DUPR Rating</label>
                      <input
                        type="number"
                        step={0.01}
                        min={1.0}
                        max={6.0}
                        required
                        value={editPlayerDupr}
                        onChange={(e) => setEditPlayerDupr(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.2 py-2 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-450 uppercase tracking-widest mb-1 font-bold">Gender Class</label>
                      <select
                        value={editPlayerGender}
                        onChange={(e) => setEditPlayerGender(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-855 rounded-lg px-2 py-2 text-xs font-bold"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1 font-bold">Wins record</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={editPlayerWins}
                        onChange={(e) => setEditPlayerWins(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.2 py-2 text-xs font-mono font-bold text-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1 font-bold">Losses record</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={editPlayerLosses}
                        onChange={(e) => setEditPlayerLosses(Number(e.target.value))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.2 py-2 text-xs font-mono font-bold text-rose-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1">Hometown City</label>
                    <input
                      type="text"
                      required
                      value={editPlayerHometown}
                      onChange={(e) => setEditPlayerHometown(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.5 py-2 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-454 uppercase tracking-widest mb-1">Access Role</label>
                      <select
                        value={editPlayerRole}
                        onChange={(e) => setEditPlayerRole(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-855 rounded-lg px-2 py-2 text-xs font-bold text-blue-750"
                      >
                        <option value="Player">Standard Athlete</option>
                        <option value="CourtOwner">Court Owner Portal</option>
                        <option value="SuperAdmin">SuperAdmin Operator</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-454 uppercase tracking-widest mb-1 font-bold">Privacy / Hide</label>
                      <select
                        value={String(editPlayerIsHidden)}
                        onChange={(e) => setEditPlayerIsHidden(e.target.value === 'true')}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-855 rounded-lg px-2 py-2 text-xs font-bold"
                      >
                        <option value="false">Visible Publicly</option>
                        <option value="true">Hidden Profile</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black uppercase text-[10px] tracking-wider rounded-xl transition cursor-pointer"
                  >
                    💾 Save Member Profile
                  </button>
                </form>
              </div>
            ) : (
              /* === STANDARD MANUALLY REGISTER ONBOARD FORM === */
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left space-y-4">
                <div className="border-b pb-2">
                  <h4 className="font-extrabold text-xs uppercase text-slate-800 dark:text-white flex items-center gap-1.5">
                    🏓 Onboard New Member
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-normal font-semibold">
                    Manually introduce a player directly into the Negros standings ledger. Win/Loss history starts at zero.
                  </p>
                </div>

              <form onSubmit={handleCreatePlayerManually} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[9px] font-mono text-slate-405 uppercase tracking-widest mb-1">Athlete Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gabby Real"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-405 uppercase tracking-widest mb-1">DUPR Rating</label>
                    <input
                      type="number"
                      step={0.01}
                      min={1.0}
                      max={6.0}
                      required
                      value={newPlayerDupr}
                      onChange={(e) => setNewPlayerDupr(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg px-2.2 py-2 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-405 uppercase tracking-widest mb-1">Gender Class</label>
                    <select
                      value={newPlayerGender}
                      onChange={(e) => setNewPlayerGender(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg px-2 py-2 text-xs font-bold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-405 uppercase tracking-widest mb-1">Contact Details</label>
                  <input
                    type="text"
                    placeholder="e.g. +63 917 123 7777"
                    value={newPlayerContact}
                    onChange={(e) => setNewPlayerContact(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-405 uppercase tracking-widest mb-1">Hometown Town/Barangay</label>
                  <input
                    type="text"
                    placeholder="e.g. Sibulan"
                    value={newPlayerHometown}
                    onChange={(e) => setNewPlayerHometown(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-955 font-display font-black text-[10px] uppercase tracking-wider rounded-lg shadow-[0_3px_0_0_#d97706] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  Onboard Core Profile
                </button>
              </form>
            </div>
          )}

          </div>
        </div>
      ) : activeAdminSubTab === 'courts-ledger' ? (
        /* ================= COURTS CONSOLE CONTROLLER ================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Ledger Database: Table list of all courts */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left space-y-4">
              <h3 className="font-extrabold text-sm uppercase text-slate-905 dark:text-white flex items-center gap-1.5">
                📁 Universal Courts Directory ({courts.length})
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed font-sans">
                As SuperAdmin, customize values directly, allocate venue curators (owners), toggle visibility, or delete obsolete facilities.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <thead>
                    <tr className="border-b-2 border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider text-left bg-slate-50 dark:bg-slate-950/60 font-mono">
                      <th className="py-2 px-3">Arena Details</th>
                      <th className="py-2 px-1 text-center">Pricing</th>
                      <th className="py-2 px-1 text-center">Curator/Owner</th>
                      <th className="py-2 px-1 text-center">Status</th>
                      <th className="py-2 px-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {courts.map((court) => (
                      <tr key={court.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition leading-snug">
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <div className="font-sans font-black text-slate-850 dark:text-white flex items-center gap-2 flex-wrap">
                              <span>{court.name}</span>
                              <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded text-white bg-slate-600">
                                {court.themeColor || 'emerald'}
                              </span>
                              {court.isHidden && (
                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-605 dark:text-slate-400 text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase font-mono">Hidden</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{court.location}</p>
                          </div>
                        </td>
                        <td className="py-3 px-1 text-center font-mono font-black text-slate-800 dark:text-slate-205">
                          ₱{court.rentalFee} / {court.feeUnit}
                        </td>
                        <td className="py-3 px-1 text-center text-slate-605 dark:text-slate-350 italic font-mono">
                          {court.ownerName || 'Independent'}
                        </td>
                        <td className="py-3 px-1 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                            court.isHidden 
                              ? 'bg-amber-105 text-amber-800'
                              : 'bg-emerald-100 text-emerald-805'
                          }`}>
                            {court.isHidden ? 'Inactive (Hidden)' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleSelectEditCourt(court)}
                              className="p-1 px-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-700 dark:text-slate-350 rounded transition text-[10px] uppercase font-black"
                              title="Edit Court Parameters"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCourt(court.id, court.name)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition"
                              title="Purge Facility"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Editor form column panel */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border-2 border-emerald-100 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left space-y-4">
              {editingCourtId ? (
                <div className="space-y-4 font-sans">
                  <div className="border-b pb-2 flex items-center justify-between">
                    <h4 className="font-extrabold text-xs uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      ✏️ Edit Court Settings
                    </h4>
                    <button
                      onClick={() => setEditingCourtId(null)}
                      className="text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-slate-203 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditedCourt} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-405 uppercase tracking-widest mb-1.5 font-bold">Arena Facility Name</label>
                      <input
                        type="text"
                        required
                        value={editCourtName}
                        onChange={(e) => setEditCourtName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.5 py-2 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-slate-405 uppercase tracking-widest mb-1.5 font-bold">Street Location Address</label>
                      <input
                        type="text"
                        required
                        value={editCourtLocation}
                        onChange={(e) => setEditCourtLocation(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.5 py-2 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1">Rental Cost (₱)</label>
                        <input
                          type="number"
                          required
                          value={editCourtRentalFee}
                          onChange={(e) => setEditCourtRentalFee(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.5 py-2 font-mono font-bold text-amber-705"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1">Billing Cycle</label>
                        <select
                          value={editCourtFeeUnit}
                          onChange={(e) => setEditCourtFeeUnit(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-855 rounded-lg px-2 py-2 font-bold"
                        >
                          <option value="hour">per hour</option>
                          <option value="session">session (flat)</option>
                          <option value="day">per day</option>
                          <option value="free">free</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1">Nets Count</label>
                        <input
                          type="number"
                          required
                          value={editCourtCount}
                          onChange={(e) => setEditCourtCount(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.5 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1">Night Lights</label>
                        <select
                          value={String(editCourtLights)}
                          onChange={(e) => setEditCourtLights(e.target.value === 'true')}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-855 rounded-lg px-2 py-2 font-bold"
                        >
                          <option value="true">Evening Lights</option>
                          <option value="false">No Lights</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1">Custom Page Theme</label>
                        <select
                          value={editCourtThemeColor}
                          onChange={(e) => setEditCourtThemeColor(e.target.value as any)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-855 rounded-lg px-2 py-2 font-bold"
                        >
                          <option value="emerald">Emerald Green</option>
                          <option value="amber">Amber Gold</option>
                          <option value="indigo">Indigo Tech</option>
                          <option value="rose">Sunset Rose</option>
                          <option value="slate">Slate Minimal</option>
                          <option value="sky">Sky Blue</option>
                          <option value="teal">Ocean Teal</option>
                          <option value="orange">Sunset Orange</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1">Visibility / Hide</label>
                        <select
                          value={String(editCourtIsHidden)}
                          onChange={(e) => setEditCourtIsHidden(e.target.value === 'true')}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-855 rounded-lg px-2 py-2 font-bold text-rose-700"
                        >
                          <option value="false">Active Listing</option>
                          <option value="true">Hidden Listing</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1 font-bold font-sans">Assigned Curator (Owner Name)</label>
                      <input
                        type="text"
                        placeholder="e.g. Owner Phil (Type player name exactly)"
                        value={editCourtOwnerName}
                        onChange={(e) => setEditCourtOwnerName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.5 py-2 font-bold text-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1 font-bold">Custom Playing Timeslots</label>
                      <input
                        type="text"
                        placeholder="comma separated, e.g. 08:00 AM - 10:00 AM"
                        value={editCourtCustomSlots}
                        onChange={(e) => setEditCourtCustomSlots(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 border-slate-850 rounded-lg px-2.5 py-2 font-mono text-xs text-slate-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-slate-455 uppercase tracking-widest mb-1">Short Description</label>
                      <textarea
                        rows={3}
                        required
                        value={editCourtDescription}
                        onChange={(e) => setEditCourtDescription(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-lg px-2.5 py-2 text-xs resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase text-[10px] tracking-wider rounded-xl transition cursor-pointer"
                    >
                      💾 Synchronize Court Config
                    </button>
                  </form>
                </div>
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-slate-150 dark:border-slate-800 rounded-2xl">
                  <span className="text-3xl block filter grayscale mb-2">🏢</span>
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-250 text-xs uppercase tracking-wide">Configure Facilities</h4>
                  <p className="text-[10px] text-slate-400 font-medium max-w-[200px] mx-auto mt-1 leading-normal font-sans">
                    Select any court in the left registry table to load its administrative parameters here.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      ) : activeAdminSubTab === 'audit-logs' ? (
        /* ================= SYSTEM AUDIT LOGS LEDGER ================= */
        <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl p-6.5 shadow-sm text-left space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 dark:border-slate-800">
            <div className="space-y-0.5">
              <h3 className="font-extrabold text-sm uppercase text-slate-905 dark:text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-600" /> Platform Security & Audit Logs ({activityLogs.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Live chronological sequence of system operations, public check-ins, event registrations, and administrator overrides.
              </p>
            </div>
            {activityLogs.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Clear all logs indefinitely?')) {
                    onClearLogs();
                  }
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-105 text-rose-700 hover:text-rose-850 font-black text-[9px] uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1 border border-rose-200"
              >
                <Trash className="w-3.5 h-3.5 shrink-0" /> Clear Records
              </button>
            )}
          </div>

          {activityLogs.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-2xl text-center space-y-2 dark:border-slate-850">
              <Activity className="w-8 h-8 text-slate-300" />
              <div>
                <h4 className="text-xs font-black uppercase text-slate-500">No logs generated yet</h4>
                <p className="text-[11px] text-slate-400 max-w-sm mt-1">
                  Perform client or developer actions around the platform to see telemetry records update live in real-time.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {activityLogs.map((log) => (
                <div
                  key={`log-row-${log.id}`}
                  className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-850 rounded-xl flex items-start gap-3.5 hover:bg-slate-100/60 dark:hover:bg-slate-900/40 transition"
                >
                  <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                    log.role === 'SuperAdmin' 
                      ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 border border-purple-200/40' 
                      : log.role === 'CourtOwner'
                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/40'
                      : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/40'
                  }`}>
                    <Activity className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide border ${
                        log.role === 'SuperAdmin'
                          ? 'bg-purple-50 dark:bg-slate-900 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-slate-800'
                          : log.role === 'CourtOwner'
                          ? 'bg-amber-50 dark:bg-slate-900 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-slate-800'
                          : 'bg-blue-50 dark:bg-slate-900 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-slate-800'
                      }`}>
                        {log.role === 'Player' ? 'Athlete' : log.role}
                      </span>
                      <strong className="text-slate-850 dark:text-slate-200 font-sans">{log.actorName}</strong>
                      {log.impersonatedBy && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                          🕵️ Impersonated
                        </span>
                      )}
                      
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ml-auto">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-left font-sans text-slate-800 dark:text-slate-200 py-0.5">
                      <span className="font-bold text-slate-900 dark:text-white">{log.action}</span>
                      {log.details && (
                        <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium mt-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2 rounded-lg font-mono leading-tight whitespace-pre-line">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* ================= DYNAMIC ANALYTICS SUMMARY PANEL ================= */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-3xl p-6.5 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800 shrink-0 text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">MEMBER FLUX INLET</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono mt-1 pt-1">
                {players.length} Athletes
              </h3>
              <p className="text-[11px] text-slate-455 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                Total registered sports members mapped. Average localized DUPR standing represents a beautiful <strong className="text-amber-650">3.75 median rating</strong> tier.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6.5 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800 shrink-0 text-emerald-600">
              <Map className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-black text-slate-405 tracking-wider">LIVE CHECK-INS RADIST</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono mt-1 pt-1">
                {totalCheckIns} Checked In
              </h3>
              <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-2 font-medium leading-relaxed">
                Players currently active on arenas with real physical devices. {courts.length} audited court hubs listed on map coordinates.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-3xl p-6.5 shadow-sm space-y-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-850 shrink-0 text-emerald-600">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">VERIFIED MATCH FEED</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono mt-1 pt-1">
                {recentMatches.length} Matches
              </h3>
              <p className="text-[11px] text-slate-450 dark:text-slate-450 mt-2 font-medium leading-relaxed">
                Officially completed game feeds. Submissions from standard matches logged continuously for rank adjustments.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
