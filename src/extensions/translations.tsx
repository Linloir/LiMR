import { useRef } from 'react';
import type { DocumentSnapshot, MarkdownNode } from '../core';
import { InlineMarker } from '../components/InlineMarker';
import { Collapse } from '../components/Collapse';
import { useDocument, useIsomorphicLayoutEffect, useLocale, useOwnedNodeState, useRendererParameter } from '../react/context';
import type { NodeRendererProps, RendererExtension } from '../react/types';
import { resolveTranslationMode, translationModes as modes, type TranslationMode } from './translation-mode';
import { declareNodeStateRenderer, type NodeStateOwner } from '../react/node-state-handoff';
import { translationStateIdentity } from '../react/module-state-identity';

const translationStateOwner: NodeStateOwner = { name: 'translationStateOwner', keys: { 'translation-mode': value => value === undefined || modes.includes(value as TranslationMode) }, signature: translationStateIdentity };


export type { TranslationMode } from './translation-mode';
export interface TranslationsOptions { defaultMode?: TranslationMode }
export interface TranslationBlockProps extends NodeRendererProps, TranslationsOptions {
  /** A host-controlled per-block mode takes priority over global parameters. */
  mode?: TranslationMode;
  /** Requests a controlled update, or observes a local-mode change. */
  onModeChange?: (mode: TranslationMode) => void;
}

declare module '@linloir/limr' {
  interface RendererParameters {
    /** Overrides every translations block. Undefined restores each block's local mode. */
    translationMode?: TranslationMode;
    /** Persistent per-block presentation, also used by unmounted copy/search/TOC.
     * Undefined falls back to the global, local, and source defaults. */
    translationModeForNode?: (node: MarkdownNode, document: DocumentSnapshot) => TranslationMode | undefined;
    /** Handles block switches before the global callback or local state. */
    onTranslationBlockModeChange?: (node: MarkdownNode, mode: TranslationMode, document: DocumentSnapshot) => void;
    /** Fallback for blocks without a mode in their source. */
    translationDefaultMode?: TranslationMode;
    /** Keep native selections inside each original/translated region. Defaults to true. */
    translationSelectionBoundary?: boolean;
    /** With a global mode, markers request an update through this callback. */
    onTranslationModeChange?: (mode: TranslationMode) => void;
  }
}

/** Original page, translated page, and parallel pages. All share a rounded pen. */
function TranslationIcon({ mode }: { mode: TranslationMode }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {mode === 'both' ? <><rect x="2.5" y="4" width="8" height="16" rx="2.5" /><rect x="13.5" y="4" width="8" height="16" rx="2.5" /><path d="M5 9h3M5 12h3M16 9h3M16 12h3" /></> : <><rect x="4.5" y="3" width="15" height="18" rx="3" />{mode === 'origin' ? <path d="M8.5 8h7M8.5 12h7M8.5 16h4" /> : <path d="M8 8.5h8M12 6.5v2M14.5 8.5c-.5 4-3 6.5-6.5 8M9.5 11c1.2 2.5 3.2 4.2 6.5 5.5" />}</>}
  </svg>;
}
function section(node: MarkdownNode, name: string): MarkdownNode | undefined {
  // A JSX text element can be wrapped by a Markdown paragraph.
  for (const child of node.children ?? []) {
    if (child.name === name) return child;
    if (child.type === 'paragraph') { const found = section(child, name); if (found) return found; }
  }
}

/** Rendering and interaction remain module-owned; a host may control one block
 * without capturing DOM events or rewriting the parsed node's attributes. */
export function TranslationBlock({ node, children, renderChildren, mode: controlledMode, onModeChange, defaultMode }: TranslationBlockProps) {
    const locale = useLocale();
    const snapshot = useDocument();
    const selectionBoundary = useRendererParameter('translationSelectionBoundary') !== false;
    const selectionHint = selectionBoundary ? locale.translationSelectionHint ?? 'Selections cannot cross translation paragraph boundaries.' : undefined;
    const origin = section(node, 'origin'), translation = section(node, 'translation');
    const [localMode, setLocalMode] = useOwnedNodeState<TranslationMode | undefined>(translationStateOwner, node, 'translation-mode', undefined);
    const globalMode = useRendererParameter('translationMode');
    const onGlobalChange = useRendererParameter('onTranslationModeChange');
    const modeForNode = useRendererParameter('translationModeForNode');
    const onBlockChange = useRendererParameter('onTranslationBlockModeChange');
    const configuredDefault = useRendererParameter('translationDefaultMode');
    const perNodeMode = modeForNode?.(node, snapshot);
    const requested = resolveTranslationMode(node, localMode, globalMode, controlledMode ?? perNodeMode, defaultMode ?? configuredDefault);
    // Incomplete streaming pairs still show their available content.
    const mode = !origin ? 'translation' : !translation ? 'origin' : requested;
    const next = modes[(modes.indexOf(mode) + 1) % modes.length];
    const marker = useRef<HTMLButtonElement>(null);
    const restoreFocus = useRef(false);
    const locked = controlledMode !== undefined ? !onModeChange : perNodeMode !== undefined ? !onBlockChange : globalMode !== undefined && !onBlockChange && !onGlobalChange;
    useIsomorphicLayoutEffect(() => {
      if (restoreFocus.current) { marker.current?.focus({ preventScroll: true }); restoreFocus.current = false; }
    }, [mode]);
    if (!origin && !translation) return <>{children}</>;
    const zh = locale.language?.startsWith('zh');
    const names = { origin: locale.translationOriginal ?? (zh ? '原文' : 'original'), translation: locale.translationTranslated ?? (zh ? '译文' : 'translation'), both: locale.translationBoth ?? (zh ? '对照' : 'bilingual') };
    const label = (locked ? locale.translationLockedLabel ?? (zh ? '当前{mode}，由全局展示模式控制' : 'Showing {mode}; controlled by display settings')
      : locale.translationSwitchLabel ?? (zh ? '当前{mode}，切换到{next}' : 'Showing {mode}; switch to {next}')).replaceAll('{mode}', names[mode]).replaceAll('{next}', names[next]);
    const toggle = origin && translation ? <InlineMarker ref={marker} data-translation-switch="" data-mode={mode}
      color="var(--limr-translation-accent, #6b8fb5)" disabled={locked}
      label={label}
      onClick={() => {
        restoreFocus.current = document.activeElement === marker.current;
        if (controlledMode !== undefined) onModeChange?.(next);
        else if (onBlockChange) onBlockChange(node, next, snapshot);
        else if (globalMode !== undefined) onGlobalChange?.(next);
        else { setLocalMode(next); onModeChange?.(next); }
      }}><TranslationIcon mode={mode} /></InlineMarker> : undefined;
    return <div className="limr-translations" data-mode={mode} data-limr-selection-boundary={selectionHint}>
      {translation && <Collapse open={mode !== 'origin'} keepMounted className="limr-translation-panel" ><div className="limr-translation-text" data-language="translation" data-limr-selection-boundary={selectionHint}>
        {renderChildren(translation.children ?? [], { trailing: mode === 'translation' ? toggle : undefined })}
      </div></Collapse>}
      {origin && <Collapse open={mode !== 'translation'} keepMounted className="limr-translation-panel"><div className="limr-translation-text" data-language="origin" data-limr-selection-boundary={selectionHint}>
        {renderChildren(origin.children ?? [], { trailing: mode !== 'translation' ? toggle : undefined })}
      </div></Collapse>}
    </div>;
}

export function translations(options: TranslationsOptions = {}): RendererExtension {
  const Translations = (props: NodeRendererProps) => <TranslationBlock {...props} defaultMode={options.defaultMode} />;
  declareNodeStateRenderer(translationStateOwner, Translations);
  return {
    name: 'translations', tags: ['translations', 'origin', 'translation'], directives: ['translations', 'origin', 'translation'], display: 'block', scope: 'local',
    parameters: { translationMode: undefined, onTranslationModeChange: undefined, translationModeForNode: undefined, onTranslationBlockModeChange: undefined, translationDefaultMode: options.defaultMode ?? 'origin', translationSelectionBoundary: true },
    components: { translations: Translations, origin: ({ children }) => <>{children}</>, translation: ({ children }) => <>{children}</> },
  };
}
