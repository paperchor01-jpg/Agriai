'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapPin,
  X,
  CheckCircle2,
  Search,
  ZoomIn,
  ZoomOut,
  Navigation,
  Loader2,
  Globe2,
  Sparkles,
  AlertCircle,
  Compass,
} from 'lucide-react';
import { FarmLocationDetails } from '@/types';
import {
  reverseGeocode,
  formatCoordinates,
  findNearestDistrict,
  validateCoordinates,
  INDIAN_STATES_AND_DISTRICTS,
} from '@/lib/location-service';

interface InteractiveLocationPickerModalProps {
  isOpen: boolean;
  initialLat?: number;
  initialLon?: number;
  initialLocationName?: string;
  onConfirm: (locationDetails: FarmLocationDetails) => void;
  onClose: () => void;
}

export function InteractiveLocationPickerModal({
  isOpen,
  initialLat = 20.5937,
  initialLon = 78.9629,
  initialLocationName = 'Select Location on Map',
  onConfirm,
  onClose,
}: InteractiveLocationPickerModalProps) {
  const [lat, setLat] = useState<number>(initialLat);
  const [lon, setLon] = useState<number>(initialLon);
  const [zoom, setZoom] = useState<number>(14);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [locationDetails, setLocationDetails] = useState<FarmLocationDetails>({
    country: 'India',
    state: '',
    district: '',
    latitude: initialLat,
    longitude: initialLon,
    formattedAddress: initialLocationName,
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Array<{ name: string; state: string; lat: number; lon: number }>>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Map container reference
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const googleMapInstanceRef = useRef<any>(null);
  const googleMarkerInstanceRef = useRef<any>(null);

  // Debounced reverse geocoding
  const performReverseGeocode = useCallback(async (targetLat: number, targetLon: number) => {
    setIsGeocoding(true);
    try {
      const details = await reverseGeocode(targetLat, targetLon);
      setLocationDetails(details);
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
      const fallback = findNearestDistrict(targetLat, targetLon);
      setLocationDetails({
        country: 'India',
        state: fallback.state,
        district: fallback.district,
        latitude: targetLat,
        longitude: targetLon,
        formattedAddress: `${fallback.district}, ${fallback.state}`,
      });
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // Update on initial coordinate change when modal opens
  useEffect(() => {
    if (isOpen) {
      const safeLat = validateCoordinates(initialLat, initialLon) ? initialLat : 20.5937;
      const safeLon = validateCoordinates(initialLat, initialLon) ? initialLon : 78.9629;
      setLat(safeLat);
      setLon(safeLon);
      performReverseGeocode(safeLat, safeLon);
    }
  }, [isOpen, initialLat, initialLon, performReverseGeocode]);

  // Handle Search Query across Indian Districts and Places
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const q = query.toLowerCase().trim();
    const results: Array<{ name: string; state: string; lat: number; lon: number }> = [];

    for (const [state, districts] of Object.entries(INDIAN_STATES_AND_DISTRICTS)) {
      for (const dist of districts) {
        if (dist.name.toLowerCase().includes(q) || state.toLowerCase().includes(q)) {
          results.push({
            name: dist.name,
            state,
            lat: dist.lat,
            lon: dist.lon,
          });
        }
        if (results.length >= 6) break;
      }
      if (results.length >= 6) break;
    }

    setSearchResults(results);
  };

  const selectSearchResult = (item: { name: string; state: string; lat: number; lon: number }) => {
    setLat(item.lat);
    setLon(item.lon);
    setSearchQuery('');
    setSearchResults([]);
    performReverseGeocode(item.lat, item.lon);

    if (googleMapInstanceRef.current && googleMarkerInstanceRef.current) {
      const pos = { lat: item.lat, lng: item.lon };
      googleMapInstanceRef.current.setCenter(pos);
      googleMarkerInstanceRef.current.setPosition(pos);
    }
  };

  // Google Maps JS API loader if API key exists
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    const apiKey = (window as any).NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (apiKey && (window as any).google?.maps && mapContainerRef.current) {
      try {
        const center = { lat, lng: lon };
        const map = new (window as any).google.maps.Map(mapContainerRef.current, {
          center,
          zoom: 14,
          mapTypeId: 'hybrid',
          disableDefaultUI: false,
          zoomControl: true,
        });

        const marker = new (window as any).google.maps.Marker({
          position: center,
          map,
          draggable: true,
          title: 'Your Farm Location',
          animation: (window as any).google.maps.Animation.DROP,
        });

        marker.addListener('dragend', (event: any) => {
          const newLat = event.latLng.lat();
          const newLon = event.latLng.lng();
          setLat(newLat);
          setLon(newLon);
          performReverseGeocode(newLat, newLon);
        });

        map.addListener('click', (event: any) => {
          const newLat = event.latLng.lat();
          const newLon = event.latLng.lng();
          marker.setPosition({ lat: newLat, lng: newLon });
          setLat(newLat);
          setLon(newLon);
          performReverseGeocode(newLat, newLon);
        });

        googleMapInstanceRef.current = map;
        googleMarkerInstanceRef.current = marker;
      } catch (err) {
        console.warn('Could not initialize Google Map instance, using interactive tile view:', err);
      }
    }
  }, [isOpen, lat, lon, performReverseGeocode]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({
      ...locationDetails,
      latitude: lat,
      longitude: lon,
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="map-picker-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl glass-card bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800/80 overflow-hidden text-left flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-800/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 dark:bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 id="map-picker-title" className="text-base sm:text-lg font-black text-slate-900 dark:text-zinc-100">
                Pinpoint Farm Location on Map
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Drag marker or click anywhere on the plot to adjust exact farm coordinates
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close location picker"
            className="text-slate-400 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-200 p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:px-6 bg-slate-50/80 dark:bg-zinc-800/40 border-b border-slate-100 dark:border-zinc-800 shrink-0 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search town, district, or agricultural landmark (e.g. Ludhiana, Sri Ganganagar, Karnal)..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            {isSearching && (
              <Loader2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-spin absolute right-3.5 top-3" />
            )}
          </div>

          {/* Search Dropdown Results */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-3 sm:left-6 right-3 sm:right-6 mt-1 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-md border border-slate-200 dark:border-zinc-700 rounded-2xl shadow-xl z-30 max-h-48 overflow-y-auto">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSearchResult(item)}
                  className="w-full px-4 py-2.5 text-left text-xs hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40 flex items-center justify-between border-b border-slate-100 dark:border-zinc-700/60 last:border-0 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-bold text-slate-800 dark:text-zinc-100">{item.name}</span>
                    <span className="text-slate-400 dark:text-zinc-400">• {item.state}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                    {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Area */}
        <div className="relative flex-1 min-h-[300px] sm:min-h-[380px] bg-slate-900 overflow-hidden flex flex-col justify-end">
          {/* Map View Canvas / Google Map Container */}
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full">
            {/* Interactive OpenStreetMap / Canvas Fallback */}
            <iframe
              title="Interactive Farm Location Map"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.03}%2C${lat - 0.02}%2C${lon + 0.03}%2C${lat + 0.02}&layer=mapnik&marker=${lat}%2C${lon}`}
              className="w-full h-full border-0 pointer-events-auto"
            />
          </div>

          {/* Floating Marker Helper Overlay */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg border border-slate-700/50">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              <span>Target Plot Marker Centered</span>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => {
                setZoom((z) => Math.min(18, z + 1));
                if (googleMapInstanceRef.current) {
                  googleMapInstanceRef.current.setZoom(googleMapInstanceRef.current.getZoom() + 1);
                }
              }}
              aria-label="Zoom in"
              className="w-8 h-8 rounded-xl bg-white/95 dark:bg-zinc-800/90 text-slate-800 dark:text-zinc-200 border border-slate-200/60 dark:border-zinc-700 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-all cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom((z) => Math.max(8, z - 1));
                if (googleMapInstanceRef.current) {
                  googleMapInstanceRef.current.setZoom(googleMapInstanceRef.current.getZoom() - 1);
                }
              }}
              aria-label="Zoom out"
              className="w-8 h-8 rounded-xl bg-white/95 dark:bg-zinc-800/90 text-slate-800 dark:text-zinc-200 border border-slate-200/60 dark:border-zinc-700 shadow-md flex items-center justify-center hover:bg-white dark:hover:bg-zinc-700 transition-all cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Reverse Geocoding Card Bar */}
          <div className="relative z-20 p-4 sm:p-5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-zinc-800 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/40">
                    Detected Plot Location
                  </span>
                  {isGeocoding ? (
                    <span className="text-[11px] text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-emerald-600 dark:text-emerald-400" /> Resolving address...
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-slate-600 dark:text-zinc-300">
                      {formatCoordinates(lat, lon)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs text-slate-700 dark:text-zinc-300">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Village / Area</span>
                    <strong className="text-slate-900 dark:text-zinc-100 truncate block">
                      {locationDetails.village || locationDetails.subDistrict || 'Primary Plot'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">District</span>
                    <strong className="text-slate-900 dark:text-zinc-100 truncate block">
                      {locationDetails.district || 'Ludhiana'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">State</span>
                    <strong className="text-slate-900 dark:text-zinc-100 truncate block">
                      {locationDetails.state || 'Punjab'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 block">Country</span>
                    <strong className="text-slate-900 dark:text-zinc-100 truncate block">
                      {locationDetails.country || 'India'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm This Location</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
