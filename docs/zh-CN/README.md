# 中文文档

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/README) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/README.md)

LiMR 把 Markdown 解析、正文排版、选区和标注组织在同一个阅读器中。默认能力包括大文档 Worker 加载与窗口化阅读、自适应表格、公式、代码折叠/换行/行号、图像预览和双语内容；这些能力都属于核心库，宿主只需接入文件、服务与持久化。

## 从你的场景开始

| 我想做什么 | 第一步 | 继续阅读 |
| --- | --- | --- |
| 第一次在 React 中展示文章 | [快速开始](getting-started.md) | [接入与模块配置](integration.md) |
| 打开大文件、展示进度、恢复阅读位置 | [快速开始的大文档示例](getting-started.md#加载大文档) | [加载、窗口化与打印](large-documents.md) |
| 展示密集或超宽表格 | [快速开始的阅读策略](getting-started.md#调整阅读策略) | [自适应表格、完整内容与原生模式](table-layout.md) |
| 编写公式、代码、图片、引用和译文 | [语法手册](syntax.md) | [标注与选区](annotations.md) |
| 接入聊天流、编辑器或本地文件 | [按场景接入](integration.md#选择组件) | [原文编辑](integration.md#原文编辑与本地文件) |
| 定制显示或开发插件 | [选择扩展接口](extensions.md#选择接口) | [主题与字体](styles.md)、[打包与接入](extensions.md#打包与接入) |
| 让 AI 协助接入或写插件 | [AI Skills](ai-skills.md) | 选择 limr-use 或 limr-plugin-development |

## 按使用过程阅读

1. **入门与写作**：[快速开始](getting-started.md)给出可运行入口，[语法手册](syntax.md)集中维护模块清单、写法、属性和交互边界。
2. **应用接入**：[项目集成](integration.md)解释组件和配置选择；[大文档](large-documents.md)、[表格布局](table-layout.md)、[标注](annotations.md)分别深入对应能力。
3. **二次开发**：[扩展开发](extensions.md)从最小接口讲到分发验证；[样式](styles.md)维护 CSS、字体、排版和 portal 主题契约。
4. **参考与验证**：[API](api.md)、[架构](architecture.md)、[渲染性能](performance.md)、[加载与内存](loading-performance.md)、[KP 性能](knuth-plass-performance.md)。性能报告说明测试条件，不代表所有输入的固定上限。

模块选择已合并到接入指南，插件包说明已合并到扩展开发；原页面保留兼容入口。两种语言使用相同结构。随 npm 包分发的文档对应包版本，接入旧版本时先核对已安装声明。

Playground 的本地草稿、导入导出和模拟助手由示例应用实现。刷新打开默认文章；手动保存的草稿可自行加载，语言偏好单独保存。当前会话中切换 Docs 与 Playground 会保留编辑。

[返回项目说明](../../README.md) · [在线 Playground](https://linloir.github.io/LiMR/)
