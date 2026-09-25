export interface FirmwareSourceFile {
  id: string;
  filename: string;
  language: 'cpp' | 'python' | 'c';
  title: string;
  description: string;
  linesCount: number;
  code: string;
}

export const BRAIN_FIRMWARE_FILES: FirmwareSourceFile[] = [
  {
    id: 'brain-firmware-cpp',
    filename: 'MsHeavyMetalLeaf_Brain_Firmware.cpp',
    language: 'cpp',
    title: 'Primary Phyto-Neural Brain Firmware (FreeRTOS / C++)',
    description: 'Master real-time operating system executing on the cranial dual ARM Cortex-M7 + Neuromorphic SoC. Coordinates 32 ISFET sensors, root galvanotropism, bipedal hydraulics balance, and sensory fusion.',
    linesCount: 380,
    code: `/**
 * ==============================================================================
 * PROJECT: MS. HEAVY METAL LEAF - AUTONOMOUS BIO-CYBERNETIC ROBOT
 * SUBSYSTEM: CRANIAL PHYTO-NEURAL BRAIN CORE & AUTONOMOUS ENGINE
 * FILE: MsHeavyMetalLeaf_Brain_Firmware.cpp
 * TARGET HARDWARE: STM32H743ZI / Dual ARM Cortex-M7 (480 MHz) + Neuromorphic NPU
 * RTOS: FreeRTOS v10.4.6 with Deterministic 1ms Control Ticks
 * ==============================================================================
 * (C) 2026 Ms. Heavy Metal Leaf Open Bio-Robotics Project. Open Source (MIT/GPLv3).
 */

#include "phytoneural_brain_core.h"
#include <FreeRTOS.h>
#include <task.h>
#include <queue.h>
#include <semphr.h>
#include <math.h>
#include <string.h>

// ==============================================================================
// GLOBAL HARDWARE HANDLES & BUFFERS
// ==============================================================================
static CAN_HandleTypeDef hcan1;              // Motor & Hydraulic Actuator Bus
static CAN_HandleTypeDef hcan2;              // 32-Node In-Mold ISFET Sensor Bus
static SPI_HandleTypeDef hspi1;              // Neuromorphic Synaptic Co-Processor
static I2C_HandleTypeDef hi2c1;              // Sub-dermal 64-LED Photonic Driver
static UART_HandleTypeDef huart2;            // ESP32-S3 Drone Telemetry Uplink
static ADC_HandleTypeDef hadc1;              // Cranial Bio-Potential Analog Frontend

// FreeRTOS Task Handles
static TaskHandle_t xTaskBrainCognitionHandle = NULL;
static TaskHandle_t xTaskSensorFusionHandle = NULL;
static TaskHandle_t xTaskHydraulicBalanceHandle = NULL;
static TaskHandle_t xTaskGalvanoRootTrellisHandle = NULL;
static TaskHandle_t xTaskPhotonicTelemetryHandle = NULL;

// RTOS Queues and Mutexes
static QueueHandle_t xSensorQueue = NULL;
static QueueHandle_t xCognitiveCommandQueue = NULL;
static SemaphoreHandle_t xTelemetryMutex = NULL;

// System Global State Container
static PhytoBrainState_t g_BrainState;
static BioBotTelemetryPacket_t g_Telemetry;

// ==============================================================================
// PID CONTROLLER CONSTANTS FOR BIPEDAL HYDRAULIC BALANCE (400 PSI)
// ==============================================================================
#define HYD_KP 2.45f
#define HYD_KI 0.08f
#define HYD_KD 0.62f
#define MAX_VALVE_DUTY 1000
#define SYSTEM_PRESSURE_SETPOINT_PSI 400.0f

static float g_pitch_integral = 0.0f;
static float g_roll_integral = 0.0f;
static float g_last_pitch_err = 0.0f;
static float g_last_roll_err = 0.0f;

// ==============================================================================
// TASK 1: PHYTO-NEURAL COGNITION & AUTONOMOUS DECISION ENGINE
// Runs at 50 Hz (20ms tick). Evaluates environmental hazard, soil chemistry,
// and directs the bio-bot's autonomous operating states.
// ==============================================================================
void vTaskBrainCognition(void *pvParameters) {
    TickType_t xLastWakeTime = xTaskGetTickCount();
    const TickType_t xFrequency = pdMS_TO_TICKS(20); // 50 Hz

    for (;;) {
        // Step 1: Ingest fused sensor packet from sensor fusion task
        SensorFusionData_t sensor_data;
        if (xQueueReceive(xSensorQueue, &sensor_data, pdMS_TO_TICKS(10)) == pdTRUE) {
            
            // Step 2: Compute Phytoneural Biopotential Index (Bio-wave alpha/theta)
            float bio_potential_uv = ReadCranialMyceliumBiopotential();
            g_BrainState.synaptic_firing_hz = 12.5f + (sensor_data.avg_root_conductivity_sm * 8.4f);
            
            // Step 3: Autonomous Behavioral State Machine
            switch (g_BrainState.cognitive_mode) {
                case COGNITIVE_MODE_DEEP_EXTRACTION:
                    // When anchored, maximize root pumping and metal chelation
                    SetHydraulicPressure(380.0f);
                    EnableRootGalvanotropicSteering(true, 42.0f); // 42mV steering
                    SetPhotonicVeinPulse(COLOR_CYAN, PULSE_STEADY);
                    if (sensor_data.soil_toxicity_ppm < 500.0f) {
                        // Sector clean, transition to walking
                        g_BrainState.cognitive_mode = COGNITIVE_MODE_AGILE_STRIDE;
                    }
                    break;

                case COGNITIVE_MODE_PHOTOTROPIC_SUN_CHARGE:
                    // Foliar crown solar tracking
                    SetFoliarCanopyAngle(sensor_data.sun_azimuth_deg, sensor_data.sun_elevation_deg);
                    SetPhotonicVeinPulse(COLOR_EMERALD, PULSE_BREATHING);
                    if (g_Telemetry.battery_pct > 95.0f && sensor_data.soil_toxicity_ppm > 2000.0f) {
                        g_BrainState.cognitive_mode = COGNITIVE_MODE_DEEP_EXTRACTION;
                    }
                    break;

                case COGNITIVE_MODE_AGILE_STRIDE:
                    // Bipedal navigation across contaminated terrain
                    SetPhotonicVeinPulse(COLOR_EMERALD, PULSE_FLOWING);
                    if (sensor_data.soil_toxicity_ppm > 4500.0f) {
                        // High contamination hotspot detected! Anchor immediately
                        g_BrainState.cognitive_mode = COGNITIVE_MODE_DEEP_EXTRACTION;
                    }
                    break;

                case COGNITIVE_MODE_SLUDGE_CRAWL:
                    // Lower center of gravity for viscous mine tailings
                    SetHydraulicPressure(420.0f);
                    SetPhotonicVeinPulse(COLOR_AMBER, PULSE_RAPID);
                    break;

                case COGNITIVE_MODE_AERO_RECON:
                    // Coordinating with docked Aero-Spore drone
                    if (g_BrainState.drone_docked) {
                        DeployAeroSporeDrone();
                    }
                    break;

                default:
                    g_BrainState.cognitive_mode = COGNITIVE_MODE_AGILE_STRIDE;
                    break;
            }

            // Step 4: Neuromorphic Synaptic Core Weight Adjustment
            UpdateNeuromorphicSynapses(sensor_data.metal_ppm_nickel, 
                                      sensor_data.metal_ppm_copper,
                                      sensor_data.root_impedance_ohm);
        }

        vTaskDelayUntil(&xLastWakeTime, xFrequency);
    }
}

// ==============================================================================
// TASK 2: SENSOR FUSION & 32-CHANNEL IN-MOLD ISFET SAMPLING
// Samples 32 ISFET solid-state nodes + 4-wire Kelvin root channels at 100 Hz.
// ==============================================================================
void vTaskSensorFusion(void *pvParameters) {
    TickType_t xLastWakeTime = xTaskGetTickCount();
    const TickType_t xFrequency = pdMS_TO_TICKS(10); // 100 Hz

    for (;;) {
        SensorFusionData_t fused;
        memset(&fused, 0, sizeof(SensorFusionData_t));

        // Read 32 in-mold ISFET chips across anterior and posterior mold
        float total_ni = 0.0f, total_cu = 0.0f, total_ph = 0.0f;
        for (uint8_t ch = 0; ch < 32; ch++) {
            ISFET_Reading_t node = ReadISFET_Node(ch);
            total_ni += node.nickel_ppm;
            total_cu += node.copper_ppm;
            total_ph += node.rhizosphere_ph;
        }
        fused.metal_ppm_nickel = total_ni / 32.0f;
        fused.metal_ppm_copper = total_cu / 32.0f;
        fused.avg_rhizosphere_ph = total_ph / 32.0f;

        // Read 4-wire Kelvin root-wire electrical impedance
        fused.root_impedance_ohm = ReadRootKelvinImpedance();
        fused.avg_root_conductivity_sm = 1.0f / (fused.root_impedance_ohm * 0.01f + 0.001f);

        // Read Ocular Bio-Camera low-latency multispectral telemetry
        fused.optical_ndvi_index = ReadOcularNDVI();
        fused.sun_azimuth_deg = ReadOcularSunAzimuth();

        // Push to Cognition Queue
        xQueueOverwrite(xSensorQueue, &fused);

        // Update shared telemetry safely
        if (xSemaphoreTake(xTelemetryMutex, pdMS_TO_TICKS(2)) == pdTRUE) {
            g_Telemetry.root_wire_conductivity_sm = fused.avg_root_conductivity_sm;
            g_Telemetry.soil_ph = fused.avg_rhizosphere_ph;
            g_Telemetry.total_metal_extracted_kg += (fused.metal_ppm_nickel * 0.000001f);
            xSemaphoreGive(xTelemetryMutex);
        }

        vTaskDelayUntil(&xLastWakeTime, xFrequency);
    }
}

// ==============================================================================
// TASK 3: BIPEDAL HYDRAULIC BALANCE & KINEMATICS (1000 Hz / 1ms Loop)
// Controls 8 hydraulic cylinders (400 PSI) with sub-millisecond precision.
// ==============================================================================
void vTaskHydraulicBalance(void *pvParameters) {
    TickType_t xLastWakeTime = xTaskGetTickCount();
    const TickType_t xFrequency = pdMS_TO_TICKS(1); // 1 kHz deterministic

    for (;;) {
        // Read Cranial 6-DOF IMU (Pitch, Roll, Yaw)
        IMU_Data_t imu = ReadCranialIMU();

        // Pitch PID calculation
        float pitch_err = 0.0f - imu.pitch_deg;
        g_pitch_integral += pitch_err * 0.001f;
        float pitch_derivative = (pitch_err - g_last_pitch_err) / 0.001f;
        g_last_pitch_err = pitch_err;
        float pitch_output = (HYD_KP * pitch_err) + (HYD_KI * g_pitch_integral) + (HYD_KD * pitch_derivative);

        // Roll PID calculation
        float roll_err = 0.0f - imu.roll_deg;
        g_roll_integral += roll_err * 0.001f;
        float roll_derivative = (roll_err - g_last_roll_err) / 0.001f;
        g_last_roll_err = roll_err;
        float roll_output = (HYD_KP * roll_err) + (HYD_KI * g_roll_integral) + (HYD_KD * roll_derivative);

        // Dispatch PWM commands to 8 hydraulic high-speed servo valves over CAN1
        CAN_TxHeaderTypeDef tx_hdr;
        tx_hdr.StdId = CAN_ID_HYDRAULIC_VALVES;
        tx_hdr.RTR = CAN_RTR_DATA;
        tx_hdr.IDE = CAN_ID_STD;
        tx_hdr.DLC = 8;

        uint8_t payload[8];
        int16_t left_hip_cmd  = (int16_t)(pitch_output + roll_output);
        int16_t right_hip_cmd = (int16_t)(pitch_output - roll_output);
        int16_t left_knee_cmd = (int16_t)(-pitch_output * 0.8f);
        int16_t right_knee_cmd= (int16_t)(-pitch_output * 0.8f);

        memcpy(&payload[0], &left_hip_cmd, 2);
        memcpy(&payload[2], &right_hip_cmd, 2);
        memcpy(&payload[4], &left_knee_cmd, 2);
        memcpy(&payload[6], &right_knee_cmd, 2);

        uint32_t tx_mailbox;
        HAL_CAN_AddTxMessage(&hcan1, &tx_hdr, payload, &tx_mailbox);

        vTaskDelayUntil(&xLastWakeTime, xFrequency);
    }
}

// ==============================================================================
// TASK 4: GALVANOTROPIC ROOT GUIDANCE & CIRCUIT GROWER (10 Hz)
// Generates 15–50mV micro-voltage currents along mold nano-grooves to steer
// living roots to physically grow into custom circuit traces.
// ==============================================================================
void vTaskGalvanoRootTrellis(void *pvParameters) {
    TickType_t xLastWakeTime = xTaskGetTickCount();
    const TickType_t xFrequency = pdMS_TO_TICKS(100); // 10 Hz

    for (;;) {
        if (g_BrainState.galvano_steering_enabled) {
            float target_mv = g_BrainState.galvano_potential_mv; // 15 - 50 mV
            
            // Set 8-channel micro-DAC steering voltage
            SetMoldNanoGrooveVoltage(CHANNEL_THORACIC_BUS, target_mv);
            SetMoldNanoGrooveVoltage(CHANNEL_PELVIC_TRACES, target_mv * 1.1f);
            SetMoldNanoGrooveVoltage(CHANNEL_FEMORAL_WIRES, target_mv * 0.95f);
            SetMoldNanoGrooveVoltage(CHANNEL_OCULAR_RETINA, target_mv * 0.80f);
        }

        vTaskDelayUntil(&xLastWakeTime, xFrequency);
    }
}

// ==============================================================================
// TASK 5: SUB-DERMAL PHOTONIC VEIN LIGHTING & TELEMETRY (20 Hz)
// Drives 64 addressable RGBW micro-LEDs embedded in the humanoid mold shell.
// ==============================================================================
void vTaskPhotonicTelemetry(void *pvParameters) {
    TickType_t xLastWakeTime = xTaskGetTickCount();
    const TickType_t xFrequency = pdMS_TO_TICKS(50); // 20 Hz
    uint8_t anim_step = 0;

    for (;;) {
        anim_step = (anim_step + 1) % 64;
        
        // Drive 64 sub-dermal LEDs via I2C constant current driver
        for (uint8_t i = 0; i < 64; i++) {
            uint8_t brightness = (uint8_t)(128 + 127 * sinf((anim_step + i * 4) * 0.1f));
            SetSubDermalLED(i, g_BrainState.current_vein_color, brightness);
        }

        vTaskDelayUntil(&xLastWakeTime, xFrequency);
    }
}

// ==============================================================================
// MAIN SYSTEM INITIALIZATION ENTRY POINT
// ==============================================================================
int main(void) {
    // 1. Initialize Microcontroller Clocks to 480 MHz
    SystemClock_Config_480MHz();

    // 2. Initialize Peripherals
    MX_GPIO_Init();
    MX_CAN1_Init(); // Motor/Hydraulics
    MX_CAN2_Init(); // In-Mold ISFET Sensor Bus
    MX_SPI1_Init(); // Neuromorphic Synaptic Core
    MX_I2C1_Init(); // Photonic LED Driver
    MX_USART2_Init(); // ESP32 Telemetry Link
    MX_ADC1_Init(); // Bio-wave Analog Frontend

    // 3. Initialize RTOS Primitives
    xSensorQueue = xQueueCreate(1, sizeof(SensorFusionData_t));
    xCognitiveCommandQueue = xQueueCreate(16, sizeof(CognitiveCmd_t));
    xTelemetryMutex = xSemaphoreCreateMutex();

    // 4. Set Initial Brain Cognitive State
    g_BrainState.cognitive_mode = COGNITIVE_MODE_AGILE_STRIDE;
    g_BrainState.galvano_steering_enabled = true;
    g_BrainState.galvano_potential_mv = 35.0f; // 35mV initial root steering
    g_BrainState.current_vein_color = COLOR_EMERALD;
    g_BrainState.drone_docked = true;

    // 5. Spawn Real-Time Tasks
    xTaskCreate(vTaskHydraulicBalance,    "HydBalance",  512, NULL, configMAX_PRIORITIES - 1, &xTaskHydraulicBalanceHandle);
    xTaskCreate(vTaskSensorFusion,       "SensFusion",  512, NULL, configMAX_PRIORITIES - 2, &xTaskSensorFusionHandle);
    xTaskCreate(vTaskBrainCognition,     "BrainCog",    1024, NULL, configMAX_PRIORITIES - 3, &xTaskBrainCognitionHandle);
    xTaskCreate(vTaskGalvanoRootTrellis, "GalvanoTrell", 256, NULL, tskIDLE_PRIORITY + 2,     &xTaskGalvanoRootTrellisHandle);
    xTaskCreate(vTaskPhotonicTelemetry,  "PhotonicVein", 256, NULL, tskIDLE_PRIORITY + 1,     &xTaskPhotonicTelemetryHandle);

    // 6. Start FreeRTOS Scheduler (Never Returns)
    vTaskStartScheduler();

    for (;;) {
        // Trap if scheduler fails
    }
    return 0;
}
`,
  },
  {
    id: 'phytoneural-brain-core-h',
    filename: 'phytoneural_brain_core.h',
    language: 'c',
    title: 'Phyto-Neural Brain Header & Register Map (C/C++)',
    description: 'Defines memory registers, CAN identifiers, struct layouts, sensory fusion packet formats, and galvanic root steering constants for the bio-bot.',
    linesCount: 260,
    code: `/**
 * ==============================================================================
 * PROJECT: MS. HEAVY METAL LEAF - AUTONOMOUS BIO-CYBERNETIC ROBOT
 * SUBSYSTEM: CRANIAL PHYTO-NEURAL BRAIN CORE
 * FILE: phytoneural_brain_core.h
 * ==============================================================================
 */

#ifndef PHYTONEURAL_BRAIN_CORE_H
#define PHYTONEURAL_BRAIN_CORE_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// ==============================================================================
// CAN BUS ARBITRATION IDENTIFIERS
// ==============================================================================
#define CAN_ID_HYDRAULIC_VALVES      0x101   // 8-Channel Hydraulic Actuators (400 PSI)
#define CAN_ID_ISFET_SENSOR_CLUSTER  0x204   // 32 In-Mold Chemical Sensors
#define CAN_ID_GALVANIC_MPPT_STATUS  0x308   // Solar & Soil Redox Energy Harvest
#define CAN_ID_AERO_SPORE_DOCK_CMD   0x410   // Aero-Spore Drone Latch & Charging
#define CAN_ID_PHOTONIC_VEIN_CMD     0x520   // 64 Sub-dermal Status LEDs

// ==============================================================================
// COGNITIVE OPERATING MODES
// ==============================================================================
typedef enum {
    COGNITIVE_MODE_DEEP_EXTRACTION       = 0x01, // Root spikes anchored, high-metal uptake
    COGNITIVE_MODE_PHOTOTROPIC_SUN_CHARGE= 0x02, // Foliar leaves orient to max lux
    COGNITIVE_MODE_AGILE_STRIDE          = 0x03, // Standard bipedal walking
    COGNITIVE_MODE_SLUDGE_CRAWL          = 0x04, // Low center-of-gravity mud crawl
    COGNITIVE_MODE_AERO_RECON            = 0x05, // Drone airborne, multispectral mapping
    COGNITIVE_MODE_EMERGENCY_STASIS      = 0xFF  // Low power, hibernate in soil
} CognitiveMode_t;

// ==============================================================================
// PHOTONIC VEIN COLOR PALETTES
// ==============================================================================
typedef enum {
    COLOR_EMERALD = 0x01, // Active Photosynthesis
    COLOR_CYAN    = 0x02, // Heavy Metal Root Uptake
    COLOR_AMBER   = 0x03, // High Toxicity / Acid Sludge Warning
    COLOR_GOLD    = 0x04, // Galvanic Soil Redox Harvesting
    COLOR_MAGENTA = 0x05  // Drone Docked & Data Sync
} VeinColor_t;

typedef enum {
    PULSE_STEADY,
    PULSE_BREATHING,
    PULSE_FLOWING,
    PULSE_RAPID
} VeinPulseMode_t;

// ==============================================================================
// HARDWARE CHANNELS FOR GALVANOTROPIC ROOT STEERING (15 - 50 mV)
// ==============================================================================
typedef enum {
    CHANNEL_THORACIC_BUS = 0,
    CHANNEL_PELVIC_TRACES,
    CHANNEL_FEMORAL_WIRES,
    CHANNEL_OCULAR_RETINA
} GalvanoChannel_t;

// ==============================================================================
// DATA STRUCTURES
// ==============================================================================
typedef struct {
    float nickel_ppm;
    float copper_ppm;
    float zinc_ppm;
    float cadmium_ppm;
    float rhizosphere_ph;
    float temperature_c;
} ISFET_Reading_t;

typedef struct {
    float pitch_deg;
    float roll_deg;
    float yaw_deg;
    float gyro_x_dps;
    float gyro_y_dps;
    float gyro_z_dps;
} IMU_Data_t;

typedef struct {
    float metal_ppm_nickel;
    float metal_ppm_copper;
    float avg_rhizosphere_ph;
    float root_impedance_ohm;
    float avg_root_conductivity_sm;
    float optical_ndvi_index;
    float sun_azimuth_deg;
    float sun_elevation_deg;
    float soil_toxicity_ppm;
} SensorFusionData_t;

typedef struct {
    CognitiveMode_t cognitive_mode;
    float synaptic_firing_hz;
    bool galvano_steering_enabled;
    float galvano_potential_mv;
    VeinColor_t current_vein_color;
    bool drone_docked;
} PhytoBrainState_t;

typedef struct {
    float sun_exposure_lux;
    float soil_redox_mv;
    float solar_power_w;
    float soil_galvanic_power_w;
    float battery_pct;
    float root_wire_conductivity_sm;
    float total_metal_extracted_kg;
    float soil_ph;
    uint32_t uptime_seconds;
} BioBotTelemetryPacket_t;

typedef struct {
    uint8_t command_id;
    float param1;
    float param2;
} CognitiveCmd_t;

// ==============================================================================
// LOW-LEVEL HARDWARE DRIVER PROTOTYPES
// ==============================================================================
float ReadCranialMyceliumBiopotential(void);
ISFET_Reading_t ReadISFET_Node(uint8_t node_index);
float ReadRootKelvinImpedance(void);
float ReadOcularNDVI(void);
float ReadOcularSunAzimuth(void);
IMU_Data_t ReadCranialIMU(void);
void SetHydraulicPressure(float target_psi);
void SetFoliarCanopyAngle(float azimuth_deg, float elevation_deg);
void EnableRootGalvanotropicSteering(bool enable, float millivolts);
void SetMoldNanoGrooveVoltage(GalvanoChannel_t channel, float mv);
void SetPhotonicVeinPulse(VeinColor_t color, VeinPulseMode_t mode);
void SetSubDermalLED(uint8_t led_index, VeinColor_t color, uint8_t brightness);
void DeployAeroSporeDrone(void);
void UpdateNeuromorphicSynapses(float ni_ppm, float cu_ppm, float root_ohms);
void SystemClock_Config_480MHz(void);
void MX_GPIO_Init(void);
void MX_CAN1_Init(void);
void MX_CAN2_Init(void);
void MX_SPI1_Init(void);
void MX_I2C1_Init(void);
void MX_USART2_Init(void);
void MX_ADC1_Init(void);

#ifdef __cplusplus
}
#endif

#endif // PHYTONEURAL_BRAIN_CORE_H
`,
  },
  {
    id: 'phyto-neural-decision-py',
    filename: 'phyto_neural_decision_engine.py',
    language: 'python',
    title: 'Neuromorphic AI Decision Model & Pathfinding (Python)',
    description: 'Edge Python AI model running on the Neuromorphic coprocessor. Implements reinforcement learning for optimal soil remediation pathing, drone NDVI map ingestion, and natural language communication.',
    linesCount: 310,
    code: `"""
==============================================================================
PROJECT: MS. HEAVY METAL LEAF - AUTONOMOUS BIO-CYBERNETIC ROBOT
SUBSYSTEM: NEUROMORPHIC EDGE AI DECISION & REMEDIATION ENGINE
FILE: phyto_neural_decision_engine.py
FRAMEWORK: PyTorch / TFLite Edge Neuromorphic Model + Google Gemini Bridge
==============================================================================
"""

import math
import time
import json
from dataclasses import dataclass
from typing import List, Tuple, Dict, Optional

# ==============================================================================
# CONFIGURATION & HYPERPARAMETERS
# ==============================================================================
GRID_WIDTH = 12
GRID_HEIGHT = 8
MAX_BATTERY_JOULES = 8_000_000
NOMINAL_POWER_CONSUMPTION_W = 240.0
TARGET_ROOT_IMPEDANCE_OHM_PER_CM = 0.08

@dataclass
class SoilHotspot:
    x: int
    y: int
    metal_symbol: str
    concentration_ppm: float
    toxicity_level: float
    remediated: bool = False

@dataclass
class PhytoBrainTelemetry:
    sun_exposure_lux: float
    soil_redox_mv: float
    solar_gen_w: float
    galvanic_gen_w: float
    battery_pct: float
    root_conductivity_sm: float
    mobility_mode: str
    drone_docked: bool
    total_metals_extracted_kg: float

class PhytoNeuralSynapticNet:
    """
    Neuromorphic spiking neural model simulating living mycelial-root
    synapses combined with high-metal quantum-dot biomineralized inputs.
    """
    def __init__(self, input_dim: int = 16, hidden_dim: int = 32, output_dim: int = 6):
        self.input_dim = input_dim
        self.hidden_dim = hidden_dim
        self.output_dim = output_dim
        
        # Synaptic weights initialized to biological resting potentials
        self.synaptic_weights = [[0.15 for _ in range(hidden_dim)] for _ in range(input_dim)]
        self.membrane_potentials = [0.0 for _ in range(hidden_dim)]
        self.refractory_period_ms = 2.0
        self.last_spike_time = [0.0 for _ in range(hidden_dim)]

    def forward(self, sensor_vector: List[float]) -> List[float]:
        """
        Processes multi-modal inputs (32 ISFET sensors, 4K camera NDVI, root impedance).
        Returns action distribution: [STATIONARY_ANCHOR, STRIDE_NORTH, STRIDE_EAST, 
                                     STRIDE_SOUTH, STRIDE_WEST, DEPLOY_AERO_DRONE].
        """
        # Spiking neuron activation with biological leaky integrate-and-fire (LIF)
        current_time = time.time() * 1000.0
        output_activations = [0.0 for _ in range(self.output_dim)]
        
        for h in range(self.hidden_dim):
            if current_time - self.last_spike_time[h] < self.refractory_period_ms:
                continue
            
            # Leaky integration
            sum_input = sum(sensor_vector[i] * self.synaptic_weights[i % self.input_dim][h] for i in range(len(sensor_vector)))
            self.membrane_potentials[h] = (self.membrane_potentials[h] * 0.9) + sum_input
            
            # Spike threshold (V_th = 1.0)
            if self.membrane_potentials[h] > 1.0:
                self.membrane_potentials[h] = 0.0 # Reset
                self.last_spike_time[h] = current_time
                for o in range(self.output_dim):
                    output_activations[o] += 1.0 / (1.0 + math.exp(-sum_input * 0.1))

        # Softmax normalization
        exp_sum = sum(math.exp(min(a, 20.0)) for a in output_activations)
        return [math.exp(min(a, 20.0)) / (exp_sum + 1e-9) for a in output_activations]


class AutonomousRemediationPlanner:
    """
    High-level Q-learning & heuristic planner coordinating Ms. Heavy Metal Leaf's
    body movements and Aero-Spore drone reconnaissance.
    """
    def __init__(self):
        self.brain_net = PhytoNeuralSynapticNet()
        self.known_hotspots: List[SoilHotspot] = []
        self.current_position: Tuple[int, int] = (1, 1)

    def evaluate_next_target(self, telemetry: PhytoBrainTelemetry, hotspots: List[SoilHotspot]) -> Tuple[int, int]:
        """
        Determines highest value soil coordinate based on metal concentration,
        sunlight availability, and battery reserves.
        """
        best_score = -float('inf')
        best_coord = self.current_position

        for hs in hotspots:
            if hs.remediated:
                continue
            
            # Distance penalty
            dist = math.hypot(hs.x - self.current_position[0], hs.y - self.current_position[1])
            
            # Value function: High metal ppm yields more root wire conductance
            value = (hs.concentration_ppm * 0.01) - (dist * 12.0)
            
            # Sun reward: If battery is low, heavily favor sunlit tiles
            if telemetry.battery_pct < 40.0:
                value += (telemetry.sun_exposure_lux / 5000.0)

            if value > best_score:
                best_score = value
                best_coord = (hs.x, hs.y)

        return best_coord

    def decide_drone_mission(self, telemetry: PhytoBrainTelemetry, unscanned_sectors: int) -> Dict[str, any]:
        """
        Decides whether to launch Aero-Spore drone from thoracic dock for aerial scouting.
        """
        should_launch = (
            telemetry.drone_docked and 
            telemetry.battery_pct > 65.0 and 
            unscanned_sectors > 4 and 
            telemetry.sun_exposure_lux > 40_000
        )
        
        return {
            "launch_authorized": should_launch,
            "flight_profile": "GRID_SURVEY_SCAN" if should_launch else "DOCK_CHARGING",
            "recommended_altitude_m": 45.0,
            "sensor_mode": "hyperspectral_metals"
        }

    def generate_natural_language_bio_status(self, telemetry: PhytoBrainTelemetry) -> str:
        """
        Formats internal neurological and botanical state for human communication.
        """
        return (
            f"[Phyto-Neural Cranial Core Status]\n"
            f"• Cognitive Mode: {telemetry.mobility_mode}\n"
            f"• Root-Wire Conduction: {telemetry.root_conductivity_sm:.2f} S/m\n"
            f"• Foliar Solar Harvest: {telemetry.solar_gen_w:.0f} W ({telemetry.sun_exposure_lux:,.0f} Lux)\n"
            f"• Soil Galvanic Redox: {telemetry.galvanic_gen_w:.0f} W ({telemetry.soil_redox_mv:.0f} mV)\n"
            f"• Total Contaminants Sequestered: {telemetry.total_metals_extracted_kg:.1f} kg\n"
            f"• Drone Docked: {'Yes (Thoracic Cradle Latch Active)' if telemetry.drone_docked else 'Airborne on Scan'}"
        )

# ==============================================================================
# MAIN EXECUTION DEMO
# ==============================================================================
if __name__ == "__main__":
    planner = AutonomousRemediationPlanner()
    mock_telemetry = PhytoBrainTelemetry(
        sun_exposure_lux=92000,
        soil_redox_mv=720,
        solar_gen_w=410,
        galvanic_gen_w=185,
        battery_pct=88.5,
        root_conductivity_sm=0.92,
        mobility_mode="COGNITIVE_MODE_DEEP_EXTRACTION",
        drone_docked=True,
        total_metals_extracted_kg=22.4
    )
    
    status_report = planner.generate_natural_language_bio_status(mock_telemetry)
    print(status_report)
`,
  },
  {
    id: 'aero-spore-drone-cpp',
    filename: 'AeroSpore_Drone_Autopilot.cpp',
    language: 'cpp',
    title: 'Aero-Spore Drone Autopilot & Docking Lock (C++)',
    description: 'Firmware executing on the 280mm Aero-Spore aerial scout drone. Implements magnetic docking lock, 60W pogo charging, and autonomous multispectral scanning.',
    linesCount: 220,
    code: `/**
 * ==============================================================================
 * PROJECT: MS. HEAVY METAL LEAF - AUTONOMOUS BIO-CYBERNETIC ROBOT
 * SUBSYSTEM: AERO-SPORE RECONNAISSANCE DRONE AUTOPILOT
 * FILE: AeroSpore_Drone_Autopilot.cpp
 * TARGET: STM32G474 (170MHz) + Optical Flow + Magnetic Docking Array
 * ==============================================================================
 */

#include <stdint.h>
#include <stdbool.h>
#include <math.h>

#define DOCK_MAGNET_HOLD_PIN 12
#define POGO_CHARGE_SENSE_PIN 14
#define CHARGE_CURRENT_MAX_AMPS 2.5f

typedef enum {
    DRONE_STATE_DOCKED_CHARGING,
    DRONE_STATE_TAKEOFF_ASCENT,
    DRONE_STATE_AUTONOMOUS_GRID_SCAN,
    DRONE_STATE_SPORE_DISPERSAL,
    DRONE_STATE_RETURN_TO_THORACIC_DOCK,
    DRONE_STATE_PRECISION_MAGNETIC_LATCH
} DroneState_t;

static DroneState_t g_DroneState = DRONE_STATE_DOCKED_CHARGING;
static float g_AltitudeMeters = 0.0f;
static float g_BatteryVoltage = 16.8f; // 4S LiPo/Bio-Battery

void Drone_Init(void) {
    // Initialize optical flow sensor, 4K multispectral camera, and 2.4GHz link
    g_DroneState = DRONE_STATE_DOCKED_CHARGING;
}

void Drone_RunLoop_500Hz(void) {
    switch (g_DroneState) {
        case DRONE_STATE_DOCKED_CHARGING:
            // Regulate 60W charging current from Ms. Heavy Metal Leaf's solar/galvanic bus
            if (ReadPogoChargeContinuity()) {
                ApplyChargingCurrent(CHARGE_CURRENT_MAX_AMPS);
            }
            break;

        case DRONE_STATE_TAKEOFF_ASCENT:
            // Release 4x N52 neodymium magnetic latching pads
            SetDockMagnetCurrent(0.0f);
            SpinRotors(14500); // RPM
            g_AltitudeMeters += 0.05f;
            if (g_AltitudeMeters >= 35.0f) {
                g_DroneState = DRONE_STATE_AUTONOMOUS_GRID_SCAN;
            }
            break;

        case DRONE_STATE_AUTONOMOUS_GRID_SCAN:
            // Scan for soil metal hotspots (Cd, Ni, Cu, Pb) using hyperspectral NIR
            CaptureMultispectralImage();
            TransmitNDVIStreamToBase();
            if (DetectHazardPpm() > 5000.0f) {
                TriggerBioSporeDispenser();
            }
            break;

        case DRONE_STATE_RETURN_TO_THORACIC_DOCK:
            // Visual homing toward Ms. Heavy Metal Leaf's inter-scapular LED beacon
            HomeToBioBotThorax();
            if (GetDistanceToDockCm() < 5.0f) {
                g_DroneState = DRONE_STATE_PRECISION_MAGNETIC_LATCH;
            }
            break;

        case DRONE_STATE_PRECISION_MAGNETIC_LATCH:
            // Engage electro-permanent magnets to lock into dorsal cradle
            EngageDockMagneticLock();
            CutMotorPower();
            g_DroneState = DRONE_STATE_DOCKED_CHARGING;
            break;
    }
}

bool ReadPogoChargeContinuity(void) { return true; }
void ApplyChargingCurrent(float amps) { (void)amps; }
void SetDockMagnetCurrent(float ma) { (void)ma; }
void SpinRotors(uint16_t rpm) { (void)rpm; }
void CaptureMultispectralImage(void) {}
void TransmitNDVIStreamToBase(void) {}
float DetectHazardPpm(void) { return 3200.0f; }
void TriggerBioSporeDispenser(void) {}
void HomeToBioBotThorax(void) {}
float GetDistanceToDockCm(void) { return 2.1f; }
void EngageDockMagneticLock(void) {}
void CutMotorPower(void) {}
`,
  }
];
