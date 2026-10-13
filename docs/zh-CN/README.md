# 中文文档

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/README) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/README.md)

这套文档对应当前仓库实现，包含本次新增的流式、排版与模块能力；使用 npm 包时请核对安装版本的导出与类型。默认入口为中文，英文页面与本目录一一对应。

| 你要做什么 | 阅读文档 |
| --- | --- |
| 安装并显示第一篇文档 | [快速开始](getting-started.md) |
| 了解模块、默认包含的能力与配置方式 | [内置模块](modules.md) |
| 编写 Markdown、Mermaid、callout、高亮、脚注与双冒号组件 | [默认语法](syntax.md) |
| 集成到 React、选择排版模式、接收流式输出、自定义布局或 SSR | [项目集成](integration.md) |
| 保存选区、高亮、引用和自定义标注，理解整体复制 | [标注与选区](annotations.md) |
| 新增语法、卡片、选区动作、流式效果或按条件替换组件 | [扩展开发](extensions.md) |
| 开发独立 npm 插件并在应用中引入 | [插件模块包](plugin-packages.md) |
| 调整主题、字体、KP 排版、动画与图表样式 | [样式与字体](styles.md) |
| 查询组件 props、hooks 和核心 API | [API 参考](api.md) |
| 理解解析、状态和资源边界 | [架构与行为](architecture.md) |
| 了解性能数据和验证范围 | [性能与限制](performance.md) |
| 让 AI 使用 LiMR 或开发插件 | [AI Skills](ai-skills.md) |

先接入 `Reader`，需要定制布局时再拆分组件；需要应用功能时优先添加插件。Playground 中的本地保存、导入导出和模拟问答是演示应用功能，不是 Reader 自带的服务。

Playground 默认使用标准排版，可从菜单切换 Knuth–Plass 或两端对齐；流式演示已放慢。刷新会重新打开默认文档，不自动恢复上次的文章或编辑；显式保存的草稿可手动加载，语言偏好独立保留。Docs 链接支持直接打开指定页面，页内切换 Docs / Playground 保留本次会话中的编辑。

[返回 README](../../README.md) · [在线 Playground](https://linloir.github.io/LiMR/)
