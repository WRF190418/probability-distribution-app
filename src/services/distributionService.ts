import { Distribution, DistributionDataPoint } from '../types';
import { normalDistribution, binomialDistribution, poissonDistribution } from '../utils/mathUtils'

export const getDistributions = (): Distribution[] => {
  return [
    {
      id: 'normal',
      name: '正态分布',
      formula: 'f(x) = (1/σ√(2π)) e^(-(x-μ)²/(2σ²))',
      parameters: { mean: 0, stdDev: 1 },
      description: '正态分布是一种连续概率分布，呈钟形曲线，由均值(μ)和标准差(σ)决定。',
      generateData: (params, range, points) => {
        const { mean, stdDev } = params;
        const data: DistributionDataPoint[] = [];
        const step = (range[1] - range[0]) / points;
        
        for (let x = range[0]; x <= range[1]; x += step) {
          const y = normalDistribution(x, mean, stdDev);
          data.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(6)) });
        }
        
        return data;
      }
    },
    {
      id: 'binomial',
      name: '二项分布',
      formula: 'P(k) = C(n,k) p^k (1-p)^(n-k)',
      parameters: { n: 10, p: 0.5 },
      description: '二项分布表示在n次独立的是/非试验中成功k次的概率，每次试验成功的概率为p。',
      generateData: (params, _, points) => {
        const { n, p } = params;
        const data: DistributionDataPoint[] = [];
        
        for (let k = 0; k <= Math.min(n, points); k++) {
          const y = binomialDistribution(k, n, p);
          data.push({ x: k, y: parseFloat(y.toFixed(6)) });
        }
        
        return data;
      }
    },
    {
      id: 'poisson',
      name: '泊松分布',
      formula: 'P(k) = (λ^k e^(-λ)) / k!',
      parameters: { lambda: 2 },
      description: '泊松分布表示在固定时间或空间内发生k次事件的概率，其中事件以已知的恒定速率λ发生。',
      generateData: (params, _, points) => {
        const { lambda } = params;
        const data: DistributionDataPoint[] = [];
        
        for (let k = 0; k <= points; k++) {
          const y = poissonDistribution(k, lambda);
          data.push({ x: k, y: parseFloat(y.toFixed(6)) });
        }
        
        return data;
      }
    }
  ];
};

export const getDistributionById = (id: string): Distribution | undefined => {
  return getDistributions().find(dist => dist.id === id);
};