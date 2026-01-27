import { AuditTemplate } from '@/lib/firebaseCollections';

export const USDA_HEALTH_SAFETY_AUDIT: AuditTemplate = {
  id: 'usda-health-safety',
  name: 'USDA Health & Safety Pre-Opening Audit',
  auditType: 'pre_opening',
  category: 'Food Safety',
  sections: [
    {
      category: 'Food Storage & Temperature Control',
      items: [
        { id: 'fs1', requirement: 'All refrigeration units at 41°F or below', critical: true, violationPoints: 10 },
        { id: 'fs2', requirement: 'Freezers at 0°F or below', critical: true, violationPoints: 10 },
        { id: 'fs3', requirement: 'Food stored 6 inches off floor', critical: true, violationPoints: 8 },
        { id: 'fs4', requirement: 'Raw meats stored below ready-to-eat foods', critical: true, violationPoints: 10 },
        { id: 'fs5', requirement: 'All food labeled with dates', critical: true, violationPoints: 5 },
        { id: 'fs6', requirement: 'FIFO (First In First Out) system implemented', critical: false, violationPoints: 3 },
        { id: 'fs7', requirement: 'Dry storage area clean, dry, and organized', critical: false, violationPoints: 3 },
        { id: 'fs8', requirement: 'No bulging or dented cans', critical: true, violationPoints: 8 },
      ],
    },
    {
      category: 'Kitchen Equipment & Facilities',
      items: [
        { id: 'ke1', requirement: 'Three-compartment sink functional and sanitized', critical: true, violationPoints: 10 },
        { id: 'ke2', requirement: 'Hand sinks with hot water (100°F minimum), soap, paper towels', critical: true, violationPoints: 10 },
        { id: 'ke3', requirement: 'All cooking equipment clean and functional', critical: true, violationPoints: 8 },
        { id: 'ke4', requirement: 'Sanitizer buckets at proper concentration (200ppm)', critical: true, violationPoints: 8 },
        { id: 'ke5', requirement: 'Thermometers calibrated and available', critical: true, violationPoints: 5 },
        { id: 'ke6', requirement: 'Cutting boards color-coded and sanitized', critical: false, violationPoints: 3 },
        { id: 'ke7', requirement: 'Floors, walls, ceilings clean and in good repair', critical: false, violationPoints: 5 },
        { id: 'ke8', requirement: 'Grease traps clean and functional', critical: false, violationPoints: 5 },
      ],
    },
    {
      category: 'Employee Health & Hygiene',
      items: [
        { id: 'eh1', requirement: 'All employees have valid food handlers certificates', critical: true, violationPoints: 10 },
        { id: 'eh2', requirement: 'Employee health policy posted', critical: true, violationPoints: 5 },
        { id: 'eh3', requirement: 'Hair restraints available for all staff', critical: true, violationPoints: 5 },
        { id: 'eh4', requirement: 'No jewelry worn except plain wedding band', critical: false, violationPoints: 3 },
        { id: 'eh5', requirement: 'Clean uniforms/aprons for all staff', critical: false, violationPoints: 3 },
        { id: 'eh6', requirement: 'Employee illness reporting log maintained', critical: true, violationPoints: 8 },
      ],
    },
    {
      category: 'Pest Control & Sanitation',
      items: [
        { id: 'pc1', requirement: 'No evidence of pests (droppings, gnaw marks)', critical: true, violationPoints: 10 },
        { id: 'pc2', requirement: 'Pest control service contract active', critical: false, violationPoints: 5 },
        { id: 'pc3', requirement: 'All entry points sealed', critical: false, violationPoints: 5 },
        { id: 'pc4', requirement: 'Trash receptacles covered and emptied regularly', critical: true, violationPoints: 8 },
        { id: 'pc5', requirement: 'Dumpster area clean and doors close properly', critical: false, violationPoints: 3 },
      ],
    },
    {
      category: 'Permits & Documentation',
      items: [
        { id: 'pd1', requirement: 'Health permit displayed in public area', critical: true, violationPoints: 10 },
        { id: 'pd2', requirement: 'Food safety plan on file', critical: true, violationPoints: 8 },
        { id: 'pd3', requirement: 'Temperature logs maintained daily', critical: true, violationPoints: 5 },
        { id: 'pd4', requirement: 'Cleaning schedules posted and followed', critical: false, violationPoints: 3 },
        { id: 'pd5', requirement: 'Emergency contact numbers posted', critical: false, violationPoints: 2 },
      ],
    },
  ],
};

export const HEALTH_CODE_AUDIT: AuditTemplate = {
  id: 'health-code',
  name: 'Routine Health Code Audit',
  auditType: 'health_code',
  category: 'Food Safety',
  sections: [
    {
      category: 'Food Handling & Preparation',
      items: [
        { id: 'fh1', requirement: 'Hot foods held at 135°F or above', critical: true, violationPoints: 10 },
        { id: 'fh2', requirement: 'Cold foods held at 41°F or below', critical: true, violationPoints: 10 },
        { id: 'fh3', requirement: 'Foods cooled from 135°F to 70°F within 2 hours', critical: true, violationPoints: 10 },
        { id: 'fh4', requirement: 'Foods cooled from 70°F to 41°F within 4 hours', critical: true, violationPoints: 10 },
        { id: 'fh5', requirement: 'Thawing conducted properly (refrigerator, cold running water, or microwave)', critical: true, violationPoints: 8 },
        { id: 'fh6', requirement: 'Cross-contamination prevention observed', critical: true, violationPoints: 10 },
        { id: 'fh7', requirement: 'Proper cooking temperatures met (165°F poultry, 155°F ground meat, 145°F seafood)', critical: true, violationPoints: 10 },
        { id: 'fh8', requirement: 'Bare hand contact with ready-to-eat foods avoided', critical: true, violationPoints: 8 },
      ],
    },
    {
      category: 'Cleaning & Sanitizing',
      items: [
        { id: 'cs1', requirement: 'Food contact surfaces cleaned and sanitized after each use', critical: true, violationPoints: 8 },
        { id: 'cs2', requirement: 'Utensils stored in sanitizer solution or clean/dry', critical: true, violationPoints: 5 },
        { id: 'cs3', requirement: 'Wiping cloths stored in sanitizer between uses', critical: true, violationPoints: 5 },
        { id: 'cs4', requirement: 'Dishwasher reaching proper temperatures (150°F wash, 180°F rinse)', critical: true, violationPoints: 8 },
        { id: 'cs5', requirement: 'Chemical sanitizer at proper concentration', critical: true, violationPoints: 8 },
        { id: 'cs6', requirement: 'Test strips available and used', critical: false, violationPoints: 3 },
      ],
    },
    {
      category: 'Personal Hygiene Compliance',
      items: [
        { id: 'ph1', requirement: 'Employees wash hands before food prep', critical: true, violationPoints: 10 },
        { id: 'ph2', requirement: 'Handwashing signs posted in restrooms', critical: true, violationPoints: 5 },
        { id: 'ph3', requirement: 'Gloves used properly and changed when contaminated', critical: true, violationPoints: 8 },
        { id: 'ph4', requirement: 'No eating, drinking, or smoking in food prep areas', critical: true, violationPoints: 8 },
        { id: 'ph5', requirement: 'Open wounds covered with waterproof bandage and glove', critical: true, violationPoints: 10 },
      ],
    },
    {
      category: 'Facilities Maintenance',
      items: [
        { id: 'fm1', requirement: 'Plumbing in good repair, no leaks', critical: false, violationPoints: 5 },
        { id: 'fm2', requirement: 'Adequate lighting in all areas', critical: false, violationPoints: 3 },
        { id: 'fm3', requirement: 'Ventilation adequate, no excessive grease buildup', critical: false, violationPoints: 5 },
        { id: 'fm4', requirement: 'Floor drains clean and functional', critical: false, violationPoints: 3 },
        { id: 'fm5', requirement: 'Walls and ceilings smooth, cleanable, in good repair', critical: false, violationPoints: 3 },
      ],
    },
  ],
};

export const FIRE_SAFETY_AUDIT: AuditTemplate = {
  id: 'fire-safety',
  name: 'Fire & Safety Audit',
  auditType: 'fire_safety',
  category: 'Safety',
  sections: [
    {
      category: 'Fire Suppression Systems',
      items: [
        { id: 'fire1', requirement: 'Kitchen hood suppression system inspected within last 6 months', critical: true, violationPoints: 10 },
        { id: 'fire2', requirement: 'Fire extinguishers fully charged and inspected monthly', critical: true, violationPoints: 10 },
        { id: 'fire3', requirement: 'Fire extinguishers accessible and visible (within 75 feet)', critical: true, violationPoints: 8 },
        { id: 'fire4', requirement: 'K-class extinguisher present in kitchen', critical: true, violationPoints: 10 },
        { id: 'fire5', requirement: 'ABC extinguishers in dining/bar areas', critical: true, violationPoints: 8 },
        { id: 'fire6', requirement: 'Fire suppression system pull station accessible', critical: true, violationPoints: 10 },
        { id: 'fire7', requirement: 'Sprinkler system inspected annually', critical: true, violationPoints: 10 },
        { id: 'fire8', requirement: 'No storage blocking sprinkler heads (18-inch clearance)', critical: true, violationPoints: 8 },
      ],
    },
    {
      category: 'Emergency Exits & Lighting',
      items: [
        { id: 'exit1', requirement: 'All exit doors unobstructed and unlocked during business hours', critical: true, violationPoints: 10 },
        { id: 'exit2', requirement: 'Exit signs illuminated and visible', critical: true, violationPoints: 10 },
        { id: 'exit3', requirement: 'Emergency lighting functional (test monthly)', critical: true, violationPoints: 8 },
        { id: 'exit4', requirement: 'Exit pathways clear and marked', critical: true, violationPoints: 8 },
        { id: 'exit5', requirement: 'Panic hardware on exit doors functional', critical: true, violationPoints: 10 },
        { id: 'exit6', requirement: 'Maximum occupancy sign posted', critical: true, violationPoints: 5 },
        { id: 'exit7', requirement: 'Floor plan with exits posted', critical: false, violationPoints: 3 },
      ],
    },
    {
      category: 'Electrical Safety',
      items: [
        { id: 'elec1', requirement: 'No overloaded outlets or extension cords', critical: true, violationPoints: 8 },
        { id: 'elec2', requirement: 'Electrical panels accessible with 36-inch clearance', critical: true, violationPoints: 8 },
        { id: 'elec3', requirement: 'GFCI outlets in wet areas (kitchen, bar)', critical: true, violationPoints: 8 },
        { id: 'elec4', requirement: 'No exposed wiring or damaged cords', critical: true, violationPoints: 8 },
        { id: 'elec5', requirement: 'Electrical equipment properly grounded', critical: false, violationPoints: 5 },
      ],
    },
    {
      category: 'Hazardous Materials',
      items: [
        { id: 'haz1', requirement: 'Chemicals stored away from food and labeled', critical: true, violationPoints: 10 },
        { id: 'haz2', requirement: 'Safety Data Sheets (SDS) available for all chemicals', critical: true, violationPoints: 8 },
        { id: 'haz3', requirement: 'Cleaning chemicals in original containers or properly labeled', critical: true, violationPoints: 8 },
        { id: 'haz4', requirement: 'Flammable materials stored properly', critical: true, violationPoints: 8 },
        { id: 'haz5', requirement: 'Propane tanks stored outside in secure area', critical: true, violationPoints: 10 },
      ],
    },
    {
      category: 'Staff Training & Preparedness',
      items: [
        { id: 'train1', requirement: 'Staff trained on fire evacuation procedures', critical: false, violationPoints: 5 },
        { id: 'train2', requirement: 'Fire drill conducted annually', critical: false, violationPoints: 5 },
        { id: 'train3', requirement: 'First aid kit fully stocked and accessible', critical: false, violationPoints: 5 },
        { id: 'train4', requirement: 'At least one staff member CPR/First Aid certified per shift', critical: false, violationPoints: 3 },
        { id: 'train5', requirement: 'Emergency contact numbers posted', critical: false, violationPoints: 2 },
      ],
    },
  ],
};

export const ALL_AUDIT_TEMPLATES = [
  USDA_HEALTH_SAFETY_AUDIT,
  HEALTH_CODE_AUDIT,
  FIRE_SAFETY_AUDIT,
];
