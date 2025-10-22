import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// ES模块中获取当前目录的方式
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 切换到dist目录
process.chdir(path.join(__dirname, 'dist'));

console.log('Starting http-server on port 8080...');

// 启动http-server
const server = exec('npx http-server -p 8080 -a 0.0.0.0', (error, stdout, stderr) => {
  if (error) {
    console.error(`启动失败: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

// 输出服务器日志
server.stdout.on('data', (data) => {
  console.log(`服务器输出: ${data}`);
});

server.stderr.on('data', (data) => {
  console.error(`服务器错误: ${data}`);
});

// 监听进程退出
process.on('SIGINT', () => {
  console.log('正在停止服务器...');
  server.kill('SIGINT');
  process.exit(0);
});