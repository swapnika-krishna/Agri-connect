export interface WeatherParamsForAdvice {
  currentTemp: number;
  currentHumidity: number;
  currentWindSpeed: number;
  currentPrecip: number;
  maxTemp: number;
  minTemp: number;
  totalRainNext3Days: number;
  maxWindSpeed: number;
}

export function generateFarmingAdvice(params: WeatherParamsForAdvice): string[] {
  const advice: string[] = [];

  // Rain rules
  if (params.totalRainNext3Days >= 15) {
    advice.push(
      'Heavy rainfall expected (>15mm). Postpone all scheduled irrigation, urea top-dressing, and pesticide applications to prevent nutrient leaching and runoff.'
    );
    advice.push(
      'Ensure drainage channels in low-lying crop fields and pulse plots are cleared to avoid root zone waterlogging.'
    );
  } else if (params.totalRainNext3Days >= 5) {
    advice.push(
      'Moderate showers anticipated. Suspend unnecessary surface irrigation and check soil moisture before running pump sets.'
    );
  } else if (params.totalRainNext3Days === 0 && params.maxTemp > 32) {
    advice.push(
      'Dry and warm weather prevailing. Maintain optimal soil moisture for critical crop stages (tillering, flowering, or fruit development).'
    );
  }

  // Wind rules
  if (params.maxWindSpeed > 25 || params.currentWindSpeed > 20) {
    advice.push(
      'High wind velocity (>20 km/h). Strictly avoid foliar pesticide or weedicide spraying to prevent drift injury and uneven application.'
    );
    advice.push(
      'Provide mechanical staking or earthing-up for tall crops (sugarcane, maize, banana) and vegetable trellises.'
    );
  } else {
    advice.push('Calm to moderate winds. Favorable window for scheduled foliar sprays and micronutrient application.');
  }

  // Temperature rules
  if (params.maxTemp >= 38) {
    advice.push(
      'Extreme high temperatures (>38°C). Irrigate exclusively during late evening or early morning hours to minimize evaporative loss and heat stress.'
    );
    advice.push(
      'Apply straw or organic mulch across vegetable beds to conserve rhizosphere moisture and buffer soil heat.'
    );
  } else if (params.minTemp <= 7) {
    advice.push(
      'Low night temperatures / frost hazard (<7°C). Provide light evening irrigation or generate smoke around field boundaries to shield sensitive crops (mustard, potato, tomato).'
    );
  }

  // Humidity and fungal disease risk
  if (params.currentHumidity > 82 && params.maxTemp < 32 && params.maxTemp > 18) {
    advice.push(
      'Prolonged high atmospheric humidity (>80%) creates favorable conditions for fungal blights, downy mildew, and rust. Monitor leaf underside closely.'
    );
  }

  // General seasonal reminder
  advice.push('Keep harvested grain bags elevated on wooden pallets and covered with waterproof tarpaulins.');

  return advice;
}

export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0:
      return 'Clear Sky';
    case 1:
      return 'Mainly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Overcast';
    case 45:
    case 48:
      return 'Fog & Morning Mist';
    case 51:
    case 53:
    case 55:
      return 'Drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rain Showers';
    case 71:
    case 73:
    case 75:
      return 'Snow / Sleet';
    case 80:
    case 81:
    case 82:
      return 'Heavy Showers';
    case 95:
    case 96:
    case 99:
      return 'Thunderstorm with Gusty Winds';
    default:
      return 'Partly Cloudy';
  }
}
