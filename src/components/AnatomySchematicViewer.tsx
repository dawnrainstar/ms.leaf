import React, { useState } from 'react';
import { MoldComponent } from '../types.ts';
import { bioAudio } from '../utils/audioSynthesizer.ts';
import msHeavyMetalLeafImg from '../assets/images/ms_heavy_metal_leaf_1788869698076.jpg';
import rootWireMacroImg from '../assets/images/root_wire_schematic_1788869712878.jpg';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Droplet, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Crosshair,
  Sliders
} from 'lucide-react';

const MOLD_COMPONENTS: MoldComponent[] = [
  {
    id: 'cranial-lidar',
    name: 'Cranial Sensory Crown Mold',
    category: 'biosensors',
    botanicalBasis: 'Phototropic Tendril Tips & Stomatal Gas Arrays',
    cyberneticTech: 'Solid-state 360° LiDAR & Multi-Spectral Soil Spectrometer',
    humanoidMoldLocation: 'Cranium & Facial Geometry',
    description: 'A carbon-aerogel mold sculpted to human cranial dimensions. The hyperaccumulator crown foliage grows directly through micro-apertures, using electro-sensitive tendrils to guide navigation and identify airborne volatile toxic plumes.',
    electricalResistanceOhms: 12.4,
    status: 'Nominal',
    coordinates: { x: 50, y: 10 },
  },
  {
    id: 'cervical-bus',
    name: 'Cervical Vascular Bridge & Neural Bus',
    category: 'root_wire',
    botanicalBasis: 'Lignified Xylem-Phloem Cable Bundles',
    cyberneticTech: 'Optical-to-Bioelectric Pulse Transceivers',
    humanoidMoldLocation: 'Neck & Upper Vertebrae',
    description: 'High-density heavy metal root filaments pass through this channel, acting as a high-bandwidth biometallic bus connecting sensory crowns with thoracic energy storage.',
    electricalResistanceOhms: 2.1,
    status: 'Optimized',
    coordinates: { x: 50, y: 18 },
  },
  {
    id: 'thoracic-solar',
    name: 'Thoracic Photovoltaic Canopy Mold',
    category: 'solar_foliage',
    botanicalBasis: 'Quantum-Enhanced Bio-Perovskite Chloroplasts',
    cyberneticTech: 'Graphene Current Collectors & Transpiration Condenser',
    humanoidMoldLocation: 'Chest, Shoulders & Clavicles',
    description: 'Sculpted anatomical chest mold holding broad, metallic-tinted leaves that convert up to 92,000 Lux sunlight directly into electrochemical energy while capturing ambient humidity to keep roots hydrated.',
    electricalResistanceOhms: 4.8,
    status: 'Active',
    coordinates: { x: 50, y: 28 },
  },
  {
    id: 'thoracic-drone-dock',
    name: 'Thoracic Dorsal Drone Dock & Umbilical Bus',
    category: 'mold_scaffold',
    botanicalBasis: 'Fibro-Lignified Self-Aligning Conical Receptors',
    cyberneticTech: 'Magnetic-Bio Umbilical Charging Pad & 10 Gbps Opto-Coupler',
    humanoidMoldLocation: 'Upper Back & Inter-Scapular Cradle',
    description: 'Precision-molded cradle between her shoulder blades where the Aero-Spore scout drone attaches. Channels 65W direct solar & galvanic power from her living tissues into the drone while establishing a 10 Gbps aerial reconnaissance data uplink.',
    electricalResistanceOhms: 0.22,
    status: 'Optimized',
    coordinates: { x: 62, y: 26 },
  },
  {
    id: 'spinal-conduit',
    name: 'Spinal Root-Wire Conduit Channel',
    category: 'root_wire',
    botanicalBasis: 'Copper-Nickel Hyper-Deposited Vascular Cambium',
    cyberneticTech: 'Superconducting Bio-Metallic Trunkline (0.04 Ω/m)',
    humanoidMoldLocation: 'Spinal Column & Thoracolumbar Spine',
    description: 'As heavy metals are pulled upward from toxic soil, high-concentration nickel and copper crystallize into a flexible metallic wire trunk embedded in the humanoid spine mold, conducting up to 60A of current.',
    electricalResistanceOhms: 0.35,
    status: 'Optimized',
    coordinates: { x: 50, y: 42 },
  },
  {
    id: 'pelvic-pump',
    name: 'Pelvic Turgor-Hydraulic Reservoir',
    category: 'mobility_hydraulics',
    botanicalBasis: 'Osmotic Phloem High-Pressure Hydraulic Cells',
    cyberneticTech: 'Micro-Piezoelectric Turgor Pressure Valves (400 PSI)',
    humanoidMoldLocation: 'Pelvic Girdle & Hip Joints',
    description: 'The anatomical hip mold houses dual osmotic turgor chambers. By rapidly shunting potassium and copper ions, the plant creates explosive osmotic pressure shifts that articulate bipedal leg joints for smooth, autonomous walking.',
    electricalResistanceOhms: 8.2,
    status: 'Nominal',
    coordinates: { x: 50, y: 55 },
  },
  {
    id: 'brachial-siphons',
    name: 'Brachial Sampling Manipulator Molds',
    category: 'biosensors',
    botanicalBasis: 'Prehensile Thigmotropic Vine Actuators',
    cyberneticTech: 'Ion-Selective Field-Effect Micro-Electrodes (ISFET)',
    humanoidMoldLocation: 'Biceps, Forearms & Hands',
    description: 'Humanoid arm molds with flexible hollow sleeves where prehensile vines grow into articulated fingers. Equipped with chemical assay needles to sample soil core pH, redox potential, and toxic elemental PPM on contact.',
    electricalResistanceOhms: 15.0,
    status: 'Active',
    coordinates: { x: 26, y: 45 },
  },
  {
    id: 'femoral-rails',
    name: 'Femoral Hydraulic Actuator Molds',
    category: 'mobility_hydraulics',
    botanicalBasis: 'Lignified High-Tensile Cellulose Fiber Struts',
    cyberneticTech: 'Bi-Directional Fluidic Hydraulic Pistons',
    humanoidMoldLocation: 'Thighs & Femurs',
    description: 'Cast in the structural geometry of human femurs, these molds channel vascular fluid under high turgor pressure to give Ms. Heavy Metal Leaf rapid bipedal stride across rocky mining tailings and deep toxic mud.',
    electricalResistanceOhms: 6.4,
    status: 'Nominal',
    coordinates: { x: 42, y: 70 },
  },
  {
    id: 'podal-root-array',
    name: 'Podal Ground-Penetrating Root-Wire Array',
    category: 'root_wire',
    botanicalBasis: 'Deep Taproot & Mycorrhizal Bio-Grid Tendrils',
    cyberneticTech: 'Galvanic Anode Grounding & Subsurface GPR Nodes',
    humanoidMoldLocation: 'Feet & Sole Contact Surface',
    description: 'The feet molds feature hundreds of micro-orifices where heavy-metal saturated roots extend into the ground like flexible copper/silver wires. They simultaneously siphon toxic metals, draw galvanic earth energy, and anchor her firmly during storms.',
    electricalResistanceOhms: 0.18,
    status: 'Overclocked',
    coordinates: { x: 45, y: 92 },
  },
];

export const AnatomySchematicViewer: React.FC = () => {
  const [selectedComp, setSelectedComp] = useState<MoldComponent>(MOLD_COMPONENTS[3]); // spinal conduit by default
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showWireHighlight, setShowWireHighlight] = useState<boolean>(true);
  const [wireConductivityBoost, setWireConductivityBoost] = useState<number>(85);

  const filteredComponents = activeFilter === 'all'
    ? MOLD_COMPONENTS
    : MOLD_COMPONENTS.filter(c => c.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Title Header */}
      <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40">
              Biomorphic Architecture
            </span>
            <span className="text-xs text-amber-400 font-mono">
              Humanoid Mold Scaffold • 1:1 Anatomical Scale
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100">Anatomical Mold & Root-Wire System</h2>
          <p className="text-xs text-slate-400 max-w-3xl mt-1 leading-relaxed">
            Every sensor, hydraulic piston, and component is precision-cast into a human body mold. Modified hyperaccumulator plants (seeded in nutrient agar) grow into these hollow channels. As they absorb massive concentrations of toxic metals, their root systems crystallize into conductive biometallic wiring that powers and mobilizes her entire frame.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 flex-wrap">
          {[
            { id: 'all', label: 'All Components' },
            { id: 'root_wire', label: 'Root-Wires' },
            { id: 'biosensors', label: 'Sensors' },
            { id: 'mobility_hydraulics', label: 'Mobility' },
            { id: 'solar_foliage', label: 'Solar Foliage' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                bioAudio.playRootConductionPulse(1.1);
                setActiveFilter(tab.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                activeFilter === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Diagram & Component Inspect Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Anatomical Visual Representation & Pinpoints (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              Interactive Mold Blueprint
            </span>
            <button
              onClick={() => {
                setShowWireHighlight(!showWireHighlight);
                bioAudio.playRootConductionPulse(1.3);
              }}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
            >
              {showWireHighlight ? 'Hide Wire Currents' : 'Show Wire Currents'}
            </button>
          </div>

          {/* Body Canvas Area */}
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-slate-800 bg-[#05080a] flex items-center justify-center">
            {/* Base Image */}
            <img 
              src={msHeavyMetalLeafImg} 
              alt="Ms. Heavy Metal Leaf Anatomical Mold" 
              className="w-full h-full object-cover object-top opacity-85 transition-opacity duration-300"
            />
            
            {/* Bio-metallic root wire pulsing overlay */}
            {showWireHighlight && (
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-cyan-950/20 to-emerald-950/40 mix-blend-screen animate-pulse"></div>
            )}

            {/* Interactive Component Pinpoints */}
            {filteredComponents.map(comp => {
              const isSelected = selectedComp.id === comp.id;
              return (
                <button
                  key={comp.id}
                  id={`pinpoint-${comp.id}`}
                  onClick={() => {
                    setSelectedComp(comp);
                    bioAudio.playRootConductionPulse(1.0 + (comp.coordinates.y / 100));
                  }}
                  style={{
                    left: `${comp.coordinates.x}%`,
                    top: `${comp.coordinates.y}%`,
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/50 scale-125 z-30 shadow-lg shadow-amber-400/50'
                      : 'bg-emerald-500/90 hover:bg-emerald-400 text-slate-950 ring-2 ring-emerald-300/40 hover:scale-110 z-20'
                  }`}
                  title={comp.name}
                >
                  <span className="w-2.5 h-2.5 block rounded-full bg-slate-950"></span>
                </button>
              );
            })}

            {/* Bottom Overlay Info Tag */}
            <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/60 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-300 mb-1">
                <span>Vascular Root-Wire Grid:</span>
                <span className="text-cyan-400 font-bold">{wireConductivityBoost}% Metallized</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 via-cyan-400 to-emerald-400 h-full rounded-full"
                  style={{ width: `${wireConductivityBoost}%` }}
                ></div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-mono mt-3 text-center">
            Click any pulsating node to inspect the botanical-cybernetic component mold.
          </p>
        </div>

        {/* Right Column: In-Depth Component Inspector & Fabrication Protocols (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Selected Component Detailed Card */}
          <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {selectedComp.category.replace('_', ' ')}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mt-1">{selectedComp.name}</h3>
                <p className="text-xs text-amber-400 font-mono">Mold Region: {selectedComp.humanoidMoldLocation}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-900/40 border border-emerald-700/40 text-emerald-300">
                  Status: {selectedComp.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              {selectedComp.description}
            </p>

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 font-mono text-xs">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px]">Botanical Organism Basis:</span>
                <div className="font-semibold text-emerald-300">{selectedComp.botanicalBasis}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px]">Integrated Cybernetic Tech:</span>
                <div className="font-semibold text-cyan-300">{selectedComp.cyberneticTech}</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px]">Internal Electrical Resistance:</span>
                <div className="font-semibold text-amber-300">{selectedComp.electricalResistanceOhms} Ω</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl space-y-1">
                <span className="text-slate-400 text-[11px]">Conduction Medium:</span>
                <div className="font-semibold text-slate-200">Heavy-Metal Infused Cambium</div>
              </div>
            </div>

            {/* Deep Root-Wire Microscopic Insight */}
            <div className="bg-gradient-to-r from-emerald-950/50 via-slate-900/80 to-slate-900/80 border border-emerald-800/40 p-4 rounded-xl flex gap-4 items-center">
              <img 
                src={rootWireMacroImg} 
                alt="Root wire microscopic analysis" 
                className="w-20 h-20 rounded-xl object-cover border border-cyan-700/50 shadow-md shrink-0"
              />
              <div className="space-y-1 text-xs">
                <h4 className="font-bold text-slate-200">How Roots Become Conductive Wires</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  In natural hyperaccumulators like <em className="text-emerald-400 font-serif">Alyssum</em> and <em className="text-emerald-400 font-serif">Noccaea</em>, plants store up to 30,000 ppm of nickel in their tissues. In Ms. Heavy Metal Leaf, gene-edited heavy-metal ATPases channel copper, silver, and nickel along the root stele. The high metallic concentration turns the xylem tubules into solid, flexible metallic wires capable of carrying both multi-amp power currents and gigabit bio-sensor signals.
                </p>
              </div>
            </div>
          </div>

          {/* Component Quick Selector List */}
          <div className="bg-[#0b1216] border border-emerald-950/80 rounded-2xl p-5 shadow-xl">
            <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider mb-3">
              Full Anatomical Mold Registry ({MOLD_COMPONENTS.length} Nodes)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MOLD_COMPONENTS.map(comp => (
                <button
                  key={comp.id}
                  onClick={() => {
                    setSelectedComp(comp);
                    bioAudio.playRootConductionPulse(1.2);
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    selectedComp.id === comp.id
                      ? 'bg-emerald-950/90 border-emerald-500 text-slate-100 shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="font-semibold text-slate-200">{comp.name}</div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                    <span>{comp.humanoidMoldLocation}</span>
                    <span className="font-mono text-emerald-400">{comp.electricalResistanceOhms} Ω</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
