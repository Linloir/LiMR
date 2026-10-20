# AI Skills: download, install, and use

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/ai-skills) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/ai-skills.md)

Skills are instruction bundles for AI agents, not RendererExtension modules or model services. Installing a Skill does not automatically change a project, install plugins, or connect an AI API.

| Skill | Tasks |
| --- | --- |
| [limr-use](../../skills/limr-use/SKILL.md) | Integrate LiMR, choose components, author syntax, configure annotations/streaming/themes, import existing plugins |
| [limr-plugin-development](../../skills/limr-plugin-development/SKILL.md) | Build new plugin packages with cards/syntax/actions/parameters and validate consumers |

Instructions are in English and accept tasks written in Chinese. Human-facing documentation is bilingual. The development Skill includes a standalone starter; both include local references, so the entire repository is not required in the agent's context.

## Import from the npm package

Install a LiMR version containing Skills, then run in **your application project**:

```sh
npm install @linloir/limr
mkdir -p .agents/skills
cp -R node_modules/@linloir/limr/skills/limr-use .agents/skills/
cp -R node_modules/@linloir/limr/skills/limr-plugin-development .agents/skills/
```

These commands illustrate a fresh installation. Review local customizations before replacing an existing directory, and update the whole folder to avoid stale templates. Copies are snapshots; npm upgrades do not update them automatically. Review compatibility when upgrading LiMR.

## Import from the repository or ZIP

Copy from the repository's skills directory, or generate ZIPs locally (requires Python 3):

```sh
pnpm pack:skills
```

Archives are written to artifacts/skills and mirrored to Playground public/downloads for Docs downloads. Each ZIP contains a complete top-level skill directory, not just SKILL.md. A versioned combined archive is also produced. Building the Docs site generates download assets automatically.

After the corresponding site version is deployed, download [limr-use.zip](https://linloir.github.io/LiMR/downloads/limr-use.zip) or [limr-plugin-development.zip](https://linloir.github.io/LiMR/downloads/limr-plugin-development.zip). The local AI Skills page also has download buttons. ZIPs are transport archives, not a promise that every AI client supports one-click import; extract and copy the full folders where needed.

## Codex locations and invocation

Codex supports project skills in .agents/skills and user skills in ~/.agents/skills. Choose one scope to avoid duplicate names. Older clients may use a different supported directory. Changes are normally discovered automatically; restart if missing. Invoke through /skills or $skill-name. Source: [official OpenAI Skills documentation](https://developers.openai.com/codex/skills/).

```text
$limr-use Integrate LiMR into this React application with English labels, streaming answers, and controlled annotations.
```

```text
$limr-plugin-development Create a glossary plugin package with a term block, selection action, expandable card, and sidebar preview, then import it into this application.
```

For other SKILL.md-compatible agents, use their supported project/user locations. Without automatic discovery, ask the AI to read SKILL.md and follow its reference/asset links. Do not assume one client's commands work everywhere.

## Expected deliverables

The use Skill should deliver working integration, stable configuration, and validation. The development Skill should deliver module source, exports/types/CSS, a host example, and real package-consumer verification. Both prioritize the installed API, avoid invented syntax and loss of persisted unknown annotations, and do not publish packages or modify external services unless instructed.

## Loading and large-document integration

The use Skill's [loading.md](../../skills/limr-use/references/loading.md) covers AsyncReader, host progress, cancel/retry, worker assets, read-only previews, bookmarks, printing and image previews. The development Skill's [contract](../../skills/limr-plugin-development/references/contract.md) covers custom worker registration, transferable results and windowed-view text/state contracts. Both target the public 1.3.8 declarations; update the whole Skill directory while preserving local customizations.

## Route tasks to the right Skill and reference

| Task | Skill / reference |
| --- | --- |
| First integration, components and reading policies | limr-use → integration.md, with [getting started](getting-started.md) |
| Large documents, Workers, host progress and printing | limr-use → loading.md, with [large documents](large-documents.md) |
| Adaptive tables and code defaults | limr-use → integration.md; no replacement renderer needed |
| Static images, formulas, components and source annotations | limr-use → syntax.md, with the [syntax manual](syntax.md) |
| New modules and reusable plugin packages | limr-plugin-development → contract.md and template, with [extension development](extensions.md) |

The references cover code parameters, the 256-entry view cache, HTML image dimensions, formula overflow and real Worker/package-consumer validation. Configuration tasks should use existing APIs first; reusable plugin tasks can start from the template. Example packages remain local examples, not assumed npm releases.
