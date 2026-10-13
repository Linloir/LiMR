import { fixture } from '../shared/fixture';

export const cases = [
  { id: 'static-small', source: fixture(20) },
  { id: 'static-medium', source: fixture(200) },
  { id: 'static-large', source: fixture(2000) },
  { id: 'stream-mixed', source: fixture(80), chunkSize: 256 },
  { id: 'stream-code', source: '```typescript\n' + Array.from({ length: 600 }, (_, i) => `const item${i} = { id: ${i}, label: "Streaming code ${i}" };\n`).join('') + '```\n', chunkSize: 256 },
  { id: 'stream-table', source: '| Name | Value | Description |\n| --- | ---: | --- |\n' + Array.from({ length: 600 }, (_, i) => `| Item ${i} | ${i} | Streaming table row number ${i} |\n`).join(''), chunkSize: 256 },
  { id: 'stream-paragraph', source: 'A single growing paragraph with **bold**, *emphasis* and `code`. '.repeat(500), chunkSize: 256 },
] as const;

// Original synthetic content. Each section has unique code and math so resource
// caches cannot turn a long heterogeneous document into one repeated block.
export function richFixture(sections = 240) {
  return '# Long technical reading session\n\n' + Array.from({ length: sections }, (_, i) => {
    const code = i % 3 === 0
      ? ['typescript', `export function section${i}(items: number[]) {\n  const factor = ${i + 1};\n` + Array.from({ length: 22 }, (_, j) => `  const value${j} = items.map(item => item * factor + ${j});`).join('\n') + '\n  return items.filter(item => item > factor);\n}']
      : i % 3 === 1
        ? ['python', `def section_${i}(items):\n    factor = ${i + 1}\n` + Array.from({ length: 22 }, (_, j) => `    value_${j} = [item * factor + ${j} for item in items]`).join('\n') + '\n    return [item for item in items if item > factor]']
        : ['json', JSON.stringify({ section: i + 1, values: Array.from({ length: 20 }, (_, j) => ({ id: j, name: `Entry ${i}-${j}`, enabled: j % 2 === 0 })) }, null, 2)];
    return `## Reading section ${i + 1}\n\n` +
      `This section combines **formatted prose**, *emphasis*, [a reference](https://example.com/section/${i}), and inline code \`value${i}\`. The model uses $x_{${i}}^2 + y^2 = ${i + 1}$ to explain its result.\n\n` +
      `$$\n\\sum_{k=1}^{${i + 2}} k^2 = \\frac{${i + 2}(${i + 3})(${2 * i + 5})}{6}\n$$\n\n` +
      '```' + code[0] + '\n' + code[1] + '\n```\n\n' +
      ('Reading should remain responsive while code, equations, and images become visible. Completed content should remain stable during browsing. '.repeat(8)) + '\n\n' +
      '> A quoted explanation with **important details** and an ordinary link to [the specification](https://example.com/spec).\n\n' +
      '- [x] Parse the document\n- [ ] Inspect the result\n  - Review code\n  - Check equations\n\n' +
      '| Name | Value | Status |\n| --- | ---: | --- |\n' + Array.from({ length: 12 }, (_, j) => `| Entry ${i}-${j} | ${i + j} | ${j % 2 ? 'ready' : 'pending'} |\n`).join('') + '\n' +
      (i % 8 === 0 ? `![Local architecture diagram ${i}](/diagram.svg)\n\n` : '') +
      `Section ${i + 1} ends here.\n\n`;
  }).join('') + '\nEND-OF-RICH-DOCUMENT\n';
}
