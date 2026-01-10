export interface PersistencePoint {
  birth: number;
  death: number;
  dimension: number;
  id: string;
  label?: string;
}

export interface PersistenceBarcode {
  dimension: number;
  bars: Array<{
    birth: number;
    death: number;
    id: string;
  }>;
}

/**
 * Calculate persistence from birth and death values
 */
export const calculatePersistence = (birth: number, death: number): number => {
  return death - birth;
};

/**
 * Filter persistence points by dimension
 */
export const filterByDimension = (
  points: PersistencePoint[],
  dimension: number
): PersistencePoint[] => {
  return points.filter(p => p.dimension === dimension);
};

/**
 * Filter persistence points by persistence threshold
 */
export const filterByPersistence = (
  points: PersistencePoint[],
  minPersistence: number
): PersistencePoint[] => {
  return points.filter(p => calculatePersistence(p.birth, p.death) >= minPersistence);
};

/**
 * Sort persistence points by persistence (descending)
 */
export const sortByPersistence = (
  points: PersistencePoint[]
): PersistencePoint[] => {
  return [...points].sort((a, b) => {
    const persistenceA = calculatePersistence(a.birth, a.death);
    const persistenceB = calculatePersistence(b.birth, b.death);
    return persistenceB - persistenceA;
  });
};

/**
 * Get statistics for persistence points
 */
export const getPersistenceStats = (points: PersistencePoint[]) => {
  if (points.length === 0) {
    return {
      count: 0,
      avgPersistence: 0,
      maxPersistence: 0,
      minPersistence: 0,
      dimensions: {},
    };
  }

  const persistences = points.map(p => calculatePersistence(p.birth, p.death));
  const dimensions: Record<number, number> = {};

  points.forEach(p => {
    dimensions[p.dimension] = (dimensions[p.dimension] || 0) + 1;
  });

  return {
    count: points.length,
    avgPersistence: persistences.reduce((a, b) => a + b, 0) / persistences.length,
    maxPersistence: Math.max(...persistences),
    minPersistence: Math.min(...persistences),
    dimensions,
  };
};

/**
 * Convert persistence points to barcode format
 */
export const pointsToBarcodes = (
  points: PersistencePoint[]
): PersistenceBarcode[] => {
  const barcodesByDimension: Record<number, PersistenceBarcode> = {};

  points.forEach(point => {
    if (!barcodesByDimension[point.dimension]) {
      barcodesByDimension[point.dimension] = {
        dimension: point.dimension,
        bars: [],
      };
    }

    barcodesByDimension[point.dimension].bars.push({
      birth: point.birth,
      death: point.death,
      id: point.id,
    });
  });

  return Object.values(barcodesByDimension);
};

/**
 * Generate sample persistence data
 */
export const generateSamplePersistenceData = (): PersistencePoint[] => {
  const points: PersistencePoint[] = [];
  
  // Generate H0 (connected components)
  for (let i = 0; i < 10; i++) {
    points.push({
      id: `h0-${i}`,
      birth: Math.random() * 0.3,
      death: 0.5 + Math.random() * 0.5,
      dimension: 0,
      label: `Component ${i}`,
    });
  }

  // Generate H1 (loops)
  for (let i = 0; i < 15; i++) {
    points.push({
      id: `h1-${i}`,
      birth: 0.2 + Math.random() * 0.3,
      death: 0.6 + Math.random() * 0.4,
      dimension: 1,
      label: `Loop ${i}`,
    });
  }

  // Generate H2 (voids)
  for (let i = 0; i < 5; i++) {
    points.push({
      id: `h2-${i}`,
      birth: 0.4 + Math.random() * 0.2,
      death: 0.8 + Math.random() * 0.2,
      dimension: 2,
      label: `Void ${i}`,
    });
  }

  return points;
};
