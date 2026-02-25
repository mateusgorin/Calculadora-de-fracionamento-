
export type ScaleCapacity = 30 | 50 | 100;

export interface CalculationConfig {
  scaleCapacity: ScaleCapacity;
  totalMass: number;
  totalVolume: number;
  targetMass: number;
}

export interface CalculationResult {
  units: number;
  volume: number;
  ratio: number;
}
