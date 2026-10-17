import type { SyntaxExtension } from './types';

/** An explicit contract between the host extension and a worker registry. */
export interface WorkerExtensionDescriptor { id: string; options?: unknown }
export type WorkerExtensionRegistry = Readonly<Record<string, (options: unknown) => SyntaxExtension>>;
const entries = new WeakMap<SyntaxExtension, { descriptor: WorkerExtensionDescriptor; signature: readonly unknown[] }>();
const keys = ['name', 'micromark', 'mdast', 'tags', 'directives', 'literal', 'selection', 'preprocess', 'transform', 'display', 'scope'] as const;
/** View-only modules have nothing to execute or serialize in the parser. */
export function hasDocumentSyntax(extension: SyntaxExtension): boolean {
  // Scope describes how parser hooks behave; it does not supply syntax itself.
  // Keep it in registration signatures so changing a real hook's scope still
  // invalidates that hook's worker contract.
  return keys.some(key => key !== 'name' && key !== 'scope' && extension[key] !== undefined);
}
function signature(extension: SyntaxExtension): readonly unknown[] {
  const result: unknown[] = [], seen = new Set<object>();
  const visit = (value: unknown) => {
    if (value && (typeof value === 'object' || typeof value === 'function')) {
      result.push(value);
      if (seen.has(value)) return;
      seen.add(value);
      for (const key of Object.keys(value).sort()) { result.push(key); visit((value as Record<string, unknown>)[key]); }
      result.push(null);
    } else result.push(value);
  };
  for (const key of keys) visit(extension[key]);
  return result;
}
/** Register only after the worker factory implements this exact syntax. View
 * components and callbacks stay in the host; parse hooks are never cloned. */
export function registerWorkerExtension<T extends SyntaxExtension>(extension: T, descriptor: WorkerExtensionDescriptor): T {
  const cloned = structuredClone(descriptor);
  entries.set(extension, { descriptor: cloned, signature: signature(extension) });
  return extension;
}
export function workerExtensionDescriptor(extension: SyntaxExtension): WorkerExtensionDescriptor | undefined {
  const entry = entries.get(extension);
  if (!entry) return;
  const current = signature(extension);
  if (current.length !== entry.signature.length || current.some((value, index) => value !== entry.signature[index])) return;
  return structuredClone(entry.descriptor);
}
export function resolveWorkerExtensions(descriptors: readonly WorkerExtensionDescriptor[], registry: WorkerExtensionRegistry): SyntaxExtension[] {
  return descriptors.map(({ id, options }) => {
    const factory = Object.hasOwn(registry, id) ? registry[id] : undefined;
    if (!factory) throw new Error(`No worker syntax factory registered for ${id}.`);
    return factory(options);
  });
}
