# ComplianceDaddy Mobile Base

Complete compliance management system for restaurants, bars, and nightclubs with AI-powered inventory tracking.

## Features

### ✅ Compliance Management
- Pre-opening USDA Health & Safety Audits
- Routine Health Code Audits
- Fire & Safety Inspections
- Real-time compliance scoring
- Violation tracking & remediation

### ✅ Smart Checklists
- Opening/Closing checklists for:
  - Restaurants (18 opening, 18 closing)
  - Bars (20 opening, 18 closing)
  - Nightclubs (20 opening, 20 closing)
- Task completion tracking
- Time-based reminders
- Photo documentation

### ✅ AI-Powered Inventory (NEW!)
- 100-item alcohol inventory catalog
- Predictive usage forecasting (up to 95% confidence)
- Auto-reorder recommendations with urgency levels
- Waste opportunity detection (overstock, spoilage, slow-moving)
- Supplier catalog integration with bulk pricing
- Historical trend analysis
- Seasonal adjustment algorithms
- Event impact modeling

### ✅ Business Management
- Multi-venue support
- Team member management
- Subscription handling (7-day trial → paid)
- Document storage & retrieval

## Tech Stack

- **Frontend**: React 19.0.0 + TypeScript
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Mobile Ready**: PWA-ready, Capacitor-compatible

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file from .env.example
cp .env.example .env

# Add your Firebase config to .env

# Run development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── lib/
│   ├── firebase.ts              # Firebase config
│   ├── firebaseCollections.ts   # Firestore types & refs
│   └── inventoryAI.ts           # AI prediction engine
├── data/
│   ├── auditTemplates.ts        # USDA, Health, Fire audits
│   ├── checklistTemplates.ts    # All checklists
│   └── inventoryData.ts         # 100 alcohol items
├── components/
│   ├── inventory/
│   │   └── InventoryDashboard.tsx
│   ├── audits/
│   ├── checklists/
│   └── common/
├── pages/
├── hooks/
└── utils/
```

## Inventory AI Features

The AI system uses multiple data sources:
- **Historical sales data** (14-day moving average)
- **POS integration** (recipe ingredients, sales patterns)
- **Seasonal factors** (summer drinks, winter spirits)
- **Day-of-week adjustments** (weekend vs weekday)
- **Event calendars** (live music, holidays, promotions)

### Prediction Algorithm:
```
predicted_usage = base_avg × trend_factor × day_factor × seasonal_factor × event_factor
```

### Reorder Triggers:
- **Critical**: < 2 days until runout
- **High**: < 5 days until runout
- **Medium**: < 10 days until runout
- **Low**: > 10 days until runout

## Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Storage
5. Copy config to `.env`

## Deployment

### Web (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### iOS (Capacitor)
```bash
npm install @capacitor/core @capacitor/ios
npx cap init
npx cap add ios
npm run build
npx cap copy
npx cap open ios
```

### Android (Capacitor)
```bash
npm install @capacitor/android
npx cap add android
npm run build
npx cap copy
npx cap open android
```

## License

Proprietary - All Rights Reserved

## Support

For questions or support, contact: support@compliancedaddy.com

---
Built with ❤️ for the hospitality industry
