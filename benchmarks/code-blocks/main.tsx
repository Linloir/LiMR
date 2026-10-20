import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { Reader, type RendererParameters } from '../../src';
import '../../src/styles.css';

const root = createRoot(document.getElementById('root')!);
document.body.style.cssText = 'margin:0;padding:24px;max-width:780px;margin-inline:auto';
(window as any).benchCode = (source: string, parameters?: RendererParameters) => flushSync(() =>
  root.render(<Reader source={source} parameters={parameters} toc={false} sidebar={false} typography="standard" />));
