export const MASTER_PROJECT_BRIEF = `# MASTER PROJECT BRIEF: MS. HEAVY METAL LEAF
## Autonomous Botanical-Cybernetic Hyperaccumulator Bio-Bot & Aero-Spore Scout Drone
**Document Version:** 4.2 (Production & Commissioning Master)  
**Project Code:** ML-SPEC-GLOBAL-2026  
**Target Execution Platform:** Freelancer Squad (Fiverr / Upwork / In-House Lab)  

---

### 1. EXECUTIVE SUMMARY & ARCHITECTURAL FOUNDATION

"Ms. Heavy Metal Leaf" is a life-size autonomous botanical-cybernetic organism engineered for rapid in-situ environmental remediation of toxic heavy-metal wastelands (serpentine tailings, mining slag fields, industrial brownfields). 

> **CRITICAL ARCHITECTURAL MANDATE:**  
> Ms. Heavy Metal Leaf is **NOT a conventional plastic/metal robot disguised as a plant**. She is an **ACTUAL LIVING BOTANICAL HYPERACCUMULATOR ORGANISM** (*Alyssum bertolonii*, *Noccaea caerulescens*, *Berkheya coddii*, *Pityrogramma calomelanos*) grown and cultured directly inside a 1:1 humanoid mold scaffold. Her living root tissues uptake dissolved toxic metals (Nickel, Copper, Zinc, Cadmium, Lead) from contaminated soil and deposit them into root cell walls, naturally mineralizing her living roots into low-impedance bio-conductive electrical wiring (0.08 Ω/cm).

She is self-sustained indefinitely through dual autotrophic mechanisms:
1. **Foliar Photosynthesis:** Quantum bio-perovskite chloroplast leaves harvesting up to 120,000 Lux ambient sunlight.
2. **Subsoil Galvanic Redox Harvesting:** Deep titanium root electrodes harvesting 450 - 950 mV from anaerobic soil microbial electron transfer.

Mounted between her shoulder blades is an inter-scapular docking cradle housing **"Aero-Spore"**, an autonomous micro-reconnaissance quadcopter drone that charges from her living bio-electric bus, maps ground toxicity via multispectral imaging, and disperses hyperaccumulator seeds over contaminated soil.

---

### 2. PRIMARY SUBSYSTEM SPECIFICATIONS

#### System A: 1:1 Humanoid Botanical Bioreactor Mold & Bio-Polymer Shell
- **Physical Scale:** 1780mm overall standing height; 440mm shoulder breadth; 920mm chest; 680mm waist; 940mm hip breadth.
- **Bioreactor Function:** The humanoid chassis is an engineered hydroponic/aeroponic growth scaffold with an internal misting manifold to nurture living hyperaccumulator root bundles.
- **Root Egress System:** 142 micro-perforated channels (Ø 1.5mm – 4.0mm) distributed along the calves, shins, heels, and soles to allow living root taproots to exit the chassis and anchor into contaminated subsoil.
- **Tooling Geometry:** 2-part split negative clamshell mold (anterior and posterior halves) with 3° draft angles, 12mm conical alignment registration keys, and peripheral perimeter clamping flanges.
- **Material Requirements:** Certified non-phytotoxic, UV-stabilized polyurethane tooling board, platinum-cure silicone skin, or recyclable PLA/PETG matrix. Zero chemical leaching permitted.
- **Dorsal Drone Cradle:** Recessed bay (180mm x 140mm x 55mm) positioned between T1 and T6 vertebrae with four N52 neodymium magnetic pockets and spring-loaded pogo charging contact pass-throughs.

#### System B: Kinematic Skeletal Armature & Bipedal Actuators
- **Internal Skeleton:** Articulated tubular framework constructed from 6061-T6 hard-anodized aluminum and 3K carbon-fiber tubes (Ø 25mm x 2.0mm wall thickness).
- **Joint Kinematics:**
  - Hip Joints: 2-DOF spherical ball-and-socket assemblies allowing 95° flexion, 20° extension, 35° abduction.
  - Knee Joints: Single-axis planar hinge with hardened steel pivot pins and mechanical anti-hyperextension stops locking at 180° (flexion up to 135°).
  - Ankle Joints: 2-DOF universal joint with elastomeric polyurethane dampers (Shore 75A) simulating biological tendon recoil.
- **Actuation System:** 8x double-acting micro-hydraulic cylinders operating at 2.5 MPa (approx. 360–400 PSI) working pressure, driven by a quiet closed-loop 24V brushless micro-gear pump.

#### System C: Bio-Metallic Root-Wire Vascular Conduits & Galvanic Power Bus
- **Living Conductor Material:** Biological taproots of *Alyssum bertolonii* enriched with chelated Nickel/Copper ions until root cell-wall mineralization yields an electrical impedance ≤ 0.08 Ω/cm.
- **Spinal Conduits:** Central dorsal conduit (Ø 14mm) carrying root-wire bundles along the spinal axis directly to the pelvic power distribution junction.
- **Galvanic Subsoil Spikes:** 4x Grade 5 Titanium (Ti-6Al-4V) needle electrodes deployed through the soles of each foot into the soil to establish a galvanic redox cell producing 450 - 950 mV open-circuit potential.
- **DC-DC Step-Up Harvester:** Ultra-low-voltage boost circuit (Texas Instruments BQ25504 or equivalent) stepping 450mV soil potential up to a regulated 4.2V lithium-ion charging rail.

#### System D: Aero-Spore Autonomous Reconnaissance Drone
- **Airframe:** 280mm diagonal motor span; unibody carbon-fiber / bio-chitin composite frame; 5-inch ducted low-noise propellers. Total bare weight < 110g (AUW < 340g).
- **Sensory Payload:** 3-axis brushless micro-gimbal with a 12MP 4K multispectral camera (NIR 850nm, Red 660nm, Green 560nm) for real-time NDVI (Normalized Difference Vegetation Index) soil metal stress mapping.
- **Seed Dispersal Mechanism:** 65g capacity rotating bio-spore seed carousel driven by a miniature micro-stepper motor, dispensing pelleted *Alyssum* and *Noccaea* seeds over contaminated target zones.
- **Docking & Recharging Interface:** Four reverse-polarity N52 neodymium disc magnets (15mm x 3mm) that self-center into the robot's dorsal cradle, mating with 4x gold-plated spring-loaded pogo pins supplying 24V @ 2.5A (60W) fast charging.

#### System E: Computing Architecture, Sensor Bus & Solar MPPT Board
- **Processing Core:** Dual-processor master architecture:
  - Primary RTOS MCU: STM32F405RGT6 (168MHz ARM Cortex-M4) running real-time hydraulic PID loops and sensor bus acquisition.
  - Wireless & Vision Telemetry Coprocessor: ESP32-S3 (Dual 240MHz Xtensa) providing 2.4GHz Wi-Fi/BLE communication with the Aero-Spore drone and encrypted base station telemetry.
- **Power Management:** Custom 4-layer FR4 PCB (120 x 85 mm) featuring a high-efficiency Synchronous Buck-Boost MPPT controller managing foliar solar inputs up to 120,000 Lux and 24V 20A peak actuator bursts.
- **Sensory Bus:** 4-wire Kelvin conductivity probes monitoring living root metallization, analog soil-redox potentiostats, and an isolated CAN 2.0B bus.

#### System F: Plant Biology & Hyperaccumulator Cultivation Protocol
- **Target Botanical Species:**
  - Primary Nickel Accumulator: *Alyssum bertolonii* (accumulates up to 13,400 mg/kg Ni in dry matter).
  - Zinc & Cadmium Accumulator: *Noccaea caerulescens* (accumulates up to 30,000 mg/kg Zn).
  - Copper / Arsenic Fern: *Pityrogramma calomelanos* (gold fern adapted to copper mine tailings).
- **Nutrient Inoculation Regime:** Hydroponic nutrient protocol enriched with chelated metal complexes (e.g., 50–200 µM Ni-EDTA / Cu-Citrate) dosed incrementally over 45 days to maximize cell-wall electrical conductivity while maintaining active vascular sap transpiration.
- **Substrate Environment:** Calcined diatomaceous earth and perlite matrix maintained at pH 5.8 – 6.4 with symbiotic *Glomus intraradices* mycorrhizal fungi to enhance root surface area by 300%.

#### System G: In-Mold Embedded Nano-Sensors, Bio-PCB Guide Trellis & High-Metal Grown Camera Eyes
- **In-Mold Nano-Circuit Guide Trellis (Galvanotropic PCB Micro-Grooves):** The interior surface of the negative mold is laser-etched with sub-millimeter microfluidic channels (depth 0.6mm, width 1.2mm, trace pitch 1.8mm). Micro-voltage bias pads (15–50 mV DC) create galvanotropic electrical potential gradients that steer living hyperaccumulator root tips along exact circuit board traces. As the roots absorb heavy metals (Ni/Cu/Zn), metal ions precipitate into the root cell walls, physically growing living, low-impedance (0.08 Ω/cm) circuit boards in-situ.
- **Ocular Bio-Camera Eyes (High-Metal Quantum-Dot Photoreceptors):** The humanoid skull cavities house dual 4K micro-CMOS camera modules capped by sapphire lenses and connected to botanical growth wells. Controlled bio-accumulation of Cadmium and Zinc precipitates Cadmium-Sulfide (CdS) and Zinc-Selenide semiconductor nanocrystals (quantum dots). These biological phototransistors self-assemble directly into living root optic-fiber bundles, providing hyperspectral (380–1100 nm) vision across visible, NIR, and UV bands.
- **Sub-Dermal Micro-Photonic LED Vein Array:** 64x addressable micro-LED nodes embedded flush into the silicone mold lining along thoracic leaf ribs and limb vascular pathways. Driven by a constant-current controller, they emit real-time bioluminescent pulses (emerald = active photosynthesis, cyan = metal ion root uptake, amber = high soil toxicity warning, gold = galvanic harvesting).
- **32-Node In-Mold ISFET & Micro-Kelvin Sensor Array:** Solid-state silicon nitride ISFET probes and 4-wire platinum micro-probes positioned flush throughout the mold negative. Continuously monitors root metal saturation ppm, rhizosphere pH (5.0–8.5), and tissue conductivity in real-time over an isolated CAN/I2C sensor bus.

#### System H: Cranial Phyto-Neural Brain Core & Neuromorphic AI Engine
- **Bio-Cybernetic Cranial Brain Architecture:** Located in the recessed cranial cavity beneath the forehead and temporal sinuses. Combines a biological mycelial neuro-botanical matrix (hyperaccumulator root synapses cultured on conductive porous scaffold) with a dual 480 MHz ARM Cortex-M7 + Neuromorphic RISC-V Neural Core (ML-BRN-COR-01).
- **Multi-Modal Sensory Fusion:** Ingests live streams from dual 4K high-metal biomineralized quantum-dot cameras (MIPI CSI-2), 32-node in-mold ISFET chemical bus (CAN2), root-wire electrical impedance (4-wire Kelvin), foliar solar irradiance (Lux), and soil microbial galvanic redox (mV).
- **FreeRTOS Deterministic Control (1000 Hz):** Executes 8-axis hydraulic kinematics balancing loop at 1 ms intervals to stabilize bipedal gait across uneven mining slag and hazardous waste tailings.
- **Autonomous Cognitive Behavioral States:** 5 autonomous decision modes: Deep Rooted Extraction (anchored 400 PSI metal uptake), Phototropic Sun Stasis (foliar solar alignment), Agile Bipedal Stride (cross-country transit), Sludge Crawl (low-center-of-gravity mud crawl), and Aero-Recon (launches and commands Aero-Spore scout drone).
- **Embedded Production Firmware:** Complete open-source production codebase included: \`MsHeavyMetalLeaf_Brain_Firmware.cpp\`, \`phytoneural_brain_core.h\`, \`phyto_neural_decision_engine.py\`, and \`AeroSpore_Drone_Autopilot.cpp\`.

---

### 3. SQUAD COMMISSIONING MATRIX & BUDGET ESTIMATES

| # | Role & Discipline | Fiverr / Upwork Category | Target Software | Est. Budget | Turnaround |
|---|---|---|---|---|---|
| 1 | **3D CAD Mold & Tooling Designer** | 3D Modeling & Industrial Design | SolidWorks / Fusion 360 | $120 – $350 | 5–10 Days |
| 2 | **Robotics Kinematics Mechanical Engineer** | Mechanical Engineering & Robotics | SolidWorks / ANSYS | $150 – $450 | 7–14 Days |
| 3 | **PCB & Power Systems Hardware Engineer** | Electronics Engineering | KiCad / Altium Designer | $150 – $400 | 5–10 Days |
| 4 | **UAV Drone Aerospace & Airframe Designer** | Aerospace & Drone Design | SolidWorks / Betaflight | $90 – $220 | 4–7 Days |
| 5 | **Plant Biologist & Phytoremediation Agronomist**| Science & Agriculture Consulting | Formulation Protocols | $60 – $180 | 3–7 Days |
| 6 | **Physical Prop Sculptor / Animatronics Maker** | Prop Making & Sculpture | Silicone / Fiberglass | $300 – $900+ | 14–28 Days |

**Total Estimated Prototype Tooling Budget:** $870 – $2,500 USD (commercial freelancer commissioning).

> 💡 **ZERO-BUDGET & GRASSROOTS MAKER STRATEGY ($0 Out-of-Pocket Plan):**  
> If commercial freelancer funds are unavailable, Ms. Heavy Metal Leaf can be engineered and built for $0 upfront through the following high-leverage routes:
> 1. **University Capstone Sponsorships:** Submit this exact master brief to University Mechanical, Robotics, Bio-Engineering, and Botany departments. Capstone teams receive academic credit and university lab budgets ($2,000–$10,000 departmental grants) to fabricate the mold, program the MCUs, and culture the hyperaccumulator plants.
> 2. **Local Makerspaces & FabLabs:** Utilize community 3D printers, CNC routers, laser cutters, and electronics lab equipment (often free or low monthly membership with work-trade options).
> 3. **Environmental Non-Profit & Phytoremediation Grants:** Apply for EPA, National Geographic, or clean-tech environmental innovation grants focused on mine-tailing reclamation and bio-robotics.
> 4. **Crowdfunding Campaign (Kickstarter / Experiment.com):** Launch a public science and bio-art campaign using the 3D drawings, blueprint sheets, and vision video to pre-fund prototyping.

---

### 4. PHASED IMPLEMENTATION ROADMAP

- **PHASE 1: Digital Engineering & Tooling Generation (Days 1–14)**
  - Commission Role #1 (3D CAD Mold Designer) to model the 1780mm split negative mold, in-mold nano-circuit guide micro-grooves, ocular camera eye sockets, sensor/LED channels, drone docking cradle, and 142 root egress channels. Output: STEP & 3D-printable STL files.
  - Commission Role #5 (Plant Biologist) to deliver the hydroponic chelated heavy-metal nutrient schedule, seed sourcing list, galvanotropic root steering parameters, and quantum-dot ocular biomineralization guide.

- **PHASE 2: Electronics & Drone Prototyping (Days 10–25)**
  - Commission Role #3 (PCB Engineer) to design the 4-layer master MPPT/sensor motherboard, dual MIPI vision interface for high-metal camera eyes, 32-node ISFET analog frontend, and 64-channel photonic vein driver. Generate JLCPCB manufacturing Gerbers.
  - Commission Role #4 (Drone Designer) to create the 280mm Aero-Spore drone frame and magnetic docking base.

- **PHASE 3: Physical Fabrication & Chassis Casting (Days 20–45)**
  - 3D print or CNC route the mold halves; embed the 32 ISFET sensors, 64 photonic micro-LEDs, and ocular camera sockets into the mold negative.
  - Cast the outer humanoid shell in non-phytotoxic silicone or fiberglass with laser-etched galvanotropic root circuit guide micro-grooves.
  - Assemble the 6061-T6 aluminum skeleton and install the hydraulic actuators.

- **PHASE 4: Biological Inoculation & Root Circuit Growth (Days 45–90)**
  - Plant germinated *Alyssum bertolonii* / *Noccaea caerulescens* seedlings in the thoracic bioreactor core.
  - Apply 15–50 mV DC galvanotropic steering currents along the mold nano-grooves to guide root tips into exact circuit board pathways.
  - Initiate the 45-day chelated metal nutrient feeding protocol (Ni/Cu/Zn/Cd) to achieve 0.08 Ω/cm root cell-wall metallization and induce quantum-dot photoreceptor deposition in the ocular camera cavities.

- **PHASE 5: Full Systems Integration & Field Testing (Days 90–105)**
  - Mate the Aero-Spore drone with the dorsal cradle; verify magnetic latching, 60W pogo contact charging, and telemetry link.
  - Power up sub-dermal photonic vein indicators and verify live ISFET metal-ion telemetry.
  - Conduct autonomous field deployment in contaminated serpentine soil test bed.

---

*Prepared by Ms. Heavy Metal Leaf Systems Engineering Group. Document Code: ML-SPEC-GLOBAL-2026.*
`;
