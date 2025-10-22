import React, { useRef, useState } from 'react';

interface FileImporterProps {
  onFileImport: (data: {x: number, y: number}[]) => void;
}

const FileImporter: React.FC<FileImporterProps> = ({ onFileImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{status: 'idle' | 'success' | 'error', message: string}>({
    status: 'idle',
    message: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        let data: {x: number, y: number}[] = [];

        // 尝试解析为JSON
        try {
          data = JSON.parse(content);
        } catch (jsonError) {
          // 如果不是JSON，尝试解析为CSV
          const lines = content.split('\n').filter(line => line.trim() !== '');
          
          if (lines.length > 0) {
            // 假设第一行是标题
            const headers = lines[0].split(',').map(header => header.trim());
            
            if (headers.length >= 2) {
              data = lines.slice(1).map(line => {
                const values = line.split(',').map(value => value.trim());
                return {
                  x: parseFloat(values[0]) || 0,
                  y: parseFloat(values[1]) || 0
                };
              }).filter(point => !isNaN(point.x) && !isNaN(point.y));
            } else {
              throw new Error('CSV格式不正确，需要至少两列数据');
            }
          }
        }

        if (data.length > 0) {
          onFileImport(data);
          setImportStatus({
            status: 'success',
            message: `成功导入 ${data.length} 个数据点`
          });
        } else {
          throw new Error('文件中没有有效的数据点');
        }
      } catch (error) {
        setImportStatus({
          status: 'error',
          message: `导入失败: ${error instanceof Error ? error.message : '未知错误'}`
        });
      }
    };

    reader.readAsText(file);
    
    // 重置文件输入，以便可以再次选择同一个文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-importer">
      <button
        className="import-button"
        onClick={() => fileInputRef.current?.click()}
      >
        导入数据文件
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".json,.csv"
        onChange={handleFileUpload}
      />
      {importStatus.status === 'success' && (
        <div className="import-status success">{importStatus.message}</div>
      )}
      {importStatus.status === 'error' && (
        <div className="import-status error">{importStatus.message}</div>
      )}
      <div className="import-hint">支持JSON和CSV格式文件</div>
    </div>
  );
};

export default FileImporter;