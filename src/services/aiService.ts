// 本地后端代理API服务
// 注意：不再需要DataPoint导入，因为现在返回number[]类型

/**
 * 通过本地后端代理API生成基于文本描述的数据
 * @param description 用户对数据的描述
 * @param sampleCount 需要生成的数据点数量
 * @returns 生成的数字数组
 */
export const generateDataWithAI = async (
  description: string,
  sampleCount: number = 100
): Promise<number[]> => {
  try {
    // 构建提示词，指导AI生成符合要求的数据
    // 注意：此提示词在通过本地后端时不需要，因为后端会构建自己的提示词
    // 但为了代码完整性保留注释

    console.log('使用本地后端代理API生成数据');
    console.log('数据描述:', description);
    console.log('配置参数 - 样本数:', sampleCount);
    
    // 调用本地后端代理API，避免CORS问题
    const response = await fetch('http://localhost:5000/api/ai_data_generator', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: description,
        sample_count: sampleCount
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API调用失败: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('AI API响应:', result);
    
    // 解析后端返回的数据
    let parsedData;
    try {
      // 处理模拟数据格式（result是JSON字符串）
      if (result.result) {
        // 尝试解析JSON字符串
        const resultObj = typeof result.result === 'string' 
          ? JSON.parse(result.result) 
          : result.result;
        parsedData = resultObj;
      } else if (result.output?.text) {
        // 实际AI响应格式
        const aiResponse = result.output.text;
        const jsonMatch = aiResponse.match(/\{[^}]*\}/);
        if (!jsonMatch) {
          throw new Error('无法从AI响应中提取JSON数据');
        }
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法获取AI生成的内容');
      }
    } catch (parseError) {
        console.error('响应解析错误:', parseError);
        throw new Error(`数据解析失败: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
    
    // 验证返回的数据格式是否正确
    if (!Array.isArray(parsedData.data)) {
      throw new Error('AI返回的数据格式不正确');
    }

    // 转换并验证数据点
    const validData: number[] = parsedData.data
      .filter((value: any) => typeof value === 'number')
      .map((value: number) => parseFloat(value.toFixed(6)));

    // 如果生成的数据不足，使用回退数据补充
    if (validData.length < sampleCount) {
      console.warn(`AI只生成了${validData.length}个有效数据点，需要补充${sampleCount - validData.length}个`);
      const fallbackData = generateFallbackData(description, sampleCount - validData.length);
      return [...validData, ...fallbackData];
    }

    return validData.slice(0, sampleCount);

  } catch (error) {
    console.error('AI数据生成失败:', error);
    // 出错时使用回退策略
    return generateFallbackData(description, sampleCount);
  }
};

/**
 * 回退数据生成策略，当AI API调用失败时使用
 */
const generateFallbackData = (
  description: string,
  sampleCount: number
): number[] => {
  const data: number[] = [];
  
  // 根据描述中的关键词选择数据模式
  const hasQuadratic = description.toLowerCase().includes('二次') || description.toLowerCase().includes('quadratic');
  const hasSine = description.toLowerCase().includes('正弦') || description.toLowerCase().includes('sin') || description.toLowerCase().includes('周期');
  const hasGaussian = description.toLowerCase().includes('正态') || description.toLowerCase().includes('高斯') || description.toLowerCase().includes('gaussian');
  
  for (let i = 0; i < sampleCount; i++) {
    let value = 0;
    
    // 基于描述选择生成模式
    if (hasGaussian) {
      // 正态分布
      value = gaussianRandom();
    } else if (hasSine) {
      // 正弦模式
      const freq = 0.5 + Math.random() * 2;
      const phase = Math.random() * Math.PI * 2;
      value = Math.sin(freq * i * 0.1 + phase) * 5 + Math.random() * 2;
    } else if (hasQuadratic) {
      // 二次模式
      const a = (Math.random() - 0.5) * 0.1;
      const b = (Math.random() - 0.5) * 2;
      const c = Math.random() * 10;
      value = a * i * i + b * i + c;
    } else {
      // 线性或随机模式
      const slope = (Math.random() - 0.5) * 2;
      const intercept = Math.random() * 10;
      value = slope * i + intercept + (Math.random() - 0.5) * 5;
    }
    
    data.push(parseFloat(value.toFixed(6)));
  }
  
  return data;
};

/**
 * 生成正态分布随机数
 * @returns 符合标准正态分布的随机数
 */
const gaussianRandom = (): number => {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * 5 + 10; // 均值10，标准差5
};