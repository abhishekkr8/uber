const axios = require("axios");
const captainModel = require("../models/captain.model");

// module.exports.getAddressCoordinate = async (address) => {
//   const apiKey = process.env.GOOGLE_MAPS_API;
//   const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//     address
//   )}&key=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     if (response.data.status === "OK") {
//       const location = response.data.results[0].geometry.location;
//       return {
//         ltd: location.lat,
//         lng: location.lng,
//       };
//     } else {
//       throw new Error("Unable to fetch coordinates");
//     }
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

module.exports.getAddressCoordinate = async (address) => {
  const accessToken = process.env.MAPBOX_API_KEY;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    if (
      response.data &&
      response.data.features &&
      response.data.features.length > 0
    ) {
      const [lng, lat] = response.data.features[0].center;
      return {
        ltd: lat,
        lng: lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates from Mapbox");
    }
  } catch (error) {
    console.error("Mapbox Geocoding Error:", error.message);
    throw error;
  }
};

// module.exports.getDistanceTime = async (origin, destination) => {
//   if (!origin || !destination) {
//     throw new Error("Origin and destination are required");
//   }
//   const apiKey = process.env.GOOGLE_MAPS_API;

//   const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
//     origin
//   )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     if (response.data.status === "OK") {
//       if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
//         throw new Error("No routes found");
//       }

//       return response.data.rows[0].elements[0];
//     } else {
//       throw new Error("Unable to fetch distance and time");
//     }
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const accessToken = process.env.MAPBOX_API_KEY;

  try {
    // 1. Get coordinates
    const originCoord = await module.exports.getAddressCoordinate(origin);
    const destinationCoord = await module.exports.getAddressCoordinate(destination);

    const originStr = `${originCoord.lng},${originCoord.ltd}`;
    const destinationStr = `${destinationCoord.lng},${destinationCoord.ltd}`;

    // 2. Call Mapbox Directions API
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originStr};${destinationStr}?access_token=${accessToken}`;

    const response = await axios.get(url);

    if (
      response.data &&
      response.data.routes &&
      response.data.routes.length > 0
    ) {
      const route = response.data.routes[0];

      // 🚨 Return format matching Google Distance Matrix
      return {
        distance: {
          value: route.distance, // meters
          text: `${(route.distance / 1000).toFixed(2)} km`,
        },
        duration: {
          value: route.duration, // seconds
          text: `${Math.round(route.duration / 60)} mins`,
        },
        status: "OK",
      };
    } else {
      throw new Error("No route found");
    }
  } catch (err) {
    console.error("Mapbox Distance Error:", err.message);
    throw new Error("Unable to fetch distance and time");
  }
};

// module.exports.getAutoCompleteSuggestions = async (input) => {
//   if (!input) {
//     throw new Error("query is required");
//   }

//   const apiKey = process.env.GOOGLE_MAPS_API;
//   const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
//     input
//   )}&key=${apiKey}`;

//   try {
//     const response = await axios.get(url);
//     if (response.data.status === "OK") {
//       return response.data.predictions
//         .map((prediction) => prediction.description)
//         .filter((value) => value);
//     } else {
//       throw new Error("Unable to fetch suggestions");
//     }
//   } catch (err) {
//     console.log(err.message);
//     throw err;
//   }
// };

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }

  const accessToken = process.env.MAPBOX_API_KEY;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    input
  )}.json?autocomplete=true&access_token=${accessToken}`;

  try {
    const response = await axios.get(url);
    if (
      response.data &&
      response.data.features &&
      response.data.features.length > 0
    ) {
      return response.data.features
        .map((feature) => feature.place_name)
        .filter((value) => value);
    } else {
      throw new Error("Unable to fetch suggestions");
    }
  } catch (err) {
    console.log(err.message);
    throw err;
  }
};

// module.exports.getCaptainsInTheRadius = async (ltd, lng, radius, vehicleType) => {
//   // radius in km

//   try {
//     const captains = await captainModel.find({
//       location: {
//         $geoWithin: {
//           $centerSphere: [[ltd, lng], radius / 6371],
//         },
//       },
//       "vehicle.type": vehicleType,
//     });
//     return captains;
//   } catch (error) {
//     throw new Error("Error in getting captain in radius");
//   }
// };

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius, vehicleType) => {
  try {
    const captains = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[ltd, lng], radius / 6371],
        },
      },
      "vehicle.type": vehicleType,
    });
    return captains;
  } catch (error) {
    throw new Error("Error in getting captain in radius");
  }
};