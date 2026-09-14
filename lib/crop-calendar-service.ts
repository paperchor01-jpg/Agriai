import { Farm, CropCalendarData, CropStageInfo } from '@/types';

export const cropCalendarService = {
  getCropCalendar(farm: Farm): CropCalendarData {
    const cropName = farm.crop?.name || "Wheat";
    const variety = farm.crop?.variety || farm.cropVariety || "Standard HYV";
    const plantingDateStr = farm.crop?.plantingDate || farm.plantingDate || new Date(Date.now() - 35 * 86400000).toISOString().split('T')[0];
    
    const plantingTime = new Date(plantingDateStr).getTime();
    const now = Date.now();
    const daysElapsed = Math.max(1, Math.floor((now - plantingTime) / (1000 * 60 * 60 * 24)));
    
    // Standard durations based on crop
    let totalDurationDays = 135;
    const lowerName = cropName.toLowerCase();
    if (lowerName.includes("mustard") || lowerName.includes("sarson")) totalDurationDays = 110;
    else if (lowerName.includes("gram") || lowerName.includes("chana")) totalDurationDays = 115;
    else if (lowerName.includes("cotton")) totalDurationDays = 160;
    else if (lowerName.includes("soybean")) totalDurationDays = 95;
    else if (lowerName.includes("bajra") || lowerName.includes("millet")) totalDurationDays = 85;
    else if (lowerName.includes("maize")) totalDurationDays = 105;
    else if (lowerName.includes("tomato")) totalDurationDays = 120;

    const estimatedHarvestDate = new Date(plantingTime + totalDurationDays * 86400000).toISOString().split('T')[0];

    // Build stage intervals
    const s1End = Math.round(totalDurationDays * 0.12);
    const s2End = Math.round(totalDurationDays * 0.35);
    const s3End = Math.round(totalDurationDays * 0.58);
    const s4End = Math.round(totalDurationDays * 0.78);
    const s5End = Math.round(totalDurationDays * 0.92);
    const s6End = totalDurationDays;

    const rawStages = [
      {
        stageName: "Sowing & Germination",
        order: 1,
        startDay: 0,
        endDay: s1End,
        description: "Seed hydration, radical emergence, and uniform stand establishment.",
        keyTasks: ["Check seedling population density", "Maintain seedbed moisture", "Apply pre-emergence weed control if needed"],
        risksToWatch: ["Poor seedling emergence", "Soil crusting", "Seed-borne damping off"]
      },
      {
        stageName: "Vegetative & Tillering",
        order: 2,
        startDay: s1End + 1,
        endDay: s2End,
        description: "Active canopy expansion, root penetration, and tiller initiation.",
        keyTasks: ["First split dose of Nitrogen", "First intercultural hoeing / weeding", "Crown root irrigation"],
        risksToWatch: ["Early weed competition", "Stem borer / shoot fly attack", "Nitrogen deficiency chlorosis"]
      },
      {
        stageName: "Stem Elongation / Branching",
        order: 3,
        startDay: s2End + 1,
        endDay: s3End,
        description: "Rapid biomass accumulation and reproductive organ formation inside the sheath.",
        keyTasks: ["Secondary nutrient top-dressing", "Routine pest scouting", "Maintain optimal moisture"],
        risksToWatch: ["Water deficit causing stunted stems", "Foliar blight pathogens"]
      },
      {
        stageName: "Flowering & Anthesis",
        order: 4,
        startDay: s3End + 1,
        endDay: s4End,
        description: "Head/flower emergence, pollination, and initial kernel set. Highest water sensitivity phase.",
        keyTasks: ["Crucial irrigation timing", "Avoid chemical spray during peak pollinator hours", "Foliar spray of Potassium / Boron if advised"],
        risksToWatch: ["Flower/pollen abortion due to heat or drought", "Rust and powdery mildew", "Aphid swarms"]
      },
      {
        stageName: "Grain Filling & Dough Stage",
        order: 5,
        startDay: s4End + 1,
        endDay: s5End,
        description: "Starch translocation into grains/pods. Grains transition from milk to dough consistency.",
        keyTasks: ["Final light irrigation (avoid lodging)", "Bird scaring / deterrents", "Monitor grain firmness"],
        risksToWatch: ["Terminal heat stress causing shriveled grains", "Pod borer damage", "Premature lodging"]
      },
      {
        stageName: "Maturity & Harvest",
        order: 6,
        startDay: s5End + 1,
        endDay: s6End,
        description: "Foliage yellowing, moisture drop to ~14-16%, and readiness for combine/manual harvest.",
        keyTasks: ["Stop irrigation 10-14 days prior", "Calibrate harvesting machinery / arrange labor", "Prepare dry storage / bags"],
        risksToWatch: ["Unseasonal rain spoiling standing crop", "Grain shattering losses", "Post-harvest moisture spoilage"]
      }
    ];

    let currentStageName = "Vegetative & Tillering";
    let currentStageOrder = 2;

    const stages: CropStageInfo[] = rawStages.map(s => {
      const isCompleted = daysElapsed > s.endDay;
      const isCurrent = daysElapsed >= s.startDay && daysElapsed <= s.endDay;
      if (isCurrent) {
        currentStageName = s.stageName;
        currentStageOrder = s.order;
      }
      return {
        ...s,
        isCurrent,
        isCompleted
      };
    });

    // If past all stages
    if (daysElapsed > totalDurationDays) {
      stages[stages.length - 1].isCurrent = true;
      currentStageName = stages[stages.length - 1].stageName;
      currentStageOrder = stages[stages.length - 1].order;
    }

    const progressPercentage = Math.min(100, Math.round((daysElapsed / totalDurationDays) * 100));

    return {
      cropName,
      variety,
      plantingDate: plantingDateStr,
      daysElapsed,
      estimatedHarvestDate,
      totalDurationDays,
      currentStage: currentStageName,
      currentStageOrder,
      stages,
      progressPercentage
    };
  }
};
