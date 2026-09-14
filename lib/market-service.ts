import { MandiPriceItem } from '@/types';

interface MandiBenchmark {
  crop: string;
  msp: number; // ₹/quintal
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
}

const MSP_AND_MANDI_BENCHMARKS: Record<string, MandiBenchmark> = {
  wheat: { crop: "Wheat", msp: 2275, modalPrice: 2350, minPrice: 2250, maxPrice: 2480 },
  paddy: { crop: "Paddy (Rice)", msp: 2300, modalPrice: 2420, minPrice: 2280, maxPrice: 2600 },
  cotton: { crop: "Cotton (Medium Staple)", msp: 7121, modalPrice: 7350, minPrice: 6900, maxPrice: 7800 },
  mustard: { crop: "Mustard (Sarson)", msp: 5650, modalPrice: 5800, minPrice: 5400, maxPrice: 6100 },
  gram: { crop: "Gram (Chana)", msp: 5440, modalPrice: 5750, minPrice: 5350, maxPrice: 6100 },
  maize: { crop: "Maize (Makka)", msp: 2090, modalPrice: 2180, minPrice: 1980, maxPrice: 2320 },
  soybean: { crop: "Soybean", msp: 4892, modalPrice: 4650, minPrice: 4300, maxPrice: 4950 },
  bajra: { crop: "Bajra (Pearl Millet)", msp: 2625, modalPrice: 2700, minPrice: 2500, maxPrice: 2900 },
  tomato: { crop: "Tomato", msp: 0, modalPrice: 1800, minPrice: 1200, maxPrice: 2600 },
  potato: { crop: "Potato", msp: 0, modalPrice: 1250, minPrice: 900, maxPrice: 1600 },
  onion: { crop: "Onion", msp: 0, modalPrice: 2200, minPrice: 1500, maxPrice: 3100 }
};

export const marketService = {
  getMandiPrices(cropName: string, state: string = "Punjab", district: string = "Ludhiana"): MandiPriceItem {
    const lower = cropName.toLowerCase();
    let matchedKey = "wheat";
    for (const key of Object.keys(MSP_AND_MANDI_BENCHMARKS)) {
      if (lower.includes(key)) {
        matchedKey = key;
        break;
      }
    }

    const data = MSP_AND_MANDI_BENCHMARKS[matchedKey] || MSP_AND_MANDI_BENCHMARKS.wheat;
    const todayStr = new Date().toISOString().split('T')[0];

    return {
      crop: data.crop,
      state: state || "State Mandi",
      district: district || "District APMC",
      marketName: `${district || 'Central'} Principal APMC Mandi`,
      modalPrice: data.modalPrice,
      minPrice: data.minPrice,
      maxPrice: data.maxPrice,
      unit: "₹ / Quintal (100 kg)",
      msp: data.msp,
      date: todayStr,
      isLive: false,
      disclaimer: "Live APMC API connection pending — showing official MSP benchmark & indicative regional trade prices. Always verify rates at your local APMC committee."
    };
  }
};
