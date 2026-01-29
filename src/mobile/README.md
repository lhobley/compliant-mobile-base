# React Native / Expo Inventory System

This folder contains the source code for the Photo-Assisted Bar Inventory System.

## Integration

To use this in your Expo app, ensure you have the following dependencies:

```bash
npm install firebase
npm install expo-camera expo-image-picker
npm install lucide-react-native
```

## Screen Registration

Add these screens to your React Navigation stack:

```tsx
import { InventoryHomeScreen } from './src/mobile/screens/InventoryHomeScreen';
import { CategoryDetailScreen } from './src/mobile/screens/CategoryDetailScreen';
import { PhotoReviewScreen } from './src/mobile/screens/PhotoReviewScreen';

// ... inside Stack.Navigator
<Stack.Screen name="InventoryHome" component={InventoryHomeScreen} />
<Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
<Stack.Screen name="PhotoReview" component={PhotoReviewScreen} />
```

## Features

- **Seeding**: Automatically seeds 190 master inventory items on first session start.
- **Manual Count**: Optimized manual entry list.
- **AI Scan**: Capture shelf photos, simulate AI detection, and auto-map to inventory items.
