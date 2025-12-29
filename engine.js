import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Package, DollarSign, TrendingUp } from 'lucide-react';

const CartelOS = () => {
  // --- STATE MANAGEMENT ---
  const [empire, setEmpire] = useState({
    dirtyCash: 500000,
    cleanCash: 50000,
    globalHeat: 15, // 0 to 100
    rank: "Capo",
  });

  const [businesses, setBusinesses] = useState([
    { id: 1, name: "Vespucci Nightclub", type: "Laundromat", rate: 5000, heatGen: 1, active: true },
    { id: 2, name: "Paleto Sawmill", type: "Production", rate: 0, heatGen: 5, active: true }
  ]);

  const [activeRuns, setActiveRuns] = useState([]);

  // --- THE GAME LOOP (The "Tick") ---
  useEffect(() => {
    const timer = setInterval(() => {
      processEconomy();
    }, 5000); // Every 5 seconds is an "hour"
    return () => clearInterval(timer);
  }, [empire, businesses]);

  const processEconomy = () => {
    let launderedAmount = 0;
    businesses.forEach(b => {
      if (b.active && b.type === "Laundromat" && empire.dirtyCash > 0) {
        launderedAmount += b.rate;
      }
    });

    setEmpire(prev => ({
      ...prev,
      dirtyCash: Math.max(0, prev.dirtyCash - launderedAmount),
      cleanCash: prev.cleanCash + launderedAmount,
      globalHeat: Math.min(100, prev.globalHeat + 0.1) // Natural heat creep
    }));
  };

  // --- ACTION HANDLERS ---
  const startShipment = (value, risk) => {
    const newRun = {
      id: Date.now(),
      value,
      progress: 0,
      risk,
      status: 'In Transit'
    };
    setActiveRuns([...activeRuns, newRun]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-emerald-500 font-mono p-6">
      {/* HEADER / HUD */}
      <div className="flex justify-between border-b border-emerald-900 pb-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white">CARTEL_OS v1.0.4</h1>
          <p className="text-xs text-emerald-700">STRICTLY CONFIDENTIAL - ENCRYPTION ACTIVE</p>
        </div>
        <div className="flex gap-10">
          <StatBox label="DIRTY CASH" val={`$${empire.dirtyCash.toLocaleString()}`} color="text-red-500" />
          <StatBox label="CLEAN CASH" val={`$${empire.cleanCash.toLocaleString()}`} color="text-emerald-400" />
          <StatBox label="HEAT LEVEL" val={`${empire.globalHeat.toFixed(1)}%`} color="text-orange-500" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT: BUSINESSES */}
        <div className="col-span-4 bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
          <h2 className="flex items-center gap-2 mb-4 text-white font-bold"><Shield size={18}/> ENTERPRISE ASSETS</h2>
          {businesses.map(b => (
            <div key={b.id} className="mb-3 p-3 bg-slate-800 rounded border-l-4 border-emerald-600">
              <div className="flex justify-between">
                <span className="text-white font-bold uppercase text-sm">{b.name}</span>
                <span className="text-xs text-emerald-300">{b.type}</span>
              </div>
              <p className="text-xs mt-1 text-slate-400">Laundering: ${b.rate}/hr</p>
            </div>
          ))}
        </div>

        {/* MIDDLE: LOGISTICS & SHIPMENTS */}
        <div className="col-span-8 bg-slate-900/50 border border-slate-800 p-4 rounded-lg">
          <h2 className="flex items-center gap-2 mb-4 text-white font-bold"><Package size={18}/> LIVE LOGISTICS</h2>
          <button 
            onClick={() => startShipment(100000, 0.2)}
            className="mb-4 bg-emerald-600 text-slate-950 px-4 py-2 rounded font-bold hover:bg-emerald-400 transition-colors"
          >
            DISPATCH NEW SHIPMENT ($100k)
          </button>

          <div className="space-y-4">
            {activeRuns.length === 0 && <p className="text-slate-600 italic">No active shipments in transit...</p>}
            {activeRuns.map(run => (
              <div key={run.id} className="bg-slate-950 p-4 border border-emerald-900/30 rounded">
                <div className="flex justify-between text-xs mb-2">
                  <span>ID: {run.id}</span>
                  <span className="text-orange-500 font-bold">RISK: {run.risk * 100}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-1000" style={{width: '45%'}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ label, val, color }) => (
  <div className="text-right">
    <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">{label}</p>
    <p className={`text-xl font-mono ${color}`}>{val}</p>
  </div>
);

export default CartelOS;