/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const apiKey = process.env.GEMINI_API_KEY;

// Secure initialization of GoogleGenAI
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Debugging check to verify API Key availability
if (!ai) {
  console.log('⚠️ GEMINI_API_KEY is not defined in environment variables. AI endpoints will run in simulated Fallback Mode.');
}

/**
 * Executes a Gemini content generation request with automatic retry on transient errors
 * and fallback to alternative models if the primary model is unavailable.
 */
async function robustGenerateContent(params: {
  contents: any;
  config?: any;
}) {
  if (!ai) {
    throw new Error('AI client is not initialized.');
  }

  // Approved models from the gemini-api skill description:
  // Primary (gemini-3.5-flash), Backup A (gemini-flash-latest), Backup B (gemini-3.1-flash-lite)
  const modelsToTry = [
    'gemini-3.5-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite'
  ];

  let lastError: any = null;

  for (let i = 0; i < modelsToTry.length; i++) {
    const currentModel = modelsToTry[i];
    console.log(`[Emergix AI] Attempting generation with model: ${currentModel} (${i + 1}/${modelsToTry.length})`);

    // In-line retry for transient issues (503, 429, etc.)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: currentModel,
          contents: params.contents,
          config: params.config,
        });

        if (response && response.text) {
          console.log(`[Emergix AI] Successfully generated content using model: ${currentModel}`);
          return response;
        } else {
          throw new Error(`Empty response returned from model ${currentModel}`);
        }
      } catch (error: any) {
        lastError = error;
        
        const isTransient = error.status === 503 ||
                            error.status === 429 ||
                            error.message?.includes('503') ||
                            error.message?.includes('UNAVAILABLE') ||
                            error.message?.includes('429');

        console.log(
          `[Emergix AI] Model ${currentModel} failed (Attempt ${attempt}/2): ${error.message || error}`
        );

        if (isTransient && attempt < 2) {
          console.log(`[Emergix AI] Transient issue. Retrying in 600ms...`);
          await new Promise((resolve) => setTimeout(resolve, 600));
        } else {
          // If we can't retry or it's not transient, break outer loop to try next model
          break;
        }
      }
    }
  }

  // If we run out of models, throw the last received error
  throw lastError || new Error('All model attempts failed or model list empty.');
}

// 1. AI Symptoms Triage Endpoint
app.post('/api/ai/triage', async (req, res) => {
  const { name, age, gender, symptoms } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: 'Symptoms are required for clinical triage.' });
  }

  if (!ai) {
    // Elegant fallback simulation if API Key is not set yet
    return res.json(simulateTriageFallback(name, age, symptoms));
  }

  try {
    const prompt = `Perform an emergency clinical triage for the following presentation:
Name: ${name || 'Unknown'}
Age: ${age || 'Unknown'}
Gender: ${gender || 'Unknown'}
Symptoms/History: ${symptoms}

Return a structured emergency assessment summarizing urgency, clinical recommendation, and suggested immediate department placement.`;

    const response = await robustGenerateContent({
      contents: prompt,
      config: {
        systemInstruction: 'You are an advanced Emergency Medicine Clinical Decision Support system. Assess incoming patients swiftly, prioritizing physiological stability and safety. Categorize urgency strictly as: Critical, High, Medium, or Stable.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgencyLevel: {
              type: Type.STRING,
              description: "Must match exactly one of: 'Critical', 'High', 'Medium', 'Stable'"
            },
            severityScore: {
              type: Type.INTEGER,
              description: 'A quantitative clinical severity score between 0 (fully healthy) and 100 (complete metabolic collapse / arrest)'
            },
            probableDepartment: {
              type: Type.STRING,
              description: 'Appropriate hospital care unit. e.g. Cardiology, Trauma Surgery, Neurology, Pulmonology, Pediatrics, Intensive Care'
            },
            recs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'A list of 3-5 immediate triage clinical actions, nursing priorities, or diagnostic studies required'
            },
            assessmentSummary: {
              type: Type.STRING,
              description: '1-2 sentences of highly crisp clinical synthesis justifying the triage level'
            }
          },
          required: ['urgencyLevel', 'severityScore', 'probableDepartment', 'recs', 'assessmentSummary']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.log('[Emergix Triage API] Gemini experienced high demand or failed. Successfully routing to local clinical fallback:', error?.message || error);
    const fallbackData = simulateTriageFallback(name, age, symptoms);
    return res.json(fallbackData);
  }
});

// 2. AI Medical General Assistant / Chatbot
app.post('/api/ai/assistant', async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Chat messages history is required.' });
  }

  const lastMessageText = messages[messages.length - 1]?.content || '';

  if (!ai) {
    const textOut = generateFunSimulatedResponse(lastMessageText);
    return res.json({ text: textOut });
  }

  try {
    // Format message history for chat
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));

    const response = await robustGenerateContent({
      contents: formattedContents,
      config: {
        systemInstruction: 'You are Joshuaa, the Emergix AI Clinical Advisor. You MUST keep all replies extremely brief, direct, simple to understand, and neat. Always reply with 2 or 3 short bullet points only (maximum 60 words total). Never output long paragraphs, essays, or unnecessary greeting fluff. Be fast and highly accurate.'
      }
    });

    return res.json({ text: response.text });
  } catch (error: any) {
    console.log('Gemini Assistant API error, falling back to smart simulated guide:', error?.message || error);
    const textOut = generateFunSimulatedResponse(lastMessageText);
    return res.json({ text: textOut });
  }
});

// 3. AI Smart System Load Prediction Center
app.post('/api/ai/predict-load', async (req, res) => {
  const { emergencyInflow, icuUtilization, ambulanceLoad, lastIncidents } = req.body;

  if (!ai) {
    return res.json(simulateLoadFallback(emergencyInflow, icuUtilization));
  }

  try {
    const prompt = `Analyze current emergency operations and calculate a 4-hour system load projection:
- Current active emergency count in queue: ${emergencyInflow || 0} cases
- ICU bed occupancy: ${icuUtilization || 0}%
- Ambulance fleet dispatch load: ${ambulanceLoad || 0}%
- Recent log feed: ${JSON.stringify(lastIncidents || [])}`;

    const response = await robustGenerateContent({
      contents: prompt,
      config: {
        systemInstruction: 'You are the Emergix Command Center predictive analytics neural system. Your task is to calculate hospital overflow risk, analyze the active incident trend, and forecast operational bottlenecks for the upcoming shift.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bottleneckWarning: {
              type: Type.STRING,
              description: 'Urgent operational warnings, e.g. "CCU Bed Exhaustion Imminent" or "Ambulance Deficit Expected"'
            },
            recs: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3 proactive management recommendations to balance doctor workloads, bed scheduling, or ambulance triage'
            },
            overflowRiskPercent: {
              type: Type.INTEGER,
              description: 'Calculated percent risk of resource overload / ambulance holding'
            },
            summary: {
              type: Type.STRING,
              description: 'A 2-sentence tactical analysis of current emergency response throughput'
            }
          },
          required: ['bottleneckWarning', 'recs', 'overflowRiskPercent', 'summary']
        }
      }
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json(parsedData);
  } catch (error: any) {
    console.log('[Emergix Predict Load API] Gemini experienced high demand or failed. Successfully routing to localized operational simulation:', error?.message || error);
    const fallbackLoad = simulateLoadFallback(emergencyInflow, icuUtilization);
    return res.json(fallbackLoad);
  }
});

// Fallback logic for symptoms triage
function simulateTriageFallback(name: string, age: any, symptoms: string) {
  const lowerS = symptoms.toLowerCase();
  let urgency: 'Critical' | 'High Risk' | 'Medium Risk' | 'Stable' = 'Medium Risk';
  let score = 50;
  let dept = 'Emergency Medicine';
  let recs = [
    'Check and chart vital signs immediately.',
    'Obtain complete medical history and list active prescription history.'
  ];
  let summary = 'Standard administrative triage performed.';

  if (lowerS.includes('chest') || lowerS.includes('heart') || lowerS.includes('cardiac') || lowerS.includes('stabbing')) {
    urgency = 'Critical';
    score = 94;
    dept = 'Interventional Cardiology';
    recs = [
      'Hook to 12-Lead ECG within 10 minutes of arrival.',
      'Establish wide-bore IV access and draw troponin chemistry markers.',
      'Prepare emergency defibrillator cart at bedside.'
    ];
    summary = `High concern for acute coronary ischemia. Patient is at immediate cardiac arrest risk.`;
  } else if (lowerS.includes('head') || lowerS.includes('stroke') || lowerS.includes('speech') || lowerS.includes('weakness')) {
    urgency = 'Critical';
    score = 90;
    dept = 'Stroke Neurology';
    recs = [
      'Activate hospital Stroke Team Code.',
      'Urgent non-contrast head CT scan to rule out hemorrhage.',
      'Assess eligibility guidelines for alteplase/tenecteplase.'
    ];
    summary = 'Neurological emergency showing stroke-like presentation. Fast tracking required.';
  } else if (lowerS.includes('breathe') || lowerS.includes('respiratory') || lowerS.includes('asthma') || lowerS.includes('oxygen')) {
    urgency = 'High Risk';
    score = 82;
    dept = 'Pulmonology / Critical Care';
    recs = [
      'Administer high-flow humidified oxygen support.',
      'Begin continuous nebulizer therapy (Albuterol/Ipratropium).',
      'Prepare arterial blood gas sampling kit.'
    ];
    summary = 'Severe respiratory strain with elevated risk of hypoxic ventilation failure.';
  } else if (lowerS.includes('fever') || lowerS.includes('confused') || lowerS.includes('sepsis') || lowerS.includes('temperature')) {
    urgency = 'High Risk';
    score = 75;
    dept = 'Infectious Disease';
    recs = [
      'Draw blood culture x2 from separate vascular sites.',
      'Initiate broad-spectrum IV antibiotic regimen within 60 minutes.',
      'Aggressive fluid hydration (30mL/kg Lactated Ringers).'
    ];
    summary = 'Sepsis alert triggered by high thermoregulatory spike and acute lethargy.';
  }

  return {
    urgencyLevel: urgency,
    severityScore: score,
    probableDepartment: dept,
    recs,
    assessmentSummary: summary
  };
}

// Fallback logic for operational loads
function simulateLoadFallback(emergencyCount: number = 0, icuOccupancy: number = 0) {
  let risk = Math.min(95, Math.max(10, Math.floor((emergencyCount * 12) + (icuOccupancy * 0.7))));
  let warning = 'Nominal Operational Capacity';
  let recs = [
    'Monitor stable holdovers in emergency bay transition spaces.',
    'Keep paramedic teams informed of active ICU discharges.'
  ];

  if (risk > 80) {
    warning = '🚨 SEVERE RESOURCE SATURATION WARNING';
    recs = [
      'Initiate emergency patient diversion protocols to secondary local trauma networks.',
      'Activate auxiliary critical care nursing calling rosters.',
      'Initiate early discharge screening for stable sub-acute patients.'
    ];
  } else if (risk > 50) {
    warning = '⚠️ MODERATE INTAKE STRAIN DETECTED';
    recs = [
      'Stand up CCU bed reserves for active cardiology admissions.',
      'Expedite pending lab result processing for stable ER patients.'
    ];
  }

  return {
    bottleneckWarning: warning,
    recs,
    overflowRiskPercent: risk,
    summary: 'The hospital command system is tracking moderate throughput latency. Care teams remain responsive.'
  };
}

function generateFunSimulatedResponse(query: string): string {
  const q = query.toLowerCase();
  
  let greeting = `👋 **Joshuaa here (Concise Care Advisor)!** Let's make this simple and clear:\n\n`;
  
  if (q.includes('help') || q.includes('how to use') || q.includes('guide') || q.includes('manual') || q.includes('notes') || q.includes('instruction')) {
    return greeting + `### 📖 Emergix Quick Guide
• **Dashboard**: Monitor active patient capacity and click "Predict Surge Load".
• **Dispatches**: Click **"Manual Dispatch Directive"**, fill in symptoms, and assign to open beds upon arrival.
• **Digital Twins**: Tweak patient names/vitals, view Recharts waveform history logs.
• **ICU Wards**: Configure name capacities, toggle ventilators, and adjust dynamic LPM flow levels.`;
  }
  
  if (q.includes('pencil') || q.includes('edit') || q.includes('change') || q.includes('changeable')) {
    return greeting + `### ✏️ How to Edit Details
• **Patient Twins**: Click **Digital Health Twins**. Select ✏️ **pencil** beside name, age, gender, blood type, or diagnose fields.
• **Bed Allocation**: Click **ICU Beds**. Modify bed station names, classifications, or total bed counts.
• **Roster Details**: Click **Physicians Command**. Alter medical titles, active surgeons, and active cases lists.`;
  }

  if (q.includes('chest') || q.includes('heart') || q.includes('stemi') || q.includes('pain') || q.includes('cardiac') || q.includes('stabbing')) {
    return greeting + `### 🩺 ACS / Heart Pain Pathway (Level 1)
1. **ECG Monitor**: Execute 12-lead analysis within 10 minutes from presentation.
2. **STAT Markers**: Draw serum troponins immediately.
3. **Meds Protocol**: Give anti-platelets, supply oxygen support, and prepare crash carts.`;
  }

  if (q.includes('breath') || q.includes('asthma') || q.includes('oxygen') || q.includes('lung') || q.includes('dyspnea')) {
    return greeting + `### 🌬️ Acute Dyspnea Protocol (Level 2)
1. **Oxygenation Support**: Deliver humidified oxygen to secure SpO2 above 92%.
2. **Nebulizer Therapy**: Administer immediate Albuterol and Ipratropium.
3. **Steroids Dosage**: Infuse early IV glucocorticoids for high inflammation controls.`;
  }

  if (q.includes('stroke') || q.includes('speech') || q.includes('weak') || q.includes('neurolog')) {
    return greeting + `### 🧠 Acute Stroke Code Protocol (Level 1)
1. **LKN Timeline**: Zero-in on Last Known Normal timing parameter.
2. **Brain Non-Contrast CT**: Order immediate head CT to rule out active hemorrhage.
3. **Therapy Bounds**: Assess suitability of strict pharmacological tPA candidates.`;
  }

  if (q.includes('sepsis') || q.includes('infection') || q.includes('temperature') || q.includes('fever')) {
    return greeting + `### 🦠 Active Septic Shock Bundle (Level 2)
1. **Double Cultures**: Sample twice within 1 hour *prior* to broad antibiotics.
2. **Lactate Levels**: Draw serum lactate baseline; re-sample if >2 mmol/L.
3. **Rapid Fluids**: Hydrate with 30 mL/kg Balanced Crystalloids.`;
  }

  return greeting + `### 💡 Quick Triage Advice
• Try scaling simulator dial up to **X4** speed to rapidly test clinic bed turns!
• Every single parameter panel is fully editable; search for ✏️ icon overlays.
• Let me know if you need specific medication doses or clinical guidelines. Keep keeping lives safe!`;
}

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Emergix server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
