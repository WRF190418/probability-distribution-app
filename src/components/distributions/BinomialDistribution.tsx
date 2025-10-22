import React from 'react';
import DistributionChart from './DistributionChart';
import ParameterSlider from '../common/ParameterSlider';
import FormulaDisplay from '../common/FormulaDisplay';
import { useDistribution } from '../../hooks/useDistribution';

const BinomialDistribution: React.FC = () => {
  const { distribution, parameters, data, loading, updateParameter } = useDistribution('binomial', [0, 20], 21);

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
          label="试验次数 (n)"
          value={parameters.n || 10}
          onChange={(value) => updateParameter('n', Math.round(value))}
          min={1}
          max={20}
          step={1}
        />
        <ParameterSlider
          label="成功概率 (p)"
          value={parameters.p || 0.5}
          onChange={(value) => updateParameter('p', value)}
          min={0.1}
          max={0.9}
          step={0.05}
        />
      </div>
      
      <div className="chart-container">
        <DistributionChart data={data} isDiscrete={true} />
      </div>
    </div>
  );
};

export default BinomialDistribution;