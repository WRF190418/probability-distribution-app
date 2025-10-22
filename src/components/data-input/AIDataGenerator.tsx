import { useState } from 'react';
import { generateDataWithAI } from '../../services/aiService';
import './AIDataGenerator.css';

interface AIDataGeneratorProps {
  onDataGenerated: (data: number[]) => void;
}

const AIDataGenerator: React.FC<AIDataGeneratorProps> = ({ onDataGenerated }) => {
  const [description, setDescription] = useState('');
  const [sampleCount, setSampleCount] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('请输入数据描述');
      return;
    }

    setError('');
    setSuccessMessage('');
    setIsGenerating(true);

    try {
      console.log('开始通过代理API生成数据...');
      // 调用AI服务生成数据（通过本地代理API）
      const data = await generateDataWithAI(description, sampleCount);
      
      // 将生成的数据传递给父组件
      onDataGenerated(data);
      
      // 显示成功消息
      setSuccessMessage(`成功生成${data.length}个数据点！`);
      
    } catch (err) {
      console.error('生成数据失败:', err);
      setError('数据生成失败，请检查代理服务是否正常运行');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="ai-data-generator">
      <h3>AI 数据生成器（通过代理API）</h3>
      <div className="form-group">
        <label htmlFor="description">数据描述:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="请描述您想要生成的数据，例如：'生成广东气温随季节变化的数据'"
          rows={3}
        />
        <small className="hint">提示：越详细的描述可以获得更准确的数据</small>
      </div>
      
      <div className="form-group">
        <label htmlFor="sampleCount">样本数量:</label>
        <input
          type="number"
          id="sampleCount"
          min="10"
          max="1000"
          value={sampleCount}
          onChange={(e) => setSampleCount(parseInt(e.target.value))}
        />
      </div>

      <button 
        onClick={handleGenerate} 
        disabled={isGenerating}
        className="generate-button"
      >
        {isGenerating ? '生成中...' : '生成数据'}
      </button>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="status-info">
        <p>状态：代理API服务运行中</p>
      </div>
    </div>
  );
};

export default AIDataGenerator;