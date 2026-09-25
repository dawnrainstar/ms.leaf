import React, { useState, useEffect, useRef } from 'react';
import { BioBotTelemetry, DroneTelemetry, HeavyMetalProfile } from '../types.ts';
import { BRAIN_FIRMWARE_FILES, FirmwareSourceFile } from '../data/bioBrainFirmware.ts';
import { bioAudio } from '../utils/audioSynthesizer.ts';
import {
  Cpu,
  Terminal,
  Download,
  Copy,
  Check,
  Search,
  Activity,
  Zap,
  Eye,
  Sliders,
  Sparkles,
  Layers,
  ShieldCheck,
  Radio,
  FileCode2,
  RefreshCw,
} from 'lucide-react';

interface BioBrainCodeViewerProps {
  telemetry: BioBotTelemetry;
  setTelemetry?: React.Dispatch<React.SetStateAction<BioBotTelemetry>>;
  droneTelemetry?: DroneTelemetry;
  metals: HeavyMetalProfile[];
}

export const BioBrainCodeViewer: React.FC<BioBrainCodeViewerProps> = ({
  telemetry,
  setTelemetry,
  droneTelemetry,
  metals,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>('brain-firmware-cpp');
  const [copied, setCopied] = useState<boolean>(false);
  const [bundleDownloaded, setBundleDownloaded] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentCognitiveMode, setCurrentCognitiveMode] = useState<string>(telemetry.mobilityMode);
  const [galvanoMv, setGalvanoMv] = useState<number>(38.5);
  const [synapseHz, setSynapseHz] = useState<number>(24.8);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const selectedFile = BRAIN_FIRMWARE_FILES.find(f => f.id === selectedFileId) || BRAIN_FIRMWARE_FILES[0];

  // Neural EEG Oscilloscope Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;

    const render = () => {
      step += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw grid
      ctx.strokeStyle = '#064e3b33';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Alpha/Theta Phytoneural biopotential wave
      ctx.beginPath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 8;

      for (let x = 0; x < width; x++) {
        // Complex multi-frequency phytoneural wave
        const alpha = Math.sin((x * 0.04) + (step * 2.2)) * 18;
        const theta = Math.sin((x * 0.015) + (step * 0.8)) * 12;
        const rootNoise = (Math.sin((x * 0.12) + step * 4) * 3) * (telemetry.rootWireConductivitySm * 0.8);
        const y = centerY + alpha + theta + rootNoise;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Secondary High-Metal Quantum Photoreceptor Wave
      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);

      for (let x = 0; x < width; x++) {
        const ocularWave = Math.cos((x * 0.06) - (step * 1.8)) * 10;
        const y = centerY + ocularWave;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [telemetry.rootWireConductivitySm]);

  // Handle Mode Change
  const handleCognitiveModeChange = (mode: string) => {
    bioAudio.playRootConductionPulse(1.4);
    setCurrentCognitiveMode(mode);
    if (setTelemetry) {
      setTelemetry(prev => ({
        ...prev,
        mobilityMode: mode as any,
      }));
    }
  };

  // Copy to Clipboard
  const handleCopyCode = async () => {
    bioAudio.playPurificationChime();
    try {
      await navigator.clipboard.writeText(selectedFile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Download Single File
  const handleDownloadFile = () => {
    bioAudio.playSolarChime();
    const blob = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download Complete Code Bundle
  const handleDownloadBundle = () => {
    bioAudio.playPurificationChime();
    const bundleHeader = `/**
 * ==============================================================================
 * MS. HEAVY METAL LEAF - COMPLETE CRANIAL BRAIN FIRMWARE & NEURAL OS BUNDLE
 * ==============================================================================
 * Included Files:
 * 1. MsHeavyMetalLeaf_Brain_Firmware.cpp  (FreeRTOS Master Kernel)
 * 2. phytoneural_brain_core.h            (Hardware Register & CAN Definitions)
 * 3. phyto_neural_decision_engine.py    (Neuromorphic Edge AI Model)
 * 4. AeroSpore_Drone_Autopilot.cpp      (Aerial Reconnaissance Flight Controller)
 * ==============================================================================
 */\n\n`;

    const combined = bundleHeader + BRAIN_FIRMWARE_FILES.map(f => `
/********************************************************************************
 * FILE: ${f.filename}
 * LANGUAGE: ${f.language.toUpperCase()}
 * DESCRIPTION: ${f.description}
 ********************************************************************************/
${f.code}
`).join('\n\n');

    const blob = new Blob([combined], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MsHeavyMetalLeaf_Full_Brain_Firmware_Bundle_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setBundleDownloaded(true);
    setTimeout(() => setBundleDownloaded(false), 3000);
  };

  // Filter lines if search query exists
  const lines = selectedFile.code.split('\n');
  const filteredLines = searchQuery
    ? lines.map((l, i) => ({ text: l, originalIndex: i + 1 })).filter(item => item.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : lines.map((l, i) => ({ text: l, originalIndex: i + 1 }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-950/50">
                <div className="w-full h-full bg-[#080d11] rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  Cranial Phyto-Neural Brain Core & Full Firmware
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-900/60 border border-emerald-700/50 text-emerald-300">
                    Dual Cortex-M7 + Neuromorphic SoC
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Full embedded C++ & Python source code governing biological memristors, 32 in-mold ISFET sensors, 4K high-metal ocular bio-cameras, and hydraulic balance.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
              <span>{copied ? 'Code Copied!' : 'Copy File Code'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-900/70 hover:bg-emerald-800/80 border border-emerald-700/60 text-xs font-semibold text-emerald-200 transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download {selectedFile.filename}</span>
            </button>

            <button
              onClick={handleDownloadBundle}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-xs font-bold text-white transition-all cursor-pointer shadow-md shadow-emerald-950/60"
            >
              {bundleDownloaded ? <Check className="w-4 h-4 text-white" /> : <FileCode2 className="w-4 h-4 text-white" />}
              <span>{bundleDownloaded ? 'Bundle Exported!' : 'Download All Files (.BUNDLE)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cranial Brain Dashboard: Oscilloscope + Cognitive State Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Phyto-Neural Waveform & Cognitive State Machine */}
        <div className="lg:col-span-2 bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                Cranial Mycelial Synaptic Oscilloscope (Alpha/Theta 8–14 Hz)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Firing: {synapseHz.toFixed(1)} Hz
              </span>
              <span className="text-cyan-400">
                Ocular Sync: 4K 60fps
              </span>
            </div>
          </div>

          {/* Oscilloscope Canvas */}
          <div className="relative rounded-xl overflow-hidden border border-emerald-900/60 bg-[#05080a] h-32 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={720}
              height={128}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-3 flex items-center gap-2 text-[10px] font-mono text-emerald-400/80 bg-slate-950/70 px-2 py-0.5 rounded border border-emerald-900/50">
              <span>CH1: Phytoneural Membrane (μV)</span>
              <span className="text-cyan-400">CH2: Quantum Ocular Retinal Array</span>
            </div>
            <div className="absolute bottom-2 right-3 text-[10px] font-mono text-slate-400 bg-slate-950/70 px-2 py-0.5 rounded border border-slate-800">
              Impedance: {(1.0 / (telemetry.rootWireConductivitySm + 0.01)).toFixed(2)} Ω • Galvanic: {galvanoMv.toFixed(1)} mV
            </div>
          </div>

          {/* Cognitive Autonomous State Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Active Cognitive State Machine:
              </label>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                {currentCognitiveMode}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'Deep Rooted Extraction', label: 'Deep Extraction', color: 'emerald', desc: 'Anchored 400 PSI, max metal chelation' },
                { id: 'Phototropic Solar Stasis', label: 'Solar Phototropic', color: 'amber', desc: 'Foliar canopy orient to sunlight' },
                { id: 'Agile Bipedal Stride', label: 'Agile Stride', color: 'cyan', desc: 'Bipedal walking across rough tailings' },
                { id: 'High-Torque Sludge Crawl', label: 'Sludge Crawl', color: 'orange', desc: 'Low center of gravity mud traversal' },
                { id: 'Aero-Spore Swarm Strike', label: 'Aero-Recon', color: 'purple', desc: 'Drone reconnaissance & seed drop' },
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => handleCognitiveModeChange(mode.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    currentCognitiveMode === mode.id
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-xs font-bold font-mono">{mode.label}</span>
                  <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">{mode.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Real-Time Sensory Bus Hardware Status */}
        <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-5 space-y-3.5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">
                Cranial Neural Sensory Bus
              </h3>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  Dual 4K Ocular Bio-Cameras:
                </span>
                <span className="text-cyan-300 font-bold">Biomineralized CdS Retinas (380-1100nm)</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  32 In-Mold ISFET Nodes:
                </span>
                <span className="text-emerald-300 font-bold">Active CAN2 Bus (pH {telemetry.soilHealthIndex ? (telemetry.soilHealthIndex / 15 + 4).toFixed(1) : '6.2'})</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Galvanotropic DACs:
                </span>
                <span className="text-amber-300 font-bold">{galvanoMv} mV Steering Current</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Hydraulic Balance Loop:
                </span>
                <span className="text-emerald-400 font-bold">1000 Hz / 400 PSI Setpoint</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/50 text-[11px] text-emerald-300/90 leading-relaxed">
            <span className="font-bold text-emerald-300">Brain Architecture:</span> The cranial vault integrates biological mycelial Memristors cultivated directly from hyperaccumulator root tips with a Dual 480MHz ARM Cortex-M7 + Neuromorphic RISC-V co-processor.
          </div>
        </div>
      </div>

      {/* Code Repository Browser & Full Code Viewer */}
      <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl shadow-xl overflow-hidden">
        {/* File Tabs & Search Bar */}
        <div className="bg-[#080d11] border-b border-emerald-950/70 p-3 flex flex-wrap items-center justify-between gap-3">
          {/* File Switcher Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {BRAIN_FIRMWARE_FILES.map(file => (
              <button
                key={file.id}
                onClick={() => {
                  bioAudio.playRootConductionPulse(1.2);
                  setSelectedFileId(file.id);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
                  selectedFileId === file.id
                    ? 'bg-slate-800 border-emerald-500/80 text-emerald-300 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <FileCode2 className={`w-3.5 h-3.5 ${selectedFileId === file.id ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{file.filename}</span>
                <span className="text-[10px] text-slate-500">({file.linesCount} lines)</span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search code..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#05080a] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-600 font-mono"
            />
          </div>
        </div>

        {/* File Description Header */}
        <div className="bg-[#0a0f13] px-5 py-3 border-b border-emerald-950/50 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div>
            <span className="text-slate-200 font-bold">{selectedFile.title}</span> • {selectedFile.description}
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Language: {selectedFile.language.toUpperCase()}</span>
            <span>Encoding: UTF-8</span>
            <span>Target: Embedded ARM / NPU</span>
          </div>
        </div>

        {/* Code Body with Line Numbers */}
        <div className="bg-[#05080a] p-4 font-mono text-xs overflow-x-auto max-h-[620px] select-text">
          <table className="w-full border-collapse">
            <tbody>
              {filteredLines.map((line, idx) => (
                <tr key={idx} className="hover:bg-emerald-950/20 group transition-colors">
                  <td className="w-12 text-right pr-4 text-slate-600 select-none border-r border-slate-800/80 text-[11px]">
                    {line.originalIndex}
                  </td>
                  <td className="pl-4 whitespace-pre text-slate-300 font-mono text-[12px] leading-relaxed">
                    {/* Basic syntax coloring */}
                    {line.text.startsWith('//') || line.text.startsWith(' *') || line.text.startsWith('/*') || line.text.startsWith('"""') || line.text.startsWith('#') && !line.text.startsWith('#include') && !line.text.startsWith('#define') ? (
                      <span className="text-emerald-500/80 italic">{line.text}</span>
                    ) : line.text.startsWith('#include') || line.text.startsWith('#define') || line.text.startsWith('import ') || line.text.startsWith('from ') ? (
                      <span className="text-purple-400 font-semibold">{line.text}</span>
                    ) : line.text.includes('void ') || line.text.includes('int ') || line.text.includes('float ') || line.text.includes('bool ') || line.text.includes('def ') || line.text.includes('class ') ? (
                      <span className="text-cyan-300">{line.text}</span>
                    ) : (
                      <span>{line.text}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Action Footer */}
        <div className="bg-[#080d11] p-4 border-t border-emerald-950/70 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>All firmware files are complete, non-stubbed, and ready for flashing via ST-Link v3 or JTAG.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              <span>Copy Current Code</span>
            </button>

            <button
              onClick={handleDownloadBundle}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-950"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Export Full Code (.ZIP / .BUNDLE)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
