/** Complete, uniquely numbered sections with a dense four-note region followed
 * by ordinary prose. Repeated prose is synthetic, not an authored large book. */
export function sidebarCorpus(mib: number) {
  const prose = '夕阳落在山间，河水从村庄旁缓缓流过。远处的旅人沿着小路走来，手中带着一本旧书。书中记载了许多故事，人们在灯下阅读，又在清晨开始新的生活。'.repeat(10);
  const sections = [], starts = [];
  let bytes = 0, length = 0;
  for (let i = 0; bytes < mib * 1024 * 1024; i++) {
    starts.push(length);
    const section = `# Section ${i}\n\nBefore ::%%limr%%{<#r${i}}**Shared reference ${i}**::%%limr%%{>#r${i}} after.\n\n`
      + Array.from({ length: 4 }, (_, n) => `:::limr-annotation{#n${i}-${n} ranges="r${i}" type="footnote"}\nNote ${i}-${n}. ${'This explanation expands the card while retaining its reference. '.repeat(4)}\n:::\n\n`).join('')
      + Array.from({ length: 32 }, (_, p) => `Paragraph ${i}-${p}. ${prose}\n\n`).join('');
    sections.push(section); bytes += Buffer.byteLength(section); length += section.length;
  }
  const source = sections.join('') + '# Final chapter\n\nSIDEBAR-COMPLETE-BOOK-END\n';
  return { source, bytes: Buffer.byteLength(source), starts, annotations: sections.length * 4 };
}
