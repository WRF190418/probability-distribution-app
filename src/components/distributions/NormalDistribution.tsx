import React from 'react';
import DistributionChart from './DistributionChart';
import ParameterSlider from '../common/ParameterSlider';
import FormulaDisplay from '../common/FormulaDisplay';
import { useDistribution } from '../../hooks/useDistribution';

const NormalDistribution: React.FC = () => {
  const { distribution, parameters, data, loading, updateParameter } = useDistribution('normal', [-5, 5], 100);

  if (loading || !distribution) {
    return <div>加载中...</div>;
  }

  return (
    <div className="distribution-container">
      <h2>{distribution.name}</h2>
      <p>{distribution.description}</p>
      
      <FormulaDisplay formula={distribution.formula} />
      
      <div className="parameters">
        <ParameterSlider
          label="均值 (μ)"
          value={parameters.mean || 0}
          onChange={(value) => updateParameter('mean', value)}
          min={-3}
          max={3}
          step={0.1}
        />
        <ParameterSlider
          label="标准差 (σ)"
          value={parameters.stdDev || 1}
          onChange={(value) => updateParameter('stdDev', value)}
          min={0.1}
          max={3}
          step={0.1}
        />
      </div>
      
      <div className="chart-container">
        <DistributionChart data={data} isDiscrete={false} />
      </div>
    </div>
  );
};

export default NormalDistribution;