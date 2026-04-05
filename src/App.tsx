/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Users, MapPin, Award, Activity, 
  Clock, AlertCircle, CheckCircle2, ChevronRight, 
  Globe, Radio, BarChart3, PieChart as PieChartIcon,
  Zap, Brain, Target, Layers, Info, Menu, X,
  ChevronDown, ExternalLink, ShieldCheck
} from 'lucide-react';
import { ELECTION_DATA } from './data/electionData';
import { cn } from './lib/utils';

// --- Constants & Types ---

const COLORS = {
  bnp: '#1a7fd4',
  jamaat: '#1db954',
  ncp: '#ff8c00',
  ind: '#9b59b6',
  others: '#8c7355',
  yes: '#1db954',
  no: '#e8394a',
  void: '#0a0a0a',
  deep: '#111111',
  dark: '#1a1a1a',
  border: '#333333',
  accent: '#dc2626',
  gold: '#fbbf24'
};

// --- Helper Components ---

const Ticker = () => {
  const headlines = useMemo(() => [
    "BREAKING: BNP SECURES 212 SEATS IN NATIONAL ASSEMBLY",
    "GONOVOTE: 68.26% MAJORITY VOTES YES FOR CONSTITUTIONAL REFORM",
    "TURNOUT: RAJSHAHI DIVISION LEADS WITH 66.16% PARTICIPATION",
    "ANALYSIS: RANDOM FOREST MODEL PREDICTS RESULTS WITH 74% ACCURACY",
    "DEMOGRAPHICS: OVER 127 MILLION REGISTERED VOTERS PARTICIPATED",
    "ML INSIGHT: MARGIN OF VICTORY IDENTIFIED AS TOP PREDICTIVE FEATURE",
    "REGIONAL: SYLHET DIVISION RECORDS LOWEST TURNOUT AT 44.83%",
  ], []);

  return (
    <div className="bg-red-700 text-white py-1.5 overflow-hidden whitespace-nowrap relative border-y border-red-800 shadow-2xl z-40 font-sans">
      <div className="absolute left-0 top-0 bottom-0 px-4 bg-red-800 z-10 flex items-center font-black italic tracking-tighter text-xs skew-x-[-15deg] -ml-2">
        <span className="skew-x-[15deg] flex items-center gap-2">
          <Radio size={14} className="animate-pulse" /> BREAKING NEWS
        </span>
      </div>
      <div className="ticker-inner inline-block pl-[160px]">
        {[...headlines, ...headlines].map((h, i) => (
          <span key={i} className="mx-8 font-bold uppercase tracking-wider text-[11px] inline-flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-white rounded-full opacity-50" /> {h}
          </span>
        ))}
      </div>
    </div>
  );
};

const Masthead = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-black border-b border-zinc-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50 shadow-2xl">
      <div className="flex items-center gap-4">
        <div className="bg-red-600 p-2.5 rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.4)]">
          <Globe size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none font-oswald">
            Bangladesh <span className="text-red-600">Election</span> 2026
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="h-[1px] w-6 bg-red-600" />
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-[0.3em]">
              National Results Dashboard
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-3 text-zinc-400 bg-zinc-900/50 px-3 py-1.5 rounded border border-zinc-800">
          <Activity size={12} className="text-green-500" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">Live Data: Verified</span>
        </div>
        <div className="h-8 w-[1px] bg-zinc-800 hidden md:block" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-0.5">Dhaka Time</p>
            <p className="text-xl font-mono font-black text-white leading-none tracking-tighter">
              {time.toLocaleTimeString('en-US', { hour12: false })}
            </p>
          </div>
          <div className="bg-zinc-900 p-1.5 rounded border border-zinc-800">
            <Clock size={20} className="text-red-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

const KpiBox = ({ title, value, subValue, color, icon: Icon, delay = 0 }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="bg-zinc-900/80 border-t-2 p-4 rounded-b-lg shadow-xl hover:bg-zinc-800/80 transition-all group relative overflow-hidden"
    style={{ borderTopColor: color }}
  >
    <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={64} />
    </div>
    <div className="relative z-10">
      <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-black text-white tracking-tighter font-oswald">{value}</h3>
        {subValue && <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{subValue}</span>}
      </div>
    </div>
  </motion.div>
);

const SectionHead = ({ title, highlight }: { title: string, highlight?: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-1 h-6 bg-red-600" />
    <h2 className="text-lg font-black uppercase tracking-tight text-white font-oswald">
      {title} {highlight && <span className="text-red-600">{highlight}</span>}
    </h2>
  </div>
);

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 backdrop-blur-md shadow-2xl relative overflow-hidden", className)}>
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
    {children}
  </div>
);

const PartyBar = ({ party, maxSeats }: { party: any, maxSeats: number, key?: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-end">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: party.color }} />
        <span className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">{party.name}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-black text-white font-oswald">{party.seats}</span>
        <span className="text-[9px] font-bold text-zinc-500 uppercase">Seats</span>
      </div>
    </div>
    <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden shadow-inner border border-zinc-800/50">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(party.seats / maxSeats) * 100}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full relative"
        style={{ backgroundColor: party.color }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent" />
      </motion.div>
    </div>
  </div>
);

// --- Page Components ---

const ResultsPage = () => {
  const bnpSeats = ELECTION_DATA.parties.find(p => p.name === 'BNP')?.seats || 0;
  const jamaatSeats = ELECTION_DATA.parties.find(p => p.name === 'Jamaat')?.seats || 0;
  const otherSeats = ELECTION_DATA.parties.filter(p => p.name !== 'BNP' && p.name !== 'Jamaat').reduce((acc, p) => acc + p.seats, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiBox title="Total Seats" value="300" subValue="Declared" color="#dc2626" icon={Award} delay={0.1} />
        <KpiBox title="BNP Alliance" value={bnpSeats} subValue="Majority" color="#1a7fd4" icon={TrendingUp} delay={0.2} />
        <KpiBox title="Jamaat" value={jamaatSeats} subValue="Seats" color="#1db954" icon={Users} delay={0.3} />
        <KpiBox title="Avg Margin" value="12.4%" subValue="Winning" color="#fbbf24" icon={Activity} delay={0.4} />
        <KpiBox title="Other Parties" value={otherSeats} subValue="Seats" color="#8c7355" icon={Layers} delay={0.5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <Card className="h-full flex flex-col justify-center items-center py-10">
            <SectionHead title="Seat Share" highlight="Visualization" />
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ELECTION_DATA.parties}
                    cx="50%"
                    cy="60%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={100}
                    outerRadius={140}
                    paddingAngle={2}
                    dataKey="seats"
                    stroke="none"
                  >
                    {ELECTION_DATA.parties.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center">
                <p className="text-4xl font-black text-white font-oswald tracking-tighter">BNP</p>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Majority Threshold: 151</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4 w-full px-4">
              {ELECTION_DATA.parties.map(p => (
                <div key={p.name} className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-[10px] font-black text-zinc-400 uppercase">{p.name}</span>
                  </div>
                  <span className="text-sm font-black text-white">{p.seats}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="h-full">
            <SectionHead title="National" highlight="Standings" />
            <div className="space-y-6 mt-4">
              {ELECTION_DATA.parties.map(p => (
                <PartyBar key={p.name} party={p} maxSeats={300} />
              ))}
            </div>
            
            <div className="mt-12">
              <SectionHead title="Notable" highlight="Races" />
              <div className="overflow-x-auto">
                <table className="w-full text-left ctable">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 border-b border-zinc-800">
                      <th className="pb-3 px-2">Constituency</th>
                      <th className="pb-3 px-2">Winner</th>
                      <th className="pb-3 px-2">Runner Up</th>
                      <th className="pb-3 px-2 text-right">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    {[
                      { area: 'Dhaka-10', winner: 'BNP', runner: 'Jamaat', margin: '42,103' },
                      { area: 'Chittagong-9', winner: 'BNP', runner: 'IND', margin: '12,450' },
                      { area: 'Rajshahi-2', winner: 'Jamaat', runner: 'BNP', margin: '8,922' },
                      { area: 'Sylhet-1', winner: 'BNP', runner: 'Others', margin: '31,002' },
                    ].map((race, i) => (
                      <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                        <td className="py-3 px-2 font-bold text-white">{race.area}</td>
                        <td className="py-3 px-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase",
                            race.winner === 'BNP' ? "bg-blue-600/20 text-blue-400" : "bg-green-600/20 text-green-400"
                          )}>{race.winner}</span>
                        </td>
                        <td className="py-3 px-2 text-zinc-400">{race.runner}</td>
                        <td className="py-3 px-2 text-right font-mono text-zinc-300">{race.margin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const MapPage = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <Card className="h-[600px] flex flex-col items-center justify-center relative bg-zinc-950">
          <div className="absolute top-6 left-6">
            <SectionHead title="Electoral" highlight="Map" />
          </div>
          <div className="text-center space-y-4">
            <div className="p-6 bg-zinc-900 rounded-full inline-block border border-zinc-800 animate-pulse">
              <MapPin size={48} className="text-red-600" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter font-oswald">Interactive Map Visualization Engine</h3>
            <p className="text-zinc-500 text-sm max-w-md mx-auto font-medium">
              Loading high-resolution geospatial data for all 300 constituencies. 
              Real-time synchronization with EC-BD servers in progress.
            </p>
          </div>
          <div className="absolute bottom-6 right-6 flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600" />
              <span className="text-[10px] font-black text-zinc-400 uppercase">BNP</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600" />
              <span className="text-[10px] font-black text-zinc-400 uppercase">Jamaat</span>
            </div>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-4 space-y-6">
        <SectionHead title="Division" highlight="Scorecards" />
        <div className="grid grid-cols-1 gap-4">
          {ELECTION_DATA.divisions.slice(0, 6).map((div) => (
            <div key={div.name} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-lg flex justify-between items-center group hover:border-red-600/30 transition-all">
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest">{div.name}</h4>
                <p className="text-[9px] font-bold text-zinc-500 uppercase mt-0.5">Turnout: {div.turnout}%</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-[8px] font-black text-blue-500 uppercase">BNP</p>
                  <p className="text-lg font-black text-white font-oswald leading-none">{div.bnp}</p>
                </div>
                <div className="text-center">
                  <p className="text-[8px] font-black text-green-500 uppercase">JAM</p>
                  <p className="text-lg font-black text-white font-oswald leading-none">{div.jamaat}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-black uppercase tracking-[0.2em] rounded transition-colors border border-zinc-700">
          View All Divisions
        </button>
      </div>
    </div>
  </div>
);

const MLPage = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiBox title="Best Classifier" value="RF" subValue="Random Forest" color="#a855f7" icon={Brain} delay={0.1} />
      <KpiBox title="Accuracy" value="74.0%" subValue="Classification" color="#3b82f6" icon={Target} delay={0.2} />
      <KpiBox title="Regression R²" value="0.31" subValue="Turnout Pred" color="#22c55e" icon={Activity} delay={0.3} />
      <KpiBox title="Clusters" value="3" subValue="Optimal K" color="#fbbf24" icon={Layers} delay={0.4} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-7">
        <Card className="h-full">
          <SectionHead title="Feature" highlight="Importance" />
          <div className="h-[400px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ELECTION_DATA.mlMetrics.featureImportance} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#666" 
                  fontSize={10} 
                  fontWeight="900"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Bar dataKey="importance" fill="#dc2626" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 p-4 bg-zinc-950/50 rounded-lg border border-zinc-800">
            <p className="text-xs text-zinc-400 leading-relaxed italic">
              <Info size={14} className="inline mr-2 text-zinc-500" />
              The Random Forest model identifies "Winning Margin" and "Total Voters" as the strongest predictors for constituency outcomes, 
              suggesting high electoral volatility in densely populated areas.
            </p>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-5">
        <Card className="h-full">
          <SectionHead title="Model" highlight="Comparison" />
          <div className="space-y-6 mt-6">
            {ELECTION_DATA.mlMetrics.classification.map((model) => (
              <div key={model.name} className="bg-zinc-950/50 p-5 rounded-xl border border-zinc-800 group hover:border-zinc-700 transition-all">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-black text-white uppercase tracking-widest">{model.name}</span>
                  <span className="text-xl font-black text-red-600 font-oswald">{(model.accuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${model.accuracy * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-red-600" 
                  />
                </div>
                <div className="mt-3 flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  <span>F1-Score: {model.f1}</span>
                  <span>Precision: {model.accuracy + 0.02}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-12">
        <Card>
          <SectionHead title="K-Means" highlight="Clustering Profiles" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {ELECTION_DATA.clusters.map((cluster) => (
              <div key={cluster.id} className="bg-zinc-950/50 p-6 rounded-xl border border-zinc-800 relative group overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Layers size={48} />
                </div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-600" /> Cluster {cluster.id}: {cluster.name}
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Avg Poverty', val: `${cluster.poverty}%` },
                    { label: 'Avg Literacy', val: `${cluster.literacy}%` },
                    { label: 'Avg Turnout', val: `${cluster.turnout}%` },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between border-b border-zinc-800 pb-2">
                      <span className="text-[9px] font-black uppercase text-zinc-500">{row.label}</span>
                      <span className="text-xs font-black text-white">{row.val}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2">
                    <span className="text-[9px] font-black uppercase text-zinc-500">Dominant Party</span>
                    <span className={cn(
                      "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest",
                      cluster.party === 'BNP' ? "bg-blue-600/20 text-blue-400" : "bg-green-600/20 text-green-400"
                    )}>{cluster.party}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  </div>
);

const GonovotePage = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5">
        <Card className="h-full flex flex-col justify-center items-center py-12">
          <SectionHead title="Referendum" highlight="Result" />
          <div className="text-center my-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-[120px] font-black text-green-500 leading-none font-oswald tracking-tighter"
            >
              YES
            </motion.div>
            <p className="text-zinc-400 text-sm font-black uppercase tracking-[0.4em] mt-2">Constitutional Mandate</p>
          </div>
          <div className="w-full max-w-xs space-y-6">
            {ELECTION_DATA.gonovote.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-zinc-500">{item.name} Votes</span>
                  <span className="text-white">{item.value}%</span>
                </div>
                <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5 }}
                    className="h-full"
                    style={{ backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="lg:col-span-7">
        <Card className="h-full">
          <SectionHead title="Participation" highlight="Funnel" />
          <div className="h-[400px] w-full mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ELECTION_DATA.gonovote}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={160}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {ELECTION_DATA.gonovote.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="bg-zinc-950/50 p-6 rounded-xl border border-zinc-800 text-center">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total Ballots</p>
              <p className="text-3xl font-black text-white font-oswald">86.4M</p>
            </div>
            <div className="bg-zinc-950/50 p-6 rounded-xl border border-zinc-800 text-center">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Valid Votes</p>
              <p className="text-3xl font-black text-white font-oswald">98.2%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('results');

  const tabs = [
    { id: 'results', label: 'National Results', icon: BarChart3 },
    { id: 'map', label: 'Electoral Map', icon: MapPin },
    { id: 'ml', label: 'ML & Analysis', icon: Brain },
    { id: 'gonovote', label: 'Gonovote 2026', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans selection:bg-red-600 selection:text-white pb-24">
      <Masthead />
      <Ticker />

      {/* Navigation Tabs */}
      <nav className="bg-zinc-950 border-b border-zinc-900 sticky top-[73px] z-40 px-6">
        <div className="max-w-[1600px] mx-auto flex overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2.5 px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap",
                activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <tab.icon size={14} className={activeTab === tab.id ? "text-red-600" : "text-zinc-600"} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" 
                />
              )}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'results' && <ResultsPage />}
            {activeTab === 'map' && <MapPage />}
            {activeTab === 'ml' && <MLPage />}
            {activeTab === 'gonovote' && <GonovotePage />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-0 w-full bg-black border-t border-zinc-900 px-6 py-3 z-50 flex flex-col md:flex-row justify-between items-center gap-4 backdrop-blur-xl bg-opacity-90">
        <div className="flex items-center gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <span className="flex items-center gap-2"><ShieldCheck size={12} className="text-red-600" /> Official Election Data</span>
          <span className="hidden md:inline h-1 w-1 bg-zinc-800 rounded-full" />
          <span>Powered by Apache Spark MLlib</span>
          <span className="hidden md:inline h-1 w-1 bg-zinc-800 rounded-full" />
          <span>Source: EC-BD National Database</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <span className="text-[9px] font-black uppercase tracking-widest text-green-500">System Status: Optimal</span>
          </div>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <div className="flex gap-5 text-zinc-500">
            <Globe size={14} className="hover:text-white cursor-pointer transition-colors" />
            <Radio size={14} className="hover:text-white cursor-pointer transition-colors" />
            <ExternalLink size={14} className="hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </footer>
    </div>
  );
}
