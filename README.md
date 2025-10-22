# 概率分布应用 (Probability Distribution App)

一个使用React、TypeScript和Vite构建的统计网页应用，用于生成和可视化各种概率分布数据。

## 功能特性

- 生成多种概率分布数据
- 通过AI生成自定义数据
- 数据可视化和统计分析
- 响应式设计，支持各种设备

## 技术栈

- React 19
- TypeScript
- Vite
- Recharts (图表库)
- MathJS (数学计算)

## 本地开发

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 构建生产版本
```bash
npm run build
```

4. 预览生产版本
```bash
npm run preview
```

## 部署到GitHub Pages

1. 确保已经在GitHub上创建了仓库
2. 运行部署命令
```bash
npm run deploy
```

## 部署说明

- 应用使用gh-pages自动部署到GitHub Pages
- 部署配置已在vite.config.ts中设置
- 部署后的应用将在 https://your-username.github.io/probability-distribution-app/ 访问

## 项目结构

- `src/` - 源代码目录
  - `components/` - React组件
  - `services/` - API服务
  - `utils/` - 工具函数
  - `types/` - TypeScript类型定义
- `public/` - 静态资源
- `dist/` - 构建输出目录

## ESLint配置

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
