import React, { useState } from 'react';
import { DataPoint } from '../DataAnalysisApp';
import FileImporter from '../common/FileImporter';
import DistributionGenerator from './DistributionGenerator';
import AIDataGenerator from './AIDataGenerator';
import './DataInputTab.css';

interface DataInputTabProps {
  onDataChange: (data: DataPoint[]) => void;
  onSecondaryDataChange?: (data: DataPoint[]) => void;
}

const DataInputTab: React.FC<DataInputTabProps> = ({ onDataChange, onSecondaryDataChange }) => {
  const [inputMethod, setInputMethod] = useState<string>('file');
  const [isSecondaryData, setIsSecondaryData] = useState<boolean>(false);

  const handleFileImport = (data: {x: number, y: number}[]) => {
    if (isSecondaryData && onSecondaryDataChange) {
      onSecondaryDataChange(data);
    } else {
      onDataChange(data);
    }
  };

  const handleDistributionData = (data: DataPoint[]) => {
    if (isSecondaryData && onSecondaryDataChange) {
      onSecondaryDataChange(data);
    } else {
      onDataChange(data);
    }
  };

  const handleAIData = (data: number[]) => {
    // 将AI生成的简单数字数组转换为DataPoint格式
    const dataPoints = data.map((value, index) => ({
      x: index,
      y: value
    }));
    if (isSecondaryData && onSecondaryDataChange) {
      onSecondaryDataChange(dataPoints);
    } else {
      onDataChange(dataPoints);
    }
  };

  return (
    <div className="data-input-tab">
      <div className="input-method-selector">
        <button
          className={`method-button ${inputMethod === 'file' ? 'active' : ''}`}
          onClick={() => setInputMethod('file')}
        >
          文件上传
        </button>
        <button
          className={`method-button ${inputMethod === 'distribution' ? 'active' : ''}`}
          onClick={() => setInputMethod('distribution')}
        >
          分布生成
        </button>
        <button
          className={`method-button ${inputMethod === 'ai' ? 'active' : ''}`}
          onClick={() => setInputMethod('ai')}
        >
          AI生成数据
        </button>
      </div>

      {onSecondaryDataChange && (
        <div className="data-target-selector">
          <label>
            <input
              type="checkbox"
              checked={isSecondaryData}
              onChange={(e) => setIsSecondaryData(e.target.checked)}
            />
            使用此数据作为第二组数据（用于假设检验）
          </label>
        </div>
      )}

      <div className="input-content">
        {inputMethod === 'file' && (
          <div className="file-upload-section">
            <h3>上传数据文件</h3>
            <p>支持JSON和CSV格式的数据文件导入</p>
            <FileImporter onFileImport={handleFileImport} />
          </div>
        )}

        {inputMethod === 'distribution' && (
          <div className="distribution-generator-section">
            <h3>从统计分布生成数据</h3>
            <p>选择分布类型并设置参数生成模拟数据</p>
            <DistributionGenerator onDataGenerated={handleDistributionData} />
          </div>
        )}

        {inputMethod === 'ai' && (
          <div className="ai-generator-section">
            <h3>AI生成数据</h3>
            <p>描述您需要的数据模式和特征</p>
            <AIDataGenerator onDataGenerated={handleAIData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataInputTab;