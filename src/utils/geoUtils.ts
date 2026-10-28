// src/utils/geoUtils.ts

/**
 * Extrai coordenadas da coluna geography(Point, 4326) do PostGIS
 */
export function parsePostGISLocation(location: any): { latitude: number; longitude: number } | null {
  if (!location) return null;

  // 1. Caso venha como objeto GeoJSON: { type: 'Point', coordinates: [lng, lat] }
  if (typeof location === 'object' && Array.isArray(location.coordinates)) {
    const [longitude, latitude] = location.coordinates;
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      return { latitude, longitude };
    }
  }

  // 2. Caso venha como texto WKT: "POINT(-51.942209 -29.396414)"
  if (typeof location === 'string' && location.toUpperCase().startsWith('POINT')) {
    const match = location.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
    if (match) {
      return {
        longitude: parseFloat(match[1]),
        latitude: parseFloat(match[2]),
      };
    }
  }

  // 3. Caso venha como Hex EWKB padrão do PostGIS
  if (typeof location === 'string' && /^[0-9A-Fa-f]+$/.test(location) && location.length >= 50) {
    try {
      const hexToDoubleLE = (hexStr: string) => {
        const bytes = new Uint8Array(8);
        for (let i = 0; i < 8; i++) {
          bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16);
        }
        return new DataView(bytes.buffer).getFloat64(0, true);
      };
      
      const coordsHex = location.slice(-32);
      const longitude = hexToDoubleLE(coordsHex.slice(0, 16));
      const latitude = hexToDoubleLE(coordsHex.slice(16, 32));
      if (!isNaN(latitude) && !isNaN(longitude)) {
        return { latitude, longitude };
      }
    } catch {
      return null;
    }
  }

  return null;
}