import { createElement as h } from 'react';
import { AnnotationCard, AnnotationMarkdown, defineBlock, defineExtension } from 'limr';

// No renderer internals or application services are needed by an npm plugin.
export function readingTools() {
  const tip = defineBlock({ name: 'reading-tip', component: ({ children }) => h('aside', { className: 'reading-tip' }, children) });
  return defineExtension({
    ...tip,
    name: 'reading-tools',
    annotationTypes: [{
      type: 'reading-note', label: 'Reading note', icon: '◇', color: '#548b74',
      overlay: { Card: props => h(AnnotationCard, { ...props, title: 'Reading note' }), expand: { placement: 'anchor' } },
      Content: ({ data }) => h(AnnotationMarkdown, { source: data?.text ?? '' }),
    }],
    actions: [{
      id: 'reading-note:add', label: 'Save passage', icon: h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('rect', { x: 5, y: 3, width: 14, height: 18, rx: 3 }), h('path', { d: 'M9 8h6M9 12h6M9 16h4' })),
      run(context) {
        const id = `reading-note-${crypto.randomUUID()}`;
        context.addAnnotation({ id, type: 'reading-note', range: context.selection.syntax.ranges[0], data: { text: `**Saved passage**\n\n${context.selection.text}` } });
        context.activateAnnotation(id);
        context.clearSelection();
      },
    }],
  });
}
