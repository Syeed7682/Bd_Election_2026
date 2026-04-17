import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getElectionData, getElectionSummary, partyColor, type ElectionRow } from '../data/electionCsv';

const DIVISIONS_LIST = ['All','Rangpur','Rajshahi','Mymensingh','Dhaka','Sylhet','Chittagong','Khulna','Barisal'];

// ── Detail Modal ──────────────────────────────────────────────────────────────
function Modal({ row, onClose }: { row: ElectionRow; onClose: () => void }) {
  const wColor = partyColor(row.winnerParty);
  const rColor = partyColor(row.runnerParty);
  const totalCast = row.winnerVotes + row.runnerVotes;
  const wPct = totalCast ? ((row.winnerVotes / totalCast) * 100).toFixed(1) : '0';
  const rPct = totalCast ? ((row.runnerVotes / totalCast) * 100).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.2 }}
        className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${wColor}, ${rColor})` }} />
        <div className="p-6">
          <button onClick={onClose} className="absolute top-5 right-5 text-zinc-500 hover:text-white font-black text-lg leading-none">✕</button>

          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{row.division} Division • #{row.id}</p>
          <h3 className="text-2xl font-black text-white tracking-tight mt-1">{row.constituency}</h3>

          {/* Winner */}
          <div className="mt-5 rounded-xl p-4" style={{ backgroundColor: wColor + '18', border: `1px solid ${wColor}44` }}>
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Winner</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[13px] font-black text-white leading-tight">{row.winnerName}</p>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: wColor + '33', color: wColor }}>{row.winnerParty}</span>
              </div>
              <p className="text-2xl font-black" style={{ color: wColor }}>{row.winnerVotes.toLocaleString()}</p>
            </div>
            <div className="mt-3 h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${wPct}%`, backgroundColor: wColor }} />
            </div>
            <p className="text-right text-[9px] font-bold mt-1" style={{ color: wColor }}>{wPct}%</p>
          </div>

          {/* Runner-up */}
          <div className="mt-3 rounded-xl p-4" style={{ backgroundColor: rColor + '12', border: `1px solid ${rColor}33` }}>
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mb-1">Runner-up</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[13px] font-black text-white leading-tight">{row.runnerName}</p>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: rColor + '33', color: rColor }}>{row.runnerParty}</span>
              </div>
              <p className="text-2xl font-black" style={{ color: rColor }}>{row.runnerVotes.toLocaleString()}</p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: 'Winning Margin', val: `+${row.margin.toLocaleString()}` },
              { label: 'Voter Turnout',  val: `${row.turnout}%` },
              { label: 'Total Voters',   val: row.totalVoters.toLocaleString() },
              { label: 'Male / Female',  val: `${row.maleVoters.toLocaleString()} / ${row.femaleVoters.toLocaleString()}` },
              { label: 'Poverty Rate',   val: `${row.povertyRate}%` },
              { label: 'Literacy Rate',  val: `${row.literacyRate}%` },
            ].map(r => (
              <div key={r.label} className="bg-zinc-800/50 rounded-lg p-2.5">
                <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{r.label}</p>
                <p className="text-[12px] font-black text-white mt-0.5">{r.val}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Row component ─────────────────────────────────────────────────────────────
function ExplorerRow({ row, onClick }: { row: ElectionRow; onClick: () => void }) {
  const wc = partyColor(row.winnerParty);
  const rc = partyColor(row.runnerParty);
  const pct = (row.winnerVotes + row.runnerVotes) > 0
    ? (row.winnerVotes / (row.winnerVotes + row.runnerVotes)) * 100
    : 60;

  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClick}
      className="border-b border-zinc-800/60 hover:bg-zinc-800/30 cursor-pointer transition-colors group"
    >
      <td className="py-2 px-3 text-[9px] font-black text-zinc-600">{row.id}</td>
      <td className="py-2 px-3">
        <p className="text-[10px] font-black text-white uppercase tracking-wide group-hover:text-red-400 transition-colors">{row.constituency}</p>
        <p className="text-[8px] text-zinc-600">{row.division}</p>
      </td>
      <td className="py-2 px-3">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: wc }} />
          <span className="text-[9px] font-black text-white truncate max-w-[120px]">{row.winnerName}</span>
        </div>
        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full ml-3" style={{ backgroundColor: wc + '22', color: wc }}>{row.winnerParty}</span>
      </td>
      <td className="py-2 px-3 text-[10px] font-black text-white text-right">{row.winnerVotes.toLocaleString()}</td>
      <td className="py-2 px-3">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: rc }} />
          <span className="text-[8px] font-black text-zinc-400 truncate max-w-[100px]">{row.runnerName}</span>
        </div>
        <span className="text-[8px] font-black px-1.5 py-0.5 rounded-full ml-3" style={{ backgroundColor: rc + '22', color: rc }}>{row.runnerParty}</span>
      </td>
      <td className="py-2 px-3 text-[10px] font-black text-right" style={{ color: wc }}>+{row.margin.toLocaleString()}</td>
      <td className="py-2 px-3">
        <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: wc }} />
        </div>
        <p className="text-[8px] text-zinc-600 mt-0.5">{row.turnout}%</p>
      </td>
    </motion.tr>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ConstituencyExplorer() {
  const data = useMemo(() => getElectionData(), []);
  const summary = useMemo(() => getElectionSummary(), []);
  const [search, setSearch] = useState('');
  const [divFilter, setDivFilter] = useState('All');
  const [partyFilter, setPartyFilter] = useState('All');
  const [selected, setSelected] = useState<ElectionRow | null>(null);
  const [sortKey, setSortKey] = useState<'margin' | 'winnerVotes' | 'turnout' | 'totalVoters'>('margin');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');

  const allParties = useMemo(() => Object.keys(summary).sort((a, b) => summary[b] - summary[a]), [summary]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return data
      .filter(r => {
        if (divFilter !== 'All' && r.division !== divFilter) return false;
        if (partyFilter !== 'All' && r.winnerParty !== partyFilter) return false;
        if (q && !r.constituency.toLowerCase().includes(q) && !r.winnerName.toLowerCase().includes(q) && !r.division.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => sortDir === 'desc' ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]);
  }, [data, search, divFilter, partyFilter, sortKey, sortDir]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortBtn = ({ k, label }: { k: typeof sortKey; label: string }) => (
    <button onClick={() => toggleSort(k)} className={`text-[8px] font-black uppercase tracking-widest flex items-center gap-0.5 transition-colors ${sortKey === k ? 'text-red-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
      {label} {sortKey === k ? (sortDir === 'desc' ? '↓' : '↑') : '↕'}
    </button>
  );

  return (
    <>
      <AnimatePresence>
        {selected && <Modal row={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <div className="rounded-2xl border border-zinc-800 bg-[#0d1117] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              Constituency <span className="text-red-500">Explorer</span>
            </h3>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
              Real Election Data • All 300 Constituencies • Click any row for full results
            </p>
          </div>

          {/* Party summary pills */}
          <div className="flex flex-wrap gap-1.5">
            {allParties.slice(0, 8).map(p => (
              <button key={p} onClick={() => setPartyFilter(f => f === p ? 'All' : p)}
                className="px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all"
                style={{
                  borderColor: partyFilter === p ? partyColor(p) : partyColor(p) + '44',
                  backgroundColor: partyFilter === p ? partyColor(p) + '22' : 'transparent',
                  color: partyColor(p),
                }}>
                {p} {summary[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-3 border-b border-zinc-800/50 bg-black/20 flex flex-wrap gap-3 items-center">
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search constituency, candidate, division…"
            className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-[11px] text-white placeholder-zinc-600 focus:outline-none focus:border-red-600/50 w-56"
          />
          <div className="flex gap-1.5 flex-wrap">
            {DIVISIONS_LIST.map(d => (
              <button key={d} onClick={() => setDivFilter(d)}
                className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${divFilter === d ? 'bg-red-600 border-red-600 text-white' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}>
                {d}
              </button>
            ))}
          </div>
          <span className="ml-auto text-[9px] text-zinc-600 font-bold">{filtered.length} / {data.length} seats</span>
        </div>

        {/* Table */}
        <div className="overflow-auto max-h-[520px]">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-zinc-900/95 border-b border-zinc-800 backdrop-blur-sm z-10">
              <tr>
                <th className="py-2.5 px-3 text-[8px] font-black uppercase text-zinc-500 w-8">#</th>
                <th className="py-2.5 px-3 text-[8px] font-black uppercase text-zinc-500">Constituency</th>
                <th className="py-2.5 px-3 text-[8px] font-black uppercase text-zinc-500">Winner</th>
                <th className="py-2.5 px-3 text-right"><SortBtn k="winnerVotes" label="Votes" /></th>
                <th className="py-2.5 px-3 text-[8px] font-black uppercase text-zinc-500">Runner-up</th>
                <th className="py-2.5 px-3 text-right"><SortBtn k="margin" label="Margin" /></th>
                <th className="py-2.5 px-3"><SortBtn k="turnout" label="Turnout" /></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(row => (
                <ExplorerRow key={row.id} row={row} onClick={() => setSelected(row)} />
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-zinc-600 text-sm font-black uppercase">No results found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-zinc-800 bg-black/30 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Source: Bangladesh Election Commission 2026 • Sort by column headers • Click row for detailed breakdown</p>
        </div>
      </div>
    </>
  );
}
