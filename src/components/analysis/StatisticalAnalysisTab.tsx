import React, { useMemo } from 'react';
import { DataPoint } from '../DataAnalysisApp';
import './StatisticalAnalysisTab.css';
import '../modernStyles.css';

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
      <h2 className="gradient-text">Statistical Analysis</h2>
      
      <div className="stats-grid">
        <div className="stats-card card">
          <h3 className="gradient-text">Basic Information</h3>
          <div className="stat-item">
            <span className="stat-label">Data Points:</span>
            <span className="stat-value">{stats.count}</span>
          </div>
        </div>

        <div className="stats-card card">
          <h3 className="gradient-text">X Variable Statistics</h3>
          <div className="stat-item">
            <span className="stat-label">Mean:</span>
            <span className="stat-value">{stats.xMean.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Median:</span>
            <span className="stat-value">{stats.xMedian.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Standard Deviation:</span>
            <span className="stat-value">{stats.xStdDev.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Minimum:</span>
            <span className="stat-value">{stats.xMin.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Maximum:</span>
            <span className="stat-value">{stats.xMax.toFixed(4)}</span>
          </div>
        </div>

        <div className="stats-card card">
          <h3 className="gradient-text">Y Variable Statistics</h3>
          <div className="stat-item">
            <span className="stat-label">Mean:</span>
            <span className="stat-value">{stats.yMean.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Median:</span>
            <span className="stat-value">{stats.yMedian.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Standard Deviation:</span>
            <span className="stat-value">{stats.yStdDev.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Minimum:</span>
            <span className="stat-value">{stats.yMin.toFixed(4)}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Maximum:</span>
            <span className="stat-value">{stats.yMax.toFixed(4)}</span>
          </div>
        </div>

        <div className="stats-card card">
          <h3 className="gradient-text">Correlation Analysis</h3>
          <div className="stat-item">
            <span className="stat-label">Correlation Coefficient:</span>
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

// Calculate statistical metrics
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

  // Calculate mean
  const xMean = xValues.reduce((sum, val) => sum + val, 0) / count;
  const yMean = yValues.reduce((sum, val) => sum + val, 0) / count;

  // Calculate median
  const xMedian = count % 2 === 0 
    ? (xValues[count / 2 - 1] + xValues[count / 2]) / 2
    : xValues[Math.floor(count / 2)];
  const yMedian = count % 2 === 0 
    ? (yValues[count / 2 - 1] + yValues[count / 2]) / 2
    : yValues[Math.floor(count / 2)];

  // Calculate standard deviation
  const xStdDev = Math.sqrt(
    xValues.reduce((sum, val) => sum + Math.pow(val - xMean, 2), 0) / count
  );
  const yStdDev = Math.sqrt(
    yValues.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0) / count
  );

  // Calculate min and max
  const xMin = xValues[0];
  const yMin = yValues[0];
  const xMax = xValues[count - 1];
  const yMax = yValues[count - 1];

  // Calculate correlation coefficient
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

// Get color based on correlation coefficient
function getCorrelationColor(correlation: number): string {
  const absCorr = Math.abs(correlation);
  if (absCorr < 0.1) return '#888888'; // No correlation
  if (absCorr < 0.3) return '#2196F3'; // Weak correlation
  if (absCorr < 0.7) return '#FF9800'; // Moderate correlation
  return correlation > 0 ? '#4CAF50' : '#F44336'; // Strong correlation (positive or negative)
}

// Get correlation interpretation
function getCorrelationInterpretation(correlation: number): string {
  const absCorr = Math.abs(correlation);
  if (absCorr < 0.1) return 'No correlation';
  if (absCorr < 0.3) return `Weak ${correlation > 0 ? 'positive' : 'negative'} correlation`;
  if (absCorr < 0.7) return `Moderate ${correlation > 0 ? 'positive' : 'negative'} correlation`;
  return `Strong ${correlation > 0 ? 'positive' : 'negative'} correlation`;
}

export default StatisticalAnalysisTab;