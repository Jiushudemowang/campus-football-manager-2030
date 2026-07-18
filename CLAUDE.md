# 校园足球经理 2030

## 技术栈
- React 18 + TypeScript
- Vite + Tailwind CSS
- Zustand 状态管理
- ECharts 数据可视化
- React Router

## 核心目录
- `src/data/` — 球员卡、球星库、棋盘规则
- `src/components/` — 棋盘、卡牌、对战界面
- `src/pages/` — 首页、棋盘对战、球星对标、数据叙事
- `src/stores/` — 全局状态
- `scripts/` — 辅助脚本
- `docs/` — 文档

## 常用命令
```bash
npm install
npm run dev
npm run build
npm run lint
npm run check
```

## 操作协议
- 球员数据和规则引擎是核心，修改前先确认影响范围
- 球星对标、能力雷达图等 AI 功能调用需记录 prompt 和输出
- 棋盘规则修改必须同步更新 `src/data/` 中相关配置
- 大功能拆分步骤，每步验证

## 命名规范
- 组件：PascalCase
- 数据文件：`camelCase.json`
- 脚本：`snake_case.py`
