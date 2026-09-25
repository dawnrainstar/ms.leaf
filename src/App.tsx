import React, { useState } from 'react';
import { ActiveTab, BioBotTelemetry, DroneTelemetry, GridTile, HeavyMetalProfile } from './types.ts';
import { NavigationHeader } from './components/NavigationHeader.tsx';
import { FieldRemediationSimulator } from './components/FieldRemediationSimulator.tsx';
import { AnatomySchematicViewer } from './components/AnatomySchematicViewer.tsx';
import { SunSoilLifeEngine } from './components/SunSoilLifeEngine.tsx';
import { PhytoNeuralComm } from './components/PhytoNeuralComm.tsx';
import { AeroSporeDroneViewer } from './components/AeroSporeDroneViewer.tsx';
import { FabricationBlueprintsViewer } from './components/FabricationBlueprintsViewer.tsx';
import { BioBrainCodeViewer } from './components/BioBrainCodeViewer.tsx';
import { bioAudio } from './utils/audioSynthesizer.ts';

const INITIAL_METALS: HeavyMetalProfile[] = [
  {
    symbol: 'Ni',
    name: 'Nickel',
    accumulatedKg: 4.85,
    maxCapacityKg: 15.0,
    toxicityPpm: 3400,
    initialPpm: 5200,
    conductivityS_m: 0.42,
    color: '#34d399', // emerald
    crystallizationStatus: 'Solid Metallic Wire',
  },
  {
    symbol: 'Cu',
    name: 'Copper',
    accumulatedKg: 3.20,
    maxCapacityKg: 10.0,
    toxicityPpm: 2100,
    initialPpm: 4300,
    conductivityS_m: 0.58,
    color: '#fb923c', // copper orange
    crystallizationStatus: 'Solid Metallic Wire',
  },
  {
    symbol: 'Pb',
    name: 'Lead',
    accumulatedKg: 6.40,
    maxCapacityKg: 20.0,
    toxicityPpm: 4800,
    initialPpm: 8900,
    conductivityS_m: 0.18,
    color: '#60a5fa', // blue-gray
    crystallizationStatus: 'Pelletized Storage',
  },
  {
    symbol: 'Cd',
    name: 'Cadmium',
    accumulatedKg: 1.15,
    maxCapacityKg: 5.0,
    toxicityPpm: 920,
    initialPpm: 1800,
    conductivityS_m: 0.12,
    color: '#facc15', // yellow
    crystallizationStatus: 'Chelated Ion',
  },
  {
    symbol: 'Zn',
    name: 'Zinc',
    accumulatedKg: 5.10,
    maxCapacityKg: 12.0,
    toxicityPpm: 2800,
    initialPpm: 6100,
    conductivityS_m: 0.24,
    color: '#2dd4bf', // teal
    crystallizationStatus: 'Solid Metallic Wire',
  },
];

const INITIAL_TELEMETRY: BioBotTelemetry = {
  sunExposureLux: 95000,
  soilRedoxPotentialMv: 680,
  solarPowerGenW: 420,
  soilGalvanicPowerGenW: 190,
  totalPowerConsumptionW: 240,
  batteryStoredJoules: 7400000,
  batteryMaxJoules: 8000000,
  batteryPercentage: 92.5,
  rootWireConductivitySm: 0.94,
  rootDepthMeters: 0.6,
  mobilityMode: 'Agile Bipedal Stride',
  speedKmH: 4.5,
  coreTemperatureC: 22.4,
  transpirationRateMlHr: 680,
  totalLandRemediatedM2: 1420,
  totalMetalsExtractedKg: 20.7,
  soilHealthIndex: 78,
};

const INITIAL_DRONE_TELEMETRY: DroneTelemetry = {
  isDocked: true,
  dockCradle: 'Thoracic Dorsal Mold Dock',
  altitudeMeters: 0,
  speedKmH: 0,
  batteryPercentage: 98.5,
  chargeRateW: 65,
  dischargeRateW: 0,
  linkQualityDb: -38,
  coordinates: { x: 1, y: 1 },
  cameraMode: 'hyperspectral_metals',
  gimbalPitchDeg: -60,
  flightMode: 'Manual Remote',
  wingBeatHz: 0,
  scannedHotspotsCount: 3,
  bioSporePayloadCount: 32,
  targetWaypoint: null,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('field');
  const [telemetry, setTelemetry] = useState<BioBotTelemetry>(INITIAL_TELEMETRY);
  const [metals, setMetals] = useState<HeavyMetalProfile[]>(INITIAL_METALS);
  const [droneTelemetry, setDroneTelemetry] = useState<DroneTelemetry>(INITIAL_DRONE_TELEMETRY);
  const [botPos, setBotPos] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const [grid, setGrid] = useState<GridTile[]>([]);
  const [audioMuted, setAudioMuted] = useState<boolean>(bioAudio.getIsMuted());

  const handleToggleAudio = () => {
    const isMuted = bioAudio.toggleMute();
    setAudioMuted(isMuted);
  };

  return (
    <div className="min-h-screen bg-[#080d11] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Universal Navigation Header with live telemetry bar */}
      <NavigationHeader
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        telemetry={telemetry}
        droneTelemetry={droneTelemetry}
        audioMuted={audioMuted}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-12">
        {activeTab === 'field' && (
          <FieldRemediationSimulator
            telemetry={telemetry}
            setTelemetry={setTelemetry}
            metals={metals}
            setMetals={setMetals}
            droneTelemetry={droneTelemetry}
            setDroneTelemetry={setDroneTelemetry}
            botPos={botPos}
            setBotPos={setBotPos}
            grid={grid}
            setGrid={setGrid}
            onOpenDroneTab={() => setActiveTab('drone')}
          />
        )}

        {activeTab === 'drone' && (
          <AeroSporeDroneViewer
            droneTelemetry={droneTelemetry}
            setDroneTelemetry={setDroneTelemetry}
            botTelemetry={telemetry}
            setBotTelemetry={setTelemetry}
            botPos={botPos}
            setBotPos={setBotPos}
            grid={grid}
            setGrid={setGrid}
            onNavigateToField={() => setActiveTab('field')}
          />
        )}

        {activeTab === 'anatomy' && (
          <AnatomySchematicViewer />
        )}

        {activeTab === 'sustenance' && (
          <SunSoilLifeEngine
            telemetry={telemetry}
            setTelemetry={setTelemetry}
          />
        )}

        {activeTab === 'comm' && (
          <PhytoNeuralComm
            telemetry={telemetry}
            metals={metals}
            droneTelemetry={droneTelemetry}
          />
        )}

        {activeTab === 'blueprints' && (
          <FabricationBlueprintsViewer />
        )}

        {activeTab === 'brain' && (
          <BioBrainCodeViewer
            telemetry={telemetry}
            setTelemetry={setTelemetry}
            droneTelemetry={droneTelemetry}
            metals={metals}
          />
        )}
      </main>

      {/* Footer Specification Note */}
      <footer className="border-t border-emerald-950/60 bg-[#05080a] py-6 px-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-slate-300 font-semibold">
              Ms. Heavy Metal Leaf • Autonomous Hyperaccumulator Bio-Bot
            </div>
            <p className="text-[11px] text-slate-500">
              Cultivated via 1:1 human anatomical sensor mold • Metallized root-wire vascular circuitry • Sustained indefinitely by solar photon capture & soil redox potentials • Attached Aero-Spore scout drone for remote multispectral aerial views.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400">● 100% Autonomous Remediation</span>
            <span className="text-cyan-400">● Remote Scout Drone Active</span>
            <span>Ground Resistance: 0.18 Ω</span>
            <span>Bipedal Hydraulics: 400 PSI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
