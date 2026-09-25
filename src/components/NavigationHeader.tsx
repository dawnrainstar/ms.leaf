import React from 'react';
import { ActiveTab, BioBotTelemetry, DroneTelemetry } from '../types.ts';
import { bioAudio } from '../utils/audioSynthesizer.ts';
import { 
  Sun, 
  Zap, 
  BatteryCharging, 
  Activity, 
  Volume2, 
  VolumeX, 
  Compass, 
  Cpu, 
  Layers, 
  MessageSquareCode,
  Plane,
  FileText,
  Brain
} from 'lucide-react';

interface NavigationHeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  telemetry: BioBotTelemetry;
  droneTelemetry?: DroneTelemetry;
  audioMuted: boolean;
  onToggleAudio: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onSelectTab,
  telemetry,
  droneTelemetry,
  audioMuted,
  onToggleAudio,
}) => {
  return (
    <header className="border-b border-emerald-950/60 bg-[#080d11]/95 backdrop-blur-md sticky top-0 z-50 text-slate-200">
      {/* Top telemetry status ribbon */}
      <div className="border-b border-emerald-950/40 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-medium">SYS: FULLY AUTONOMOUS</span>
          </div>

          {droneTelemetry && (
            <button
              onClick={() => {
                bioAudio.playRootConductionPulse(1.3);
                onSelectTab('drone');
              }}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors border ${
                droneTelemetry.isDocked
                  ? 'bg-slate-900 border-slate-700 text-slate-300 hover:border-cyan-600'
                  : 'bg-cyan-950/80 border-cyan-700 text-cyan-300 shadow-sm shadow-cyan-950 animate-pulse'
              }`}
              title="Click to switch to Drone Aerial Recon view"
            >
              <Plane className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">
                DRONE: {droneTelemetry.isDocked ? 'DOCKED' : `FLIGHT (${droneTelemetry.altitudeMeters.toFixed(0)}m)`}
              </span>
              <span className="text-[10px] text-slate-400">({droneTelemetry.batteryPercentage.toFixed(0)}%)</span>
            </button>
          )}

          <div className="flex items-center gap-1 text-slate-300">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>SUN:</span>
            <span className="text-amber-300 font-semibold">{telemetry.sunExposureLux.toLocaleString()} Lux</span>
            <span className="text-slate-500">({telemetry.solarPowerGenW.toFixed(0)}W Solar)</span>
          </div>

          <div className="flex items-center gap-1 text-slate-300">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>SOIL REDOX:</span>
            <span className="text-orange-300 font-semibold">{telemetry.soilRedoxPotentialMv.toFixed(0)} mV</span>
            <span className="text-slate-500">({telemetry.soilGalvanicPowerGenW.toFixed(0)}W Galvanic)</span>
          </div>

          <div className="flex items-center gap-1 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>ROOT WIRE CONDUCTION:</span>
            <span className="text-cyan-300 font-semibold">{telemetry.rootWireConductivitySm.toFixed(2)} S/m</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded text-emerald-300">
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>BIO-BATTERY: {telemetry.batteryPercentage.toFixed(1)}% (NET +{(telemetry.solarPowerGenW + telemetry.soilGalvanicPowerGenW - telemetry.totalPowerConsumptionW).toFixed(0)}W)</span>
          </div>

          <button
            id="audio-toggle-button"
            onClick={onToggleAudio}
            className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-700 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 transition-colors cursor-pointer"
            title={audioMuted ? "Enable bio-acoustic soundscape" : "Mute bio-acoustic soundscape"}
          >
            {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="text-[11px]">{audioMuted ? 'Muted' : 'Audio On'}</span>
          </button>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-700 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-[#0b1216] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <span className="text-emerald-400 font-bold font-mono text-base">ML</span>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500 rounded-full blur-[2px] opacity-80"></div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-100 tracking-tight">Ms. Heavy Metal Leaf</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-emerald-900/60 border border-emerald-700/50 text-emerald-300">
                Hyperaccumulator Bio-Bot
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Grown in Humanoid Mold • Bio-Metallic Root Wiring • Self-Sustained via Sun & Soil • Aero-Spore Scout Drone
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <nav className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-xl flex-wrap">
          <button
            id="nav-tab-field"
            onClick={() => {
              bioAudio.playRootConductionPulse(1.1);
              onSelectTab('field');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'field'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Field Bioremediation</span>
          </button>

          <button
            id="nav-tab-drone"
            onClick={() => {
              bioAudio.playDroneTargetLock();
              onSelectTab('drone');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'drone'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Aero-Spore Drone</span>
          </button>

          <button
            id="nav-tab-anatomy"
            onClick={() => {
              bioAudio.playRootConductionPulse(1.3);
              onSelectTab('anatomy');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'anatomy'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Anatomical Mold & Roots</span>
          </button>

          <button
            id="nav-tab-sustenance"
            onClick={() => {
              bioAudio.playSolarChime();
              onSelectTab('sustenance');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'sustenance'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Sun & Soil Engine</span>
          </button>

          <button
            id="nav-tab-comm"
            onClick={() => {
              bioAudio.playPurificationChime();
              onSelectTab('comm');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'comm'
                ? 'bg-cyan-700 text-white shadow-md shadow-cyan-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquareCode className="w-4 h-4" />
            <span>Phyto-Neural Comm</span>
          </button>

          <button
            id="nav-tab-brain"
            onClick={() => {
              bioAudio.playRootConductionPulse(1.5);
              onSelectTab('brain');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'brain'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-950/50 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Brain className="w-4 h-4 text-purple-400" />
            <span>Brain & Full Code</span>
          </button>

          <button
            id="nav-tab-blueprints"
            onClick={() => {
              bioAudio.playRootConductionPulse(1.6);
              onSelectTab('blueprints');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'blueprints'
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-md shadow-cyan-950/60 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4 text-cyan-300" />
            <span>Blueprints & Fiverr Kit</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
