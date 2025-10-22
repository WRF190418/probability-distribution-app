import React from 'react';

interface ParameterSliderProps {
  label?: string;
  value: number;
  onChange?: (value: number) => void;
  onValueChange?: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  onChange,
  onValueChange,
  min,
  max,
  step
}) => {
  // 使用onChange或onValueChange，优先使用onValueChange以保持向后兼容性
  const handleChange = onValueChange || onChange || (() => {});
  return (
    <div className="parameter-slider">
      <label>
        {label}: {value.toFixed(2)}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleChange(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default ParameterSlider;