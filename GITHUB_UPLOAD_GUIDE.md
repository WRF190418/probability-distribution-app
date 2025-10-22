# GitHub上传指南

## 方法一：使用GitHub网页界面（推荐）

### 步骤1：创建新仓库
1. 访问 https://github.com/WRF90418
2. 点击 "New repository" 或 "+" 按钮
3. 仓库名称：`probability-distribution-app`
4. 描述：`概率分布应用 - 支持假设检验、统计分析等功能`
5. 选择 "Public" 或 "Private"
6. **不要**勾选 "Initialize this repository with a README"
7. 点击 "Create repository"

### 步骤2：上传代码
1. 在仓库页面，找到 "uploading an existing file" 部分
2. 点击 "uploading an existing file"
3. 将整个项目文件夹拖拽到上传区域
4. 添加提交信息：`添加假设检验功能 - 支持t检验、Z检验、卡方检验等统计分析方法`
5. 点击 "Commit changes"

## 方法二：使用Git命令行

### 步骤1：获取Personal Access Token
1. 访问 https://github.com/settings/tokens
2. 点击 "Generate new token" -> "Generate new token (classic)"
3. 选择权限：
   - `repo` (完整仓库访问)
   - `workflow` (更新GitHub Action工作流)
4. 点击 "Generate token"
5. 复制生成的token（类似：ghp_xxxxxxxxxxxxxxxxxxxx）

### 步骤2：使用Token推送
```bash
# 设置远程仓库
git remote add origin https://github.com/WRF90418/probability-distribution-app.git

# 使用token推送（替换YOUR_TOKEN为实际token）
git remote set-url origin https://WRF90418:YOUR_TOKEN@github.com/WRF90418/probability-distribution-app.git

# 推送代码
git push -u origin master
```

## 方法三：使用GitHub Desktop

1. 下载并安装 GitHub Desktop
2. 登录您的GitHub账户
3. 选择 "Add an Existing Repository from your Hard Drive"
4. 选择项目文件夹
5. 点击 "Publish repository"
6. 输入仓库名称：`probability-distribution-app`
7. 点击 "Publish Repository"

## 项目功能说明

### 🎯 核心功能
- **数据输入**: 支持手动输入、文件导入、AI生成数据
- **统计分析**: 基本统计量计算、描述性统计
- **假设检验**: 
  - 单样本t检验 (方差未知)
  - 单样本Z检验 (方差已知)
  - 双样本t检验
  - 卡方拟合优度检验
  - 正态性检验
- **数据可视化**: 图表展示、分布拟合

### 📊 假设检验特性
- 支持单侧/双侧检验
- 精确的统计计算
- 详细的结果解释
- 置信区间计算

### 🚀 部署选项
- 本地开发服务器
- GitHub Pages部署
- Surge.sh部署
- PM2进程管理

## 访问地址
项目部署后可通过以下地址访问：
- 本地开发：http://localhost:5173
- GitHub Pages：https://wrf90418.github.io/probability-distribution-app/

## 技术栈
- React + TypeScript
- Vite构建工具
- 数学统计库
- 响应式设计
