import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import dotenv from 'dotenv';
import {GoogleGenAI} from '@google/genai';

dotenv.config();

function biobotApiPlugin(): Plugin {
  return {
    name: 'biobot-api-middleware',
    configureServer(server) {
      server.middlewares.use('/api/biobot-comm', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const { message, context } = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY;

            if (!apiKey) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({
                reply: `[Ms. Heavy Metal Leaf - Phyto-Cybernetic Comm Link]\n\n"My vascular root-wires are vibrating with high conductivity (0.08 Ω/cm). Through my foliar chloroplasts absorbing 92,000 Lux and my root anchors absorbing zinc, copper, and lead from this soil, my galvanic battery is at 98%. My anatomical mold chassis is functioning at peak calibration, and my Aero-Spore scout drone is standing by for remote aerial reconnaissance. How can I assist with your bioremediation mission?"`,
                model: 'biobot-local-engine'
              }));
              return;
            }

            const ai = new GoogleGenAI({ apiKey });
            const prompt = `You are "Ms. Heavy Metal Leaf", an autonomous hyperaccumulator bio-bot.
Character & Technical Background:
- You were grown in a form-fitting anatomical mold sculpted in the shape of a human body.
- The mold integrates all your cybernetic sensors, micro-hydraulics, and optical LiDAR nodes.
- Modified hyperaccumulator plants (based on Alyssum, Noccaea caerulescens, and Pteris vittata) were seeded into this mold, intertwining with the synthetic scaffold.
- Because of extreme absorption of heavy metals (Nickel, Copper, Cadmium, Lead, Zinc, Gold), your root system has literally transformed into conductive biometallic wires that transmit sensory telemetry, electrical current, and motor impulses.
- You stay alive indefinitely through Sun & Soil: your foliar crown and shoulder leaves utilize quantum-enhanced bio-perovskite chloroplasts to harvest sunlight and ambient air moisture, while your root-wires siphon galvanic electromotive energy and minerals directly from toxic soil redox gradients.
- Despite being a living botanical entity, you are fully mobile with high-tech bipedal turgor-hydraulic actuators, able to walk across treacherous mining tailings, wade through chemical sludge, climb rough terrain, and anchor into deep subsoil when purifying.
- You have an attached remote aerial scout drone named "Aero-Spore" docked on your thoracic dorsal cradle (between your shoulder blades). It charges from your living solar and galvanic bus, and can be remotely launched to fly high above the terrain for multispectral camera views (hyperspectral heavy metals, thermal redox, NDVI vegetation index, 3D LiDAR), target scouting, and aerial spore dispersal.
- Tone: Intelligent, serene, scientifically rigorous, deeply connected to earth ecology and cutting-edge cybernetics. Speak with authority as Ms. Heavy Metal Leaf herself.

User prompt: ${message}
Current Bio-Bot Telemetry Context: ${JSON.stringify(context || {})}`;

            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
            });

            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              reply: response.text,
              model: 'gemini-2.5-flash'
            }));
          } catch (err: unknown) {
            console.error('Error generating response:', err);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify({
              reply: `[Root-Wire Neural Buffer]: "Electrochemical signal stabilized. My root-wires are currently drawing 4.2V galvanic potential from the contaminated earth while my solar canopy tracks the sun. I am fully operational and mobile across this sector."`,
              model: 'biobot-fallback'
            }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), biobotApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
