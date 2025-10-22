import React, { useMemo } from 'react';
import { DataPoint } from '../DataAnalysisApp';
import './StatisticalAnalysisTab.css';

interface StatisticalAnalysisTabProps {
  data: DataPoint[];
}

interface StatisticalResults {
  count: number;
  xMean: number;
  yMean: number;
  xMedian: number;
  yMedian: number;
  xStdDev: number;
  yStdDev: number;
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  correlation: number;
}

const StatisticalAnalysisTab: React.FC<StatisticalAnalysisTabProps> = ({ data }) => {
  const stats = useMemo(() => calculateStatistics(data), [data]);

  return (
    <div className="statistical-analysis-tab">
      <h2>基本统计分析</h2>
      
      <div className="stats-grid">
        <div className="stats-card">
          <h3>基本信息</h3>
          <div className="stat-item">
            <span className="stat-label">数据点数:</span>
            <span className="stat-value">{stats.count}</span>
          </div>
        </div>

        <div className="stats-card">
          <h3>X 变量统计</h3>
          <div className="stat-item">
            <span className="stat-label">均值:</span>
            <span className="stat-value">{stats.xMean.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">中位数:</span>
            <span className="stat-value">{stats.xMedian.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">标准差:</span>
            <span className="stat-value">{stats.xStdDev.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">最小值:</span>
            <span className="stat-value">{stats.xMin.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">最大值:</span>
            <span className="stat-value">{stats.xMax.toFixed(4)}</span>
          </div>
        </div>

        <div className="stats-card">
          <h3>Y 变量统计</h3>
          <div className="stat-item">
            <span className="stat-label">均值:</span>
            <span className="stat-value">{stats.yMean.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">中位数:</span>
            <span className="stat-value">{stats.yMedian.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">标准差:</span>
            <span className="stat-value">{stats.yStdDev.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">最小值:</span>
            <span className="stat-value">{stats.yMin.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">最大值:</span>
            <span className="stat-value">{stats.yMax.toFixed(4)}</span>
          </div>
        </div>

        <div className="stats-card">
          <h3>相关性分析</h3>
          <div className="stat-item">
            <span className="stat-label">相关系数:</span>
            <span className="stat-value" style={{ color: getCorrelationColor(stats.correlation) }}>
              {stats.correlation.toFixed(4)}
            </span>
          </div>
          <div className="correlation-interpretation">
            {getCorrelationInterpretation(stats.correlation)}
          </div>
        </div>
      </div>
    </div>
  );
};

// 计算统计指标
function calculateStatistics(data: DataPoint[]): StatisticalResults {
  if (data.length === 0) {
    return {
      count: 0,
      xMean: 0,
      yMean: 0,
      xMedian: 0,
      yMedian: 0,
      xStdDev: 0,
      yStdDev: 0,
      xMin: 0,
      yMin: 0,
      xMax: 0,
      yMax: 0,
      correlation: 0,
    };
  }

  const count = data.length;
  const xValues = data.map(d => d.x).sort((a, b) => a - b);
  const yValues = data.map(d => d.y).sort((a, b) => a - b);

  // 计算均值
  const xMean = xValues.reduce((sum, val) => sum + val, 0) / count;
  const yMean = yValues.reduce((sum, val) => sum + val, 0) / count;

  // 计算中位数
  const xMedian = count % 2 === 0 
    ? (xValues[count / 2 - 1] + xValues[count / 2]) / 2
    : xValues[Math.floor(count / 2)];
  const yMedian = count % 2 === 0 
    ? (yValues[count / 2 - 1] + yValues[count / 2]) / 2
    : yValues[Math.floor(count / 2)];

  // 计算标准差
  const xStdDev = Math.sqrt(
    xValues.reduce((sum, val) => sum + Math.pow(val - xMean, 2), 0) / count
  );
  const yStdDev = Math.sqrt(
    yValues.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0) / count
  );

  // 计算最小值和最大值
  const xMin = xValues[0];
  const yMin = yValues[0];
  const xMax = xValues[count - 1];
  const yMax = yValues[count - 1];

  // 计算相关系数
  let correlation = 0;
  if (count > 1 && xStdDev > 0 && yStdDev > 0) {
    let covariance = 0;
    for (let i = 0; i < count; i++) {
      covariance += (data[i].x - xMean) * (data[i].y - yMean);
    }
    correlation = covariance / (count * xStdDev * yStdDev);
  }

  return {
    count,
    xMean,
    yMean,
    xMedian,
    yMedian,
    xStdDev,
    yStdDev,
    xMin,
    yMin,
    xMax,
    yMax,
    correlation,
  };
}

// 根据相关系数获取颜色
function getCorrelationColor(correlation: number): string {
  const absCorr = Math.abs(correlation);
  if (absCorr < 0.1) return '#888888'; // 无相关
  if (absCorr < 0.3) return '#2196F3'; // 弱相关
  if (absCorr < 0.7) return '#FF9800'; // 中等相关
  return correlation > 0 ? '#4CAF50' : '#F44336'; // 强相关（正或负）
}

// 获取相关系数的解释
function getCorrelationInterpretation(correlation: number): string {
  const absCorr = Math.abs(correlation);
  if (absCorr < 0.1) return '无相关';
  if (absCorr < 0.3) return `弱${correlation > 0 ? '正' : '负'}相关`;
  if (absCorr < 0.7) return `中等${correlation > 0 ? '正' : '负'}相关`;
  return `强${correlation > 0 ? '正' : '负'}相关`;
}

export default StatisticalAnalysisTab;