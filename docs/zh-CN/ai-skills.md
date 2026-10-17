# AI Skills：下载、导入与使用

> 阅读提示：本文包含 LiMR 扩展语法和交互示例。部分内容在 GitHub 等普通 Markdown 阅读器中无法完整展示；前往 [GitHub Pages 文档](https://linloir.github.io/LiMR/#/docs/zh-CN/ai-skills) 可获得最佳阅读体验。

[文档目录](README.md) · [English](../en/ai-skills.md)

Skills 是指导 AI 工作的文件包，不是运行在 Reader 中的 RendererExtension，也不是模型服务。安装 Skill 不会自动修改项目、安装插件或连接 AI API。

| Skill | 适用任务 |
| --- | --- |
| [limr-use](../../skills/limr-use/SKILL.md) | 接入 LiMR、选择组件、编写语法、配置标注/流式/主题、引入已有插件 |
| [limr-plugin-development](../../skills/limr-plugin-development/SKILL.md) | 开发新插件模块包，扩展卡片/语法/动作/参数，构建并验证消费者 |

两份 Skill 的指令使用英文以便复用，支持中文任务输入；给使用者的说明同时提供中英文。插件 Skill 包含独立模板，两个 Skill 都包含本地 references，无需把整个 LiMR 仓库放进 AI 上下文。

## 从 npm 包导入

先安装包含 Skills 的 LiMR 版本，在**你的应用项目**中运行：

```sh
npm install @linloir/limr
mkdir -p .agents/skills
cp -R node_modules/@linloir/limr/skills/limr-use .agents/skills/
cp -R node_modules/@linloir/limr/skills/limr-plugin-development .agents/skills/
```

以上为新安装示例；已有同名目录时先检查本地定制，再更新整个目录，避免旧模板残留。导入是快照，npm 升级不会自动同步副本。升级 LiMR 后应同时检查 Skill 版本适配。

## 从仓库或 ZIP 导入

可以从仓库的 skills 目录复制，也可以在本地生成 ZIP（需要 Python 3）：

```sh
pnpm pack:skills
```

输出在 artifacts/skills，并同步到 Playground 的 public/downloads 供 Docs 页面下载。每个 ZIP 的根目录是完整 skill 文件夹，不只包含 SKILL.md；另有包含两份 Skill 的版本化总包。构建 Docs 站点时自动生成下载文件。

对应版本网站部署后可直接下载：[limr-use.zip](https://linloir.github.io/LiMR/downloads/limr-use.zip)、[limr-plugin-development.zip](https://linloir.github.io/LiMR/downloads/limr-plugin-development.zip)。本地 Docs 的 AI Skills 页面也有下载按钮。ZIP 是便于下载的归档，不代表所有 AI 客户端都支持一键 ZIP 导入；不支持时解压并复制完整目录。

## Codex 的位置与调用

Codex 的项目级目录是 `.agents/skills/`，用户级目录是 `~/.agents/skills/`。选择一个作用域，避免重复安装同名 Skill。客户端仍使用旧目录时，按该版本支持的路径导入。Codex 通常自动发现变化，未显示时重启；可通过 `/skills` 或 `$skill-name` 调用。依据：[OpenAI 官方 Skills 文档](https://developers.openai.com/codex/skills/)。

```text
$limr-use 在这个 React 项目中接入 LiMR，使用中文界面、流式回答和受控标注。
```

```text
$limr-plugin-development 创建术语解释插件包，包含术语块、选区动作、可展开卡片和侧栏摘要，再引入当前应用。
```

其他支持 SKILL.md 的 AI 工具，使用其实际支持的项目/用户目录；没有 Skill 自动发现能力时，可以要求 AI 阅读 SKILL.md，并按其中链接加载 references 和 assets。无需假定某个客户端专属命令可在所有工具上工作。

## 期望产物

使用 Skill 应交付可运行的集成、稳定配置和验证结果；开发 Skill 应交付模块源码、包导出/类型/CSS、宿主引入示例及真实包消费验证。它们都要求以当前安装版本为准，不虚构解析能力，不删除未知标注的持久化数据，也不在未获指示时发布 npm 或修改外部服务。

## 加载与大文档接入

`limr-use` 的 [loading.md](../../skills/limr-use/references/loading.md) 覆盖 AsyncReader、宿主进度、取消/重试、Worker 资源、只读预览、书签、打印与图片预览。`limr-plugin-development` 的[契约](../../skills/limr-plugin-development/references/contract.md) 补充自定义 Worker 注册、可转移结果与窗口化视图的文本/状态契约。两者以 1.3.0 的公开声明为准；升级时复制整个 Skill 文件夹，保留本地定制。
