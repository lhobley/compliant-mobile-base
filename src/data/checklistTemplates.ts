import { ChecklistItem } from '@/lib/firebaseCollections';

// RESTAURANT OPENING CHECKLIST
const RESTAURANT_OPENING_ITEMS: ChecklistItem[] = [
  { id: 'ro1', task: 'Unlock all entrance doors and turn on exterior lights', time: '30 min before', critical: true },
  { id: 'ro2', task: 'Turn on all kitchen equipment (ovens, grills, fryers) and verify temperatures', time: '30 min before', critical: true },
  { id: 'ro3', task: 'Check refrigeration units - all at 41°F or below', time: '30 min before', critical: true },
  { id: 'ro4', task: 'Inspect prep station - ensure all ingredients are fresh, dated, and properly stored', time: '25 min before', critical: true },
  { id: 'ro5', task: 'Fill all sanitizer buckets to 200ppm and place at stations', time: '25 min before', critical: true },
  { id: 'ro6', task: 'Check dishwasher - run test cycle and verify temperatures (150°F wash, 180°F rinse)', time: '25 min before', critical: true },
  { id: 'ro7', task: 'Stock all server stations with napkins, silverware, condiments', time: '20 min before', critical: false },
  { id: 'ro8', task: 'Turn on dining room lights, music, and adjust temperature to 68-72°F', time: '20 min before', critical: false },
  { id: 'ro9', task: 'Set up POS system and verify cash drawer has correct starting cash ($200)', time: '20 min before', critical: true },
  { id: 'ro10', task: 'Clean and sanitize all dining tables, chairs, and menus', time: '15 min before', critical: true },
  { id: 'ro11', task: 'Check restrooms - stock toilet paper, paper towels, soap, and clean', time: '15 min before', critical: true },
  { id: 'ro12', task: 'Verify all hand sinks have hot water, soap, and paper towels', time: '15 min before', critical: true },
  { id: 'ro13', task: 'Review 86 list (out of stock items) with kitchen and servers', time: '10 min before', critical: true },
  { id: 'ro14', task: 'Conduct pre-shift meeting - review specials, reservations, and any issues', time: '10 min before', critical: false },
  { id: 'ro15', task: 'Walk through entire restaurant - check for cleanliness, safety hazards', time: '5 min before', critical: true },
  { id: 'ro16', task: 'Turn on "OPEN" sign and unlock front doors', time: 'At opening', critical: true },
  { id: 'ro17', task: 'Ensure host stand is ready with reservation book, menus, and floor plan', time: 'At opening', critical: false },
  { id: 'ro18', task: 'Verify coffee station is full, tea is brewing, water is cold', time: 'At opening', critical: false },
];

// RESTAURANT CLOSING CHECKLIST
const RESTAURANT_CLOSING_ITEMS: ChecklistItem[] = [
  { id: 'rc1', task: 'Lock front doors and turn off "OPEN" sign', time: 'At closing', critical: true },
  { id: 'rc2', task: 'Count cash drawer and complete cash-out paperwork', time: 'After closing', critical: true },
  { id: 'rc3', task: 'Clean and sanitize all dining tables, chairs, and booth seats', time: 'After closing', critical: true },
  { id: 'rc4', task: 'Sweep and mop all dining room floors', time: 'After closing', critical: true },
  { id: 'rc5', task: 'Clean and restock all server stations', time: 'After closing', critical: false },
  { id: 'rc6', task: 'Turn off all kitchen cooking equipment and clean thoroughly', time: 'After closing', critical: true },
  { id: 'rc7', task: 'Clean and sanitize all food prep surfaces, cutting boards, and utensils', time: 'After closing', critical: true },
  { id: 'rc8', task: 'Run final dishwasher cycle and clean dishwashing area', time: 'After closing', critical: true },
  { id: 'rc9', task: 'Sweep and mop all kitchen floors, pay attention to corners and under equipment', time: 'After closing', critical: true },
  { id: 'rc10', task: 'Cover and date all food items, store in proper refrigeration', time: 'After closing', critical: true },
  { id: 'rc11', task: 'Check all refrigerator and freezer temperatures, log in temperature book', time: 'After closing', critical: true },
  { id: 'rc12', task: 'Empty and clean all trash cans, take trash to dumpster', time: 'After closing', critical: true },
  { id: 'rc13', task: 'Clean and restock restrooms with supplies', time: 'After closing', critical: true },
  { id: 'rc14', task: 'Turn off all dining room lights, music, and adjust thermostat to night mode (62°F)', time: 'After closing', critical: false },
  { id: 'rc15', task: 'Check that all windows and back doors are locked', time: 'After closing', critical: true },
  { id: 'rc16', task: 'Set alarm system and verify it is armed', time: 'Final step', critical: true },
  { id: 'rc17', task: 'Complete closing manager checklist and note any issues for AM shift', time: 'Final step', critical: true },
  { id: 'rc18', task: 'Turn off exterior lights and lock all doors upon exit', time: 'Final step', critical: true },
];

// BAR OPENING CHECKLIST
const BAR_OPENING_ITEMS: ChecklistItem[] = [
  { id: 'bo1', task: 'Unlock entrance and turn on exterior signage/lights', time: '30 min before', critical: true },
  { id: 'bo2', task: 'Turn on all bar equipment (ice machines, blenders, glass washers)', time: '30 min before', critical: true },
  { id: 'bo3', task: 'Check all refrigeration units - beer coolers at 38°F, wine at 55°F', time: '30 min before', critical: true },
  { id: 'bo4', task: 'Stock bar with fresh ice - fill all wells and backup bins', time: '25 min before', critical: true },
  { id: 'bo5', task: 'Cut fresh garnishes (limes, lemons, oranges, cherries)', time: '25 min before', critical: false },
  { id: 'bo6', task: 'Check liquor inventory levels and bring bottles from storage to speed rail', time: '25 min before', critical: true },
  { id: 'bo7', task: 'Stock beer coolers with most popular brands at front', time: '20 min before', critical: false },
  { id: 'bo8', task: 'Fill all juice containers and verify freshness dates', time: '20 min before', critical: true },
  { id: 'bo9', task: 'Set up POS system and verify cash drawer starting amount ($300)', time: '20 min before', critical: true },
  { id: 'bo10', task: 'Clean and sanitize entire bar top, sinks, and glass rails', time: '15 min before', critical: true },
  { id: 'bo11', task: 'Verify all draft beer lines are working - pour test beers from each tap', time: '15 min before', critical: true },
  { id: 'bo12', task: 'Stock glassware - highball, rocks, wine, pint, shot glasses', time: '15 min before', critical: true },
  { id: 'bo13', task: 'Check bar sinks have hot water, soap, sanitizer at 200ppm', time: '15 min before', critical: true },
  { id: 'bo14', task: 'Restock napkins, straws, stir sticks, and coasters at all stations', time: '10 min before', critical: false },
  { id: 'bo15', task: 'Check restrooms - stock supplies and clean', time: '10 min before', critical: true },
  { id: 'bo16', task: 'Turn on music system and adjust volume to appropriate level', time: '10 min before', critical: false },
  { id: 'bo17', task: 'Review 86 list (out of stock drinks) with all bartenders', time: '5 min before', critical: true },
  { id: 'bo18', task: 'Conduct pre-shift meeting - review specials, events, ID checking procedures', time: '5 min before', critical: false },
  { id: 'bo19', task: 'Final walkthrough - check cleanliness, lighting, temperature', time: 'At opening', critical: true },
  { id: 'bo20', task: 'Turn on "OPEN" sign and unlock doors', time: 'At opening', critical: true },
];

// BAR CLOSING CHECKLIST
const BAR_CLOSING_ITEMS: ChecklistItem[] = [
  { id: 'bc1', task: 'Call last call 30 minutes before closing, turn off "OPEN" sign', time: 'Last call', critical: true },
  { id: 'bc2', task: 'Lock front doors at closing time, no new entries', time: 'At closing', critical: true },
  { id: 'bc3', task: 'Clear and clean all tables, collect glassware and bottles', time: 'After closing', critical: true },
  { id: 'bc4', task: 'Count cash drawer and complete cash-out paperwork', time: 'After closing', critical: true },
  { id: 'bc5', task: 'Inventory all open bottles, record pour levels for liquor tracking', time: 'After closing', critical: true },
  { id: 'bc6', task: 'Return all backup liquor bottles to secure storage, lock liquor room', time: 'After closing', critical: true },
  { id: 'bc7', task: 'Clean and sanitize entire bar top, sinks, speed rails, and gun holsters', time: 'After closing', critical: true },
  { id: 'bc8', task: 'Run all glassware through glass washer, hand wash specialty glasses', time: 'After closing', critical: true },
  { id: 'bc9', task: 'Empty all ice wells, clean and sanitize wells and drains', time: 'After closing', critical: true },
  { id: 'bc10', task: 'Cover and store all fresh garnishes in refrigeration, discard old garnishes', time: 'After closing', critical: true },
  { id: 'bc11', task: 'Clean draft beer taps and drip trays thoroughly', time: 'After closing', critical: true },
  { id: 'bc12', task: 'Sweep and mop all bar floor areas, including behind bar', time: 'After closing', critical: true },
  { id: 'bc13', task: 'Empty and clean all trash cans, take trash to dumpster', time: 'After closing', critical: true },
  { id: 'bc14', task: 'Check and restock restroom supplies, clean restrooms', time: 'After closing', critical: true },
  { id: 'bc15', task: 'Turn off all bar equipment (blenders, glass washers)', time: 'After closing', critical: false },
  { id: 'bc16', task: 'Turn off music, lights, and adjust thermostat to night mode', time: 'Final step', critical: false },
  { id: 'bc17', task: 'Set alarm system and verify it is armed', time: 'Final step', critical: true },
  { id: 'bc18', task: 'Lock all doors and windows, turn off exterior lights upon exit', time: 'Final step', critical: true },
];

// NIGHTCLUB OPENING CHECKLIST
const NIGHTCLUB_OPENING_ITEMS: ChecklistItem[] = [
  { id: 'no1', task: 'Unlock all entrances and emergency exits, verify panic hardware works', time: '60 min before', critical: true },
  { id: 'no2', task: 'Turn on all sound and lighting systems, run system check', time: '60 min before', critical: true },
  { id: 'no3', task: 'Test DJ booth equipment - turntables, mixer, microphones', time: '55 min before', critical: true },
  { id: 'no4', task: 'Check all VIP areas - clean tables, restock bottles/mixers', time: '50 min before', critical: false },
  { id: 'no5', task: 'Stock all bars with ice - main bar, service bars, VIP bars', time: '50 min before', critical: true },
  { id: 'no6', task: 'Verify liquor inventory at all bar locations and restock from storage', time: '45 min before', critical: true },
  { id: 'no7', task: 'Turn on all refrigeration units - check beer coolers at 38°F', time: '45 min before', critical: true },
  { id: 'no8', task: 'Set up POS systems at all bars and door, verify starting cash ($500 main, $200 each bar)', time: '40 min before', critical: true },
  { id: 'no9', task: 'Clean and sanitize all bar tops, speed rails, and service areas', time: '40 min before', critical: true },
  { id: 'no10', task: 'Check dance floor - clean, check for hazards, test special effects (fog, CO2)', time: '35 min before', critical: true },
  { id: 'no11', task: 'Test all emergency lighting and exit signs', time: '35 min before', critical: true },
  { id: 'no12', task: 'Verify security team is present and conduct pre-shift security briefing', time: '30 min before', critical: true },
  { id: 'no13', task: 'Set up door station - ID scanners, wristbands, stamp, cover charge system', time: '30 min before', critical: true },
  { id: 'no14', task: 'Check all restrooms - stock supplies, clean thoroughly, verify all stalls lock', time: '25 min before', critical: true },
  { id: 'no15', task: 'Test coat check system if applicable', time: '20 min before', critical: false },
  { id: 'no16', task: 'Set lighting scheme for opening (dim/mood lighting)', time: '20 min before', critical: false },
  { id: 'no17', task: 'Conduct all-staff meeting - review dress code, event details, capacity limits', time: '15 min before', critical: true },
  { id: 'no18', task: 'Review guest list and VIP reservations with door staff', time: '10 min before', critical: false },
  { id: 'no19', task: 'Final walkthrough - capacity signs posted, fire extinguishers accessible', time: '5 min before', critical: true },
  { id: 'no20', task: 'Open doors, turn on exterior signage, begin admitting guests', time: 'At opening', critical: true },
];

// NIGHTCLUB CLOSING CHECKLIST
const NIGHTCLUB_CLOSING_ITEMS: ChecklistItem[] = [
  { id: 'nc1', task: 'Announce last call, stop admitting new guests at door', time: 'Last call', critical: true },
  { id: 'nc2', task: 'Turn on all house lights at closing time', time: 'At closing', critical: true },
  { id: 'nc3', task: 'Security begins clearing all areas - dance floor, VIP, restrooms', time: 'At closing', critical: true },
  { id: 'nc4', task: 'Lock front entrance, allow exit only through monitored door', time: 'At closing', critical: true },
  { id: 'nc5', task: 'Close all bars - stop serving alcohol immediately', time: 'At closing', critical: true },
  { id: 'nc6', task: 'Collect all glassware and bottles from tables, VIP areas, and dance floor', time: 'After closing', critical: true },
  { id: 'nc7', task: 'Count all cash drawers (door, main bar, service bars) and complete reports', time: 'After closing', critical: true },
  { id: 'nc8', task: 'Inventory liquor at all bar locations, record pour levels', time: 'After closing', critical: true },
  { id: 'nc9', task: 'Return all backup liquor to secure storage, lock liquor rooms', time: 'After closing', critical: true },
  { id: 'nc10', task: 'Clean and sanitize all bars - tops, sinks, speed rails, gun holsters', time: 'After closing', critical: true },
  { id: 'nc11', task: 'Run all glassware through washers, separate and hand wash specialty glasses', time: 'After closing', critical: true },
  { id: 'nc12', task: 'Empty all ice wells and clean thoroughly', time: 'After closing', critical: true },
  { id: 'nc13', task: 'Check all VIP areas for lost items, clean tables and seating', time: 'After closing', critical: false },
  { id: 'nc14', task: 'Sweep and mop entire venue - dance floor, bars, seating areas, entrances', time: 'After closing', critical: true },
  { id: 'nc15', task: 'Check restrooms for issues, restock supplies, clean thoroughly', time: 'After closing', critical: true },
  { id: 'nc16', task: 'Collect all trash from entire venue, take to dumpster', time: 'After closing', critical: true },
  { id: 'nc17', task: 'Turn off all sound and lighting equipment properly (no hard shutdowns)', time: 'After closing', critical: true },
  { id: 'nc18', task: 'Complete incident reports for any issues (fights, injuries, ejections)', time: 'Final step', critical: true },
  { id: 'nc19', task: 'Set alarm system, verify all zones are secure', time: 'Final step', critical: true },
  { id: 'nc20', task: 'Lock all doors, secure premises, turn off exterior lights upon exit', time: 'Final step', critical: true },
];

// Export all checklist templates
export const CHECKLIST_TEMPLATES = {
  restaurant: {
    opening: RESTAURANT_OPENING_ITEMS,
    closing: RESTAURANT_CLOSING_ITEMS,
  },
  bar: {
    opening: BAR_OPENING_ITEMS,
    closing: BAR_CLOSING_ITEMS,
  },
  nightclub: {
    opening: NIGHTCLUB_OPENING_ITEMS,
    closing: NIGHTCLUB_CLOSING_ITEMS,
  },
};
