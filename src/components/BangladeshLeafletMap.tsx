import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getElectionData, partyColor, type ElectionRow } from '../data/electionCsv';

// ─── Extract district name from constituency string e.g. "Comilla-1" → "Comilla"
function toDistrict(constituency: string): string {
  return constituency.replace(/-\d+$/, '').trim();
}

// ─── GeoJSON district name aliases (GeoJSON → CSV name) ─────────────────────
const DIST_ALIASES: Record<string, string> = {
  'Jessore':           'Jashore',
  'Bogra':             'Bogura',
  'Chapai Nawabganj':  'Chapainawabganj',
  'Moulavibazar':      'Moulvibazar',
  'Barisal':           'Barishal',
};

// Normalize GeoJSON district name → CSV district name
function resolveDistrictName(geoName: string): string {
  const trimmed = geoName.trim();
  if (DIST_ALIASES[trimmed]) return DIST_ALIASES[trimmed];
  if (trimmed.toLowerCase().startsWith('cox')) return "Cox's Bazar";
  return trimmed;
}

// ─── Build district → rows index from CSV ────────────────────────────────────
function buildDistrictIndex(rows: ElectionRow[]): Map<string, ElectionRow[]> {
  const idx = new Map<string, ElectionRow[]>();
  for (const r of rows) {
    const dist = toDistrict(r.constituency);
    if (!idx.has(dist)) idx.set(dist, []);
    idx.get(dist)!.push(r);
  }
  return idx;
}

// ─── Majority winner for a district ──────────────────────────────────────────
function districtWinnerFromIndex(idx: Map<string, ElectionRow[]>, rawGeoName: string): string {
  const distName = resolveDistrictName(rawGeoName);
  const rows = idx.get(distName) ?? [];
  if (!rows.length) return 'BNP';
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.winnerParty] = (counts[r.winnerParty] ?? 0) + 1;
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'BNP';
}

// ─── Build rich HTML popup from CSV rows ────────────────────────────────────
function buildPopupHtml(distName: string, divName: string, rows: ElectionRow[]): string {
  if (!rows.length) {
    return `<div style="font-family:sans-serif;padding:8px;min-width:220px">
      <div style="font-size:13px;font-weight:900;text-transform:uppercase;margin-bottom:4px">${distName}</div>
      <div style="font-size:10px;color:#888">${divName} Division • No data available</div>
    </div>`;
  }

  // Party seat count for this district
  const counts: Record<string, number> = {};
  for (const r of rows) counts[r.winnerParty] = (counts[r.winnerParty] ?? 0) + 1;
  const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'BNP';
  const domColor = partyColor(dominant);

  // Constituency rows HTML (max 6 to keep popup manageable)
  const constRows = rows
    .sort((a, b) => a.constituency.localeCompare(b.constituency))
    .slice(0, 8)
    .map(r => {
      const wc = partyColor(r.winnerParty);
      const rc = partyColor(r.runnerParty);
      const totalCast = r.winnerVotes + r.runnerVotes;
      const wPct = totalCast ? ((r.winnerVotes / totalCast) * 100).toFixed(0) : '0';
      const barFill = `width:${wPct}%;background:${wc};height:100%;border-radius:3px`;
      return `
        <div style="border:1px solid #2a2a2a;border-radius:8px;padding:8px 10px;margin-bottom:6px;background:#111">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
            <span style="font-size:10px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:.05em">${r.constituency}</span>
            <span style="font-size:8px;color:#666;font-weight:700">Turnout ${r.turnout}%</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:6px">
            <div style="flex:1">
              <div style="display:flex;align-items:center;gap:4px;margin-bottom:2px">
                <div style="width:8px;height:8px;border-radius:50%;background:${wc};flex-shrink:0"></div>
                <span style="font-size:9px;color:#e0e0e0;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px">${r.winnerName}</span>
              </div>
              <span style="font-size:8px;font-weight:900;padding:1px 5px;border-radius:3px;background:${wc}33;color:${wc}">${r.winnerParty}</span>
            </div>
            <span style="font-size:13px;font-weight:900;color:${wc};white-space:nowrap">${r.winnerVotes.toLocaleString()}</span>
          </div>
          <div style="height:4px;background:#222;border-radius:3px;margin-bottom:5px;overflow:hidden">
            <div style="${barFill}"></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div style="display:flex;align-items:center;gap:4px">
              <div style="width:6px;height:6px;border-radius:50%;background:${rc};flex-shrink:0"></div>
              <span style="font-size:8px;color:#aaa;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100px">${r.runnerName} <span style="color:${rc}">${r.runnerParty}</span></span>
            </div>
            <span style="font-size:9px;color:#888;font-weight:700">${r.runnerVotes.toLocaleString()}</span>
          </div>
          <div style="text-align:right;font-size:8px;color:${wc};font-weight:900;margin-top:3px">Margin: +${r.margin.toLocaleString()}</div>
        </div>`;
    }).join('');

  const moreNote = rows.length > 8 ? `<div style="text-align:center;font-size:8px;color:#555;padding:4px">+ ${rows.length - 8} more constituencies</div>` : '';

  // Party breakdown badges
  const partyBadges = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([party, cnt]) =>
      `<span style="font-size:8px;font-weight:900;padding:2px 7px;border-radius:20px;background:${partyColor(party)}22;color:${partyColor(party)};border:1px solid ${partyColor(party)}44">${party}: ${cnt}</span>`
    ).join('');

  return `
    <div style="font-family:sans-serif;min-width:260px;max-width:300px;max-height:520px;overflow-y:auto">
      <div style="position:sticky;top:0;background:#0d1117;padding:8px 10px 6px;border-bottom:1px solid #222;z-index:1">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
          <div style="width:10px;height:10px;border-radius:50%;background:${domColor};flex-shrink:0"></div>
          <div>
            <div style="font-size:13px;font-weight:900;text-transform:uppercase;color:#fff;letter-spacing:.06em">${distName}</div>
            <div style="font-size:9px;color:#666;font-weight:600">${divName} Division • ${rows.length} Constituencies</div>
          </div>
        </div>
        <div style="display:flex;gap:4px;flex-wrap:wrap">${partyBadges}</div>
      </div>
      <div style="padding:8px 10px 4px">
        ${constRows}
        ${moreNote}
      </div>
    </div>`;
}

// ─── Hover tooltip state ──────────────────────────────────────────────────────
interface HoverInfo {
  distName: string;
  divName: string;
  dominant: string;
  rows: ElectionRow[];
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BangladeshLeafletMap() {
  const mapRef      = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [hover, setHover]     = useState<HoverInfo | null>(null);

  const electionRows   = useMemo(() => getElectionData(), []);
  const districtIndex  = useMemo(() => buildDistrictIndex(electionRows), [electionRows]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [23.685, 90.3563],
      zoom: 7,
      zoomControl: true,
      attributionControl: false,
    });
    mapInstance.current = map;

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      { subdomains: 'abcd', maxZoom: 19 }
    ).addTo(map);

    fetch('https://raw.githubusercontent.com/ifahimreza/bangladesh-geojson/master/bangladesh.geojson')
      .then(r => r.json())
      .then(data => {
        const geoLayer = L.geoJSON(data, {
          style(feature) {
            const rawName  = (feature?.properties?.NAME_2 ?? '').trim();
            const dominant = districtWinnerFromIndex(districtIndex, rawName);
            return {
              color: '#fff',
              weight: 0.6,
              fillColor: partyColor(dominant),
              fillOpacity: 0.30, // keep low so circle markers are visible
            };
          },
          onEachFeature(feature, layer) {
            const divName  = (feature?.properties?.NAME_1 ?? '').trim();
            const rawName  = (feature?.properties?.NAME_2 ?? '').trim();
            const distName = resolveDistrictName(rawName);
            const rows     = districtIndex.get(distName) ?? [];
            const dominant = districtWinnerFromIndex(districtIndex, rawName);

            layer.on({
              mouseover(e) {
                e.target.setStyle({ weight: 2, fillOpacity: 0.85 });
                setHover({ distName, divName, dominant, rows });
              },
              mouseout(e) {
                geoLayer.resetStyle(e.target);
                setHover(null);
              },
            });

            layer.bindPopup(
              buildPopupHtml(distName, divName, rows),
              { maxWidth: 320, className: 'election-popup' }
            );
          },
        }).addTo(map);

        // ── Constituency circle markers (one per seat, colored by winning party)
        // Distribute them within each district's bounding box
        const districtBounds: Record<string, L.LatLngBounds> = {};
        geoLayer.eachLayer((layer: any) => {
          const name = resolveDistrictName(layer.feature?.properties?.NAME_2 ?? '');
          if (name) districtBounds[name] = layer.getBounds();
        });

        for (const [distName, rows] of districtIndex.entries()) {
          const bounds = districtBounds[distName];
          if (!bounds) continue;

          const n = rows.length;
          const cols = Math.ceil(Math.sqrt(n * 1.6)); // spread wider than tall
          const latSpan = bounds.getNorth() - bounds.getSouth();
          const lngSpan = bounds.getEast()  - bounds.getWest();
          const padLat  = latSpan * 0.12;
          const padLng  = lngSpan * 0.12;

          rows.forEach((row, i) => {
            const col = i % cols;
            const rowIdx = Math.floor(i / cols);
            const totalRows = Math.ceil(n / cols);

            const lat = (bounds.getNorth() - padLat) - (rowIdx / Math.max(totalRows - 1, 1)) * (latSpan - 2 * padLat);
            const lng = (bounds.getWest()  + padLng) + (col  / Math.max(cols - 1, 1))     * (lngSpan - 2 * padLng);

            const color = partyColor(row.winnerParty);
            const marker = L.circleMarker([lat, lng], {
              radius: 5,
              fillColor: color,
              fillOpacity: 0.92,
              color: '#000',
              weight: 0.8,
              pane: 'markerPane',
            });

            marker.bindTooltip(`
              <div style="font-family:sans-serif;padding:4px 8px;min-width:160px">
                <div style="font-size:11px;font-weight:900;text-transform:uppercase;color:#fff;margin-bottom:3px">${row.constituency}</div>
                <div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">
                  <div style="width:8px;height:8px;border-radius:50%;background:${color}"></div>
                  <span style="font-size:9px;font-weight:700;color:${color}">${row.winnerParty}</span>
                  <span style="font-size:9px;color:#ccc">— ${row.winnerName}</span>
                </div>
                <div style="font-size:9px;color:#888">Votes: ${row.winnerVotes.toLocaleString()} | Margin: +${row.margin.toLocaleString()}</div>
              </div>
            `, { className: 'election-popup', direction: 'top', offset: [0, -6] });

            marker.on('click', () => {
              const popup = L.popup({ className: 'election-popup', maxWidth: 320 })
                .setLatLng([lat, lng])
                .setContent(buildPopupHtml(distName, row.division, [row]))
                .openOn(map);
            });

            marker.addTo(map);
          });
        }

        setLoading(false);
      })
      .catch(() => setError('Failed to load GeoJSON. Check network connection.'));

    return () => { map.remove(); mapInstance.current = null; };
  }, [districtIndex]);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-zinc-800 bg-[#0d1117]">
      {/* Header */}
      <div className="px-6 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-widest">
            Electoral <span className="text-red-500">Map</span>
          </h3>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
            Bangladesh • 300 Parliamentary Constituencies • Click district for full results
          </p>
        </div>
        {/* Party legend */}
        <div className="flex flex-wrap items-center gap-2 text-[8px] font-black uppercase">
          {[['BNP','#1a7fd4'],['Jamaat','#1db954'],['NCP','#ff8c00'],['IND','#9b59b6'],['Others','#8c7355']].map(([p, c]) => (
            <div key={p} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
              <span style={{ color: c }}>{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <div ref={mapRef} style={{ height: '580px', width: '100%', background: '#0a0a0a' }} />

        {loading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/80 z-50">
            <div className="w-10 h-10 rounded-full border-2 border-red-600 border-t-transparent animate-spin mb-4" />
            <p className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Loading Map…</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80 z-50">
            <p className="text-red-400 text-sm font-black uppercase">{error}</p>
          </div>
        )}

        {/* Hover tooltip */}
        {hover && (
          <div className="absolute top-4 left-4 z-[9999] pointer-events-none shadow-2xl w-72"
            style={{ border: `1px solid ${partyColor(hover.dominant)}44`, borderRadius: 12, background: '#0d1117', overflow: 'hidden' }}>
            {/* color bar */}
            <div className="h-1 w-full" style={{ backgroundColor: partyColor(hover.dominant) }} />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: partyColor(hover.dominant) }} />
                <div>
                  <p className="text-[12px] font-black text-white uppercase tracking-widest leading-none">{hover.distName}</p>
                  <p className="text-[9px] text-zinc-500 font-bold mt-0.5">{hover.divName} Division</p>
                </div>
                <span className="ml-auto text-[8px] font-black px-2 py-1 rounded-full" style={{ background: partyColor(hover.dominant) + '22', color: partyColor(hover.dominant) }}>
                  {hover.dominant}
                </span>
              </div>

              {hover.rows.length === 0 ? (
                <p className="text-[9px] text-zinc-600 uppercase font-bold">No constituency data</p>
              ) : (
                <>
                  {/* Party breakdown */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {Object.entries(
                      hover.rows.reduce((acc, r) => { acc[r.winnerParty] = (acc[r.winnerParty] ?? 0) + 1; return acc; }, {} as Record<string,number>)
                    ).sort((a,b) => b[1]-a[1]).map(([party, cnt]) => (
                      <span key={party} className="text-[8px] font-black px-2 py-0.5 rounded-full" style={{ background: partyColor(party) + '22', color: partyColor(party), border: `1px solid ${partyColor(party)}44` }}>
                        {party} {cnt}
                      </span>
                    ))}
                  </div>

                  {/* Top constituency preview */}
                  {hover.rows.slice(0, 2).map(r => (
                    <div key={r.id} className="mb-2 p-2 rounded-lg" style={{ background: '#111', border: '1px solid #222' }}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] font-black text-white uppercase">{r.constituency}</span>
                        <span className="text-[8px] text-zinc-500">Turnout {r.turnout}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: partyColor(r.winnerParty) }} />
                        <span className="text-[9px] font-bold text-white truncate">{r.winnerName}</span>
                        <span className="text-[8px] font-black ml-auto" style={{ color: partyColor(r.winnerParty) }}>{r.winnerVotes.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: partyColor(r.runnerParty) }} />
                        <span className="text-[8px] text-zinc-500 truncate">{r.runnerName}</span>
                        <span className="text-[8px] text-zinc-500 ml-auto">{r.runnerVotes.toLocaleString()}</span>
                      </div>
                      <div className="text-right text-[7px] font-black mt-1" style={{ color: partyColor(r.winnerParty) }}>+{r.margin.toLocaleString()} margin</div>
                    </div>
                  ))}
                  {hover.rows.length > 2 && (
                    <p className="text-[8px] text-zinc-600 font-bold text-center mt-1">Click for all {hover.rows.length} constituencies ↗</p>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-2.5 border-t border-zinc-800 bg-black/40 flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">
          Hover district → preview results • Click district → full constituency breakdown with candidate names & votes
        </p>
      </div>
    </div>
  );
}
