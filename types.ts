
export type SyringeCapacity = 30 | 50 | 100;

export interface MedicationConfig {
  syringeCapacity: SyringeCapacity;
  totalMg: number;
  totalVolumeMl: number;
  targetDoseMg: number;
}

export interface CalculationResult {
  units: number;
  volumeMl: number;
  concentrationMgMl: number;
}
