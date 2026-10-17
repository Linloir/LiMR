import { rm } from 'node:fs/promises';

// Both tsup targets write to dist. Clean once before either target can emit
// JavaScript or declarations; parallel target cleanup can erase sibling output.
await rm('dist', { recursive: true, force: true });
