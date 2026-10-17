import { footnoteSyntax } from './footnote-syntax';
import { useMemo } from 'react';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { rangeOf, textContent, type Annotation, type MarkdownNode, type SourceRange } from '../core';
import { useLocale } from '../react/context';
import type { AnnotationContentProps, AnnotationOverlayCardProps, AnnotationSidebarPreviewProps, AnnotationType, RendererExtension } from '../react/types';
import { AnnotationCard } from '../components/AnnotationCard';
import { ToolIcon } from '../components/ToolIcon';
import { point, sliceChildren, textTokens } from './inline-source';
import { SourceAnnotationBody } from './source-annotation-actions';

export interface FootnoteData { body: string; title?: string }
function Icon() { return <ToolIcon name="comment" />; }
function Content(props: AnnotationContentProps<FootnoteData>) { return <>{props.presentation === 'sidebar' && props.data?.title && <small className="limr-footnote-title">{props.data.title}</small>}<SourceAnnotationBody {...props} /></>; }
function Card(props: AnnotationOverlayCardProps<FootnoteData>) { const label = useLocale().footnotes; return <AnnotationCard {...props} title={props.annotation.data?.title ? `${label} · ${props.annotation.data.title}` : label} />; }
function Preview({ data }: AnnotationSidebarPreviewProps<FootnoteData>) {
  const summary = useMemo(() => textContent(fromMarkdown(data?.body ?? '') as unknown as MarkdownNode).replace(/\s+/g, ' ').trim(), [data?.body]);
  const text = [data?.title, summary].filter(Boolean).join(' · ');
  return text ? <span title={text}>{text}</span> : null;
}

/** GFM definitions keep their AST identity for incremental parsing, but their
 * references use the same marker/sidebar/overlay contract as other modules. */
export function footnotes(options: Partial<AnnotationType<FootnoteData>> = {}): RendererExtension {
  const type = options.type ?? 'footnote';
  return {
    ...footnoteSyntax(type),
    annotationTypes: [{ type, label: locale => locale.footnotes, icon: Icon, color: '#6B9BD2', highlight: 'hover', Content, ...options,
      sidebar: { Preview, collapseOnContentClick: false, ...options.sidebar }, overlay: { Card, expand: false, ...options.overlay } }],
  };
}
