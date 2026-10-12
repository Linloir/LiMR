export function fixture(count: number) {
  return Array.from({ length: count }, (_, i) => `## Section ${i + 1}\n\nA paragraph with **strong**, *emphasis*, [a link](https://example.com) and \`code\`. ${'Long documents should stay readable and interactive. '.repeat(5)}\n\n- Item one\n- Item two\n\n| Name | Value |\n| --- | ---: |\n| Alpha | ${i} |\n`).join('\n');
}
