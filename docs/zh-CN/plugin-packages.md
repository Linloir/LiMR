# 插件模块包

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/plugin-packages) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/plugin-packages.md)

一个插件包导出返回 RendererExtension 的工厂，消费者安装后通过 plugins 追加。插件可同时提供语法、标注、动作和参数，CSS 独立导出。它不需要修改 LiMR 源码。

## 可复制模板

完整模板位于 [plugin-template](../../skills/limr-plugin-development/assets/plugin-template/README.md)，包含 TypeScript 源码、类型构建、CSS、package.json 和 tsup 配置。它演示 reading-tip 区块、example:note 卡片和保存选区动作。

安装 LiMR 后，在应用目录执行：

```sh
mkdir -p packages/limr-reading-tools
cp -R node_modules/@linloir/limr/skills/limr-plugin-development/assets/plugin-template/. packages/limr-reading-tools/
cd packages/limr-reading-tools
npm install
npm run typecheck
npm run build
npm pack
```

源码仓库中的对应路径为 skills/limr-plugin-development/assets/plugin-template。替换模板的 @example 包名、扩展名、类型名和动作 ID，再实现业务数据与 UI；模板的 private: true 用于防止示例名被误发布，不影响本地打包。

## 包契约

| 字段 | 要求 |
| --- | --- |
| type | module |
| exports["."] | import 指向 ESM，types 指向 .d.ts |
| exports["./styles.css"] | 插件需要 CSS 时显式导出 |
| files | 包含构建输出与使用说明 |
| sideEffects | CSS 使用 ["**/*.css"]，避免被构建工具移除 |
| peerDependencies | @linloir/limr、react；直接依赖 react-dom API 时再声明 react-dom |
| 构建 external | LiMR、React、react/jsx-runtime，以及使用到的 React DOM 入口 |

LiMR 或 React 的第二份内置副本会破坏上下文/Hook 共享。不要打包宿主依赖，不要深度导入 LiMR 内部文件。参数声明合并必须随导出的类型分发。

## 在应用中引入

下方 @example 包来自模板，并未发布到 npm。先安装本地打出的归档；生成文件名以 npm pack 输出为准：

```sh
npm install ./packages/limr-reading-tools/example-limr-reading-tools-0.1.0.tgz
```

```tsx
import { Reader } from '@linloir/limr';
import { readingTools } from '@example/limr-reading-tools';
import '@linloir/limr/styles.css';
import '@example/limr-reading-tools/styles.css';

const plugins = [readingTools({ label: '阅读笔记' })];

export function Article({ source }: { source: string }) {
  return <Reader source={source} plugins={plugins} />;
}
```

真实第三方包使用它的包名和 peer 版本约束。改写已存在的默认模块使用 extensions + replaceExtension，不要重复注册同一标签。字体、公式样式、持久化和应用服务仍由宿主配置。

## 验证可分发性

本地类型检查通过后，还需把真实 tgz 安装到独立消费者中：检查公开导入、SSR、CSS 资源、默认模块仍可用和新增交互。支持 React 18/19 的包应分别验证两种宿主。语法插件检查流式结束与一次性解析等价；交互插件检查桌面侧栏、窄屏浮层、键盘、异步取消和两种主题。

LiMR 仓库的 [reading-tools](../../examples/packages/reading-tools/index.js) 和 [paper-theme](../../examples/packages/paper-theme/index.css) 是另一组可打包示例。AI 可使用[插件开发 Skill](ai-skills.md)，其中的模板可独立复制，引用文件无需依赖本仓库路径。

## 加载与大文档兼容性

依赖 1.3.0 加载控制或窗口化能力的插件应在 peerDependencies 声明对应最低版本，并在真实包消费者中验证 Worker、provisional/readOnly、复制/搜索和离屏状态。保留旧 API 的简单示例可继续使用其兼容版本范围。CSS 主题也应检查图片预览 portal 的浅色/深色工具栏和等宽按钮。扩展契约见[Worker 与窗口化视图](extensions.md#worker-与窗口化视图)，接入示例见[大文档](large-documents.md)。
