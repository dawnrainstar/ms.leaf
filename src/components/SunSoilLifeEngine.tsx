import React, { useState } from 'react';
import { BioBotTelemetry } from '../types.ts';
import { bioAudio } from '../utils/audioSynthesizer.ts';
import { 
  Sun, 
  Zap, 
  Battery, 
  BatteryCharging, 
  Layers, 
  Droplets, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  Wind,
  Compass
} from 'lucide-react';

interface SunSoilLifeEngineProps {
  telemetry: BioBotTelemetry;
  setTelemetry: React.Dispatch<React.SetStateAction<BioBotTelemetry>>;
}

export const SunSoilLifeEngine: React.FC<SunSoilLifeEngineProps> = ({
  telemetry,
  setTelemetry,
}) => {
  const [luxInput, setLuxInput] = useState<number>(telemetry.sunExposureLux);
  const [redoxInput, setRedoxInput] = useState<number>(telemetry.soilRedoxPotentialMv);
  const [soilMoisturePercent, setSoilMoisturePercent] = useState<number>(42);
  const [activeWeather, setActiveWeather] = useState<'high_noon' | 'cloudy' | 'twilight' | 'acid_rain'>('high_noon');

  // Handle weather changes
  const applyWeather = (mode: 'high_noon' | 'cloudy' | 'twilight' | 'acid_rain') => {
    setActiveWeather(mode);
    let newLux = 95000;
    let newRedox = 680;
    let newMoisture = 40;

    if (mode === 'high_noon') {
      newLux = 112000;
      newRedox = 640;
      newMoisture = 32;
    } else if (mode === 'cloudy') {
      newLux = 42000;
      newRedox = 590;
      newMoisture = 55;
    } else if (mode === 'twilight') {
      newLux = 8500;
      newRedox = 520;
      newMoisture = 68;
    } else if (mode === 'acid_rain') {
      newLux = 28000;
      newRedox = 890; // high ionic strength & acidic leach
      newMoisture = 95;
    }

    setLuxInput(newLux);
    setRedoxInput(newRedox);
    setSoilMoisturePercent(newMoisture);
    updateSim(newLux, newRedox, newMoisture);
    bioAudio.playSolarChime();
  };

  const updateSim = (lux: number, redox: number, moisture: number) => {
    // Solar calculation: 2.8m² canopy, 21% bio-quantum efficiency
    const solarW = Math.round((lux / 100000) * 480);
    // Soil galvanic calculation: redox potential * root wire contact area * moisture factor
    const soilW = Math.round((redox / 800) * 220 * (0.6 + (moisture / 100) * 0.4));

    setTelemetry(prev => ({
      ...prev,
      sunExposureLux: lux,
      soilRedoxPotentialMv: redox,
      solarPowerGenW: solarW,
      soilGalvanicPowerGenW: soilW,
    }));
  };

  const handleLuxChange = (newVal: number) => {
    setLuxInput(newVal);
    updateSim(newVal, redoxInput, soilMoisturePercent);
  };

  const handleRedoxChange = (newVal: number) => {
    setRedoxInput(newVal);
    updateSim(luxInput, newVal, soilMoisturePercent);
  };

  const handleMoistureChange = (newVal: number) => {
    setSoilMoisturePercent(newVal);
    updateSim(luxInput, redoxInput, newVal);
  };

  const setMobilityGait = (gait: BioBotTelemetry['mobilityMode'], powerW: number, speed: number) => {
    bioAudio.playRootConductionPulse(1.2);
    setTelemetry(prev => ({
      ...prev,
      mobilityMode: gait,
      totalPowerConsumptionW: powerW,
      speedKmH: speed,
    }));
  };

  const totalGeneratedW = telemetry.solarPowerGenW + telemetry.soilGalvanicPowerGenW;
  const netSurplusW = totalGeneratedW - telemetry.totalPowerConsumptionW;
  const hoursUntilDepletion = netSurplusW < 0 
    ? ((telemetry.batteryPercentage / 100) * 3600 / Math.abs(netSurplusW)).toFixed(1)
    : 'Perpetual (Self-Charging)';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner explaining the Sun & Soil Self-Sustenance Mechanism */}
      <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/40">
                Self-Sustaining Phyto-Bio Engine
              </span>
              <span className="text-xs text-emerald-400 font-mono">
                100% Off-Grid • Zero External Fuel or Plug-In Recharging
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">How She Stays Alive Indefinitely via Sun & Soil</h2>
          </div>

          {/* Environmental Presets */}
          <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400 px-2">Atmosphere:</span>
            {[
              { id: 'high_noon', label: 'Blazing Sun' },
              { id: 'cloudy', label: 'Overcast Sky' },
              { id: 'twilight', label: 'Dusk/Night' },
              { id: 'acid_rain', label: 'Acid Leach Rain' },
            ].map(w => (
              <button
                key={w.id}
                onClick={() => applyWeather(w.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  activeWeather === w.id
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          Ms. Heavy Metal Leaf requires no battery swaps or fossil fuel. She sustains her living tissues and high-tech electronics through a dual-source metabolic coupling:
          <br />
          <strong className="text-amber-300 font-semibold">1. From the Sun:</strong> Her foliar canopy acts as a biological solar cell using quantum-coherent chloroplasts to synthesize ATP and glucose, providing electrical potential to internal bio-supercapacitors.
          <br />
          <strong className="text-orange-300 font-semibold">2. From the Soil:</strong> Her metallized root-wires act as biological electrodes inserted into toxic redox gradients, siphoning galvanic electrical energy produced by soil bacteria breaking down contaminants while absorbing trace moisture.
        </p>
      </div>

      {/* Real-time Energy Balance & Telemetry Meters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-400" />
              SOLAR INFLOW
            </span>
            <span className="text-amber-400 font-bold">{telemetry.solarPowerGenW} W</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{telemetry.sunExposureLux.toLocaleString()} <span className="text-xs font-normal text-slate-400">Lux</span></div>
          <p className="text-[11px] text-slate-400 mt-1 font-sans">2.8 m² bio-perovskite foliar canopy</p>
        </div>

        {/* Soil Galvanic Inflow */}
        <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-orange-400" />
              SOIL GALVANIC
            </span>
            <span className="text-orange-400 font-bold">{telemetry.soilGalvanicPowerGenW} W</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{telemetry.soilRedoxPotentialMv} <span className="text-xs font-normal text-slate-400">mV</span></div>
          <p className="text-[11px] text-slate-400 mt-1 font-sans">Electromotive force from root-wires</p>
        </div>

        {/* Total Consumption */}
        <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              SYSTEM LOAD
            </span>
            <span className="text-cyan-400 font-bold">{telemetry.totalPowerConsumptionW} W</span>
          </div>
          <div className="text-2xl font-bold text-slate-100">{telemetry.speedKmH.toFixed(1)} <span className="text-xs font-normal text-slate-400">km/h</span></div>
          <p className="text-[11px] text-slate-400 mt-1 font-sans">Mode: {telemetry.mobilityMode}</p>
        </div>

        {/* Net Balance & Bio-Battery */}
        <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-4 shadow-xl font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-400" />
              NET METABOLISM
            </span>
            <span className={`font-bold ${netSurplusW >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netSurplusW >= 0 ? `+${netSurplusW}` : netSurplusW} W
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-300">{telemetry.batteryPercentage.toFixed(1)}%</div>
          <p className="text-[11px] text-slate-400 mt-1 font-sans">Runtime: {hoursUntilDepletion}</p>
        </div>
      </div>

      {/* Interactive Simulation Controls: Sun, Soil & Mobility Gaits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Sun & Soil Sliders */}
        <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              Solar & Atmospheric Assimilation
            </h3>
            <span className="text-xs font-mono text-amber-300">{telemetry.solarPowerGenW} W Output</span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                <span>Solar Irradiance:</span>
                <span className="text-amber-400 font-bold">{luxInput.toLocaleString()} Lux</span>
              </div>
              <input 
                type="range" 
                min={0} 
                max={120000} 
                step={2000} 
                value={luxInput}
                onChange={e => handleLuxChange(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0 Lux (Pitch Black)</span>
                <span>50,000 Lux (Overcast)</span>
                <span>120,000 Lux (Direct Desert Sun)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between pb-2">
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-400" />
                  Soil Galvanic & Subsurface Redox Potential
                </h4>
                <span className="text-xs font-mono text-orange-300">{telemetry.soilGalvanicPowerGenW} W Output</span>
              </div>

              <div className="space-y-4 mt-2">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                    <span>Soil Redox Potential (Eh):</span>
                    <span className="text-orange-400 font-bold">{redoxInput} mV</span>
                  </div>
                  <input 
                    type="range" 
                    min={100} 
                    max={950} 
                    step={10} 
                    value={redoxInput}
                    onChange={e => handleRedoxChange(Number(e.target.value))}
                    className="w-full accent-orange-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>100 mV (Inert/Depleted)</span>
                    <span>500 mV (Normal Soil)</span>
                    <span>950 mV (Heavy Metal Leach Basin)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                    <span>Soil Porewater & Ionic Electrolyte Moisture:</span>
                    <span className="text-cyan-400 font-bold">{soilMoisturePercent}%</span>
                  </div>
                  <input 
                    type="range" 
                    min={5} 
                    max={100} 
                    step={5} 
                    value={soilMoisturePercent}
                    onChange={e => handleMoistureChange(Number(e.target.value))}
                    className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>5% (Arid Dust)</span>
                    <span>45% (Moist Tailings)</span>
                    <span>100% (Submerged Slurry)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: High-Tech Mobility Gaits & Power Load Tuning */}
        <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              High-Tech Mobility Gaits & Actuators
            </h3>
            <span className="text-xs font-mono text-slate-400">Turgor-Hydraulic System</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Ms. Heavy Metal Leaf is not a stationary flowerpot. She is equipped with high-pressure fluidic hydraulic muscles shaped inside her femoral and pelvic mold. Select her locomotion mode to monitor power consumption and terrain traversal capability:
          </p>

          <div className="space-y-2.5">
            {[
              {
                mode: 'Agile Bipedal Stride',
                powerW: 240,
                speed: 4.5,
                terrain: 'Hardpack soil, rocky hillsides, cracked asphalt',
                desc: 'Balanced bipedal stride with root-wire feet retracting into cushioned gait pads for rapid overland travel.',
              },
              {
                mode: 'High-Torque Sludge Crawl',
                powerW: 380,
                speed: 2.1,
                terrain: 'Viscous chemical mud, tailings lagoons, quicksand',
                desc: 'Expands foot surface area 300% via branching root-tendrils, distributing ground pressure while wading through caustic sludge.',
              },
              {
                mode: 'Deep Rooted Extraction',
                powerW: 110,
                speed: 0.0,
                terrain: 'Stationary toxic hotspot remediation',
                desc: 'Root-wires penetrate 2.4 meters down, drawing maximum galvanic earth current while siphoning toxic ions.',
              },
              {
                mode: 'Phototropic Solar Stasis',
                powerW: 45,
                speed: 0.0,
                terrain: 'Recharge / sleep mode',
                desc: 'Foliar canopy rotates autonomously to track the sun (heliotropism). System consumption drops to basal life support.',
              },
            ].map(g => (
              <button
                key={g.mode}
                onClick={() => setMobilityGait(g.mode as any, g.powerW, g.speed)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  telemetry.mobilityMode === g.mode
                    ? 'bg-emerald-950/90 border-emerald-500 text-slate-100 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-slate-200">
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${telemetry.mobilityMode === g.mode ? 'bg-emerald-400' : 'bg-slate-600'}`}></span>
                    {g.mode}
                  </span>
                  <span className="font-mono text-xs text-amber-300">{g.powerW} W Load ({g.speed} km/h)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 font-sans leading-tight">{g.desc}</div>
                <div className="text-[10px] text-emerald-400/80 mt-1 font-mono">Terrain: {g.terrain}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Biological Resiliency Breakdown */}
      <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-6 shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 font-mono">
          Biological Self-Healing & Immortality Protocols
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
            <div className="font-bold text-emerald-300">Vascular Stem Regeneration</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If an obstacle severs a root-wire, the surrounding plant tissue exhibits rapid meristematic cell division. New roots branch out within hours, immediately re-absorbing metal ions to rebuild the conductive electrical circuit.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
            <div className="font-bold text-amber-300">Desiccation & Freeze Dormancy</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In severe droughts or sub-zero winter blasts, she produces trehalose sugars and hyper-accumulated metals that act as natural biological antifreeze, protecting internal mold conduits until spring.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
            <div className="font-bold text-cyan-300">Heavy Metal Corrosion Immunity</div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Synthetic robots corrode in toxic acid lagoons; Ms. Heavy Metal Leaf thrives in them. Her roots excrete citrate, malate, and phytochelatins that coat the biometallic wires in protective chelates, preventing oxidization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
