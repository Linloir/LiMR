import { Markdown } from '../../../src/react/Markdown';
import { gfm } from '../../../src/extensions/gfm';
import type { Profile } from '../options';

const extensions = [gfm()];
export function render(source: string, streaming: boolean, profile: Profile) {
  return profile === 'default'
    ? <Markdown source={source} streaming={streaming} />
    : <Markdown source={source} streaming={streaming} extensions={extensions} streamEffect={false} interactive={false} documentId="benchmark" />;
}
export async function styles() {
  await Promise.all([import('../../../src/styles.css'), import('katex/dist/katex.min.css')]);
}
