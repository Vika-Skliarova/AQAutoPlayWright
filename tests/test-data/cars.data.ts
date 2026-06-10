export const validCarData = {
  carBrandId: 1, // Audi
  carModelId: 1, // TT
  mileage: 122,
};

export const invalidCarData = {
  missingMileage: {
    carBrandId: 1,
    carModelId: 1,
    // mileage -
  },
  nonExistingModel: {
    carBrandId: 1,
    carModelId: 999999, // fake ID
    mileage: 50,
  }
};