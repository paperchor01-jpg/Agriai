/**
 * AgriAI Remote Sensing & Satellite Telemetry Adapter Interface
 * Prepared for ISRO Bhuvan / Copernicus Sentinel-2 multispectral integrations.
 * 
 * Strict compliance rule:
 * - Marked as CONFIG_REQUIRED / UNAVAILABLE until authenticated ISRO/Copernicus API credentials are provisioned.
 * - Zero fabricated NDVI or satellite values.
 */

import { DataProviderResult } from '../types';

export interface SatelliteVegetationData {
  fieldBoundaryGeoJson?: Record<string, unknown>;
  ndviMean?: number;           // Normalized Difference Vegetation Index (-1 to +1)
  ndwiMean?: number;           // Normalized Difference Water Index (canopy water stress)
  canopyChlorophyllIndex?: number;
  imageryDate?: string;
  spatialResolutionMeters?: number;
  cloudCoveragePercent?: number;
  isAvailable: boolean;
  statusMessage: string;
}

export const remoteSensingProvider = {
  async getVegetationTelemetry(
    _lat: number,
    _lon: number,
    _farmId: string
  ): Promise<DataProviderResult<SatelliteVegetationData>> {
    const isISROConfigured = Boolean(process.env.ISRO_BHUVAN_API_KEY);
    const isCopernicusConfigured = Boolean(process.env.COPERNICUS_CLIENT_ID);
    const nowIso = new Date().toISOString();

    const data: SatelliteVegetationData = {
      isAvailable: false,
      statusMessage: isISROConfigured || isCopernicusConfigured
        ? 'Satellite telemetry provider is initializing authentication handshake with Earth Observation gateway.'
        : 'Satellite multispectral imagery (ISRO Bhuvan / Copernicus) is currently planned and requires authorized Earth Observation API credentials.',
    };

    return {
      success: false,
      data,
      metadata: {
        fetchedAt: nowIso,
        expiresAt: nowIso,
        provider: 'ISRO Bhuvan / Copernicus Sentinel',
        sourceName: 'National Remote Sensing Centre (NRSC) / Copernicus Open Access',
        status: isISROConfigured || isCopernicusConfigured ? 'CONFIG_REQUIRED' : 'UNAVAILABLE',
        isStale: false,
        ttlSeconds: 0,
      },
      quality: {
        isValid: false,
        confidenceScore: 0,
        checksPassed: [],
        warnings: ['Live Earth Observation API credentials not configured in environment. No fake satellite data generated.'],
        validationTimestamp: nowIso,
      },
      error: 'Satellite telemetry credentials not provisioned.',
    };
  },

  async fetchVegetationIndices(farmId: string, lat?: number, lon?: number) {
    return this.getVegetationTelemetry(lat ?? 30.9, lon ?? 75.8, farmId);
  },
};
