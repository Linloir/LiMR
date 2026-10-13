import { useRef, useState } from 'react';
import type { MarkdownNode } from '../core';
import { InlineMarker } from '../components/InlineMarker';
import { Collapse } from '../components/Collapse';
import { useIsomorphicLayoutEffect, useRendererParameter } from '../react/context';
import type { NodeRendererProps, RendererExtension } from '../react/types';

export type TranslationMode = 'origin' | 'translation' | 'both';
export interface TranslationsOptions { defaultMode?: TranslationMode }

declare module '@linloir/limr' {
  interface RendererParameters {
    /** Overrides every translations block. Undefined restores each block's local mode. */
    translationMode?: TranslationMode;
    /** With a global mode, markers request an update through this callback. */
    onTranslationModeChange?: (mode: TranslationMode) => void;
  }
}

const modes: readonly TranslationMode[] = ['origin', 'translation', 'both'];
const names = { origin: '原文', translation: '译文', both: '对照' };
/** Original page, translated page, and parallel pages. All share a rounded pen. */
function TranslationIcon({ mode }: { mode: TranslationMode }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {mode === 'both' ? <><rect x="2.5" y="4" width="8" height="16" rx="2.5" /><rect x="13.5" y="4" width="8" height="16" rx="2.5" /><path d="M5 9h3M5 12h3M16 9h3M16 12h3" /></> : <><rect x="4.5" y="3" width="15" height="18" rx="3" />{mode === 'origin' ? <path d="M8.5 8h7M8.5 12h7M8.5 16h4" /> : <path d="M8 8.5h8M12 6.5v2M14.5 8.5c-.5 4-3 6.5-6.5 8M9.5 11c1.2 2.5 3.2 4.2 6.5 5.5" />}</>}
  </svg>;
}
function modeOf(value: unknown, fallback: TranslationMode): TranslationMode {
  return modes.includes(value as TranslationMode) ? value as TranslationMode : fallback;
}
function section(node: MarkdownNode, name: string): MarkdownNode | undefined {
  // A JSX text element can be wrapped by a Markdown paragraph.
  for (const child of node.children ?? []) {
    if (child.name === name) return child;
    if (child.type === 'paragraph') { const found = section(child, name); if (found) return found; }
  }
}

export function translations(options: TranslationsOptions = {}): RendererExtension {
  function Translations({ node, children, renderChildren }: NodeRendererProps) {
    const origin = section(node, 'origin'), translation = section(node, 'translation');
    const [localMode, setLocalMode] = useState<TranslationMode | undefined>();
    const globalMode = useRendererParameter('translationMode');
    const onGlobalChange = useRendererParameter('onTranslationModeChange');
    const requested = modeOf(globalMode ?? localMode ?? node.attributes?.default, options.defaultMode ?? 'origin');
    // Incomplete streaming pairs still show their available content.
    const mode = !origin ? 'translation' : !translation ? 'origin' : requested;
    const next = modes[(modes.indexOf(mode) + 1) % modes.length];
    const marker = useRef<HTMLButtonElement>(null);
    const restoreFocus = useRef(false);
    const locked = globalMode !== undefined && !onGlobalChange;
    useIsomorphicLayoutEffect(() => {
      if (restoreFocus.current) { marker.current?.focus({ preventScroll: true }); restoreFocus.current = false; }
    }, [mode]);
    if (!origin && !translation) return <>{children}</>;
    const toggle = origin && translation ? <InlineMarker ref={marker} data-translation-switch="" data-mode={mode}
      color="var(--limr-translation-accent, #6b8fb5)" disabled={locked}
      label={locked ? `当前${names[mode]}，由全局展示模式控制` : `当前${names[mode]}，切换到${names[next]}`}
      onClick={() => {
        restoreFocus.current = document.activeElement === marker.current;
        if (globalMode !== undefined) onGlobalChange?.(next);
        else setLocalMode(next);
      }}><TranslationIcon mode={mode} /></InlineMarker> : undefined;
    return <div className="limr-translations" data-mode={mode}>
      {translation && <Collapse open={mode !== 'origin'} keepMounted className="limr-translation-panel" ><div className="limr-translation-text" data-language="translation">
        {renderChildren(translation.children ?? [], { trailing: mode === 'translation' ? toggle : undefined })}
      </div></Collapse>}
      {origin && <Collapse open={mode !== 'translation'} keepMounted className="limr-translation-panel"><div className="limr-translation-text" data-language="origin">
        {renderChildren(origin.children ?? [], { trailing: mode !== 'translation' ? toggle : undefined })}
      </div></Collapse>}
    </div>;
  }
  return {
    name: 'translations', tags: ['translations', 'origin', 'translation'], directives: ['translations', 'origin', 'translation'], display: 'block', scope: 'local',
    parameters: { translationMode: undefined, onTranslationModeChange: undefined },
    components: { translations: Translations, origin: ({ children }) => <>{children}</>, translation: ({ children }) => <>{children}</> },
  };
}
