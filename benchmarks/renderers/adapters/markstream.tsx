import MarkdownRender from 'markstream-react';
import { fullDOMOptions, type Profile } from '../options';

export function render(source: string, streaming: boolean, profile: Profile) {
  return profile === 'default'
    ? <MarkdownRender content={source} final={!streaming} />
    : <MarkdownRender content={source} final={!streaming} {...fullDOMOptions} />;
}
export async function styles() {
  await Promise.all([import('markstream-react/index.css'), import('katex/dist/katex.min.css')]);
}
