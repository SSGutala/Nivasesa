/**
 * Mock ZIP-to-Coordinates mapping for local development.
 */
const ZIP_GEO_MAPPING: Record<string, { lat: number, lng: number }> = {
    '75024': { lat: 33.0697, lng: -96.8228 }, // Plano/Frisco
    '75201': { lat: 32.7847, lng: -96.7970 }, // Dallas Downtown
    '75034': { lat: 33.1507, lng: -96.8236 }, // Frisco
    '90210': { lat: 34.0736, lng: -118.4004 }, // Beverly Hills
    '10001': { lat: 40.7501, lng: -73.9996 }, // New York
};

/**
 * Validates ZIP format (Exactly 5 digits). 
 * Relaxed validation: does not check if ZIP exists in real world.
 */
export function isValidZip(zip: string): boolean {
    return /^\d{5}$/.test(zip);
}

export function getCoordinates(zip: string): { lat: number, lng: number } | null {
    try {
        if (!zip || !isValidZip(zip)) {
            console.log(`STABILIZATION: ZIP "${zip}" is invalid or empty.`);
            return null;
        }
        return ZIP_GEO_MAPPING[zip] || null;
    } catch (e) {
        console.error('STABILIZATION: Gracefully handled error in getCoordinates:', e);
        return null;
    }
}

/**
 * Calculates distance between two points in miles using Haversine formula.
 * Fail-safe: returns Infinity if coordinates are invalid.
 */
export function calculateDistance(lat1: number | null | undefined, lon1: number | null | undefined, lat2: number | null | undefined, lon2: number | null | undefined): number {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null || isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
        return Infinity;
    }
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
