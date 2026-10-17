import { useEffect, useState } from 'react';
import { useRuntime } from '../react/context';
import { ownsReaderInteraction, rememberReaderOwner } from '../react/reader-ownership';

/** A loading prefix cannot be printed as a complete document. The persistent
 * print-only notice also covers the browser menu, which cannot be cancelled. */
export function ProvisionalPrintGuard() {
  const runtime = useRuntime(), [shown, setShown] = useState(false);
  const chinese = runtime.locale.language?.startsWith('zh');
  const message = chinese ? '完整文档加载完成后才能打印。' : 'Finish loading the complete document before printing.';
  useEffect(() => {
    const document = runtime.content?.ownerDocument; if (!document) return;
    const claim = (event: PointerEvent) => rememberReaderOwner(runtime, event.target);
    const key = (event: KeyboardEvent) => {
      if (!event.defaultPrevented && (event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'p' && ownsReaderInteraction(runtime)) {
        event.preventDefault(); setShown(true);
      }
    };
    document.addEventListener('pointerdown', claim, true); document.addEventListener('keydown', key, true);
    return () => { document.removeEventListener('pointerdown', claim, true); document.removeEventListener('keydown', key, true); };
  }, [runtime]);
  return <>
    <p className="limr-provisional-print-notice" data-limr-ignore="true">{message}</p>
    {shown && <div className="limr-print-progress" role="status" data-limr-ignore="true"><span>{message}</span><button type="button" onClick={() => setShown(false)}>{runtime.locale.close}</button></div>}
  </>;
}
