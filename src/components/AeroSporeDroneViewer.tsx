import React, { useState, useEffect, useRef } from 'react';
import { BioBotTelemetry, DroneCameraMode, DroneFlightMode, DroneTelemetry, GridTile } from '../types.ts';
import { bioAudio } from '../utils/audioSynthesizer.ts';
import bioScoutDroneImg from '../assets/images/bio_scout_drone_1788870375686.jpg';
import msHeavyMetalLeafImg from '../assets/images/ms_heavy_metal_leaf_1788869698076.jpg';
import { 
  Plane, 
  Eye, 
  Radio, 
  BatteryCharging, 
  Crosshair, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Compass, 
  Sliders, 
  Sparkles, 
  MapPin, 
  Layers, 
  Activity, 
  ShieldAlert, 
  RotateCw, 
  Camera, 
  Wifi, 
  Wind, 
  Gauge, 
  Zap, 
  Target,
  Send
} from 'lucide-react';

interface AeroSporeDroneViewerProps {
  droneTelemetry: DroneTelemetry;
  setDroneTelemetry: React.Dispatch<React.SetStateAction<DroneTelemetry>>;
  botTelemetry: BioBotTelemetry;
  setBotTelemetry: React.Dispatch<React.SetStateAction<BioBotTelemetry>>;
  botPos: { x: number; y: number };
  setBotPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  grid: GridTile[];
  setGrid: React.Dispatch<React.SetStateAction<GridTile[]>>;
  onNavigateToField?: () => void;
}

export const AeroSporeDroneViewer: React.FC<AeroSporeDroneViewerProps> = ({
  droneTelemetry,
  setDroneTelemetry,
  botTelemetry,
  botPos,
  setBotPos,
  grid,
  setGrid,
  onNavigateToField,
}) => {
  const [orbitAngle, setOrbitAngle] = useState<number>(0);
  const [hudPingEffect, setHudPingEffect] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string>('Aero-Spore drone operational. Select a camera mode or control flight.');
  const animationFrameRef = useRef<number | null>(null);

  // Flight simulation loop for autonomous modes
  useEffect(() => {
    if (droneTelemetry.isDocked) return;

    const interval = setInterval(() => {
      setDroneTelemetry(prev => {
        let newX = prev.coordinates.x;
        let newY = prev.coordinates.y;
        let newAlt = prev.altitudeMeters;
        let newSpeed = prev.speedKmH;
        let newBat = Math.max(0, prev.batteryPercentage - 0.05);

        if (prev.flightMode === 'Autonomous Orbit') {
          setOrbitAngle(a => {
            const nextA = (a + 0.05) % (Math.PI * 2);
            const radius = 2.5;
            newX = Math.max(0, Math.min(11, botPos.x + Math.cos(nextA) * radius));
            newY = Math.max(0, Math.min(7, botPos.y + Math.sin(nextA) * radius));
            return nextA;
          });
          newSpeed = 18.5;
          newAlt = 45;
        } else if (prev.flightMode === 'Grid Survey Scan') {
          // Snake across the grid
          newSpeed = 24.0;
          newAlt = 75;
          let nextX = prev.coordinates.x + 0.15;
          let nextY = prev.coordinates.y;
          if (nextX > 11) {
            nextX = 0;
            nextY = (prev.coordinates.y + 1) % 8;
          }
          newX = nextX;
          newY = nextY;
        } else if (prev.flightMode === 'Return to Dock') {
          // Move towards Ms. Heavy Metal Leaf
          const dx = botPos.x - prev.coordinates.x;
          const dy = botPos.y - prev.coordinates.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 0.3 && prev.altitudeMeters <= 5) {
            // Dock completed!
            bioAudio.playDroneDockLatch();
            setActionNotice('Drone safely docked onto Thoracic Dorsal Cradle. Commencing high-speed recharge.');
            return {
              ...prev,
              isDocked: true,
              coordinates: { x: botPos.x, y: botPos.y },
              altitudeMeters: 0,
              speedKmH: 0,
              wingBeatHz: 0,
              flightMode: 'Manual Remote',
            };
          } else {
            newX += (dx / Math.max(0.1, dist)) * 0.2;
            newY += (dy / Math.max(0.1, dist)) * 0.2;
            newAlt = Math.max(2, prev.altitudeMeters - 1.5);
            newSpeed = 14.0;
          }
        }

        return {
          ...prev,
          coordinates: { x: newX, y: newY },
          altitudeMeters: newAlt,
          speedKmH: newSpeed,
          batteryPercentage: newBat,
        };
      });
    }, 200);

    return () => clearInterval(interval);
  }, [droneTelemetry.isDocked, droneTelemetry.flightMode, botPos]);

  // Handle Launch / Undock
  const handleLaunchDrone = () => {
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
      setActionNotice('Aero-Spore released from Thoracic Dorsal Dock. Ascended to 35m tactical altitude.');
    } else {
      // Initiate return to dock
      bioAudio.playRootConductionPulse(1.2);
      setDroneTelemetry(prev => ({
        ...prev,
        flightMode: 'Return to Dock',
      }));
      setActionNotice('Return-to-Dock protocol initiated. Homing in on Ms. Heavy Metal Leaf.');
    }
  };

  // Directional remote piloting
  const handleNudgeDrone = (dx: number, dy: number) => {
    if (droneTelemetry.isDocked) return;
    bioAudio.playRootConductionPulse(1.3);
    setDroneTelemetry(prev => {
      const nx = Math.max(0, Math.min(11, prev.coordinates.x + dx));
      const ny = Math.max(0, Math.min(7, prev.coordinates.y + dy));
      return {
        ...prev,
        coordinates: { x: nx, y: ny },
        flightMode: 'Manual Remote',
      };
    });
  };

  // Change camera filter
  const handleSelectCameraMode = (mode: DroneCameraMode) => {
    bioAudio.playSolarChime();
    setDroneTelemetry(prev => ({ ...prev, cameraMode: mode }));
    setActionNotice(`Multispectral lens filter switched to: ${mode.toUpperCase().replace('_', ' ')}.`);
  };

  // Drop bio-spore aerial payload
  const handleDispenseBioSpores = () => {
    if (droneTelemetry.bioSporePayloadCount <= 0) {
      setActionNotice('Bio-Spore canister depleted! Return to Ms. Heavy Metal Leaf dock to synthesize more.');
      return;
    }

    bioAudio.playBioSporeDispense();
    const currX = Math.round(droneTelemetry.coordinates.x);
    const currY = Math.round(droneTelemetry.coordinates.y);

    // Apply bio-spores to grid tile
    setGrid(prevGrid =>
      prevGrid.map(tile => {
        if (Math.hypot(tile.x - currX, tile.y - currY) <= 1.5) {
          const reducedTox = Math.max(0, tile.currentToxicity - 25);
          return {
            ...tile,
            currentToxicity: reducedTox,
            vegetationStage: Math.max(tile.vegetationStage, 1),
            remediated: reducedTox === 0,
          };
        }
        return tile;
      })
    );

    setDroneTelemetry(prev => ({
      ...prev,
      bioSporePayloadCount: prev.bioSporePayloadCount - 1,
    }));

    setActionNotice(`Aerosolized mycorrhizal spores & chelating catalysts dispersed over (${currX}, ${currY}). Toxicity neutralized!`);
  };

  // Drop target waypoint for Ms. Heavy Metal Leaf
  const handleSetWaypointForBioBot = (gx: number, gy: number) => {
    bioAudio.playDroneTargetLock();
    setDroneTelemetry(prev => ({
      ...prev,
      targetWaypoint: { x: gx, y: gy },
    }));
    setBotPos({ x: gx, y: gy });
    setHudPingEffect(true);
    setTimeout(() => setHudPingEffect(false), 800);
    setActionNotice(`High-priority remediation beacon transmitted to Ms. Heavy Metal Leaf. Target vector: Sector (${gx}, ${gy}).`);
  };

  // Laser Spectrometer Deep Core Ping
  const handleLaserPing = () => {
    bioAudio.playDroneTargetLock();
    setHudPingEffect(true);
    setTimeout(() => setHudPingEffect(false), 900);
    const currX = Math.round(droneTelemetry.coordinates.x);
    const currY = Math.round(droneTelemetry.coordinates.y);
    const targetTile = grid.find(t => t.x === currX && t.y === currY);
    const tox = targetTile ? targetTile.currentToxicity : 65;
    const metal = targetTile ? targetTile.dominantMetal : 'Pb';
    setActionNotice(`Laser spectrometry ping on (${currX}, ${currY}): Detected ${metal} ions at ${tox * 110} PPM. Soil Eh: +${620 + tox * 2} mV.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner: Aero-Spore Scout Drone Introduction & Attachment Status */}
      <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950/60 px-2.5 py-0.5 rounded border border-cyan-800/40 flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5" />
              Remotely Flown Scout Drone
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              Model: &quot;Aero-Spore&quot; Mk.IV • Translucent Bio-Mimetic Wings
            </span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-bold ${
              droneTelemetry.isDocked 
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50' 
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 animate-pulse'
            }`}>
              {droneTelemetry.isDocked ? 'DOCKED ON HER DORSAL CRADLE' : `IN FLIGHT (${droneTelemetry.altitudeMeters.toFixed(0)}m ALT)`}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Aero-Spore Remote Aerial Reconnaissance Drone
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl mt-1 leading-relaxed">
            Attaches seamlessly into the thoracic dorsal dock between Ms. Heavy Metal Leaf’s shoulder foliar canopy. Remotely deployable to fly high above toxic wasteland sectors, providing multi-spectral aerial vision, targeting high-ppm chemical hotspots, and dispersing aerial bio-spores while charging directly from her living solar canopy and root-wire grid.
          </p>
        </div>

        {/* Action Toggle Button: Deploy / Dock */}
        <div className="flex items-center gap-3">
          <button
            id="btn-launch-drone"
            onClick={handleLaunchDrone}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              droneTelemetry.isDocked
                ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-cyan-950/50'
                : 'bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white shadow-amber-950/50'
            }`}
          >
            {droneTelemetry.isDocked ? (
              <>
                <Plane className="w-4 h-4" />
                <span>LAUNCH & FLY DRONE</span>
              </>
            ) : (
              <>
                <RotateCw className="w-4 h-4" />
                <span>RETURN & DOCK ON HER</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main HUD & Flight Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Interactive Aerial HUD Viewport */}
        <div className="lg:col-span-8 bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-4 shadow-xl space-y-3">
          {/* Viewport Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                AERIAL FEED // HD-GIMBAL
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">LAT/LNG: [{(droneTelemetry.coordinates.x * 0.082).toFixed(3)}°N, {(droneTelemetry.coordinates.y * 0.082).toFixed(3)}°E]</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-emerald-400">LINK: {droneTelemetry.linkQualityDb} dBm</span>
              <span className="text-amber-400">BATTERY: {droneTelemetry.batteryPercentage.toFixed(1)}%</span>
            </div>
          </div>

          {/* Camera Viewport Canvas */}
          <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-[#05080a] group select-none shadow-2xl">
            {/* Primary Drone Image Base */}
            <img 
              src={bioScoutDroneImg} 
              alt="Aero-Spore Drone Aerial Scouting View" 
              className={`w-full h-full object-cover transition-all duration-500 ${
                droneTelemetry.cameraMode === 'hyperspectral_metals' 
                  ? 'contrast-125 saturate-200 hue-rotate-60' 
                  : droneTelemetry.cameraMode === 'thermal_redox' 
                  ? 'invert hue-rotate-180 brightness-110' 
                  : droneTelemetry.cameraMode === 'ndvi_vegetation'
                  ? 'brightness-110 saturate-150'
                  : droneTelemetry.cameraMode === 'lidar_elevation'
                  ? 'grayscale contrast-150'
                  : ''
              }`}
            />

            {/* Filter Overlays */}
            {droneTelemetry.cameraMode === 'hyperspectral_metals' && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-purple-950/40 via-amber-950/20 to-emerald-950/30 mix-blend-color-dodge"></div>
            )}
            {droneTelemetry.cameraMode === 'thermal_redox' && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-rose-900/30 via-orange-950/20 to-blue-950/30 mix-blend-screen"></div>
            )}
            {droneTelemetry.cameraMode === 'ndvi_vegetation' && (
              <div className="absolute inset-0 pointer-events-none bg-emerald-900/20 mix-blend-color-dodge"></div>
            )}
            {droneTelemetry.cameraMode === 'lidar_elevation' && (
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
            )}

            {/* Scanlines HUD styling */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-40"></div>

            {/* Drone Status Watermark in Viewport */}
            <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-800/40 text-xs font-mono space-y-0.5">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5" />
                {droneTelemetry.isDocked ? 'DORSAL DOCKED' : `ALTITUDE: ${droneTelemetry.altitudeMeters.toFixed(0)}m`}
              </div>
              <div className="text-[11px] text-slate-300">
                GIMBAL PITCH: {droneTelemetry.gimbalPitchDeg}° | WING BEAT: {droneTelemetry.wingBeatHz} Hz
              </div>
            </div>

            {/* Target Reticle Crosshair in Center */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 ${
              hudPingEffect ? 'scale-150 text-cyan-300' : 'scale-100 text-emerald-400'
            }`}>
              <div className="relative w-20 h-20 border border-emerald-500/40 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-b-2 border-emerald-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <span className="absolute -top-5 text-[10px] font-mono tracking-widest text-emerald-300">
                  {droneTelemetry.cameraMode.toUpperCase()}
                </span>
                <span className="absolute -bottom-5 text-[10px] font-mono text-cyan-300">
                  [{droneTelemetry.coordinates.x.toFixed(1)}, {droneTelemetry.coordinates.y.toFixed(1)}]
                </span>
              </div>
            </div>

            {/* Interactive Grid Hotspots Pinpoints overlaid on Aerial View */}
            <div className="absolute inset-8 pointer-events-auto">
              {grid.filter(t => t.currentToxicity > 50).slice(0, 6).map((hotspot, idx) => {
                const normX = (hotspot.x / 11) * 100;
                const normY = (hotspot.y / 7) * 100;
                const isSelectedWaypoint = droneTelemetry.targetWaypoint?.x === hotspot.x && droneTelemetry.targetWaypoint?.y === hotspot.y;

                return (
                  <button
                    key={`${hotspot.x}-${hotspot.y}`}
                    onClick={() => handleSetWaypointForBioBot(hotspot.x, hotspot.y)}
                    style={{ left: `${normX}%`, top: `${normY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-lg border text-[10px] font-mono transition-transform hover:scale-110 cursor-pointer shadow-md ${
                      isSelectedWaypoint
                        ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold scale-110 ring-4 ring-amber-400/40 z-30'
                        : 'bg-black/70 backdrop-blur-sm text-rose-300 border-rose-600/60 hover:bg-rose-950 z-20'
                    }`}
                    title={`Click to order Ms. Heavy Metal Leaf to remediate (${hotspot.x}, ${hotspot.y})`}
                  >
                    <div className="flex items-center gap-1">
                      <Target className="w-2.5 h-2.5 text-amber-400" />
                      <span>{hotspot.dominantMetal}: {hotspot.currentToxicity}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Ms. Heavy Metal Leaf Position Indicator on Ground */}
            <div 
              style={{
                left: `${(botPos.x / 11) * 80 + 10}%`,
                top: `${(botPos.y / 7) * 80 + 10}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-all duration-300"
            >
              <div className="relative flex flex-col items-center">
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-500 text-[9px] font-mono text-emerald-300 whitespace-nowrap mb-1 shadow">
                  Ms. Heavy Metal Leaf
                </span>
                <div className="w-4 h-4 rounded-full bg-emerald-400 ring-4 ring-emerald-500/50 animate-pulse"></div>
              </div>
            </div>

            {/* Bottom In-View Control Bar */}
            <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">FLIGHT MODE:</span>
                <span className="text-cyan-400 font-bold">{droneTelemetry.flightMode}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400">SPEED:</span>
                <span className="text-slate-200">{droneTelemetry.speedKmH.toFixed(1)} km/h</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLaserPing}
                  className="px-2.5 py-1 rounded bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 cursor-pointer text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Crosshair className="w-3 h-3" />
                  <span>Laser Core Ping</span>
                </button>

                <button
                  onClick={handleDispenseBioSpores}
                  className="px-2.5 py-1 rounded bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 cursor-pointer text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Drop Bio-Spores ({droneTelemetry.bioSporePayloadCount})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Log / Notice */}
          <div className="bg-slate-900/80 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center justify-between gap-2">
            <span className="text-emerald-400">STATUS:</span>
            <span className="text-slate-200 truncate flex-1">{actionNotice}</span>
          </div>

          {/* Camera Filter Buttons */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-400 px-1 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              Multispectral Optical Sensor:
            </span>

            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'rgb', label: 'True Optical RGB' },
                { id: 'hyperspectral_metals', label: 'Hyperspectral Heavy Metals' },
                { id: 'thermal_redox', label: 'Thermal & Redox (Eh)' },
                { id: 'ndvi_vegetation', label: 'NDVI Bio-Vigor' },
                { id: 'lidar_elevation', label: '3D LiDAR Topo' },
              ].map(cam => (
                <button
                  key={cam.id}
                  onClick={() => handleSelectCameraMode(cam.id as DroneCameraMode)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    droneTelemetry.cameraMode === cam.id
                      ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                      : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cam.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Remote Flight Joystick & Navigation Controls */}
        <div className="lg:col-span-4 space-y-5">
          {/* Flight Controls Card */}
          <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                Remote Pilot Flight Deck
              </h3>
              <span className={`text-xs font-mono ${droneTelemetry.isDocked ? 'text-amber-400' : 'text-emerald-400'}`}>
                {droneTelemetry.isDocked ? 'Locked to Mold' : 'Direct Link Active'}
              </span>
            </div>

            {/* Directional Nudge Pad */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-slate-400 text-center">
                MANUAL DIRECTIONAL STEERING
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <button
                  onClick={() => handleNudgeDrone(0, -1)}
                  disabled={droneTelemetry.isDocked}
                  className="w-12 h-10 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:text-emerald-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow"
                  title="Fly North"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleNudgeDrone(-1, 0)}
                    disabled={droneTelemetry.isDocked}
                    className="w-12 h-10 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:text-emerald-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow"
                    title="Fly West"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="w-12 h-10 bg-slate-950 border border-cyan-900/60 rounded-xl flex flex-col items-center justify-center font-mono text-[10px] text-cyan-400">
                    <span>XY</span>
                    <span className="text-[9px] text-slate-400">{droneTelemetry.coordinates.x.toFixed(0)},{droneTelemetry.coordinates.y.toFixed(0)}</span>
                  </div>

                  <button
                    onClick={() => handleNudgeDrone(1, 0)}
                    disabled={droneTelemetry.isDocked}
                    className="w-12 h-10 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:text-emerald-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow"
                    title="Fly East"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

                <button
                  onClick={() => handleNudgeDrone(0, 1)}
                  disabled={droneTelemetry.isDocked}
                  className="w-12 h-10 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:text-emerald-400 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow"
                  title="Fly South"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Altitude & Gimbal Sliders */}
            <div className="pt-3 border-t border-slate-800 space-y-3 font-mono text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1 text-[11px]">
                  <span>Flight Altitude:</span>
                  <span className="text-cyan-400 font-bold">{droneTelemetry.altitudeMeters.toFixed(0)} Meters</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={150}
                  step={5}
                  value={droneTelemetry.altitudeMeters}
                  disabled={droneTelemetry.isDocked}
                  onChange={e => {
                    const alt = Number(e.target.value);
                    setDroneTelemetry(p => ({ ...p, altitudeMeters: alt }));
                  }}
                  className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer disabled:opacity-30"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>5m (Core Hover)</span>
                  <span>75m (Tactical)</span>
                  <span>150m (Valley Panorama)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1 text-[11px]">
                  <span>Gimbal Pitch Angle:</span>
                  <span className="text-amber-400 font-bold">{droneTelemetry.gimbalPitchDeg}°</span>
                </div>
                <input
                  type="range"
                  min={-90}
                  max={-10}
                  step={5}
                  value={droneTelemetry.gimbalPitchDeg}
                  onChange={e => {
                    const pitch = Number(e.target.value);
                    setDroneTelemetry(p => ({ ...p, gimbalPitchDeg: pitch }));
                  }}
                  className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>-90° (Nadir / Down)</span>
                  <span>-45° (Isometric)</span>
                  <span>-10° (Horizon)</span>
                </div>
              </div>
            </div>

            {/* Autonomous Flight Presets */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-mono text-slate-400 block mb-1">
                Autonomous Mission Profiles:
              </span>

              {[
                {
                  mode: 'Manual Remote',
                  label: 'Manual Pilot Control',
                  desc: 'Full pilot flight stick authority.',
                },
                {
                  mode: 'Autonomous Orbit',
                  label: 'Orbit Ms. Heavy Metal Leaf',
                  desc: 'Circles at 35m radius tracking her movement.',
                },
                {
                  mode: 'Grid Survey Scan',
                  label: 'Grid Sector Survey',
                  desc: 'Sweeps row by row cataloging toxic hotspots.',
                },
                {
                  mode: 'Return to Dock',
                  label: 'Return to Dorsal Dock (RTL)',
                  desc: 'Flies back to her back mold and locks into charger.',
                },
              ].map(f => (
                <button
                  key={f.mode}
                  onClick={() => {
                    bioAudio.playRootConductionPulse(1.2);
                    setDroneTelemetry(prev => ({
                      ...prev,
                      flightMode: f.mode as DroneFlightMode,
                      isDocked: false,
                      altitudeMeters: prev.altitudeMeters === 0 ? 35 : prev.altitudeMeters,
                    }));
                    setActionNotice(`Flight mode updated: ${f.label}`);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    droneTelemetry.flightMode === f.mode && !droneTelemetry.isDocked
                      ? 'bg-cyan-950/90 border-cyan-500 text-slate-100 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{f.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{f.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Navigate to Field */}
          {onNavigateToField && (
            <button
              onClick={onNavigateToField}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-800/50 text-emerald-300 font-mono text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Open Field Bioremediation Simulator</span>
            </button>
          )}
        </div>
      </div>

      {/* Deep Engineering Section: How the Drone Attaches & Operates with Ms. Heavy Metal Leaf */}
      <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
              Symbiotic Bio-Mechanical Integration
            </span>
            <h3 className="text-xl font-bold text-slate-100 mt-1">
              How Aero-Spore Attaches to Her Humanoid Body Mold
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-300">
            Magnetic-Bio Umbilical Coupling • 10 Gbps Neural Bus
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Docking Location */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Thoracic Dorsal Cradle
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Nestled between Ms. Heavy Metal Leaf’s shoulder blades and upper spinal column. Cast in carbon-fiber reinforced bio-resin, the cradle features self-aligning conical guides that catch the drone’s carbon landing skids under any weather conditions.
            </p>
          </div>

          {/* Card 2: Living Solar & Root Recharging */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Direct Solar & Galvanic Charging
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              While docked, the drone draws 65W directly from her thoracic bio-perovskite solar leaf canopy and the superconducting copper-nickel root-wire bus running up her spine. It fully recharges its graphene-polymer cell in 18 minutes.
            </p>
          </div>

          {/* Card 3: Translucent Dragonfly Wings */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-cyan-300 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-cyan-400" />
              Bio-Mimetic Dragonfly Flight
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Instead of loud spinning plastic propellers that kick up hazardous toxic dust, Aero-Spore uses quad bio-mimetic translucent wings. Powered by piezoelectric cellulose bundles, they beat at 42 Hz for silent hover, zero dust disturbance, and high gust tolerance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
