// Define the required types locally

// 保存数据到本地存储
export const saveDataToLocalStorage = (data: any, filename: string = 'probability_data'): boolean => {
  try {
    const dataToSave = {
      data,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem(filename, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('保存数据失败:', error);
    return false;
  }
};

// 从本地存储加载数据
export const loadDataFromLocalStorage = (filename: string = 'probability_data'): any | null => {
  try {
    const savedData = localStorage.getItem(filename);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return parsedData.data;
    }
    return null;
  } catch (error) {
    console.error('加载数据失败:', error);
    return null;
  }
};

// 导出数据为JSON文件
export const exportDataToFile = (data: any, filename: string = 'probability_data.json'): void => {
  try {
    const dataToExport = {
      data,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const jsonStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('导出数据失败:', error);
  }
};

// 从JSON文件导入数据
export const importDataFromFile = (file: File): Promise<any | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedData = JSON.parse(content);
        resolve(parsedData.data);
      } catch (error) {
        console.error('解析文件失败:', error);
        resolve(null);
      }
    };
    
    reader.onerror = () => {
      console.error('读取文件失败');
      resolve(null);
    };
    
    reader.readAsText(file);
  });
};

// 列出所有保存的数据
export const listSavedDatasets = (): Array<{ filename: string; timestamp: string }> => {
  const datasets: Array<{ filename: string; timestamp: string }> = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('probability_data')) {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          datasets.push({
            filename: key,
            timestamp: parsed.timestamp || new Date().toISOString()
          });
        }
      }
    }
  } catch (error) {
    console.error('列出数据集失败:', error);
  }
  
  return datasets.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// 删除保存的数据
export const deleteSavedData = (filename: string): boolean => {
  try {
    localStorage.removeItem(filename);
    return true;
  } catch (error) {
    console.error('删除数据失败:', error);
    return false;
  }
};