import notes from './presets/notes.md?raw';
import code from './presets/code.md?raw';
import express from './presets/express.md?raw';
import axios from './presets/axios.md?raw';
import alice from './presets/alice.md?raw';
import chibi from './presets/chibi.md?raw';
import paper from './presets/scikit-learn-paper.md?raw';
import { sample } from './sample';

export const presets = [
  { id: 'welcome', label: '阅读与排版', description: '从一篇完整的文章开始', source: sample },
  { id: 'notes', label: '做一点笔记', description: '从复述到提问的完整阅读练习', source: notes },
  { id: 'code', label: '公式与代码', description: '数值积分、误差与梯度下降', source: code },
  { id: 'express', label: 'Express README', description: 'Web 框架的设计与使用 · 英文', source: express },
  { id: 'axios', label: 'Axios README', description: '请求、示例与 API 配置 · 英文', source: axios },
  { id: 'alice', label: '爱丽丝漫游奇境', description: 'Lewis Carroll · 英文原著前三章', source: alice },
  { id: 'chibi', label: '前赤壁赋', description: '苏轼 · 水与月的对话', source: chibi },
  { id: 'paper', label: 'scikit-learn 论文', description: '2011 年原论文 · Markdown 转写', source: paper },
  { id: 'long', label: '长文阅读', description: '120 节内容，试试目录和滚动', source: Array.from({ length: 120 }, (_, i) => `## 第 ${i + 1} 节 · 足够长的标题需要自动换行以保持目录宽度\n\n第 ${i + 1} 节内容。\n\n${'长文阅读需要保持清晰、稳定和流畅。'.repeat(30)}`).join('\n\n') },
] as const;
