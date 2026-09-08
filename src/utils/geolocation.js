// Haversine formula to calculate distance between two coordinates
// Returns distance in meters
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Get current location using browser geolocation API
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        });
      },
      (error) => {
        const messages = {
          1: "Location permission was denied. Please allow location access to mark attendance.",
          2: "Your current location is unavailable. Please try again.",
          3: "Location request timed out. Please try again."
        };
        reject(new Error(messages[error.code] || "Unable to determine your location."));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

// Check if location is within school radius
export const isWithinSchoolRadius = (lat, lon, schoolLat, schoolLon, radiusMeters = 100) => {
  const distance = calculateDistance(lat, lon, schoolLat, schoolLon);
  return {
    isWithin: distance <= radiusMeters,
    distance: Math.round(distance),
    radiusMeters,
  };
};

// Format distance for display
export const formatDistance = (distance) => {
  if (distance < 1000) {
    return `${distance} meters`;
  }
  return `${(distance / 1000).toFixed(2)} km`;
};
