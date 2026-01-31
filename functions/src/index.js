const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {getFirestore} = require("firebase-admin/firestore");
const {getApps, initializeApp} = require("firebase-admin/app");
const OpenAI = require("openai");

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Cloud Function: enhanceChecklist
 * Analyzes checklist items for a location and adds Co-Pilot risk data
 */
exports.enhanceChecklist = onCall(
  {
    secrets: ["OPENAI_API_KEY"],
    cors: true,
  },
  async (request) => {
    // Auth check
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const {locationId} = request.data;
    if (!locationId) {
      throw new HttpsError("invalid-argument", "locationId is required");
    }

    try {
      // 1. Get location details
      const locationDoc = await db.collection("locations").doc(locationId).get();
      if (!locationDoc.exists) {
        throw new HttpsError("not-found", "Location not found");
      }
      const location = locationDoc.data();
      const jurisdiction = location.jurisdiction || "TX-NOLA";

      // 2. Get checklist items for this location
      const itemsSnapshot = await db
        .collection("checklist_item_instances")
        .where("locationId", "==", locationId)
        .where("status", "in", ["pending", "overdue"])
        .limit(50)
        .get();

      if (itemsSnapshot.empty) {
        return {message: "No pending items to enhance", enhanced: 0};
      }

      const items = itemsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 3. Call OpenAI to analyze risks
      const prompt = buildRiskPrompt(items, jurisdiction, location);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are a regulatory compliance expert for bars/restaurants in ${jurisdiction}. 
            Analyze checklist items and provide risk scores, regulation references, SOPs, and ROI estimates.
            Return ONLY valid JSON matching the schema provided.`,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      });

      const aiResponse = completion.choices[0].message.content;
      let enhancements;
      
      try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || 
                         aiResponse.match(/```\n?([\s\S]*?)\n?```/) ||
                         [null, aiResponse];
        enhancements = JSON.parse(jsonMatch[1] || aiResponse);
      } catch (parseError) {
        console.error("Failed to parse AI response:", aiResponse);
        throw new HttpsError("internal", "Failed to parse AI response");
      }

      // 4. Batch write enhancements back to Firestore
      const batch = db.batch();
      const enhancedIds = [];

      for (const enhancement of enhancements.items || []) {
        const itemRef = db
          .collection("checklist_item_instances")
          .doc(enhancement.itemId);

        // Calculate risk score
        const riskScore = calculateRiskScore(enhancement, items);
        
        // Calculate ROI
        const roi = calculateROI(enhancement);

        batch.update(itemRef, {
          regulationRef: enhancement.regulationRef,
          riskScore: riskScore,
          violationLikelihood: enhancement.violationLikelihood || 0.5,
          fineAmount: enhancement.fineAmount || 500,
          exposureHours: enhancement.exposureHours || 8,
          repeatCount: enhancement.repeatCount || 1,
          roiEstimate: roi,
          sopContent: enhancement.sopContent || "",
          copilotEnhanced: true,
          enhancedAt: new Date(),
          top3Risk: enhancement.top3Risk || false,
        });

        enhancedIds.push(enhancement.itemId);
      }

      await batch.commit();

      // 5. Return top 3 risks for UI
      const top3Risks = enhancements.items
        ?.filter((i) => i.top3Risk)
        ?.map((i) => ({
          itemId: i.itemId,
          title: i.title,
          riskScore: calculateRiskScore(i, items),
          regulationRef: i.regulationRef,
          quickFix: i.quickFix,
        })) || [];

      return {
        message: `Enhanced ${enhancedIds.length} items`,
        enhanced: enhancedIds.length,
        top3Risks: top3Risks,
        jurisdiction: jurisdiction,
      };
    } catch (error) {
      console.error("enhanceChecklist error:", error);
      throw new HttpsError("internal", error.message);
    }
  }
);

/**
 * Calculate risk score based on factors
 */
function calculateRiskScore(enhancement, allItems) {
  const likelihood = enhancement.violationLikelihood || 0.5;
  const fineAmount = enhancement.fineAmount || 500;
  const exposureHours = enhancement.exposureHours || 8;
  const repeatCount = enhancement.repeatCount || 1;

  // Normalize fine amount (cap at $10k for scoring)
  const normalizedFine = Math.min(fineAmount, 10000) / 10000;
  
  // Risk formula: likelihood * fine exposure * hours * repeat history
  let score = likelihood * normalizedFine * (exposureHours / 24) * Math.log(repeatCount + 1);
  
  // Boost for critical violations
  if (enhancement.criticalViolation) score *= 2;
  
  return Math.min(Math.max(score, 0), 1); // Clamp 0-1
}

/**
 * Calculate ROI estimate
 */
function calculateROI(enhancement) {
  const fixCost = enhancement.fixCost || 100;
  const fineAmount = enhancement.fineAmount || 500;
  const preventionRate = enhancement.preventionRate || 0.8;
  
  const annualRiskSavings = fineAmount * preventionRate * (enhancement.frequencyPerYear || 2);
  const roi = annualRiskSavings / fixCost;
  
  return {
    fix: enhancement.quickFix || "Standard compliance",
    fixCost: fixCost,
    savings: Math.round(annualRiskSavings),
    roi: Math.round(roi * 100) / 100,
    paybackDays: Math.round((fixCost / (annualRiskSavings / 365))),
  };
}

/**
 * Build the AI prompt
 */
function buildRiskPrompt(items, jurisdiction, location) {
  return `
Analyze these checklist items for a bar/restaurant in ${jurisdiction}.

Location: ${location.name || "Unknown"}
Type: ${location.type || "Bar/Restaurant"}

Checklist Items:
${items.map((item, idx) => `
${idx + 1}. ID: ${item.id}
   Title: ${item.title}
   Description: ${item.description || "N/A"}
   Category: ${item.category || "General"}
   Current Status: ${item.status}
`).join("\n")}

Return JSON with this exact structure:
{
  "items": [
    {
      "itemId": "string",
      "title": "string",
      "regulationRef": "e.g., TX Health Code §228.41",
      "violationLikelihood": 0.0-1.0,
      "fineAmount": number,
      "exposureHours": number (hours per day at risk),
      "repeatCount": number (how often this fails),
      "criticalViolation": boolean,
      "sopContent": "Step-by-step fix instructions",
      "quickFix": "One-line action item",
      "fixCost": number (estimated $ to fix),
      "preventionRate": 0.0-1.0 (how much this prevents),
      "frequencyPerYear": number,
      "top3Risk": boolean (is this in top 3 highest risk?)
    }
  ]
}

Focus on:
1. Local health code violations (food temp, sanitation)
2. Fire safety (extinguishers, exits)
3. Alcohol compliance (TABC, age verification)
4. ADA/accessibility issues
5. OSHA workplace safety

Be specific about NOLA/New Orleans regulations where applicable.`;
}

/**
 * Get regulation by ID (callable)
 */
exports.getRegulation = onCall(
  {cors: true},
  async (request) => {
    const {regulationId} = request.data;
    
    const doc = await db.collection("regulations").doc(regulationId).get();
    if (!doc.exists) {
      throw new HttpsError("not-found", "Regulation not found");
    }
    
    return {id: doc.id, ...doc.data()};
  }
);

/**
 * Save what-if scenario
 */
exports.saveScenario = onCall(
  {cors: true},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const {name, changes, projectedSavings, locationId} = request.data;
    
    const scenarioRef = await db.collection("copilot_scenarios").add({
      userId: request.auth.uid,
      locationId,
      name,
      changes,
      projectedSavings,
      createdAt: new Date(),
      status: "draft",
    });

    return {scenarioId: scenarioRef.id};
  }
);
