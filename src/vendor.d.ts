declare module 'hyphenation.en-us' {
  const patterns: { id: string; leftmin: number; rightmin: number; patterns: Record<string, string> };
  export default patterns;
}
declare module 'hypher' {
  export default class Hypher {
    constructor(patterns: unknown);
    hyphenate(word: string): string[];
  }
}
declare module 'linebreak' {
  export default class LineBreaker {
    constructor(text: string);
    nextBreak(): { position: number; required: boolean } | null;
  }
}
