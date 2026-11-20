export interface TraceabilitySpec {
  label: string;
  value: string;
  unit?: string;
}

export interface HarvestOriginStep {
  stage: string;
  date: string;
  location: string;
  coordinates: string;
  operator: string;
  metricLabel: string;
  metricValue: string;
}

export interface BotanicalLot {
  id: string;
  lotCode: string;
  name: string;
  botanicalName: string;
  category: 'Fermented Cacao' | 'Ceremonial Leaf' | 'Distillates & Oils' | 'Stigma & Extracts';
  originRegion: string;
  estateName: string;
  altitudeMeters: string;
  harvestSeason: string;
  image: string;
  purityPercent: string;
  moisturePercent: string;
  grade: string;
  activeCompound: string;
  pricePerKgUsd: number;
  samplePriceUsd: number;
  availableBulkKg: number;
  certifications: string[];
  editorialSummary: string;
  processingMethod: string;
  labVerifiedDate: string;
  labCertificateId: string;
  specs: TraceabilitySpec[];
  supplyChainTimeline: HarvestOriginStep[];
}

export const HERO_ESTATE_IMAGE = '/src/assets/images/hero_botanical_estate_1795133133902.jpg';

export const BOTANICAL_LOTS: BotanicalLot[] = [
  {
    id: 'criollo-cacao-01',
    lotCode: 'LOT-PE-2608-CR',
    name: 'Heirloom Chuncho Criollo Nibs & Paste',
    botanicalName: 'Theobroma cacao L. (var. Criollo)',
    category: 'Fermented Cacao',
    originRegion: 'Quillabamba Valley, Cusco, Peru',
    estateName: 'Cooperativa Alto Urubamba Sector IV',
    altitudeMeters: '1,240m – 1,410m MASL',
    harvestSeason: 'Late Dry Harvest · Oct 2026',
    image: '/src/assets/images/product_cacao_nibs_1795133133207.jpg',
    purityPercent: '99.84%',
    moisturePercent: '5.80%',
    grade: 'Export Grade AAA · Single-Estate',
    activeCompound: 'Theobromine 2.42% / Polyphenols 68.4 mg/g',
    pricePerKgUsd: 48.50,
    samplePriceUsd: 34.00,
    availableBulkKg: 1420,
    certifications: ['USDA Organic', 'EU Eco-Reg 848/21', 'Fair Wild Verified', 'ISO 22000 Lab Cleared'],
    editorialSummary:
      'Six-day anaerobic mahogany box fermentation followed by slow solar parabolic drying on raised cedar decks. Retains volatile floral linalool aromatics and high flavanol density without roasting bitterness.',
    processingMethod: '132-Hour Anaerobic Box Fermentation · Cold Stone Winnowed',
    labVerifiedDate: '2026-11-04',
    labCertificateId: 'COA-TP-88412-PE',
    specs: [
      { label: 'Lot Number', value: 'LOT-PE-2608-CR' },
      { label: 'Moisture Content (Karl Fischer)', value: '5.80% ± 0.12%' },
      { label: 'Botanical Purity Index', value: '99.84%' },
      { label: 'Fermentation Index (Cut Test)', value: '94.2% Fully Fermented' },
      { label: 'Theobromine Concentration', value: '24.2 mg/g' },
      { label: 'Cadmium (ICP-MS Analysis)', value: '0.08 mg/kg (Pass < 0.60)' },
      { label: 'Microbiological Total Plate', value: '< 100 CFU/g' },
      { label: 'Processing Completion Date', value: '28 Oct 2026' }
    ],
    supplyChainTimeline: [
      {
        stage: '01. Selective Pod Harvest',
        date: '14 Oct 2026',
        location: 'Alto Urubamba Parcel 12, Cusco',
        coordinates: '12°51′48″S 72°41′35″W',
        operator: 'Master Agronomist M. Quispe',
        metricLabel: 'Brix Pulp Sugar at Split',
        metricValue: '19.4 °Bx'
      },
      {
        stage: '02. Controlled Mahogany Box Fermentation',
        date: '15–20 Oct 2026',
        location: 'Quillabamba Central Fermentary',
        coordinates: '12°52′10″S 72°41′18″W',
        operator: 'Bio-Process Team B',
        metricLabel: 'Peak Core Thermal Profile',
        metricValue: '47.8 °C @ 96h'
      },
      {
        stage: '03. Solar Parabolic Deck Dehydration',
        date: '21–27 Oct 2026',
        location: 'Andean Solar Terrace #04',
        coordinates: '12°52′11″S 72°41′20″W',
        operator: 'Quality Control Lead R. Vargas',
        metricLabel: 'Terminal Equilibrium Moisture',
        metricValue: '5.80%'
      },
      {
        stage: '04. ICP-MS & HPLC Analytical Assay',
        date: '04 Nov 2026',
        location: 'Terra Pure Analytical Lab, Lima / Zurich',
        coordinates: '47°22′37″N 8°32′30″E',
        operator: 'Dr. H. Lindqvist, Chief Chemist',
        metricLabel: 'Heavy Metals & Mycotoxin Screen',
        metricValue: 'ND / Verified Pure'
      }
    ]
  },
  {
    id: 'uji-matcha-02',
    lotCode: 'LOT-JP-2605-UJ',
    name: 'First-Flush Shade-Grown Tencha Matcha',
    botanicalName: 'Camellia sinensis L. (Cultivar Samidori)',
    category: 'Ceremonial Leaf',
    originRegion: 'Wazuka Valley, Uji, Kyoto Prefecture',
    estateName: 'Asamiya Heritage Tea Collective',
    altitudeMeters: '380m – 520m MASL',
    harvestSeason: 'Ichibancha Spring Flush · May 2026',
    image: '/src/assets/images/product_ceremonial_matcha_1795133133127.jpg',
    purityPercent: '99.95%',
    moisturePercent: '3.40%',
    grade: 'Ceremonial Lab Grade · 8 Micron',
    activeCompound: 'L-Theanine 34.8 mg/g / EGCG 61.2 mg/g',
    pricePerKgUsd: 265.00,
    samplePriceUsd: 58.00,
    availableBulkKg: 340,
    certifications: ['JAS Organic Certified', 'USDA Organic', 'Radiation Cleared ISO-17025'],
    editorialSummary:
      'Covered under traditional honzu reed canopies for 26 days prior to hand-plucking to maximize chlorophyll and L-theanine amino acids. De-veined, flash-steamed for 15 seconds, and granite-milled at 40 RPM in nitrogen-purged darkrooms.',
    processingMethod: '26-Day Honzu Shaded · Granite Stone-Milled (8 µm)',
    labVerifiedDate: '2026-10-29',
    labCertificateId: 'COA-TP-79204-JP',
    specs: [
      { label: 'Lot Number', value: 'LOT-JP-2605-UJ' },
      { label: 'Moisture Content (Infrared Loss)', value: '3.40% ± 0.08%' },
      { label: 'Particle Size Distribution (D90)', value: '8.2 Microns (µm)' },
      { label: 'L-Theanine Amino Assay (HPLC)', value: '34.8 mg/g' },
      { label: 'Chlorophyll a+b Density', value: '7.94 mg/g' },
      { label: 'Pesticide Multi-Residue (510 Screen)', value: '0.000 ppm (Non-Detect)' },
      { label: 'Radionuclide Cs-134 / Cs-137', value: '< 1.0 Bq/kg (Non-Detect)' },
      { label: 'Milling & Nitrogen Seal Date', value: '25 Oct 2026' }
    ],
    supplyChainTimeline: [
      {
        stage: '01. 26-Day Honzu Canopy Shading',
        date: '12 Apr – 08 May 2026',
        location: 'Wazuka North Slope Plot 09',
        coordinates: '34°47′52″N 135°55′14″E',
        operator: 'Master Tea Agronomist K. Fujimoto',
        metricLabel: 'Photosynthetic Light Reduction',
        metricValue: '92.0% UV Block'
      },
      {
        stage: '02. Flash Steam & Tencha Aracha Drying',
        date: '09 May 2026',
        location: 'Uji Tencha Processing Mill',
        coordinates: '34°53′04″N 135°48′01″E',
        operator: 'Thermal Engineer S. Takahashi',
        metricLabel: 'Enzyme Inactivation Steam Window',
        metricValue: '16.5 Seconds @ 100°C'
      },
      {
        stage: '03. Cryo-Vault Maturation & Granite Milling',
        date: '22–25 Oct 2026',
        location: 'Kyoto Cleanroom Mikage Mill #14',
        coordinates: '34°58′22″N 135°45′19″E',
        operator: 'Mill Supervisor T. Nishimura',
        metricLabel: 'Granite Mill Yield Rate',
        metricValue: '38 Grams / Hour / Stone'
      },
      {
        stage: '04. Spectrophotometric & Amino Certification',
        date: '29 Oct 2026',
        location: 'Terra Pure Analytical Lab, Zurich',
        coordinates: '47°22′37″N 8°32′30″E',
        operator: 'Dr. H. Lindqvist, Chief Chemist',
        metricLabel: 'L-Theanine to Catechin Ratio',
        metricValue: '0.41 Optimal Index'
      }
    ]
  },
  {
    id: 'khorasan-saffron-03',
    lotCode: 'LOT-ES-2610-SF',
    name: 'Super Negin Crocus Sativus Stigma & Extract',
    botanicalName: 'Crocus sativus L. (Iridaceae)',
    category: 'Stigma & Extracts',
    originRegion: 'La Mancha High Plateau, Castilla, Spain',
    estateName: 'Finca Altiplano de Consuegra',
    altitudeMeters: '740m – 890m MASL',
    harvestSeason: 'Autumn Dawn Harvest · Nov 2026',
    image: '/src/assets/images/product_saffron_extract_1795133133852.jpg',
    purityPercent: '99.98%',
    moisturePercent: '8.10%',
    grade: 'ISO 3632 Category I · Score 278',
    activeCompound: 'Crocin 278 / Safranal 42 / Picrocrocin 98',
    pricePerKgUsd: 3420.00,
    samplePriceUsd: 95.00,
    availableBulkKg: 48,
    certifications: ['ISO 3632-2 Cat I', 'PDO La Mancha', 'EU Organic Certified', 'GMP Botanical Extract'],
    editorialSummary:
      'Harvested within a strict three-hour pre-dawn window prior to petal opening to prevent photodegradation of volatile safranal. Hand-stripped of yellow style filaments and dehydrated over indirect Holm oak embers.',
    processingMethod: 'Pre-Dawn Hand Separation · Low-Temp Dehydration',
    labVerifiedDate: '2026-11-12',
    labCertificateId: 'COA-TP-90115-ES',
    specs: [
      { label: 'Lot Number', value: 'LOT-ES-2610-SF' },
      { label: 'Moisture & Volatile Matter', value: '8.10% (ISO Max < 12.0%)' },
      { label: 'Crocin Coloring Strength (E1% 440nm)', value: '278.4 (ISO Cat I Min 200)' },
      { label: 'Picrocrocin Bitterness (E1% 257nm)', value: '98.2 (ISO Cat I Min 70)' },
      { label: 'Safranal Aroma Index (E1% 330nm)', value: '42.6 (Optimal 20–50)' },
      { label: 'Floral Waste & Foreign Matter', value: '0.02%' },
      { label: 'Synthetic Dye Adulteration (HPLC-DAD)', value: 'Negative / Pure Stigma' },
      { label: 'Assay Certification Date', value: '12 Nov 2026' }
    ],
    supplyChainTimeline: [
      {
        stage: '01. Pre-Dawn Corolla Plucking',
        date: '02 Nov 2026 · 05:15 CET',
        location: 'Consuegra Parcel 03, Toledo',
        coordinates: '39°27′43″N 3°36′29″W',
        operator: 'Field Director C. Mendoza',
        metricLabel: 'Ambient Field Temperature',
        metricValue: '6.2 °C (Closed Bud)'
      },
      {
        stage: '02. Manual Stigma Tri-Filament Stripping',
        date: '02 Nov 2026 · 10:30 CET',
        location: 'Consuegra Clean Sorting Hall',
        coordinates: '39°27′50″N 3°36′12″W',
        operator: 'Artisan Guild Unit 01',
        metricLabel: 'Red Stigma to Yellow Style Ratio',
        metricValue: '99.98% Pure Red Coupe'
      },
      {
        stage: '03. Controlled Silk-Screen Dehydration',
        date: '03 Nov 2026',
        location: 'Thermal Chamber ES-02',
        coordinates: '39°27′50″N 3°36′12″W',
        operator: 'Process Specialist J. Navarro',
        metricLabel: 'Mass Reduction Ratio',
        metricValue: '5.1 : 1 Fresh-to-Dry'
      },
      {
        stage: '04. UV-Vis Spectrophotometry ISO 3632',
        date: '12 Nov 2026',
        location: 'Terra Pure Analytical Lab, Zurich',
        coordinates: '47°22′37″N 8°32′30″E',
        operator: 'Dr. H. Lindqvist, Chief Chemist',
        metricLabel: 'Composite ISO 3632 Grade',
        metricValue: 'Category I Supra'
      }
    ]
  },
  {
    id: 'haiti-vetiver-04',
    lotCode: 'LOT-HT-2609-VT',
    name: 'Wild-Root Bourbon Vetiver Hydro-Distillate',
    botanicalName: 'Chrysopogon zizanioides (L.) Roberty',
    category: 'Distillates & Oils',
    originRegion: 'Les Cayes Volcanic Plain, Sud, Haiti',
    estateName: 'Distillerie Botanique de Massey',
    altitudeMeters: '210m – 440m MASL',
    harvestSeason: '24-Month Root Maturity · Sep 2026',
    image: '/src/assets/images/product_vetiver_oil_1795133133568.jpg',
    purityPercent: '100.00%',
    moisturePercent: '0.04%',
    grade: 'GC-MS Verified · Unrectified',
    activeCompound: 'Khusimol 14.8% / Beta-Vetivone 5.4%',
    pricePerKgUsd: 390.00,
    samplePriceUsd: 64.00,
    availableBulkKg: 215,
    certifications: ['Fair for Life Certified', 'ECOCERT Natural', 'IFRA 51st Compliant', 'REACH Registered'],
    editorialSummary:
      'Excavated only after 24 months of deep volcanic sandy-loam root development. Sun-cured for 72 hours and distilled for 30 continuous hours in low-pressure copper-lined steam stills to capture heavy sesquiterpene fractions.',
    processingMethod: '30-Hour Low-Pressure Steam Distillation',
    labVerifiedDate: '2026-10-19',
    labCertificateId: 'COA-TP-85390-HT',
    specs: [
      { label: 'Lot Number', value: 'LOT-HT-2609-VT' },
      { label: 'Trace Water Content (Karl Fischer)', value: '0.04%' },
      { label: 'Specific Gravity @ 20°C', value: '0.998 g/cm³' },
      { label: 'Refractive Index @ 20°C', value: '1.5242' },
      { label: 'Optical Rotation', value: '+24.6°' },
      { label: 'Khusimol Alcohol Fraction (GC-MS)', value: '14.82%' },
      { label: 'Acid Value', value: '18.4 mg KOH/g' },
      { label: 'Distillation & Amber Seal Date', value: '11 Oct 2026' }
    ],
    supplyChainTimeline: [
      {
        stage: '01. 24-Month Root Excavation & Soil Return',
        date: '22 Sep 2026',
        location: 'Massey Alluvial Terrace, Les Cayes',
        coordinates: '18°14′08″N 73°46′19″W',
        operator: 'Cooperative Lead J. Baptiste',
        metricLabel: 'Root Depth Profile',
        metricValue: '2.4 Meters Vertical'
      },
      {
        stage: '02. 30-Hour Copper-Head Steam Distillation',
        date: '26–27 Sep 2026',
        location: 'Les Cayes Alembic Still #03',
        coordinates: '18°11′40″N 73°45′02″W',
        operator: 'Master Distiller L. Moreau',
        metricLabel: 'Essential Oil Yield per Metric Ton',
        metricValue: '11.4 kg / MT Root'
      },
      {
        stage: '03. Decantation & Nitrogen Headspace Purge',
        date: '05 Oct 2026',
        location: 'Port-au-Prince Bonded Vault',
        coordinates: '18°32′21″N 72°20′11″W',
        operator: 'Quality Chemist A. Desrosiers',
        metricLabel: 'Peroxide Oxidation Value',
        metricValue: '< 1.2 meq O2/kg'
      },
      {
        stage: '04. GC-MS Fingerprint & Chirality Assay',
        date: '19 Oct 2026',
        location: 'Terra Pure Analytical Lab, Zurich',
        coordinates: '47°22′37″N 8°32′30″E',
        operator: 'Dr. H. Lindqvist, Chief Chemist',
        metricLabel: 'Sesquiterpene Profile Match',
        metricValue: '99.9% Authentic Bourbon'
      }
    ]
  }
];
