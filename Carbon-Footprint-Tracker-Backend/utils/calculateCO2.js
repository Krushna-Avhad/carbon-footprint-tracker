const calculateCO2 = (type, data) => {

  if (type === 'transport') {
    const factors = {
      car: 0.21,
      'car-petrol': 0.21,
      'car-electric': 0.07,
      bus: 0.10,
      train: 0.05,
      bike: 0.00,
      motorcycle: 0.16,
      'flight-short': 0.255,
      'flight-long': 0.195,
      flight: 0.255,
    };
    const mode = (data.mode || 'car').toLowerCase().replace(/\s+/g, '-');
    const factor = factors[mode] ?? 0.21;
    const passengers = data.passengers || 1;
    return parseFloat(((data.distance * factor) / passengers).toFixed(3));
  }

  if (type === 'food') {
    const factors = {
      beef: 27.0,
      chicken: 6.0,
      pork: 7.6,
      fish: 3.5,
      seafood: 3.5,
      veg: 2.0,
      vegan: 1.5,
      vegetarian: 2.0,
    };
    const meal = (data.meal || 'veg').toLowerCase();
    const factor = factors[meal] ?? 2.0;
    const quantity = data.quantity || data.servings || 1;
    return parseFloat((factor * quantity).toFixed(3));
  }

  if (type === 'energy') {
    // kWh-based or hours-based
    const renewableFactor =
      data.renewable === 'Yes – 100% renewable' ? 0.05 :
      data.renewable === 'Partial' ? 0.30 : 1.0;

    if (data.kwh) {
      return parseFloat((data.kwh * 0.233 * renewableFactor).toFixed(3));
    }
    return parseFloat(((data.hours || 1) * 0.5 * renewableFactor).toFixed(3));
  }

  if (type === 'waste') {
    const disposalFactor =
      data.disposal === 'Recycling Centre' ? 0.5 :
      data.disposal === 'Composting' ? 0.1 :
      data.disposal === 'Incineration' ? 1.5 : 1.2;

    return parseFloat(((data.kgWaste || data.weight || 1) * disposalFactor).toFixed(3));
  }

  if (type === 'shopping') {
    const factors = {
      electronics: 70,
      clothing: 10,
      furniture: 50,
      other: 5,
    };
    const item = (data.item || 'other').toLowerCase();
    const factor = factors[item] ?? 5;
    return parseFloat((factor * (data.quantity || 1)).toFixed(3));
  }

  return 0;
};

module.exports = calculateCO2;
