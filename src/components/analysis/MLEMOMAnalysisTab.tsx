import React, { useState, useMemo } from 'react';
import { DataPoint } from '../DataAnalysisApp';
import './MLEMOMAnalysisTab.css';

type DistributionType = 'normal' | 'exponential' | 'poisson';

interface MLEMOMEstimates {
  distribution: DistributionType;
  mleParams: Record<string, number>;
  momParams: Record<string, number>;
  comparison?: string;
}

interface MLEMOMAnalysisTabProps {
  data: DataPoint[];
}

const MLEMOMAnalysisTab: React.FC<MLEMOMAnalysisTabProps> = ({ data }) => {
  const [selectedDistribution, setSelectedDistribution] = useState<DistributionType>('normal');
  const [selectedAxis, setSelectedAxis] = useState<'x' | 'y'>('x');

  const estimates = useMemo(() => {
    if (data.length === 0) return null;
    return calculateMLEMOMEstimates(data, selectedDistribution, selectedAxis);
  }, [data, selectedDistribution, selectedAxis]);

  return (
    <div className="mlemom-analysis-tab">
      <h2>MLE/MoM 参数估计</h2>

      <div className="analysis-controls">
        <div className="control-group">
          <label htmlFor="distribution-select">选择分布类型:</label>
          <select
            id="distribution-select"
            value={selectedDistribution}
            onChange={(e) => setSelectedDistribution(e.target.value as DistributionType)}
            className="distribution-select"
          >
            <option value="normal">正态分布</option>
            <option value="exponential">指数分布</option>
            <option value="poisson">泊松分布</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="axis-select">选择分析轴:</label>
          <select
            id="axis-select"
            value={selectedAxis}
            onChange={(e) => setSelectedAxis(e.target.value as 'x' | 'y')}
            className="axis-select"
          >
            <option value="x">X轴数据</option>
            <option value="y">Y轴数据</option>
          </select>
        </div>
      </div>

      {estimates && (
        <div className="estimates-container">
          <div className="estimates-grid">
            <div className="estimate-card">
              <h3>最大似然估计 (MLE)</h3>
              <div className="params-list">
                {Object.entries(estimates.mleParams).map(([param, value]) => (
                  <div key={`mle-${param}`} className="param-item">
                    <span className="param-label">{getParamLabel(param)}:</span>
                    <span className="param-value">{value.toFixed(6)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="estimate-card">
              <h3>矩法估计 (MoM)</h3>
              <div className="params-list">
                {Object.entries(estimates.momParams).map(([param, value]) => (
                  <div key={`mom-${param}`} className="param-item">
                    <span className="param-label">{getParamLabel(param)}:</span>
                    <span className="param-value">{value.toFixed(6)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {estimates.comparison && (
            <div className="comparison-card">
              <h3>估计结果比较</h3>
              <p>{estimates.comparison}</p>
            </div>
          )}

          <div className="formula-section">
            <h3>使用的估计公式</h3>
            <div className="formulas-container">
              <div className="formula">
                <h4>MLE 公式</h4>
                <div className="formula-content">
                  {getMLEFormula(selectedDistribution)}
                </div>
              </div>
              <div className="formula">
                <h4>MoM 公式</h4>
                <div className="formula-content">
                  {getMOMFormula(selectedDistribution)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {data.length === 0 && (
        <div className="no-data-message">
          <p>请先导入或生成数据以进行分析</p>
        </div>
      )}
    </div>
  );
};

// 计算MLE和MoM估计
function calculateMLEMOMEstimates(data: DataPoint[], distribution: DistributionType, axis: 'x' | 'y'): MLEMOMEstimates {
  const values = data.map(point => point[axis]).filter(val => !isNaN(val));
  const n = values.length;
  const mean = values.reduce((sum, val) => sum + val, 0) / n;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / n;

  switch (distribution) {
    case 'normal': {
      // 正态分布 N(μ, σ²)
      // MLE: μ̂ = sample mean, σ²̂ = sample variance
      const mleMu = mean;
      const mleSigma = Math.sqrt(variance);
      
      // MoM: 与MLE相同
      const momMu = mean;
      const momSigma = Math.sqrt(variance);
      
      return {
        distribution,
        mleParams: { mu: mleMu, sigma: mleSigma },
        momParams: { mu: momMu, sigma: momSigma },
        comparison: "对于正态分布，MLE和MoM估计是一致的"
      };
    }
    
    case 'exponential': {
      // 指数分布 Exp(λ)
      // MLE: λ̂ = 1 / sample mean
      const mleLambda = 1 / mean;
      
      // MoM: 与MLE相同
      const momLambda = 1 / mean;
      
      return {
        distribution,
        mleParams: { lambda: mleLambda },
        momParams: { lambda: momLambda },
        comparison: "对于指数分布，MLE和MoM估计是一致的"
      };
    }
    
    case 'poisson': {
      // 泊松分布 Poisson(λ)
      // MLE: λ̂ = sample mean
      const mleLambda = mean;
      
      // MoM: 与MLE相同
      const momLambda = mean;
      
      return {
        distribution,
        mleParams: { lambda: mleLambda },
        momParams: { lambda: momLambda },
        comparison: "对于泊松分布，MLE和MoM估计是一致的"
      };
    }
    
    default:
      throw new Error(`未知分布类型: ${distribution}`);
  }
}

// 获取参数标签
function getParamLabel(param: string): string {
  const labels: Record<string, string> = {
    mu: 'μ (均值)',
    sigma: 'σ (标准差)',
    lambda: 'λ'
  };
  return labels[param] || param;
}

// 获取MLE公式
function getMLEFormula(distribution: DistributionType): string {
  const formulas: Record<DistributionType, string> = {
    normal: '对于正态分布 N(μ, σ²):\nμ̂ = (1/n) Σxᵢ\nσ̂² = (1/n) Σ(xᵢ - μ̂)²',
    exponential: '对于指数分布 Exp(λ):\nλ̂ = 1 / [(1/n) Σxᵢ]',
    poisson: '对于泊松分布 Poisson(λ):\nλ̂ = (1/n) Σxᵢ'
  };
  return formulas[distribution];
}

// 获取MoM公式
function getMOMFormula(distribution: DistributionType): string {
  const formulas: Record<DistributionType, string> = {
    normal: '对于正态分布 N(μ, σ²):\nμ̂ = (1/n) Σxᵢ\nσ̂² = (1/n) Σ(xᵢ - μ̂)²',
    exponential: '对于指数分布 Exp(λ):\nλ̂ = 1 / [(1/n) Σxᵢ]',
    poisson: '对于泊松分布 Poisson(λ):\nλ̂ = (1/n) Σxᵢ'
  };
  return formulas[distribution];
}

export default MLEMOMAnalysisTab;