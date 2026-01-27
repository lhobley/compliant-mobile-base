// FILE: src/data/inventoryData.ts
// Complete Alcohol Inventory (100 items)
// ===================================================================
export interface InventoryItemTemplate {
  category: string;
  name: string;
  brand: string;
  unit: string;
  typicalParLevel: number;
  avgCostPerUnit: number;
  supplierSKU?: string;
}

export const ALCOHOL_INVENTORY: InventoryItemTemplate[] = [
  // RED WINES (10)
  { category: 'Wine - Red', name: 'Cabernet Sauvignon', brand: 'Caymus Vineyards', unit: 'bottle', typicalParLevel: 12, avgCostPerUnit: 85.00, supplierSKU: 'CAY-CAB-750' },
  { category: 'Wine - Red', name: 'Pinot Noir', brand: 'Meiomi', unit: 'bottle', typicalParLevel: 18, avgCostPerUnit: 22.00, supplierSKU: 'MEI-PIN-750' },
  { category: 'Wine - Red', name: 'Malbec', brand: 'Catena', unit: 'bottle', typicalParLevel: 12, avgCostPerUnit: 18.00, supplierSKU: 'CAT-MAL-750' },
  { category: 'Wine - Red', name: 'Merlot', brand: 'Duckhorn', unit: 'bottle', typicalParLevel: 10, avgCostPerUnit: 52.00, supplierSKU: 'DUC-MER-750' },
  { category: 'Wine - Red', name: 'Zinfandel', brand: 'Seghesio', unit: 'bottle', typicalParLevel: 8, avgCostPerUnit: 28.00, supplierSKU: 'SEG-ZIN-750' },
  { category: 'Wine - Red', name: 'Chianti', brand: 'Ruffino Riserva Ducale', unit: 'bottle', typicalParLevel: 10, avgCostPerUnit: 24.00, supplierSKU: 'RUF-CHI-750' },
  { category: 'Wine - Red', name: 'Bordeaux Blend', brand: 'Château Pichon Baron', unit: 'bottle', typicalParLevel: 6, avgCostPerUnit: 125.00, supplierSKU: 'PIC-BOR-750' },
  { category: 'Wine - Red', name: 'Syrah/Shiraz', brand: 'Penfolds Grange', unit: 'bottle', typicalParLevel: 6, avgCostPerUnit: 650.00, supplierSKU: 'PEN-SYR-750' },
  { category: 'Wine - Red', name: 'Tempranillo', brand: 'Vega Sicilia Único', unit: 'bottle', typicalParLevel: 4, avgCostPerUnit: 380.00, supplierSKU: 'VEG-TEM-750' },
  { category: 'Wine - Red', name: 'Sangiovese', brand: 'Antinori Tignanello', unit: 'bottle', typicalParLevel: 8, avgCostPerUnit: 95.00, supplierSKU: 'ANT-SAN-750' },

  // WHITE WINES (10)
  { category: 'Wine - White', name: 'Chardonnay', brand: 'Kendall-Jackson', unit: 'bottle', typicalParLevel: 24, avgCostPerUnit: 14.00, supplierSKU: 'KJ-CHAR-750' },
  { category: 'Wine - White', name: 'Sauvignon Blanc', brand: 'Cloudy Bay', unit: 'bottle', typicalParLevel: 16, avgCostPerUnit: 32.00, supplierSKU: 'CLB-SAU-750' },
  { category: 'Wine - White', name: 'Pinot Grigio', brand: 'Santa Margherita', unit: 'bottle', typicalParLevel: 20, avgCostPerUnit: 24.00, supplierSKU: 'SAM-PIN-750' },
  { category: 'Wine - White', name: 'Riesling', brand: 'Trimbach', unit: 'bottle', typicalParLevel: 10, avgCostPerUnit: 28.00, supplierSKU: 'TRI-RIE-750' },
  { category: 'Wine - White', name: 'Moscato', brand: "Stella Rosa", unit: 'bottle', typicalParLevel: 15, avgCostPerUnit: 12.00, supplierSKU: 'STE-MOS-750' },
  { category: 'Wine - White', name: 'Viognier', brand: 'Condrieu E. Guigal', unit: 'bottle', typicalParLevel: 6, avgCostPerUnit: 68.00, supplierSKU: 'GUI-VIO-750' },
  { category: 'Wine - White', name: 'Gewürztraminer', brand: 'Hugel', unit: 'bottle', typicalParLevel: 8, avgCostPerUnit: 26.00, supplierSKU: 'HUG-GEW-750' },
  { category: 'Wine - White', name: 'Albariño', brand: 'Martin Codax', unit: 'bottle', typicalParLevel: 10, avgCostPerUnit: 16.00, supplierSKU: 'MAR-ALB-750' },
  { category: 'Wine - White', name: 'Chenin Blanc', brand: 'Vouvray Huet', unit: 'bottle', typicalParLevel: 6, avgCostPerUnit: 45.00, supplierSKU: 'HUE-CHE-750' },
  { category: 'Wine - White', name: 'Grüner Veltliner', brand: 'Loimer', unit: 'bottle', typicalParLevel: 8, avgCostPerUnit: 22.00, supplierSKU: 'LOI-GRU-750' },

  // CHAMPAGNE/SPARKLING (10)
  { category: 'Champagne/Sparkling', name: 'Brut Champagne', brand: 'Moët & Chandon Imperial', unit: 'bottle', typicalParLevel: 20, avgCostPerUnit: 55.00, supplierSKU: 'MOE-BRU-750' },
  { category: 'Champagne/Sparkling', name: 'Rosé Champagne', brand: 'Veuve Clicquot', unit: 'bottle', typicalParLevel: 12, avgCostPerUnit: 75.00, supplierSKU: 'VEU-ROS-750' },
  { category: 'Champagne/Sparkling', name: 'Prestige Cuvée', brand: 'Dom Pérignon', unit: 'bottle', typicalParLevel: 8, avgCostPerUnit: 210.00, supplierSKU: 'DOM-PRE-750' },
  { category: 'Champagne/Sparkling', name: 'Prosecco', brand: 'La Marca', unit: 'bottle', typicalParLevel: 30, avgCostPerUnit: 12.00, supplierSKU: 'LAM-PRO-750' },
  { category: 'Champagne/Sparkling', name: 'Cava', brand: 'Freixenet Cordon Negro', unit: 'bottle', typicalParLevel: 18, avgCostPerUnit: 10.00, supplierSKU: 'FRE-CAV-750' },
  { category: 'Champagne/Sparkling', name: 'Blanc de Blancs', brand: 'Ruinart', unit: 'bottle', typicalParLevel: 6, avgCostPerUnit: 85.00, supplierSKU: 'RUI-BLA-750' },
  { category: 'Champagne/Sparkling', name: 'Vintage Champagne', brand: 'Krug Grande Cuvée', unit: 'bottle', typicalParLevel: 4, avgCostPerUnit: 225.00, supplierSKU: 'KRU-VIN-750' },
  { category: 'Champagne/Sparkling', name: 'Crémant', brand: 'Crémant de Bourgogne Bailly Lapierre', unit: 'bottle', typicalParLevel: 10, avgCostPerUnit: 18.00, supplierSKU: 'BAI-CRE-750' },
  { category: 'Champagne/Sparkling', name: 'Lambrusco', brand: 'Riunite', unit: 'bottle', typicalParLevel: 12, avgCostPerUnit: 8.00, supplierSKU: 'RIU-LAM-750' },
  { category: 'Champagne/Sparkling', name: 'Sparkling Rosé', brand: 'Chandon Brut Rosé', unit: 'bottle', typicalParLevel: 14, avgCostPerUnit: 22.00, supplierSKU: 'CHA-SRO-750' },

  // BEERS (10)
  { category: 'Beer', name: 'Lager', brand: 'Stella Artois', unit: 'case (24)', typicalParLevel: 6, avgCostPerUnit: 32.00, supplierSKU: 'STE-LAG-24' },
  { category: 'Beer', name: 'IPA', brand: 'Lagunitas IPA', unit: 'case (24)', typicalParLevel: 8, avgCostPerUnit: 36.00, supplierSKU: 'LAG-IPA-24' },
  { category: 'Beer', name: 'Pale Ale', brand: 'Sierra Nevada', unit: 'case (24)', typicalParLevel: 6, avgCostPerUnit: 34.00, supplierSKU: 'SIE-PAL-24' },
  { category: 'Beer', name: 'Wheat Beer', brand: 'Blue Moon', unit: 'case (24)', typicalParLevel: 7, avgCostPerUnit: 30.00, supplierSKU: 'BLU-WHE-24' },
  { category: 'Beer', name: 'Stout', brand: 'Guinness Draught', unit: 'keg (1/2 barrel)', typicalParLevel: 2, avgCostPerUnit: 185.00, supplierSKU: 'GUI-STO-KEG' },
  { category: 'Beer', name: 'Pilsner', brand: 'Pilsner Urquell', unit: 'case (24)', typicalParLevel: 5, avgCostPerUnit: 38.00, supplierSKU: 'PIL-PIL-24' },
  { category: 'Beer', name: 'Light Beer', brand: 'Bud Light', unit: 'case (24)', typicalParLevel: 10, avgCostPerUnit: 22.00, supplierSKU: 'BUD-LIG-24' },
  { category: 'Beer', name: 'Craft Lager', brand: 'Sam Adams Boston Lager', unit: 'case (24)', typicalParLevel: 5, avgCostPerUnit: 33.00, supplierSKU: 'SAM-LAG-24' },
  { category: 'Beer', name: 'Amber Ale', brand: 'Fat Tire', unit: 'case (24)', typicalParLevel: 4, avgCostPerUnit: 32.00, supplierSKU: 'FAT-AMB-24' },
  { category: 'Beer', name: 'Mexican Lager', brand: 'Corona Extra', unit: 'case (24)', typicalParLevel: 8, avgCostPerUnit: 28.00, supplierSKU: 'COR-MEX-24' },

  // VODKAS (10)
  { category: 'Vodka', name: 'Premium Vodka', brand: 'Grey Goose', unit: 'liter', typicalParLevel: 6, avgCostPerUnit: 42.00, supplierSKU: 'GRE-VOD-1L' },
  { category: 'Vodka', name: 'Russian Vodka', brand: 'Belvedere', unit: 'liter', typicalParLevel: 5, avgCostPerUnit: 38.00, supplierSKU: 'BEL-VOD-1L' },
  { category: 'Vodka', name: 'Well Vodka', brand: 'Smirnoff', unit: 'liter', typicalParLevel: 10, avgCostPerUnit: 16.00, supplierSKU: 'SMI-VOD-1L' },
  { category: 'Vodka', name: 'Flavored Vodka - Citrus', brand: 'Absolut Citron', unit: 'liter', typicalParLevel: 4, avgCostPerUnit: 24.00, supplierSKU: 'ABS-CIT-1L' },
  { category: 'Vodka', name: 'Flavored Vodka - Vanilla', brand: 'Stolichnaya Vanilla', unit: 'liter', typicalParLevel: 3, avgCostPerUnit: 22.00, supplierSKU: 'STO-VAN-1L' },
  { category: 'Vodka', name: 'Craft Vodka', brand: 'Tito\'s Handmade', unit: 'liter', typicalParLevel: 8, avgCostPerUnit: 26.00, supplierSKU: 'TIT-VOD-1L' },
  { category: 'Vodka', name: 'Ultra-Premium Vodka', brand: 'Cîroc', unit: 'liter', typicalParLevel: 4, avgCostPerUnit: 45.00, supplierSKU: 'CIR-VOD-1L' },
  { category: 'Vodka', name: 'Polish Vodka', brand: 'Żubrówka Bison Grass', unit: 'liter', typicalParLevel: 2, avgCostPerUnit: 28.00, supplierSKU: 'ZUB-VOD-1L' },
  { category: 'Vodka', name: 'Organic Vodka', brand: 'Prairie Organic', unit: 'liter', typicalParLevel: 3, avgCostPerUnit: 20.00, supplierSKU: 'PRA-VOD-1L' },
  { category: 'Vodka', name: 'Luxury Vodka', brand: 'Crystal Head', unit: '750ml', typicalParLevel: 3, avgCostPerUnit: 52.00, supplierSKU: 'CRY-VOD-750' },

  // GINS (10)
  { category: 'Gin', name: 'London Dry Gin', brand: 'Tanqueray', unit: 'liter', typicalParLevel: 6, avgCostPerUnit: 28.00, supplierSKU: 'TAN-GIN-1L' },
  { category: 'Gin', name: 'Premium Gin', brand: 'Hendrick\'s', unit: 'liter', typicalParLevel: 5, avgCostPerUnit: 42.00, supplierSKU: 'HEN-GIN-1L' },
  { category: 'Gin', name: 'Well Gin', brand: 'Gordon\'s', unit: 'liter', typicalParLevel: 8, avgCostPerUnit: 18.00, supplierSKU: 'GOR-GIN-1L' },
  { category: 'Gin', name: 'Craft Gin', brand: 'The Botanist', unit: '750ml', typicalParLevel: 4, avgCostPerUnit: 38.00, supplierSKU: 'BOT-GIN-750' },
  { category: 'Gin', name: 'Classic Gin', brand: 'Beefeater', unit: 'liter', typicalParLevel: 6, avgCostPerUnit: 22.00, supplierSKU: 'BEE-GIN-1L' },
  { category: 'Gin', name: 'Floral Gin', brand: 'Bombay Sapphire', unit: 'liter', typicalParLevel: 7, avgCostPerUnit: 32.00, supplierSKU: 'BOM-GIN-1L' },
  { category: 'Gin', name: 'Navy Strength Gin', brand: 'Plymouth Navy Strength', unit: '750ml', typicalParLevel: 3, avgCostPerUnit: 36.00, supplierSKU: 'PLY-NAV-750' },
  { category: 'Gin', name: 'New Western Gin', brand: 'Aviation', unit: '750ml', typicalParLevel: 4, avgCostPerUnit: 32.00, supplierSKU: 'AVI-GIN-750' },
  { category: 'Gin', name: 'Barrel-Aged Gin', brand: 'Ransom Old Tom', unit: '750ml', typicalParLevel: 2, avgCostPerUnit: 42.00, supplierSKU: 'RAN-GIN-750' },
  { category: 'Gin', name: 'Japanese Gin', brand: 'Roku', unit: '750ml', typicalParLevel: 3, avgCostPerUnit: 34.00, supplierSKU: 'ROK-GIN-750' },

  // TEQUILAS (10)
  { category: 'Tequila', name: 'Blanco Tequila', brand: 'Patrón Silver', unit: 'liter', typicalParLevel: 6, avgCostPerUnit: 58.00, supplierSKU: 'PAT-BLA-1L' },
  { category: 'Tequila', name: 'Reposado Tequila', brand: 'Don Julio Reposado', unit: '750ml', typicalParLevel: 5, avgCostPerUnit: 52.00, supplierSKU: 'DON-REP-750' },
  { category: 'Tequila', name: 'Añejo Tequila', brand: 'Clase Azul Añejo', unit: '750ml', typicalParLevel: 3, avgCostPerUnit: 425.00, supplierSKU: 'CLA-ANE-750' },
  { category: 'Tequila', name: 'Well Tequila', brand: 'Jose Cuervo Especial', unit: 'liter', typicalParLevel: 8, avgCostPerUnit: 22.00, supplierSKU: 'JOS-WEL-1L' },
  { category: 'Tequila', name: 'Premium Blanco', brand: 'Casamigos Blanco', unit: '750ml', typicalParLevel: 6, avgCostPerUnit: 48.00, supplierSKU: 'CAS-BLA-750' },
  { category: 'Tequila', name: 'Cristalino', brand: 'Maestro Dobel Diamante', unit: '750ml', typicalParLevel: 4, avgCostPerUnit: 55.00, supplierSKU: 'DOB-CRI-750' },
  { category: 'Tequila', name: 'Extra Añejo', brand: '1800 Milenio', unit: '750ml', typicalParLevel: 2, avgCostPerUnit: 95.00, supplierSKU: '180-EXT-750' },
  { category: 'Tequila', name: 'Organic Tequila', brand: 'Espolòn Blanco', unit: 'liter', typicalParLevel: 5, avgCostPerUnit: 28.00, supplierSKU: 'ESP-BLA-1L' },
  { category: 'Tequila', name: 'Joven Tequila', brand: 'Herradura Legend', unit: '750ml', typicalParLevel: 3, avgCostPerUnit: 62.00, supplierSKU: 'HER-JOV-750' },
  { category: 'Tequila', name: 'Mezcal', brand: 'Del Maguey Vida', unit: '750ml', typicalParLevel: 4, avgCostPerUnit: 38.00, supplierSKU: 'DEL-MEZ-750' },

  // BOURBONS (10)
  { category: 'Bourbon', name: 'Small Batch Bourbon', brand: 'Maker\'s Mark', unit: 'liter', typicalParLevel: 6, avgCostPerUnit: 35.00, supplierSKU: 'MAK-BOU-1L' },
  { category: 'Bourbon', name: 'Premium Bourbon', brand: 'Woodford Reserve', unit: '750ml', typicalParLevel: 5, avgCostPerUnit: 38.00, supplierSKU: 'WOO-BOU-750' },
  { category: 'Bourbon', name: 'Well Bourbon', brand: 'Jim Beam', unit: 'liter', typicalParLevel: 8, avgCostPerUnit: 22.00, supplierSKU: 'JIM-BOU-1L' },
  { category: 'Bourbon', name: 'Wheated Bourbon', brand: 'Larceny', unit: '750ml', typicalParLevel: 4, avgCostPerUnit: 28.00, supplierSKU: 'LAR-BOU-750' },
  { category: 'Bourbon', name: 'High Rye Bourbon', brand: 'Four Roses Single Barrel', unit: '750ml', typicalParLevel: 4, avgCostPerUnit: 45.00, supplierSKU: 'FOU-BOU-750' },
  { category: 'Bourbon', name: 'Cask Strength', brand: 'Booker\'s', unit: '750ml', typicalParLevel: 3, avgCostPerUnit: 85.00, supplierSKU: 'BOO-BOU-750' },
  { category: 'Bourbon', name: 'Classic Bourbon', brand: 'Buffalo Trace', unit: '750ml', typicalParLevel: 7, avgCostPerUnit: 32.00, supplierSKU: 'BUF-BOU-750' },
  { category: 'Bourbon', name: 'Single Barrel', brand: 'Blanton\'s', unit: '750ml', typicalParLevel: 3, avgCostPerUnit: 75.00, supplierSKU: 'BLA-BOU-750' },
  { category: 'Bourbon', name: 'Kentucky Straight', brand: 'Evan Williams', unit: 'liter', typicalParLevel: 6, avgCostPerUnit: 18.00, supplierSKU: 'EVA-BOU-1L' },
  { category: 'Bourbon', name: 'Barrel Proof', brand: 'Elijah Craig Barrel Proof', unit: '750ml', typicalParLevel: 2, avgCostPerUnit: 68.00, supplierSKU: 'ELI-BAR-750' },

  // WHISKEYS (10)
  { category: 'Whiskey', name: 'Irish Whiskey', brand: 'Jameson', unit: 'liter', typicalParLevel: 8, avgCostPerUnit: 32.00, supplierSKU: 'JAM-IRI-1L' },
  { category: 'Whiskey', name: 'Scotch - Blended', brand: 'Johnnie Walker Black', unit: 'liter', typicalParLevel: 6, avgCostPerUnit: 42.00, supplierSKU: 'JOH-BLE-1L' },
  { category: 'Whiskey', name: 'Scotch - Single Malt', brand: 'Glenfiddich 12', unit: '750ml', typicalParLevel: 5, avgCostPerUnit: 52.00, supplierSKU: 'GLE-SIN-750' },
  { category: 'Whiskey', name: 'Scotch - Islay', brand: 'Laphroaig 10', unit: '750ml', typicalParLevel: 3, avgCostPerUnit: 58.00, supplierSKU: 'LAP-ISL-750' },
  { category: 'Whiskey', name: 'Canadian Whisky', brand: 'Crown Royal', unit: 'liter', typicalParLevel: 7, avgCostPerUnit: 28.00, supplierSKU: 'CRO-CAN-1L' },
  { category: 'Whiskey', name: 'Tennessee Whiskey', brand: 'Jack Daniel\'s', unit: 'liter', typicalParLevel: 9, avgCostPerUnit: 30.00, supplierSKU: 'JAC-TEN-1L' },
  { category: 'Whiskey', name: 'Rye Whiskey', brand: 'Bulleit Rye', unit: '750ml', typicalParLevel: 5, avgCostPerUnit: 32.00, supplierSKU: 'BUL-RYE-750' },
  { category: 'Whiskey', name: 'Japanese Whisky', brand: 'Yamazaki 12', unit: '750ml', typicalParLevel: 2, avgCostPerUnit: 145.00, supplierSKU: 'YAM-JAP-750' },
  { category: 'Whiskey', name: 'Scotch - Speyside', brand: 'Macallan 12 Double Cask', unit: '750ml', typicalParLevel: 4, avgCostPerUnit: 78.00, supplierSKU: 'MAC-SPE-750' },
  { category: 'Whiskey', name: 'Premium Irish', brand: 'Redbreast 12', unit: '750ml', typicalParLevel: 3, avgCostPerUnit: 65.00, supplierSKU: 'RED-IRI-750' },
];

