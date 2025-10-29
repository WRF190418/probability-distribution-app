import React, { useState, useEffect, useRef } from 'react';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  targetElementId?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TutorialProps {
  steps: TutorialStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ steps, isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightPosition, setHighlightPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const highlightRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && steps.length > 0 && currentStep < steps.length) {
      const targetId = steps[currentStep].targetElementId;
      const target = targetId ? document.getElementById(targetId) : null;
      if (target) {
        const rect = target.getBoundingClientRect();
        setHighlightPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        });
        
        // Scroll to the highlighted element
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight class to the target
        target.classList.add('tutorial-highlight');
      }
    }

    return () => {
      // Cleanup: remove highlight class
      const allTargets = document.querySelectorAll('.tutorial-highlight');
      allTargets.forEach(target => target.classList.remove('tutorial-highlight'));
    };
  }, [isOpen, currentStep, steps]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen || steps.length === 0 || currentStep >= steps.length) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const position = currentStepData.position || 'bottom';

  // Calculate tooltip position based on highlight and preferred position
  let tooltipStyle: React.CSSProperties = {};
  const margin = 10;
  
  switch (position) {
    case 'top':
      tooltipStyle = {
        top: `${highlightPosition.top - 200 - margin}px`,
        left: `${highlightPosition.left + highlightPosition.width / 2 - 200}px`
      };
      break;
    case 'left':
      tooltipStyle = {
        top: `${highlightPosition.top + highlightPosition.height / 2 - 100}px`,
        left: `${highlightPosition.left - 400 - margin}px`
      };
      break;
    case 'right':
      tooltipStyle = {
        top: `${highlightPosition.top + highlightPosition.height / 2 - 100}px`,
        left: `${highlightPosition.left + highlightPosition.width + margin}px`
      };
      break;
    default: // bottom
      tooltipStyle = {
        top: `${highlightPosition.top + highlightPosition.height + margin}px`,
        left: `${highlightPosition.left + highlightPosition.width / 2 - 200}px`
      };
  }

  return (
    <div className="tutorial-overlay" onClick={onClose}>
      {/* Background overlay */}
      <div 
        className="tutorial-backdrop"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9998
        }}
      />
      
      {/* Highlight area */}
      <div
        ref={highlightRef}
        className="tutorial-highlight-area"
        style={{
          position: 'fixed',
          top: `${highlightPosition.top}px`,
          left: `${highlightPosition.left}px`,
          width: `${highlightPosition.width}px`,
          height: `${highlightPosition.height}px`,
          borderRadius: '8px',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
          zIndex: 9999
        }}
        onClick={(e) => e.stopPropagation()}
      />
      
      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="tutorial-tooltip"
        style={{
          position: 'fixed',
          width: '400px',
          maxWidth: '90vw',
          backgroundColor: '#0f172a',
          color: 'white',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #334155',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          ...tooltipStyle
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tutorial-step-indicator" style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          backgroundColor: '#667eea',
          color: 'white',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '14px'
        }}>
          {currentStep + 1}
        </div>
        
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
          {currentStepData.title}
        </h3>
        
        <p style={{ margin: '0 0 20px 0', color: '#cbd5e1', lineHeight: '1.5' }}>
          {currentStepData.content}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            style={{
              padding: '8px 16px',
              backgroundColor: currentStep === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.1)',
              color: currentStep === 0 ? 'rgba(255, 255, 255, 0.3)' : 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              opacity: currentStep === 0 ? 0.5 : 1
            }}
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            style={{
              padding: '8px 24px',
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#764ba2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#667eea';
            }}
          >
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
      
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }}
      >
        ×
      </button>

      {/* Tutorial-specific styles */}
      <style>{`
        .tutorial-highlight {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(102, 126, 234, 0);
          }
        }
        
        /* Ensure tooltip doesn't go off-screen */
        @media (max-width: 480px) {
          .tutorial-tooltip {
            width: 90vw !important;
            left: 5vw !important;
            right: 5vw !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Tutorial;

export const defaultTutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Data Analysis Platform',
    content: 'This is a powerful tool for statistical analysis, hypothesis testing, and data visualization. Let me guide you through the key features!',
    targetElementId: '.app-header',
    position: 'bottom'
  },
  {
    id: 'data-input',
    title: 'Data Input Section',
    content: 'Start by entering your data here. You can manually input values, upload a file, or generate sample data for testing.',
    targetElementId: '#input-tab-button',
    position: 'right'
  },
  {
    id: 'save-load',
    title: 'Save & Load Data',
    content: 'Save your analysis data to your browser or export as JSON files for later use. You can also import previously saved datasets.',
    targetElementId: '.save-load-buttons',
    position: 'bottom'
  },
  {
    id: 'statistical-analysis',
    title: 'Statistical Analysis',
    content: 'Once you have data, use this tab to compute descriptive statistics like mean, median, standard deviation, and more.',
    targetElementId: '#stats-tab-button',
    position: 'right'
  },
  {
    id: 'hypothesis-testing',
    title: 'Hypothesis Testing',
    content: 'Perform advanced statistical tests to validate your assumptions and draw meaningful conclusions from your data.',
    targetElementId: '#hypothesis-tab-button',
    position: 'right'
  },
  {
    id: 'visualization',
    title: 'Data Visualization',
    content: 'See your data come to life with interactive charts and graphs. Visualizations help identify patterns and trends quickly.',
    targetElementId: '.visualization-section',
    position: 'top'
  },
  {
    id: 'finish',
    title: 'Ready to Explore!',
    content: 'You now know the basics of our Data Analysis Platform. Start analyzing your data and discover insights with just a few clicks!',
    targetElementId: '.data-analysis-app',
    position: 'bottom'
  }
];