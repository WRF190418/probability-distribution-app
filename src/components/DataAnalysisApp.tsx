import React, { useState } from 'react';
import Tabs from './common/Tabs';
import DataInputTab from './data-input/DataInputTab';
import StatisticalAnalysisTab from './analysis/StatisticalAnalysisTab';
import MLEMOMAnalysisTab from './analysis/MLEMOMAnalysisTab';
import EnhancedHypothesisTestingTab from './analysis/EnhancedHypothesisTestingTab';
import DataVisualization from './visualization/DataVisualization';
import './DataAnalysisApp.css';

export interface DataPoint {
  x: number;
  y: number;
}

const DataAnalysisApp: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [secondaryData, setSecondaryData] = useState<DataPoint[]>([]);
  const [activeTab, setActiveTab] = useState<string>('input');

  const handleDataChange = (newData: DataPoint[]) => {
    setData(newData);
  };

  const handleSecondaryDataChange = (newData: DataPoint[]) => {
    setSecondaryData(newData);
  };

  return (
    <div className="data-analysis-app">
      <header className="app-header">
        <h1>数据分析平台</h1>
        <p>全面的数据输入与统计分析工具</p>
      </header>

      <Tabs 
        tabs={[
          { id: 'input', label: '数据输入' },
          { id: 'stats', label: '基本统计', disabled: data.length === 0 },
          { id: 'mlemom', label: 'MLE/MoM分析', disabled: data.length === 0 },
          { id: 'hypothesis', label: '假设检验', disabled: data.length === 0 },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="app-content">
        {activeTab === 'input' && (
          <DataInputTab onDataChange={handleDataChange} onSecondaryDataChange={handleSecondaryDataChange} />
        )}
        
        {activeTab === 'stats' && (
          <StatisticalAnalysisTab data={data} />
        )}
        
        {activeTab === 'mlemom' && (
          <MLEMOMAnalysisTab data={data} />
        )}
        
        {activeTab === 'hypothesis' && (
          <EnhancedHypothesisTestingTab data={data} secondaryData={secondaryData} />
        )}
      </div>

      {data.length > 0 && (
        <div className="visualization-section">
          <h2>数据可视化</h2>
          <DataVisualization data={data} />
        </div>
      )}

      <footer className="app-footer">
        <p>数据分析平台 - 强大的数据输入与分析工具</p>
      </footer>
    </div>
  );
};

export default DataAnalysisApp;