# LiMR reading-tools starter / 插件模板

Copy this entire folder into your project, rename the example package/extension/type/action IDs, and adapt the implementation. It requires LiMR 1.2.1. The @example package is not on npm. private: true permits local packing while preventing accidental publication under the sample name.

复制完整目录到项目，替换示例包名和各 ID。模板需要 LiMR 1.2.1，可安装 npm 包或本地构建的 LiMR tgz。

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

Supports <reading-tip title="Tip"> with Markdown inside, plus a selection action creating an example:note annotation with original-source anchors and the selected text as its saved content. Editable records expose a right-aligned single-annotation delete button. English/Chinese labels follow the reader locale; options.label explicitly overrides both. User note text is never translated. The plugin includes no service connection or storage.

Persist annotations in the host with annotations/onAnnotationsChange, passing each accepted array back through the annotations prop. Only a synchronous false return rejects a change; other callback results, including Promises, are ignored.

When adding an editor, create drafts with addAnnotation(annotation, { edit: true }). Save with an accepted updateAnnotation followed by commitAnnotationEdit(id). Reset the module draft before cancelAnnotationEdit(id), restoring it if cancellation returns false. Cancel an untouched empty draft when focus leaves the editor or its annotation becomes inactive. The runtime removes a newly created annotation and only its otherwise unused generated highlights; an existing annotation survives. Keep deletion separate from cancellation.

如需添加编辑器，以 `{ edit: true }` 创建草稿；更新被接受后调用 `commitAnnotationEdit(id)`。显式取消或空白草稿离开编辑时调用 `cancelAnnotationEdit(id)`，取消被拒绝则保留草稿和编辑状态。运行时按创建记录判断是否删除，不以正文为空判断新旧；已有注释和其他注释使用的高亮会保留。

Test the actual archive in each supported React major, SSR, desktop/mobile cards, and both locales before claiming compatibility. Keep React and LiMR external and declare them as peers. The CSS import is explicit.
