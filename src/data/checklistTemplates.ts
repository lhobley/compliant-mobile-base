export interface ChecklistTemplate {
  id: string;
  title: string;
  type: 'opening' | 'closing';
  venueType: 'restaurant' | 'bar' | 'nightclub';
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  critical: boolean;
  time?: string;
}

export const checklistTemplates: ChecklistTemplate[] = [
  // ==========================================
  // RESTAURANT CHECKLISTS
  // ==========================================
  {
    id: 'rest_open',
    title: 'Restaurant Opening Procedures',
    type: 'opening',
    venueType: 'restaurant',
    items: [
      { id: 'ro_1', task: 'Disable alarm system and unlock employee entrance', critical: true, time: '08:00' },
      { id: 'ro_2', task: 'Turn on all lights and check for burnt-out bulbs', critical: false },
      { id: 'ro_3', task: 'Adjust thermostat to comfortable temperature', critical: false },
      { id: 'ro_4', task: 'Check bathrooms for cleanliness and stock (TP, soap, towels)', critical: true },
      { id: 'ro_5', task: 'Inspect dining room floor for cleanliness', critical: false },
      { id: 'ro_6', task: 'Wipe down all tables and chairs', critical: true },
      { id: 'ro_7', task: 'Check reservation list for the day and plan seating', critical: false },
      { id: 'ro_8', task: 'Turn on POS system and verify connection', critical: true },
      { id: 'ro_9', task: 'Count cash drawers and verify starting banks', critical: true },
      { id: 'ro_10', task: 'Turn on kitchen equipment (ovens, grills, fryers)', critical: true },
      { id: 'ro_11', task: 'Check line coolers for proper temperature (<41°F)', critical: true },
      { id: 'ro_12', task: 'Verify prep lists and par levels for the day', critical: true },
      { id: 'ro_13', task: 'Set up sanitizer buckets (check concentration)', critical: true },
      { id: 'ro_14', task: 'Unlock front doors', critical: true, time: '11:00' },
      { id: 'ro_15', task: 'Turn on music/ambiance', critical: false },
      { id: 'ro_16', task: 'Check host stand supplies (menus, crayons, mints)', critical: false },
      { id: 'ro_17', task: 'Conduct pre-shift meeting with staff', critical: false },
      { id: 'ro_18', task: 'Verify all staff are in proper uniform', critical: false }
    ]
  },
  {
    id: 'rest_close',
    title: 'Restaurant Closing Procedures',
    type: 'closing',
    venueType: 'restaurant',
    items: [
      { id: 'rc_1', task: 'Lock front doors after last guest leaves', critical: true },
      { id: 'rc_2', task: 'Check all tables for remaining items/guests', critical: true },
      { id: 'rc_3', task: 'Clean and sanitize all tabletops and chairs', critical: true },
      { id: 'rc_4', task: 'Sweep and mop dining room floors', critical: true },
      { id: 'rc_5', task: 'Clean bathrooms and restock for morning', critical: true },
      { id: 'rc_6', task: 'Break down soda station/bar area', critical: false },
      { id: 'rc_7', task: 'Restock condiment holders and salt/pepper', critical: false },
      { id: 'rc_8', task: 'Run checkout reports on POS', critical: true },
      { id: 'rc_9', task: 'Count cash drawers and drop deposit in safe', critical: true },
      { id: 'rc_10', task: 'Turn off music and non-essential lights', critical: false },
      { id: 'rc_11', task: 'Flip/cover all food on the line', critical: true },
      { id: 'rc_12', task: 'Label and date all new prep items', critical: true },
      { id: 'rc_13', task: 'Turn off and clean kitchen equipment (grills, fryers)', critical: true },
      { id: 'rc_14', task: 'Wash all remaining dishes and clean dish pit', critical: false },
      { id: 'rc_15', task: 'Take out all trash and replace liners', critical: true },
      { id: 'rc_16', task: 'Lock employee entrance', critical: true },
      { id: 'rc_17', task: 'Set alarm system', critical: true },
      { id: 'rc_18', task: 'Turn off main lights', critical: false }
    ]
  },

  // ==========================================
  // BAR CHECKLISTS
  // ==========================================
  {
    id: 'bar_open',
    title: 'Bar Opening Procedures',
    type: 'opening',
    venueType: 'bar',
    items: [
      { id: 'bo_1', task: 'Unlock premises and disable alarm', critical: true },
      { id: 'bo_2', task: 'Turn on lights and bar signs (Neon/LED)', critical: false },
      { id: 'bo_3', task: 'Inspect bar top and stools for cleanliness', critical: true },
      { id: 'bo_4', task: 'Check keg temperatures and pressure', critical: true },
      { id: 'bo_5', task: 'Restock bar garnishes (lemons, limes, cherries)', critical: false },
      { id: 'bo_6', task: 'Fill ice bins', critical: true },
      { id: 'bo_7', task: 'Restock beer coolers and liquor display', critical: false },
      { id: 'bo_8', task: 'Check glassware supply (clean and cooled)', critical: true },
      { id: 'bo_9', task: 'Setup bar mats, shakers, and tools', critical: false },
      { id: 'bo_10', task: 'Prepare fruit juices/mixers for the shift', critical: false },
      { id: 'bo_11', task: 'Verify POS terminals are online', critical: true },
      { id: 'bo_12', task: 'Count bank and verify float', critical: true },
      { id: 'bo_13', task: 'Check bathrooms for cleanliness', critical: true },
      { id: 'bo_14', task: 'Wipe down TVs and turn on sports/news', critical: false },
      { id: 'bo_15', task: 'Turn on music system', critical: false },
      { id: 'bo_16', task: 'Unlock front door', critical: true },
      { id: 'bo_17', task: 'Check inventory for low stock items', critical: false },
      { id: 'bo_18', task: 'Setup sanitation buckets', critical: true },
      { id: 'bo_19', task: 'Verify ID scanner is charged/working', critical: true },
      { id: 'bo_20', task: 'Brief security staff (if applicable)', critical: false }
    ]
  },
  {
    id: 'bar_close',
    title: 'Bar Closing Procedures',
    type: 'closing',
    venueType: 'bar',
    items: [
      { id: 'bc_1', task: 'Last call announcement', critical: false },
      { id: 'bc_2', task: 'Lock doors (allow guests to exit only)', critical: true },
      { id: 'bc_3', task: 'Clear all glasses and bottles from tables/bar', critical: true },
      { id: 'bc_4', task: 'Wipe down bar top and tables with sanitizer', critical: true },
      { id: 'bc_5', task: 'Burn ice (melt ice in bins with hot water)', critical: true },
      { id: 'bc_6', task: 'Clean and sanitize ice bins', critical: true },
      { id: 'bc_7', task: 'Cover and store garnishes in cooler', critical: false },
      { id: 'bc_8', task: 'Cap liquor bottles and store valuables', critical: true },
      { id: 'bc_9', task: 'Clean beer taps and drain trays', critical: false },
      { id: 'bc_10', task: 'Wash all bar tools and shakers', critical: false },
      { id: 'bc_11', task: 'Run dishwasher for final glassware load', critical: false },
      { id: 'bc_12', task: 'Sweep and mop behind the bar', critical: true },
      { id: 'bc_13', task: 'Sweep and mop customer area', critical: false },
      { id: 'bc_14', task: 'Count drawer and secure cash in safe', critical: true },
      { id: 'bc_15', task: 'Take out trash and recyclables', critical: true },
      { id: 'bc_16', task: 'Turn off TVs and music', critical: false },
      { id: 'bc_17', task: 'Clean bathrooms', critical: true },
      { id: 'bc_18', task: 'Set alarm and lock up', critical: true }
    ]
  },

  // ==========================================
  // NIGHTCLUB CHECKLISTS
  // ==========================================
  {
    id: 'club_open',
    title: 'Nightclub Opening Procedures',
    type: 'opening',
    venueType: 'nightclub',
    items: [
      { id: 'no_1', task: 'Security sweep of entire venue', critical: true, time: '20:00' },
      { id: 'no_2', task: 'Test metal detectors and ID scanners', critical: true },
      { id: 'no_3', task: 'Brief security team on VIPs and banned list', critical: true },
      { id: 'no_4', task: 'Check fire exits are clear and unlocked', critical: true },
      { id: 'no_5', task: 'Sound system check with DJ/Sound Engineer', critical: false },
      { id: 'no_6', task: 'Lighting system check (strobes, movers, haze)', critical: false },
      { id: 'no_7', task: 'VIP tables setup (bottles, sparklers, mixers)', critical: false },
      { id: 'no_8', task: 'Stock all bars with ice, glassware, and liquor', critical: true },
      { id: 'no_9', task: 'Verify cash banks for all 4 bars', critical: true },
      { id: 'no_10', task: 'Check coat check supplies and tickets', critical: false },
      { id: 'no_11', task: 'Restroom attendant station setup', critical: false },
      { id: 'no_12', task: 'Clean and inspect dance floor (no hazards)', critical: true },
      { id: 'no_13', task: 'Ensure medical kit is stocked and accessible', critical: true },
      { id: 'no_14', task: 'Staff uniform and grooming check', critical: false },
      { id: 'no_15', task: 'Review guest list and table reservations', critical: false },
      { id: 'no_16', task: 'Position security at all stations', critical: true },
      { id: 'no_17', task: 'Unlock front doors', critical: true, time: '22:00' },
      { id: 'no_18', task: 'Start clicker count for occupancy tracking', critical: true },
      { id: 'no_19', task: 'Check radio communication channels', critical: true },
      { id: 'no_20', task: 'Verify promoter list at door', critical: false }
    ]
  },
  {
    id: 'club_close',
    title: 'Nightclub Closing Procedures',
    type: 'closing',
    venueType: 'nightclub',
    items: [
      { id: 'nc_1', task: 'House lights up', critical: true, time: '02:00' },
      { id: 'nc_2', task: 'Cut off alcohol service (all bars)', critical: true },
      { id: 'nc_3', task: 'Security sweep to clear venue of guests', critical: true },
      { id: 'nc_4', task: 'Check bathrooms for stragglers', critical: true },
      { id: 'nc_5', task: 'Collect all glassware from floor/tables', critical: false },
      { id: 'nc_6', task: 'Secure all full liquor bottles in lockup', critical: true },
      { id: 'nc_7', task: 'Count and verify all cash banks (with manager)', critical: true },
      { id: 'nc_8', task: 'Drop cash in safe immediately', critical: true },
      { id: 'nc_9', task: 'Clean vomit/spills with biohazard kit if needed', critical: true },
      { id: 'nc_10', task: 'Sweep and mop dance floor', critical: true },
      { id: 'nc_11', task: 'Take out trash (glass recycling separate)', critical: false },
      { id: 'nc_12', task: 'Clean and restock VIP areas', critical: false },
      { id: 'nc_13', task: 'Power down sound and light systems', critical: false },
      { id: 'nc_14', task: 'Coat check reconciliation', critical: false },
      { id: 'nc_15', task: 'Collect radios and charge them', critical: false },
      { id: 'nc_16', task: 'Incident reports filed (if any fights/injuries)', critical: true },
      { id: 'nc_17', task: 'Lock all fire exits and perimeter doors', critical: true },
      { id: 'nc_18', task: 'Final manager walkthrough', critical: true },
      { id: 'nc_19', task: 'Set main alarm', critical: true },
      { id: 'nc_20', task: 'Lock front gates', critical: true }
    ]
  }
];
