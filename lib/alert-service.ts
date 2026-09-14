import { AlertItem, Farm, WeatherData, FarmRiskItem, CropDoctorResult, AdvisoryItem } from "@/types";
import { DEFAULT_FARMS, DEFAULT_WEATHER, getSelectedFarm, getStoredDiagnosis } from "@/lib/mock-data";
import { getAdvisories } from "@/lib/advisory-service";

const STORAGE_KEY_READ_ALERTS = "agriai_read_alert_ids";

/**
 * Get IDs of alerts marked as read in localStorage
 */
export function getReadAlertIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_READ_ALERTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Mark a single alert as read
 */
export function markAlertAsRead(alertId: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getReadAlertIds();
    if (!current.includes(alertId)) {
      const updated = [...current, alertId];
      localStorage.setItem(STORAGE_KEY_READ_ALERTS, JSON.stringify(updated));
      window.dispatchEvent(new Event("agriai:alerts-updated"));
    }
  } catch (err) {
    console.error("Failed to mark alert as read", err);
  }
}

/**
 * Mark all alerts as read
 */
export function markAllAlertsAsRead(alertIds: string[]): void {
  if (typeof window === "undefined") return;
  try {
    const current = getReadAlertIds();
    const merged = Array.from(new Set([...current, ...alertIds]));
    localStorage.setItem(STORAGE_KEY_READ_ALERTS, JSON.stringify(merged));
    window.dispatchEvent(new Event("agriai:alerts-updated"));
  } catch (err) {
    console.error("Failed to mark all alerts as read", err);
  }
}

/**
 * Primary Alert Generator
 * Synthesizes farm signals into structured High, Warning, and Information alerts
 */
export function getAlerts(
  farmData?: Farm | null,
  weatherData?: WeatherData | null,
  riskData?: FarmRiskItem[] | null,
  diseaseData?: CropDoctorResult | null,
  advisoryData?: AdvisoryItem[] | null
): AlertItem[] {
  const farm =
    farmData !== undefined ? farmData : (typeof window !== "undefined" ? getSelectedFarm() : null);

  if (!farm) {
    return [];
  }

  const weather = weatherData || DEFAULT_WEATHER;
  const disease = diseaseData || getStoredDiagnosis();
  const advisories = advisoryData || getAdvisories(farm, weather, disease);

  const readIds = getReadAlertIds();
  const alerts: AlertItem[] = [];

  const farmName = farm?.name || "Green Valley Farm";
  const farmId = farm?.id || "farm-1";
  const humidity = weather?.current?.humidity ?? weather?.humidity ?? 62;
  const tomorrowRain = weather?.forecast?.[1]?.rainChance ?? 65;

  // 1. HIGH PRIORITY: Crop Doctor Detected Disease
  if (disease && disease.disease) {
    const isRead = readIds.includes("alert-disease-rust");
    alerts.push({
      id: "alert-disease-rust",
      level: "HIGH",
      priority: "HIGH",
      type: "disease",
      title: "Disease Risk Requires Attention",
      reason: `Crop Doctor detected ${disease.disease} with ${disease.severity.toLowerCase()} severity.`,
      message: `Crop Doctor detected ${disease.disease} with ${disease.severity.toLowerCase()} severity.`,
      action: "Inspect affected wheat leaves and monitor whether symptoms are spreading.",
      timing: "Today",
      farmId,
      farmName,
      date: "Today, 08:30 AM",
      createdAt: "Today, 08:30 AM",
      read: isRead,
      actionUrl: "/crop-doctor",
      actionCta: "Open Crop Doctor",
    });
  }

  // 2. WARNING: High Relative Humidity Fungal Risk
  if (humidity >= 60) {
    const isRead = readIds.includes("alert-weather-humidity");
    alerts.push({
      id: "alert-weather-humidity",
      level: "WARNING",
      priority: "WARNING",
      type: "weather",
      title: "Monitor Humidity",
      reason: "Current humidity may increase fungal disease risk.",
      message: "Current humidity may increase fungal disease risk.",
      action: "Inspect the crop regularly for fungal symptoms.",
      timing: "Today",
      farmId,
      farmName,
      date: "Today, 09:15 AM",
      createdAt: "Today, 09:15 AM",
      read: isRead,
      actionUrl: "/weather",
      actionCta: "Check Weather",
    });
  }

  // 3. INFORMATION: Weather Update (Precipitation Forecast)
  if (tomorrowRain >= 40) {
    const isRead = readIds.includes("alert-weather-rain");
    alerts.push({
      id: "alert-weather-rain",
      level: "INFO",
      priority: "INFO",
      type: "weather",
      title: "Weather Update",
      reason: "Rain is expected in the forecast.",
      message: "Rain is expected in the forecast.",
      action: "Review irrigation plans before rainfall.",
      timing: "Tomorrow",
      farmId,
      farmName,
      date: "Yesterday, 05:00 PM",
      createdAt: "Yesterday, 05:00 PM",
      read: isRead,
      actionUrl: "/weather",
      actionCta: "Check Weather",
    });
  }

  // 4. INFORMATION: Sensitive Phenological Phase
  const cropStage = typeof farm?.crop === "object" && farm.crop?.stage ? farm.crop.stage : "Flowering";
  if (cropStage.toLowerCase().includes("flowering")) {
    const isRead = readIds.includes("alert-stage-flowering");
    alerts.push({
      id: "alert-stage-flowering",
      level: "INFO",
      priority: "INFO",
      type: "advisory",
      title: "Flowering Stage Advisory",
      reason: "Wheat is currently at the sensitive flowering phase.",
      message: "Wheat is currently at the sensitive flowering phase.",
      action: "Maintain steady hydration and avoid chemical drift.",
      timing: "This week",
      farmId,
      farmName,
      date: "Yesterday, 11:30 AM",
      createdAt: "Yesterday, 11:30 AM",
      read: isRead,
      actionUrl: "/advisory",
      actionCta: "View Advisory",
    });
  }

  // 5. Surface any High-Priority Smart Advisory as a HIGH alert
  const highAdvisories = advisories.filter((a) => a.priority === "High");
  for (const adv of highAdvisories) {
    const alertId = `alert-adv-${adv.id}`;
    if (!alerts.some((a) => a.id === alertId || a.title === adv.title)) {
      alerts.unshift({
        id: alertId,
        level: "HIGH",
        priority: "HIGH",
        type: adv.category === "Disease" ? "disease" : adv.category === "Irrigation" ? "irrigation" : "advisory",
        title: adv.title,
        reason: adv.reason,
        message: adv.reason,
        action: adv.action,
        timing: adv.timing,
        farmId,
        farmName,
        date: "Today, Just now",
        createdAt: "Today, Just now",
        read: readIds.includes(alertId),
        actionUrl: adv.actionUrl || "/advisory",
        actionCta: adv.actionCta || "View Advisory",
      });
    }
  }

  return alerts;
}
