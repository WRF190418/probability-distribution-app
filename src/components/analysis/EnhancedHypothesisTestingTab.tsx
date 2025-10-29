import React, { useState } from 'react';
import { DataPoint } from '../DataAnalysisApp';
import { 
  oneSampleTTest, 
  oneSampleZTest,
  twoSampleTTest, 
  chiSquareGoodnessOfFit, 
  normalityTest,
  TTestResult,
  TwoSampleTTestResult,
  ChiSquareTestResult,
  HypothesisTestResult,
  TestDirection
} from '../../utils/hypothesisTestingUtils';
import '../modernStyles.css';

type TestType = 'one-sample-t' | 'one-sample-z' | 'two-sample-t' | 'chi-square' | 'normality';

interface EnhancedHypothesisTestingTabProps {
  data: DataPoint[];
  secondaryData: DataPoint[];
}

const EnhancedHypothesisTestingTab: React.FC<EnhancedHypothesisTestingTabProps> = ({ data, secondaryData }) => {
  const [testType, setTestType] = useState<TestType>('one-sample-t');
  const [axis, setAxis] = useState<'x' | 'y'>('x');
  const [alpha, setAlpha] = useState<number>(0.05);
  const [hypothesizedMean, setHypothesizedMean] = useState<number>(0);
  const [knownVariance, setKnownVariance] = useState<number>(1);
  const [testDirection, setTestDirection] = useState<TestDirection>('two-tailed');
  const [testResult, setTestResult] = useState<any>(null);
  const [secondData, setSecondData] = useState<DataPoint[]>([]);
  const [expectedDistribution, setExpectedDistribution] = useState<string>('uniform');

  const handleRunTest = () => {
    try {
      let result: any = null;

      switch (testType) {
        case 'one-sample-t':
          result = oneSampleTTest(data, hypothesizedMean, alpha, axis);
          break;
        
        case 'one-sample-z':
          result = oneSampleZTest(data, hypothesizedMean, knownVariance, alpha, 'two-sided', axis);
          break;
        
        case 'two-sample-t':
          if (secondaryData.length === 0) {
            alert('Please generate or import a second dataset');
            return;
          }
          result = twoSampleTTest(data, secondaryData, alpha, axis);
          break;
        
        case 'chi-square':
          // 准备观测频数（按区间分组）
          const values = data.map(point => point[axis]);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const numBins = Math.min(10, Math.floor(values.length / 5));
          const binWidth = (max - min) / numBins;
          
          const observedCounts = new Array(numBins).fill(0);
          values.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
            observedCounts[binIndex]++;
          });
          
          // 准备期望频数
          let expectedCounts: number[] = [];
          const totalCount = values.length;
          
          if (expectedDistribution === '均匀分布') {
            expectedCounts = new Array(numBins).fill(totalCount / numBins);
          } else if (expectedDistribution === '正态分布') {
            // 计算正态分布的期望频数
            const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
            const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
            const stdDev = Math.sqrt(variance);
            
            expectedCounts = new Array(numBins).fill(0);
            for (let i = 0; i < numBins; i++) {
              const binMin = min + i * binWidth;
              const binMax = binMin + binWidth;
              
              // 计算正态分布在区间内的概率
              const pMin = 0.5 * (1 + erf((binMin - mean) / (stdDev * Math.sqrt(2))));
              const pMax = 0.5 * (1 + erf((binMax - mean) / (stdDev * Math.sqrt(2))));
              expectedCounts[i] = totalCount * (pMax - pMin);
            }
          }
          
          result = chiSquareGoodnessOfFit(observedCounts, expectedCounts, alpha);
          result.observedCounts = observedCounts;
          result.expectedCounts = expectedCounts;
          break;
        
        case 'normality':
          result = normalityTest(data, alpha, axis);
          break;
      }
      
      setTestResult(result);
    } catch (error) {
      console.error('检验计算错误:', error);
      alert('计算检验结果时出错: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const generateSecondData = () => {
    // 生成第二组随机数据（用于双样本t检验）
    const newData: DataPoint[] = [];
    const sampleSize = Math.min(data.length, 1000);
    
    for (let i = 0; i < sampleSize; i++) {
      const x = Math.random() * 10 - 5;
      const y = Math.random() * 10 - 5;
      newData.push({ x, y });
    }
    
    setSecondData(newData);
  };

  // 误差函数（用于正态分布计算）
  const erf = (x: number): number => {
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

  const renderTestControls = () => {
    switch (testType) {
      case 'one-sample-t':
        return (
          <div className="test-controls">
            <div className="control-group">
              <label>Hypothesized Population Mean (μ0):</label>
              <input
                type="number"
                value={hypothesizedMean}
                onChange={(e) => setHypothesizedMean(parseFloat(e.target.value) || 0)}
                step="0.1"
                className="glass-input"
              />
            </div>
            <div className="control-group">
              <label>检验方向:</label>
              <select
                value={testDirection}
                onChange={(e) => setTestDirection(e.target.value as TestDirection)}
              >
                <option value="two-tailed">Two-tailed Test (μ ≠ μ0)</option>
                <option value="left-tailed">Left-tailed Test (μ &lt; μ0)</option>
                <option value="right-tailed">Right-tailed Test (μ &gt; μ0)</option>
              </select>
            </div>
          </div>
        );
      
      case 'one-sample-z':
        return (
          <div className="test-controls">
            <div className="control-group">
              <label>假设的总体均值 (μ0):</label>
              <input
                type="number"
                value={hypothesizedMean}
                onChange={(e) => setHypothesizedMean(parseFloat(e.target.value) || 0)}
                step="0.1"
                className="number-input"
              />
            </div>
            <div className="control-group">
              <label>Known Population Variance (σ2):</label>
              <input
                type="number"
                value={knownVariance}
                onChange={(e) => setKnownVariance(parseFloat(e.target.value) || 1)}
                step="0.1"
                min="0.01"
                className="glass-input"
              />
            </div>
            <div className="control-group">
              <label>检验方向:</label>
              <select
                value={testDirection}
                onChange={(e) => setTestDirection(e.target.value as TestDirection)}
              >
                <option value="two-tailed">双侧检验 (μ ≠ μ0)</option>
                <option value="left-tailed">左尾检验 (μ &lt; μ0)</option>
                <option value="right-tailed">右尾检验 (μ &gt; μ0)</option>
              </select>
            </div>
          </div>
        );
      
      case 'two-sample-t':
        return (
          <div className="test-controls">
            <div className="control-group">
              <p>第二组数据点数: {secondData.length}</p>
              <button 
                onClick={generateSecondData} 
                className="secondary-button glass-btn"
                disabled={data.length === 0}
              >
                Generate Random Second Dataset
              </button>
            </div>
            <div className="control-group">
              <label>检验方向:</label>
              <select
                value={testDirection}
                onChange={(e) => setTestDirection(e.target.value as TestDirection)}
                className="glass-input"
              >
                <option value="two-tailed">Two-tailed Test (μ1 ≠ μ2)</option>
                <option value="left-tailed">Left-tailed Test (μ1 &lt; μ2)</option>
                <option value="right-tailed">Right-tailed Test (μ1 &gt; μ2)</option>
              </select>
            </div>
          </div>
        );
      
      case 'chi-square':
        return (
          <div className="test-controls">
            <div className="control-group">
              <label>期望分布:</label>
              <select
                value={expectedDistribution}
                onChange={(e) => setExpectedDistribution(e.target.value)}
                className="glass-input"
              >
                <option value="uniform">Uniform Distribution</option>
                <option value="normal">Normal Distribution</option>
              </select>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderTestResult = () => {
    if (!testResult) return null;

    switch (testType) {
      case 'one-sample-t':
        const tResult = testResult as TTestResult;
        return (
          <div className="test-result card glass">
            <h3 className="gradient-text">One-Sample T-Test Results</h3>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">T-Statistic:</span>
                <span className="result-value">{tResult.tStatistic.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Degrees of Freedom:</span>
                <span className="result-value">{tResult.degreesOfFreedom}</span>
              </div>
              <div className="result-item">
                <span className="result-label">P-Value:</span>
                <span className={`result-value ${tResult.pValue < tResult.criticalValue ? 'significant' : 'not-significant'}`}>
                  {tResult.pValue.toFixed(6)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Significance:</span>
                <span className={`result-value ${tResult.pValue < tResult.criticalValue ? 'significant' : 'not-significant'}`}>
                  {tResult.pValue < tResult.criticalValue ? 'Significant' : 'Not Significant'}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">95% Confidence Interval:</span>
                <span className="result-value">
                  [{tResult.confidenceInterval[0].toFixed(4)}, {tResult.confidenceInterval[1].toFixed(4)}]
                </span>
              </div>
            </div>
            <div className="interpretation">
              <p>{tResult.interpretation}</p>
            </div>
          </div>
        );
      
      case 'one-sample-z':
        const zResult = testResult as HypothesisTestResult;
        return (
          <div className="test-result card glass">
            <h3 className="gradient-text">One-Sample Z-Test Results</h3>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Z-Statistic:</span>
                <span className="result-value">{zResult.statistic.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Critical Value:</span>
                <span className="result-value">{zResult.criticalValue.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">P-Value:</span>
                <span className={`result-value ${zResult.pValue < alpha ? 'significant' : 'not-significant'}`}>
                  {zResult.pValue.toFixed(6)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Conclusion:</span>
                <span className={`result-value ${zResult.pValue < alpha ? 'significant' : 'not-significant'}`}>
                  {zResult.conclusion}
                </span>
              </div>
              {zResult.confidenceInterval && (
                <div className="result-item">
                  <span className="result-label">95% Confidence Interval:</span>
                  <span className="result-value">
                    [{zResult.confidenceInterval[0].toFixed(4)}, {zResult.confidenceInterval[1].toFixed(4)}]
                  </span>
                </div>
              )}
            </div>
            <div className="interpretation">
              <p>{zResult.interpretation}</p>
            </div>
          </div>
        );
      
      case 'two-sample-t':
        const twoTResult = testResult as TwoSampleTTestResult;
        return (
          <div className="test-result card glass">
            <h3 className="gradient-text">Independent Samples T-Test Results</h3>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Mean Difference:</span>
                <span className="result-value">{twoTResult.meanDifference.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">T-Statistic:</span>
                <span className="result-value">{twoTResult.tStatistic.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Degrees of Freedom:</span>
                <span className="result-value">{twoTResult.degreesOfFreedom}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Standard Error:</span>
                <span className="result-value">{twoTResult.pooledStdDev.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">P-Value:</span>
                <span className={`result-value ${twoTResult.pValue < twoTResult.criticalValue ? 'significant' : 'not-significant'}`}>
                  {twoTResult.pValue.toFixed(6)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Significance:</span>
                <span className={`result-value ${twoTResult.pValue < twoTResult.criticalValue ? 'significant' : 'not-significant'}`}>
                  {twoTResult.pValue < twoTResult.criticalValue ? 'Significant' : 'Not Significant'}
                </span>
              </div>
            </div>
            <div className="interpretation">
              <p>{twoTResult.interpretation}</p>
            </div>
          </div>
        );
      
      case 'chi-square':
        const chiResult = testResult as ChiSquareTestResult & { observedCounts: number[], expectedCounts: number[] };
        return (
          <div className="test-result card glass">
            <h3 className="gradient-text">Chi-Square Goodness-of-Fit Test Results</h3>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Chi-Square Statistic:</span>
                <span className="result-value">{chiResult.chiSquare.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Degrees of Freedom:</span>
                <span className="result-value">{chiResult.degreesOfFreedom}</span>
              </div>
              <div className="result-item">
                <span className="result-label">P-Value:</span>
                <span className={`result-value ${chiResult.pValue < chiResult.criticalValue ? 'significant' : 'not-significant'}`}>
                  {chiResult.pValue.toFixed(6)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Significance:</span>
                <span className={`result-value ${chiResult.pValue < chiResult.criticalValue ? 'significant' : 'not-significant'}`}>
                  {chiResult.pValue < chiResult.criticalValue ? 'Significant' : 'Not Significant'}
                </span>
              </div>
            </div>
            
            <div className="frequency-table">
              <h4>Observed and Expected Frequencies</h4>
              <table>
                <thead>
                  <tr>
                    <th>Interval</th>
                    <th>Observed Frequency</th>
                    <th>Expected Frequency</th>
                  </tr>
                </thead>
                <tbody>
                  {chiResult.observedCounts.map((observed, index) => (
                    <tr key={index}>
                      <td>Interval {index + 1}</td>
                      <td>{observed.toFixed(2)}</td>
                      <td>{chiResult.expectedCounts[index].toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="interpretation">
              <p>{chiResult.interpretation}</p>
            </div>
          </div>
        );
      
      case 'normality':
        return (
          <div className="test-result card glass">
            <h3 className="gradient-text">Normality Test Results</h3>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">P-Value:</span>
                <span className={`result-value ${testResult.isNormal ? 'not-significant' : 'significant'}`}>
                  {testResult.pValue.toFixed(6)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">Normal Distribution:</span>
                <span className={`result-value ${testResult.isNormal ? 'normal' : 'not-normal'}`}>
                  {testResult.isNormal ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
            <div className="interpretation">
              <p>{testResult.interpretation}</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="hypothesis-testing-tab">
      <h2 className="gradient-text">Hypothesis Testing Analysis</h2>
      
      <div className="test-configuration card glass">
        <h3>Test Configuration</h3>
        <div className="config-grid">
          <div className="config-item">
            <label>Test Type:</label>
            <select 
              value={testType} 
              onChange={(e) => setTestType(e.target.value as TestType)}
              className="glass-input"
            >
              <option value="one-sample-t">One-Sample T-Test (Unknown Variance)</option>
              <option value="one-sample-z">One-Sample Z-Test (Known Variance)</option>
              <option value="two-sample-t">Two-Sample T-Test</option>
              <option value="chi-square">Chi-Square Goodness-of-Fit Test</option>
              <option value="normality">Normality Test</option>
            </select>
          </div>

          <div className="config-item">
            <label>Data Axis:</label>
            <select 
              value={axis} 
              onChange={(e) => setAxis(e.target.value as 'x' | 'y')}
              className="glass-input"
            >
              <option value="x">X-axis Data</option>
              <option value="y">Y-axis Data</option>
            </select>
          </div>

          <div className="config-item">
            <label>Significance Level (alpha):</label>
            <select 
              value={alpha} 
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="glass-input"
            >
              <option value={0.01}>0.01 (1%)</option>
              <option value={0.05}>0.05 (5%)</option>
              <option value={0.10}>0.10 (10%)</option>
            </select>
          </div>
        </div>

        {renderTestControls()}

        <button 
          className="primary-button glass-btn"
          onClick={handleRunTest}
          disabled={data.length === 0}
        >
          Run Test
        </button>
      </div>

      {renderTestResult()}

      {data.length === 0 && (
        <div className="no-data-message card glass">
          <p>Please input data first to perform hypothesis testing analysis</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedHypothesisTestingTab;
