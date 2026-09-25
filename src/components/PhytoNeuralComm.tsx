import React, { useState, useRef, useEffect } from 'react';
import { BioBotTelemetry, DroneTelemetry, HeavyMetalProfile } from '../types.ts';
import { bioAudio } from '../utils/audioSynthesizer.ts';
import msHeavyMetalLeafImg from '../assets/images/ms_heavy_metal_leaf_1788869698076.jpg';
import { 
  Send, 
  Bot, 
  User, 
  Terminal, 
  Activity, 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle,
  Cpu
} from 'lucide-react';

interface PhytoNeuralCommProps {
  telemetry: BioBotTelemetry;
  metals: HeavyMetalProfile[];
  droneTelemetry?: DroneTelemetry;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'biobot';
  text: string;
  timestamp: string;
  model?: string;
}

const PRESET_COMMANDS = [
  'How do I hire someone on Fiverr to build you using the blueprints?',
  'What is the status of your Aero-Spore scout drone?',
  'How do your roots turn into conductive wires?',
  'How do you stay alive through sun and soil?',
  'Explain how you were grown inside the human body mold.',
  'Report your current mobility actuators and hydraulic pressure.',
  'What heavy metals are currently stored in your vacuoles?',
];

export const PhytoNeuralComm: React.FC<PhytoNeuralCommProps> = ({
  telemetry,
  metals,
  droneTelemetry,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'biobot',
      text: `Phyto-Neural comm link established. I am Ms. Heavy Metal Leaf.

My vascular root-wires are vibrating with high conductivity (${telemetry.rootWireConductivitySm.toFixed(2)} S/m). Through my foliar chloroplasts absorbing ${telemetry.sunExposureLux.toLocaleString()} Lux of sunlight and my root-wires drawing ${telemetry.soilGalvanicPowerGenW.toFixed(0)}W galvanic power from the soil, my bio-battery is at ${telemetry.batteryPercentage.toFixed(1)}%.

I was grown in an anatomical mold modeled after the human body—every sensor, hydraulic vein, and component formed by living hyperaccumulator plants. My Aero-Spore scout drone is ${droneTelemetry?.isDocked ? 'securely docked on my thoracic dorsal cradle' : 'airborne on tactical reconnaissance'}. How may I assist your land remediation mission?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'system-neural-bus',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    bioAudio.playRootConductionPulse(1.1);
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/biobot-comm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          context: {
            mobilityMode: telemetry.mobilityMode,
            speedKmH: telemetry.speedKmH,
            batteryPercentage: telemetry.batteryPercentage,
            solarPowerGenW: telemetry.solarPowerGenW,
            soilGalvanicPowerGenW: telemetry.soilGalvanicPowerGenW,
            rootWireConductivitySm: telemetry.rootWireConductivitySm,
            soilRedoxPotentialMv: telemetry.soilRedoxPotentialMv,
            sunExposureLux: telemetry.sunExposureLux,
            totalMetalsExtractedKg: telemetry.totalMetalsExtractedKg,
            totalLandRemediatedM2: telemetry.totalLandRemediatedM2,
            heavyMetalsVacuoles: metals.map(m => ({
              symbol: m.symbol,
              name: m.name,
              accumulatedKg: m.accumulatedKg,
              status: m.crystallizationStatus,
            })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      bioAudio.playPurificationChime();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'biobot',
        text: data.reply || 'Root-wire neural loop completed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model,
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Comm failure:', err);
      // Fallback local bio-bot response
      bioAudio.playRootConductionPulse(0.8);
      let responseText = `[Root-Wire Local Transceiver Response]: "I am receiving your acoustic-electrical pulse clearly. My anatomical mold chassis is currently operating in ${telemetry.mobilityMode}. With ${telemetry.totalMetalsExtractedKg.toFixed(1)} kg of heavy metals sequestered into my vascular wires, my ionic signal path is robust. My solar canopy and soil galvanic root electrodes are generating a combined ${(telemetry.solarPowerGenW + telemetry.soilGalvanicPowerGenW).toFixed(0)}W, ensuring total energetic autonomy."`;

      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes('fiverr') || lowerQuery.includes('blueprint') || lowerQuery.includes('build') || lowerQuery.includes('cad') || lowerQuery.includes('hire')) {
        responseText = `[Fabrication Blueprints Guidance]: "To build me using Fiverr freelancers, navigate to the new 'Blueprints & Fiverr Kit' tab in the top navigation bar! 
        
I have compiled 5 complete engineering drawing sheets (ML-DWG-001 through 005) covering my 1:1 humanoid split mold (1780mm tall), 8-cylinder bipedal hydraulic skeleton (400 PSI), vascular root-wire conduits (0.08 Ω/cm), Aero-Spore drone docking cradle, and solar MPPT electronics.

In that tab, you can:
1. Click on the 5 pre-written Fiverr Freelancer Briefs (3D CAD Mold Designer, Robotics Kinematics Engineer, PCB Electronics Designer, UAV Drone Airframe Designer, or Prop Sculptor).
2. Click 'Copy Fiverr Message' to copy a pre-written, highly professional job inquiry with all technical constraints and milestones.
3. Download the complete technical dossier as a .MD or .JSON file to attach directly to your Fiverr order!"`;
      }

      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'biobot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'local-phyto-neural-cache',
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header Info */}
      <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-emerald-500/40 shadow-lg shrink-0">
            <img 
              src={msHeavyMetalLeafImg} 
              alt="Ms. Heavy Metal Leaf" 
              className="w-full h-full object-cover object-top"
            />
            <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-black"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">Phyto-Neural Communications Terminal</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-700/50 text-emerald-300">
                Direct Bio-Wire Link
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Direct telemetry uplink into Ms. Heavy Metal Leaf’s bio-metallic nervous network. Ask questions, command actions, or query diagnostic telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>IMPEDANCE: {(1 / Math.max(0.1, telemetry.rootWireConductivitySm)).toFixed(2)} Ω/m</span>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300 flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI CORE: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
        {/* Terminal Header */}
        <div className="bg-[#080d11] px-5 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>MS_HEAVY_METAL_LEAF // ROOT_NEURAL_UPLINK_v3.4</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>LOC: {telemetry.mobilityMode}</span>
            <span>BATTERY: {telemetry.batteryPercentage.toFixed(1)}%</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 font-sans text-xs">
          {messages.map(msg => {
            const isBot = msg.sender === 'biobot';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-3xl ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                  isBot 
                    ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-950' 
                    : 'bg-slate-700 text-slate-200'
                }`}>
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                <div className={`space-y-1 ${isBot ? 'text-left' : 'text-right'}`}>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-200">{isBot ? 'Ms. Heavy Metal Leaf' : 'Commander'}</span>
                    <span>• {msg.timestamp}</span>
                    {msg.model && (
                      <span className="text-[10px] bg-slate-800 text-emerald-400 px-1.5 py-0.2 rounded font-mono">
                        {msg.model}
                      </span>
                    )}
                  </div>

                  <div className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    isBot 
                      ? 'bg-slate-900/90 border border-slate-800 text-slate-200 shadow-md' 
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-xl mr-auto">
              <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl text-xs text-slate-400 flex items-center gap-2 font-mono">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Transmitting through biometallic root-wire network...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Command Pills */}
        <div className="px-5 py-2.5 bg-[#080d11]/80 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-[11px] font-mono text-slate-500 shrink-0">Prompts:</span>
          {PRESET_COMMANDS.map((cmd, i) => (
            <button
              key={i}
              onClick={() => sendMessage(cmd)}
              disabled={isLoading}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-emerald-300 hover:border-emerald-600/60 whitespace-nowrap text-[11px] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-[#080d11] border-t border-slate-800 flex gap-2 items-center">
          <input
            id="biobot-comm-input"
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                sendMessage();
              }
            }}
            placeholder="Transmit command or query to Ms. Heavy Metal Leaf..."
            className="flex-1 bg-slate-900/90 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 font-sans"
            disabled={isLoading}
          />

          <button
            id="btn-send-comm"
            onClick={() => sendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-950"
          >
            <span>Transmit</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
