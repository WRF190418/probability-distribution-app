import React, { useState, useMemo } from 'react';
import { DataPoint } from '../DataAnalysisApp';
import '../modernStyles.css';

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
      <h2 className="gradient-text">MLE/MoM Parameter Estimation</h2>

      <div className="analysis-controls">
        <div className="control-group">
          <label htmlFor="distribution-select">Select Distribution Type:</label>
          <select
            id="distribution-select"
            value={selectedDistribution}
            onChange={(e) => setSelectedDistribution(e.target.value as DistributionType)}
            className="glass-input"
          >
            <option value="normal">Normal Distribution</option>
            <option value="exponential">Exponential Distribution</option>
            <option value="poisson">Poisson Distribution</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="axis-select">Select Analysis Axis:</label>
          <select
            id="axis-select"
            value={selectedAxis}
            onChange={(e) => setSelectedAxis(e.target.value as 'x' | 'y')}
            className="glass-input"
          >
            <option value="x">X-axis Data</option>
            <option value="y">Y-axis Data</option>
          </select>
        </div>
      </div>

      {estimates && (
        <div className="estimates-container">
          <div className="estimates-grid">
            <div className="estimate-card card glass">
              <h3 className="gradient-text">Maximum Likelihood Estimation (MLE)</h3>
              <div className="params-list">
                {Object.entries(estimates.mleParams).map(([param, value]) => (
                  <div key={`mle-${param}`} className="param-item">
                    <span className="param-label">{getParamLabel(param)}:</span>
                    <span className="param-value">{value.toFixed(6)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="estimate-card card glass">
              <h3 className="gradient-text">Method of Moments Estimation (MoM)</h3>
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
            <div className="comparison-card card glass">
              <h3 className="gradient-text">Estimation Comparison</h3>
              <p>{estimates.comparison}</p>
            </div>
          )}

          <div className="formula-section">
            <h3 className="gradient-text">Estimation Formulas Used</h3>
            <div className="formulas-container">
              <div className="formula card glass">
                <h4 className="gradient-text">MLE Formula</h4>
                <div className="formula-content">
                  {getMLEFormula(selectedDistribution)}
                </div>
              </div>
              <div className="formula card glass">
                <h4 className="gradient-text">MoM Formula</h4>
                <div className="formula-content">
                  {getMOMFormula(selectedDistribution)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {data.length === 0 && (
        <div className="no-data-message card glass">
          <p>Please import or generate data for analysis first</p>
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
        comparison: "For normal distribution, MLE and MoM estimates are consistent"
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
        comparison: "For exponential distribution, MLE and MoM estimates are consistent"
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
        comparison: "For Poisson distribution, MLE and MoM estimates are consistent"
      };
    }
    
    default:
      throw new Error(`Unknown distribution type: ${distribution}`);
  }
}

// Get parameter label
function getParamLabel(param: string): string {
  const labels: Record<string, string> = {
    mu: 'μ (Mean)',
    sigma: 'σ (Standard Deviation)',
    lambda: 'λ'
  };
  return labels[param] || param;
}

// Get MLE formula
function getMLEFormula(distribution: DistributionType): string {
  const formulas: Record<DistributionType, string> = {
    normal: 'For Normal Distribution N(μ, σ²):\nμ̂ = (1/n) Σxᵢ\nσ̂² = (1/n) Σ(xᵢ - μ̂)²',
    exponential: 'For Exponential Distribution Exp(λ):\nλ̂ = 1 / [(1/n) Σxᵢ]',
    poisson: 'For Poisson Distribution Poisson(λ):\nλ̂ = (1/n) Σxᵢ'
  };
  return formulas[distribution];
}

// Get MoM formula
function getMOMFormula(distribution: DistributionType): string {
  const formulas: Record<DistributionType, string> = {
    normal: 'For Normal Distribution N(μ, σ²):\nμ̂ = (1/n) Σxᵢ\nσ̂² = (1/n) Σ(xᵢ - μ̂)²',
    exponential: 'For Exponential Distribution Exp(λ):\nλ̂ = 1 / [(1/n) Σxᵢ]',
    poisson: 'For Poisson Distribution Poisson(λ):\nλ̂ = (1/n) Σxᵢ'
  };
  return formulas[distribution];
}

export default MLEMOMAnalysisTab;