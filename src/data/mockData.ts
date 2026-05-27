import { Court, Game, Player, TournamentEvent, Coach } from '../types';

export const initialCourts: Court[] = [
  {
    id: 'the-ryze',
    name: 'The Ryze Dumaguete',
    location: 'L. Rovira Rd, Bagacay, Dumaguete City, 6200',
    latitude: 9.3197, // North-West-ish Bagacay
    longitude: 123.2975,
    type: 'Indoor',
    surface: 'Cushioned Acrylic',
    courtCount: 4,
    lights: true,
    rentalFee: 350,
    feeUnit: 'hour',
    contact: '+63 917 123 4567',
    description: 'Dumaguete\'s top-tier premium indoor court. Features court-specific LED lamps, high-traction cushioned surface, and a comfortable spectator lounge with cold drinks.',
    checkInCount: 12,
    checkedInPlayers: ['Mark Alviola', 'Sarah G.', 'Coach Jay'],
    restrooms: true,
    accessibility: true,
    reviews: [
      { id: 'rev-ryze-1', userName: 'Mark Alviola', rating: 5, comment: 'Pristine facility! High-end cushioned acrylic feels fantastic on the knees, and the LED lights are amazing.', createdAt: '2026-05-20' },
      { id: 'rev-ryze-2', userName: 'Sarah G.', rating: 4, comment: 'Great indoor venue! Staff is friendly and there are clean restrooms and accessibility ramps. A bit pricey but worth it.', createdAt: '2026-05-24' }
    ]
  },
  {
    id: 'su-gym',
    name: 'Silliman University Gym',
    location: 'Silliman Main Campus, Aldecoa Road, Dumaguete City, 6200',
    latitude: 9.3121, // Near city center / school campus
    longitude: 123.3081,
    type: 'Indoor',
    surface: 'Wooden Court',
    courtCount: 2,
    lights: true,
    rentalFee: 100,
    feeUnit: 'hour',
    contact: '+63 35 422 6002',
    description: 'Beautiful wood flooring located inside the main SU Gym. High ceiling, great ventilation. Booking priority given to students/faculty, but public play times are available.',
    checkInCount: 5,
    checkedInPlayers: ['Dexter Teves'],
    restrooms: true,
    accessibility: true,
    reviews: [
      { id: 'rev-su-1', userName: 'Dexter Teves', rating: 4, comment: 'Nice classic wooden floor. Excellent bounding and grip, though the high ceiling makes wind currents a bit tricky sometimes. Very accessible.', createdAt: '2026-05-18' }
    ]
  },
  {
    id: 'valencia-municipal',
    name: 'Valencia Municipal Plaza Court',
    location: 'Town Plaza, Valencia, Negros Oriental, 6215',
    latitude: 9.2811, // Uphill Southwest of Dumaguete
    longitude: 123.2458,
    type: 'Covered',
    surface: 'Concrete',
    courtCount: 2,
    lights: true,
    rentalFee: 150,
    feeUnit: 'session',
    contact: '+63 905 444 3322',
    description: 'Located in the cool highlands of Valencia, just a 15-minute drive from Dumaguete City. High covered roof prevents rain interruptions. Great cool breeze while playing.',
    checkInCount: 8,
    checkedInPlayers: ['Princess Lumay', 'Gabby Real', 'Aries Lim'],
    restrooms: true,
    accessibility: false,
    reviews: [
      { id: 'rev-val-1', userName: 'Princess Lumay', rating: 5, comment: 'My absolute favorite spot! The cool weather in Valencia is a refreshing escape from the sea level heat. Bathrooms are nearby.', createdAt: '2026-05-21' },
      { id: 'rev-val-2', userName: 'Melo R.', rating: 4, comment: 'Strong municipal courts with solid lighting for matches at night. Covered dome stands up perfectly to rainfall.', createdAt: '2026-05-25' }
    ]
  },
  {
    id: 'rizal-blvd',
    name: 'Rizal Boulevard Beachfront Courts',
    location: 'Rizal Boulevard Promenade, Dumaguete City, 6200',
    latitude: 9.3075, // Seaside Promenade
    longitude: 123.3114,
    type: 'Outdoor',
    surface: 'Concrete',
    courtCount: 3,
    lights: true,
    rentalFee: 0,
    feeUnit: 'free',
    contact: 'None (Public Park)',
    description: 'Iconic public outdoor courts right along the historic Rizal Boulevard waterfront. Incredible ocean view of Tañon Strait. Strictly first-come, first-served open play under beautiful floodlights in the evening.',
    checkInCount: 15,
    checkedInPlayers: ['Yoshi Tan', 'Melo R.', 'Nica S.'],
    restrooms: false,
    accessibility: true,
    reviews: [
      { id: 'rev-rizal-1', userName: 'Yoshi Tan', rating: 4, comment: 'You cannot beat the view here! Playing pickleball while smelling the ocean breeze is surreal. Lights turn on at sunset. No public restrooms directly on court, but boulevard has some a block down.', createdAt: '2026-05-15' },
      { id: 'rev-rizal-2', userName: 'Nica S.', rating: 5, comment: 'Awesome community spirit. Friendly stacks, highly welcoming atmosphere, and completely free!', createdAt: '2026-05-23' }
    ]
  },
  {
    id: 'cangmating-sports',
    name: 'Cangmating Sports Ground',
    location: 'Brgy. Cangmating Park, Sibulan, Negros Oriental, 6201',
    latitude: 9.3514, // North of Dumaguete in Sibulan town
    longitude: 123.3012,
    type: 'Outdoor',
    surface: 'Concrete',
    courtCount: 2,
    lights: false,
    rentalFee: 50,
    feeUnit: 'hour',
    contact: '+63 922 888 1122',
    description: 'A relaxed outdoor neighborhood court in the coastal town of Sibulan. Shaded by surrounding foliage. Best played in the early mornings or late afternoons before sunset.',
    checkInCount: 2,
    checkedInPlayers: [],
    restrooms: false,
    accessibility: false,
    reviews: []
  }
];

export const initialPlayers: Player[] = [
  { id: 'p1', name: 'Jay Flores', duprRating: 4.8, wins: 41, losses: 12, avatarColor: 'bg-emerald-500', contact: '09170010022', hometown: 'Dumaguete City', gender: 'Male' },
  { id: 'p2', name: 'Mark Alviola', duprRating: 4.5, wins: 33, losses: 15, avatarColor: 'bg-blue-500', contact: '09170020033', hometown: 'Dumaguete City', gender: 'Male' },
  { id: 'p3', name: 'Princess Lumay', duprRating: 4.2, wins: 28, losses: 8, avatarColor: 'bg-pink-500', contact: '09170030044', hometown: 'Valencia', gender: 'Female' },
  { id: 'p4', name: 'Dexter Teves', duprRating: 4.1, wins: 25, losses: 14, avatarColor: 'bg-amber-500', contact: '09170040055', hometown: 'Dumaguete City', gender: 'Male' },
  { id: 'p5', name: 'Sarah G.', duprRating: 3.8, wins: 19, losses: 11, avatarColor: 'bg-purple-500', contact: '09170050066', hometown: 'Sibulan', gender: 'Female' },
  { id: 'p6', name: 'Melo R.', duprRating: 3.6, wins: 15, losses: 13, avatarColor: 'bg-indigo-500', contact: '09170060077', hometown: 'Valencia', gender: 'Male' },
  { id: 'p7', name: 'Aries Lim', duprRating: 3.5, wins: 14, losses: 9, avatarColor: 'bg-teal-500', contact: '09170070088', hometown: 'Dumaguete City', gender: 'Male' },
  { id: 'p8', name: 'Gabby Real', duprRating: 3.4, wins: 12, losses: 12, avatarColor: 'bg-cyan-500', contact: '09170080099', hometown: 'Bacong', gender: 'Male' },
  { id: 'p9', name: 'Nica S.', duprRating: 3.2, wins: 11, losses: 10, avatarColor: 'bg-rose-500', contact: '09170090111', hometown: 'Dumaguete City', gender: 'Female' },
  { id: 'p10', name: 'Yoshi Tan', duprRating: 3.0, wins: 8, losses: 7, avatarColor: 'bg-orange-500', contact: '09170100222', hometown: 'Sibulan', gender: 'Male' }
];

export const initialGames: Game[] = [
  {
    id: 'g1',
    courtId: 'su-gym',
    courtName: 'Silliman University Gym',
    title: 'Silliman Open Play Matchup',
    date: '2026-05-27',
    time: '17:00 - 19:30',
    hostId: 'p4',
    hostName: 'Dexter Teves',
    hostLevel: 4.1,
    currentPlayers: [
      { id: 'p4', name: 'Dexter Teves', level: 4.1 },
      { id: 'p6', name: 'Melo R.', level: 3.6 },
      { id: 'p7', name: 'Aries Lime', level: 3.5 }
    ],
    maxPlayers: 6,
    type: 'Open Play',
    levelRequirement: 'Intermediate (3.0-4.0)'
  },
  {
    id: 'g2',
    courtId: 'the-ryze',
    courtName: 'The Ryze Dumaguete',
    title: 'Competitive Afternoon Singles',
    date: '2026-05-28',
    time: '15:00 - 16:30',
    hostId: 'p2',
    hostName: 'Mark Alviola',
    hostLevel: 4.5,
    currentPlayers: [
      { id: 'p2', name: 'Mark Alviola', level: 4.5 },
      { id: 'p1', name: 'Jay Flores', level: 4.8 }
    ],
    maxPlayers: 4,
    type: 'Singles',
    levelRequirement: 'Advanced (4.0+)'
  },
  {
    id: 'g3',
    courtId: 'rizal-blvd',
    courtName: 'Rizal Boulevard Beachfront Courts',
    title: 'Sunset Social Friendly Recs',
    date: '2026-05-27',
    time: '18:00 - 21:00',
    hostId: 'p10',
    hostName: 'Yoshi Tan',
    hostLevel: 3.0,
    currentPlayers: [
      { id: 'p10', name: 'Yoshi Tan', level: 3.0 },
      { id: 'p9', name: 'Nica S.', level: 3.2 }
    ],
    maxPlayers: 8,
    type: 'Social Mixer',
    levelRequirement: 'Beginner (<3.0)'
  },
  {
    id: 'g4',
    courtId: 'valencia-municipal',
    courtName: 'Valencia Municipal Plaza Court',
    title: 'Morning Highland Doubles',
    date: '2026-05-29',
    time: '07:30 - 10:00',
    hostId: 'p3',
    hostName: 'Princess Lumay',
    hostLevel: 4.2,
    currentPlayers: [
      { id: 'p3', name: 'Princess Lumay', level: 4.2 },
      { id: 'p5', name: 'Sarah G.', level: 3.8 },
      { id: 'p8', name: 'Gabby Real', level: 3.4 }
    ],
    maxPlayers: 6,
    type: 'Mixed Doubles',
    levelRequirement: 'All Levels'
  }
];

export const initialEvents: TournamentEvent[] = [
  {
    id: 'ev-summer-slam',
    title: 'Dumaguete Summer Slam 2026',
    description: 'The premier annual pickleball competition of Negros Oriental. Featuring Men\'s, Women\'s, and Mixed doubles divisions. Massive community support, cash prizes for first/second place, and tournament merchandise.',
    date: '2026-06-12',
    time: '08:00 - 20:00',
    type: 'Tournament',
    fee: 600,
    location: 'The Ryze Dumaguete (Indoor Cushioned)',
    spotsAvailable: 12,
    maxSpots: 32,
    registeredPlayers: ['Jay Flores', 'Mark Alviola', 'Princess Lumay', 'Dexter Teves', 'Sarah G.']
  },
  {
    id: 'ev-valencia-open',
    title: 'Valencia Cool Highlands Open',
    description: 'A friendly community tournament designed for recreation-tier and first-time tournament players. Escape the beach heat playing in the cool heights of the Valencia main dome Plaza.',
    date: '2026-06-21',
    time: '09:00 - 17:00',
    type: 'Tournament',
    fee: 400,
    location: 'Valencia Municipal Plaza Court',
    spotsAvailable: 8,
    maxSpots: 16,
    registeredPlayers: ['Melo R.', 'Aries Lim', 'Gabby Real', 'Yoshi Tan']
  },
  {
    id: 'ev-weekly-mixer',
    title: 'Friday Night Moonlight Mixer',
    description: 'A weekly highlight! Fun rotative partners, chilled island music, food vendors on-site, and friendly non-competitive match-ups. First paddle rental is complimentary.',
    date: '2026-05-29',
    time: '18:30 - 22:00',
    type: 'Social Mixer',
    fee: 150,
    location: 'Rizal Boulevard Beachfront Courts',
    spotsAvailable: 24,
    maxSpots: 40,
    registeredPlayers: ['Dexter Teves', 'Sarah G.', 'Nica S.', 'Yoshi Tan']
  },
  {
    id: 'ev-clinic-beginner',
    title: 'Intro to Pickleball & Kitchen Masterclass',
    description: 'Learn fundamental paddle control, proper dinking forms, court position principles, and how to safely navigate the non-volley zone (Kitchen Rules). Perfect for beginners and advanced novices.',
    date: '2026-05-31',
    time: '16:00 - 18:00',
    type: 'Clinic',
    fee: 300,
    location: 'The Ryze Dumaguete',
    spotsAvailable: 6,
    maxSpots: 12,
    registeredPlayers: []
  }
];

export const initialCoaches: Coach[] = [
  {
    id: 'co-jay',
    name: 'Jay Flores',
    certification: 'IPTA Certified Coach - Level II',
    rate: '₱500 / Hr',
    specialty: 'Advanced Dinking Strategy, Transition Zone footwork, Doubles Synergy.',
    contact: '+63 917 001 0022',
    avatarColor: 'bg-emerald-500',
    availability: 'Mornings (7am-10am) & Evenings (5pm-9pm)'
  },
  {
    id: 'co-sarah',
    name: 'Sarah G.',
    certification: 'PPR Certified Rookie Guide',
    rate: '₱350 / Hr',
    specialty: 'Intro to Paddle control, Court placement, Scoring mechanics, Fun drills.',
    contact: '+63 917 005 0066',
    avatarColor: 'bg-purple-500',
    availability: 'Weekends (All Day)'
  },
  {
    id: 'co-dexter',
    name: 'Dexter Teves',
    certification: 'Local Community Veteran & Tactical Analyst',
    rate: '₱400 / Hr',
    specialty: 'Offensive drives, Third-shot drops, Defending high-speed smashes.',
    contact: '+63 917 004 0055',
    avatarColor: 'bg-amber-500',
    availability: 'Mon / Wed / Fri afternoons'
  }
];
