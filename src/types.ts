export interface Review {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface Court {
  id: string;
  name: string;
  location: string;
  latitude: number; // For visualization / relative mapping
  longitude: number; // For visualization / relative mapping
  type: 'Indoor' | 'Outdoor' | 'Covered';
  surface: 'Cushioned Acrylic' | 'Concrete' | 'Wooden Court' | 'Sport Tile' | 'Asphalt' | 'Sport Court';
  courtCount: number;
  lights: boolean;
  rentalFee: number; // 0 for free
  feeUnit: string; // "hour" or "session" or "free"
  contact: string;
  description: string;
  checkInCount: number;
  checkedInPlayers: string[];
  restrooms: boolean;
  accessibility: boolean;
  reviews: Review[];
  images?: string[];
  themeColor?: 'emerald' | 'amber' | 'indigo' | 'rose' | 'slate' | 'sky' | 'teal' | 'orange';
  customSlots?: string[];
  isHidden?: boolean;
  ownerName?: string;
}

export interface Booking {
  id: string;
  courtId: string;
  courtName: string;
  playerId: string;
  playerName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "08:00 AM - 09:30 AM"
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
  notes?: string;
}

export interface Game {
  id: string;
  courtId: string;
  courtName: string;
  title: string;
  date: string;
  time: string;
  hostId: string;
  hostName: string;
  hostLevel: number;
  currentPlayers: { id: string; name: string; level: number }[];
  maxPlayers: number;
  type: 'Singles' | 'Doubles' | 'Mixed Doubles' | 'Open Play' | 'Social Mixer';
  levelRequirement: 'All Levels' | 'Beginner (<3.0)' | 'Intermediate (3.0-4.0)' | 'Advanced (4.0+)';
}

export interface Player {
  id: string;
  name: string;
  duprRating: number;
  wins: number;
  losses: number;
  avatarColor: string;
  contact?: string;
  hometown?: string;
  gender?: 'Male' | 'Female' | 'Other';
  role?: 'Player' | 'CourtOwner' | 'SuperAdmin';
  isHidden?: boolean;
}

export interface MatchResult {
  id: string;
  courtId: string;
  courtName: string;
  date: string;
  winnerIds: string[];
  winnerNames: string[];
  loserIds: string[];
  loserNames: string[];
  score: string; // e.g., "11-8, 11-9"
  submittedAt: string;
}

export interface TournamentEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: 'Tournament' | 'Social Mixer' | 'Clinic' | 'Family Play';
  fee: number;
  location: string;
  spotsAvailable: number;
  maxSpots: number;
  registeredPlayers: string[];
}

export interface Coach {
  id: string;
  name: string;
  certification: string;
  rate: string;
  specialty: string;
  contact: string;
  avatarColor: string;
  availability: string;
}

export interface UserRequest {
  id: string;
  type: 'CoachApplication' | 'NewCourtSuggestion' | 'MatchVerification' | 'SpecialEventPermit';
  status: 'Pending' | 'Approved' | 'Rejected';
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  details: any;
}

export interface FrontendConfig {
  announcementTicker: string;
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactEmail: string;
  hubRulesNotice: string;
  isTickerVisible: boolean;
  featuredAlertLevel: 'info' | 'success' | 'warning' | 'error';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  role: 'Player' | 'CourtOwner' | 'SuperAdmin';
  actorName: string;
  action: string;
  category: 'Court' | 'Game' | 'Admin' | 'Impersonation' | 'Match' | 'Account' | 'Review' | 'Event' | 'Coach';
  details?: string;
  impersonatedBy?: string;
}

