import React, { useState } from 'react';
import { DataPoint } from '../DataAnalysisApp';
import * as hypothesisTestingUtils from '../../utils/hypothesisTestingUtils';

// 添加计算均值和标准差的辅助函数
const calculateMean = (values: number[]): number => {
  return values.reduce((sum, val) => sum + val, 0) / values.length;
};

const calculateStdDev = (values: number[]): number => {
  const mean = calculateMean(values);
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / (values.length - 1);
  return Math.sqrt(variance);
};
import './HypothesisTestingTab.css';

type TestType = 'z-test' | 't-test' | 'independent-t-test' | 'chi-square' | 'normality';
type AlternativeHypothesis = 'less' | 'greater' | 'two-sided';

interface HypothesisTestingTabProps {
  data: DataPoint[];
  secondaryData?: DataPoint[];
}

const HypothesisTestingTab: React.FC<HypothesisTestingTabProps> = ({ data, secondaryData }) => {
  const [testType, setTestType] = useState<TestType>('t-test');
  const [nullHypothesisMean, setNullHypothesisMean] = useState<string>('0');
  const [alternativeHypothesis, setAlternativeHypothesis] = useState<AlternativeHypothesis>('two-sided');
  const [alpha, setAlpha] = useState<number>(0.05);
  const [expectedDistribution, setExpectedDistribution] = useState<string>('normal');
  const [populationStdDev, setPopulationStdDev] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 从数据中提取y值进行计算
  const yValues = data.map(point => point.y);
  const secondaryYValues = secondaryData?.map(point => point.y) || [];

  const handleRunTest = () => {
    if (yValues.length === 0) {
      setErrorMessage('请先输入数据');
      return;
    }
    
    try {
      let result: any = {};
      const processedYValues = yValues.map(val => Number(val));
      
      switch (testType) {
        case 'z-test':
          const zMean = parseFloat(nullHypothesisMean);
          const stdDev = parseFloat(populationStdDev);
          if (isNaN(zMean)) {
            throw new Error('请输入有效的均值');
          }
          if (isNaN(stdDev) || stdDev <= 0) {
            throw new Error('请输入有效的总体标准差');
          }
          result = hypothesisTestingUtils.oneSampleZTest(data, zMean, stdDev, alpha, alternativeHypothesis);
          break;
        case 't-test':
          const tMean = parseFloat(nullHypothesisMean);
          if (isNaN(tMean)) {
            throw new Error('请输入有效的均值');
          }
          result = hypothesisTestingUtils.oneSampleTTest(data, tMean, alpha);
          break;
        case 'independent-t-test':
          if (!secondaryData || secondaryData.length === 0) {
            throw new Error('独立样本t检验需要两组数据');
          }
          result = hypothesisTestingUtils.twoSampleTTest(data, secondaryData, alpha);
          break;
        case 'chi-square':
          const expectedCountsArray: number[] = Array.isArray(expectedDistribution) && expectedDistribution.length > 0 ? 
            expectedDistribution.map(val => Number(val)) : 
            Array(processedYValues.length).fill(processedYValues.reduce((a, b) => a + b, 0) / processedYValues.length);
          result = hypothesisTestingUtils.chiSquareGoodnessOfFit(processedYValues, expectedCountsArray, alpha);
          break;
        case 'normality':
          result = hypothesisTestingUtils.normalityTest(data, alpha);
          break;
        default:
          throw new Error('不支持的检验类型');
      }
      
      setTestResult(result);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  const generateInterpretation = (result: any): string => {
    if (!result) return '';
    
    switch (testType) {
      case 'z-test':
        if (result.pValue < alpha) {
          const mean = parseFloat(nullHypothesisMean);
          if (alternativeHypothesis === 'two-sided') {
            return `根据显著性水平α=${alpha}，我们拒绝原假设。数据提供了足够的证据表明总体均值不等于${mean}。`;
          } else if (alternativeHypothesis === 'less') {
            return `根据显著性水平α=${alpha}，我们拒绝原假设。数据提供了足够的证据表明总体均值小于${mean}。`;
          } else {
            return `根据显著性水平α=${alpha}，我们拒绝原假设。数据提供了足够的证据表明总体均值大于${mean}。`;
          }
        } else {
          const mean = parseFloat(nullHypothesisMean);
          if (alternativeHypothesis === 'two-sided') {
            return `根据显著性水平α=${alpha}，我们没有足够的证据拒绝原假设。数据不支持总体均值不等于${mean}的结论。`;
          } else if (alternativeHypothesis === 'less') {
            return `根据显著性水平α=${alpha}，我们没有足够的证据拒绝原假设。数据不支持总体均值小于${mean}的结论。`;
          } else {
            return `根据显著性水平α=${alpha}，我们没有足够的证据拒绝原假设。数据不支持总体均值大于${mean}的结论。`;
          }
        }
      case 't-test':
        if (result.pValue < alpha) {
          const mean = parseFloat(nullHypothesisMean);
          if (alternativeHypothesis === 'two-sided') {
            return `根据显著性水平α=${alpha}，我们拒绝原假设。数据提供了足够的证据表明总体均值不等于${mean}。`;
          } else if (alternativeHypothesis === 'less') {
            return `根据显著性水平α=${alpha}，我们拒绝原假设。数据提供了足够的证据表明总体均值小于${mean}。`;
          } else {
            return `根据显著性水平α=${alpha}，我们拒绝原假设。数据提供了足够的证据表明总体均值大于${mean}。`;
          }
        } else {
          const mean = parseFloat(nullHypothesisMean);
          if (alternativeHypothesis === 'two-sided') {
            return `根据显著性水平α=${alpha}，我们没有足够的证据拒绝原假设。数据不支持总体均值不等于${mean}的结论。`;
          } else if (alternativeHypothesis === 'less') {
            return `根据显著性水平α=${alpha}，我们没有足够的证据拒绝原假设。数据不支持总体均值小于${mean}的结论。`;
          } else {
            return `根据显著性水平α=${alpha}，我们没有足够的证据拒绝原假设。数据不支持总体均值大于${mean}的结论。`;
          }
        }
      case 'independent-t-test':
        if (result.pValue < alpha) {
          return `根据显著性水平α=${alpha}，我们拒绝原假设。两组数据的均值存在显著差异。`;
        } else {
          return `根据显著性水平α=${alpha}，我们没有足够的证据拒绝原假设。两组数据的均值差异不显著。`;
        }
      case 'chi-square':
        if (result.pValue < alpha) {
          return `根据显著性水平α=${alpha}，我们拒绝原假设。数据不符合${expectedDistribution}分布。`;
        } else {
          return `根据显著性水平α=${alpha}，我们没有足够的证据拒绝原假设。数据符合${expectedDistribution}分布。`;
        }
      case 'normality':
        if (result.pValue < alpha) {
          return `根据显著性水平α=${alpha}，我们拒绝原假设。数据不是正态分布的。`;
        } else {
          return `根据显著性水平α=${alpha}，我们没有足够的证据拒绝原假设。数据可以被视为正态分布。`;
        }
      default:
        return '';
    }
  };

  const renderTestResults = () => {
    if (!testResult) return null;

    return (
      <div className="test-results">
        <h3>检验结果</h3>
        
        {testType === 'z-test' && (
          <div className="result-card">
            <h4>单样本Z检验结果（方差已知）</h4>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">Z统计量:</span>
                <span className="result-value">{testResult.zStatistic.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">p值:</span>
                <span className={`result-value ${testResult.pValue < alpha ? 'significant' : 'not-significant'}`}>
                  {testResult.pValue.toFixed(6)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">样本均值:</span>
                <span className="result-value">{calculateMean(yValues).toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">总体标准差:</span>
                <span className="result-value">{parseFloat(populationStdDev).toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}

        {testType === 't-test' && (
          <div className="result-card">
            <h4>单样本t检验结果（方差未知）</h4>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">t统计量:</span>
                <span className="result-value">{testResult.tStatistic.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">自由度:</span>
                <span className="result-value">{testResult.degreesOfFreedom}</span>
              </div>
              <div className="result-item">
                <span className="result-label">p值:</span>
                <span className={`result-value ${testResult.pValue < alpha ? 'significant' : 'not-significant'}`}>
                  {testResult.pValue.toFixed(6)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">样本均值:</span>
                <span className="result-value">{testResult.sampleMean.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">样本标准差:</span>
                <span className="result-value">{calculateStdDev(yValues).toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}

        {testType === 'independent-t-test' && (
          <div className="result-card">
            <h4>独立样本t检验结果</h4>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">t统计量:</span>
                <span className="result-value">{testResult.tStatistic.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">自由度:</span>
                <span className="result-value">{testResult.degreesOfFreedom}</span>
              </div>
              <div className="result-item">
                <span className="result-label">p值:</span>
                <span className={`result-value ${testResult.pValue < alpha ? 'significant' : 'not-significant'}`}>
                  {testResult.pValue.toFixed(6)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">均值差:</span>
                <span className="result-value">{testResult.meanDifference.toFixed(4)}</span>
              </div>
            </div>
          </div>
        )}

        {testType === 'chi-square' && (
          <div className="result-card">
            <h4>卡方拟合优度检验结果</h4>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">卡方统计量:</span>
                <span className="result-value">{testResult.chiSquareStat.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">自由度:</span>
                <span className="result-value">{testResult.degreesOfFreedom}</span>
              </div>
              <div className="result-item">
                <span className="result-label">p值:</span>
                <span className={`result-value ${testResult.pValue < alpha ? 'significant' : 'not-significant'}`}>
                  {testResult.pValue.toFixed(6)}
                </span>
              </div>
            </div>
            
            {testResult.frequencyTable && (
              <div className="frequency-table">
                <h4>观测与期望频率</h4>
                <table>
                  <thead>
                    <tr>
                      <th>区间</th>
                      <th>观测频率</th>
                      <th>期望频率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResult.frequencyTable.map((row: any, index: number) => (
                      <tr key={index}>
                        <td>{row.interval}</td>
                        <td>{row.observed}</td>
                        <td>{row.expected}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {testType === 'normality' && (
          <div className="result-card">
            <h4>正态性检验结果</h4>
            <div className="result-grid">
              <div className="result-item">
                <span className="result-label">W统计量:</span>
                <span className="result-value">{testResult.wStatistic.toFixed(4)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">p值:</span>
                <span className={`result-value ${testResult.pValue < alpha ? 'not-normal' : 'normal'}`}>
                  {testResult.pValue.toFixed(6)}
                </span>
              </div>
              <div className="result-item">
                <span className="result-label">结论:</span>
                <span className={`result-value ${testResult.pValue < alpha ? 'not-normal' : 'normal'}`}>
                  {testResult.pValue < alpha ? '非正态' : '正态'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="interpretation">
          <p>{generateInterpretation(testResult)}</p>
        </div>
      </div>
    );
  };

  const renderTestConfiguration = () => {
    return (
      <div className="test-configuration">
        <h3>检验配置</h3>
        
        <div className="config-grid">
          <div className="config-item">
            <label htmlFor="test-type">检验类型:</label>
            <select
              id="test-type"
              value={testType}
              onChange={(e) => setTestType(e.target.value as TestType)}
            >
              <option value="z-test">单样本Z检验（方差已知）</option>
              <option value="t-test">单样本t检验（方差未知）</option>
              <option value="independent-t-test">独立样本t检验</option>
              <option value="chi-square">卡方拟合优度检验</option>
              <option value="normality">正态性检验</option>
            </select>
          </div>

          {(testType === 'z-test' || testType === 't-test') && (
            <>
              <div className="config-item">
                <label htmlFor="null-hypothesis-mean">原假设均值:</label>
                <input
                  id="null-hypothesis-mean"
                  type="number"
                  value={nullHypothesisMean}
                  onChange={(e) => setNullHypothesisMean(e.target.value)}
                  placeholder="输入均值"
                />
              </div>
              <div className="config-item">
                <label htmlFor="alternative-hypothesis">备择假设:</label>
                <select
                  id="alternative-hypothesis"
                  value={alternativeHypothesis}
                  onChange={(e) => setAlternativeHypothesis(e.target.value as AlternativeHypothesis)}
                >
                  <option value="less">小于</option>
                  <option value="greater">大于</option>
                  <option value="two-sided">不等于</option>
                </select>
              </div>
              {testType === 'z-test' && (
                <div className="config-item">
                  <label htmlFor="population-std-dev">总体标准差（已知）:</label>
                  <input
                    id="population-std-dev"
                    type="number"
                    value={populationStdDev}
                    onChange={(e) => setPopulationStdDev(e.target.value)}
                    placeholder="输入总体标准差"
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
            </>
          )}

          {testType === 'independent-t-test' && (
            <div className="config-item">
              <label htmlFor="alternative-hypothesis-ttest">备择假设:</label>
              <select
                id="alternative-hypothesis-ttest"
                value={alternativeHypothesis}
                onChange={(e) => setAlternativeHypothesis(e.target.value as AlternativeHypothesis)}
              >
                <option value="less">小于</option>
                <option value="greater">大于</option>
                <option value="two-sided">不等于</option>
              </select>
            </div>
          )}

          {testType === 'chi-square' && (
            <div className="config-item">
              <label htmlFor="expected-distribution">期望分布:</label>
              <select
                id="expected-distribution"
                value={expectedDistribution}
                onChange={(e) => setExpectedDistribution(e.target.value)}
              >
                <option value="normal">正态分布</option>
                <option value="uniform">均匀分布</option>
                <option value="poisson">泊松分布</option>
              </select>
            </div>
          )}

          <div className="config-item">
            <label htmlFor="alpha">显著性水平 (α):</label>
            <input
              id="alpha"
              type="number"
              min="0.01"
              max="0.1"
              step="0.01"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
            />
          </div>
        </div>

        {testType === 'independent-t-test' && secondaryYValues.length === 0 && (
          <div className="warning-message">
            <p>⚠️ 请先在数据输入选项卡中上传或生成第二组数据</p>
          </div>
        )}
        {testType === 'z-test' && (!populationStdDev || parseFloat(populationStdDev) <= 0) && (
          <div className="warning-message">
            <p>⚠️ 请输入有效的总体标准差</p>
          </div>
        )}

        <button
          className="run-test-button"
          onClick={handleRunTest}
          disabled={
            yValues.length === 0 || 
            (testType === 'independent-t-test' && secondaryYValues.length === 0) ||
            (testType === 'z-test' && (!populationStdDev || parseFloat(populationStdDev) <= 0))
          }
        >
          执行检验
        </button>

        {errorMessage && (
          <div className="error-message">
            <p>错误: {errorMessage}</p>
          </div>
        )}

        {testType === 'independent-t-test' && secondaryYValues.length > 0 && (
          <div className="test-info">
            <p>第一组数据点数: {yValues.length}</p>
            <p>第二组数据点数: {secondaryYValues.length}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="hypothesis-testing-tab">
      <h2>假设检验</h2>
      
      {yValues.length === 0 ? (
        <div className="no-data-message">
          <p>请先在数据输入选项卡中上传或生成数据</p>
        </div>
      ) : (
        <>
          {renderTestConfiguration()}
          {renderTestResults()}
        </>
      )}
    </div>
  );
};

export default HypothesisTestingTab;
