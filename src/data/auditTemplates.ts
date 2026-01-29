export interface AuditTemplate {
  id: string;
  name: string;
  category: 'health' | 'fire' | 'bar_safety' | 'internal';
  sections: AuditSection[];
}

export interface AuditSection {
  title: string;
  items: AuditItem[];
}

export interface AuditItem {
  id: string;
  question: string;
  critical: boolean;
  points: number;
}

export const auditTemplates: AuditTemplate[] = [
  {
    id: 'usda_health',
    name: 'USDA / Health Dept. Inspection Prep',
    category: 'health',
    sections: [
      {
        title: 'Food Source & Protection',
        items: [
          { id: 'h1', question: 'Food obtained from approved source', critical: true, points: 5 },
          { id: 'h2', question: 'Food received at proper temperature', critical: true, points: 5 },
          { id: 'h3', question: 'Food in good condition, safe, and unadulterated', critical: true, points: 5 },
          { id: 'h4', question: 'Proper separation of raw meats and ready-to-eat foods', critical: true, points: 5 },
          { id: 'h5', question: 'Food protected from contamination during storage', critical: false, points: 2 }
        ]
      },
      {
        title: 'Time & Temperature Control',
        items: [
          { id: 'h6', question: 'Proper cold holding temperatures (≤41°F)', critical: true, points: 5 },
          { id: 'h7', question: 'Proper hot holding temperatures (≥135°F)', critical: true, points: 5 },
          { id: 'h8', question: 'Proper cooling time and temperatures', critical: true, points: 5 },
          { id: 'h9', question: 'Proper reheating procedures for hot holding', critical: true, points: 5 },
          { id: 'h10', question: 'Thermometers provided and accurate', critical: false, points: 2 }
        ]
      },
      {
        title: 'Personnel & Hygiene',
        items: [
          { id: 'h11', question: 'Hands clean and properly washed', critical: true, points: 5 },
          { id: 'h12', question: 'No bare hand contact with ready-to-eat foods', critical: true, points: 5 },
          { id: 'h13', question: 'Adequate handwashing facilities supplied & accessible', critical: false, points: 3 },
          { id: 'h14', question: 'Hair restraints used properly', critical: false, points: 1 },
          { id: 'h15', question: 'Eating, drinking, or tobacco use in designated areas only', critical: false, points: 2 }
        ]
      },
      {
        title: 'Equipment & Utensils',
        items: [
          { id: 'h16', question: 'Food contact surfaces cleaned and sanitized', critical: true, points: 4 },
          { id: 'h17', question: 'Warewashing facilities installed, maintained, used', critical: false, points: 2 },
          { id: 'h18', question: 'Wiping cloths: properly used and stored', critical: false, points: 2 },
          { id: 'h19', question: 'Non-food contact surfaces clean', critical: false, points: 1 }
        ]
      },
      {
        title: 'Physical Facilities',
        items: [
          { id: 'h20', question: 'Hot and cold water available; adequate pressure', critical: true, points: 4 },
          { id: 'h21', question: 'Plumbing installed; proper backflow devices', critical: true, points: 4 },
          { id: 'h22', question: 'Sewage and waste water properly disposed', critical: true, points: 4 },
          { id: 'h23', question: 'Toilet facilities: properly constructed, supplied, cleaned', critical: false, points: 2 },
          { id: 'h24', question: 'Insects, rodents, and animals not present', critical: true, points: 4 }
        ]
      }
    ]
  },
  {
    id: 'fire_safety',
    name: 'Fire Marshal Inspection Prep',
    category: 'fire',
    sections: [
      {
        title: 'Exits & Egress',
        items: [
          { id: 'f1', question: 'Exit doors unlocked and unobstructed', critical: true, points: 10 },
          { id: 'f2', question: 'Exit signs illuminated and battery backup working', critical: true, points: 5 },
          { id: 'f3', question: 'Aisle widths maintained (min 36 inches)', critical: true, points: 5 },
          { id: 'f4', question: 'No storage in stairwells or exit paths', critical: true, points: 5 }
        ]
      },
      {
        title: 'Fire Protection Systems',
        items: [
          { id: 'f5', question: 'Fire extinguishers present, charged, and tagged (annual)', critical: true, points: 5 },
          { id: 'f6', question: 'Kitchen hood suppression system tagged (6-month)', critical: true, points: 5 },
          { id: 'f7', question: 'Sprinkler heads unobstructed (18" clearance)', critical: true, points: 5 },
          { id: 'f8', question: 'Fire alarm panel clear of trouble signals', critical: true, points: 5 }
        ]
      },
      {
        title: 'Electrical & Hazards',
        items: [
          { id: 'f9', question: 'No extension cords used for permanent power', critical: false, points: 5 },
          { id: 'f10', question: 'Electrical panels accessible (36" clearance)', critical: true, points: 5 },
          { id: 'f11', question: 'Compressed gas cylinders secured (CO2)', critical: true, points: 5 },
          { id: 'f12', question: 'Flammable liquids stored in approved cabinets', critical: true, points: 5 }
        ]
      }
    ]
  }
];
