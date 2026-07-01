import axios from "axios";

export const geocodeAddress = async (address: string | null) => {
  if (!address) return null;

  try {
    const res = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address,
          key: process.env.GOOGLE_MAPS_KEY,
          region: "ch",
        },
      }
    );

    const result = res.data.results[0];
    if (!result) return null;

    return result.geometry.location;
  } catch {
    return null;
  }
};
