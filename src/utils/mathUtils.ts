// import { evaluate } from 'mathjs'; // 暂时注释，需要时启用

export const factorial = (n: number): number => {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

export const combination = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
};

export const normalDistribution = (
  x: number,
  mean: number,
  stdDev: number
): number => {
  const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return coefficient * Math.exp(exponent);
};

export const binomialDistribution = (
  k: number,
  n: number,
  p: number
): number => {
  if (k < 0 || k > n || p < 0 || p > 1) return 0;
  return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

export const poissonDistribution = (
  k: number,
  lambda: number
): number => {
  if (k < 0 || lambda <= 0) return 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

// 假设检验相关函数

// 计算t分布的概率密度函数
export const tDistributionPDF = (x: number, df: number): number => {
  if (df <= 0) return 0;
  const gamma = (n: number): number => {
    if (n === 1) return 1;
    if (n === 0.5) return Math.sqrt(Math.PI);
    return (n - 1) * gamma(n - 1);
  };
  
  const numerator = gamma((df + 1) / 2);
  const denominator = Math.sqrt(df * Math.PI) * gamma(df / 2);
  const coefficient = numerator / denominator;
  const power = Math.pow(1 + (x * x) / df, -(df + 1) / 2);
  return coefficient * power;
};

// 计算t分布的累积分布函数（近似）
export const tDistributionCDF = (x: number, df: number): number => {
  if (df <= 0) return 0;
  
  // 使用近似方法计算t分布CDF
  if (df >= 30) {
    // 大样本时近似为标准正态分布
    return normalCDF(x);
  }
  
  // 简化的t分布CDF计算
  const absX = Math.abs(x);
  let cdf = 0.5;
  
  if (absX > 0) {
    // 使用数值积分近似
    const step = 0.01;
    let sum = 0;
    for (let t = -6; t <= x; t += step) {
      sum += tDistributionPDF(t, df) * step;
    }
    cdf = sum;
  }
  
  return Math.max(0, Math.min(1, cdf));
};

// 计算标准正态分布的累积分布函数
export const normalCDF = (x: number): number => {
  // 使用误差函数的近似
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
};

// 误差函数近似
export const erf = (x: number): number => {
  // Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  
  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  
  return sign * y;
};

// 计算卡方分布的概率密度函数
export const chiSquarePDF = (x: number, df: number): number => {
  if (x <= 0 || df <= 0) return 0;
  if (df === 1) {
    return Math.exp(-x / 2) / Math.sqrt(2 * Math.PI * x);
  }
  if (df === 2) {
    return Math.exp(-x / 2) / 2;
  }
  
  // 一般情况的近似
  const k = df / 2;
  const numerator = Math.pow(x, k - 1) * Math.exp(-x / 2);
  const denominator = Math.pow(2, k) * gamma(k);
  return numerator / denominator;
};

// 伽马函数近似
export const gamma = (x: number): number => {
  if (x < 0.5) {
    return Math.PI / (Math.sin(Math.PI * x) * gamma(1 - x));
  }
  
  x -= 1;
  let result = 0.99999999999980993;
  const coefficients = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343279686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  
  for (let i = 0; i < coefficients.length; i++) {
    result += coefficients[i] / (x + i + 1);
  }
  
  const t = x + coefficients.length - 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * result;
};

// 计算卡方分布的累积分布函数（近似）
export const chiSquareCDF = (x: number, df: number): number => {
  if (x <= 0) return 0;
  if (df <= 0) return 0;
  
  // 使用数值积分近似
  const step = 0.01;
  let sum = 0;
  for (let t = 0; t <= x; t += step) {
    sum += chiSquarePDF(t, df) * step;
  }
  
  return Math.max(0, Math.min(1, sum));
};

// 计算F分布的累积分布函数（简化）
export const fDistributionCDF = (x: number, df1: number, df2: number): number => {
  if (x <= 0 || df1 <= 0 || df2 <= 0) return 0;
  
  // 简化的F分布CDF计算
  const ratio = (df1 * x) / (df1 * x + df2);
  return betaCDF(ratio, df1 / 2, df2 / 2);
};

// 贝塔分布的累积分布函数（简化）
export const betaCDF = (x: number, a: number, b: number): number => {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  if (a <= 0 || b <= 0) return 0;
  
  // 简化的贝塔分布CDF计算
  const step = 0.001;
  let sum = 0;
  for (let t = 0; t <= x; t += step) {
    sum += Math.pow(t, a - 1) * Math.pow(1 - t, b - 1) * step;
  }
  
  const beta = gamma(a) * gamma(b) / gamma(a + b);
  return sum / beta;
};

// 计算假设检验的p值
export const calculatePValue = (
  statistic: number,
  df: number,
  testType: 't' | 'z' | 'chi-square' | 'f',
  direction: 'two-tailed' | 'left-tailed' | 'right-tailed'
): number => {
  let pValue: number;
  
  switch (testType) {
    case 't':
      pValue = 1 - tDistributionCDF(Math.abs(statistic), df);
      break;
    case 'z':
      pValue = 1 - normalCDF(Math.abs(statistic));
      break;
    case 'chi-square':
      pValue = 1 - chiSquareCDF(statistic, df);
      break;
    case 'f':
      pValue = 1 - fDistributionCDF(statistic, df, 1); // 简化，假设df2=1
      break;
    default:
      pValue = 0.5;
  }
  
  if (direction === 'two-tailed') {
    pValue *= 2;
  } else if (direction === 'left-tailed' && statistic > 0) {
    pValue = 1 - pValue;
  } else if (direction === 'right-tailed' && statistic < 0) {
    pValue = 1 - pValue;
  }
  
  return Math.max(0, Math.min(1, pValue));
};

// 计算临界值
export const calculateCriticalValue = (
  alpha: number,
  df: number,
  testType: 't' | 'z' | 'chi-square' | 'f',
  direction: 'two-tailed' | 'left-tailed' | 'right-tailed'
): number => {
  const adjustedAlpha = direction === 'two-tailed' ? alpha / 2 : alpha;
  
  switch (testType) {
    case 't':
      return getTCriticalValue(df, adjustedAlpha);
    case 'z':
      return getZCriticalValue(adjustedAlpha);
    case 'chi-square':
      return getChiSquareCriticalValue(df, adjustedAlpha);
    case 'f':
      return getFCriticalValue(df, 1, adjustedAlpha); // 简化，假设df2=1
    default:
      return 1.96;
  }
};

// 获取t分布临界值
export const getTCriticalValue = (df: number, alpha: number): number => {
  // 更精确的t分布临界值表
  const tTable: { [key: number]: { [key: number]: number } } = {
    0.01: { 1: 6.314, 2: 2.920, 3: 2.353, 4: 2.132, 5: 2.015, 6: 1.943, 7: 1.895, 8: 1.860, 9: 1.833, 10: 1.812, 15: 1.753, 20: 1.725, 25: 1.708, 30: 1.697, 40: 1.684, 50: 1.676, 60: 1.671, 80: 1.664, 100: 1.660, 120: 1.658, 1000: 1.645 },
    0.025: { 1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228, 15: 2.131, 20: 2.086, 25: 2.060, 30: 2.042, 40: 2.021, 50: 2.009, 60: 2.000, 80: 1.990, 100: 1.984, 120: 1.980, 1000: 1.960 },
    0.05: { 1: 31.821, 2: 6.965, 3: 4.541, 4: 3.747, 5: 3.365, 6: 3.143, 7: 2.998, 8: 2.896, 9: 2.821, 10: 2.764, 15: 2.602, 20: 2.528, 25: 2.485, 30: 2.457, 40: 2.423, 50: 2.403, 60: 2.390, 80: 2.374, 100: 2.364, 120: 2.358, 1000: 2.326 }
  };
  
  const closestDf = findClosestDf(df);
  return tTable[alpha]?.[closestDf] || 1.96;
};

// 获取z分布临界值
export const getZCriticalValue = (alpha: number): number => {
  const zTable: { [key: number]: number } = {
    0.01: 2.576,
    0.025: 1.96,
    0.05: 1.645,
    0.10: 1.282
  };
  
  return zTable[alpha] || 1.96;
};

// 获取卡方分布临界值
export const getChiSquareCriticalValue = (df: number, alpha: number): number => {
  const chiSquareTable: { [key: number]: { [key: number]: number } } = {
    0.01: { 1: 6.635, 2: 9.210, 3: 11.345, 4: 13.277, 5: 15.086, 6: 16.812, 7: 18.475, 8: 20.090, 9: 21.666, 10: 23.209, 15: 30.578, 20: 37.566, 25: 44.314, 30: 50.892, 40: 63.691, 50: 76.154, 60: 88.379, 70: 100.425, 80: 112.329, 90: 124.116, 100: 135.807 },
    0.05: { 1: 3.841, 2: 5.991, 3: 7.815, 4: 9.488, 5: 11.070, 6: 12.592, 7: 14.067, 8: 15.507, 9: 16.919, 10: 18.307, 15: 24.996, 20: 31.410, 25: 37.652, 30: 43.773, 40: 55.758, 50: 67.505, 60: 79.082, 70: 90.531, 80: 101.879, 90: 113.145, 100: 124.342 },
    0.10: { 1: 2.706, 2: 4.605, 3: 6.251, 4: 7.779, 5: 9.236, 6: 10.645, 7: 12.017, 8: 13.362, 9: 14.684, 10: 15.987, 15: 22.307, 20: 28.412, 25: 34.382, 30: 40.256, 40: 51.805, 50: 63.167, 60: 74.397, 70: 85.527, 80: 96.578, 90: 107.565, 100: 118.498 }
  };
  
  const closestDf = findClosestDf(df);
  return chiSquareTable[alpha]?.[closestDf] || 3.841;
};

// 获取F分布临界值（简化）
export const getFCriticalValue = (df1: number, df2: number, alpha: number): number => {
  // 简化的F分布临界值
  if (df1 === 1) {
    const tValue = getTCriticalValue(df2, alpha);
    return tValue * tValue;
  }
  
  // 其他情况的简化处理
  return 3.84; // 默认值
};

// 辅助函数：找到最接近的自由度
export const findClosestDf = (df: number): number => {
  const dfValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 120, 1000];
  
  for (let i = 0; i < dfValues.length - 1; i++) {
    if (df <= dfValues[i + 1]) {
      return dfValues[i];
    }
  }
  
  return dfValues[dfValues.length - 1];
};

// 计算均值
export const calculateMean = (data: { x: number }[]): number => {
  if (data.length === 0) return 0;
  return data.reduce((sum, point) => sum + point.x, 0) / data.length;
};

// 计算标准差
export const calculateStdDev = (data: { x: number }[]): number => {
  if (data.length <= 1) return 0;
  const mean = calculateMean(data);
  const variance = data.reduce((sum, point) => sum + Math.pow(point.x - mean, 2), 0) / (data.length - 1);
  return Math.sqrt(variance);
};