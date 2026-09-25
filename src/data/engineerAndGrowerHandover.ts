/**
 * READY-TO-COPY HANDOVER DOSSIERS FOR:
 * 1. THE ROBOTICS / MECHANICAL / HARDWARE ENGINEER
 * 2. THE AQUAPONICS / HYDROPONICS GROWER & BOTANIST
 *
 * Project: Ms. Heavy Metal Leaf (Autonomous Hyperaccumulator Bio-Bot)
 * Document Code: ML-SPEC-GLOBAL-2026
 */

export const ENGINEER_HANDOVER_SPEC = `# 🛠️ LEAD ROBOTICS & HARDWARE ENGINEER HANDOVER SPECIFICATION
## PROJECT: MS. HEAVY METAL LEAF — AUTONOMOUS HYPERACCUMULATOR BIO-BOT
**Document Version:** 4.4 (Production & Fabrication Handover)  
**System Classification:** Autonomous Botanical-Cybernetic Symbiote  
**Target Hardware Engineer Roles:** Mechanical, Robotics Kinematics, Embedded Firmware, Power Systems & PCB Engineers  

---

### 1. CORE ARCHITECTURAL DIRECTIVE
> **MANDATE FOR THE ENGINEERING TEAM:**  
> This robot is **NOT a conventional hollow plastic mannequin with wires**. She is a **living hyperaccumulator botanical organism** (*Alyssum bertolonii*, *Noccaea caerulescens*) grown inside an engineered 1:1 humanoid scaffold. Her roots uptake toxic metals (Nickel, Copper, Zinc, Cadmium) to mineralize cell walls into low-impedance electrical wiring (**0.08 Ω/cm target**). 
> All engineering tooling, chassis materials, hydraulic fluids, and thermal dissipation systems MUST be certified **non-phytotoxic** to preserve living plant tissue.

---

### 2. SUBSYSTEM SPECIFICATIONS

#### [A] 1:1 HUMANOID SPLIT MOLD & BIOREACTOR CHASSIS
- **Overall Dimensions:** 1780mm overall height; 440mm shoulder breadth; 920mm chest; 680mm waist; 940mm hips.
- **Chassis Structure:** 2-part split negative clamshell tooling (anterior and posterior halves) with 3° draft angle, 12mm conical alignment keys every 150mm, and peripheral clamping flanges.
- **Wall Thickness:** Uniform 8.5mm ± 0.5mm non-phytotoxic polyurethane tooling board or Shore A 40 platinum silicone jacket with carbon-reinforced outer mother mold.
- **Root Egress Channels:** 142 micro-perforated radial channels (Ø 1.5mm to 4.0mm) distributed along calves, shins, heels, and soles allowing living taproots to exit the chassis and anchor into contaminated soil.
- **Internal Bioreactor Core:** Thoracic aeroponic misting manifold fed by a central 14mm dorsal spine conduit with root guide channels branching to limbs.
- **Dorsal Drone Docking Cradle:** Recessed inter-scapular bay (180mm x 140mm x 55mm) positioned between T1 and T6 vertebrae with four N52 neodymium magnetic pockets and spring-loaded gold pogo charging contact pass-throughs.

#### [B] IN-MOLD GALVANOTROPIC NANO-CIRCUIT GUIDE TRELLIS
- **Micro-Groove Geometry:** Interior surface of the negative mold is precision CNC-machined or laser-etched with microfluidic guide channels (depth: 0.6mm, width: 1.2mm, trace pitch: 1.8mm).
- **Galvanotropic Root Steering Bias:** Micro-voltage bias pads (15–50 mV DC) embedded along the trace terminations create an electric potential gradient that steers growing root tips along predetermined circuit paths via biological galvanotropism.
- **Living Bio-PCB Formation:** As roots absorb chelated metal ions (Ni/Cu/Zn), metal precipitates into root cell walls, growing solid conductive traces in-situ with an electrical impedance ≤ 0.08 Ω/cm.

#### [C] DUAL OCULAR BIO-CAMERA EYES (HIGH-METAL QUANTUM-DOT RETINA)
- **Module Hardware:** Dual 4K Sony IMX577 micro-CMOS sensors (1/2.3" optical format, 1.55µm pixel pitch) coupled with f/1.8 sapphire optical domes.
- **Botanical Quantum-Dot Retina Interface:** Orbital skull cavities feature micro-growth wells where Cadmium Sulfide (CdS) and Zinc Selenide (ZnSe) semiconductor nanocrystals are biochemically precipitated into living root optic-fiber bundles, providing hyperspectral (380–1100 nm) vision across visible, NIR, and UV bands.
- **Interface Bus:** Dual 4-lane MIPI CSI-2 routed to the cranial neural processor.

#### [D] 32-NODE IN-MOLD ISFET & 64-LED SUB-DERMAL VEIN BUS
- **In-Mold ISFET Array:** 32 solid-state silicon nitride ISFET sensors mounted flush into the inner mold lining to monitor rhizosphere pH (5.0–8.5), free metal ion activity (Ni²⁺, Cu²⁺, Zn²⁺, Cd²⁺, Pb²⁺), and moisture saturation in real-time.
- **Analog Frontend:** 4x 8-channel precision trans-impedance amplifier ICs (input offset < 5 µV) communicating via an isolated CAN 2.0B bus.
- **Sub-Dermal Photonic Vein Array:** 64 addressable WS2812B-mini / APA102 micro-LED nodes embedded flush along limb vascular pathways and thoracic leaf ribs beneath translucent silicone skin:
  - *Emerald Green Pulse (525nm):* Active foliar photosynthesis & chlorophyll vitality.
  - *Cyan Wave (490nm):* Active heavy-metal ion root absorption.
  - *Amber Strobe (590nm):* High subsoil toxicity alert (> 5,000 ppm).
  - *Gold Glow (580nm):* Galvanic subsoil energy harvesting active.

#### [E] 8-AXIS HYDRAULIC KINEMATIC SKELETON
- **Internal Skeletal Truss:** 6061-T6 hard-anodized aluminum and 3K carbon-fiber tubular framework (Ø 25mm x 2.0mm wall thickness).
- **Joint Kinematics:**
  - *Hips:* 2-DOF spherical joints (95° flexion, 20° extension, 35° abduction).
  - *Knees:* 1-DOF planar hinges with hardened steel pivot pins and mechanical anti-hyperextension stops at 180° (flexion up to 135°).
  - *Ankles:* 2-DOF universal joints with Shore 75A elastomeric polyurethane recoil dampers.
- **Actuation:** 8 double-acting micro-hydraulic cylinders operating at 2.5–2.8 MPa (360–400 PSI) working pressure, delivering 1,350 N peak thrust per knee.
- **Hydraulic Pump:** 24V brushless DC micro-gear pump (whisper-quiet, closed-loop pressure control).
- **Working Fluid:** Biodegradable, plant-safe synthetic ester hydraulic fluid (zero phytotoxicity if an internal seal weeps).

#### [F] CRANIAL BRAIN & COMPUTING ARCHITECTURE
- **Primary RTOS MCU:** STM32F405RGT6 (168 MHz ARM Cortex-M4 with FPU) running FreeRTOS at 1000 Hz for hydraulic kinematic stabilization and balance PID loops.
- **Vision & Telemetry Coprocessor:** ESP32-S3 (Dual 240 MHz Xtensa LX7) handling 2.4 GHz Wi-Fi/BLE communication with the Aero-Spore drone and encrypted base station links.
- **Neuromorphic Edge AI Core:** ML-BRN-COR-01 for real-time multispectral toxic soil classification and autonomous gait state machine.
- **Communication Buses:** Dual CAN 2.0B buses (CAN1: Actuators & Hydraulics, CAN2: ISFET Sensor Trellis & Soil Electrodes), plus SPI for high-speed sensor acquisition.

#### [G] HYBRID POWER PLANT (SOLAR MPPT + GALVANIC SOIL REDOX)
- **Foliar Solar Array:** Quantum bio-perovskite chloroplast leaves harvesting ambient sunlight (120,000 Lux peak, generating up to 420W).
- **Subsoil Galvanic Redox Harvesting:** 4 Grade 5 Titanium (Ti-6Al-4V) needle electrodes deployed through soles into anaerobic contaminated sludge, collecting 450–950 mV open-circuit potential from microbial electron transfer.
- **Power Management PCB:** 4-layer FR4 board featuring:
  - Texas Instruments BQ25504 ultra-low-voltage boost harvester (starts from 20mV, steps 450mV up to 4.2V/24V buffer).
  - Synchronous Buck-Boost MPPT controller managing foliar solar inputs.
  - 48V / 24V DC main bus capable of 35A continuous and 60A transient peak actuator bursts.

#### [H] AERO-SPORE RECONNAISSANCE DRONE DOCKING
- **Drone Airframe:** 280mm diagonal motor span; unibody carbon-fiber / bio-chitin frame; 5-inch ducted low-noise propellers. AUW < 340g.
- **Sensory Payload:** 3-axis brushless micro-gimbal with 12MP multispectral camera (NIR 850nm, Red 660nm, Green 560nm) for real-time NDVI soil metal mapping.
- **Seed Dispersal:** 65g capacity rotating bio-spore carousel driven by micro-stepper motor, dispensing pelleted seeds over target hot spots.
- **Docking Interface:** 4 reverse-polarity N52 neodymium magnets mating with robot's dorsal cradle; 4 gold spring-loaded pogo pins supplying 24V @ 2.5A (60W) fast charging.

---

### 3. ELECTRICAL PINOUT & BUS ASSIGNMENTS

| Bus / Signal | Master MCU Pin | Target Hardware | Protocol / Logic Level |
|---|---|---|---|
| **CAN1_TX / RX** | PB9 / PB8 | 8x Hydraulic Valve Drivers & Micro-Pump | CAN 2.0B @ 1 Mbps |
| **CAN2_TX / RX** | PB13 / PB12 | 32-Node ISFET Trans-Impedance Frontends | CAN 2.0B @ 500 kbps |
| **SPI1_SCK/MISO/MOSI**| PA5 / PA6 / PA7 | 4-Wire Kelvin Root Impedance ADC | SPI @ 10 MHz, 3.3V |
| **I2C1_SDA / SCL** | PB7 / PB6 | BNO085 9-DOF IMU Kinematic Sensor | Fast I2C @ 400 kHz |
| **MIPI_CSI2_D0..D3** | Cranial Coprocessor | Dual 4K Ocular Camera Sensors | MIPI CSI-2 D-PHY |
| **PWM_PUMP** | PA0 (TIM2_CH1) | 24V Micro-Hydraulic Gear Pump | 25 kHz PWM, 0–100% Duty |
| **UART1_TX / RX** | PA9 / PA10 | ESP32-S3 Wireless Telemetry Link | UART @ 921,600 baud |
| **LED_DATA_OUT** | PA1 | 64x Sub-Dermal Photonic Vein LEDs | High-Speed 800 kHz NRZ |

---

### 4. FABRICATION CHECKLIST & TOLERANCE BUDGET
- [ ] CNC / 3D print split mold halves: ensure 3° draft angle, ±0.2mm tolerance, 12mm conical alignment pins.
- [ ] Laser-etch nano-circuit guide micro-grooves (0.6mm depth x 1.2mm width) on mold interior.
- [ ] Install 32 flush-mount ISFET sensor pockets and 64 micro-LED vein tracks.
- [ ] Pressure-test hydraulic circuit to 500 PSI static hold for 30 minutes with synthetic ester fluid.
- [ ] Assemble 6061-T6 skeleton; verify 135° knee flexion with mechanical stops.
- [ ] Flash FreeRTOS firmware to STM32F405 and verify 1000 Hz balance PID loop execution.
- [ ] Test Aero-Spore magnetic docking latching force (> 12 N retention) and 60W pogo pin charging continuity.
`;

export const AQUAPONICS_GROWER_SPEC = `# 🌱 AQUAPONICS, HYDROPONICS & BOTANY MASTER PROTOCOL
## PROJECT: MS. HEAVY METAL LEAF — AUTONOMOUS HYPERACCUMULATOR BIO-BOT
**Document Version:** 4.4 (Cultivation & Phytoremediation Master)  
**Target Specialist Roles:** Aquaponics Growers, Commercial Hydroponics Cultivators, Plant Biologists, Agronomists  
**Objective:** Culture living hyperaccumulator plants inside a 1:1 humanoid scaffold, steer roots along circuit micro-grooves, mineralize root cell walls into bio-conductive wiring (0.08 Ω/cm), and induce ocular quantum-dot biomineralization.

---

### 1. CERTIFIED BOTANICAL SPECIES & SOURCING DOSSIER

| Species Name | Common Name | Primary Target Metal | Bioaccumulation Capacity | Botanical Role in Bio-Bot | Sourcing Reference |
|---|---|---|---|---|---|
| ***Alyssum bertolonii*** | Italian Goldenthread | **Nickel (Ni)** | Up to 13,400 mg/kg dry wt | Main thoracic vascular trunk & bipedal root-wires | Serpentine flora seed banks, European botanical exchanges |
| ***Noccaea caerulescens*** | Alpine Pennycress | **Zinc (Zn) & Cadmium (Cd)** | Up to 30,000 mg/kg Zn; 1,500 mg/kg Cd | Femoral conduits & ocular quantum-dot synthesis | Calamine soil seed collections, USDA-ARS germplasm |
| ***Berkheya coddii*** | South African Thistle | **Nickel (Ni)** | Up to 38,000 mg/kg dry wt | Deep subsoil taproots (exiting foot pores) | South African botanical seed distributors |
| ***Pityrogramma calomelanos*** | Silver / Gold Fern | **Copper (Cu) & Arsenic (As)** | Up to 8,300 mg/kg Cu | Upper thoracic foliar canopy & shoulder foliage | Tropical fern spore suppliers, nursery tissue culture |

---

### 2. BIOREACTOR GROWTH SCAFFOLD & RESERVOIR DYNAMICS
- **Scaffold Geometry:** 1:1 humanoid scaffold (1780mm tall) acting as an internal aeroponic misting chamber and hydroponic root guide.
- **Root Egress System:** 142 radial egress pores (Ø 1.5mm to 4.0mm) concentrated in the lower limbs, shins, heels, and soles to allow living root anchors to deploy into subsoil.
- **Substrate Matrix:** Inert, non-phytotoxic calcined diatomaceous earth and perlite blend (70/30 ratio) impregnated with hydrophilic bio-agar along circuit guide tracks.
- **Reservoir Volume:** 12-liter recirculating reservoir located in the pelvic basin with a 24V silent micro-diaphragm aeroponic pump.
- **Misting Cycle:** 45 seconds ON / 4 minutes OFF during photoperiod (16h light); 30 seconds ON / 10 minutes OFF during scotoperiod (8h dark).

---

### 3. CHELATED HEAVY-METAL DOSING REGIME (45-DAY MINERALIZATION)
> **CRITICAL AGRONOMY PRINCIPLE:**  
> Metals MUST be introduced in **chelated form (EDTA or Citric Acid complexes)**. Direct raw metal salts at high concentration will cause acute phytotoxicity and root tip death. Gradual ramp-up allows the plant to synthesize phytochelatins and metallothioneins, safely depositing metal ions into root xylem cell walls.

#### Phase 1: Vegetative Establishment (Days 1 – 14)
- **Base Nutrients:** Half-strength Hoagland solution (EC: 1.0 – 1.2 mS/cm, pH: 6.0 – 6.2).
- **Metal Inoculation:** ZERO heavy metals. Focus strictly on root mass establishment and guide channel colonization.
- **Microbial Inoculation:** Inoculate root zone with *Glomus intraradices* (arbuscular mycorrhizal fungi, 100 spores/mL) to increase root absorptive surface area by 300%.

#### Phase 2: Trace Metal Priming (Days 15 – 28)
- **Base Nutrients:** Full-strength Hoagland solution (EC: 1.6 – 1.8 mS/cm, pH: 5.8 – 6.0).
- **Chelated Metal Additions:**
  - Nickel: 25 µM Ni-EDTA (approx. 1.47 mg/L Ni)
  - Copper: 15 µM Cu-Citrate (approx. 0.95 mg/L Cu)
  - Zinc: 50 µM Zn-EDTA (approx. 3.27 mg/L Zn)
- **Observation:** Verify healthy leaf turgor and active transpiration (target: 400–700 mL/hr).

#### Phase 3: High-Conductivity Mineralization (Days 29 – 45)
- **Base Nutrients:** Low-phosphorus nutrient solution (phosphorus precipitates metals; maintain P at ≤ 15 mg/L, pH: 5.6 – 5.9, EC: 2.2 – 2.6 mS/cm).
- **Chelated Metal Additions:**
  - Nickel: 150 µM Ni-EDTA (approx. 8.8 mg/L Ni)
  - Copper: 80 µM Cu-Citrate (approx. 5.1 mg/L Cu)
  - Zinc: 200 µM Zn-EDTA (approx. 13.1 mg/L Zn)
  - Cadmium (Trace for Ocular Retinas): 5 µM Cd-EDTA (approx. 0.56 mg/L Cd)
- **Target Metallization Endpoint:** Root cell wall dry weight metal concentration > 10,000 mg/kg. Target root electrical resistance ≤ 0.08 Ω/cm.

---

### 4. GALVANOTROPIC MICRO-VOLTAGE ROOT STEERING PROTOCOL
Living botanical root tips exhibit natural galvanotropism (directional growth guided by electric fields).
- **Steering Potential:** Apply a constant DC potential of **15 to 50 mV DC** between micro-electrodes placed along the mold's laser-etched guide tracks (0.6mm depth x 1.2mm width).
- **Cathode / Anode Placement:** The cathode (-) is placed at the intended circuit trace terminus; the anode (+) is placed at the seed germination well. Root tips naturally steer toward the cathode at a rate of 8–14 mm per day.
- **Trace Mineralization:** Once root tips traverse the track, metal chelate uptake deposits crystalline nickel-copper along the xylem walls, forming living insulated circuit conductors.

---

### 5. OCULAR HIGH-METAL QUANTUM-DOT BIOMINERALIZATION
- **Mechanism:** In the skull ocular sockets, controlled cadmium and zinc micro-droplets (CdCl₂ and ZnSO₄ at 20 µM in sodium citrate buffer) are delivered to localized root fiber tips.
- **Precipitation:** Biological sulfur reduction by rhizosphere microbes precipitates Cadmium Sulfide (CdS) and Zinc Selenide (ZnSe) semiconductor nanocrystals (quantum dots, 3–6 nm diameter).
- **Function:** These nanocrystals act as biological phototransistors, coupling directly to living root optic fibers and the dual 4K micro-CMOS cameras to enable multispectral imaging (380–1100 nm).

---

### 6. ENVIRONMENTAL MONITORING BENCHMARKS

| Parameter | Target Operational Range | Critical Alert Threshold | Corrective Action |
|---|---|---|---|
| **Root Zone pH** | 5.8 – 6.2 | < 5.2 or > 6.8 | Dose Potassium Hydroxide (KOH) or Citric Acid buffer |
| **Electrical Conductivity (EC)** | 1.8 – 2.4 mS/cm | > 3.0 mS/cm | Flush with 20% RO water reservoir volume |
| **Root Zone Temperature** | 20.0 – 24.5 °C | > 28.0 °C | Activate pelvic Peltier cooling manifold |
| **Dissolved Oxygen (DO)** | > 7.5 mg/L | < 5.0 mg/L | Increase aeroponic air stone aeration rate |
| **Photosynthetic Light (PPFD)**| 450 – 750 µmol/m²/s | < 250 µmol/m²/s | Increase overhead full-spectrum LED output |
| **Root Conduction Target** | ≤ 0.08 Ω/cm | > 0.40 Ω/cm | Extend Phase 3 chelated nickel dosing by 7 days |

---

### 7. STEP-BY-STEP CULTIVATION SCHEDULE
1. **Day 1–3:** Surface sterilize *Alyssum* and *Noccaea* seeds in 2% sodium hypochlorite for 8 minutes; rinse with sterile RO water.
2. **Day 4–7:** Germinate on 1% agar plates with 0.1x Hoagland solution under 16h photoperiod (120 µmol/m²/s PPFD).
3. **Day 8:** Transplant healthy germinants into thoracic bioreactor seed sockets in the humanoid chassis.
4. **Day 9–14:** Initiate 15–50 mV DC galvanotropic steering currents along limb guide channels.
5. **Day 15:** Begin Phase 2 trace metal priming (Ni-EDTA 25 µM, Cu-Citrate 15 µM).
6. **Day 29:** Begin Phase 3 high-conductivity mineralization; initiate ocular CdS quantum-dot feeding.
7. **Day 45:** Perform 4-wire Kelvin conductivity probe tests across root terminals; verify root resistance ≤ 0.08 Ω/cm.
8. **Day 46+:** System ready for field deployment: living roots deployed through foot pores into contaminated soil.
`;
