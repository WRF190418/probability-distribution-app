export interface DistributionParameters {
  [key: string]: number;
}

export interface DistributionDataPoint {
  x: number;
  y: number;
}

export interface Distribution {
  id: string;
  name: string;
  formula: string;
  parameters: DistributionParameters;
  description: string;
  generateData: (
    params: DistributionParameters,
    range: [number, number],
    points: number
  ) => DistributionDataPoint[];
}

// 假设检验相关类型定义
export interface HypothesisTestConfig {
  testType: 't-test' | 'z-test' | 'chi-square' | 'anova';
  nullHypothesis: string;
  alternativeHypothesis: string;
  significanceLevel: number;
  testDirection: 'two-tailed' | 'left-tailed' | 'right-tailed';
  expectedMean?: number;
  expectedVariance?: number;
}

export interface HypothesisTestResult {
  testType: string;
  statistic: number;
  pValue: number;
  criticalValue: number;
  conclusion: string;
  interpretation: string;
  sampleSize: number;
  sampleMean: number;
  sampleStdDev: number;
  degreesOfFreedom: number;
}

export interface StatisticalTest {
  name: string;
  description: string;
  applicableFor: string[];
  requirements: string[];
  formula: string;
}

export interface TestAssumptions {
  normality: boolean;
  independence: boolean;
  equalVariance?: boolean;
  sampleSize: number;
  minSampleSize: number;
}
