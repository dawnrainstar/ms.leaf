import React, { useState } from 'react';
import { BlueprintDrawing, BlueprintCallout, BlueprintBOMItem } from '../types.ts';
import { BLUEPRINT_DRAWINGS, FIVERR_COMMISSION_BRIEFS, FiverrCommissionBrief } from '../data/blueprintData.ts';
import { downloadBlueprintMarkdown, downloadBlueprintJSON, downloadBlueprintImage, downloadMasterProjectBrief, downloadEngineerSpecMarkdown, downloadGrowerProtocolMarkdown } from '../utils/blueprintExport.ts';
import { MASTER_PROJECT_BRIEF } from '../data/masterBriefText.ts';
import { ENGINEER_HANDOVER_SPEC, AQUAPONICS_GROWER_SPEC } from '../data/engineerAndGrowerHandover.ts';
import { bioAudio } from '../utils/audioSynthesizer.ts';
import blueprintCadImg from '../assets/images/ms_heavy_metal_leaf_blueprint_1788870891579.jpg';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Layers, 
  Cpu, 
  Plane, 
  Compass, 
  Crosshair, 
  Sliders, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ExternalLink, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  ChevronRight,
  Search,
  CheckCircle2,
  Wrench,
  Sparkles,
  HelpCircle,
  Image as ImageIcon,
  Leaf,
  BookOpen
} from 'lucide-react';

export const FabricationBlueprintsViewer: React.FC = () => {
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<'engineer' | 'grower' | 'fiverr' | 'master_brief' | 'schematic' | 'bom' | 'protocols'>('engineer');
  const [selectedCallout, setSelectedCallout] = useState<BlueprintCallout | null>(BLUEPRINT_DRAWINGS[0].callouts[0]);
  const [selectedFiverrBrief, setSelectedFiverrBrief] = useState<FiverrCommissionBrief>(FIVERR_COMMISSION_BRIEFS[0]);
  const [copiedBriefId, setCopiedBriefId] = useState<string | null>(null);
  const [copiedPromptSuccess, setCopiedPromptSuccess] = useState<boolean>(false);
  const [copiedMasterBrief, setCopiedMasterBrief] = useState<boolean>(false);
  const [copiedEngineerSpec, setCopiedEngineerSpec] = useState<boolean>(false);
  const [copiedGrowerSpec, setCopiedGrowerSpec] = useState<boolean>(false);
  const [bomSearch, setBomSearch] = useState<string>('');
  const [bomSystemFilter, setBomSystemFilter] = useState<string>('all');
  const [canvasZoom, setCanvasZoom] = useState<number>(1.0);
  const [visibleLayers, setVisibleLayers] = useState<{
    mold: boolean;
    hydraulics: boolean;
    roots: boolean;
    drone: boolean;
    annotations: boolean;
  }>({
    mold: true,
    hydraulics: true,
    roots: true,
    drone: true,
    annotations: true,
  });

  const currentSheet: BlueprintDrawing = BLUEPRINT_DRAWINGS[activeSheetIndex];

  const handleCopyPrompt = (brief: FiverrCommissionBrief) => {
    bioAudio.playRootConductionPulse(1.5);
    navigator.clipboard.writeText(brief.suggestedPromptMessage).then(() => {
      setCopiedBriefId(brief.id);
      setCopiedPromptSuccess(true);
      setTimeout(() => {
        setCopiedBriefId(null);
        setCopiedPromptSuccess(false);
      }, 3500);
    });
  };

  const handleCopyAllBrief = (brief: FiverrCommissionBrief) => {
    bioAudio.playRootConductionPulse(1.8);
    const fullText = `### PROJECT BRIEF: ${brief.categoryTitle}
Role: ${brief.freelancerRole}
Fiverr Category: ${brief.recommendedCategory}
Target Budget: ${brief.estimatedBudgetRange}
Timeline: ${brief.suggestedTimeline}
Required Software: ${brief.softwareRequired.join(', ')}

SUMMARY:
${brief.briefSummary}

DELIVERABLES:
${brief.keyDeliverables.map(d => `- ${d}`).join('\n')}

TECHNICAL SPECIFICATIONS:
${brief.exactSpecifications.map(s => `- ${s}`).join('\n')}

INITIAL MESSAGE TO FREELANCER:
${brief.suggestedPromptMessage}

SCREENING QUESTIONS:
${brief.screeningQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
`;
    navigator.clipboard.writeText(fullText).then(() => {
      setCopiedBriefId(`full-${brief.id}`);
      setTimeout(() => setCopiedBriefId(null), 3000);
    });
  };

  const handleCopyMasterBrief = () => {
    bioAudio.playPurificationChime();
    navigator.clipboard.writeText(MASTER_PROJECT_BRIEF).then(() => {
      setCopiedMasterBrief(true);
      setTimeout(() => setCopiedMasterBrief(false), 3000);
    });
  };

  const handleCopyEngineerSpec = () => {
    bioAudio.playRootConductionPulse(2.0);
    navigator.clipboard.writeText(ENGINEER_HANDOVER_SPEC).then(() => {
      setCopiedEngineerSpec(true);
      setTimeout(() => setCopiedEngineerSpec(false), 3000);
    });
  };

  const handleCopyGrowerSpec = () => {
    bioAudio.playSolarChime();
    navigator.clipboard.writeText(AQUAPONICS_GROWER_SPEC).then(() => {
      setCopiedGrowerSpec(true);
      setTimeout(() => setCopiedGrowerSpec(false), 3000);
    });
  };

  const handlePrint = () => {
    bioAudio.playSolarChime();
    window.print();
  };

  // Filtered BOM
  const allBOMItems = BLUEPRINT_DRAWINGS.flatMap(d => d.bom);
  const filteredBOM = allBOMItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(bomSearch.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(bomSearch.toLowerCase()) ||
      item.material.toLowerCase().includes(bomSearch.toLowerCase());
    const matchSystem = bomSystemFilter === 'all' || item.system === bomSystemFilter;
    return matchSearch && matchSystem;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Blueprint Header Banner with Engineering Title Block */}
      <div className="bg-[#091118] border border-cyan-900/60 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Subtle CAD grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e223315_1px,transparent_1px),linear-gradient(to_bottom,#0e223315_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase bg-cyan-950/90 border border-cyan-500/50 text-cyan-300">
                ISO 128 / ASME Y14.5 Technical Specification
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono uppercase bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                Revision: D.4 (Fabrication Ready)
              </span>
              <span className="text-slate-400 font-mono text-xs">Doc: ML-SPEC-GLOBAL-2026</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
              <FileText className="w-7 h-7 text-cyan-400" />
              <span>Fabrication Blueprints & Fiverr Builder Kit</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl mt-1">
              Complete engineering drawings, 1:1 humanoid mold dimensions, bipedal hydraulic kinematics, root-wire vascular wiring schematics, and <strong className="text-cyan-300">ready-to-copy freelancer job briefs</strong> designed specifically to commission 3D modelers, robotics engineers, and PCB designers on Fiverr.
            </p>

            {/* Critical Biological Reality Notice */}
            <div className="mt-3 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl flex items-start gap-3 shadow-md">
              <div className="p-1.5 rounded-lg bg-emerald-900/80 border border-emerald-400/50 text-emerald-300 shrink-0 mt-0.5">
                <Leaf className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xs leading-relaxed text-slate-300">
                <span className="font-bold text-emerald-300 uppercase tracking-wide font-mono flex items-center gap-1.5 mb-0.5">
                  <span>Botanical Mandate: Real Living Hyperaccumulator Plant Organism</span>
                  <span className="text-[10px] px-2 py-0.2 bg-emerald-900/90 text-emerald-200 rounded-full border border-emerald-500/40">Not Just Plastic</span>
                </span>
                Ms. Heavy Metal Leaf is <strong className="text-emerald-200">not a cold synthetic machine</strong>—she is an <strong className="text-emerald-300 font-semibold">actual living botanical hyperaccumulator plant</strong> (*Alyssum bertolonii* / *Noccaea caerulescens*) cultured directly inside a 1:1 humanoid mold framework! Her living root tissues biologically uptake heavy metals (Nickel, Copper, Lead, Cadmium, Zinc) directly from contaminated subsoil, transforming them into natural <strong className="text-cyan-300">conductive root-wire circuits (0.08 Ω/cm)</strong>. The mold chassis serves as a living plant hydroponic growth scaffold with 142 root egress pores!
              </div>
            </div>
          </div>

          {/* Quick Export & Print Actions */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              id="btn-download-engineer-spec"
              onClick={() => {
                bioAudio.playRootConductionPulse(1.5);
                downloadEngineerSpecMarkdown();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-400 text-cyan-200 text-xs font-mono font-bold transition-all cursor-pointer shadow-lg shadow-cyan-950/50"
              title="Download Engineer Handover Specification (.MD)"
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-400" />
              <span>Engineer Spec (.MD)</span>
            </button>

            <button
              id="btn-download-grower-protocol"
              onClick={() => {
                bioAudio.playSolarChime();
                downloadGrowerProtocolMarkdown();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-400 text-emerald-200 text-xs font-mono font-bold transition-all cursor-pointer shadow-lg shadow-emerald-950/50"
              title="Download Aquaponics & Botany Grower Protocol (.MD)"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grower Protocol (.MD)</span>
            </button>

            <button
              id="btn-download-blueprint-md"
              onClick={() => {
                bioAudio.playPurificationChime();
                downloadBlueprintMarkdown();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-semibold transition-colors cursor-pointer"
              title="Download full Markdown dossier (.MD)"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Full Dossier</span>
            </button>

            <button
              id="btn-download-master-brief"
              onClick={() => {
                bioAudio.playPurificationChime();
                downloadMasterProjectBrief();
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-950/90 hover:bg-blue-900 border border-blue-500/60 text-blue-200 text-xs font-mono font-semibold transition-colors cursor-pointer shadow-lg shadow-blue-950/50"
              title="Download Master Project Brief (.MD)"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Master Brief</span>
            </button>

            <button
              id="btn-download-blueprint-img"
              onClick={() => {
                bioAudio.playPurificationChime();
                downloadBlueprintImage(blueprintCadImg);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              title="Download high-resolution orthographic CAD Blueprint drawing image (.JPG)"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>CAD Image</span>
            </button>

            <button
              id="btn-print-blueprints"
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              title="Print formatted blueprint drawing sheets or Save to PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-cyan-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-cyan-950 flex-wrap">
            <button
              id="btn-subtab-engineer"
              onClick={() => {
                bioAudio.playRootConductionPulse(1.3);
                setActiveSubTab('engineer');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeSubTab === 'engineer'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-950 ring-1 ring-cyan-400'
                  : 'text-slate-300 hover:text-white bg-slate-900/60'
              }`}
            >
              <Wrench className="w-3.5 h-3.5 text-cyan-300" />
              <span>🛠️ For the Engineer</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/50 text-cyan-200">Copy</span>
            </button>

            <button
              id="btn-subtab-grower"
              onClick={() => {
                bioAudio.playSolarChime();
                setActiveSubTab('grower');
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                activeSubTab === 'grower'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950 ring-1 ring-emerald-400'
                  : 'text-slate-300 hover:text-white bg-slate-900/60'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-300" />
              <span>🌱 For the Aquaponics Grower</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-200">Copy</span>
            </button>

            <button
              id="btn-subtab-fiverr"
              onClick={() => {
                bioAudio.playRootConductionPulse(1.2);
                setActiveSubTab('fiverr');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeSubTab === 'fiverr'
                  ? 'bg-cyan-900/90 border border-cyan-500/60 text-cyan-200 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Fiverr Freelancers (6 Roles)</span>
            </button>

            <button
              id="btn-subtab-master-brief"
              onClick={() => {
                bioAudio.playRootConductionPulse(1.1);
                setActiveSubTab('master_brief');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeSubTab === 'master_brief'
                  ? 'bg-blue-900/90 border border-blue-400/80 text-blue-100 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-300" />
              <span>Master Brief</span>
            </button>

            <button
              id="btn-subtab-schematic"
              onClick={() => {
                bioAudio.playRootConductionPulse(1.0);
                setActiveSubTab('schematic');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeSubTab === 'schematic'
                  ? 'bg-cyan-900/90 border border-cyan-500/60 text-cyan-200 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>CAD Sheets ({BLUEPRINT_DRAWINGS.length})</span>
            </button>

            <button
              id="btn-subtab-bom"
              onClick={() => {
                bioAudio.playRootConductionPulse(1.0);
                setActiveSubTab('bom');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeSubTab === 'bom'
                  ? 'bg-cyan-900/90 border border-cyan-500/60 text-cyan-200 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>BOM</span>
            </button>

            <button
              id="btn-subtab-protocols"
              onClick={() => {
                bioAudio.playRootConductionPulse(1.0);
                setActiveSubTab('protocols');
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                activeSubTab === 'protocols'
                  ? 'bg-cyan-900/90 border border-cyan-500/60 text-cyan-200 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Fabrication Protocols</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Ready for Freelancers
            </span>
            <span className="text-slate-600">|</span>
            <span>Target Scale: 1:1 Life Size (1780mm)</span>
          </div>
        </div>
      </div>

      {/* SUBTAB 1: FIVERR COMMISSIONING KIT (PRIMARY USER INTENT) */}
      {activeSubTab === 'fiverr' && (
        <div className="space-y-6">
          {/* Quick Guidance Alert Box */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-600/40 rounded-2xl p-4 sm:p-5 shadow-lg">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-100">
                  How to use this kit to hire someone on Fiverr:
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Building a complex bio-robot like <strong className="text-emerald-300">Ms. Heavy Metal Leaf</strong> is best done in modular milestones. We have pre-structured <strong className="text-cyan-300">6 exact freelancer roles</strong> (including a Plant Biologist & Phytoremediation Specialist to guide root metallization, 3D CAD Mold Designer, Robotics Kinematics Engineer, PCB Power Systems Designer, Drone UAV Specialist, and Physical Prop Sculptor). Click on any role below, copy the pre-written job post, and paste it into Fiverr to immediately get qualified bids!
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className="bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                    Step 1: Select Gig Role below
                  </span>
                  <span className="text-slate-600">→</span>
                  <span className="bg-black/40 px-2 py-0.5 rounded border border-slate-800">
                    Step 2: Click "Copy Message"
                  </span>
                  <span className="text-slate-600">→</span>
                  <span className="bg-black/40 px-2 py-0.5 rounded border border-slate-800 text-cyan-300 font-semibold">
                    Step 3: Download & Attach Files
                  </span>
                </div>

                {/* Instant Download Bar for Fiverr Attachments */}
                <div className="mt-3 pt-3 border-t border-emerald-900/50 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-emerald-300 font-bold flex items-center gap-1.5 mr-1">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download files to attach on Fiverr:</span>
                  </span>
                  <button
                    onClick={() => {
                      bioAudio.playPurificationChime();
                      downloadBlueprintMarkdown();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/90 hover:bg-cyan-800 border border-cyan-400/60 text-cyan-100 text-xs font-mono font-bold transition-all cursor-pointer shadow"
                    title="Download complete technical specification (.MD) file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>1. Download Technical Dossier (.MD)</span>
                  </button>
                  <button
                    onClick={() => {
                      bioAudio.playPurificationChime();
                      downloadBlueprintImage(blueprintCadImg);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/90 hover:bg-emerald-800 border border-emerald-400/60 text-emerald-100 text-xs font-mono font-bold transition-all cursor-pointer shadow"
                    title="Download high-resolution orthographic drawing image (.JPG) file"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>2. Download Blueprint Image (.JPG)</span>
                  </button>
                  <button
                    onClick={() => {
                      bioAudio.playPurificationChime();
                      downloadBlueprintJSON();
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-mono transition-all cursor-pointer"
                    title="Download structured JSON specifications for CAD engineers"
                  >
                    <Download className="w-3 h-3 text-slate-400" />
                    <span>3. JSON Spec (.JSON)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Fiverr Role Selector & Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Role Selector Cards */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider font-semibold px-1">
                Select Freelancer Discipline:
              </div>

              {FIVERR_COMMISSION_BRIEFS.map(brief => {
                const isSelected = selectedFiverrBrief.id === brief.id;
                return (
                  <div
                    key={brief.id}
                    onClick={() => {
                      bioAudio.playRootConductionPulse(1.3);
                      setSelectedFiverrBrief(brief);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-500 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-500'
                        : 'bg-[#091118]/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-xs font-bold font-mono ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                        {brief.categoryTitle}
                      </h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-emerald-400 border border-emerald-900/60 whitespace-nowrap">
                        {brief.estimatedBudgetRange}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                      {brief.briefSummary}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {brief.suggestedTimeline}
                      </span>
                      <span className="text-cyan-400 font-semibold flex items-center gap-0.5">
                        View Brief <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Selected Brief Comprehensive Spec */}
            <div className="lg:col-span-8 bg-[#091118] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
              {/* Brief Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wide font-bold">
                    {selectedFiverrBrief.recommendedCategory}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
                    {selectedFiverrBrief.freelancerRole}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-copy-full-brief"
                    onClick={() => handleCopyAllBrief(selectedFiverrBrief)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                    title="Copy full brief with deliverables & specs"
                  >
                    {copiedBriefId === `full-${selectedFiverrBrief.id}` ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied Full Spec!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy All Details</span>
                      </>
                    )}
                  </button>

                  <button
                    id="btn-copy-prompt-primary"
                    onClick={() => handleCopyPrompt(selectedFiverrBrief)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold transition-all shadow-md shadow-emerald-950 cursor-pointer"
                  >
                    {copiedBriefId === selectedFiverrBrief.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Fiverr Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Quick Metrics (Budget, Timeline, Software) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" />
                    Recommended Budget
                  </div>
                  <div className="text-sm font-bold font-mono text-emerald-300 mt-0.5">
                    {selectedFiverrBrief.estimatedBudgetRange}
                  </div>
                  <div className="text-[10px] text-slate-400">Fair rate for milestone delivery</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    Suggested Timeline
                  </div>
                  <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">
                    {selectedFiverrBrief.suggestedTimeline}
                  </div>
                  <div className="text-[10px] text-slate-400">Includes revision cycle</div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3">
                  <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1">
                    <Wrench className="w-3 h-3 text-amber-400" />
                    Software Required
                  </div>
                  <div className="text-xs font-semibold font-mono text-slate-200 mt-0.5 truncate" title={selectedFiverrBrief.softwareRequired.join(', ')}>
                    {selectedFiverrBrief.softwareRequired.join(', ')}
                  </div>
                  <div className="text-[10px] text-slate-400">Industry standard tools</div>
                </div>
              </div>

              {/* Ready-to-Send Message Preview Box */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ready-to-Paste Message for Freelancer:</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Copy and paste directly into Fiverr's message box
                  </span>
                </div>

                <div className="relative">
                  <pre className="w-full bg-[#050b10] border border-cyan-900/60 rounded-xl p-4 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed selection:bg-cyan-900">
                    {selectedFiverrBrief.suggestedPromptMessage}
                  </pre>
                  <button
                    onClick={() => handleCopyPrompt(selectedFiverrBrief)}
                    className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-200 text-xs font-mono font-semibold flex items-center gap-1.5 shadow transition-colors cursor-pointer"
                  >
                    {copiedBriefId === selectedFiverrBrief.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Copy Message</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Instant Attachment Download Bar */}
                <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#060e15] border border-cyan-950/90 rounded-xl text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1.5 text-[11px]">
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Files to attach on Fiverr with this message:</span>
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => {
                        bioAudio.playPurificationChime();
                        downloadBlueprintMarkdown();
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-[11px] font-semibold cursor-pointer shadow transition-colors"
                      title="Download complete technical specification (.MD) file"
                    >
                      <Download className="w-3 h-3 text-cyan-400" />
                      <span>Download .MD Dossier</span>
                    </button>
                    <button
                      onClick={() => {
                        bioAudio.playPurificationChime();
                        downloadBlueprintImage(blueprintCadImg);
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 text-[11px] font-semibold cursor-pointer shadow transition-colors"
                      title="Download CAD drawing image (.JPG) to show freelancer"
                    >
                      <ImageIcon className="w-3 h-3 text-emerald-400" />
                      <span>Download Blueprint Image (.JPG)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Deliverables & Technical Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mandatory Deliverables:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedFiverrBrief.keyDeliverables.map((deliv, dIdx) => (
                      <li key={dIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0 mt-0.5">•</span>
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Exact Technical Specifications:</span>
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedFiverrBrief.exactSpecifications.map((spec, sIdx) => (
                      <li key={sIdx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Screening Questions to Ask Candidates */}
              <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4 space-y-2">
                <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Screening Questions (To Test Freelancer Experience):</span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Ask these questions during your Fiverr chat to filter out low-quality bids:
                </p>
                <div className="space-y-1.5 pt-1">
                  {selectedFiverrBrief.screeningQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="text-xs text-slate-300 font-mono bg-black/40 p-2 rounded-lg border border-slate-800/60">
                      <strong className="text-amber-400 mr-1.5">Q{qIdx + 1}:</strong>
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: CAD DRAWING SHEETS (INTERACTIVE SCHEMATIC) */}
      {activeSubTab === 'schematic' && (
        <div className="space-y-6">
          {/* Sheet Selector Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {BLUEPRINT_DRAWINGS.map((sheet, idx) => (
              <button
                key={sheet.id}
                onClick={() => {
                  bioAudio.playRootConductionPulse(1.0 + idx * 0.15);
                  setActiveSheetIndex(idx);
                  setSelectedCallout(sheet.callouts[0] || null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all cursor-pointer border ${
                  activeSheetIndex === idx
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/60'
                    : 'bg-[#091118] border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span className="text-cyan-400 font-bold">[{sheet.sheetNumber}]</span>
                <span>{sheet.title}</span>
              </button>
            ))}
          </div>

          {/* Main Visual Blueprint Drafting Board */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Visual CAD Canvas */}
            <div className="lg:col-span-8 bg-[#04080e] border border-cyan-900/70 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
              {/* Canvas Header Bar */}
              <div className="bg-[#08121c] border-b border-cyan-950 px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  <span>{currentSheet.drawingCode}</span>
                  <span className="text-slate-500 font-normal">|</span>
                  <span className="text-slate-300 font-normal">{currentSheet.scale}</span>
                </div>

                {/* Layer Visibility Toggles */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCanvasZoom(z => Math.max(0.75, z - 0.15))}
                    className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 w-10 text-center font-mono">
                    {Math.round(canvasZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setCanvasZoom(z => Math.min(1.75, z + 0.15))}
                    className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setCanvasZoom(1.0)}
                    className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 cursor-pointer ml-1"
                  >
                    Reset
                  </button>

                  <button
                    onClick={() => {
                      bioAudio.playPurificationChime();
                      downloadBlueprintImage(blueprintCadImg);
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-cyan-950 hover:bg-cyan-900 text-cyan-200 border border-cyan-600/50 cursor-pointer ml-1.5"
                    title="Download this CAD Drawing Image (.JPG)"
                  >
                    <Download className="w-3 h-3 text-cyan-400" />
                    <span>Download Image</span>
                  </button>
                </div>
              </div>

              {/* Blueprint Image & Interactive Markers */}
              <div className="relative overflow-auto p-4 flex items-center justify-center min-h-[440px] max-h-[580px] bg-[radial-gradient(#0e2238_1px,transparent_1px)] [background-size:16px_16px]">
                <div 
                  className="relative transition-transform duration-200"
                  style={{ transform: `scale(${canvasZoom})` }}
                >
                  {/* Generated CAD Blueprint Illustration */}
                  <img
                    src={blueprintCadImg}
                    alt={currentSheet.title}
                    className="max-h-[500px] w-auto object-contain rounded-lg border border-cyan-900/50 shadow-2xl"
                  />

                  {/* Dimension Overlay Badges */}
                  {visibleLayers.annotations && (
                    <>
                      <div className="absolute top-3 left-3 bg-black/80 border border-cyan-500/60 rounded px-2 py-1 text-[9px] font-mono text-cyan-300">
                        H: {currentSheet.dimensions.height || '1780mm'}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/80 border border-cyan-500/60 rounded px-2 py-1 text-[9px] font-mono text-cyan-300">
                        W: {currentSheet.dimensions.width || '440mm'}
                      </div>
                    </>
                  )}

                  {/* Interactive Callout Points */}
                  {currentSheet.callouts.map((callout, cIdx) => {
                    const isSelected = selectedCallout?.id === callout.id;
                    return (
                      <button
                        key={callout.id}
                        onClick={() => {
                          bioAudio.playRootConductionPulse(1.4);
                          setSelectedCallout(callout);
                        }}
                        style={{
                          left: `${callout.x}%`,
                          top: `${callout.y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        className={`absolute z-20 group p-1 rounded-full cursor-pointer transition-transform ${
                          isSelected
                            ? 'scale-125 ring-2 ring-cyan-400 bg-cyan-900 shadow-lg shadow-cyan-950'
                            : 'hover:scale-125 bg-slate-900/90 border border-cyan-600/70 text-cyan-300'
                        }`}
                        title={callout.label}
                      >
                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-mono font-bold ${
                          isSelected ? 'bg-cyan-400 text-black' : 'bg-cyan-950 text-cyan-200'
                        }`}>
                          {cIdx + 1}
                        </div>

                        {/* Hover Tooltip Label */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block bg-black/90 border border-cyan-500/80 rounded px-2 py-0.5 text-[10px] font-mono text-cyan-200 whitespace-nowrap shadow-xl z-30 pointer-events-none">
                          {callout.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Block Footer (Standard ISO Drafting Format) */}
              <div className="bg-[#050b10] border-t border-cyan-950 p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono text-slate-400">
                <div>
                  <span className="text-slate-600">DRAWING:</span> <strong className="text-cyan-300">{currentSheet.drawingCode}</strong>
                </div>
                <div>
                  <span className="text-slate-600">REVISION:</span> <span className="text-slate-300">{currentSheet.revision}</span>
                </div>
                <div>
                  <span className="text-slate-600">SHEET:</span> <span className="text-slate-300">{currentSheet.sheetNumber}</span>
                </div>
                <div>
                  <span className="text-slate-600">STATUS:</span> <span className="text-emerald-400 font-bold">APPROVED CAD</span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Selected Callout & Sheet Inspector */}
            <div className="lg:col-span-4 space-y-4">
              {/* Callout Inspector Card */}
              {selectedCallout ? (
                <div className="bg-[#091118] border border-cyan-900/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                      Callout Node • {selectedCallout.category.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {selectedCallout.partNumber}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100">
                    {selectedCallout.label}
                  </h3>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="bg-black/40 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">MATERIAL GRADE:</div>
                      <div className="text-slate-200 font-semibold">{selectedCallout.material}</div>
                    </div>

                    <div className="bg-black/40 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">MACHINING TOLERANCE:</div>
                      <div className="text-emerald-300 font-semibold">{selectedCallout.tolerance}</div>
                    </div>

                    <div className="bg-black/40 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">OPERATIONAL SPECIFICATION:</div>
                      <div className="text-slate-300">{selectedCallout.specification}</div>
                    </div>

                    <div className="bg-black/40 p-2.5 rounded-lg border border-slate-800/80">
                      <div className="text-[10px] text-slate-400">OPERATING PARAMETER:</div>
                      <div className="text-cyan-300">{selectedCallout.operationalParam}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#091118] border border-slate-800 rounded-2xl p-6 text-center text-xs font-mono text-slate-500">
                  Select a numbered callout pin on the blueprint to view engineering tolerances and material grades.
                </div>
              )}

              {/* Engineering Notes Card */}
              <div className="bg-[#091118] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sheet Engineering Notes:</span>
                </h4>
                <ul className="space-y-2">
                  {currentSheet.engineeringNotes.map((note, nIdx) => (
                    <li key={nIdx} className="text-xs text-slate-400 font-mono flex items-start gap-2 leading-relaxed">
                      <span className="text-cyan-400 font-bold shrink-0">{nIdx + 1}.</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Critical Dimensions Summary */}
              <div className="bg-[#091118] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
                  Critical Sheet Dimensions:
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {Object.entries(currentSheet.dimensions).map(([k, v]) => (
                    <div key={k} className="bg-black/40 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">{k}:</div>
                      <div className="text-slate-300 font-bold truncate">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: CONSOLIDATED BILL OF MATERIALS (BOM) */}
      {activeSubTab === 'bom' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-[#091118] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search BOM by part #, name, or material..."
                  value={bomSearch}
                  onChange={(e) => setBomSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">System:</span>
              <select
                value={bomSystemFilter}
                onChange={(e) => setBomSystemFilter(e.target.value)}
                className="bg-black/60 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="all">All Subsystems ({allBOMItems.length})</option>
                <option value="Mold Scaffold">Mold Scaffold</option>
                <option value="Plant Genetics">Plant Genetics</option>
                <option value="Root-Wire Conduits">Root-Wire Conduits</option>
                <option value="Power Plant">Power Plant</option>
                <option value="Hydraulics">Hydraulics</option>
                <option value="Neural/Sensors">Neural/Sensors</option>
              </select>
            </div>
          </div>

          {/* BOM Table */}
          <div className="bg-[#091118] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#0e1822] text-slate-300 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Part Number</th>
                    <th className="py-3 px-4">Component Name</th>
                    <th className="py-3 px-4">Subsystem</th>
                    <th className="py-3 px-4">Material Grade</th>
                    <th className="py-3 px-4">Quantity</th>
                    <th className="py-3 px-4">Tolerance</th>
                    <th className="py-3 px-4">Specification & Sourcing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredBOM.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3 px-4 text-cyan-400 font-bold whitespace-nowrap">
                        {item.partNumber}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-100">
                        {item.name}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-black/40 border border-slate-800 text-[10px] text-slate-400">
                          {item.system}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {item.material}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400 whitespace-nowrap">
                        {item.qty}
                      </td>
                      <td className="py-3 px-4 text-amber-300 whitespace-nowrap">
                        {item.tolerance}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px] max-w-xs">
                        {item.specification}
                      </td>
                    </tr>
                  ))}
                  {filteredBOM.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-500 font-mono">
                        No BOM items match your search filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: FABRICATION PROTOCOLS */}
      {activeSubTab === 'protocols' && (
        <div className="space-y-4">
          <div className="bg-[#091118] border border-slate-800 rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Step-by-Step Fabrication Sequence & Quality Standards</span>
            </h3>

            <div className="space-y-4">
              {BLUEPRINT_DRAWINGS.flatMap((d, sIdx) => 
                d.protocols.map((proto, pIdx) => (
                  <div key={`${sIdx}-${pIdx}`} className="bg-black/50 border border-slate-800/80 rounded-xl p-4 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-cyan-950 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold flex items-center justify-center">
                          {proto.stepNumber}
                        </span>
                        <h4 className="text-sm font-bold text-slate-200">
                          {proto.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                          {proto.phase}
                        </span>
                        <span className="text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                          {proto.duration}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 font-mono pl-8 leading-relaxed">
                      {proto.description}
                    </p>

                    <div className="pl-8 pt-1 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <span className="text-slate-500">Environmental:</span>
                      <span className="text-slate-300">{proto.environmentalControl}</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-emerald-400">QA Standard: {proto.qualityStandard}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: ENGINEER HANDOVER SPEC */}
      {activeSubTab === 'engineer' && (
        <div className="space-y-4">
          <div className="bg-[#091118] border border-cyan-900/60 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-700">
                    Lead Engineer Dossier
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    ● Ready to Copy & Paste for Hardware/CAD Engineers
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-cyan-400" />
                  <span>Lead Robotics & Hardware Engineer Handover Specification</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete technical dossier covering 1780mm split mold, bipedal hydraulics (400 PSI), 32 in-mold ISFET sensors, 64-LED vein bus, ocular quantum-dot cameras, dual-MCU brain, and Aero-Spore drone cradle.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="btn-copy-engineer-spec"
                  onClick={handleCopyEngineerSpec}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-cyan-950 cursor-pointer"
                >
                  {copiedEngineerSpec ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied Engineer Spec!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-cyan-200" />
                      <span>Copy Entire Engineer Spec</span>
                    </>
                  )}
                </button>
                <button
                  id="btn-download-engineer-spec-inner"
                  onClick={() => {
                    bioAudio.playRootConductionPulse(1.5);
                    downloadEngineerSpecMarkdown();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download (.MD)</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid for Engineer */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
              <div className="bg-black/50 p-2.5 rounded-xl border border-cyan-950">
                <div className="text-[10px] text-slate-400 uppercase">Mold Scale</div>
                <div className="text-cyan-300 font-bold mt-0.5">1780mm (1:1)</div>
                <div className="text-[10px] text-slate-400">8.5mm wall, 3° draft</div>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-cyan-950">
                <div className="text-[10px] text-slate-400 uppercase">Hydraulics</div>
                <div className="text-emerald-300 font-bold mt-0.5">400 PSI</div>
                <div className="text-[10px] text-slate-400">1,350 N knee thrust</div>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-cyan-950">
                <div className="text-[10px] text-slate-400 uppercase">Root Conduction</div>
                <div className="text-amber-300 font-bold mt-0.5">≤ 0.08 Ω/cm</div>
                <div className="text-[10px] text-slate-400">Living Ni/Cu wiring</div>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-cyan-950">
                <div className="text-[10px] text-slate-400 uppercase">Cranial Brain</div>
                <div className="text-blue-300 font-bold mt-0.5">STM32F405</div>
                <div className="text-[10px] text-slate-400">1000 Hz RTOS loop</div>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-cyan-950">
                <div className="text-[10px] text-slate-400 uppercase">Power Plant</div>
                <div className="text-purple-300 font-bold mt-0.5">420W MPPT</div>
                <div className="text-[10px] text-slate-400">+ 450-950mV redox</div>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-cyan-950">
                <div className="text-[10px] text-slate-400 uppercase">Sensory Bus</div>
                <div className="text-teal-300 font-bold mt-0.5">32 ISFETs</div>
                <div className="text-[10px] text-slate-400">64 LEDs + Dual 4K</div>
              </div>
            </div>

            {/* Formatted Code View */}
            <div className="relative">
              <pre className="w-full bg-[#050b10] border border-cyan-950/80 rounded-xl p-5 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[640px] overflow-y-auto selection:bg-cyan-900">
                {ENGINEER_HANDOVER_SPEC}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB: AQUAPONICS & BOTANY GROWER MASTER PROTOCOL */}
      {activeSubTab === 'grower' && (
        <div className="space-y-4">
          <div className="bg-[#091118] border border-emerald-900/60 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-950 text-emerald-300 border border-emerald-700">
                    Grower & Botanist Dossier
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    ● Ready to Copy & Paste for Aquaponics/Hydroponics Cultivators
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  <span>Aquaponics, Hydroponics & Botany Master Protocol</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete biological cultivation manual: certified species, 45-day chelated metal dosing (Ni-EDTA, Cu-Citrate), 15-50mV galvanotropic root steering along circuit micro-grooves, and ocular quantum-dot biomineralization.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="btn-copy-grower-spec"
                  onClick={handleCopyGrowerSpec}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold transition-all shadow-lg shadow-emerald-950 cursor-pointer"
                >
                  {copiedGrowerSpec ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied Grower Protocol!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-emerald-200" />
                      <span>Copy Entire Grower Protocol</span>
                    </>
                  )}
                </button>
                <button
                  id="btn-download-grower-protocol-inner"
                  onClick={() => {
                    bioAudio.playSolarChime();
                    downloadGrowerProtocolMarkdown();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download (.MD)</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid for Grower */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono">
              <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-950">
                <div className="text-[10px] text-slate-400 uppercase">Primary Species</div>
                <div className="text-emerald-300 font-bold mt-0.5 truncate" title="Alyssum bertolonii">A. bertolonii</div>
                <div className="text-[10px] text-slate-400">13,400 mg/kg Ni</div>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-950">
                <div className="text-[10px] text-slate-400 uppercase">Secondary Species</div>
                <div className="text-teal-300 font-bold mt-0.5 truncate" title="Noccaea caerulescens">N. caerulescens</div>
                <div className="text-[10px] text-slate-400">30,000 mg/kg Zn</div>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-950">
                <div className="text-[10px] text-slate-400 uppercase">Root Steering</div>
                <div className="text-amber-300 font-bold mt-0.5">15–50 mV DC</div>
                <div className="text-[10px] text-slate-400">8–14 mm/day tropism</div>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-950">
                <div className="text-[10px] text-slate-400 uppercase">Nutrient Targets</div>
                <div className="text-cyan-300 font-bold mt-0.5">pH 5.8 – 6.2</div>
                <div className="text-[10px] text-slate-400">EC: 1.8 – 2.4 mS/cm</div>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-950">
                <div className="text-[10px] text-slate-400 uppercase">Mineralization</div>
                <div className="text-purple-300 font-bold mt-0.5">45 Days</div>
                <div className="text-[10px] text-slate-400">Ni-EDTA / Cu-Citrate</div>
              </div>
              <div className="bg-black/50 p-2.5 rounded-xl border border-emerald-950">
                <div className="text-[10px] text-slate-400 uppercase">Root Conductance</div>
                <div className="text-emerald-400 font-bold mt-0.5">≤ 0.08 Ω/cm</div>
                <div className="text-[10px] text-slate-400">4-wire Kelvin verified</div>
              </div>
            </div>

            {/* Formatted Code View */}
            <div className="relative">
              <pre className="w-full bg-[#050b10] border border-emerald-950/80 rounded-xl p-5 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[640px] overflow-y-auto selection:bg-emerald-900">
                {AQUAPONICS_GROWER_SPEC}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 5: MASTER PROJECT BRIEF */}
      {activeSubTab === 'master_brief' && (
        <div className="space-y-4">
          <div className="bg-[#091118] border border-blue-900/60 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <span>Master Project Brief (Production & Commissioning Master)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Universal specification document for lead engineers, agencies, fabricators, and freelancer teams.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  id="btn-copy-entire-master-brief"
                  onClick={handleCopyMasterBrief}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-900/90 hover:bg-blue-800 border border-blue-400/80 text-blue-100 text-xs font-mono font-bold transition-all shadow-md cursor-pointer"
                >
                  {copiedMasterBrief ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Entire Brief!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-300" />
                      <span>Copy Entire Brief</span>
                    </>
                  )}
                </button>
                <button
                  id="btn-download-master-brief-inner"
                  onClick={() => {
                    bioAudio.playPurificationChime();
                    downloadMasterProjectBrief();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download (.MD)</span>
                </button>
              </div>
            </div>

            {/* Formatted Master Brief Code View */}
            <div className="relative">
              <pre className="w-full bg-[#050b10] border border-blue-950/80 rounded-xl p-5 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[680px] overflow-y-auto selection:bg-blue-900">
                {MASTER_PROJECT_BRIEF}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
