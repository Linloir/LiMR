import streaming from './presets/streaming.md?raw';
import notes from './presets/notes.md?raw';
import code from './presets/code.md?raw';
import express from './presets/express.md?raw';
import axios from './presets/axios.md?raw';
import alice from './presets/alice.md?raw';
import chibi from './presets/chibi.md?raw';
import paper from './presets/scikit-learn-paper.md?raw';
import featureVisualization from './presets/feature-visualization.md?raw';
import buildingBlocks from './presets/building-blocks.md?raw';
import { sample } from './sample';
import { sampleEn } from './sample.en';
import streamingEn from './presets/en/streaming.md?raw';
import notesEn from './presets/en/notes.md?raw';
import codeEn from './presets/en/code.md?raw';
import expressEn from './presets/en/express.md?raw';
import axiosEn from './presets/en/axios.md?raw';
import aliceEn from './presets/en/alice.md?raw';
import chibiEn from './presets/en/chibi.md?raw';
import paperEn from './presets/en/scikit-learn-paper.md?raw';
import featureVisualizationEn from './presets/en/feature-visualization.md?raw';
import buildingBlocksEn from './presets/en/building-blocks.md?raw';

export const presets = [
  { id: 'welcome', label: '阅读与排版', description: '正文、图片、视频与编辑体验', source: sample },
  { id: 'streaming', label: '逐字抵达', description: '流式代码、图表与后到的标注', source: streaming },
  { id: 'notes', label: '做一点笔记', description: '脚注、命名范围与 Markdown 写回', source: notes },
  { id: 'code', label: '公式与代码', description: '公式、代码、图表与多选练习', source: code },
  { id: 'express', label: 'Express README', description: 'Web 框架的设计与使用 · 英文', source: express },
  { id: 'axios', label: 'Axios README', description: '请求、示例与 API 配置 · 英文', source: axios },
  { id: 'alice', label: '爱丽丝漫游奇境', description: '英文原著前三章 · 各章选段中英对照', source: alice },
  { id: 'chibi', label: '前赤壁赋', description: '苏轼 · 水与月的对话', source: chibi },
  { id: 'paper', label: 'scikit-learn 论文', description: '2011 年原论文 · 选段译文与引用', source: paper },
  { id: 'feature-visualization', label: 'Feature Visualization', description: 'Distill 2017 · 多图布局与逐段译文', source: featureVisualization },
  { id: 'building-blocks', label: '可解释性的基础积木', description: 'Distill 2018 · 论文插图与中英对照', source: buildingBlocks },
  { id: 'long', label: '长文阅读', description: '120 节内容，试试目录和滚动', source: Array.from({ length: 120 }, (_, i) => `## 第 ${i + 1} 节 · 足够长的标题需要自动换行以保持目录宽度\n\n第 ${i + 1} 节内容。\n\n${'长文阅读需要保持清晰、稳定和流畅。'.repeat(30)}`).join('\n\n') },
] as const;

const englishPresets = [
  { id: 'welcome', label: 'Reading and typography', description: 'Text, images, video, and editing', source: sampleEn },
  { id: 'streaming', label: 'One word at a time', description: 'Streaming code, diagrams, and late annotations', source: streamingEn },
  { id: 'notes', label: 'Leave a note', description: 'Footnotes, named ranges, and Markdown writeback', source: notesEn },
  { id: 'code', label: 'Mathematics and code', description: 'Equations, code, diagrams, and a multiple-choice exercise', source: codeEn },
  { id: 'express', label: 'Express README', description: 'A web framework: design and usage', source: expressEn },
  { id: 'axios', label: 'Axios README', description: 'Requests, examples, and API configuration', source: axiosEn },
  { id: 'alice', label: "Alice's Adventures in Wonderland", description: 'The first three chapters, with optional Chinese excerpts', source: aliceEn },
  { id: 'chibi', label: 'First Rhapsody on the Red Cliffs', description: 'Su Shi · An original English rendering for this example', source: chibiEn },
  { id: 'paper', label: 'The scikit-learn paper', description: 'The 2011 paper, with optional translations and references', source: paperEn },
  { id: 'feature-visualization', label: 'Feature Visualization', description: 'Distill 2017 · Figure layouts and optional translations', source: featureVisualizationEn },
  { id: 'building-blocks', label: 'The Building Blocks of Interpretability', description: 'Distill 2018 · Research figures and optional translations', source: buildingBlocksEn },
  { id: 'long', label: 'Long-form reading', description: '120 sections to explore the contents and scrolling', source: Array.from({ length: 120 }, (_, i) => `## Section ${i + 1} · A longer heading that wraps naturally within the table of contents\n\nSection ${i + 1}.\n\n${'A long document should remain clear, stable, and comfortable to read. Each paragraph gives an idea room to develop while headings help readers find their way back. '.repeat(18)}`).join('\n\n') },
] as const;

export function getPresets(locale: 'zh-CN' | 'en') {
  return locale === 'en' ? englishPresets : presets;
}
