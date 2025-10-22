import React, { useState } from 'react';
import { DataPoint } from '../DataAnalysisApp';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ScatterChart, BarChart, Bar } from 'recharts';
import './DataVisualization.css';

type ChartType = 'scatter' | 'line' | 'bar';

interface DataVisualizationProps {
  data: DataPoint[];
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ data = [] }) => {
  const [chartType, setChartType] = useState<ChartType>('scatter');
  const [showRegression, setShowRegression] = useState<boolean>(false);
  
  // 确保data始终是有效的数组
  const safeData = Array.isArray(data) ? data : [];

  // 计算线性回归
  const getRegressionData = () => {
    try {
      if (!safeData || safeData.length < 2) return null;

      const n = safeData.length;
      // 过滤掉无效的数据点
      const validPoints = safeData.filter(point => 
        point && typeof point.x === 'number' && typeof point.y === 'number'
      );
      
      if (validPoints.length < 2) return null;

      const sumX = validPoints.reduce((sum, point) => sum + point.x, 0);
      const sumY = validPoints.reduce((sum, point) => sum + point.y, 0);
      const sumXY = validPoints.reduce((sum, point) => sum + point.x * point.y, 0);
      const sumX2 = validPoints.reduce((sum, point) => sum + point.x * point.x, 0);

      // 避免除零错误
      const denominator = n * sumX2 - sumX * sumX;
      if (denominator === 0) return null;

      const slope = (n * sumXY - sumX * sumY) / denominator;
      const intercept = (sumY - slope * sumX) / n;

      // 找出X的范围来绘制回归线
      const minX = Math.min(...validPoints.map(p => p.x));
      const maxX = Math.max(...validPoints.map(p => p.x));
      
      return {
        slope,
        intercept,
        lineData: [
          { x: minX, y: slope * minX + intercept },
          { x: maxX, y: slope * maxX + intercept }
        ],
        equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`
      };
    } catch (error) {
      console.error('计算回归线时出错:', error);
      return null;
    }
  };

  const regression = showRegression ? getRegressionData() : null;

  // 为柱状图准备数据 - 将数据分箱
  const prepareBarData = () => {
    try {
      if (!safeData || safeData.length === 0) return [];
      
      // 过滤出有效的x值
      const validPoints = safeData.filter(point => 
        point && typeof point.x === 'number'
      );
      
      if (validPoints.length === 0) return [];
      
      const xValues = validPoints.map(p => p.x);
      const minX = Math.min(...xValues);
      const maxX = Math.max(...xValues);
      
      // 处理minX等于maxX的情况
      if (minX === maxX) {
        return [{
          bin: minX,
          count: validPoints.length,
          label: `${minX.toFixed(2)}`
        }];
      }
      
      const binCount = Math.min(20, Math.ceil(Math.sqrt(validPoints.length))); // 使用Sturges'公式或最多20个箱子
      const binWidth = (maxX - minX) / binCount;
      
      // 创建箱子
      const bins = Array(binCount).fill(0).map((_, i) => ({
        bin: minX + i * binWidth,
        count: 0,
        label: `${(minX + i * binWidth).toFixed(2)}-${(minX + (i + 1) * binWidth).toFixed(2)}`
      }));
      
      // 计算每个箱子中的数据点数
      validPoints.forEach(point => {
        if (point && typeof point.x === 'number') {
          const binIndex = Math.min(
            binCount - 1, 
            Math.floor((point.x - minX) / binWidth)
          );
          if (bins[binIndex]) {
            bins[binIndex].count++;
          }
        }
      });
      
      return bins;
    } catch (error) {
      console.error('准备柱状图数据时出错:', error);
      return [];
    }
  };

  const barData = chartType === 'bar' ? prepareBarData() : [];

  return (
    <div className="data-visualization">
      <div className="visualization-controls">
        <div className="chart-type-selector">
          <label>图表类型:</label>
          <div className="chart-type-buttons">
            <button
              className={`chart-type-btn ${chartType === 'scatter' ? 'active' : ''}`}
              onClick={() => setChartType('scatter')}
            >
              散点图
            </button>
            <button
              className={`chart-type-btn ${chartType === 'line' ? 'active' : ''}`}
              onClick={() => setChartType('line')}
            >
              折线图
            </button>
            <button
              className={`chart-type-btn ${chartType === 'bar' ? 'active' : ''}`}
              onClick={() => setChartType('bar')}
            >
              柱状图
            </button>
          </div>
        </div>
        
        {(chartType === 'scatter' || chartType === 'line') && (
          <div className="regression-toggle">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showRegression}
                onChange={() => setShowRegression(!showRegression)}
              />
              <span className="checkbox-text">显示回归线</span>
            </label>
          </div>
        )}
      </div>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          {/* 使用函数组件替代条件渲染，确保总是返回一个有效的图表组件 */}
          {(() => {
            if (chartType === 'scatter') {
              return (
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="X" 
                    label={{ value: 'X值', position: 'insideBottomRight', offset: -10 }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Y" 
                    label={{ value: 'Y值', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value) => {
                      try {
                        return typeof value === 'number' && value?.toFixed ? value.toFixed(4) : '0.0000';
                      } catch {
                        return '0.0000';
                      }
                    }}
                    labelFormatter={(value) => {
                      try {
                        return `X: ${typeof value === 'number' ? value.toFixed(4) : (parseFloat(String(value)) || 0).toFixed(4)}`;
                      } catch {
                        return `X: 0.0000`;
                      }
                    }}
                    content={({ active, payload, label }) => {
                      // 确保payload存在且有效
                      if (active && payload && payload.length && payload[0]) {
                        return (
                          <div className="custom-tooltip">
                            <p className="label">X: {label}</p>
                            <p className="value">Y: {payload[0].value ?? '0.0000'}</p>
                          </div>
                        );
                      }
                      return <div className="custom-tooltip">无数据</div>;
                    }}
                  />
                  <Legend />
                  <Scatter 
                    name="数据点" 
                    data={safeData} 
                    fill="#4a90e2" 
                    shape={(props: any) => {
                      // 完全重写shape函数，确保安全渲染
                      if (!props || typeof props !== 'object' || props.cx === undefined || props.cy === undefined) {
                        return React.createElement('circle', { cx: 0, cy: 0, r: 0 });
                      }
                      return (
                        <circle 
                          cx={props.cx} 
                          cy={props.cy} 
                          r={4} 
                          fill="#4a90e2" 
                          fillOpacity={0.6} 
                          stroke="#333" 
                          strokeWidth={1} 
                        />
                      );
                    }}
                  />
                  {regression && regression.lineData && Array.isArray(regression.lineData) && regression.lineData.length > 0 && (
                    <Line 
                      type="monotone" 
                      data={regression.lineData} 
                      dataKey="y" 
                      stroke="#f44336" 
                      strokeWidth={2} 
                      name={`回归线: ${regression.equation || 'N/A'}`}
                      dot={false}
                      strokeDasharray="5 5"
                    />
                  )}
                </ScatterChart>
              );
            } else if (chartType === 'line') {
              return (
                <LineChart 
                  data={safeData} 
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="X" 
                    label={{ value: 'X值', position: 'insideBottomRight', offset: -10 }} 
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Y" 
                    label={{ value: 'Y值', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip 
                    formatter={(value) => {
                      try {
                        return typeof value === 'number' && value?.toFixed ? value.toFixed(4) : '0.0000';
                      } catch {
                        return '0.0000';
                      }
                    }}
                    labelFormatter={(value) => {
                      try {
                        return `X: ${typeof value === 'number' ? value.toFixed(4) : (parseFloat(String(value)) || 0).toFixed(4)}`;
                      } catch {
                        return `X: 0.0000`;
                      }
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="y" 
                    stroke="#4a90e2" 
                    strokeWidth={2} 
                    name="Y值"
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                  {regression && Array.isArray(regression.lineData) && regression.lineData.length > 0 && (
                    <Line 
                      type="monotone" 
                      data={regression.lineData} 
                      dataKey="y" 
                      stroke="#f44336" 
                      strokeWidth={2} 
                      name={`回归线: ${regression.equation || 'N/A'}`}
                      dot={false}
                      strokeDasharray="5 5"
                    />
                  )}
                </LineChart>
              );
            } else if (chartType === 'bar') {
              const safeBarData = Array.isArray(barData) ? barData : [];
              return (
                <BarChart 
                  data={safeBarData} 
                  margin={{ top: 20, right: 20, bottom: 50, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="label" 
                    name="X范围" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    label={{ value: 'X范围', position: 'insideBottom', offset: -10 }} 
                  />
                  <YAxis 
                    type="number" 
                    name="频次" 
                    label={{ value: '频次', angle: -90, position: 'insideLeft' }} 
                  />
                  <Tooltip 
                    formatter={(value) => [`频次: ${typeof value === 'number' ? value : 0}`, '']}
                    labelFormatter={(value) => `范围: ${value || 'N/A'}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    fill="#4a90e2" 
                    name="频次"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              );
            }
            // 确保始终返回一个有效的图表组件作为默认值
            return (
              <LineChart 
                data={[]} 
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
              </LineChart>
            );
          })()}
        </ResponsiveContainer>
      </div>

      {regression && regression.equation && (
        <div className="regression-info">
          <p>回归方程: {regression.equation}</p>
        </div>
      )}
    </div>
  );
};

export default DataVisualization;