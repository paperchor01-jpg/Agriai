import { GovSchemeItem } from '@/types';

export const GOVERNMENT_SCHEMES: GovSchemeItem[] = [
  {
    id: "scheme-pm-kisan",
    name: "Pradhan Mantri Kisan Samman Nidhi",
    shortName: "PM-KISAN",
    category: "Income Support",
    description: "Direct income support of ₹6,000 per year transferred directly into the bank accounts of farmer families in three equal 4-monthly installments.",
    eligibility: "All landholding farmer families with cultivable land in their names.",
    benefits: "₹6,000 per year in 3 direct bank transfers (₹2,000 each).",
    howToApplyUrl: "https://pmkisan.gov.in/",
    officialPortal: "pmkisan.gov.in"
  },
  {
    id: "scheme-pmfby",
    name: "Pradhan Mantri Fasal Bima Yojana",
    shortName: "PMFBY",
    category: "Insurance",
    description: "Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of non-preventable natural risks.",
    eligibility: "All farmers growing notified crops in notified areas (both loanee and non-loanee).",
    benefits: "Affordable premium: 2% for Kharif crops, 1.5% for Rabi crops, 5% for annual commercial/horticultural crops with full sum insured coverage.",
    howToApplyUrl: "https://pmfby.gov.in/",
    officialPortal: "pmfby.gov.in"
  },
  {
    id: "scheme-soil-card",
    name: "Soil Health Card Scheme",
    shortName: "Soil Health Card",
    category: "Soil & Inputs",
    description: "Assists State Governments to issue Soil Health Cards to all farmers in the country once every 2 years, providing NPK and micronutrient status.",
    eligibility: "Every agricultural landholder across all Indian states and Union Territories.",
    benefits: "Free 12-parameter soil testing (N, P, K, S, Zn, Fe, Cu, Mn, Bo, pH, EC, OC) + customized fertilizer dosage recommendations.",
    howToApplyUrl: "https://soilhealth.dac.gov.in/",
    officialPortal: "soilhealth.dac.gov.in"
  },
  {
    id: "scheme-pmksy",
    name: "Pradhan Mantri Krishi Sinchayee Yojana",
    shortName: "PMKSY (Per Drop More Crop)",
    category: "Irrigation",
    description: "Promoting micro-irrigation technologies (drip and sprinkler systems) to enhance water use efficiency at the farm level.",
    eligibility: "Farmers with access to a water source seeking to install drip or sprinkler irrigation systems.",
    benefits: "Up to 45% - 55% capital subsidy on installation of micro-irrigation (Drip / Sprinkler) systems.",
    howToApplyUrl: "https://pmksy.gov.in/",
    officialPortal: "pmksy.gov.in"
  },
  {
    id: "scheme-smam",
    name: "Sub-Mission on Agricultural Mechanization",
    shortName: "SMAM / Farm Machinery Subsidy",
    category: "Mechanization",
    description: "Promotes farm mechanization among small and marginal farmers with subsidies on tractors, seed drills, laser levelers, and custom hiring centers.",
    eligibility: "Small, marginal, SC/ST, and women farmers given priority.",
    benefits: "40% to 50% financial assistance / subsidy on purchase of approved agricultural implements.",
    howToApplyUrl: "https://agrimachinery.nic.in/",
    officialPortal: "agrimachinery.nic.in"
  },
  {
    id: "scheme-kcc",
    name: "Kisan Credit Card Scheme",
    shortName: "Kisan Credit Card (KCC)",
    category: "Credit",
    description: "Provides timely and adequate credit to farmers from the banking system for crop cultivation expenses and post-harvest maintenance.",
    eligibility: "All farmers, individual/joint borrowers, tenant farmers, and self-help groups.",
    benefits: "Concessional credit up to ₹3 Lakh at an effective interest rate of 4% (with 3% prompt repayment incentive).",
    howToApplyUrl: "https://www.myscheme.gov.in/schemes/kcc",
    officialPortal: "myscheme.gov.in"
  }
];

export const schemeService = {
  getAllSchemes(): GovSchemeItem[] {
    return GOVERNMENT_SCHEMES;
  },

  getSchemesByCategory(category: string): GovSchemeItem[] {
    return GOVERNMENT_SCHEMES.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }
};
