import { Crop, CropRecommendationInput, CropRecommendationResult } from '../types';

export function scoreCrops(
  crops: Crop[],
  input: CropRecommendationInput
): CropRecommendationResult[] {
  const results: CropRecommendationResult[] = crops.map((crop) => {
    let score = 0;
    const matchedReasons: string[] = [];
    const unmatchedReasons: string[] = [];

    // 1. Soil Match (25 pts)
    const soilMatches = crop.soilTypes.some(
      (s) => s.toLowerCase() === input.soilType.toLowerCase()
    );
    if (soilMatches) {
      score += 25;
      matchedReasons.push(`Soil match: ${input.soilType} soil is highly suited for ${crop.name}.`);
    } else {
      unmatchedReasons.push(
        `Soil variation: Prefers ${crop.soilTypes.join(', ')} rather than ${input.soilType}.`
      );
    }

    // 2. Season Match (25 pts)
    const seasonMatches = crop.seasons.some(
      (s) => s.toLowerCase() === input.season.toLowerCase()
    );
    if (seasonMatches) {
      score += 25;
      matchedReasons.push(`Optimal season: Sowing during ${input.season} yields prime vegetative & reproductive growth.`);
    } else {
      unmatchedReasons.push(
        `Off-season: Typically grown during ${crop.seasons.join('/')} instead of ${input.season}.`
      );
    }

    // 3. Rainfall Match (20 pts)
    if (input.rainfall >= crop.minRainfall && input.rainfall <= crop.maxRainfall) {
      score += 20;
      matchedReasons.push(
        `Rainfall: Anticipated ${input.rainfall}mm is within the ideal range (${crop.minRainfall}-${crop.maxRainfall}mm).`
      );
    } else {
      const margin = (crop.maxRainfall - crop.minRainfall) * 0.3;
      if (
        input.rainfall >= crop.minRainfall - margin &&
        input.rainfall <= crop.maxRainfall + margin
      ) {
        score += 10;
        matchedReasons.push(
          `Rainfall: Near-optimal moisture (${input.rainfall}mm vs ideal ${crop.minRainfall}-${crop.maxRainfall}mm). May need supplementary irrigation or drainage.`
        );
      } else {
        unmatchedReasons.push(
          `Rainfall disparity: Expected ${input.rainfall}mm deviates significantly from preferred ${crop.minRainfall}-${crop.maxRainfall}mm.`
        );
      }
    }

    // 4. Temperature Match (15 pts)
    if (input.temperature >= crop.minTemp && input.temperature <= crop.maxTemp) {
      score += 15;
      matchedReasons.push(
        `Temperature: Current/predicted ${input.temperature}°C fits prime vegetative band (${crop.minTemp}-${crop.maxTemp}°C).`
      );
    } else if (
      input.temperature >= crop.minTemp - 3 &&
      input.temperature <= crop.maxTemp + 3
    ) {
      score += 8;
      matchedReasons.push(
        `Temperature: ${input.temperature}°C is acceptable with slight seasonal variation (${crop.minTemp}-${crop.maxTemp}°C).`
      );
    } else {
      unmatchedReasons.push(
        `Temperature limitation: ${input.temperature}°C outside preferred thermal band (${crop.minTemp}-${crop.maxTemp}°C).`
      );
    }

    // 5. Soil pH Match (15 pts)
    if (input.ph >= crop.minPh && input.ph <= crop.maxPh) {
      score += 15;
      matchedReasons.push(
        `Soil pH: ${input.ph} provides optimal nutrient bioavailability (ideal ${crop.minPh}-${crop.maxPh}).`
      );
    } else if (input.ph >= crop.minPh - 0.5 && input.ph <= crop.maxPh + 0.5) {
      score += 7;
      matchedReasons.push(
        `Soil pH: ${input.ph} is close to ideal range (${crop.minPh}-${crop.maxPh}); mild soil amendment recommended.`
      );
    } else {
      unmatchedReasons.push(
        `Soil pH disparity: Soil test ${input.ph} falls outside ideal range ${crop.minPh}-${crop.maxPh}.`
      );
    }

    return {
      crop,
      matchScore: Math.min(100, Math.max(0, score)),
      matchedReasons,
      unmatchedReasons,
    };
  });

  return results.sort((a, b) => b.matchScore - a.matchScore);
}
