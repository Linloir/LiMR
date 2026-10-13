# LiMR reading-tools starter / 插件模板

Copy this entire folder into your project, rename the example package/extension/type/action IDs, and adapt the implementation. It requires LiMR 1.0.0 for useLocale and localized annotation labels. The @example package is not on npm. private: true permits local packing while preventing accidental publication under the sample name.

复制完整目录到项目，替换示例包名和各 ID。模板需要 LiMR 1.0.0 的语言接口；未发布版本可先安装维护者提供的本地 LiMR tgz。

```sh
npm install
npm run typecheck
npm run build
npm pack
```

Install the generated tgz in a separate host application, then:

```tsx
import { Reader, chinese } from '@linloir/limr';
import { readingTools } from '@example/limr-reading-tools';
import '@linloir/limr/styles.css';
import '@example/limr-reading-tools/styles.css';

const plugins = [readingTools()];
export function Article({ source }: { source: string }) {
  return <Reader source={source} plugins={plugins} locale={chinese} />;
}
```

Supports <reading-tip title="Tip"> with Markdown inside, plus a selection action creating an example:note annotation with original-source anchors. English/Chinese labels follow the reader locale; options.label explicitly overrides both. User note text is never translated. Persist annotations in the host with annotations/onAnnotationsChange. The plugin includes no service connection or storage.

Test the actual archive in each supported React major, SSR, desktop/mobile cards, and both locales before claiming compatibility. Keep React and LiMR external and declare them as peers. The CSS import is explicit.
