import React from 'react';
import DistributionChart from './DistributionChart';
import ParameterSlider from '../common/ParameterSlider';
import FormulaDisplay from '../common/FormulaDisplay';
import { useDistribution } from '../../hooks/useDistribution';

const PoissonDistribution: React.FC = () => {
  const { distribution, parameters, data, loading, updateParameter } = useDistribution('poisson', [0, 20], 21);

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
          label="事件率 (λ)"
          value={parameters.lambda || 5}
          onChange={(value) => updateParameter('lambda', value)}
          min={0.5}
          max={15}
          step={0.5}
        />
      </div>
      
      <div className="chart-container">
        <DistributionChart data={data} isDiscrete={true} />
      </div>
    </div>
  );
};

export default PoissonDistribution;