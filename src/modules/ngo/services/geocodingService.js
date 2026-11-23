
const geocodeCache = new Map();

export async function getCoordinates(address) {
  if (!address || !address.trim()) {
    return null;
  }

  const normalizedAddress = address.trim().toLowerCase();

  if (geocodeCache.has(normalizedAddress)) {
    return geocodeCache.get(normalizedAddress);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`
    );

    if (!response.ok) {
      throw new Error("Unable to find location");
    }

    const results = await response.json();

    if (!results.length) {
      geocodeCache.set(normalizedAddress, null);
      return null;
    }

    const coordinates = {
      latitude: Number(results[0].lat),
      longitude: Number(results[0].lon),
    };

    geocodeCache.set(normalizedAddress, coordinates);

    return coordinates;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
