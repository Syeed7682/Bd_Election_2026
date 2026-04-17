// Parses election.csv into typed records
export interface ElectionRow {
  id: number;
  division: string;
  constituency: string;
  povertyRate: number;
  literacyRate: number;
  winnerName: string;
  winnerParty: string;
  winnerVotes: number;
  runnerName: string;
  runnerParty: string;
  runnerVotes: number;
  margin: number;
  totalVoters: number;
  maleVoters: number;
  femaleVoters: number;
  transgender: number;
  turnout: number; // derived: (winnerVotes + runnerVotes) / totalVoters
}

export const PARTY_COLOR_MAP: Record<string, string> = {
  BNP:    '#1a7fd4',
  Jamaat: '#1db954',
  NCP:    '#ff8c00',
  IND:    '#9b59b6',
  GSA:    '#e91e63',
  JUIB:   '#00bcd4',
  BIF:    '#8bc34a',
  ABP:    '#ff5722',
  LDP:    '#9c27b0',
  GOP:    '#ffc107',
  Default:'#8c7355',
};

export function partyColor(party: string): string {
  return PARTY_COLOR_MAP[party] ?? PARTY_COLOR_MAP['Default'];
}

// Raw CSV text imported as a string via Vite ?raw
import rawCsv from './election.csv?raw';

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/,/g, '').trim());
  return isNaN(n) ? 0 : n;
}

let _cached: ElectionRow[] | null = null;

export function getElectionData(): ElectionRow[] {
  if (_cached) return _cached;

  const lines = rawCsv.split('\n').map(l => l.replace(/\r$/, ''));
  const rows: ElectionRow[] = [];

  for (const line of lines) {
    const cols = line.split(',');
    // data rows: col[0] is numeric ID, col[2] contains dash (e.g. "Dhaka-1")
    const id = parseInt(cols[0]);
    if (isNaN(id) || id < 1) continue;

    const totalVoters = parseNum(cols[12]);
    const winnerVotes = parseNum(cols[7]);
    const runnerVotes = parseNum(cols[10]);

    rows.push({
      id,
      division:      (cols[1] ?? '').trim(),
      constituency:  (cols[2] ?? '').trim(),
      povertyRate:   parseNum(cols[3]),
      literacyRate:  parseNum(cols[4]),
      winnerName:    (cols[5] ?? '').trim(),
      winnerParty:   (cols[6] ?? '').trim(),
      winnerVotes,
      runnerName:    (cols[8] ?? '').trim(),
      runnerParty:   (cols[9] ?? '').trim(),
      runnerVotes,
      margin:        parseNum(cols[11]),
      totalVoters,
      maleVoters:    parseNum(cols[13]),
      femaleVoters:  parseNum(cols[14]),
      transgender:   parseNum(cols[15]),
      turnout:       totalVoters > 0
        ? parseFloat(((winnerVotes + runnerVotes) / totalVoters * 100).toFixed(1))
        : 0,
    });
  }

  _cached = rows;
  return rows;
}

export function getElectionSummary() {
  const data = getElectionData();
  const counts: Record<string, number> = {};
  for (const r of data) counts[r.winnerParty] = (counts[r.winnerParty] ?? 0) + 1;
  return counts;
}
