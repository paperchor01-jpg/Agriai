import { VerifiedPestDiseaseGuide } from './types';

/**
 * ICAR-Verified Pest & Disease Diagnostic Knowledge Base
 * Extracted from ICAR-NCIPM (National Research Centre for Integrated Pest Management)
 */
export const VERIFIED_PEST_DISEASE_GUIDES: VerifiedPestDiseaseGuide[] = [
  {
    id: 'wheat-leaf-rust',
    crop: 'Wheat',
    conditionName: 'Brown / Leaf Rust',
    pathogenType: 'Fungal',
    scientificName: 'Puccinia triticina',
    visibleSymptoms: [
      'Small, round-to-oval orange-brown pustules scattered irregularly across upper leaf surface',
      'Pustules rub off as reddish-brown powder on fingertips',
      'Premature leaf senescence and reduced grain filling weight',
    ],
    affectedPlantParts: ['Leaves'],
    conduciveConditions: {
      minHumidityPercent: 70,
      tempRangeC: [15, 25],
    },
    preventiveMeasures: [
      'Grow resistant varieties approved for the agro-climatic zone (e.g. PBW-725, HD-3086)',
      'Adhere to timely sowing window (late-sown crops suffer higher rust incidence)',
      'Avoid excessive Nitrogen fertilizer which increases foliar lushness and pathogen spread',
    ],
    integratedPestManagement: [
      'Scout fields weekly starting in January during tillering/jointing stages',
      'If isolated pustules appear, spray Propiconazole 25% EC @ 1 ml/litre water or Tebuconazole 25.9% EC @ 1 ml/litre water with 200 litres water/acre',
      'Repeat spray after 15 days only if disease progression continues',
    ],
    certifiedSource: 'ICAR-IIWBR Karnal Rust Surveillance Protocol',
  },
  {
    id: 'wheat-yellow-rust',
    crop: 'Wheat',
    conditionName: 'Stripe / Yellow Rust',
    pathogenType: 'Fungal',
    scientificName: 'Puccinia striiformis',
    visibleSymptoms: [
      'Yellow/lemon-colored pustules arranged in narrow linear stripes parallel to leaf veins',
      'Yellow powder on leaves and leaf sheaths',
      'Early season focal patches ("foci") appearing during cool foggy conditions',
    ],
    affectedPlantParts: ['Leaves', 'Stem'],
    conduciveConditions: {
      minHumidityPercent: 75,
      tempRangeC: [8, 18],
    },
    preventiveMeasures: [
      'Sow stripe-rust resistant cultivars (e.g. DBW-187, DBW-303)',
      'Scout northern districts and sub-mountainous tracts during December-January',
    ],
    integratedPestManagement: [
      'Immediate spot spray upon first detection to prevent secondary epidemic spread',
      'Apply Propiconazole 25% EC (Tilt) @ 200 ml in 200 litres water per acre',
      'Avoid field irrigation during humid windy days to limit airborne spore transfer',
    ],
    certifiedSource: 'ICAR-IIWBR / PAU Ludhiana Agro-Advisory',
  },
  {
    id: 'paddy-bacterial-blight',
    crop: 'Paddy (Rice)',
    conditionName: 'Bacterial Leaf Blight (BLB)',
    pathogenType: 'Bacterial',
    scientificName: 'Xanthomonas oryzae pv. oryzae',
    visibleSymptoms: [
      'Water-soaked to yellowish-white lesions starting at leaf margins and expanding downward',
      'Wavy lesion margins along leaf edges',
      'Milky bacterial exudate droplets visible on lesions in early morning dew',
    ],
    affectedPlantParts: ['Leaves'],
    conduciveConditions: {
      minHumidityPercent: 80,
      tempRangeC: [25, 34],
      waterlogging: true,
    },
    preventiveMeasures: [
      'Grow resistant varieties (e.g. PR-126, PR-121)',
      'Seed treatment with Streptocycline (1 g) + Copper Oxychloride (20 g) per 10 kg seed',
      'Balanced NPK ratio; avoid excessive urea during humid overcast monsoon spells',
    ],
    integratedPestManagement: [
      'Drain standing water from field for 3-4 days to arrest bacterial proliferation',
      'Top-dress additional Potassium (MOP @ 10-15 kg/acre) to strengthen cell walls',
      'Spray Streptocycline @ 6 g + Copper Oxychloride @ 300 g in 150 litres water per acre',
    ],
    certifiedSource: 'ICAR-NRRI Cuttack Plant Pathology Division',
  },
  {
    id: 'cotton-whitefly',
    crop: 'Cotton',
    conditionName: 'Cotton Whitefly & Leaf Curl Virus',
    pathogenType: 'Insect/Pest',
    scientificName: 'Bemisia tabaci',
    visibleSymptoms: [
      'Tiny white moth-like flies congregating on leaf undersides; fluttering when canopy shaken',
      'Yellowing, upward leaf curling, and sooty black mold growing on excreted honeydew',
      'Thickened veins and enations on lower leaf surfaces (CLCuD transmission)',
    ],
    affectedPlantParts: ['Leaves', 'Stem'],
    conduciveConditions: {
      tempRangeC: [28, 38],
      minHumidityPercent: 50,
    },
    preventiveMeasures: [
      'Install yellow sticky traps @ 15-20 per acre for early population monitoring',
      'Eradicate weed hosts (Kanghi, Peeli Buti, Parthenium) on field bunds',
      'Avoid synthetic pyrethroid sprays early in season which cause whitefly resurgence',
    ],
    integratedPestManagement: [
      'Economic Threshold Level (ETL): 6-8 adults per leaf',
      'Spray Neem-based formulation (Azadirachtin 10,000 ppm) @ 2 ml/litre as deterrent',
      'If ETL exceeded, spray Diafenthiuron 50% WP @ 200 g/acre or Pyriproxyfen 10% EC @ 400 ml/acre',
    ],
    certifiedSource: 'ICAR-CICR Cotton IPM Protocol',
  },
];

export const pestDiseaseKnowledgeService = {
  findGuideForDisease(crop: string, diseaseQuery: string): VerifiedPestDiseaseGuide | null {
    const dLower = diseaseQuery.toLowerCase();
    const cLower = crop.toLowerCase();

    return VERIFIED_PEST_DISEASE_GUIDES.find(
      (g) => (g.crop.toLowerCase().includes(cLower) || cLower.includes(g.crop.toLowerCase())) &&
             (g.conditionName.toLowerCase().includes(dLower) || dLower.includes(g.conditionName.toLowerCase()))
    ) || null;
  },

  getAllGuidesForCrop(crop: string): VerifiedPestDiseaseGuide[] {
    const cLower = crop.toLowerCase();
    return VERIFIED_PEST_DISEASE_GUIDES.filter((g) => g.crop.toLowerCase().includes(cLower) || cLower.includes(g.crop.toLowerCase()));
  },
};
