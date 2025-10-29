import React, { useState, useRef, useEffect } from 'react';
import Tabs from './common/Tabs';
import DataInputTab from './data-input/DataInputTab';
import StatisticalAnalysisTab from './analysis/StatisticalAnalysisTab';
import MLEMOMAnalysisTab from './analysis/MLEMOMAnalysisTab';
import EnhancedHypothesisTestingTab from './analysis/EnhancedHypothesisTestingTab';
import DataVisualization from './visualization/DataVisualization';
import Tutorial, { defaultTutorialSteps } from './common/Tutorial';
import { saveDataToLocalStorage, loadDataFromLocalStorage, exportDataToFile, importDataFromFile, listSavedDatasets, deleteSavedData } from '../utils/localStorageUtils';
import './DataAnalysisApp.css';
import './modernStyles.css';

export interface DataPoint {
  x: number;
  y: number;
}

export interface AnalysisData {
  data: DataPoint[];
  secondaryData: DataPoint[];
}

const DataAnalysisApp: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);
  const [secondaryData, setSecondaryData] = useState<DataPoint[]>([]);
  const [activeTab, setActiveTab] = useState<string>('input');
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [saveFilename, setSaveFilename] = useState<string>('probability_data');
  const [showLoadDialog, setShowLoadDialog] = useState<boolean>(false);
  const [savedDatasets, setSavedDatasets] = useState<Array<{filename: string; timestamp: string}>>([]);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  // First visit detection is handled in useEffect
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if it's the first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedDataAnalysisApp');
    if (!hasVisited) {
      // Delay showing tutorial to ensure DOM is loaded
      const timer = setTimeout(() => {
        setShowTutorial(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Mark as visited after tutorial completion
  const handleTutorialComplete = () => {
    localStorage.setItem('hasVisitedDataAnalysisApp', 'true');
  };

  const handleDataChange = (newData: DataPoint[]) => {
    setData(newData);
  };

  const handleSecondaryDataChange = (newData: DataPoint[]) => {
    setSecondaryData(newData);
  };

  // Save data to local storage
  const handleSaveToLocal = () => {
    if (data.length === 0) {
      alert('No data to save!');
      return;
    }
    
    const analysisData: AnalysisData = { data, secondaryData };
    const success = saveDataToLocalStorage(analysisData, saveFilename);
    
    if (success) {
      // Show modern notification instead of alert
      showNotification('Data successfully saved to local storage!', 'success');
      setShowSaveDialog(false);
    } else {
      showNotification('Failed to save data. Please try again.', 'error');
    }
  };

  // Load data from local storage
  const handleLoadFromLocal = (filename: string) => {
    const loadedData = loadDataFromLocalStorage(filename);
    if (loadedData) {
      setData(loadedData.data || []);
      setSecondaryData(loadedData.secondaryData || []);
      showNotification('Data successfully loaded!', 'success');
      setShowLoadDialog(false);
    } else {
      showNotification('Failed to load data. Please try again.', 'error');
    }
  };

  // Export data to file
  const handleExportToFile = () => {
    if (data.length === 0) {
      showNotification('No data to export!', 'warning');
      return;
    }
    
    const analysisData: AnalysisData = { data, secondaryData };
    const filename = `${saveFilename || 'probability_data'}_${new Date().toISOString().slice(0, 10)}.json`;
    exportDataToFile(analysisData, filename);
    showNotification('Data successfully exported to file!', 'success');
  };

  // Handle file import
  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const importedData = await importDataFromFile(file);
      if (importedData) {
        setData(importedData.data || []);
        setSecondaryData(importedData.secondaryData || []);
        showNotification('Data successfully imported!', 'success');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        showNotification('Import failed. Please check the file format.', 'error');
      }
    }
  };

  // Open save dialog
  const openSaveDialog = () => {
    setSaveFilename('probability_data');
    setShowSaveDialog(true);
  };

  // Open load dialog and refresh dataset list
  const openLoadDialog = () => {
    setSavedDatasets(listSavedDatasets());
    setShowLoadDialog(true);
  };

  // Delete saved dataset
  const handleDeleteDataset = (filename: string) => {
    if (window.confirm(`Are you sure you want to delete dataset "${filename}"?`)) {
      const success = deleteSavedData(filename);
      if (success) {
        setSavedDatasets(listSavedDatasets());
        showNotification('Dataset deleted successfully!', 'success');
      } else {
        showNotification('Failed to delete dataset. Please try again.', 'error');
      }
    }
  };
  
  // Show modern notification
  const [notification, setNotification] = useState<{message: string; type: 'success' | 'error' | 'warning'; show: boolean}>({message: '', type: 'success', show: false});
  
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setNotification({message, type, show: true});
    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 3000);
  };

  return (
    <div className="data-analysis-app">
      <header className="app-header glass">
        <h1 className="gradient-text">Data Analysis Platform</h1>
        <p>Advanced Statistical Analysis & Visualization Tool</p>
        <div className="save-load-buttons">
          <button onClick={openSaveDialog} disabled={data.length === 0} className="btn btn-primary">
            <span>💾</span> Save Locally
          </button>
          <button onClick={openLoadDialog} className="btn btn-secondary">
            <span>📁</span> Load Data
          </button>
          <button onClick={handleExportToFile} disabled={data.length === 0} className="btn btn-accent">
            <span>📥</span> Export
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileImport}
            accept=".json"
            style={{ display: 'none' }}
          />
          <button onClick={() => fileInputRef.current?.click()} className="btn btn-outline">
            <span>📤</span> Import
          </button>
          <button onClick={() => setShowTutorial(true)} className="btn btn-outline new-feature">
            <span>🎓</span> Tutorial
          </button>
        </div>
      </header>

      <Tabs 
          tabs={[
            { id: 'input', label: 'Data Input' },
            { id: 'stats', label: 'Statistics', disabled: data.length === 0 },
            { id: 'mlemom', label: 'MLE/MoM Analysis', disabled: data.length === 0 },
            { id: 'hypothesis', label: 'Hypothesis Testing', disabled: data.length === 0 },
            { id: 'visualization', label: 'Visualization', disabled: data.length === 0 }
          ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="app-content">
        {activeTab === 'input' && (
          <div className="card">
            <DataInputTab onDataChange={handleDataChange} onSecondaryDataChange={handleSecondaryDataChange} />
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div className="card">
            <StatisticalAnalysisTab data={data} />
          </div>
        )}
        
        {activeTab === 'mlemom' && (
          <div className="card">
            <MLEMOMAnalysisTab data={data} />
          </div>
        )}
        
        {activeTab === 'hypothesis' && (
          <div className="card">
            <EnhancedHypothesisTestingTab data={data} secondaryData={secondaryData} />
          </div>
        )}
      </div>

      {data.length > 0 && (
        <div className="visualization-section card">
          <h2 className="gradient-text">Data Visualization</h2>
          <DataVisualization data={data} />
        </div>
      )}

      <footer className="app-footer glass">
        <p>Data Analysis Platform - Advanced Statistical Tools</p>
        <div className="footer-stats">
          <span className="badge badge-info">{data.length} data points</span>
          {secondaryData.length > 0 && (
            <span className="badge badge-secondary">{secondaryData.length} comparison points</span>
          )}
        </div>
      </footer>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Save Data</h3>
            <div className="dialog-content">
              <label htmlFor="save-filename">Save Name:</label>
              <input
                type="text"
                id="save-filename"
                className="input"
                value={saveFilename}
                onChange={(e) => setSaveFilename(e.target.value)}
                placeholder="probability_data"
              />
            </div>
            <div className="dialog-actions">
              <button onClick={() => setShowSaveDialog(false)} className="btn btn-outline">Cancel</button>
              <button onClick={handleSaveToLocal} className="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h3>Load Data</h3>
            <div className="dialog-content">
              {savedDatasets.length > 0 ? (
                <ul className="dataset-list">
                  {savedDatasets.map((dataset) => (
                    <li key={dataset.filename} className="dataset-item">
                      <div className="dataset-info">
                        <span className="dataset-name">{dataset.filename}</span>
                        <span className="dataset-time">
                          {new Date(dataset.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="dataset-actions">
                        <button onClick={() => handleLoadFromLocal(dataset.filename)} className="btn btn-accent">Load</button>
                        <button onClick={() => handleDeleteDataset(dataset.filename)} className="btn delete-button">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No saved datasets found</p>
              )}
            </div>
            <div className="dialog-actions">
              <button onClick={() => setShowLoadDialog(false)} className="btn btn-outline">Close</button>
            </div>
          </div>
        </div>
      )}
      
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
      
      {/* Tutorial */}
      <Tutorial
        steps={defaultTutorialSteps}
        isOpen={showTutorial}
        onClose={() => setShowTutorial(false)}
        onComplete={handleTutorialComplete}
      />
    </div>
  );
};

export default DataAnalysisApp;