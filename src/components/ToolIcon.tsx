import type { SVGProps } from 'react';

export type ToolIconName = 'eye' | 'eye-off' | 'question' | 'highlight' | 'edit' | 'close' | 'copy' | 'expand' | 'background' | 'underline' | 'dotted' | 'wavy' | 'chevron' | 'check' | 'trash' | 'note' | 'footnote' | 'comment' | 'sparkles' | 'zoom-in' | 'zoom-out' | 'source' | 'image' | 'image-error' | 'regex' | 'match-case' | 'search-up' | 'search-down';

/** A shared optical grid for the built-in tools and example plugins. */
export function ToolIcon({ name, ...props }: SVGProps<SVGSVGElement> & { name: ToolIconName }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <g transform={name === 'highlight' ? 'translate(0 -1.25)' : name === 'comment' ? 'translate(0 -.5)' : undefined}>
    {(name === 'eye' || name === 'eye-off') && <><path d="M3 12s3.3-6 9-6 9 6 9 6-3.3 6-9 6-9-6-9-6Z" /><circle cx="12" cy="12" r="2.7" />{name === 'eye-off' && <path d="m4 4 16 16" />}</>}
    {name === 'question' && <><circle cx="12" cy="12" r="8.5" /><path d="M9.4 9a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2-2.6 3.7M12 17h.01" /></>}
    {name === 'highlight' && <><path d="m8 15 7.6-9a2 2 0 0 1 2.8-.2l.8.7a2 2 0 0 1 .2 2.8L12 18l-4-3Z" /><path d="m8 15-2 3 3 1 3-1M4 21h10M14 8l4 3.5" /></>}
    {name === 'edit' && <><path d="m14.5 5.5 4 4M4.5 19.5l4.5-1 11-11a2.1 2.1 0 0 0 0-3 2.1 2.1 0 0 0-3 0l-11 11-1.5 4Z" /></>}
    {name === 'close' && <path d="m6 6 12 12M18 6 6 18" />}
    {name === 'regex' && <><circle cx="5.5" cy="17.5" r="1.4" fill="currentColor" stroke="none" /><path d="M16 4v12m-5.2-9 10.4 6m-10.4 0 10.4-6" /></>}
    {name === 'match-case' && <><path d="m2.5 18 5-12 5 12M4 14h7m5-3c5-2 5 1 5 3v4m0-5c-6-1-7 6-1 4" /></>}
    {name === 'search-up' && <path d="m6 15 6-6 6 6" strokeWidth="2" />}
    {name === 'search-down' && <path d="m6 9 6 6 6-6" strokeWidth="2" />}
    {name === 'copy' && <><rect x="8.5" y="8" width="10.5" height="12" rx="3" /><path d="M15.5 8V6.8A2.8 2.8 0 0 0 12.7 4H7A3 3 0 0 0 4 7v6a3 3 0 0 0 3 3h1.5" /></>}
    {name === 'expand' && <path d="M15 4h5v5m0-5-6.5 6.5M9 20H4v-5m0 5 6.5-6.5" />}
    {(name === 'zoom-in' || name === 'zoom-out') && <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m15.4 15.4 4.6 4.6M7.5 10.5h6" />{name === 'zoom-in' && <path d="M10.5 7.5v6" />}</>}
    {name === 'source' && <><path d="m7 7-4 5 4 5m10-10 4 5-4 5m-4-13-2 16" /></>}
    {name === 'image' && <><rect x="3.5" y="4.5" width="17" height="15" rx="3.5" /><circle cx="15.5" cy="9" r="1.5" /><path d="m4 16 4.4-4.4a1.5 1.5 0 0 1 2.2 0L17 19m-3-3 1.4-1.4a1.5 1.5 0 0 1 2.2 0L20 17" /></>}
    {name === 'image-error' && <><path d="M11 19.5H7A3.5 3.5 0 0 1 3.5 16V8A3.5 3.5 0 0 1 7 4.5h10A3.5 3.5 0 0 1 20.5 8v3M4 16l4.1-4.1a1.6 1.6 0 0 1 2.3 0l1.6 1.6" /><circle cx="15.5" cy="9" r="1.4" /><circle cx="17.5" cy="17.5" r="4" /><path d="m16.2 16.2 2.6 2.6m0-2.6-2.6 2.6" /></>}
    {['background', 'underline', 'dotted', 'wavy'].includes(name) && <>
      {name === 'background' && <rect x="3" y="3" width="18" height="18" rx="5" fill="currentColor" fillOpacity=".13" stroke="none" />}
      <path d="m8 15 3-8a1.05 1.05 0 0 1 2 0l3 8M9.2 12h5.6" />
      {name === 'background' && <path d="M7 19h10" strokeWidth="2.5" />}
      {name === 'underline' && <path d="M5 20h14" />}
      {name === 'dotted' && <path d="M5 20h14" strokeDasharray=".1 3.4" strokeWidth="2.4" />}
      {name === 'wavy' && <path d="M4 20c1.3-2 2.7-2 4 0s2.7 2 4 0 2.7-2 4 0 2.7 2 4 0" />}
    </>}
    {name === 'chevron' && <path d="m8 10 4 4 4-4" />}
    {name === 'check' && <path d="m5.5 12 4.2 4.2 8.8-9" />}
    {name === 'trash' && <><path d="M4.5 7h15M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M7 7l.7 12a2 2 0 0 0 2 2h4.6a2 2 0 0 0 2-2L17 7M10 11v6M14 11v6" /></>}
    {name === 'note' && <><path d="M14 3H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V9l-6-6Z" /><path d="M14 3v4a2 2 0 0 0 2 2h4M8 13h8M8 17h5" /></>}
    {name === 'comment' && <><path d="M8 19 4 21V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H8Z" /><path d="M8 9h8M8 13h5" /></>}
    {name === 'footnote' && <><path d="M5 7h9M5 11h12M5 15h8M5 20h14M18 4h2v5" /><path d="M17.5 9h4" /></>}
    {name === 'sparkles' && <><path d="m10.5 4 1.8 4.8 4.7 1.7-4.7 1.8-1.8 4.7-1.7-4.7L4 10.5l4.8-1.7L10.5 4Z" /><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15ZM19 3v4M17 5h4" /></>}
    </g>
  </svg>;
}
