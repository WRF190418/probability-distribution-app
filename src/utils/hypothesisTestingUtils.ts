import { DataPoint } from '../components/DataAnalysisApp';

// 定义检验方向类型
export type TestDirection = 'two-tailed' | 'left-tailed' | 'right-tailed';
export type AlternativeHypothesis = 'two-sided' | 'less' | 'greater';

// 基础假设检验结果接口
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
  degreesOfFreedom?: number;
  confidenceInterval: [number, number];
}

// Z检验结果接口
export interface ZTestResult extends HypothesisTestResult {
  zStatistic: number;
  nullMean: number;
  populationStdDev: number;
}

// t检验结果接口
export interface TTestResult extends HypothesisTestResult {
  tStatistic: number;
  nullMean: number;
}

// 双样本t检验结果接口
export interface TwoSampleTTestResult extends HypothesisTestResult {
  tStatistic: number;
  meanDifference: number;
  pooledStdDev: number;
  groupMeans: [number, number];
}

// 卡方检验结果接口
export interface ChiSquareTestResult extends HypothesisTestResult {
  chiSquare: number;
  observedCounts: number[];
  expectedCounts: number[];
}

// 计算均值 - 处理DataPoint数组
export const calculateMean = (data: DataPoint[], axis: 'x' | 'y' = 'y'): number => {
  if (data.length === 0) return 0;
  const values = data.map(point => point[axis]);
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

// 计算均值 - 处理number数组的辅助函数
const calculateMeanValues = (values: number[]): number => {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

// 计算标准差 - 处理DataPoint数组
export const calculateStdDev = (data: DataPoint[], axis: 'x' | 'y' = 'y'): number => {
  if (data.length <= 1) return 0;
  const values = data.map(point => point[axis]);
  const mean = calculateMeanValues(values);
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
};

// 计算标准差 - 处理number数组的辅助函数
const calculateStdDevValues = (values: number[]): number => {
  if (values.length <= 1) return 0;
  const mean = calculateMeanValues(values);
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
};

// 标准正态分布CDF（累积分布函数）实现
export const normalCDF = (z: number): number => {
  // 基于误差函数的实现
  const erf = (x: number): number => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    const absX = Math.abs(x);
    const t = 1.0 / (1.0 + p * absX);
    const y = t * (a1 + t * (a2 + t * (a3 + t * (a4 + t * a5))));
    
    return sign * (1.0 - Math.exp(-x * x) * y);
  };
  
  return 0.5 * (1.0 + erf(z / Math.sqrt(2)));
};

// 获取Z临界值
export const getZCriticalValue = (alpha: number): number => {
  // 使用近似计算Z临界值
  // 对于α=0.025（双侧95%置信区间），临界值约为1.96
  if (alpha === 0.025) return 1.96;
  if (alpha === 0.05) return 1.645;
  if (alpha === 0.01) return 2.326;
  if (alpha === 0.005) return 2.576;
  
  // 二分法查找Z值
  let low = -6;
  let high = 6;
  let mid = 0;
  
  while (high - low > 0.0001) {
    mid = (low + high) / 2;
    const cdf = normalCDF(mid);
    
    if (cdf < 1 - alpha) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return mid;
};

// Z检验实现（用于方差已知的情况）
export const oneSampleZTest = (
  data: DataPoint[],
  nullMean: number,
  populationStdDev: number,
  alpha: number,
  alternative: AlternativeHypothesis = 'two-sided',
  axis: 'x' | 'y' = 'y'
): ZTestResult => {
  const values = data.map(point => point[axis]);
  const n = values.length;
  const sampleMean = calculateMean(data, axis);
  const zStatistic = (sampleMean - nullMean) / (populationStdDev / Math.sqrt(n));
  
  // 计算p值
  let pValue: number;
  switch (alternative) {
    case 'less':
      pValue = normalCDF(zStatistic);
      break;
    case 'greater':
      pValue = 1 - normalCDF(zStatistic);
      break;
    default: // two-sided
      pValue = 2 * Math.min(normalCDF(zStatistic), 1 - normalCDF(zStatistic));
      break;
  }
  
  // 计算临界值
  const criticalAlpha = alternative === 'two-sided' ? alpha / 2 : alpha;
  const zCritical = getZCriticalValue(criticalAlpha);
  
  // 计算置信区间
  const marginOfError = zCritical * (populationStdDev / Math.sqrt(n));
  const confidenceInterval: [number, number] = [
    sampleMean - marginOfError,
    sampleMean + marginOfError
  ];
  
  const significant = pValue < alpha;
  const conclusion = significant ? '拒绝原假设' : '接受原假设';
  
  let interpretation = '';
  if (alternative === 'two-sided') {
    interpretation = significant
      ? `在α=${alpha}的显著性水平下，拒绝原假设H₀: μ = ${nullMean}。样本均值${sampleMean.toFixed(4)}与假设均值${nullMean}存在显著差异。`
      : `在α=${alpha}的显著性水平下，接受原假设H₀: μ = ${nullMean}。样本均值${sampleMean.toFixed(4)}与假设均值${nullMean}无显著差异。`;
  } else if (alternative === 'less') {
    interpretation = significant
      ? `在α=${alpha}的显著性水平下，拒绝原假设H₀: μ ≥ ${nullMean}。样本均值${sampleMean.toFixed(4)}显著小于假设均值${nullMean}。`
      : `在α=${alpha}的显著性水平下，接受原假设H₀: μ ≥ ${nullMean}。样本均值${sampleMean.toFixed(4)}不显著小于假设均值${nullMean}。`;
  } else {
    interpretation = significant
      ? `在α=${alpha}的显著性水平下，拒绝原假设H₀: μ ≤ ${nullMean}。样本均值${sampleMean.toFixed(4)}显著大于假设均值${nullMean}。`
      : `在α=${alpha}的显著性水平下，接受原假设H₀: μ ≤ ${nullMean}。样本均值${sampleMean.toFixed(4)}不显著大于假设均值${nullMean}。`;
  }
  
  return {
    testType: 'z-test',
    statistic: zStatistic,
    zStatistic,
    pValue,
    criticalValue: zCritical,
    conclusion,
    interpretation,
    sampleSize: n,
    sampleMean,
    sampleStdDev: populationStdDev,
    nullMean,
    populationStdDev,
    confidenceInterval
  };
};

// 单样本t检验
export const oneSampleTTest = (
  data: DataPoint[],
  hypothesizedMean: number,
  alpha: number,
  axis: 'x' | 'y' = 'y'
): TTestResult => {
  const values = data.map(point => point[axis]);
  const n = values.length;
  const sampleMean = calculateMean(data, axis);
  const sampleStdDev = calculateStdDev(data, axis);
  
  if (n <= 1) {
    throw new Error('样本量太小，无法进行t检验');
  }
  
  // 计算t统计量
  const tStatistic = (sampleMean - hypothesizedMean) / (sampleStdDev / Math.sqrt(n));
  
  // 计算自由度
  const degreesOfFreedom = n - 1;
  
  // 计算p值（双侧检验）
  const pValue = 2 * (1 - tCDF(Math.abs(tStatistic), degreesOfFreedom));
  
  // 计算临界值
  const tCritical = getTCriticalValue(alpha / 2, degreesOfFreedom);
  
  // 计算置信区间
  const marginOfError = tCritical * (sampleStdDev / Math.sqrt(n));
  const confidenceInterval: [number, number] = [
    sampleMean - marginOfError,
    sampleMean + marginOfError
  ];
  
  const significant = pValue < alpha;
  const conclusion = significant ? '拒绝原假设' : '接受原假设';
  
  const interpretation = significant
    ? `在α=${alpha}的显著性水平下，拒绝原假设H₀: μ = ${hypothesizedMean}。样本均值${sampleMean.toFixed(4)}与假设均值${hypothesizedMean}存在显著差异。`
    : `在α=${alpha}的显著性水平下，接受原假设H₀: μ = ${hypothesizedMean}。样本均值${sampleMean.toFixed(4)}与假设均值${hypothesizedMean}无显著差异。`;
  
  return {
    testType: 'one-sample-t',
    statistic: tStatistic,
    tStatistic,
    pValue,
    criticalValue: tCritical,
    conclusion,
    interpretation,
    sampleSize: n,
    sampleMean,
    sampleStdDev,
    degreesOfFreedom,
    nullMean: hypothesizedMean,
    confidenceInterval
  };
};

// 双样本t检验
export const twoSampleTTest = (
  data1: DataPoint[],
  data2: DataPoint[],
  alpha: number,
  axis: 'x' | 'y' = 'y'
): TwoSampleTTestResult => {
  const values1 = data1.map(point => point[axis]);
  const values2 = data2.map(point => point[axis]);
  const n1 = values1.length;
  const n2 = values2.length;
  
  if (n1 <= 1 || n2 <= 1) {
    throw new Error('样本量太小，无法进行t检验');
  }
  
  // 计算均值和标准差
  const mean1 = calculateMeanValues(values1);
  const mean2 = calculateMeanValues(values2);
  const stdDev1 = calculateStdDevValues(values1);
  const stdDev2 = calculateStdDevValues(values2);
  
  // 计算均值差异
  const meanDifference = mean1 - mean2;
  
  // 计算合并方差
  const pooledVariance = ((n1 - 1) * stdDev1 * stdDev1 + (n2 - 1) * stdDev2 * stdDev2) / (n1 + n2 - 2);
  const pooledStdDev = Math.sqrt(pooledVariance);
  
  // 计算标准误差
  const standardError = pooledStdDev * Math.sqrt(1 / n1 + 1 / n2);
  
  // 计算t统计量
  const tStatistic = meanDifference / standardError;
  
  // 计算自由度
  const degreesOfFreedom = n1 + n2 - 2;
  
  // 计算p值（双侧检验）
  const pValue = 2 * (1 - tCDF(Math.abs(tStatistic), degreesOfFreedom));
  
  // 计算临界值
  const tCritical = getTCriticalValue(alpha / 2, degreesOfFreedom);
  
  // 计算置信区间
  const marginOfError = tCritical * standardError;
  const confidenceInterval: [number, number] = [
    meanDifference - marginOfError,
    meanDifference + marginOfError
  ];
  
  const significant = pValue < alpha;
  const conclusion = significant ? '拒绝原假设' : '接受原假设';
  
  const interpretation = significant
    ? `在α=${alpha}的显著性水平下，拒绝原假设H₀: μ₁ = μ₂。两组样本均值${mean1.toFixed(4)}和${mean2.toFixed(4)}存在显著差异。`
    : `在α=${alpha}的显著性水平下，接受原假设H₀: μ₁ = μ₂。两组样本均值${mean1.toFixed(4)}和${mean2.toFixed(4)}无显著差异。`;
  
  return {
    testType: 'two-sample-t',
    statistic: tStatistic,
    tStatistic,
    pValue,
    criticalValue: tCritical,
    conclusion,
    interpretation,
    sampleSize: n1 + n2,
    sampleMean: meanDifference,
    sampleStdDev: pooledStdDev,
    degreesOfFreedom,
    meanDifference,
    pooledStdDev,
    groupMeans: [mean1, mean2],
    confidenceInterval
  };
};

// 卡方拟合优度检验
export const chiSquareGoodnessOfFit = (
  observedCounts: number[],
  expectedCounts: number[],
  alpha: number
): ChiSquareTestResult => {
  if (observedCounts.length !== expectedCounts.length) {
    throw new Error('观测频数和期望频数的长度必须相同');
  }
  
  // 计算卡方统计量
  let chiSquare = 0;
  for (let i = 0; i < observedCounts.length; i++) {
    const expected = expectedCounts[i];
    if (expected <= 0) {
      throw new Error('期望频数必须大于0');
    }
    chiSquare += Math.pow(observedCounts[i] - expected, 2) / expected;
  }
  
  // 计算自由度
  const degreesOfFreedom = observedCounts.length - 1;
  
  // 计算p值
  const pValue = 1 - chiSquareCDF(chiSquare, degreesOfFreedom);
  
  // 计算临界值
  const chiSquareCritical = getChiSquareCriticalValue(alpha, degreesOfFreedom);
  
  const significant = pValue < alpha;
  const conclusion = significant ? '拒绝原假设' : '接受原假设';
  
  const interpretation = significant
    ? `在α=${alpha}的显著性水平下，拒绝原假设。数据不符合预期分布。`
    : `在α=${alpha}的显著性水平下，接受原假设。数据符合预期分布。`;
  
  return {
    testType: 'chi-square',
    statistic: chiSquare,
    chiSquare,
    pValue,
    criticalValue: chiSquareCritical,
    conclusion,
    interpretation,
    sampleSize: observedCounts.reduce((sum, count) => sum + count, 0),
    sampleMean: 0, // 不适用于卡方检验
    sampleStdDev: 0, // 不适用于卡方检验
    degreesOfFreedom,
    observedCounts,
    expectedCounts,
    confidenceInterval: [0, 0] // 不适用于卡方检验
  };
};

// 正态性检验（简化版）
export const normalityTest = (
  data: DataPoint[],
  alpha: number,
  axis: 'x' | 'y' = 'y'
): HypothesisTestResult => {
  const values = data.map(point => point[axis]);
  const n = values.length;
  
  if (n < 3) {
    throw new Error('样本量太小，无法进行正态性检验');
  }
  
  // 简化的正态性检验（基于偏度和峰度）
  const mean = calculateMeanValues(values);
  const stdDev = calculateStdDevValues(values);
  
  // 计算偏度
  let skewness = 0;
  for (const value of values) {
    skewness += Math.pow((value - mean) / stdDev, 3);
  }
  skewness = skewness / n;
  
  // 计算峰度
  let kurtosis = 0;
  for (const value of values) {
    kurtosis += Math.pow((value - mean) / stdDev, 4);
  }
  kurtosis = (kurtosis / n) - 3; // 减去3得到超额峰度
  
  // 使用偏度和峰度的Z分数进行检验
  const skewnessZ = skewness / Math.sqrt(6 / n);
  const kurtosisZ = kurtosis / Math.sqrt(24 / n);
  
  // 综合p值（双侧检验）
  const skewnessPValue = 2 * (1 - normalCDF(Math.abs(skewnessZ)));
  const kurtosisPValue = 2 * (1 - normalCDF(Math.abs(kurtosisZ)));
  const pValue = Math.min(skewnessPValue, kurtosisPValue);
  
  const significant = pValue < alpha;
  const conclusion = significant ? '拒绝原假设' : '接受原假设';
  
  const interpretation = significant
    ? `在α=${alpha}的显著性水平下，拒绝原假设。数据不符合正态分布。`
    : `在α=${alpha}的显著性水平下，接受原假设。数据符合正态分布。`;
  
  return {
    testType: 'normality',
    statistic: Math.abs(skewnessZ) + Math.abs(kurtosisZ),
    pValue,
    criticalValue: getZCriticalValue(alpha / 2),
    conclusion,
    interpretation,
    sampleSize: n,
    sampleMean: mean,
    sampleStdDev: stdDev,
    degreesOfFreedom: n - 1,
    confidenceInterval: [0, 0] // 不适用于正态性检验
  };
};

// t分布CDF近似实现
const tCDF = (t: number, degreesOfFreedom: number): number => {
  // 使用正则化不完全Beta函数计算t分布CDF
  const x = degreesOfFreedom / (degreesOfFreedom + t * t);
  const p = 0.5 * betaRegularized(degreesOfFreedom / 2, 0.5, x);
  return t >= 0 ? 1 - p : p;
};

// 卡方分布CDF近似实现
const chiSquareCDF = (x: number, degreesOfFreedom: number): number => {
  // 使用正则化不完全Gamma函数计算卡方分布CDF
  return gammaRegularized(degreesOfFreedom / 2, x / 2);
};

// 正则化不完全Beta函数近似
const betaRegularized = (a: number, b: number, x: number): number => {
  // 简化实现，实际应用中应使用更精确的算法
  // 使用级数展开近似
  let sum = 1;
  let term = 1;

  
  for (let n = 1; n <= 20; n++) {
    term *= (n - 1 - a - b) * x / ((a + n - 1) * n);
    sum += term;
  }
  
  return Math.pow(x, a) * Math.pow(1 - x, b) * sum / betaFunction(a, b);
};

// Beta函数近似
const betaFunction = (a: number, b: number): number => {
  // 使用Gamma函数的关系：B(a,b) = Γ(a)Γ(b)/Γ(a+b)
  return gammaFunction(a) * gammaFunction(b) / gammaFunction(a + b);
};

// Gamma函数近似（使用Lanczos近似）
const gammaFunction = (z: number): number => {
  // 简化的Gamma函数近似
  if (z <= 0) return Number.NaN;
  
  const p = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gammaFunction(1 - z));
  }
  
  z -= 1;
  let x = p[0];
  for (let i = 1; i < p.length; i++) {
    x += p[i] / (z + i);
  }
  
  const t = z + p.length - 0.5;
  const sqrt2Pi = Math.sqrt(2 * Math.PI);
  
  return sqrt2Pi * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
};

// 正则化不完全Gamma函数P(a, x)近似
const gammaRegularized = (a: number, x: number): number => {
  // 简化实现，使用级数展开
  if (x <= 0) return 0;
  if (x > a + 1) return 1 - gammaRegularizedComplement(a, x);
  
  let sum = 1;
  let term = 1;

  
  for (let n = 1; n <= 20; n++) {
    term *= x / (a + n);
    sum += term;
  }
  
  return Math.pow(x, a) * Math.exp(-x) * sum / gammaFunction(a);
};

// 正则化不完全Gamma函数的补函数Q(a, x)近似
const gammaRegularizedComplement = (a: number, x: number): number => {
  // 简化实现
  if (x <= 0) return 1;
  
  let b = x + 1 - a;
  let c = 1 / 1e-16;
  let d = 1 / b;
  let h = d;
  
  for (let i = 1; i <= 20; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    c = b + an / c;
    d = 1 / d;
    h *= d * c;
  }
  
  return Math.exp(-x + a * Math.log(x)) * h / gammaFunction(a);
};

// 获取t临界值
const getTCriticalValue = (alpha: number, degreesOfFreedom: number): number => {
  // 使用二分法查找t临界值
  let low = 0;
  let high = 10;
  let mid = 5;
  
  while (high - low > 0.0001) {
    mid = (low + high) / 2;
    const cdf = tCDF(mid, degreesOfFreedom);
    
    if (cdf < 1 - alpha) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return mid;
};

// 获取卡方临界值
const getChiSquareCriticalValue = (alpha: number, degreesOfFreedom: number): number => {
  // 使用二分法查找卡方临界值
  let low = 0;
  let high = 100;
  let mid = 50;
  
  while (high - low > 0.0001) {
    mid = (low + high) / 2;
    const cdf = chiSquareCDF(mid, degreesOfFreedom);
    
    if (cdf < 1 - alpha) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return mid;
};

// 导出tTest函数，兼容旧版本接口
export const tTest = (
  values: number[],
  nullMean: number
): TTestResult & { tStatistic: number; sampleMean: number; degreesOfFreedom: number } => {
  // 构造临时的DataPoint数组
  const data = values.map((value, index) => ({ x: index, y: value }));
  const result = oneSampleTTest(data, nullMean, 0.05, 'y');
  
  return {
    ...result,
    tStatistic: result.statistic,
    sampleMean: result.sampleMean,
    degreesOfFreedom: result.degreesOfFreedom!,
    nullMean
  };
};