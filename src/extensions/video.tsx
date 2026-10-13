import { BlockLoading } from '../components/LoadingRing';
import { useEffect, useRef, useState } from 'react';
import { safeUrl } from '../core/tree';
import { useRuntime, useStoreSelector } from '../react/context';
import type { NodeRenderer, NodeRendererProps, RendererExtension } from '../react/types';
import { CopyButton } from '../components/CopyButton';
import { defineBlock } from './define';

export interface VideoOptions {
  component?: NodeRenderer;
  resolveUrl?: (provider: string, url: string) => string | undefined;
  /** Load near the viewport by default; click and eager are explicit alternatives. */
  loading?: 'visible' | 'click' | 'eager';
}
export function resolveVideo(source: string, provider = 'auto'): { url: string; native: boolean } | undefined {
  const safe = safeUrl(source);
  if (!safe) return;
  let parsed: URL;
  try { parsed = new URL(safe.startsWith('//') ? `https:${safe}` : safe); }
  catch { return provider === 'auto' || provider === 'native' ? { url: safe, native: true } : undefined; }
  if (!['https:', 'http:'].includes(parsed.protocol)) return;
  const youtube = /(?:^|\.)(?:youtube\.com|youtube-nocookie\.com)$/.test(parsed.hostname) || parsed.hostname === 'youtu.be';
  const bilibili = /(?:^|\.)bilibili\.com$/.test(parsed.hostname);
  const kind = provider === 'auto' ? youtube ? 'youtube' : bilibili ? 'bilibili' : 'native' : provider;
  if (kind === 'native') return { url: safe, native: true };
  if (kind === 'youtube' && youtube) {
    const id = parsed.hostname === 'youtu.be' ? parsed.pathname.split('/')[1] : parsed.searchParams.get('v') ?? /^\/(?:embed|shorts|live)\/([\w-]+)/.exec(parsed.pathname)?.[1];
    if (id && /^[\w-]{11}$/.test(id)) {
      const embed = new URL(`https://www.youtube.com/embed/${id}`);
      const time = parsed.searchParams.get('start') ?? parsed.searchParams.get('t');
      if (time) {
        const match = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/.exec(time);
        const seconds = match ? Number(match[1] ?? 0) * 3600 + Number(match[2] ?? 0) * 60 + Number(match[3] ?? 0) : 0;
        if (seconds > 0) embed.searchParams.set('start', String(seconds));
      }
      return { url: embed.href, native: false };
    }
  }
  if (kind === 'bilibili' && bilibili) {
    const id = /\/video\/(BV[\w]+|av\d+)(?:\/|$)/.exec(parsed.pathname)?.[1];
    const bvid = id?.startsWith('BV') ? id : parsed.hostname === 'player.bilibili.com' ? parsed.searchParams.get('bvid') : null;
    const aid = id?.startsWith('av') ? id.slice(2) : parsed.hostname === 'player.bilibili.com' ? parsed.searchParams.get('aid') : null;
    if (bvid && /^BV[\w]+$/.test(bvid) || aid && /^\d+$/.test(aid)) {
      const embed = new URL('https://player.bilibili.com/player.html');
      embed.searchParams.set(bvid ? 'bvid' : 'aid', bvid || aid!);
      embed.searchParams.set('autoplay', '0'); embed.searchParams.set('high_quality', '1'); embed.searchParams.set('danmaku', '0');
      const part = parsed.searchParams.get('p') ?? parsed.searchParams.get('page');
      if (part && /^[1-9]\d*$/.test(part)) embed.searchParams.set('page', part);
      return { url: embed.href, native: false };
    }
  }
}

export function video(options: VideoOptions = {}): RendererExtension {
  function Video({ node, source: markdown, renderAttribute }: NodeRendererProps) {
    const runtime = useRuntime();
    const scrollRoot = useStoreSelector(runtime.configuration, config => config.scrollRoot);
    const element = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [failed, setFailed] = useState(false);
    const provider = String(node.attributes?.provider ?? 'auto');
    const source = String(node.attributes?.url ?? node.attributes?.src ?? '');
    const requested = node.attributes?.loading ?? options.loading ?? 'visible';
    const loading = requested === 'click' || requested === 'eager' ? requested : 'visible';
    const resolved = options.resolveUrl?.(provider, source);
    const media = resolved && safeUrl(resolved) ? { url: safeUrl(resolved)!, native: provider === 'native' } : resolveVideo(source, provider);
    useEffect(() => { setFailed(false); setPlaying(false); }, [source, provider]);
    useEffect(() => {
      if (visible || loading !== 'visible' || !element.current) return;
      if (typeof IntersectionObserver === 'undefined') { setVisible(true); return; }
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) { setVisible(true); observer.disconnect(); }
      }, { root: scrollRoot, rootMargin: '200px' });
      observer.observe(element.current);
      return () => observer.disconnect();
    }, [visible, loading, scrollRoot]);
    const enabled = loading === 'eager' || loading === 'visible' && visible || playing;
    const title = String(node.attributes?.title ?? `${provider === 'auto' ? 'Video' : provider} video`);
    const original = safeUrl(source);
    return <div ref={element} className="limr-video" data-limr-selection-surface="" data-loading={loading}>
      <div className="limr-video-frame">
        {!media || failed ? <div className="limr-video-error"><span>{runtime.locale.unavailable}</span>{original && <a href={original} target="_blank" rel="noopener noreferrer">{source}</a>}</div>
          : enabled ? media.native ? <video controls playsInline preload="metadata" src={media.url} aria-label={title} onError={() => setFailed(true)} />
            : <iframe src={media.url} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onError={() => setFailed(true)} />
            : <button type="button" className="limr-video-play" onClick={() => setPlaying(true)} aria-label={runtime.locale.play}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7Z" fill="currentColor" /></svg></button>}
      </div>
      {node.attributes?.title && <div className="limr-video-title">{renderAttribute('title')}</div>}
      <CopyButton className="limr-video-copy" variant="glass" value={markdown} />
    </div>;
  }
  return defineBlock({ name: 'video', streaming: options.component ? undefined : { Loading: BlockLoading }, tags: ['video', 'md-video'], component: options.component ?? Video, selection: 'atomic' });
}
