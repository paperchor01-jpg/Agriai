import { Farm, CropEconomicsData } from '@/types';

export const economicsService = {
  calculateEconomics(farm: Farm): CropEconomicsData {
    const acres = farm.areaAcres > 0 ? farm.areaAcres : 1;
    const cropName = farm.crop?.name || "Wheat";
    const lower = cropName.toLowerCase();

    // Baseline costs per acre (in ₹)
    let seedPerAcre = 1600;
    let fertPerAcre = 3200;
    let pestPerAcre = 1800;
    let laborPerAcre = 4500;
    let irrigPerAcre = 2000;
    let machPerAcre = 3000;
    let expectedYieldPerAcreQ = 20; // Quintals per acre
    let pricePerQ = 2275; // ₹ per quintal

    if (lower.includes("paddy") || lower.includes("rice")) {
      seedPerAcre = 1400;
      fertPerAcre = 3800;
      pestPerAcre = 2400;
      laborPerAcre = 6500;
      irrigPerAcre = 3500;
      machPerAcre = 3500;
      expectedYieldPerAcreQ = 26;
      pricePerQ = 2300;
    } else if (lower.includes("cotton")) {
      seedPerAcre = 2800;
      fertPerAcre = 4500;
      pestPerAcre = 3800;
      laborPerAcre = 7500;
      irrigPerAcre = 2500;
      machPerAcre = 2500;
      expectedYieldPerAcreQ = 10;
      pricePerQ = 7121;
    } else if (lower.includes("mustard") || lower.includes("sarson")) {
      seedPerAcre = 900;
      fertPerAcre = 2400;
      pestPerAcre = 1400;
      laborPerAcre = 3200;
      irrigPerAcre = 1400;
      machPerAcre = 2200;
      expectedYieldPerAcreQ = 8;
      pricePerQ = 5650;
    } else if (lower.includes("gram") || lower.includes("chana")) {
      seedPerAcre = 2200;
      fertPerAcre = 2100;
      pestPerAcre = 1600;
      laborPerAcre = 3500;
      irrigPerAcre = 1200;
      machPerAcre = 2200;
      expectedYieldPerAcreQ = 9;
      pricePerQ = 5440;
    } else if (lower.includes("maize")) {
      seedPerAcre = 2000;
      fertPerAcre = 3400;
      pestPerAcre = 2200;
      laborPerAcre = 4000;
      irrigPerAcre = 2000;
      machPerAcre = 2800;
      expectedYieldPerAcreQ = 24;
      pricePerQ = 2090;
    }

    const seeds = Math.round(seedPerAcre * acres);
    const fertilizers = Math.round(fertPerAcre * acres);
    const pesticides = Math.round(pestPerAcre * acres);
    const labor = Math.round(laborPerAcre * acres);
    const irrigation = Math.round(irrigPerAcre * acres);
    const machinery = Math.round(machPerAcre * acres);
    const totalCost = seeds + fertilizers + pesticides + labor + irrigation + machinery;

    const totalQuintals = Math.round(expectedYieldPerAcreQ * acres * 10) / 10;
    const grossRevenue = Math.round(totalQuintals * pricePerQ);
    const netProfit = grossRevenue - totalCost;
    const roiPercent = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 0;

    return {
      farmAcreage: acres,
      cropName,
      costs: {
        seeds,
        fertilizers,
        pesticides,
        labor,
        irrigation,
        machinery,
        totalCost
      },
      revenue: {
        expectedYieldQuintals: totalQuintals,
        expectedPricePerQuintal: pricePerQ,
        grossRevenue
      },
      profit: {
        netProfit,
        returnOnInvestmentPercent: roiPercent,
        isProfitable: netProfit > 0
      }
    };
  }
};
