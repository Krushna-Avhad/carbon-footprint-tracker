const calculateCO2 = (type, data) => {

  if(type === "transport"){
    const factors = {
      car: 0.21,
      bus: 0.1,
      train: 0.05,
      bike: 0.12
    }

    return data.distance * factors[data.mode]
  }

  if(type === "food"){
    const factors = {
      beef: 27,
      chicken: 6,
      veg: 2
    }

    return factors[data.meal] * data.quantity
  }

  if(type === "energy"){
    return data.hours * 0.5
  }

  return 0
}

module.exports = calculateCO2