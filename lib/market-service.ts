import { MandiPriceItem } from '@/types';
import { fetchMandiPrices as fetchProviderMandiPrices, OFFICIAL_CACP_MSP_BENCHMARKS } from './data-providers/market/agmarknet-provider';
import { DataProviderResult, NormalizedMarketPrice } from './data-providers/types';

// In-memory client cache for market prices
const CLIENT_MARKET_CACHE = new Map<string, { data: DataProviderResult<NormalizedMarketPrice>; timestamp: number }>();
const MARKET_CACHE_TTL_MS = 15 * 60 * 1000; // 15 mins client-side cache

export const marketService = {
  /**
   * Synchronous accessor for backwards-compatibility with existing UI components
   */
  getMandiPrices(cropName: string, state: string = "Punjab", district: string = "Ludhiana"): MandiPriceItem {
    const lower = cropName.toLowerCase();
    let matchedKey = "wheat";
    for (const key of Object.keys(OFFICIAL_CACP_MSP_BENCHMARKS)) {
      if (lower.includes(key)) {
        matchedKey = key;
        break;
      }
    }

    const data = OFFICIAL_CACP_MSP_BENCHMARKS[matchedKey] || OFFICIAL_CACP_MSP_BENCHMARKS.wheat;
    const todayStr = new Date().toISOString().split('T')[0];

    return {
      crop: data.crop,
      state: state || "State Mandi",
      district: district || "District APMC",
      marketName: `${district || 'Central'} Principal APMC Mandi`,
      modalPrice: data.baseModal,
      minPrice: data.baseModal - data.minOffset,
      maxPrice: data.baseModal + data.maxOffset,
      unit: "₹ / Quintal (100 kg)",
      msp: data.msp,
      date: todayStr,
      isLive: false,
      disclaimer: "Official CACP Minimum Support Price & APMC Benchmark. Verify live bids at your local market yard."
    };
  },

  /**
   * Asynchronous live fetcher querying server-side AGMARKNET / data.gov.in API
   */
  async getLiveMandiPrices(
    cropName: string = "Wheat",
    state: string = "Punjab",
    district: string = "Ludhiana"
  ): Promise<DataProviderResult<NormalizedMarketPrice>> {
    const cacheKey = `${cropName.toLowerCase()}_${state.toLowerCase()}_${district.toLowerCase()}`;
    const cached = CLIENT_MARKET_CACHE.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp < MARKET_CACHE_TTL_MS)) {
      return cached.data;
    }

    let result: DataProviderResult<NormalizedMarketPrice>;

    if (typeof window !== 'undefined') {
      try {
        const url = `/api/market?crop=${encodeURIComponent(cropName)}&state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`;
        const res = await fetch(url);
        if (res.ok) {
          result = await res.json();
        } else {
          result = await fetchProviderMandiPrices(cropName, state, district);
        }
      } catch {
        result = await fetchProviderMandiPrices(cropName, state, district);
      }
    } else {
      result = await fetchProviderMandiPrices(cropName, state, district);
    }

    CLIENT_MARKET_CACHE.set(cacheKey, { data: result, timestamp: now });
    return result;
  }
};
