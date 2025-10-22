import { useState, useEffect } from 'react';
import { getDistributionById } from '../services/distributionService';
import { Distribution, DistributionDataPoint, DistributionParameters } from '../types';

export const useDistribution = (
  distributionId: string,
  range: [number, number] = [-5, 5],
  points: number = 100
) => {
  const [distribution, setDistribution] = useState<Distribution | null>(null);
  const [parameters, setParameters] = useState<DistributionParameters>({});
  const [data, setData] = useState<DistributionDataPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const dist = getDistributionById(distributionId);
    if (dist) {
      setDistribution(dist);
      setParameters(dist.parameters);
      setData(dist.generateData(dist.parameters, range, points));
    }
    setLoading(false);
  }, [distributionId, range, points]);

  const updateParameter = (paramName: string, value: number) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  useEffect(() => {
    if (distribution) {
      setData(distribution.generateData(parameters, range, points));
    }
  }, [parameters, distribution, range, points]);

  return {
    distribution,
    parameters,
    data,
    loading,
    updateParameter
  };
};