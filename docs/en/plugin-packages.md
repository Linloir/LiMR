# Plugin packages

> Reading note: this page uses LiMR syntax and interactive examples. Some content cannot be fully displayed by ordinary Markdown viewers such as GitHub; visit the [GitHub Pages documentation](https://linloir.github.io/LiMR/#/docs/en/plugin-packages) for the best reading experience.

[Documentation](README.md) · [简体中文](../zh-CN/plugin-packages.md)

A plugin exports a factory returning RendererExtension. Consumers append it through plugins. One package can provide syntax, annotations, actions, and parameters, with a separate CSS export, without editing LiMR itself.

## Copyable starter

The complete [plugin-template](../../skills/limr-plugin-development/assets/plugin-template/README.md) includes TypeScript, declaration output, CSS, package.json, and tsup configuration. It demonstrates a reading-tip block, an example:note card, and a save-selection action.

After installing LiMR, run from your application:

```sh
mkdir -p packages/limr-reading-tools
cp -R node_modules/@linloir/limr/skills/limr-plugin-development/assets/plugin-template/. packages/limr-reading-tools/
cd packages/limr-reading-tools
npm install
npm run typecheck
npm run build
npm pack
```

In a source checkout, use skills/limr-plugin-development/assets/plugin-template. Replace the @example name, extension/type/action IDs, and implement your data/UI. The starter's private: true prevents accidental publication under an example name and still permits local packing.

## Package contract

| Field | Requirement |
| --- | --- |
| type | module |
| exports["."] | import points to ESM; types points to .d.ts |
| exports["./styles.css"] | Explicit export when the plugin needs CSS |
| files | Built output and usage instructions |
| sideEffects | ["**/*.css"] to retain imported styles |
| peerDependencies | @linloir/limr and react; add react-dom when directly using it |
| Build external | LiMR, React, react/jsx-runtime, and any React DOM entry used |

Bundling another copy of LiMR or React breaks shared contexts/hooks. Externalize host dependencies and avoid internal deep imports. Ship parameter declaration merging with exported types.

## Import into an application

The @example package below is the starter, not a published npm package. Install the generated local archive; use the actual filename printed by npm pack:

```sh
npm install ./packages/limr-reading-tools/example-limr-reading-tools-0.1.0.tgz
```

```tsx
import { Reader } from '@linloir/limr';
import { readingTools } from '@example/limr-reading-tools';
import '@linloir/limr/styles.css';
import '@example/limr-reading-tools/styles.css';

const plugins = [readingTools({ label: 'Reading note' })];

export function Article({ source }: { source: string }) {
  return <Reader source={source} plugins={plugins} />;
}
```

Use the real name and peer version requirements for a third-party package. Replace default modules through extensions + replaceExtension; do not register the same tag twice. Hosts still configure fonts, math CSS, persistence, and application services.

## Validate distribution

After type checking, install the actual tgz into an independent consumer. Check public imports, SSR, CSS resources, preserved defaults, and new interactions. Packages supporting React 18/19 should verify both. Syntax plugins should compare finalized streams with one-shot parsing. Interactive plugins should cover desktop sidebars, narrow overlays, keyboard behavior, cancellation, and both themes.

The repository also includes packable [reading-tools](../../examples/packages/reading-tools/index.js) and [paper-theme](../../examples/packages/paper-theme/index.css) examples. The [plugin development Skill](ai-skills.md) includes a portable template and references that do not require this repository.

## Loading and large-document compatibility

Plugins relying on 1.3.0 loading controls or windowing capabilities should declare that minimum peer version and validate workers, provisional/readOnly behavior, copy/search and offscreen state in a real package consumer. Simple examples using older APIs can retain their compatible peer range. CSS themes should also check light/dark image-preview portals and uniformly sized toolbar buttons. See [workers and windowed views](extensions.md#workers-and-windowed-views) and [large-document integration](large-documents.md).
