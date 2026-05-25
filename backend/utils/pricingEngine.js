// Mock Dynamic Pricing Engine
// In a real scenario, this would use a machine learning model evaluating:
// - Current occupancy rate
// - Seasonality / Holidays
// - Competitor pricing
// - Time until check-in

const getDynamicPrice = (basePrice, roomStatus, occupancyRate = 0.7) => {
  let multiplier = 1.0;

  // 1. Occupancy based pricing (High demand = higher price)
  if (occupancyRate > 0.85) {
    multiplier += 0.20; // 20% surge
  } else if (occupancyRate < 0.40) {
    multiplier -= 0.15; // 15% discount to attract bookings
  }

  // 2. Mock Seasonality (e.g., weekends are 10% more expensive)
  const currentDay = new Date().getDay();
  if (currentDay === 5 || currentDay === 6) { // Friday or Saturday
    multiplier += 0.10;
  }

  // Calculate final dynamic price and round to nearest dollar
  const dynamicPrice = Math.round(basePrice * multiplier);
  
  return {
    originalPrice: basePrice,
    dynamicPrice: dynamicPrice > 0 ? dynamicPrice : basePrice,
    surgeActive: multiplier > 1.0,
    discountActive: multiplier < 1.0
  };
};

module.exports = { getDynamicPrice };
