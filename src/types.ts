export type ActiveTab = 'field' | 'drone' | 'anatomy' | 'sustenance' | 'comm' | 'blueprints' | 'brain';

export interface BlueprintCallout {
  id: string;
  label: string;
  partNumber: string;
  category: 'structural' | 'botanical' | 'electrical' | 'hydraulic' | 'sensory';
  x: number; // percentage in coordinate canvas
  y: number;
  tolerance: string;
  material: string;
  specification: string;
  operationalParam: string;
}

export interface BlueprintBOMItem {
  partNumber: string;
  name: string;
  system: 'Mold Scaffold' | 'Plant Genetics' | 'Root-Wire Conduits' | 'Power Plant' | 'Hydraulics' | 'Neural/Sensors';
  material: string;
  qty: string;
  tolerance: string;
  specification: string;
}

export interface BlueprintStep {
  stepNumber: number;
  phase: string;
  title: string;
  duration: string;
  environmentalControl: string;
  description: string;
  qualityStandard: string;
}

export interface BlueprintDrawing {
  id: string;
  drawingCode: string;
  revision: string;
  title: string;
  category: string;
  scale: string;
  sheetNumber: string;
  primaryDescription: string;
  engineeringNotes: string[];
  dimensions: {
    height?: string;
    width?: string;
    depth?: string;
    weight?: string;
    clearance?: string;
    wallThickness?: string;
    channelBore?: string;
    voltageRating?: string;
    currentCapacity?: string;
    pressureRating?: string;
  };
  callouts: BlueprintCallout[];
  bom: BlueprintBOMItem[];
  protocols: BlueprintStep[];
  formulas: {
    title: string;
    expression: string;
    explanation: string;
  }[];
}

export interface HeavyMetalProfile {
  symbol: string;
  name: string;
  accumulatedKg: number;
  maxCapacityKg: number;
  toxicityPpm: number;
  initialPpm: number;
  conductivityS_m: number; // electrical conductivity contribution
  color: string;
  crystallizationStatus: 'Liquid Sap' | 'Chelated Ion' | 'Solid Metallic Wire' | 'Pelletized Storage';
}

export interface MoldComponent {
  id: string;
  name: string;
  category: 'mold_scaffold' | 'root_wire' | 'biosensors' | 'mobility_hydraulics' | 'solar_foliage';
  botanicalBasis: string;
  cyberneticTech: string;
  humanoidMoldLocation: string;
  description: string;
  electricalResistanceOhms: number;
  status: 'Nominal' | 'Active' | 'Optimized' | 'Overclocked';
  coordinates: { x: number; y: number }; // percentage on anatomical map
}

export interface GridTile {
  x: number;
  y: number;
  initialToxicity: number; // 0 - 100
  currentToxicity: number;
  dominantMetal: string;
  remediated: boolean;
  vegetationStage: number; // 0: toxic barren, 1: pioneer moss, 2: blooming bio-flowers
  groundResistance: number;
}

export interface RemediationSectorPreset {
  id: string;
  name: string;
  hazardClass: string;
  location: string;
  initialAvgPpm: number;
  dominantMetals: string[];
  soilPh: number;
  sunLux: number;
  description: string;
}

export interface BioBotTelemetry {
  sunExposureLux: number; // 0 - 120,000
  soilRedoxPotentialMv: number; // e.g. 450 - 950 mV
  solarPowerGenW: number; // 0 - 650 W
  soilGalvanicPowerGenW: number; // 0 - 450 W
  totalPowerConsumptionW: number; // 180 - 420 W
  batteryStoredJoules: number;
  batteryMaxJoules: number;
  batteryPercentage: number;
  rootWireConductivitySm: number; // Siemens per meter
  rootDepthMeters: number;
  mobilityMode: 'Agile Bipedal Stride' | 'Deep Rooted Extraction' | 'High-Torque Sludge Crawl' | 'Phototropic Solar Stasis';
  speedKmH: number;
  coreTemperatureC: number;
  transpirationRateMlHr: number;
  totalLandRemediatedM2: number;
  totalMetalsExtractedKg: number;
  soilHealthIndex: number; // 0 - 100
}

export type DroneCameraMode = 'rgb' | 'hyperspectral_metals' | 'thermal_redox' | 'lidar_elevation' | 'ndvi_vegetation';
export type DroneFlightMode = 'Manual Remote' | 'Autonomous Orbit' | 'Grid Survey Scan' | 'Return to Dock';

export interface DroneTelemetry {
  isDocked: boolean;
  dockCradle: 'Thoracic Dorsal Mold Dock';
  altitudeMeters: number; // 0 (docked) to 150m
  speedKmH: number;
  batteryPercentage: number;
  chargeRateW: number; // positive when charging on dock
  dischargeRateW: number;
  linkQualityDb: number; // e.g. -42 dBm
  coordinates: { x: number; y: number }; // 0-11 x, 0-7 y in grid units
  cameraMode: DroneCameraMode;
  gimbalPitchDeg: number; // -90 (downward) to -10 (horizon)
  flightMode: DroneFlightMode;
  wingBeatHz: number; // 0 when docked, 38-48 Hz in flight
  scannedHotspotsCount: number;
  bioSporePayloadCount: number; // seeds/spores carried for aerial dispersion
  targetWaypoint: { x: number; y: number } | null;
}
