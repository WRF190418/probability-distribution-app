import React from 'react';

interface FormulaDisplayProps {
  formula: string;
}

const FormulaDisplay: React.FC<FormulaDisplayProps> = ({ formula }) => {
  return (
    <div className="formula-display">
      <h4>数学公式:</h4>
      <div className="formula">{formula}</div>
    </div>
  );
};

export default FormulaDisplay;