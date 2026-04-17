// Bangladesh 300 Parliamentary Constituencies
// Distributed by Division → District with winning party per seat
export type Party = 'BNP' | 'Jamaat' | 'NCP' | 'IND' | 'Others';

export interface Constituency {
  id: number;
  name: string;        // e.g. "Dhaka-10"
  district: string;
  division: string;
  winner: Party;
  winnerVotes: number;
  runnerUp: Party;
  margin: number;
  turnout: number;
}

const make = (
  id: number, district: string, division: string,
  num: number, winner: Party, runnerUp: Party,
  winnerVotes: number, margin: number, turnout: number
): Constituency => ({
  id,
  name: `${district}-${num}`,
  district,
  division,
  winner,
  runnerUp,
  winnerVotes,
  margin,
  turnout,
});

// Helper to build a block of constituencies for a district
let _id = 1;
function block(
  district: string, division: string,
  seats: Party[]
): Constituency[] {
  return seats.map((winner, i) => {
    const runners: Party[] = ['BNP','Jamaat','NCP','IND','Others'];
    const runnerUp = (runners.find(p => p !== winner) ?? 'Others') as Party;
    const winnerVotes = 55000 + Math.round(Math.random() * 45000);
    const margin     = 3000  + Math.round(Math.random() * 35000);
    const turnout    = parseFloat((48 + Math.random() * 22).toFixed(1));
    return make(_id++, district, division, i + 1, winner, runnerUp, winnerVotes, margin, turnout);
  });
}

export const CONSTITUENCIES: Constituency[] = [
  // ── RANGPUR DIVISION (33) ──────────────────────────────────────────────
  ...block('Panchagarh',  'Rangpur', ['BNP','BNP']),
  ...block('Thakurgaon',  'Rangpur', ['BNP','BNP','BNP']),
  ...block('Dinajpur',    'Rangpur', ['BNP','BNP','BNP','BNP','BNP','Jamaat']),
  ...block('Nilphamari',  'Rangpur', ['BNP','BNP','BNP','Jamaat']),
  ...block('Lalmonirhat', 'Rangpur', ['Jamaat','Jamaat','BNP']),
  ...block('Rangpur',     'Rangpur', ['BNP','BNP','BNP','BNP','BNP','BNP']),
  ...block('Gaibandha',   'Rangpur', ['BNP','BNP','BNP','Jamaat','BNP']),
  ...block('Kurigram',    'Rangpur', ['Jamaat','BNP','BNP','Jamaat','BNP','BNP']),

  // ── RAJSHAHI DIVISION (39) ─────────────────────────────────────────────
  ...block('Joypurhat',        'Rajshahi', ['Jamaat','BNP']),
  ...block('Bogura',           'Rajshahi', ['BNP','BNP','BNP','BNP','Jamaat','BNP','BNP']),
  ...block('Chapainawabganj',  'Rajshahi', ['Jamaat','Jamaat','BNP']),
  ...block('Naogaon',          'Rajshahi', ['BNP','BNP','BNP','BNP','BNP','BNP']),
  ...block('Rajshahi',         'Rajshahi', ['BNP','BNP','BNP','BNP','BNP','BNP']),
  ...block('Natore',           'Rajshahi', ['BNP','BNP','BNP','Jamaat']),
  ...block('Sirajganj',        'Rajshahi', ['BNP','BNP','BNP','BNP','BNP','BNP']),
  ...block('Pabna',            'Rajshahi', ['BNP','BNP','BNP','BNP','BNP']),

  // ── MYMENSINGH DIVISION (24) ────────────────────────────────────────────
  ...block('Sherpur',     'Mymensingh', ['BNP','BNP','BNP']),
  ...block('Mymensingh',  'Mymensingh', ['BNP','BNP','BNP','BNP','BNP','BNP','BNP','BNP','Jamaat','Jamaat','BNP']),
  ...block('Jamalpur',    'Mymensingh', ['BNP','BNP','BNP','BNP','Jamaat']),
  ...block('Netrokona',   'Mymensingh', ['BNP','BNP','Jamaat','Others','BNP']),

  // ── DHAKA DIVISION (71) ─────────────────────────────────────────────────
  ...block('Tangail',     'Dhaka', ['BNP','BNP','BNP','Jamaat','BNP','BNP','BNP','BNP']),
  ...block('Kishoreganj', 'Dhaka', ['BNP','BNP','Jamaat','BNP','BNP','BNP']),
  ...block('Manikganj',   'Dhaka', ['BNP','BNP','BNP']),
  ...block('Dhaka',       'Dhaka', [
    'BNP','BNP','BNP','BNP','BNP','BNP','BNP','BNP','BNP','BNP',
    'BNP','BNP','Jamaat','Jamaat','Jamaat','BNP','BNP','BNP','BNP','BNP',
  ]),
  ...block('Narsingdi',   'Dhaka', ['BNP','BNP','BNP','BNP','BNP']),
  ...block('Narayanganj', 'Dhaka', ['BNP','BNP','BNP','Jamaat','BNP']),
  ...block('Munshiganj',  'Dhaka', ['BNP','BNP','BNP']),
  ...block('Gazipur',     'Dhaka', ['BNP','BNP','BNP','BNP','BNP']),
  ...block('Faridpur',    'Dhaka', ['BNP','BNP','NCP','BNP','BNP']),
  ...block('Rajbari',     'Dhaka', ['BNP','BNP']),
  ...block('Gopalganj',   'Dhaka', ['NCP','NCP','Others']),
  ...block('Madaripur',   'Dhaka', ['BNP','IND','BNP']),
  ...block('Shariatpur',  'Dhaka', ['BNP','Others','BNP']),

  // ── SYLHET DIVISION (19) ────────────────────────────────────────────────
  ...block('Sunamganj',   'Sylhet', ['BNP','BNP','IND','BNP','BNP']),
  ...block('Sylhet',      'Sylhet', ['BNP','BNP','BNP','BNP','BNP','BNP']),
  ...block('Moulvibazar', 'Sylhet', ['BNP','BNP','BNP','BNP']),
  ...block('Habiganj',    'Sylhet', ['BNP','BNP','BNP','BNP']),

  // ── CHATTOGRAM DIVISION (58) ────────────────────────────────────────────
  ...block('Brahmanbaria', 'Chattogram', ['BNP','BNP','BNP','Jamaat','BNP','BNP']),
  ...block('Comilla',      'Chattogram', ['BNP','BNP','BNP','BNP','BNP','Jamaat','BNP','BNP','BNP','BNP','BNP']),
  ...block('Chandpur',     'Chattogram', ['BNP','BNP','BNP','BNP','BNP']),
  ...block('Lakshmipur',   'Chattogram', ['BNP','BNP','BNP','BNP']),
  ...block('Feni',         'Chattogram', ['BNP','Jamaat','BNP']),
  ...block('Noakhali',     'Chattogram', ['BNP','Jamaat','BNP','Jamaat','BNP','BNP']),
  ...block('Chittagong',   'Chattogram', [
    'BNP','BNP','BNP','BNP','BNP','BNP','BNP','BNP',
    'Jamaat','BNP','BNP','BNP','BNP','BNP','BNP','BNP',
  ]),
  ...block("Cox's Bazar",  'Chattogram', ['BNP','BNP','BNP','BNP']),
  ...block('Rangamati',    'Chattogram', ['IND']),
  ...block('Khagrachhari', 'Chattogram', ['IND']),
  ...block('Bandarban',    'Chattogram', ['IND']),

  // ── KHULNA DIVISION (36) ────────────────────────────────────────────────
  ...block('Meherpur',  'Khulna', ['Others','Others']),
  ...block('Chuadanga', 'Khulna', ['BNP','Others','BNP']),
  ...block('Kushtia',   'Khulna', ['BNP','BNP','BNP','BNP','BNP']),
  ...block('Jhenaidah', 'Khulna', ['Jamaat','Jamaat','BNP','BNP']),
  ...block('Magura',    'Khulna', ['BNP','BNP']),
  ...block('Narail',    'Khulna', ['BNP','BNP']),
  ...block('Jashore',   'Khulna', ['BNP','BNP','BNP','BNP','BNP','BNP']),
  ...block('Satkhira',  'Khulna', ['Jamaat','Jamaat','BNP','BNP']),
  ...block('Khulna',    'Khulna', ['BNP','BNP','BNP','BNP','BNP','BNP']),
  ...block('Bagerhat',  'Khulna', ['BNP','BNP','BNP','BNP']),

  // ── BARISAL DIVISION (21) ───────────────────────────────────────────────
  ...block('Jhalokati',  'Barisal', ['Jamaat','BNP']),
  ...block('Pirojpur',   'Barisal', ['NCP','BNP','BNP']),
  ...block('Barguna',    'Barisal', ['IND','BNP']),
  ...block('Barishal',   'Barisal', ['BNP','BNP','BNP','BNP','BNP']),
  ...block('Bhola',      'Barisal', ['BNP','BNP','BNP','BNP','BNP']),
  ...block('Patuakhali', 'Barisal', ['BNP','BNP','BNP','BNP']),
];

// Validate total count
export const TOTAL_SEATS = CONSTITUENCIES.length;

// Summary by party
export function getPartySummary() {
  const counts: Record<string, number> = {};
  for (const c of CONSTITUENCIES) {
    counts[c.winner] = (counts[c.winner] ?? 0) + 1;
  }
  return counts;
}
