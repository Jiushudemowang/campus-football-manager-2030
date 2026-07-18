# 提交材料清单

## 百度网盘文件夹命名

```
AIGC应用大赛-[所属赛区]-[学校/单位名称]-[组长姓名]团队－绿茵纪AI体育叙事引擎
```

## 文件夹内文件命名

```
AIGC应用大赛-[组长姓名]团队-作品说明文档.pdf
AIGC应用大赛-[组长姓名]团队-源代码.zip
AIGC应用大赛-[组长姓名]团队-演示视频.mp4
AIGC应用大赛-[组长姓名]团队-答辩PPT.pptx
AIGC应用大赛-[组长姓名]团队-AI使用报告.pdf
AIGC应用大赛-[组长姓名]团队-指导老师信息表.xlsx
AIGC应用大赛-[组长姓名]团队-团队成员信息表.xlsx
```

## 生成步骤

### 1. 源代码打包

```bash
cd /home/chengchen/cc_work/绿茵纪-AIGC体育叙事引擎
zip -r "AIGC应用大赛-[组长姓名]团队-源代码.zip" \
  src/ public/ index.html package.json tsconfig.json vite.config.ts \
  tailwind.config.js postcss.config.js eslint.config.js README.md docs/ scripts/
```

注意：不包含 `node_modules/` 和 `dist/`。

### 2. 说明文档

将 `docs/PROJECT.md` 和 `docs/AI_USAGE.md` 合并导出为 PDF。

### 3. 演示视频

录制 5–8 分钟作品演示视频，包含：
- 作品定位与选题背景（30秒）
- 首页与角色选择（1分钟）
- 互动叙事流程展示（2分钟）
- 多结局展示（1分钟）
- 十年战绩数据可视化（1分钟）
- 技术架构与 AI 使用说明（1分钟）
- 总结与价值（30秒）

### 4. PPT

已生成：`绿茵纪-AIGC大赛答辩PPT.pptx`

### 5. AI 使用报告

详见 `docs/AI_USAGE.md`，导出为 PDF。

## 在线 Demo

部署到 Vercel / Netlify 后，将链接附在作品说明文档中。

## 注意事项

- 所有 AI 生成内容保留生成记录和提示词
- 核心代码、叙事结构、交互逻辑由团队手工完成
- 作品中使用的球队历史素材已获得球队授权
- 确保提交后不再修改，避免被取消资格
