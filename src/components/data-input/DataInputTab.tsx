import React, { useState } from 'react';
import { DataPoint } from '../DataAnalysisApp';
import FileImporter from '../common/FileImporter';
import DistributionGenerator from './DistributionGenerator';
import AIDataGenerator from './AIDataGenerator';
import './DataInputTab.css';
import '../modernStyles.css';

interface DataInputTabProps {
  onDataChange: (data: DataPoint[]) => void;
  onSecondaryDataChange?: (data: DataPoint[]) => void;
}

const DataInputTab: React.FC<DataInputTabProps> = ({ onDataChange, onSecondaryDataChange }) => {
  const [inputMethod, setInputMethod] = useState<string>('file');
  const [isSecondaryData, setIsSecondaryData] = useState<boolean>(false);
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error' | 'warning'; show: boolean}>({message: '', type: 'success', show: false});

  // Show modern notification
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({message, type, show: true});
    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 3000);
  };

  const handleFileImport = (data: {x: number, y: number}[]) => {
    if (isSecondaryData && onSecondaryDataChange) {
      onSecondaryDataChange(data);
      showNotification('Secondary data imported successfully!', 'success');
    } else {
      onDataChange(data);
      showNotification('Main data imported successfully!', 'success');
    }
  };

  const handleDistributionData = (data: DataPoint[]) => {
    if (isSecondaryData && onSecondaryDataChange) {
      onSecondaryDataChange(data);
      showNotification('Secondary data generated successfully!', 'success');
    } else {
      onDataChange(data);
      showNotification('Main data generated successfully!', 'success');
    }
  };

  const handleAIData = (data: number[]) => {
    // Convert AI-generated array to DataPoint format
    const dataPoints = data.map((value, index) => ({
      x: index,
      y: value
    }));
    if (isSecondaryData && onSecondaryDataChange) {
      onSecondaryDataChange(dataPoints);
      showNotification('Secondary data generated successfully!', 'success');
    } else {
      onDataChange(dataPoints);
      showNotification('Main data generated successfully!', 'success');
    }
  };

  return (
    <div className="data-input-tab">
      <h2 className="gradient-text">Data Input</h2>
      
      <div className="input-method-selector glass">
        <button
          className={`method-button ${inputMethod === 'file' ? 'active' : ''}`}
          onClick={() => setInputMethod('file')}
        >
          File Upload
        </button>
        <button
          className={`method-button ${inputMethod === 'distribution' ? 'active' : ''}`}
          onClick={() => setInputMethod('distribution')}
        >
          Distribution Generator
        </button>
        <button
          className={`method-button ${inputMethod === 'ai' ? 'active' : ''}`}
          onClick={() => setInputMethod('ai')}
        >
          AI Data Generation
        </button>
      </div>

      {onSecondaryDataChange && (
        <div className="data-target-selector">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isSecondaryData}
              onChange={(e) => setIsSecondaryData(e.target.checked)}
            />
            Use as secondary data (for hypothesis testing)
          </label>
        </div>
      )}

      <div className="input-content">
        {inputMethod === 'file' && (
          <div className="file-upload-section card">
            <h3 className="gradient-text">Upload Data File</h3>
            <p>Supports JSON and CSV format data file import</p>
            <FileImporter onFileImport={handleFileImport} />
          </div>
        )}

        {inputMethod === 'distribution' && (
          <div className="distribution-generator-section card">
            <h3 className="gradient-text">Generate from Statistical Distribution</h3>
            <p>Select distribution type and set parameters to generate sample data</p>
            <DistributionGenerator onDataGenerated={handleDistributionData} />
          </div>
        )}

        {inputMethod === 'ai' && (
          <div className="ai-generator-section card">
            <h3 className="gradient-text">AI Data Generation</h3>
            <p>Describe the data pattern and characteristics you need</p>
            <AIDataGenerator onDataGenerated={handleAIData} />
          </div>
        )}
      </div>
      
      {/* Modern Notification */}
      {notification.show && (
        <div className={`notification ${notification.type}`} style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '15px 25px',
          borderRadius: '8px',
          color: 'white',
          fontWeight: '600',
          zIndex: 10000,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
          backgroundColor: notification.type === 'success' ? '#10b981' : 
                           notification.type === 'error' ? '#ef4444' : '#f59e0b',
          animation: 'slideUp 0.3s ease, fadeIn 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {notification.type === 'success' && '✅'}
          {notification.type === 'error' && '❌'}
          {notification.type === 'warning' && '⚠️'}
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default DataInputTab;