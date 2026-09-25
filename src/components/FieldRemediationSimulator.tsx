import React, { useState, useEffect, useRef } from 'react';
import { BioBotTelemetry, DroneTelemetry, GridTile, HeavyMetalProfile, RemediationSectorPreset } from '../types.ts';
import { bioAudio } from '../utils/audioSynthesizer.ts';
import biobotMobileImg from '../assets/images/biobot_mobile_field_1788869756860.jpg';
import rootWireMacroImg from '../assets/images/root_wire_schematic_1788869712878.jpg';
import bioScoutDroneImg from '../assets/images/bio_scout_drone_1788870375686.jpg';
import { 
  Navigation, 
  Flame, 
  Sun, 
  Sparkles, 
  CircleDot, 
  ShieldCheck, 
  RotateCcw, 
  Play, 
  Pause, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  TrendingDown,
  Layers,
  Cpu,
  Plane,
  Eye,
  Camera,
  Maximize2
} from 'lucide-react';

interface FieldRemediationSimulatorProps {
  telemetry: BioBotTelemetry;
  setTelemetry: React.Dispatch<React.SetStateAction<BioBotTelemetry>>;
  metals: HeavyMetalProfile[];
  setMetals: React.Dispatch<React.SetStateAction<HeavyMetalProfile[]>>;
  droneTelemetry: DroneTelemetry;
  setDroneTelemetry: React.Dispatch<React.SetStateAction<DroneTelemetry>>;
  botPos: { x: number; y: number };
  setBotPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  grid: GridTile[];
  setGrid: React.Dispatch<React.SetStateAction<GridTile[]>>;
  onOpenDroneTab?: () => void;
}

const SECTOR_PRESETS: RemediationSectorPreset[] = [
  {
    id: 'smelter-basin',
    name: 'Sector 07: Blackwood Smelter Basin',
    hazardClass: 'Class IV Toxic Tailings',
    location: 'North Sub-Basin Industrial Belt',
    initialAvgPpm: 8400,
    dominantMetals: ['Pb', 'As', 'Cd'],
    soilPh: 3.4,
    sunLux: 95000,
    description: 'Centuries of unregulated smelting left hyper-toxic lead-arsenic sludge. Ms. Heavy Metal Leaf deploys deep root-wires to immobilize soluble ions.',
  },
  {
    id: 'cobalt-tailings',
    name: 'Sector 12: Kamoto Open Tailings',
    hazardClass: 'Class V Bio-Hazard Zone',
    location: 'Cobalt-Nickel Mining Corridor',
    initialAvgPpm: 12500,
    dominantMetals: ['Ni', 'Co', 'Cu'],
    soilPh: 4.2,
    sunLux: 108000,
    description: 'High nickel and cobalt concentrations provide optimal galvanic conductivity for her root-wire nervous network.',
  },
  {
    id: 'acid-leach',
    name: 'Sector 03: Copper Leach Lagoon',
    hazardClass: 'Class IV Chemical Leached Flats',
    location: 'Arid Highland Tailings',
    initialAvgPpm: 6800,
    dominantMetals: ['Cu', 'Zn', 'Cd'],
    soilPh: 2.8,
    sunLux: 115000,
    description: 'Extremely acidic copper substrate. Her roots utilize organic carboxylate exudates to buffer pH while siphoning conductive copper.',
  },
];

const GRID_WIDTH = 12;
const GRID_HEIGHT = 8;

export const FieldRemediationSimulator: React.FC<FieldRemediationSimulatorProps> = ({
  telemetry,
  setTelemetry,
  metals,
  setMetals,
  droneTelemetry,
  setDroneTelemetry,
  botPos,
  setBotPos,
  grid,
  setGrid,
  onOpenDroneTab,
}) => {
  const [selectedSector, setSelectedSector] = useState<RemediationSectorPreset>(SECTOR_PRESETS[0]);
  const [isAutonomous, setIsAutonomous] = useState<boolean>(false);
  const [isRootAnchored, setIsRootAnchored] = useState<boolean>(false);
  const [isSolarBloomActive, setIsSolarBloomActive] = useState<boolean>(false);
  const [isDronePiPOpen, setIsDronePiPOpen] = useState<boolean>(true);
  const [eventLogs, setEventLogs] = useState<string[]>([
    'System initialized. Mobility bipedal hydraulics engaged.',
    'Form-fitting anatomical mold calibrated for sector terrain.',
    'Sunlight lux captured: 95,000 Lux. Quantum chloroplasts online.',
    'Aero-Spore reconnaissance drone attached & charging via dorsal mold.',
    'Root-wire ground-penetrating radar ping: detected high-density Pb & Ni.',
  ]);

  const addLog = (msg: string) => {
    setEventLogs(prev => [msg, ...prev.slice(0, 15)]);
  };

  // Initialize or reset sector grid
  const initializeGrid = (sector: RemediationSectorPreset) => {
    const newGrid: GridTile[] = [];
    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        // Center has highest toxicity
        const distFromCenter = Math.hypot(x - GRID_WIDTH / 2, y - GRID_HEIGHT / 2);
        const baseToxicity = Math.max(30, Math.min(100, Math.round(95 - distFromCenter * 8 + (Math.random() * 20 - 10))));
        const domMetal = sector.dominantMetals[Math.floor(Math.random() * sector.dominantMetals.length)];
        
        newGrid.push({
          x,
          y,
          initialToxicity: baseToxicity,
          currentToxicity: baseToxicity,
          dominantMetal: domMetal,
          remediated: false,
          vegetationStage: 0,
          groundResistance: 120 + Math.random() * 80,
        });
      }
    }
    setGrid(newGrid);
    setBotPos({ x: 1, y: 1 });
    setIsRootAnchored(false);
    addLog(`Deployed into [${sector.name}]. Soil toxicity averaging ${sector.initialAvgPpm} PPM.`);
  };

  useEffect(() => {
    if (grid.length === 0) {
      initializeGrid(selectedSector);
    }
  }, [selectedSector]);

  // Main tick loop for active remediation
  useEffect(() => {
    const interval = setInterval(() => {
      // Find current tile
      setGrid(prevGrid => {
        const currentTileIndex = prevGrid.findIndex(t => t.x === botPos.x && t.y === botPos.y);
        if (currentTileIndex === -1) return prevGrid;

        const tile = prevGrid[currentTileIndex];
        if (tile.currentToxicity <= 0) return prevGrid;

        const cleanRate = isRootAnchored ? 12 : (isSolarBloomActive ? 8 : 5);
        const newTox = Math.max(0, tile.currentToxicity - cleanRate);
        const extractedAmount = (tile.currentToxicity - newTox);

        const updatedTile: GridTile = {
          ...tile,
          currentToxicity: newTox,
          remediated: newTox === 0,
          vegetationStage: newTox === 0 ? 2 : (newTox < 30 ? 1 : 0),
        };

        const nextGrid = [...prevGrid];
        nextGrid[currentTileIndex] = updatedTile;

        // Update metals accumulated
        if (extractedAmount > 0) {
          bioAudio.playRootConductionPulse(1.0 + (100 - newTox) / 100);
          setMetals(currMetals => {
            return currMetals.map(m => {
              if (m.symbol === tile.dominantMetal) {
                const addKg = (extractedAmount * 0.08);
                const updatedKg = Math.min(m.maxCapacityKg, m.accumulatedKg + addKg);
                return {
                  ...m,
                  accumulatedKg: updatedKg,
                  toxicityPpm: Math.max(20, m.toxicityPpm - extractedAmount * 25),
                };
              }
              return m;
            });
          });

          // Update telemetry
          setTelemetry(prev => {
            const addedLand = newTox === 0 && !tile.remediated ? 25 : 2;
            const updatedConductivity = Math.min(1.4, prev.rootWireConductivitySm + 0.005);
            const netSurplus = (prev.solarPowerGenW + prev.soilGalvanicPowerGenW) - prev.totalPowerConsumptionW;
            const newBattery = Math.min(100, Math.max(10, prev.batteryPercentage + (netSurplus > 0 ? 0.05 : -0.05)));

            return {
              ...prev,
              totalLandRemediatedM2: prev.totalLandRemediatedM2 + addedLand,
              totalMetalsExtractedKg: prev.totalMetalsExtractedKg + extractedAmount * 0.08,
              rootWireConductivitySm: updatedConductivity,
              batteryPercentage: newBattery,
              soilHealthIndex: Math.min(100, prev.soilHealthIndex + 0.2),
            };
          });
        }

        return nextGrid;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [botPos, isRootAnchored, isSolarBloomActive]);

  // Autonomous sweeping AI
  useEffect(() => {
    if (!isAutonomous) return;

    const timer = setInterval(() => {
      setGrid(currentGrid => {
        // Find closest unremediated tile
        const unremediated = currentGrid.filter(t => t.currentToxicity > 5);
        if (unremediated.length === 0) {
          setIsAutonomous(false);
          addLog('Autonomous Sweep Complete: Entire sector remediated to baseline ecological safety.');
          bioAudio.playPurificationChime();
          return currentGrid;
        }

        // If current tile is already low, move to next
        const currentTile = currentGrid.find(t => t.x === botPos.x && t.y === botPos.y);
        if (!currentTile || currentTile.currentToxicity <= 8) {
          let closest = unremediated[0];
          let minDist = 999;
          for (const tile of unremediated) {
            const dist = Math.hypot(tile.x - botPos.x, tile.y - botPos.y);
            if (dist < minDist) {
              minDist = dist;
              closest = tile;
            }
          }

          if (closest) {
            const dx = Math.sign(closest.x - botPos.x);
            const dy = Math.sign(closest.y - botPos.y);
            const nextX = dx !== 0 ? botPos.x + dx : botPos.x;
            const nextY = dx === 0 && dy !== 0 ? botPos.y + dy : botPos.y;

            setBotPos({ x: nextX, y: nextY });
          }
        }
        return currentGrid;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [isAutonomous, botPos]);

  const moveBot = (dx: number, dy: number) => {
    if (isRootAnchored) {
      addLog('Cannot relocate: Root anchors currently deployed 2.4m in subsoil. Retract anchors first.');
      return;
    }
    const newX = Math.max(0, Math.min(GRID_WIDTH - 1, botPos.x + dx));
    const newY = Math.max(0, Math.min(GRID_HEIGHT - 1, botPos.y + dy));
    setBotPos({ x: newX, y: newY });
    bioAudio.playRootConductionPulse(0.9);
  };

  const toggleRootAnchor = () => {
    const next = !isRootAnchored;
    setIsRootAnchored(next);
    if (next) {
      bioAudio.playRootAnchorSound();
      addLog('ROOT ANCHORS DEPLOYED: Bio-metallic roots penetrating 2.4m into subsoil. Extraction velocity +140%.');
      setTelemetry(prev => ({
        ...prev,
        mobilityMode: 'Deep Rooted Extraction',
        rootDepthMeters: 2.4,
        soilRedoxPotentialMv: prev.soilRedoxPotentialMv + 120,
        soilGalvanicPowerGenW: prev.soilGalvanicPowerGenW + 85,
      }));
    } else {
      bioAudio.playRootConductionPulse(1.2);
      addLog('ROOT ANCHORS RETRACTED: High-mobility bipedal hydraulic actuators engaged.');
      setTelemetry(prev => ({
        ...prev,
        mobilityMode: 'Agile Bipedal Stride',
        rootDepthMeters: 0.4,
        soilRedoxPotentialMv: prev.soilRedoxPotentialMv - 120,
        soilGalvanicPowerGenW: Math.max(120, prev.soilGalvanicPowerGenW - 85),
      }));
    }
  };

  const triggerChelationPulse = () => {
    bioAudio.playPurificationChime();
    addLog('CHELATION SHOCKWAVE PULSE: Releasing citrate/phytochelatin bio-acids into 3x3 surrounding zone.');
    
    setGrid(prev => {
      return prev.map(tile => {
        if (Math.abs(tile.x - botPos.x) <= 1 && Math.abs(tile.y - botPos.y) <= 1) {
          const reduced = Math.max(0, tile.currentToxicity - 35);
          return {
            ...tile,
            currentToxicity: reduced,
            remediated: reduced === 0,
            vegetationStage: reduced === 0 ? 2 : 1,
          };
        }
        return tile;
      });
    });

    setTelemetry(prev => ({
      ...prev,
      totalMetalsExtractedKg: prev.totalMetalsExtractedKg + 3.4,
      totalLandRemediatedM2: prev.totalLandRemediatedM2 + 75,
      rootWireConductivitySm: Math.min(1.4, prev.rootWireConductivitySm + 0.04),
    }));
  };

  const triggerPelletizer = () => {
    bioAudio.playSolarChime();
    addLog('VACUOLE CRYSTALLIZATION: Extracted heavy metals compacted into stable 99.4% purity eco-ingots.');
    setMetals(curr => curr.map(m => ({
      ...m,
      crystallizationStatus: 'Pelletized Storage',
      accumulatedKg: Math.max(0.5, m.accumulatedKg * 0.3), // compacted
    })));
  };

  const toggleSolarBloom = () => {
    const next = !isSolarBloomActive;
    setIsSolarBloomActive(next);
    if (next) {
      bioAudio.playSolarChime();
      addLog('FOLIAR SOLAR CANOPY BLOOM: Quantum bio-perovskite leaves unfurled. Solar capture maxed.');
      setTelemetry(prev => ({
        ...prev,
        solarPowerGenW: prev.solarPowerGenW + 140,
        transpirationRateMlHr: prev.transpirationRateMlHr + 450,
      }));
    } else {
      addLog('Solar canopy reverted to aerodynamic traversal posture.');
      setTelemetry(prev => ({
        ...prev,
        solarPowerGenW: Math.max(220, prev.solarPowerGenW - 140),
        transpirationRateMlHr: Math.max(300, prev.transpirationRateMlHr - 450),
      }));
    }
  };

  // Calculate sector remediation completion
  const totalToxInitial = grid.reduce((acc, t) => acc + t.initialToxicity, 0) || 1;
  const totalToxCurrent = grid.reduce((acc, t) => acc + t.currentToxicity, 0);
  const sectorCleansedPercent = Math.max(0, Math.min(100, Math.round(((totalToxInitial - totalToxCurrent) / totalToxInitial) * 100)));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner with visual and current sector switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {/* Sector Info & Presets */}
        <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-mono font-semibold tracking-wider text-emerald-400 uppercase bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/40">
                Active Remediation Sector
              </span>
              <span className="text-xs text-amber-400 font-mono font-medium">
                {selectedSector.hazardClass}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mb-1">{selectedSector.name}</h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">{selectedSector.description}</p>
            
            {/* Sector Selector */}
            <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-mono mb-1.5">
              Select Contaminated Zone:
            </label>
            <div className="grid grid-cols-1 gap-1.5 mb-4">
              {SECTOR_PRESETS.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setSelectedSector(sec);
                    bioAudio.playRootConductionPulse(1.2);
                  }}
                  className={`text-left px-3 py-2 rounded-xl text-xs transition-all cursor-pointer border ${
                    selectedSector.id === sec.id
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-sm shadow-emerald-950'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{sec.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Metals: {sec.dominantMetals.join(', ')}</span>
                    <span>Init: {sec.initialAvgPpm} PPM</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sector progress bar */}
          <div className="pt-3 border-t border-slate-800/80 space-y-1.5 font-mono">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Sector Toxicity Cleansed:</span>
              <span className="text-emerald-400 font-bold">{sectorCleansedPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div 
                className="bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
                style={{ width: `${sectorCleansedPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
              <span>Restored: {telemetry.totalLandRemediatedM2.toLocaleString()} m²</span>
              <span>Metals Sequestered: {telemetry.totalMetalsExtractedKg.toFixed(1)} kg</span>
            </div>
          </div>
        </div>

        {/* Cinematic Preview & Mobility Posture */}
        <div className="relative rounded-2xl overflow-hidden border border-emerald-900/40 bg-slate-950 group shadow-xl">
          <img 
            src={biobotMobileImg} 
            alt="Ms. Heavy Metal Leaf in toxic wasteland" 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080d11] via-[#080d11]/40 to-transparent"></div>
          
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-emerald-500/40 px-2.5 py-1 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>GAIT: {telemetry.mobilityMode}</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-xs">
            <p className="font-semibold text-slate-100 mb-0.5">Top-Notch Mobility System</p>
            <p className="text-slate-300 text-[11px] leading-tight">
              Anatomical hydraulic turgor muscles drive bipedal traversal across toxic sludge, with root-tendrils doubling as ground-penetrating chemical siphons.
            </p>
          </div>
        </div>

        {/* Live Subsurface Root-Wire Telemetry */}
        <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl font-mono text-xs">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-slate-200 uppercase tracking-wide">Root-Wire Vascular Conduction</h3>
            </div>

            <div className="flex gap-3 mb-3 items-center">
              <img 
                src={rootWireMacroImg} 
                alt="Root wire microscopic view" 
                className="w-16 h-16 rounded-xl object-cover border border-cyan-800/50 shadow-md"
              />
              <div className="space-y-1">
                <div className="text-slate-300 font-medium">Hyperaccumulated Root-Cables</div>
                <p className="text-[11px] text-slate-400 font-sans leading-tight">
                  High concentrations of heavy metal ions transform root vasculature into dense, low-impedance electrical wiring.
                </p>
              </div>
            </div>

            <div className="space-y-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Vascular Conductivity:</span>
                <span className="text-cyan-300 font-bold">{telemetry.rootWireConductivitySm.toFixed(2)} S/m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Root-Wire Impedance:</span>
                <span className="text-amber-300 font-bold">{(1 / Math.max(0.1, telemetry.rootWireConductivitySm)).toFixed(2)} Ω/m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Soil Penetration Depth:</span>
                <span className="text-emerald-300 font-bold">{telemetry.rootDepthMeters.toFixed(1)} meters</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Transpiration Velocity:</span>
                <span className="text-blue-300 font-bold">{telemetry.transpirationRateMlHr} mL/hr</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Core Temp: {telemetry.coreTemperatureC}°C</span>
            <span className="text-emerald-400 font-medium">Self-Regulating Turgor</span>
          </div>
        </div>
      </div>

      {/* Interactive Grid Map & Controls Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: The Toxic Soil Grid Canvas */}
        <div className="lg:col-span-3 bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Live Soil Bioremediation Grid</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-900/40 border border-emerald-700/40 text-emerald-300">
                  Sector Sub-Grid [12 × 8]
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Click any tile to navigate Ms. Heavy Metal Leaf or use directional controls. Watch her root-wires extract heavy metals into verdant soil.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="btn-field-drone-action"
                onClick={() => {
                  if (droneTelemetry.isDocked) {
                    bioAudio.playDroneLaunch();
                    setDroneTelemetry(prev => ({
                      ...prev,
                      isDocked: false,
                      altitudeMeters: 35,
                      speedKmH: 16.0,
                      wingBeatHz: 44,
                      flightMode: 'Manual Remote',
                      coordinates: { x: botPos.x, y: botPos.y },
                    }));
                    addLog('AERO-SPORE DRONE LAUNCHED: Ascended to 35m altitude for aerial reconnaissance.');
                  } else if (onOpenDroneTab) {
                    onOpenDroneTab();
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all ${
                  !droneTelemetry.isDocked
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-950/60 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
                title={droneTelemetry.isDocked ? "Launch drone into the air" : "Drone in flight - click to switch to drone cockpit"}
              >
                <Plane className="w-3.5 h-3.5 text-cyan-400" />
                <span>{droneTelemetry.isDocked ? 'Launch Drone' : `Drone Airborne (${droneTelemetry.altitudeMeters.toFixed(0)}m)`}</span>
              </button>

              <button
                id="btn-autonomous-sweep"
                onClick={() => {
                  bioAudio.playRootConductionPulse(1.4);
                  setIsAutonomous(!isAutonomous);
                  addLog(isAutonomous ? 'Autonomous sweep paused.' : 'Autonomous sweep activated: routing optimal remediation path.');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-all ${
                  isAutonomous
                    ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-950'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {isAutonomous ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                <span>{isAutonomous ? 'Pause Sweep' : 'Auto Remediation'}</span>
              </button>

              <button
                id="btn-reset-grid"
                onClick={() => initializeGrid(selectedSector)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
                title="Reset Sector Grid"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* The Interactive Soil Grid */}
          <div className="bg-[#05080a] p-3 rounded-xl border border-slate-800/80 overflow-x-auto">
            <div 
              className="grid gap-1.5 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(42px, 1fr))`,
              }}
            >
              {grid.map(tile => {
                const isBotHere = tile.x === botPos.x && tile.y === botPos.y;
                const isDroneHere = !droneTelemetry.isDocked && Math.round(droneTelemetry.coordinates.x) === tile.x && Math.round(droneTelemetry.coordinates.y) === tile.y;
                const isClean = tile.currentToxicity === 0;
                
                // Color computation based on toxicity and dominant metal
                let bgColor = 'bg-slate-900';
                let borderColor = 'border-slate-800';
                let textColor = 'text-slate-500';

                if (isClean) {
                  bgColor = 'bg-emerald-950/70';
                  borderColor = 'border-emerald-600/60';
                  textColor = 'text-emerald-400';
                } else if (tile.currentToxicity < 35) {
                  bgColor = 'bg-teal-950/60';
                  borderColor = 'border-teal-700/50';
                  textColor = 'text-teal-300';
                } else if (tile.dominantMetal === 'Pb') {
                  bgColor = 'bg-slate-900';
                  borderColor = 'border-blue-900/60';
                  textColor = 'text-blue-300';
                } else if (tile.dominantMetal === 'Ni') {
                  bgColor = 'bg-emerald-950/40';
                  borderColor = 'border-emerald-900/70';
                  textColor = 'text-emerald-300';
                } else if (tile.dominantMetal === 'Cu') {
                  bgColor = 'bg-amber-950/50';
                  borderColor = 'border-orange-800/60';
                  textColor = 'text-amber-400';
                } else if (tile.dominantMetal === 'Cd') {
                  bgColor = 'bg-yellow-950/40';
                  borderColor = 'border-yellow-800/60';
                  textColor = 'text-yellow-300';
                } else {
                  bgColor = 'bg-rose-950/40';
                  borderColor = 'border-rose-900/60';
                  textColor = 'text-rose-300';
                }

                return (
                  <button
                    key={`${tile.x}-${tile.y}`}
                    id={`tile-${tile.x}-${tile.y}`}
                    onClick={() => {
                      if (!isRootAnchored) {
                        setBotPos({ x: tile.x, y: tile.y });
                        bioAudio.playRootConductionPulse(0.95);
                      }
                    }}
                    className={`relative aspect-square rounded-lg border transition-all duration-200 flex flex-col items-center justify-center p-1 text-[10px] font-mono cursor-pointer ${bgColor} ${borderColor} ${
                      isBotHere ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#080d11] scale-105 z-10' : 'hover:border-slate-500'
                    }`}
                  >
                    {/* Drone Hover Badge */}
                    {isDroneHere && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onOpenDroneTab) onOpenDroneTab();
                        }}
                        className="absolute -top-2.5 -right-2.5 z-30 bg-cyan-950 border border-cyan-400 text-cyan-300 rounded-full p-1 shadow-lg shadow-cyan-950 animate-bounce hover:scale-125 cursor-pointer transition-transform" 
                        title="Aero-Spore Drone hovering here. Click to open drone view."
                      >
                        <Plane className="w-3 h-3 text-cyan-400" />
                      </div>
                    )}

                    {isBotHere ? (
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className={`w-3.5 h-3.5 rounded-full ${isRootAnchored ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 animate-pulse'} mb-0.5`}></div>
                        <span className="text-[9px] font-bold text-emerald-200 leading-none">
                          {isRootAnchored ? 'ANCHOR' : 'BOT'}
                        </span>
                        {droneTelemetry.isDocked && (
                          <span className="text-[7px] text-cyan-300 font-mono leading-tight mt-0.5">+DRONE</span>
                        )}
                      </div>
                    ) : isClean ? (
                      <div className="flex flex-col items-center">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400 mb-0.5" />
                        <span className="text-[9px] text-emerald-300 font-bold">CLEAN</span>
                      </div>
                    ) : (
                      <>
                        <span className="text-[10px] font-bold leading-none">{tile.dominantMetal}</span>
                        <span className={`text-[9px] font-mono ${textColor} mt-0.5`}>
                          {tile.currentToxicity}%
                        </span>
                      </>
                    )}

                    {/* Miniature vegetation icon for restored tiles */}
                    {tile.vegetationStage === 2 && !isBotHere && (
                      <span className="absolute bottom-0.5 right-0.5 text-[8px]">🌱</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mini Drone Recon PiP Card */}
          {isDronePiPOpen && (
            <div className="mt-3 bg-slate-950/80 border border-cyan-950/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div 
                  onClick={onOpenDroneTab}
                  className="relative w-16 h-12 rounded-lg overflow-hidden border border-cyan-700/60 bg-black shrink-0 cursor-pointer group"
                  title="Click to expand drone aerial view"
                >
                  <img
                    src={bioScoutDroneImg}
                    alt="Aero-Spore Drone Recon"
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform ${
                      droneTelemetry.cameraMode === 'hyperspectral_metals' ? 'contrast-125 saturate-200 hue-rotate-60' : ''
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <span className="absolute bottom-0.5 left-1 text-[8px] font-mono text-cyan-300">
                    {droneTelemetry.isDocked ? 'DOCK' : `${droneTelemetry.altitudeMeters.toFixed(0)}m`}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-200">
                    <Plane className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Aero-Spore Scout Drone:</span>
                    <span className={droneTelemetry.isDocked ? 'text-amber-400' : 'text-emerald-400'}>
                      {droneTelemetry.isDocked ? 'Docked on Her Back Mold' : `Airborne (${droneTelemetry.altitudeMeters.toFixed(0)}m • ${droneTelemetry.flightMode})`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Filter: <span className="text-cyan-300">{droneTelemetry.cameraMode.toUpperCase()}</span> • Battery: <span className="text-emerald-300">{droneTelemetry.batteryPercentage.toFixed(0)}%</span> • Aerial Spores: <span className="text-amber-300">{droneTelemetry.bioSporePayloadCount}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onOpenDroneTab && (
                  <button
                    onClick={onOpenDroneTab}
                    className="px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-600/60 text-cyan-200 font-mono text-xs flex items-center gap-1.5 cursor-pointer shadow transition-colors"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Open Aerial Cockpit</span>
                  </button>
                )}
                <button
                  onClick={() => setIsDronePiPOpen(false)}
                  className="px-2 py-1 rounded text-[11px] text-slate-500 hover:text-slate-300 cursor-pointer font-mono"
                  title="Hide PiP preview"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Active Bio-Remediation Ability Controls */}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                id="btn-root-anchor"
                onClick={toggleRootAnchor}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                  isRootAnchored
                    ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-950'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <CircleDot className="w-4 h-4 text-amber-300" />
                <span>{isRootAnchored ? 'Retract Root Anchors (2.4m)' : 'Deploy Deep Root Anchors'}</span>
              </button>

              <button
                id="btn-chelation-pulse"
                onClick={triggerChelationPulse}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-950/80 border border-emerald-600/70 text-emerald-200 hover:bg-emerald-900/80 cursor-pointer shadow-md shadow-emerald-950 transition-all"
              >
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>Chelation Shockwave (3×3)</span>
              </button>

              <button
                id="btn-solar-bloom"
                onClick={toggleSolarBloom}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                  isSolarBloomActive
                    ? 'bg-amber-600 text-white border-amber-400 shadow-md shadow-amber-950'
                    : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-300" />
                <span>{isSolarBloomActive ? 'Solar Bloom Active (+140W)' : 'Unfurl Solar Canopy'}</span>
              </button>

              <button
                id="btn-pelletizer"
                onClick={triggerPelletizer}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Crystallize Ingots</span>
              </button>
            </div>

            {/* Manual Movement D-Pad */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => moveBot(-1, 0)}
                disabled={isRootAnchored}
                className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                title="Move Left"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveBot(0, -1)}
                  disabled={isRootAnchored}
                  className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveBot(0, 1)}
                  disabled={isRootAnchored}
                  className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={() => moveBot(1, 0)}
                disabled={isRootAnchored}
                className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                title="Move Right"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right col: Real-Time Sequestered Heavy Metals & Live Sensor Logs */}
        <div className="space-y-6">
          {/* Heavy Metals Bio-Vacuole Storage */}
          <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-5 shadow-xl font-mono text-xs">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-bold text-slate-200 uppercase tracking-wide">Hyperaccumulation Vacuoles</h3>
              <span className="text-[11px] text-emerald-400">Total: {telemetry.totalMetalsExtractedKg.toFixed(1)} kg</span>
            </div>

            <div className="space-y-3">
              {metals.map(metal => {
                const percent = Math.min(100, Math.round((metal.accumulatedKg / metal.maxCapacityKg) * 100));
                return (
                  <div key={metal.symbol} className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] text-slate-950"
                          style={{ backgroundColor: metal.color }}
                        >
                          {metal.symbol}
                        </span>
                        <div>
                          <div className="font-bold text-slate-200">{metal.name}</div>
                          <div className="text-[10px] text-slate-400">{metal.crystallizationStatus}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-200 font-bold">{metal.accumulatedKg.toFixed(2)} kg</span>
                        <div className="text-[10px] text-emerald-400">+{metal.conductivityS_m.toFixed(2)} S/m</div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${percent}%`, backgroundColor: metal.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Sensor & Phyto-Cognitive Event Log */}
          <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-5 shadow-xl flex flex-col justify-between font-mono text-xs">
            <div className="flex items-center gap-2 mb-3 text-slate-200 font-bold uppercase tracking-wider">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <span>Bio-Bot Event Log</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-[11px]">
              {eventLogs.map((log, index) => (
                <div key={index} className="text-slate-400 border-l-2 border-emerald-700/60 pl-2 py-0.5">
                  <span className="text-emerald-500 font-semibold">{`>`} </span>
                  {log}
                </div>
              ))}
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Ground Radar: Pinging</span>
              <span className="text-emerald-400 font-semibold">Mesh Sync Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
