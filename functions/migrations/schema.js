/**
 * Firestore Schema Migration for Co-Pilot
 * Run: node functions/migrations/schema.js
 */

const admin = require('firebase-admin');

// Initialize if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Sample regulations data (NOLA/TX focused)
const SAMPLE_REGULATIONS = [
  {
    id: "nola-health-temp",
    code: "NOLA-HC-§701",
    title: "Cold Holding Temperature",
    description: "Potentially hazardous foods must be held at 41°F or below",
    jurisdiction: "New Orleans",
    category: "health",
    typicalFine: 250,
    frequency: "daily",
    riskFactors: ["equipment_failure", "human_error"],
  },
  {
    id: "nola-fire-ext",
    code: "NOLA-FIRE-§10.2.4",
    title: "Fire Extinguisher Inspection",
    description: "Monthly inspection of fire extinguishers required",
    jurisdiction: "New Orleans",
    category: "fire",
    typicalFine: 500,
    frequency: "monthly",
    riskFactors: ["missed_inspection"],
  },
  {
    id: "tx-tabc-age",
    code: "TABC-§106.03",
    title: "Age Verification Protocol",
    description: "Check ID for anyone appearing under 30",
    jurisdiction: "Texas",
    category: "alcohol",
    typicalFine: 4000,
    frequency: "per_transaction",
    riskFactors: ["sting_operation", "employee_error"],
  },
  {
    id: "nola-ada-access",
    code: "ADA-2010-§4.1",
    title: "Accessible Entry",
    description: "Main entrance must be wheelchair accessible",
    jurisdiction: "Federal",
    category: "accessibility",
    typicalFine: 75000,
    frequency: "complaint_based",
    riskFactors: ["litigation_risk"],
  },
  {
    id: "nola-sanitization",
    code: "NOLA-HC-§703",
    title: "Three-Compartment Sink",
    description: "Proper wash-rinse-sanitize sequence required",
    jurisdiction: "New Orleans",
    category: "health",
    typicalFine: 150,
    frequency: "daily",
    riskFactors: ["cross_contamination"],
  },
];

// Migration functions
async function addCoPilotFieldsToChecklistItems() {
  console.log("📋 Adding Co-Pilot fields to checklist_item_instances...");
  
  const snapshot = await db.collection("checklist_item_instances").limit(500).get();
  
  const batch = db.batch();
  let count = 0;
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    
    // Only update if not already enhanced
    if (!data.copilotEnhanced) {
      batch.update(doc.ref, {
        regulationRef: data.regulationRef || null,
        riskScore: data.riskScore || null,
        violationLikelihood: data.violationLikelihood || null,
        fineAmount: data.fineAmount || null,
        repeatCount: data.repeatCount || null,
        exposureHours: data.exposureHours || null,
        roiEstimate: data.roiEstimate || null,
        sopContent: data.sopContent || null,
        copilotEnhanced: data.copilotEnhanced || false,
        top3Risk: data.top3Risk || false,
        enhancedAt: data.enhancedAt || null,
      });
      count++;
    }
    
    // Commit every 500
    if (count % 500 === 0) {
      await batch.commit();
      console.log(`  Committed ${count} updates...`);
    }
  }
  
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`✅ Updated ${count} checklist items`);
}

async function seedRegulations() {
  console.log("📚 Seeding regulations collection...");
  
  for (const reg of SAMPLE_REGULATIONS) {
    await db.collection("regulations").doc(reg.id).set({
      ...reg,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      source: "migration",
    });
    console.log(`  Added: ${reg.code}`);
  }
  
  console.log(`✅ Seeded ${SAMPLE_REGULATIONS.length} regulations`);
}

async function createCoPilotScenariosCollection() {
  console.log("🎯 Creating copilot_scenarios collection...");
  
  // Create a sample scenario for testing
  const sampleScenario = {
    userId: "sample-user",
    locationId: "sample-location",
    name: "Weekend Rush Prep",
    description: "What if we add extra staff for violations?",
    changes: [
      {itemId: "temp-check", action: "add_staff", cost: 200},
      {itemId: "clean-schedule", action: "increase_frequency", cost: 150},
    ],
    projectedSavings: {
      reducedFines: 1200,
      implementationCost: 350,
      netSavings: 850,
      roi: 2.43,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    status: "draft",
    isSample: true,
  };
  
  await db.collection("copilot_scenarios").add(sampleScenario);
  console.log("✅ Created scenarios collection with sample");
}

async function addUserFeaturesField() {
  console.log("👤 Adding features field to users...");
  
  const snapshot = await db.collection("users").limit(100).get();
  
  const batch = db.batch();
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.features) {
      batch.update(doc.ref, {
        features: {
          copilot: false, // Premium feature, disabled by default
          enhancedAnalytics: false,
          customSOPs: false,
        },
        subscription: data.subscription || {
          tier: "basic",
          status: "active",
        },
      });
    }
  }
  
  await batch.commit();
  console.log(`✅ Updated ${snapshot.size} users`);
}

// Main execution
async function runMigrations() {
  console.log("🚀 Starting Co-Pilot schema migrations...\n");
  
  try {
    await addCoPilotFieldsToChecklistItems();
    await seedRegulations();
    await createCoPilotScenariosCollection();
    await addUserFeaturesField();
    
    console.log("\n✨ All migrations completed!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runMigrations();
}

module.exports = {
  runMigrations,
  SAMPLE_REGULATIONS,
};
