import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { Markdown } from '../src/react/Markdown';
import { resolveVideo, video } from '../src/extensions/video';

describe('video providers', () => {
  it.each([
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    'https://m.youtube.com/shorts/dQw4w9WgXcQ',
    '//www.youtube.com/watch?v=dQw4w9WgXcQ',
  ])('preserves the original renderer player URL for %s', source => {
    expect(resolveVideo(source)).toEqual({ url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', native: false });
  });
  it('retains start offsets and Bilibili part selection without autoplay', () => {
    expect(resolveVideo('https://youtu.be/dQw4w9WgXcQ?t=1h2m3s')?.url).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ?start=3723');
    const bili = new URL(resolveVideo('https://www.bilibili.com/video/BV1xx411c7mD?p=2')!.url);
    expect(bili.origin + bili.pathname).toBe('https://player.bilibili.com/player.html');
    expect(Object.fromEntries(bili.searchParams)).toEqual({ bvid: 'BV1xx411c7mD', page: '2', autoplay: '0', high_quality: '1', danmaku: '0' });
    expect(new URL(resolveVideo('https://www.bilibili.com/video/av123456')!.url).searchParams.get('aid')).toBe('123456');
  });
  it('rejects executable URLs, malformed IDs and provider host spoofing', () => {
    for (const source of ['javascript:alert(1)', 'data:text/html,hello', 'mailto:a@example.com', 'https://www.youtube.com/watch?v=bad', 'https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ']) expect(resolveVideo(source, 'youtube')).toBeUndefined();
    expect(resolveVideo('/media/movie.mp4')).toEqual({ url: '/media/movie.mp4', native: true });
  });
  it('renders native media and keeps lazy third-party players out of server output', () => {
    const source = '<md-video url="https://youtu.be/dQw4w9WgXcQ" />';
    expect(renderToStaticMarkup(<Markdown source={source} extensions={[video()]} />)).not.toContain('<iframe');
    expect(renderToStaticMarkup(<Markdown source={source} extensions={[video({ loading: 'eager' })]} />)).toContain('referrerPolicy="strict-origin-when-cross-origin"');
    expect(renderToStaticMarkup(<Markdown source={'<video src="/media/movie.mp4" loading="eager" />'} extensions={[video()]} />)).toContain('<video controls="" playsInline="" preload="metadata" src="/media/movie.mp4"');
  });
});
